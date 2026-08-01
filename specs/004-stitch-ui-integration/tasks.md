---

description: "Task list for integrating Google Stitch UI design patterns into the existing portfolio"

---

# Tasks: 004 — Stitch UI Design Integration

**Input**: `specs/004-stitch-ui-integration/plan.md`
**Prerequisites**: plan.md (required). Builds on top of existing `002-portfolio-redesign` — all deps, motion components, hero, and page structure are already in place.

**Organization**: Tasks are grouped by vertical slice (user story) with clear checkpoints. Each story can be independently tested.

**Test strategy**: All existing E2E tests must continue to pass. New components get visual verification via dev server. No new unit tests unless a component has non-trivial logic.

---

## Phase 1: User Story 1 — Homepage Enhancement (P1)

**Goal**: Add Stitch-inspired sections to the homepage: stats counters strip, why-choose-us value cards, enhanced testimonial cards with star ratings and author images, enhanced CTA section, and process steps.

**Independent Test**: Visit `/` → scroll through all sections. Stats counters animate from 0 to target values when scrolled into view. Why-choose-us cards have icons and hover effects. Testimonials show star ratings, author names, and quote cards. Process steps render in numbered order. CTA section has bold editorial typography.

### Implementation

- [ ] T101 [P] [US1] Create `frontend/src/components/sections/stats-strip.tsx`:
  - Server component wrapper with `'use client'` inner for animation
  - Animated counter using `motion` (count up on scroll into view via `useInView`)
  - 4 stats: "15+" Years Experience, "200+" Successful Projects, "150+" Happy Clients, "160" 5-Star Reviews
  - Accept `stats` prop array with `{ value: string, label: string, suffix?: string }` for reusability
  - Responsive: 2-column on mobile, 4-column on desktop
  - Stitch style: large bold numbers with small uppercase labels underneath, thin divider between columns

- [ ] T102 [P] [US1] Create `frontend/src/components/sections/why-choose-us.tsx`:
  - Server component
  - Section heading: "Why Choose Us" with subtitle
  - 3 feature cards in a responsive grid (1-col mobile, 3-col desktop)
  - Each card: icon (from `lucide-react`), title, description
  - Cards styled with thin 1px border, subtle background shift on hover (no shadows)
  - Content: "Proven Track Record" (verified icon), "Tailored Solutions" (architecture icon), "Client-Centric Focus" (groups icon)
  - Match Stitch layout: heading left-aligned, cards below in a row

- [ ] T103 [P] [US1] Enhance `frontend/src/components/sections/testimonials-marquee.tsx`:
  - Add 5-star rating display per testimonial card (use star icons from `lucide-react`)
  - Add author avatar/initial circle if `avatar_url` exists in testimonial data
  - Richer card layout: quote text, star rating row, author info row (avatar + name + role)
  - Keep existing two-row marquee with opposite scroll directions
  - Read testimonial data from API (unchanged data fetching)

- [ ] T104 [P] [US1] Create `frontend/src/components/sections/process-steps.tsx`:
  - Server component
  - Section heading: "Here's How It Works" with optional subtitle
  - Accept `steps` prop array of `{ number: string, title: string, description: string }`
  - Default 3 steps: "Start a Conversation", "Choose Your Engagement", "Experience the Benefits"
  - Numbered step cards (01, 02, 03) in a row
  - Each step: large number (semantic, decorative), title, description
  - Responsive: stack vertically on mobile
  - Thin connecting line between steps (CSS border or pseudo-element)

- [ ] T105 [P] [US1] Enhance `frontend/src/components/sections/contact-cta.tsx`:
  - Bigger editorial heading (match Stitch "Ready to Scale Your Vision?" style)
  - Supporting sub-text paragraph
  - Primary CTA button: "Get Free Consultation" (lead to Cal.com)
  - Optional secondary CTA: "View Our Projects" (link to /projects)
  - Dark background section (use `bg-secondary` or surface container) to create visual break

- [ ] T106 [P] [US1] Update `frontend/src/app/page.tsx`:
  - Import and compose new sections in Stitch-inspired order:
    1. `<HeroSection />` (existing)
    2. `<TrustStrip />` (existing)
    3. `<AboutStrip />` (existing)
    4. **`<StatsStrip />`** (new)
    5. **`<WhyChooseUs />`** (new)
    6. `<FeaturedProject />` (existing)
    7. `<ProjectsBento />` (existing)
    8. `<SkillsCluster />` (existing)
    9. **`<TestimonialsMarquee />`** (enhanced)
    10. **`<ProcessSteps />`** (new)
    11. **`<ContactCta />`** (enhanced)
  - Ensure data flows from API to enhanced testimonial component
  - Verify no regressions on existing sections

