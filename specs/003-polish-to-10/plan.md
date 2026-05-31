# Implementation Plan: 003 — Polish to 10/10

**Branch**: `003-polish-to-10` | **Date**: 2026-05-29  
**Input**: `gap-analysis-10-10.md` (28 gaps across 6 categories)  
**Scope**: Public-facing frontend (`frontend/src/`) — no backend, schema, or admin changes

---

## Summary

The portfolio is well-engineered (6.5/10) but lacks the visual polish, trust signals, micro-interactions, and completeness that define a 10/10 craft signal. This plan addresses all 28 identified gaps across 7 implementation phases — from quick metadata wins to major motion overhauls.

**Strategy**: Ship vertical slices — each phase delivers independently testable value. Phase 0 (Foundation) and Phase 1 (UX Layer) are quick wins. Phases 2–4 are the core visual transformation. Phases 5–7 add new content surfaces and verification.

---

## Technical Context

**Stack**: Next.js 14.2, React 18.3, TypeScript 5.7, Tailwind 3, shadcn/ui, `motion` (framer-motion v12), Three.js/R3F, `lenis` (unused), `cmdk`, `lucide-react`, `@use-gesture/react`

**Constraints**:
- No backend changes, no schema changes, no admin changes
- All existing E2E tests must continue to pass
- Must respect `prefers-reduced-motion` and mobile fallbacks established in 002
- Performance budget: JS first-paint ≤ 300 KB gz, LCP ≤ 2.0s, CLS ≤ 0.05

---

## Dependency Installation

```bash
npm install focus-trap-react      # Focus trapping for modals (US1)
npm install sonner                # Lightweight toast notifications (US1)
npm install npm install rehype-highlight  # Code highlighting in project detail (US4)
# No new major dependencies — all animation, UI, and 3D libs already present
```

---

## Phase 0: Foundation — Quick Wins (P0 · Blocking)

**Purpose**: Low-effort, high-impact fixes that unblock everything else.

### Tasks

- [ ] T001 [FND] **Add OG image metadata** to `layout.tsx` — create `/public/og-image.png` (1200×630), add `openGraph.images` to metadata export
- [ ] T002 [FND] **Wire up lenis** in `layout.tsx` — import `react-lenis` / `lenis`, wrap `<body>` with smooth scroll, respect `prefers-reduced-motion`
- [ ] T003 [FND] **Add per-page metadata** — add `metadata.title` and `metadata.description` to `/projects`, `/about`, `/contact`, `/certifications` pages
- [ ] T004 [FND] **Add skip-to-content link** — first child of `<body>` in layout, target `#main-content` on `<main>`, styled as accessible top-of-page link
- [ ] T005 [FND] **Add JSON-LD structured data** — create `JsonLd` component or inject `<script type="application/ld+json">` in layout with Person schema + WebSite schema
- [ ] T006 [FND] **Add `sitemap.ts`** — create `app/sitemap.ts` listing all routes with `lastModified`, `changeFrequency`, `priority`
- [ ] T007 [FND] **Add `robots.txt`** — create `app/robots.ts` with sitemap reference
- [ ] T008 [FND] **Validate env vars at build time** — add check in `next.config.js` or a setup script for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BACKEND_URL`
- [ ] T009 [FND] **Remove dead code** — delete `use-mouse-position.ts` hook if unused; remove any stale imports found during grep
- [ ] T010 [FND] **Drive constants from profile API** — replace hardcoded email, social links, Cal.com URL with values from `profile` API response where possible; fallback to env vars

**Files touched**: `layout.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/certifications/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `next.config.js`, `public/og-image.png`, `hooks/use-mouse-position.ts`

**Checkpoint**: Lighthouse SEO ≥ 95, sitemap/robots accessible, OG image renders on social share preview, lenis smooth scroll active, skip-to-content tab-navigable.

---

## Phase 1: UX Layer — Loading, Navigation, Feedback (P1)

**Purpose**: Address the most visible UX gaps — blank loading states, missing feedback, modal accessibility, and navigation polish.

### Tasks

