-- Phase 2 — tables, constraints, indexes
-- Money is integer paisa (1 NPR = 100 paisa). Timestamps are timestamptz (UTC).

-- ============ profiles ============
-- id = auth.users.id: one profile per auth user.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'traveler',
  full_name text,
  avatar_url text,
  phone text,
  country text,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

-- ============ guides ============
create table public.guides (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  headline text,
  bio text,
  years_experience int,
  languages text[] not null default '{}',
  regions text[] not null default '{}',
  service_kinds public.service_kind[] not null default '{}',
  base_rate_paisa bigint,
  currency text not null default 'NPR',
  max_group_size int,
  verification_status public.verification_status not null default 'unverified',
  verified_at timestamptz,
  trust_score int not null default 0,
  response_hours numeric,
  is_published boolean not null default false
);

create index guides_verification_published_idx
  on public.guides (verification_status, is_published);

create index guides_languages_gin on public.guides using gin (languages);

create index guides_regions_gin on public.guides using gin (regions);

-- ============ guide_documents ============
create table public.guide_documents (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  kind public.document_kind not null,
  storage_path text not null,
  issuer text,
  document_number text,
  issued_on date,
  expires_on date,
  status public.verification_status not null default 'pending',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

-- ============ listings ============
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  service_kind public.service_kind not null,
  region text,
  duration_days int,
  difficulty smallint check (difficulty between 1 and 5),
  max_altitude_m int,
  price_paisa bigint not null,
  price_unit text not null default 'per_day'
    check (price_unit in ('per_day', 'per_trip', 'per_person')),
  includes text[] not null default '{}',
  excludes text[] not null default '{}',
  cover_image_url text,
  gallery text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index listings_region_service_active_idx
  on public.listings (region, service_kind, is_active);

-- ============ availability ============
create table public.availability (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  unique (guide_id, date)
);

-- unique (guide_id, date) already provides the (guide_id, date) index required
-- by the spec; no duplicate index needed.

-- ============ bookings ============
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- e.g. SL-8F3K2A
  traveler_id uuid not null references public.profiles (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  start_date date not null,
  end_date date not null,
  party_size int not null check (party_size > 0),
  total_paisa bigint not null check (total_paisa >= 0),
  platform_fee_paisa bigint not null default 0 check (platform_fee_paisa >= 0),
  status public.booking_status not null default 'inquiry',
  traveler_note text,
  guide_note text,
  cancelled_reason text,
  created_at timestamptz not null default now()
);

create index bookings_traveler_idx on public.bookings (traveler_id);

create index bookings_guide_status_idx on public.bookings (guide_id, status);

-- ============ payments ============
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  provider text not null default 'mock',
  provider_ref text,
  amount_paisa bigint not null check (amount_paisa >= 0),
  status public.payout_status not null default 'held',
  escrow_release_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============ reviews ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete cascade,
  traveler_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  safety_rating smallint check (safety_rating between 1 and 5),
  knowledge_rating smallint check (knowledge_rating between 1 and 5),
  communication_rating smallint check (communication_rating between 1 and 5),
  body text,
  guide_reply text,
  created_at timestamptz not null default now()
);

create index reviews_guide_idx on public.reviews (guide_id);

-- ============ messages ============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_booking_idx on public.messages (booking_id);

-- ============ safety_reports ============
create table public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  guide_id uuid references public.guides (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  category text,
  body text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- ============ regions ============
create table public.regions (
  slug text primary key,
  name text not null,
  district text,
  province text,
  permit_required boolean not null default false,
  permit_notes text,
  best_months int[] not null default '{}',
  hero_image_url text
);
