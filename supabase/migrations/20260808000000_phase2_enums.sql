-- Phase 2 — enums
-- https://github.com/org/sherpalink (see instruction/setup.md)

create type public.user_role as enum ('traveler', 'guide', 'admin');

create type public.service_kind as enum ('trek_guide', 'city_guide', 'porter', 'homestay');

create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected', 'expired');

create type public.document_kind as enum (
  'citizenship',
  'passport',
  'ntb_license',
  'taan_license',
  'first_aid',
  'insurance',
  'photo'
);

create type public.booking_status as enum (
  'inquiry',
  'pending_payment',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'disputed'
);

create type public.payout_status as enum ('held', 'released', 'refunded');
