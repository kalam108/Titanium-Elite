/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });

const steps = [
  {
    file: "supabase/migrations/20260808000002_phase2_trust_score.sql",
    before: `
      drop trigger if exists bookings_trust_score on public.bookings;
      drop trigger if exists bookings_trust_score_insert on public.bookings;
      drop trigger if exists bookings_trust_score_update on public.bookings;
      drop trigger if exists guide_documents_trust_score on public.guide_documents;
      drop trigger if exists reviews_trust_score on public.reviews;
      drop function if exists public.recalc_trust_score_tg();
      drop function if exists public.recalc_trust_score(uuid);
    `,
  },
  {
    file: "supabase/migrations/20260808000003_phase2_rls.sql",
    before: `
      drop policy if exists "profiles_select_own" on public.profiles;
      drop policy if exists "profiles_select_public" on public.profiles;
      drop policy if exists "profiles_update_own" on public.profiles;
      drop policy if exists "guides_select_public" on public.guides;
      drop policy if exists "guides_all_owner" on public.guides;
      drop policy if exists "guides_all_admin" on public.guides;
      drop policy if exists "guide_documents_all_owner_admin" on public.guide_documents;
      drop policy if exists "listings_select_public" on public.listings;
      drop policy if exists "listings_all_owner" on public.listings;
      drop policy if exists "listings_all_admin" on public.listings;
      drop policy if exists "bookings_select_participants" on public.bookings;
      drop policy if exists "bookings_insert_participants" on public.bookings;
      drop policy if exists "bookings_update_participants" on public.bookings;
      drop policy if exists "messages_select_participants" on public.messages;
      drop policy if exists "messages_insert_participants" on public.messages;
      drop policy if exists "messages_update_participants" on public.messages;
      drop policy if exists "payments_select_participants" on public.payments;
      drop policy if exists "payments_update_participants" on public.payments;
      drop policy if exists "payments_insert_admin" on public.payments;
      drop policy if exists "reviews_select_public" on public.reviews;
      drop policy if exists "reviews_insert_traveler_completed" on public.reviews;
      drop policy if exists "reviews_update_guide_or_admin" on public.reviews;
      drop policy if exists "safety_reports_insert_authed" on public.safety_reports;
      drop policy if exists "safety_reports_select_admin" on public.safety_reports;
      drop policy if exists "safety_reports_update_admin" on public.safety_reports;
      drop policy if exists "availability_select_public" on public.availability;
      drop policy if exists "availability_all_owner_admin" on public.availability;
      drop policy if exists "regions_select_public" on public.regions;
      drop policy if exists "guide_docs_read_owner_admin" on storage.objects;
      drop policy if exists "guide_docs_write_owner_admin" on storage.objects;
      drop policy if exists "guide_docs_delete_owner_admin" on storage.objects;
      drop function if exists public.is_admin();
    `,
  },
];

(async () => {
  for (const step of steps) {
    try {
      await sql.unsafe(step.before);
      await sql.unsafe(
        fs.readFileSync(path.join(process.cwd(), step.file), "utf8"),
      );
      console.log("OK  ", step.file);
    } catch (e) {
      console.error("FAIL", step.file, "->", e.message);
      process.exitCode = 1;
    }
  }
  await sql.end();
})();
