Phase 4 — Guide Onboarding & Verification
Goal: The trust engine. This is the product's differentiator — invest here.

Multi-step wizard at /guide/apply (persist draft to DB each step):

Basics — name, phone, languages, years of experience

Services — service kinds, regions, group size, base rate

Documents — upload citizenship/passport, NTB or TAAN license, first-aid cert, insurance

Profile — headline, bio, portrait, gallery

Review & submit

Uploads to private Storage bucket guide-docs; server action issues signed URLs; validate type (jpg/png/pdf) and size (≤ 8 MB).

Mock verification service at lib/verification/provider.ts with a real-looking interface:

ts
interface VerificationProvider {
  verifyLicense(kind, number, issuer): Promise<{ ok: boolean; matchedName?: string; expiresOn?: string; reason?: string }>
}
Ship MockNtbProvider that validates format, checks a seeded registry table, simulates 1.5s latency, and fails ~15% deterministically by hash. Swappable for a real NTB integration later.

Admin queue at /admin/verifications: table of pending guides, doc viewer with signed URLs, approve/reject with reason, bulk actions. Approval sets verification_status='verified', verified_at, recalcs trust score.

Verification badge system — components/trust/verification-badges.tsx:

Licensed (NTB/TAAN, amber shield)

ID Verified

First Aid Certified

Insured

Top Rated (≥4.7 with ≥5 reviews)
Each badge is a tooltip/popover explaining exactly what was checked and when — transparency is the point.

Expiry job: a /api/cron/check-expiries route flipping expired docs to expired and downgrading the guide.

Done when: a guide can apply end-to-end, an admin can approve, and the public profile shows accurate badges.

Phase 5 — Discovery & Guide Profiles
Goal: Travelers find and evaluate guides.

/guides — server-rendered search with URL-state filters: region, service kind, language, date range availability, price range, min rating, verified-only (default on). Cursor pagination.

GuideCard: portrait, name, headline, region chips, badge row, trust score ring, rate, response time, review count.

/guides/[slug] profile: hero, about, verification panel (what was checked + when), services/listings, availability calendar, reviews with sub-ratings, "Request to book" CTA, report link.

/listings/[slug] detail: itinerary, difficulty and max altitude, includes/excludes, price breakdown, guide mini-card.

/regions/[slug]: region overview, permit requirements, best months, top verified guides.

Homepage: hero with search, "How verification works" 3-step explainer, featured verified guides, region grid, trust stats.

SEO: generateMetadata per profile/listing, OpenGraph images, JSON-LD Person/TouristTrip.

Done when: search filters compose correctly in the URL, results are fast, and every card is keyboard-reachable.

Phase 6 — Booking, Messaging & Reviews
Goal: Complete the transaction loop.

Booking request flow: date range picker constrained by availability, party size, note → creates booking in inquiry.

Guide accepts/declines from /guide/bookings → pending_payment with a 48h expiry.

Mock escrow checkout at /bookings/[code]/pay: fee breakdown (platform fee 8%), a mock card form, success/failure paths. Writes payments row status='held', booking → confirmed. Interface-first so eSewa/Khalti/Stripe can be dropped in.

Threaded messaging per booking with Supabase Realtime; unread badge in header.

Trip lifecycle: confirmed → in_progress (start date) → completed (end date + guide confirm) → escrow released 72h later.

Cancellation policy engine lib/booking/cancellation.ts: >14 days full refund, 7–14 days 50%, <7 days 0%. Show the policy before payment.

Reviews: prompted after completion, one per booking, sub-ratings for safety/knowledge/communication, guide can reply once. Verified-booking-only reviews are enforced by RLS.

Dashboards: /dashboard (traveler — upcoming, past, messages) and /guide/dashboard (earnings, calendar, requests, profile completeness meter).

Done when: the full inquiry → pay → complete → review loop works with seeded accounts.

Phase 7 — Safety Layer & Admin
/safety public page: how vetting works, what a badge means, what it does not guarantee, emergency numbers (Tourist Police 1144, Nepal Police 100, Ambulance 102), TIMS/permit guidance per region.

Report-a-guide dialog → safety_reports; admin triage view with status transitions.

Trip-share: /trip/[token] public read-only itinerary page a traveler can send to family — dates, route, guide name and verified phone, emergency contacts.

Admin console /admin: verifications queue, guides table, bookings table, reports, and simple KPI cards (verified guides, GMV, avg trust score, dispute rate).

Phase 8 — Seed Data, Polish & Tests
supabase/seed.sql + scripts/seed.ts producing realistic Nepal data:

12 regions: Everest (Khumbu), Annapurna, Langtang, Manaslu, Mustang, Kanchenjunga, Makalu, Dolpo, Kathmandu Valley, Pokhara, Chitwan, Lumbini.

40 guides across statuses: ~28 verified, 6 pending, 4 unverified, 2 rejected. Nepali names, plausible languages (Nepali, English, Sherpa, Tamang, Hindi, German, Japanese), 2–25 years experience, rates NPR 2,500–9,000/day.

70 listings: e.g. "EBC Trek 14 Days", "Annapurna Circuit 12 Days", "Kathmandu Heritage Walk", "Chitwan Wildlife 3 Days", "Poon Hill Sunrise 4 Days".

6 travelers, 120 bookings across all statuses spread over 18 months, 90 reviews with realistic prose, ~300 messages, 3 safety reports.

Demo logins printed at the end: traveler@demo.np, guide@demo.np, admin@demo.np (password demo1234).

Images: use a curated set of Unsplash URLs in a constants file (no hotlinking randomness); configure next.config remotePatterns.

Empty states, loading skeletons, error.tsx and not-found.tsx per route group, toast feedback on every mutation.

Performance: image sizes, dynamic = 'force-static' where valid, Lighthouse ≥ 90 on / and /guides.

Tests:

Vitest units: formatNPR, cancellation engine, trust score, Zod schemas.

Playwright e2e: signup → guide apply → admin approve → traveler books → pays → completes → reviews.

README.md: setup, env vars, supabase start, migrate, seed, demo logins, architecture diagram, what is mocked and how to swap in real providers.

Acceptance Checklist
pnpm build clean, TypeScript strict, no any

RLS verified: anon cannot read documents, bookings, or messages

Verification badges reflect real document state, never hardcoded

Reviews impossible without a completed booking

Money is integer paisa everywhere; NPR formatting correct

Mobile 375px through desktop 1440px all usable

Keyboard-only navigation completes a booking

Seed produces a demo that looks like a real, populated product

README explains every mock and its swap path

Suggested Structure
text
src/
  app/
    (marketing)/         page.tsx  safety/  regions/[slug]/
    (auth)/              login/  signup/  auth/callback/
    (traveler)/          dashboard/  bookings/[code]/  trip/[token]/
    (guide)/             guide/apply/  guide/dashboard/  guide/bookings/
    (admin)/             admin/  admin/verifications/  admin/reports/
    guides/              page.tsx  [slug]/page.tsx
    listings/[slug]/
    api/cron/check-expiries/
  components/
    ui/  layout/  guides/  trust/  booking/  reviews/  admin/
  lib/
    supabase/  db/  auth/  verification/  booking/  validation/  utils.ts
supabase/
  migrations/  seed.sql