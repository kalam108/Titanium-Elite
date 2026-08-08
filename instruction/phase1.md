Phase 2 — Supabase Schema & RLS
Goal: Full database, typed, secured.

Create migrations in supabase/migrations/. Use snake_case, uuid PKs defaulting to gen_random_uuid().

Enums
sql
create type user_role as enum ('traveler','guide','admin');
create type service_kind as enum ('trek_guide','city_guide','porter','homestay');
create type verification_status as enum ('unverified','pending','verified','rejected','expired');
create type document_kind as enum ('citizenship','passport','ntb_license','taan_license','first_aid','insurance','photo');
create type booking_status as enum ('inquiry','pending_payment','confirmed','in_progress','completed','cancelled','disputed');
create type payout_status as enum ('held','released','refunded');
Tables
Table	Key columns
profiles	id uuid pk refs auth.users, role user_role default 'traveler', full_name, avatar_url, phone, country, locale default 'en', created_at
guides	id uuid pk, profile_id uuid unique refs profiles, headline, bio text, years_experience int, languages text[], regions text[], service_kinds service_kind[], base_rate_paisa bigint, currency default 'NPR', max_group_size int, verification_status, verified_at timestamptz, trust_score int default 0, response_hours numeric, is_published bool default false
guide_documents	id, guide_id refs guides on delete cascade, kind document_kind, storage_path, issuer, document_number, issued_on date, expires_on date, status verification_status, reviewed_by uuid, reviewed_at, rejection_reason
listings	id, guide_id, title, slug unique, summary, description, service_kind, region, duration_days int, difficulty smallint (1-5), max_altitude_m int, price_paisa bigint, price_unit text ('per_day'\|'per_trip'\|'per_person'), includes text[], excludes text[], cover_image_url, gallery text[], is_active bool
availability	id, guide_id, date date, is_available bool, unique (guide_id, date)
bookings	id, code text unique (e.g. SL-8F3K2A), traveler_id refs profiles, guide_id refs guides, listing_id refs listings, start_date, end_date, party_size int, total_paisa bigint, platform_fee_paisa bigint, status booking_status, traveler_note, guide_note, cancelled_reason, created_at
payments	id, booking_id, provider text default 'mock', provider_ref, amount_paisa, status payout_status, escrow_release_at timestamptz
reviews	id, booking_id unique refs bookings, guide_id, traveler_id, rating smallint (1-5), safety_rating smallint, knowledge_rating smallint, communication_rating smallint, body text, guide_reply text, created_at
messages	id, booking_id, sender_id, body, read_at, created_at
safety_reports	id, reporter_id, guide_id, booking_id nullable, category, body, status text default 'open'
regions	slug pk, name, district, province, permit_required bool, permit_notes, best_months int[], hero_image_url
Indexes
guides(verification_status, is_published), listings(region, service_kind, is_active), bookings(traveler_id), bookings(guide_id, status), availability(guide_id, date), GIN on guides.languages, guides.regions.

Trust score function
sql
-- verified docs (0-40) + reviews avg (0-35) + completed bookings (0-15) + response speed (0-10)
create function recalc_trust_score(g uuid) returns int ...
Trigger recalculation on insert/update of guide_documents, reviews, and bookings reaching completed.

RLS policies (enable on every table)
profiles: select own + public read of full_name, avatar_url; update own.

guides: public select where is_published and verification_status = 'verified'; owner full access; admin full access.

guide_documents: owner + admin only. Never public. Storage bucket guide-docs is private with signed URLs.

listings: public select where is_active and parent guide published; owner write.

bookings / messages / payments: visible only to the traveler, the guide's profile owner, or admin.

reviews: public select; insert only by the traveler of a completed booking (enforce in policy with an EXISTS check).

safety_reports: insert by any authed user; select admin only.

Deliverables: migration SQL, pnpm db:types script generating src/lib/database.types.ts, RLS smoke-test notes.

Done when: migrations apply cleanly to a fresh Supabase project and an anon key cannot read guide_documents or another user's bookings.