**Checkpoint**: Homepage renders all 11 sections. Stats animate on scroll. Testimonials show stars. Process steps are numbered. CTA section is bold. All existing hero/bento/skills sections unchanged and functional.

---

## Phase 2: User Story 2 — About Page Enhancement (P1)

**Goal**: Apply Stitch layout patterns to the About page: bolder hero typography, add process steps section, add stats strip.

**Independent Test**: Visit `/about` → hero headline is bold and editorial. Process steps show 05 numbered steps. Stats strip renders with animated counters. Existing timeline and skills cluster unchanged.

### Implementation

- [ ] T201 [P] [US2] Enhance `frontend/src/app/about/page.tsx`:
  - Refresh hero section: larger display headline matching Stitch's "Redefining the Digital Narrative" layout
  - Insert `<StatsStrip />` after hero/intro section
  - Insert `<ProcessSteps />` with 5 steps (matching Stitch About page):
    1. "Start a Conversation"
    2. "Choose Your Engagement"
    3. "Review Your Options"
    4. "Get Started & Results"
    5. "Experience the Benefits"
  - Reorder sections: Hero/Headline → Stats → Bio → Process (5 steps) → Timeline → Skills → CTA
  - Keep existing `<TimelineItem />`, `<SkillsCluster />` unchanged
  - Maintain existing data fetching (profile, experiences, skills)

**Checkpoint**: About page has bolder hero, stats strip, and 5-step process. Existing timeline and skills unchanged. All data renders correctly.

---

## Phase 3: User Story 3 — Services Page (NEW) (P0)

**Goal**: Create a brand new Services page with hero, service grid (6 cards), featured service highlight, process steps, stats strip, and CTA section.

**Independent Test**: Visit `/services` → page renders with hero + 6 service cards. Each card has icon, title, description, and CTA link. Service highlight section has feature list. Stats strip animates. Process steps display. CTA section has primary button.

### Implementation

- [ ] T301 [P] [US3] Create `frontend/src/app/services/page.tsx`:
  - Server component (async, follows pattern of other pages)
  - Fetch profile data from API (for potential dynamic content)
  - Compose sections:
    1. `<ServicesHero />`
    2. `<StatsStrip />`
    3. `<ServiceGrid />`
    4. `<ServiceHighlight />`
    5. `<ProcessSteps />` (3-step version)
    6. `<ServicesCta />`
  - Add metadata: title "Services | Mehdi Abbas Nathani", description

- [ ] T302 [P] [US3] Create `frontend/src/components/sections/services-hero.tsx`:
  - Large display headline: "Software Development and Consulting"
  - Subtitle paragraph about services
  - Mini trust indicator: star icon + "200+ 5 Star Reviews"
  - Match Stitch layout: bold headline, centered or left-aligned with subtitle below

- [ ] T303 [P] [US3] Create `frontend/src/components/sections/service-grid.tsx`:
  - 6 service cards in a responsive grid (1-col mobile, 2-col tablet, 3-col desktop)
  - Each card: icon (lucide-react), title, short description, "Explore Service →" link
  - Services with icons:
    1. Web Development (` Globe `)
    2. AI/ML/GenAI (` BrainCircuit `)
    3. UI/UX Design (` Palette `)
    4. Cloud Engineering (` Cloud `)
    5. E-commerce (` ShoppingBag `)
    6. Mobile App Development (` Smartphone `)
  - Card style: thin 1px border, subtle hover effect, consistent with Stitch card pattern
  - Each card's CTA link = `#` initially (can link to detail pages later)

- [ ] T304 [P] [US3] Create `frontend/src/components/sections/service-highlight.tsx`:
  - Featured service deep-dive section (e.g., highlight "AI/ML/GenAI" or "Web Development")
  - Layout: image/illustration on left, content on right (reversed on mobile)
  - Content: headline, description paragraph, bullet-point features list (3-4 items with check icons)
  - "Read the Guide →" link at bottom
  - Match Stitch "Exploring Headless E-commerce" section layout

- [ ] T305 [P] [US3] Create `frontend/src/components/sections/services-cta.tsx`:
  - Bold CTA section matching Stitch "Ready to transform your challenges into digital triumphs?"
  - Primary CTA: "Get Your Free Consultation" (link to Cal.com)
  - Secondary CTA: "View Our Projects" (link to /projects)
  - Dark background to create visual break

**Checkpoint**: `/services` route exists and renders all sections. 6 service cards display with icons. Service highlight has feature list. Stats, process, and CTA all render.

---

## Phase 4: User Story 4 — Persistent UI Enhancement (P2)

**Goal**: Update header to include Services nav link and orange accent CTA. Expand footer to richer 4-column layout matching Stitch's detailed footer.

**Independent Test**: Header shows "Services" nav link. CTA button has orange accent on hover. Footer has 4 columns: Navigation, Services, Connect, Colophon/Office with contact info.

