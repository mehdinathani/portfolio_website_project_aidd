---

description: "Task list for portfolio redesign — 3D Hero + Editorial Body"

---

# Tasks: 002 — Portfolio Redesign (3D Hero + Editorial Body)

**Input**: `specs/002-portfolio-redesign/spec.md`, `specs/002-portfolio-redesign/plan.md`
**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by vertical slice (user story) to enable independent implementation and testing of each story. All stories share the Foundation phase.

**Test strategy**: All existing E2E tests must continue to pass. New components get visual regression testing via Playwright MCP screenshots. No new unit tests unless a component has non-trivial logic.

---

## Phase 1: Foundation — Shared Infrastructure (P0 · Blocking)

**Purpose**: Project initialization, design tokens, dependency installation. MUST complete before any user story.

- [ ] T001 [P] [FND] Wire up Playwright MCP in `.mcp.json` — blocking for visual iteration
- [ ] T002 [P] [FND] Create Playwright config at `frontend/playwright.config.ts` with baseURL `http://localhost:3000`
- [ ] T003 [FND] Install shadcn/ui: `npx shadcn@latest init` — generates `components.json`, base styles, cn utility
- [ ] T004 [FND] Add shadcn components: `npx shadcn@latest add button card input textarea badge select`
- [ ] T005 [FND] Install core animation deps: `npm install motion@latest @use-gesture/react@latest`
- [ ] T006 [FND] Install 3D deps: `npm install three@latest @react-three/fiber@latest @react-three/drei@latest`
- [ ] T007 [P] [FND] Install UX deps: `npm install lenis@latest cmdk@latest lucide-react@latest`
- [ ] T008 [P] [FND] Install dev tooling: `npm install -D @next/bundle-analyzer@latest`
- [ ] T009 [FND] Rewrite `frontend/tailwind.config.js` with new design tokens:
  - Colors: deep dark `#0a0a0b`, electric blue `#3b82f6`, off-white `#f5f5f4`, card surface `#1e1e2e`
  - Font families: `Inter Display`, `JetBrains Mono`
  - Animations: `fade-in`, `slide-up`, `marquee`, `pulse-soft`
- [ ] T010 [FND] Rewrite `frontend/src/app/globals.css`:
  - shadcn dark-only CSS variables matching design tokens
  - Custom `@keyframes` for marquee, pulse-soft, fade-in, slide-up
  - `@tailwind base/components/utilities` layer directives
- [ ] T011 [FND] Add `next/font` imports in root layout (`Inter`, `JetBrains Mono` with `variable` fonts)
- [ ] T012 [FND] Configure bundle-analyzer in `frontend/next.config.js`
- [ ] T013 [FND] Delete old `frontend/src/components/ui/` files (replaced by shadcn equivalents)
- [ ] T014 [FND] Extend `frontend/src/lib/utils.ts` with animation-related utilities if needed

**Checkpoint**: Design foundation ready — `npm run dev` shows new dark theme, shadcn components render, bundle-analyzer works, Playwright can navigate to dev server.

---

## Phase 2: User Story 1 — Persistent UI (P1 · MVP)

**Goal**: Header, footer, cursor, command palette, and page transitions wrap every page. These are the structural shell that all other stories live inside.

**Independent Test**: Navigate to any route → header shows glass blur on scroll, footer renders 3 columns, ⌘K opens palette, cursor changes over interactive elements, page transitions play on route change.

### Implementation

- [X] T101 [US1] Rewrite `frontend/src/components/layout/header.tsx`:
- [X] T102 [P] [US1] Rewrite `frontend/src/components/layout/footer.tsx`:
- [X] T103 [US1] Create `frontend/src/components/motion/page-transition.tsx`:
- [X] T104 [US1] Create `frontend/src/components/motion/custom-cursor.tsx`:
- [X] T105 [P] [US1] Create `frontend/src/components/motion/command-palette.tsx`:
- [X] T106 [US1] Update `frontend/src/app/layout.tsx`:
  - Import new Header, Footer, PageTransition, CustomCursor, CommandPalette
  - Wrap `<main>` with PageTransition
  - Add dynamic imports for heavy components (cursor, palette)
  - Update metadata/title for new brand voice

**Checkpoint**: All pages have the new persistent UI shell. Header glass blur, footer editorial, ⌘K opens palette, cursor appears on desktop, route transitions are smooth.

---

## Phase 3: User Story 2 — 3D Hero (P1 · MVP)

**Goal**: A mouse-reactive 3D particle field hero that loads lazily, falls back gracefully on mobile/reduced-motion, and ships semantic HTML underneath.

