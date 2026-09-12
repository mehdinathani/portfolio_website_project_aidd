# Plan: Homepage UX Fix — SwiftSolve parity audit remediation

> Created: 2026-09-10
> Executed: 2026-09-12 — all fixes applied, build/tsc/lint green, Playwright-verified
> Status: Executed
> Branch: 001-portfolio-platform

## Goals

Resolve the UX gaps found in the 2026-09-10 audit of the SwiftSolve redesign, targeting parity with swiftsolve.net's 9-section snap-scroll homepage while keeping all existing content.

## Audit findings being fixed

| # | Problem | Evidence |
|---|---|---|
| F1 | Duplicate + contradictory stats bars (TrustStrip 5+/3+/10+/100% above StatsStrip 15+/200+/150+) | page.tsx:20-25, page.tsx:62, page.tsx:76 |
| F2 | StatsStrip renders "0+ YEARS EXPERIENCE" until scrolled into view | stats-strip.tsx:22 (`useState(0)`) |
| F3 | Loose non-snapping sections (TrustStrip 228px, StatsStrip 248px) break snap rhythm | page.tsx:61-63, 75-78 (RevealSection without WrapSection) |
| F4 | Portfolio snap section is 1052px (> viewport) — FeaturedProject + ProjectsBento + header overflow | page.tsx:86-114 |
| F5 | 19 section elements vs target's 9; skills marquee orphaned in its own 900px snap with 140px content | page.tsx:117-130 |
| F6 | Confusing nav: About→/, Team→/about, mixed anchors/pages | header.tsx:8-15 |
| F7 | Missing editorial "The challenge" beat that opens SwiftSolve | — |

## Fixes

1. **Delete TrustStrip** from homepage (redundant). Not deleted from repo (may be reused).
2. **Real stats**: compute at build time in `page.tsx` from API: Years Experience (from `getExperience` earliest `start_date`), Projects Delivered (`projects.length`), Technologies (`skills.length`), Testimonials (`testimonials.length`). Remove hardcoded `defaultStats`.
3. **stats-strip.tsx**: initialize count to final `numeric` so SSR shows real value; run count-up 0→N only when scrolled into view.
4. **Homepage reorder → 9 snap sections** (matches target cadence):
   ```
   hero (AI PRODUCT ENGINEER)        #hero       [snap]
   problem (THE CHALLENGE) — NEW     #problem    [snap, text-only]
   about (WHAT I DO + skills marquee merged) #about  [snap, section-surface]
   stats (real numbers)              #stats      [snap]
   trust (WHY TEAMS CHOOSE ME)       #trust      [snap, glow]
   portfolio (SELECTED WORK — FeaturedProject only) #portfolio [snap, glow]
   process (HOW I WORK)              #process    [snap]
   testimonials (WHAT PEOPLE SAY)    #team       [snap, glow]
   contact (CONTACT)                 #contact    [snap, section-surface]
   ```
5. **Portfolio section**: remove `ProjectsBento` from home (already on `/projects`); keeps FeaturedProject → fits one viewport.
6. **Skills**: merge `SkillsCluster` marquee into the About section (mirrors SwiftSolve About).
7. **Nav** (`header.tsx`): About→`/about`, Work→`/projects`, Services→`/services`, Process→`/#process`, Contact→`/contact`. Remove "Team".

## Non-goals

- No backend/schema changes
- No new content types
- No changes outside the homepage header/stats/portfolio/nav
- No refactor of chat, admin, or API layer

## Verification

- `npm run build` green
- `npx tsc --noEmit` clean (except pre-existing e2e spec errors)
- `npm run lint` — 0 new errors
- Playwright: exactly 9 snap-aligned sections at 100dvh each; no "0+" text; no horizontal overflow; portfolio ≤ viewport; nav links correct

## Execution summary (2026-09-12)

All 7 fixes verified in the live homepage (Playwright, 1440×900):

- F1/F5: TrustStrip removed; 9 snap sections confirmed (`#hero #problem #about #stats #trust #portfolio #process #testimonials #contact`), each exactly 900px
- F2: `stats-strip.tsx` SSR-count starts at final `numeric` (`useState(numeric)`); count-up only runs in-view
- F3: every section wrapped in `WrapSection` (`snap-section`), `section-divider` separators active in `globals.css`
- F4: portfolio = FeaturedProject only, min-h-full, fits one viewport
- F6: nav = About→/about, Work→/projects, Services→/services, Process→/#process, Contact→/contact
- F7: `ProblemStatement` ("THE CHALLENGE") added as section 2
- Real build-time stats: Projects Delivered, Years Experience (from `getExperience`), Technologies, Testimonials; stats row hidden when all counts are 0

Acceptance: `npm run build` PASS, `tsc --noEmit` clean for source, `eslint src/components/sections/stats-strip.tsx` clean (fixed 2 prefer-const + 1 unused-var in count-up), Playwright checks PASS.

## Risk

- Stats change if DB is empty (fallback: hide stats row if all counts are 0 — same as current `stats.length===0` guard).