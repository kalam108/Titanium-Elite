You are building "SherpaLink", a production-quality demo web application.

CONTEXT
SherpaLink is a trust-first marketplace that connects travelers with verified local
guides, porters, and homestay hosts in Nepal. The core problem: travelers cannot tell
which guides are licensed, experienced, and safe to book, so they overpay agencies or
gamble on unvetted Facebook contacts. SherpaLink solves this with a visible, auditable
verification system (NTB/TAAN license checks, ID checks, first-aid certs, reviews tied
to completed bookings) plus direct booking with no agency markup.

STACK (non-negotiable)
- Next.js 15, App Router, TypeScript strict, React Server Components by default
- Tailwind CSS v4 + shadcn/ui (new-york style, neutral base, Lucide icons)
- Supabase: Postgres, Auth (email + magic link), Storage, Row Level Security
- @supabase/ssr for cookie-based auth in server components, route handlers, middleware
- Zod for all input validation; React Hook Form for client forms
- Server Actions for mutations; no separate REST layer unless stated
- date-fns for dates; no moment.js
- Vitest + Playwright for tests (Phase 8 only)

GROUND RULES
1. Build in the phases defined in BUILD.md. Complete and verify one phase before
   starting the next. After each phase, print a short summary of files created and
   how to verify the phase manually.
2. Never invent Supabase table or column names — use the schema in Phase 2 exactly.
3. All database access from the server goes through typed helpers in `lib/db/`.
   Never call supabase.from() directly inside a React component.
4. Every table has RLS enabled. Write the policy alongside the table, never later.
5. Money is stored in integer paisa (1 NPR = 100 paisa). Never use floats for money.
6. All timestamps are `timestamptz`, stored UTC, rendered in Asia/Kathmandu.
7. Accessibility: semantic HTML, keyboard-navigable, visible focus rings, alt text.
8. No placeholder lorem ipsum in the final UI — use the seeded Nepal data.
9. Prefer server components; add "use client" only where interactivity demands it.
10. Keep components under ~200 lines; extract subcomponents rather than nesting deeply.

DESIGN DIRECTION
- Feel: calm, credible, outdoorsy. Not a flashy startup landing page.
- Palette: stone/neutral base, a single deep evergreen accent (#1F5A46), warm amber
  for verification badges (#C8853A). Generous whitespace, 1px stone borders,
  subtle shadows only on hover.
- Typography: Inter for UI, one serif display face for hero headings only.
- Photography-forward cards: guide portrait, name, region, verification badge row.
- Verification badges are the visual hero of the product — make them unmistakable.

Read BUILD.md and begin with Phase 1. Ask me nothing; make reasonable decisions and
state assumptions in your phase summary.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
