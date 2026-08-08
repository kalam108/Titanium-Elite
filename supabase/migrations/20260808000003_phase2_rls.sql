-- Phase 2 — Row Level Security + grants + storage bucket
--
-- Model: profiles.id = auth.users.id, so policies use auth.uid() directly.
-- The app (Better Auth) connects with the service connection which bypasses RLS;
-- RLS protects the data from anon/authenticated (PostgREST / raw SQL) access.
-- Admin checks reuse the helper below (security definer, locked search_path).

grant usage on schema public to anon, authenticated;

-- ============ helpers ============
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============ profiles ============
alter table public.profiles enable row level security;

-- own row, full columns
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

-- public read of id, full_name, avatar_url only (column grant below)
create policy "profiles_select_public"
on public.profiles for select
using (true);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

revoke all on public.profiles from anon, authenticated;
grant select (id, full_name, avatar_url) on public.profiles to anon;
grant select, update on public.profiles to authenticated;

-- ============ guides ============
alter table public.guides enable row level security;

create policy "guides_select_public"
on public.guides for select
using (is_published and verification_status = 'verified');

create policy "guides_all_owner"
on public.guides for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "guides_all_admin"
on public.guides for all
using (public.is_admin())
with check (public.is_admin());

revoke all on public.guides from anon, authenticated;
grant select on public.guides to anon;
grant all on public.guides to authenticated;

-- ============ guide_documents ============
-- Never public: owner + admin only. Files live in the private guide-docs bucket.
alter table public.guide_documents enable row level security;

create policy "guide_documents_all_owner_admin"
on public.guide_documents for all
using (
  exists (
    select 1 from public.guides g
    where g.id = guide_id
      and (g.profile_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.guides g
    where g.id = guide_id
      and (g.profile_id = auth.uid() or public.is_admin())
  )
);

revoke all on public.guide_documents from anon, authenticated;
grant all on public.guide_documents to authenticated;

-- ============ listings ============
alter table public.listings enable row level security;

create policy "listings_select_public"
on public.listings for select
using (
  is_active
  and exists (
    select 1 from public.guides g
    where g.id = guide_id and g.is_published
  )
);

create policy "listings_all_owner"
on public.listings for all
using (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
);

create policy "listings_all_admin"
on public.listings for all
using (public.is_admin())
with check (public.is_admin());

revoke all on public.listings from anon, authenticated;
grant select on public.listings to anon;
grant all on public.listings to authenticated;

-- ============ bookings ============
alter table public.bookings enable row level security;

create policy "bookings_select_participants"
on public.bookings for select
using (
  auth.uid() = traveler_id
  or exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
);

create policy "bookings_insert_participants"
on public.bookings for insert
with check (
  auth.uid() = traveler_id
  or exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
);

create policy "bookings_update_participants"
on public.bookings for update
using (
  auth.uid() = traveler_id
  or exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  auth.uid() = traveler_id
  or exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
);

revoke all on public.bookings from anon, authenticated;
grant select, insert, update on public.bookings to authenticated;

-- ============ messages ============
alter table public.messages enable row level security;

create policy "messages_select_participants"
on public.messages for select
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
);

create policy "messages_insert_participants"
on public.messages for insert
with check (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
);

create policy "messages_update_participants"
on public.messages for update
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
)
with check (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
);

revoke all on public.messages from anon, authenticated;
grant select, insert, update on public.messages to authenticated;

-- ============ payments ============
-- System-created (provider 'mock'): inserts are admin/service-role only.
alter table public.payments enable row level security;

create policy "payments_select_participants"
on public.payments for select
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
);

create policy "payments_update_participants"
on public.payments for update
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
)
with check (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (
        b.traveler_id = auth.uid()
        or exists (
          select 1 from public.guides g
          where g.id = b.guide_id and g.profile_id = auth.uid()
        )
        or public.is_admin()
      )
  )
);

create policy "payments_insert_admin"
on public.payments for insert
with check (public.is_admin());

revoke all on public.payments from anon, authenticated;
grant select, update on public.payments to authenticated;
grant insert on public.payments to authenticated;

-- ============ reviews ============
alter table public.reviews enable row level security;

create policy "reviews_select_public"
on public.reviews for select
using (true);

-- only the traveler of a COMPLETED booking may review it
create policy "reviews_insert_traveler_completed"
on public.reviews for insert
with check (
  auth.uid() = traveler_id
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and b.traveler_id = auth.uid()
      and b.status = 'completed'
  )
);

-- the guide (or an admin) may add/edit the guide_reply
create policy "reviews_update_guide_or_admin"
on public.reviews for update
using (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
);

revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to anon;
grant select, insert, update on public.reviews to authenticated;

-- ============ safety_reports ============
alter table public.safety_reports enable row level security;

create policy "safety_reports_insert_authed"
on public.safety_reports for insert
with check (auth.uid() = reporter_id);

create policy "safety_reports_select_admin"
on public.safety_reports for select
using (public.is_admin());

create policy "safety_reports_update_admin"
on public.safety_reports for update
using (public.is_admin())
with check (public.is_admin());

revoke all on public.safety_reports from anon, authenticated;
grant insert on public.safety_reports to authenticated;
grant select, insert, update on public.safety_reports to service_role;

-- ============ availability ============
alter table public.availability enable row level security;

create policy "availability_select_public"
on public.availability for select
using (true);

create policy "availability_all_owner_admin"
on public.availability for all
using (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
)
with check (
  exists (
    select 1 from public.guides g
    where g.id = guide_id and g.profile_id = auth.uid()
  )
  or public.is_admin()
);

revoke all on public.availability from anon, authenticated;
grant select on public.availability to anon;
grant all on public.availability to authenticated;

-- ============ regions ============
alter table public.regions enable row level security;

create policy "regions_select_public"
on public.regions for select
using (true);

revoke all on public.regions from anon, authenticated;
grant select on public.regions to anon, authenticated;

-- ============ storage: guide-docs (private, signed URLs) ============
-- Layout: guide-docs/<profile_id>/<file>
insert into storage.buckets (id, name, public)
values ('guide-docs', 'guide-docs', false)
on conflict (id) do nothing;

create policy "guide_docs_read_owner_admin"
on storage.objects for select
using (
  bucket_id = 'guide-docs'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

create policy "guide_docs_write_owner_admin"
on storage.objects for insert
with check (
  bucket_id = 'guide-docs'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

create policy "guide_docs_delete_owner_admin"
on storage.objects for delete
using (
  bucket_id = 'guide-docs'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);