### Implementation

- [ ] T401 [P] [US4] Update `frontend/src/components/layout/header.tsx`:
  - Add `{ href: '/services', label: 'Services' }` to `navLinks` array (after Projects or About)
  - Add orange accent color (`hover:text-[#f58327]`) to CTA button or active link state
  - Keep all existing functionality (mobile menu, ⌘K hint, glass blur, sticky)

- [ ] T402 [P] [US4] Update `frontend/src/components/layout/footer.tsx`:
  - Expand from 3-column to 4-column layout
  - Columns:
    1. **Navigation** — Home, Projects, Services, About, Contact
    2. **Services** — Web Development, AI/ML, UI/UX Design, Cloud Engineering
    3. **Connect** — LinkedIn, GitHub, Email (existing)
    4. **Colophon** — "Built with Next.js, Tailwind & Three.js", copyright year
  - Add thin top border with brand styling
  - Maintain existing server component pattern (no `'use client'`)

**Checkpoint**: Header has Services link. Footer shows 4 columns with services listed.

---

## Phase 5: User Story 5 — Polish & QA (P3)

**Goal**: Verify everything works together. No regressions. Lighthouse and accessibility pass.

**Independent Test**: `npm run build` succeeds. `npm run lint` passes. Lighthouse ≥ 90 Performance, ≥ 95 A11y. Keyboard nav works.

### Implementation

- [ ] T501 [P] [US5] Update `frontend/src/app/sitemap.ts`:
  - Add `/services` route to sitemap

- [ ] T502 [P] [US5] Responsive QA:
  - Verify all new sections at 375px (mobile), 768px (tablet), 1280px+ (desktop)
  - Stats strip wraps correctly on mobile (2 columns)
  - Service grid goes to 1 column on mobile
  - Process steps stack vertically on mobile
  - Testimonials marquee works on touch devices (pause on tap)

- [ ] T503 [P] [US5] Performance check:
  - Run `npm run build` — verify no errors
  - Check Lighthouse in dev tools (target: Performance ≥ 90, A11y ≥ 95)
  - Verify no unnecessary re-renders in new components

- [ ] T504 [P] [US5] Accessibility pass:
  - Keyboard tab-walk through new sections
  - Verify focus-visible rings on all interactive elements
  - Screen reader check (headings hierarchy is logical)
  - Color contrast: body text 7:1, UI elements 4.5:1
  - `prefers-reduced-motion: reduce` respected (counters skip animation, just show final value)

- [ ] T505 [P] [US5] Run existing test suite:
  - `npm run lint` passes
  - `npm run test` passes (Jest)
  - `npm run build` succeeds

**Checkpoint**: All new pages and sections pass responsive, accessibility, and performance checks. Existing tests pass. No console errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1 — Homepage)**: No deps (builds on existing 002 infrastructure). Start here.
- **Phase 2 (US2 — About)**: Depends on Phase 1 components (`<StatsStrip />`, `<ProcessSteps />` are shared).
- **Phase 3 (US3 — Services)**: Depends on Phase 1 components (`<StatsStrip />`, `<ProcessSteps />`, `<ContactCta />` enhancements are shared).
- **Phase 4 (US4 — Persistent UI)**: Depends on Phase 3 (Services route must exist before adding nav link).
- **Phase 5 (US5 — Polish)**: Depends on all other phases complete.

### Parallel Opportunities

| Phase | Can run parallel with | Shared components |
|---|---|---|
| Phase 1 (US1 — Homepage) | — (foundation) | StatsStrip, ProcessSteps, WhyChooseUs |
| Phase 2 (US2 — About) | Phase 3 (US3) | StatsStrip, ProcessSteps |
| Phase 3 (US3 — Services) | Phase 2 (US2) | StatsStrip, ProcessSteps |
| Phase 4 (US4 — Persistent UI) | — (depends on Phase 3) | Header, Footer |
| Phase 5 (US5 — Polish) | — (depends on everything) | All |

### Recommended Execution Order (Sequential)

1. **Phase 1**: Homepage Enhancement → checkpoint verified
2. **Phase 2**: About Page → checkpoint verified
3. **Phase 3**: Services Page → checkpoint verified
4. **Phase 4**: Persistent UI → checkpoint verified
5. **Phase 5**: Polish & QA → final verification

---

## Verification Checklist

Run after each phase completion:

- [ ] `npm run dev` starts without errors (from `frontend/`)
- [ ] `npm run lint` passes (from `frontend/`)
- [ ] `npm run build` succeeds (from `frontend/`)
- [ ] New sections render correctly at mobile, tablet, and desktop widths
- [ ] No console errors in dev tools
- [ ] All existing sections (hero, bento, skills, projects) are unchanged
