# Phase 2 — RLS smoke-test notes

Goal (from instruction/setup.md): migrations apply cleanly to a fresh Supabase
project **and** an anon key cannot read `guide_documents` or another user's
bookings.

Run the snippets below in the Supabase Dashboard → SQL Editor (as `postgres`).
Each snippet lists the expected result. `set role` / `set_config` are
session-scoped (the SQL editor runs statements in separate transactions, so
`set local` would not stick) — end each block with `reset role;`.

## 0. Apply migrations

```bash
npx supabase@latest link      # project ref + access token (once)
npx supabase@latest db push   # applies supabase/migrations/*.sql
npx supabase@latest db reset  # fresh DB + all migrations (clean-room check)
npm run db:types              # regenerates lib/database.types.ts
```

`db reset` on a fresh project is the "applies cleanly to a fresh Supabase
project" check: it must finish with no failed migrations.

## 1. Seed fixture data (service role bypasses RLS)

```sql
-- 2 auth.users rows, profiles, guide, listing, booking, document
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-0000-0000-000000000001', 'guide@example.com', 'x', now()),
  ('00000000-0000-0000-0000-000000000002', 'traveler@example.com', 'x', now());

insert into public.profiles (id, role, full_name) values
  ('00000000-0000-0000-0000-000000000001', 'guide', 'Guide One'),
  ('00000000-0000-0000-0000-000000000002', 'traveler', 'Traveler One');

insert into public.guides (profile_id, headline, verification_status, is_published)
values ('00000000-0000-0000-0000-000000000001', 'Licensed trek guide', 'verified', true);

insert into public.guide_documents (guide_id, kind, storage_path, status)
select id, 'ntb_license', 'guide-docs/00000000-0000-0000-0000-000000000001/license.pdf', 'verified'
from public.guides;

insert into public.listings (guide_id, title, slug, service_kind, price_paisa, is_active)
select id, 'Everest Base Camp', 'ebc-14d', 'trek_guide', 150000, true
from public.guides;

insert into public.bookings (code, traveler_id, guide_id, listing_id, start_date, end_date, party_size, total_paisa, status)
select 'SL-TEST01', '00000000-0000-0000-0000-000000000002', g.id, l.id, '2026-10-01', '2026-10-15', 2, 300000, 'completed'
from public.guides g join public.listings l on l.guide_id = g.id;
```

## 2. Anon key cannot read private data (the "Done when" check)

```sql
set role anon;
select count(*) from public.guide_documents;  -- EXPECT: 0 rows returned
select count(*) from public.bookings;         -- EXPECT: 0 rows
select count(*) from public.payments;         -- EXPECT: 0 rows
select count(*) from public.messages;         -- EXPECT: 0 rows
select count(*) from public.safety_reports;   -- EXPECT: 0 rows
reset role;
```

## 3. Anon key can read only what is public

```sql
set role anon;
select id, full_name from public.profiles;    -- EXPECT: 2 rows
select phone from public.profiles;            -- EXPECT: ERROR (column not granted to anon)
select count(*) from public.guides;           -- EXPECT: 1 (published + verified)
select count(*) from public.listings;         -- EXPECT: 1 (active, guide published)
select count(*) from public.reviews;          -- EXPECT: 0 (none seeded; select allowed)
select count(*) from public.regions;          -- EXPECT: 0 (empty, select allowed)
reset role;
```

Note: a guide with `verification_status = 'pending'` or `is_published = false`
must be invisible to anon — flip it and re-check to prove the filter.

## 4. Authenticated user cannot read another user's bookings

`auth.uid()` reads `request.jwt.claims`; simulate the claim session-wide:

```sql
-- as TRAVELER (sub ...002)
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-000000000002", "role": "authenticated"}', false);
set role authenticated;
select count(*) from public.bookings;              -- EXPECT: 1 (own booking)
select count(*) from public.guide_documents;       -- EXPECT: 0 (not the document owner)
reset role;
```

```sql
-- as GUIDE (sub ...001)
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}', false);
set role authenticated;
select count(*) from public.bookings;              -- EXPECT: 1 (is the guide's profile owner)
select count(*) from public.guide_documents;       -- EXPECT: 1 (own documents)
reset role;
```

## 5. Reviews: insert only by the traveler of a completed booking

```sql
-- traveler ...002, booking status 'completed'
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-000000000002", "role": "authenticated"}', false);
set role authenticated;
insert into public.reviews (booking_id, guide_id, traveler_id, rating, body)
select b.id, b.guide_id, b.traveler_id, 5, 'Great trip'
from public.bookings b where b.code = 'SL-TEST01';  -- EXPECT: 1 row inserted
reset role;

-- trust_score recalculated by trigger:
--   10 (1 verified doc) + 35 (avg 5 × 7) + 15 (1 completed booking) + 0 (response_hours null) = 60
select id, trust_score from public.guides;  -- EXPECT: trust_score = 60
```

```sql
-- same traveler, booking NOT completed -> rejected
update public.bookings set status = 'inquiry' where code = 'SL-TEST01';
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-000000000002", "role": "authenticated"}', false);
set role authenticated;
insert into public.reviews (booking_id, guide_id, traveler_id, rating, body)
select b.id, b.guide_id, b.traveler_id, 1, 'Nope'
from public.bookings b where b.code = 'SL-TEST01';
-- EXPECT: 0 rows inserted (RLS with-check rejects)
reset role;
```

## 6. Admin sees everything

```sql
insert into public.profiles (id, role) values
  ('00000000-0000-0000-0000-000000000003', 'admin');
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-0000-0000-000000000003", "role": "authenticated"}', false);
set role authenticated;
select count(*) from public.safety_reports;  -- EXPECT: allowed (0 rows, none seeded)
select count(*) from public.guide_documents; -- EXPECT: allowed (1 row)
select count(*) from public.payments;        -- EXPECT: allowed (0 rows, none seeded)
reset role;
```

## Notes / assumptions

- The app connects with the service connection (`DATABASE_URL`), which bypasses
  RLS. RLS is the public/PostgREST boundary; in-app authorization stays in
  server actions (Phase 4+).
- `profiles.id` references `auth.users.id` per spec. Better Auth stores its own
  `user` table, so the profile ↔ Better-Auth-user sync belongs to the auth
  integration phase, not this migration.
- `availability` and `regions` are public-read by design (booking flow needs
  dates; regions are reference data).
- Trust score = docs (10×verified, cap 40) + reviews (avg×7, cap 35) + completed
  bookings (cap 15) + response speed (10 at ≤24 h → 0 at ≥168 h).