**Independent Test**: Visit `/` → hero H1 + CTA paints immediately (verify with JS disabled). On desktop, particle field fades in after ~600ms. On mobile (<768px) or reduced-motion, static poster gradient displays with no Three.js shipped.

### Implementation

- [X] T201 [US2] Create `frontend/src/hooks/use-mouse-position.ts`:
- [X] T202 [P] [US2] Create `frontend/src/hooks/use-reduced-motion.ts`:
- [X] T203 [US2] Create `frontend/src/components/hero/particle-field.tsx`:
- [X] T204 [P] [US2] Create `frontend/src/components/hero/hero-content.tsx`:
- [X] T205 [P] [US2] Create `frontend/src/components/hero/hero-fallback.tsx`:
- [X] T206 [US2] Create `frontend/src/components/hero/hero-section.tsx`:
- [X] T207 [US2] Create `frontend/src/app/preview/hero/page.tsx`:
- [X] T208 [US2] Integrate `<HeroSection />` into `frontend/src/app/page.tsx`:
  - Replace old `<Hero />` import with new lazy-loaded `<HeroSection />`
  - Pass profile data to `HeroContent`

**Checkpoint**: Hero works in 3 modes tested via Playwright MCP screenshots: (1) desktop with 3D particle field visible, (2) mobile viewport with static fallback, (3) reduced-motion with static fallback and no Three.js in network tab.

---

## Phase 4: User Story 3 — Home Page Sections (P2)

**Goal**: The full home page below the hero — about strip, featured project, bento grid, skills cluster, testimonial marquee, contact CTA.

**Independent Test**: Visit `/` → scroll through each section. About strip has editorial text + avatar tilt. Featured project card has shared-layout transition to detail page. Bento grid tiles tilt on hover. Skills chips glow on hover. Testimonials marquee scrolls infinitely.

### Implementation

- [X] T301 [P] [US3] Create `frontend/src/components/sections/about-strip.tsx`:
- [X] T302 [P] [US3] Create `frontend/src/components/sections/featured-project.tsx`:
- [X] T303 [US3] Create `frontend/src/components/sections/projects-bento.tsx`:
- [X] T304 [P] [US3] Create `frontend/src/components/motion/tilt-card.tsx`:
- [X] T305 [P] [US3] Create `frontend/src/components/motion/shared-layout.tsx`:
- [X] T306 [US3] Create `frontend/src/components/sections/skills-cluster.tsx`:
- [X] T307 [P] [US3] Create `frontend/src/components/sections/testimonials-marquee.tsx`:
- [X] T308 [P] [US3] Create `frontend/src/components/motion/marquee.tsx`:
- [X] T309 [P] [US3] Create `frontend/src/components/sections/contact-cta.tsx`:
- [X] T310 [P] [US3] Create `frontend/src/components/motion/reveal-text.tsx`:
- [X] T311 [P] [US3] Create `frontend/src/components/motion/magnetic-button.tsx`:
- [X] T312 [US3] Update `frontend/src/app/page.tsx`:
  - Compose all home sections: `<HeroSection />`, `<AboutStrip />`, `<FeaturedProject />`, `<ProjectsBento />`, `<SkillsCluster />`, `<TestimonialsMarquee />`, `<ContactCta />`

**Checkpoint**: Full home page renders all sections. Scroll is smooth. Each section has its intended interaction (tilt, glow, marquee, magnetic). Everything works without JS errors.

---

## Phase 5: User Story 4 — Inner Pages (P2)

**Goal**: Redesign `/projects`, `/projects/[slug]`, `/about`, `/contact`, `/certifications` with new visual language. Absorb `/experience` and `/skills` into `/about`.

**Independent Test**: Visit each route → new design tokens applied, data renders correctly, interactions work, no 404s. /experience and /skills redirect to /about.

### Implementation

- [X] T401 [US4] Rewrite `frontend/src/app/projects/page.tsx`:
- [X] T402 [US4] Rewrite `frontend/src/app/projects/[slug]/page.tsx`:
- [X] T403 [US4] Rewrite `frontend/src/app/about/page.tsx`:
- [X] T404 [P] [US4] Restyle `frontend/src/components/sections/timeline-item.tsx`:
- [X] T405 [US4] Rewrite `frontend/src/app/contact/page.tsx`:
- [X] T406 [P] [US4] Restyle `frontend/src/components/sections/contact-form.tsx`:
- [X] T407 [P] [US4] Restyle `frontend/src/app/certifications/page.tsx`:
- [X] T408 [US4] Restyle `frontend/src/app/error.tsx` and `frontend/src/app/not-found.tsx`:
- [X] T409 [US4] Remove `/experience` and `/skills` route directories:
- [X] T410 [US4] Add redirects in `frontend/next.config.js`:
  - `/experience` → `/about`
  - `/skills` → `/about`