- [ ] T101 [UX] **Add `loading.tsx` files** — create `app/loading.tsx` (shared), `app/projects/loading.tsx`, `app/about/loading.tsx`, `app/certifications/loading.tsx` with skeleton shimmer matching section layouts
- [ ] T102 [UX] **Add Suspense boundaries** — wrap section components (`FeaturedProject`, `ProjectsBento`, `SkillsCluster`, `TestimonialsMarquee`) on the home page with `<Suspense fallback={...}>` for streaming SSR
- [ ] T103 [UX] **Add toast notification system** — integrate `sonner` (or `react-hot-toast`), create a `<Toaster />` in layout, add toasts for contact form submit, copy email, and any async actions
- [ ] T104 [UX] **Add focus trap to command palette** — wrap `<Command>` with `focus-trap-react`, trap focus when open, restore focus on close
- [ ] T105 [UX] **Add focus trap to chat sheet** — wrap chat sheet content with focus trap when open, add `Escape` key handler to close
- [ ] T106 [UX] **Add scroll-to-top button** — create `ScrollToTop` component (appears after 1 viewport scroll), renders a floating up-arrow, uses `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] T107 [UX] **Add page-load progress indicator** — create lightweight progress bar at top of viewport, triggered on route change via Next.js `useNavigation` or `usePathname` changes
- [ ] T108 [UX] **Animate mobile hamburger menu** — add `<AnimatePresence>` + `<motion.div>` slide+fade transition for the mobile nav panel
- [ ] T109 [UX] **Add live region announcements** — add `aria-live="polite"` region in layout, update on form submit success/error, chat message received, copy email action
- [ ] T110 [UX] **Improve keyboard navigation for skills cluster** — support arrow key navigation between chips, add `role="listbox"` / `role="option"` semantics

**Files touched**: `app/loading.tsx`, `app/projects/loading.tsx`, `app/about/loading.tsx`, `app/certifications/loading.tsx`, `app/layout.tsx`, `app/page.tsx`, `components/motion/command-palette.tsx`, `components/chat/chat-sheet.tsx`, `components/motion/scroll-to-top.tsx` (new), `components/layout/header.tsx`, `components/sections/skills-cluster.tsx`

**Checkpoint**: Pages show skeleton on slow load, toast appears on form submit, command palette traps focus, scroll-to-top visible after scroll, mobile menu animates, screen reader announces status changes.

---

## Phase 2: Design Polish — Visual Identity (P1)

**Purpose**: Transform the visual layer — distinctive typography, trust signals, scroll-driven animation, and form/chat component polish.

### Tasks

- [ ] T201 [DESIGN] **Add distinctive display font** — choose a secondary typeface (Satoshi, Cabinet Grotesk, or similar from Fontsource) for headings and editorial sections. Import via npm, add `--font-display` CSS variable, update `tailwind.config.js` `fontFamily.display`, apply to H1/H2 elements
- [ ] T202 [DESIGN] **Refresh hero copy** — replace "AI engineer. Shipping intelligent products." with a personal one-liner that differentiates. Coordinated with user.
- [ ] T203 [DESIGN] **Add scroll-triggered section reveals** — create `<RevealSection>` wrapper component using `motion` `whileInView` + `viewport={{ once: true, margin: '-100px' }}`. Wrap each section on home page, about, projects.
- [ ] T204 [DESIGN] **Add trust indicators** — create `<TrustStrip>` component: horizontal row of client/company logos (greyscale, hover → color) **OR** a stats bar ("5+ projects", "3+ years", "50+ clients", "10+ technologies"). Place between hero and about strip.
- [ ] T205 [DESIGN] **Polish contact form** — migrate to shadcn `Input`, `Select`, `Textarea`. Add floating label animation. Add success animation (checkmark morph via `motion.path`). Add inline validation feedback per field with `aria-invalid` and `aria-describedby`.
- [ ] T206 [DESIGN] **Re-theme chatbot components** — replace all hardcoded `bg-gray-*`, `bg-blue-*`, `border-gray-*` classes with design system CSS variables (`bg-background`, `bg-secondary`, `border-border`, `text-foreground`, `bg-primary`, etc.)
- [ ] T207 [DESIGN] **Polish 404 and error pages** — add subtle illustration (CSS geometric pattern or SVG), soften copy ("This page wandered off — let me help you back"), add search suggestions (links to /projects, /about, /contact)

**Files touched**: `tailwind.config.js`, `app/globals.css`, `components/hero/hero-content.tsx`, `components/motion/reveal-section.tsx` (new), `components/sections/trust-strip.tsx` (new), `components/sections/contact-form.tsx`, `components/chatbot/*`, `app/not-found.tsx`, `app/error.tsx`

**Checkpoint**: Distinctive typography visible on headings, sections animate in on scroll, trust indicators appear below hero, contact form has floating labels + success animation, chatbot matches site theme, 404/error pages have illustration.

---

## Phase 3: Motion & Micro-interactions (P2)

**Purpose**: Add the layer of craft that separates "functional" from "delightful" — parallax, hover animations, physics flourishes, and image reveals.

### Tasks

- [ ] T301 [MOTION] **Add parallax effects** — create `<ParallaxSection>` component using `useScroll` + `useTransform` from motion. Apply subtle (5–15px) parallax offset to background elements in about strip, testimonials, and contact CTA
- [ ] T302 [MOTION] **Add nav link hover animations** — add `motion.div` underline/bar animation on header nav links. Use `layoutId` for a persistent sliding indicator on the active route
- [ ] T303 [MOTION] **Polish `:focus-visible` rings** — ensure all interactive elements use the accent color ring via shadcn's `ring-offset-background` + `ring-ring`. Audit all raw elements
- [ ] T304 [MOTION] **Add skills chip physics jiggle** — add subtle spring-based wobble on skills chips when they enter viewport (use `useSpring` + `whileInView` or CSS keyframe triggered by IntersectionObserver)
- [ ] T305 [MOTION] **Add image reveals on project bento cards** — render `image_url` on bento cards with blur-up placeholder (`<Image placeholder="blur">` or low-res base64). Fade in on hover using `motion` `whileHover`
- [ ] T306 [MOTION] **Add hover card effect on project detail** — when navigating from bento to detail, use shared `layoutId` to animate the card surface into the detail hero (image + title morph)
- [ ] T307 [MOTION] **Add magnetic button to all CTAs** — wrap all primary CTAs (Book a call, View Projects, Send Message) in `<MagneticButton>` for consistent interaction

**Files touched**: `components/motion/parallax-section.tsx` (new), `components/layout/header.tsx`, `components/sections/skills-cluster.tsx`, `components/sections/projects-bento.tsx`, `components/sections/featured-project.tsx`, `app/projects/[id]/page.tsx`, `components/sections/contact-cta.tsx`

**Checkpoint**: Subtle parallax on scroll, nav link underline slides, focus rings are styled, skills chips wiggle on enter, project card images reveal on hover, bento→detail transition is smooth.

---

## Phase 4: Inner Pages & Features (P2)

**Purpose**: Upgrade project detail pages to rich case studies, add featured project media, embed Cal.com, persist chat history, and upgrade the particle field.

### Tasks

- [ ] T401 [INNER] **Upgrade project detail page** — render `image_url` as hero image, add image gallery section, add tech stack as interactive badges, add problem/approach/results sections from extended description, add code block highlighting with `rehype-highlight`
- [ ] T402 [INNER] **Add video/animated background to featured project** — create `<AnimatedProjectBackground>` that loops a muted autoplay video (lazy-loaded) **OR** renders CSS-animated screenshots if video unavailable. Apply to `<FeaturedProject>`
- [ ] T403 [INNER] **Embed Cal.com inline** — replace external link on `/contact` with an inline Cal.com embed via `<CalEmbed>` component (wrapper around Cal.com's embed script or iframe). Add loading skeleton while iframe loads
- [ ] T404 [INNER] **Persist chat history** — save messages to `localStorage` keyed by `sessionId`, restore on mount for session continuity. Add "Clear chat" button
- [ ] T405 [INNER] **Upgrade particle field shaders** — add color cycling (slow HSL shift), depth-of-field effect (size attenuation based on Z-distance), and subtle bloom via R3F post-processing pass. Budget: ≤ 50 KB added (lazy-loaded)

**Files touched**: `app/projects/[id]/page.tsx`, `components/sections/featured-project.tsx`, `app/contact/page.tsx`, `hooks/use-chat.ts`, `components/hero/particle-field.tsx`

**Checkpoint**: Project detail has hero image + gallery, featured project has animated background, Cal.com embed renders inline on /contact, chat survives page refresh, particle field has color transitions + depth.

---

## Phase 5: Completeness — New Content Surfaces (P3)

**Purpose**: Add the sections and features expected of a top-tier technical portfolio — blog, analytics, search, and structural extras.

### Tasks

- [ ] T501 [NEW] **Add analytics** — integrate Plausible (privacy-first, lightweight) via `<Script>` in layout. Use `data-domain` pointing to production URL. Verify with Plausible dashboard
- [ ] T502 [NEW] **Add site-wide search** — extend command palette to search project titles, descriptions, tech stacks, skills, and certifications via a client-side index (build-time generated JSON or on-the-fly filter)
- [ ] T503 [NEW] **Create "now" page** — add `/now` route with current focus areas, what I'm building, reading, and thinking about. Static content with optional API fallback. Add to nav and sitemap
- [ ] T504 [NEW] **Create "uses" page** — add `/uses` route listing tools, hardware, software, and config. Static content. Add to nav and sitemap
- [ ] T505 [NEW] **Add RSS feed** — create `app/feed.xml/route.ts` that generates an RSS 2.0 XML feed of projects + certifications as entries. Content syndication for aggregators

**Files touched**: `app/layout.tsx`, `app/now/page.tsx` (new), `app/uses/page.tsx` (new), `app/feed.xml/route.ts` (new), `components/motion/command-palette.tsx`, `components/layout/header.tsx`, `app/sitemap.ts`

**Checkpoint**: Analytics pings on page visit, command palette searches project data, /now and /uses pages render, RSS feed validates with W3C feed validator.

---

## Phase 6: Code Quality & Testing (P3)

**Purpose**: Strengthen the engineering foundation — tests, error handling, retries, and environmental hardening.

### Tasks

- [ ] T601 [CQ] **Add unit tests for key components** — write Jest + Testing Library tests for: `HeroSection`, `ContactForm`, `SkillsCluster`, `CommandPalette`, `MagneticButton`, `TiltCard`, `RevealText`. Focus on render + interaction + accessibility
- [ ] T602 [CQ] **Add error boundaries at section level** — create `<ErrorBoundary>` wrapper component, wrap each dynamic section (FeaturedProject, ProjectsBento, SkillsCluster, TestimonialsMarquee, ChatSheet). Catch + display section-specific fallback
- [ ] T603 [CQ] **Add API retry logic** — enhance `fetchApi` in `lib/api.ts` with exponential backoff (3 retries, 500ms base delay). Respect `Retry-After` header. Add `AbortController` timeout support
- [ ] T604 [CQ] **Add full-text search on projects page** — enhance the existing search to also match against `description` content (not just `title` + `short_description`). Consider adding `fuse.js` for fuzzy matching
- [ ] T605 [CQ] **Clean up dead code** — final audit: find and remove any unused imports, components, hooks. Run `ts-prune` or manual grep for unused exports

**Files touched**: `lib/api.ts`, `components/sections/*`, `components/motion/*`, `app/page.tsx`, `__tests__/*` (new), `components/shared/error-boundary.tsx` (new)

**Checkpoint**: All new tests pass (`npm test`), sections handle errors independently, API retries on transient failures, no dead exports.

---

## Phase 7: Audit & Verification (P0 · Final)

**Purpose**: Close the remaining spec compliance gaps — performance audit, accessibility pass, mobile testing, and full E2E verification.

### Tasks

- [ ] T701 [AUDIT] **Lighthouse performance audit** — run Lighthouse mobile (Slow 4G, Moto G4). Targets: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Fix regressions
- [ ] T702 [AUDIT] **Bundle analysis** — run `ANALYZE=true npm run build`, verify JS first-paint ≤ 300 KB gz. Tree-shake any oversized dependencies
- [ ] T703 [AUDIT] **Accessibility pass** — manual tab-walk through every route. Verify: skip-to-content works, all interactive elements reachable, focus order is logical, modals trap focus, `aria-*` attributes correct, screen reader reads hero content before canvas
- [ ] T704 [AUDIT] **Reduced-motion verification** — enable `prefers-reduced-motion: reduce`. Verify: no particles, no tilt, no magnetic, no parallax, instant transitions, all content still readable
- [ ] T705 [AUDIT] **Mobile testing** — test on real device (4G). Verify: no 3D shipped <768px, hero loads with fallback, scroll is smooth (no jank > 50ms), touch interactions work
- [ ] T706 [AUDIT] **Full E2E test suite** — run `npm run test:e2e`. Verify all existing Playwright tests pass
- [ ] T707 [AUDIT] **LCP/CLS/INP verification** — use WebPageTest or Chrome DevTools to verify LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms on mobile throttled profile

**Files touched**: None (verification only). Fix commits land in prior phases.

**Checkpoint**: All audits pass, budgets met, E2E suite green.

---

## Dependency Graph

```
Phase 0 (Foundation) ─── BLOCKS ───> Phase 1 (UX Layer)
  │                                       │
  └──> Phase 2 (Design Polish)            ├──> Phase 4 (Inner Pages)
  │         │                             │
  │         └──> Phase 3 (Motion) ────────┘
  │                                       │
  └──> Phase 5 (Completeness) ────────────┤
                                          │
              Phase 6 (Code Quality) ─────┤
                                          │
                    Phase 7 (Audit) <──────┘
```

**Parallel opportunities**:
- Phase 0, 5, 6 can run in parallel (different file sets)
- Phase 1 + 2 can run in parallel after Phase 0
- Phase 3 depends on Phase 2 (design tokens must be stable before motion)
- Phase 4 depends on Phase 1 + 2 (chat persistence needs toast + focus trap)
- Phase 7 blocks on everything else

---

## Acceptance Criteria

A 10/10 portfolio is achieved when ALL of these are true:

- [ ] Lighthouse mobile: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms on throttled mobile (Slow 4G, Moto G4)
- [ ] JS first-paint ≤ 300 KB gz (verified via bundle analyzer)
- [ ] All routes have unique meta titles and descriptions
- [ ] OG image renders on social share preview cards
- [ ] Sitemap.xml + robots.txt are accessible and valid
- [ ] JSON-LD structured data (Person, WebSite) injected in every page
- [ ] Skip-to-content link is first tabbable element on every page
- [ ] Loading skeletons display while data fetches complete
- [ ] Toast notifications confirm all async actions (form submit, copy, chat)
- [ ] Command palette and chat sheet trap focus when open
- [ ] Sections reveal with scroll-triggered animation (`whileInView`)
- [ ] Hero copy is a personal, memorable one-liner
- [ ] Trust indicators (stats bar or client logos) visible above the fold
- [ ] Contact form uses shadcn inputs with floating labels + success animation
- [ ] Chatbot components use design system colors (no hardcoded gray/blue)
- [ ] Nav links have hover underline animation; focus rings are styled
- [ ] Project bento cards reveal images on hover
- [ ] Featured project has animated background
- [ ] Project detail page has hero image + rich layout
- [ ] 404/error pages have illustration + helpful navigation
- [ ] Chat history persists across page refresh
- [ ] All existing E2E tests pass
- [ ] `prefers-reduced-motion: reduce` degrades gracefully (no particles, no tilt, no parallax, instant transitions)
- [ ] Mobile real-device test: hero loads with fallback, no 3D shipped, scroll smooth
- [ ] Full keyboard tab-walk passes on every route
- [ ] Screen reader reads hero semantic content before decorative canvas
- [ ] Analytics ping fires on page visit
- [ ] `/now` and `/uses` pages exist and are linked from nav
- [ ] RSS feed is valid and syndicatable

---

## Effort Summary

| Phase | Scope | Tasks | Files | Estimated Effort |
|-------|-------|:-----:|:-----:|:----------------:|
| 0 | Foundation — Quick Wins | 10 | ~12 | ½ day |
| 1 | UX Layer — Loading, Nav, Feedback | 10 | ~14 | 1 day |
| 2 | Design Polish — Visual Identity | 7 | ~12 | 1–2 days |
| 3 | Motion & Micro-interactions | 7 | ~10 | 1 day |
| 4 | Inner Pages & Features | 5 | ~6 | 1–2 days |
| 5 | Completeness — New Content | 5 | ~8 | 1 day |
| 6 | Code Quality & Testing | 5 | ~15 | 1–2 days |
| 7 | Audit & Verification | 7 | — | 1 day |
| **Total** | **All phases** | **56** | **~77** | **~7–10 days** |

---

## Risks

1. **Particle field shader work (T405)**: Custom GLSL shaders are unpredictable. Mitigation: budget 1 day max; if not visually compelling, ship a simpler color-cycling effect via JS instead.
2. **Blog section scope creep (implied in CM2)**: A full blog with database, CMS, and RSS is a separate project. This plan explicitly defers it — the gap analysis flagged it but Phase 5 focuses on lighter additions (/now, /uses).
3. **Lighthouse 90+ on mobile**: Performance budgets are tight. The 3D particle field already lazy-loads, but new motion (parallax, reveals) must be audited per-component. Mitigation: test with throttling after every phase; cut motion budget first if needed.