**Checkpoint**: All public routes render correctly with new design. /experience and /skills redirect to /about. Shared-layout transition from bento card to project detail works smoothly.

---

## Phase 6: User Story 5 — Chat Orb + Polish (P3)

**Goal**: Wrap the existing chat UI in a polished orb → side sheet container. Performance audit, accessibility pass, mobile testing.

**Independent Test**: Click chat orb → side sheet opens with existing chat UI functional. Lighthouse mobile ≥ 90. Keyboard tab-walk works. Reduced-motion respected.

### Implementation

- [X] T501 [US5] Create `frontend/src/components/chat/orb.tsx`:
- [X] T502 [US5] Create `frontend/src/components/chat/chat-sheet.tsx`:
- [X] T503 [US5] Update `frontend/src/app/layout.tsx`:
- [ ] T504 [P] [US5] Performance audit:
- [ ] T505 [P] [US5] Accessibility pass:
- [ ] T506 [P] [US5] Mobile testing:
- [ ] T507 [US5] Run existing test suite:
- [X] T508 [P] [US5] Clean up:
  - Remove `/preview/hero` sandbox page
  - Delete old `frontend/src/components/sections/hero.tsx` and `project-card.tsx`
  - Remove unused imports across all files
  - Update sitemap if applicable

**Checkpoint**: Chat orb is polished. All performance budgets met. Accessibility verified. Existing tests pass. No dead code.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundation)**: No dependencies — start immediately. BLOCKS all other phases.
- **Phase 2 (US1 — Persistent UI)**: Depends on Foundation. Provides the shell all other stories live in.
- **Phase 3 (US2 — 3D Hero)**: Depends on Foundation. Runs parallel to US1 (different files).
- **Phase 4 (US3 — Home Sections)**: Depends on Foundation. Runs parallel to US1/US2 (different files).
- **Phase 5 (US4 — Inner Pages)**: Depends on Foundation + US3 (uses `<ProjectsBento />`, `<SkillsCluster />`).
- **Phase 6 (US5 — Chat Orb + Polish)**: Depends on all other phases complete. Final polish.

### Parallel Opportunities

| Phase | Can run parallel with | Files touched |
|---|---|---|
| Phase 1 (Foundation) | — (blocking) | `tailwind.config.js`, `globals.css`, `layout.tsx`, `next.config.js` |
| Phase 2 (US1 — Persistent UI) | Phase 3 (US2), Phase 4 (US3) | `components/layout/`, `components/motion/` |
| Phase 3 (US2 — 3D Hero) | Phase 2 (US1), Phase 4 (US3) | `components/hero/`, `hooks/` |
| Phase 4 (US3 — Home Sections) | Phase 2 (US1), Phase 3 (US2) | `components/sections/`, `app/page.tsx` |
| Phase 5 (US4 — Inner Pages) | — (depends on US3 components) | `app/projects/`, `app/about/`, `app/contact/` |
| Phase 6 (US5 — Chat Orb + Polish) | — (depends on everything) | `components/chat/`, global audits |

### Within Each User Story

- Core implementation before visual polish
- Components before page integration
- Story complete (checkpoint verified) before moving to next

---

## Implementation Strategy

### Sequential (Single Developer — Recommended)

1. **Phase 1**: Foundation → checkpoint verified
2. **Phase 2**: Persistent UI (US1) → checkpoint verified
3. **Phase 3**: 3D Hero (US2) → checkpoint verified
4. **Phase 4**: Home Sections (US3) → checkpoint verified
5. **Phase 5**: Inner Pages (US4) → checkpoint verified
6. **Phase 6**: Chat Orb + Polish (US5) → final verification

### MVP Delivery (Minimum Viable)

If timeboxed, deliver in this order:
1. Foundation → Persistent UI → these alone already show the new brand
2. Add Hero → home page is transformative with just hero + shell
3. Add Home Sections → full home page experience
4. Inner Pages → complete redesign
5. Chat Orb + Polish → final layer

---

## Verification Checklist

Run after each phase completion:

- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` passes (next lint)
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes (Jest)
- [ ] `npm run test:e2e` passes (Playwright) — once playwright config exists
- [ ] Playwright MCP screenshots match expected visual state
