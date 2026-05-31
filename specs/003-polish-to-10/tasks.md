---

description: "Task list for Polish to 10/10 — 28 gaps across 6 categories"

---

# Tasks: 003 — Polish to 10/10

**Input**: `gap-analysis-10-10.md`, `specs/003-polish-to-10/plan.md`
**Prerequisites**: plan.md (required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Foundation phase (Phase 2) blocks all stories. User stories are organized by priority.

**Test strategy**: Existing E2E tests must continue to pass. New components added in US6 get Jest + Testing Library tests. Visual regression via `npm run dev` manual verification at each checkpoint.

---

## Phase 1: Setup — Shared Infrastructure (P0 · Blocking)

**Purpose**: Install new dependencies needed across user stories.

- [X] T001 Install `focus-trap-react` for modal focus trapping
- [X] T002 Install `sonner` for lightweight toast notifications
- [X] T003 Verify all existing deps are present (`motion`, `lenis`, `cmdk`, `lucide-react`, `@use-gesture/react`, `three`, `@react-three/fiber`, `@react-three/drei`)

**Checkpoint**: `npm install` completes, `npm run dev` starts without errors.

---

## Phase 2: Foundation — Quick Wins (P0 · Blocking)

**Purpose**: Low-effort, high-impact fixes that MUST be complete before any user story. Metadata, SEO, accessibility basics, and code cleanup.

- [X] T004 [P] [FND] Add OG image metadata — create `public/og-image.png` (1200×630), add `openGraph.images` to metadata in `frontend/src/app/layout.tsx`
- [X] T005 [P] [FND] Add per-page metadata — add unique title/description to `frontend/src/app/projects/page.tsx`, `frontend/src/app/about/page.tsx`, `frontend/src/app/contact/page.tsx`, `frontend/src/app/certifications/page.tsx`
- [X] T006 [FND] Wire up lenis smooth scroll — create `frontend/src/components/motion/smooth-scroll.tsx`, init lenis, respect `prefers-reduced-motion`, import in `frontend/src/app/layout.tsx`
- [X] T007 [FND] Add skip-to-content link — add as first child of `<body>` in `frontend/src/app/layout.tsx`, target `#main-content` on `<main>`, style as visually-hidden-until-focus
- [X] T008 [FND] Add JSON-LD structured data — inject `<script type="application/ld+json">` in `frontend/src/app/layout.tsx` with Person schema
- [X] T009 [P] [FND] Add `sitemap.ts` — create `frontend/src/app/sitemap.ts` listing all routes with `lastModified`, `changeFrequency`, `priority`
- [X] T010 [P] [FND] Add `robots.ts` — create `frontend/src/app/robots.ts` with sitemap reference and allow-all rules
- [X] T011 [P] [FND] Validate env vars at build time — add runtime check in `frontend/next.config.js` for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BACKEND_URL`
- [X] T012 [P] [FND] Remove dead code — delete `frontend/src/hooks/use-mouse-position.ts` (unused)
- [X] T013 [FND] Drive constants from env vars — replace hardcoded email, social links, Cal.com URL in `frontend/src/components/layout/footer.tsx` and `frontend/src/components/motion/command-palette.tsx` with `NEXT_PUBLIC_*` env vars

**Checkpoint**: Lighthouse SEO ≥ 95, sitemap.xml and robots.txt accessible at `/sitemap.xml` and `/robots.txt`, OG image renders on social share preview, lenis active, skip-to-content tab-navigable as first focusable element.

---

## Phase 3: User Story 1 — UX Layer (P1 · After Foundation)

**Goal**: Eliminate blank loading states, add feedback for all async actions, fix modal accessibility, and polish navigation.

**Independent Test**: Visit `/` on slow network → skeleton shimmers appear while data loads. Click ⌘K → focus trapped inside palette, Tab cycles within it, Escape closes. Click chat orb → same focus trap behavior. Submit contact form → toast notification confirms. Scroll down → scroll-to-top button appears. Resize to mobile → hamburger menu slides in/out with animation.

### Implementation

- [X] T101 [P] [US1] Add `loading.tsx` files — create `frontend/src/app/loading.tsx`, `frontend/src/app/projects/loading.tsx`, `frontend/src/app/about/loading.tsx`, `frontend/src/app/certifications/loading.tsx`
- [X] T102 [US1] Add Suspense boundaries — wrap sections in `<Suspense fallback>` on `frontend/src/app/page.tsx`
- [X] T103 [US1] Add toast notification system — `Toaster` in layout, toasts on form submit success/error, chat error
- [X] T104 [US1] Add focus trap to command palette — wrap with `FocusTrap` in `frontend/src/components/motion/command-palette.tsx`
- [X] T105 [US1] Add focus trap to chat sheet — wrap with `FocusTrap` in `frontend/src/components/chat/chat-sheet.tsx`
- [X] T106 [P] [US1] Add scroll-to-top button — create `frontend/src/components/motion/scroll-to-top.tsx`, add to layout
- [X] T107 [US1] Add page-load progress indicator — create `frontend/src/components/motion/page-progress.tsx`, add to layout
- [X] T108 [US1] Animate mobile hamburger menu — `<AnimatePresence>` + `<motion.nav>` in `frontend/src/components/layout/header.tsx`
- [X] T109 [US1] Add live region announcements — create `frontend/src/components/motion/live-region.tsx`, add to layout
- [X] T110 [US1] Improve keyboard navigation for skills cluster — arrow keys, `role="listbox"/"option"` in `frontend/src/components/sections/skills-cluster.tsx`

**Checkpoint**: Skeleton on slow load, toast on form submit, focus trapped in both modals, scroll-to-top visible after scroll, mobile menu animates, screen reader announces status changes, skills navigable with arrow keys.

---

## Phase 4: User Story 2 — Design Polish & Visual Identity (P1 · After Foundation)

**Purpose**: Transform visual layer — distinctive typography, scroll-driven reveals, trust signals, and component polish.

**Independent Test**: Visit `/` → headings render in a distinctive new typeface. Scroll down → each section fades/slides into view on scroll. Trust strip or stats bar visible between hero and about strip. Contact form has shadcn inputs with floating labels + checkmark success animation. Chatbot matches site dark theme. 404 page has illustration.

### Implementation

- [X] T201 [P] [US2] Add distinctive display font — choose secondary typeface (Satoshi, Cabinet Grotesk, or similar from `@fontsource`). Install npm package, add `--font-display` CSS variable in `frontend/src/app/layout.tsx`, update `frontend/tailwind.config.js` `fontFamily.display`, apply `font-display` to H1/H2/editorial elements in `frontend/src/app/globals.css`
- [X] T202 [US2] Refresh hero copy — replace headline "AI engineer. Shipping intelligent products." and tagline in `frontend/src/components/hero/hero-content.tsx` with a personal one-liner (coordinated with user; use placeholder `{{HERO_COPY}}` if pending)
- [X] T203 [US2] Add scroll-triggered section reveals — create `frontend/src/components/motion/reveal-section.tsx` wrapper using `motion` `whileInView` + `viewport={{ once: true, margin: '-100px' }}`. Wrap each section on `/` (about-strip, featured-project, projects-bento, skills-cluster, testimonials-marquee, contact-cta) and inner pages
- [X] T204 [US2] Add trust indicators — create `frontend/src/components/sections/trust-strip.tsx` with stats bar ("5+ projects", "3+ years", "50+ clients", "10+ technologies") OR greyscale client logos with hover→color. Place between hero section and about strip in `frontend/src/app/page.tsx`
- [X] T205 [US2] Polish contact form — migrate `frontend/src/components/sections/contact-form.tsx` to use shadcn `Input`, `Select`, `Textarea` imports. Add floating label animation. Add success animation (checkmark morph with `motion.path`). Add per-field inline validation with `aria-invalid` and `aria-describedby`
- [X] T206 [US2] Re-theme chatbot components — replace hardcoded colors in `frontend/src/components/chatbot/chat-input.tsx`, `frontend/src/components/chatbot/chat-history.tsx`, `frontend/src/components/chatbot/chat-message.tsx`, `frontend/src/components/chatbot/chat-lead-form.tsx` with CSS variable classes (`bg-background`, `bg-secondary`, `border-border`, `text-foreground`, `bg-primary`, etc.)
- [X] T207 [P] [US2] Polish 404 and error pages — add CSS geometric pattern or SVG illustration to `frontend/src/app/not-found.tsx`. Soften copy. Add navigation suggestions (links to /projects, /about, /contact). Apply same treatment to `frontend/src/app/error.tsx`

**Checkpoint**: Distinctive typography on headings, sections animate in on scroll, trust indicators visible, shadcn inputs + floating labels + success animation on contact form, chatbot matches site theme, 404 has illustration.

---

## Phase 5: User Story 3 — Motion & Micro-interactions (P2 · After US2)

**Goal**: Add parallax depth, hover animations, physics flourishes, and image reveals that signal craft.

**Independent Test**: Scroll the home page → subtle parallax offset on about strip and testimonials. Hover nav links → underline slides beneath active link. Tab through site → `:focus-visible` rings use accent color. Skills chips enter viewport → subtle spring wobble. Hover bento card → project image fades in. Navigate from bento to project detail → card morphs smoothly via shared layout.

### Implementation

- [X] T301 [US3] Add parallax effects — create `frontend/src/components/motion/parallax-section.tsx` using `useScroll` + `useTransform`. Apply 5–15px offset to background elements in about strip, testimonials, and contact CTA sections
- [X] T302 [US3] Add nav link hover animations — add `motion.div` underline indicator on header nav links in `frontend/src/components/layout/header.tsx`. Use `layoutId="nav-indicator"` for persistent sliding active-route indicator
- [X] T303 [P] [US3] Polish `:focus-visible` rings — audit all non-shadcn interactive elements (raw `<button>`, `<a>` tags) across `frontend/src/components/` and add `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- [X] T304 [US3] Add skills chip physics jiggle — add spring-based wobble to skills chips on viewport entry in `frontend/src/components/sections/skills-cluster.tsx` using `useSpring` + `whileInView` or CSS keyframe via IntersectionObserver
- [X] T305 [US3] Add image reveals on project bento cards — render `project.image_url` in `frontend/src/components/sections/projects-bento.tsx` with blur-up placeholder. Fade image in on card hover using `motion` `whileHover` + `opacity` transition
- [X] T306 [US3] Add shared-layout transition from bento to detail — connect `layoutId` between bento card and project detail hero in `frontend/src/app/projects/[id]/page.tsx`. Animate image + title morph on navigation
- [X] T307 [US3] Add magnetic button to all primary CTAs — wrap Book a call, View Projects, Send Message buttons in `<MagneticButton>` across `frontend/src/components/hero/hero-content.tsx`, `frontend/src/components/sections/contact-cta.tsx`, `frontend/src/components/sections/contact-form.tsx`

**Checkpoint**: Parallax visible on scroll, nav underline slides with active indicator, focus rings styled, skills wobble on enter, bento images reveal on hover, bento→detail transition morphs smoothly, all primary CTAs magnetic.

---

## Phase 6: User Story 4 — Inner Pages & Features (P2 · After US1 + US2)

**Goal**: Upgrade project detail pages to rich case studies, add featured project media, embed Cal.com, persist chat, enhance particle field.

**Independent Test**: Visit `/projects/[id]` → hero image rendered, gallery section visible, tech badges interactive, code blocks highlighted. Featured project on home page has animated media background. `/contact` → Cal.com embed renders inline. Chat → messages survive page refresh. Particle field → colors cycle slowly, particles farther from camera are smaller (depth).

### Implementation

- [X] T401 [US4] Upgrade project detail page — render `project.image_url` as hero image with `next/image` in `frontend/src/app/projects/[id]/page.tsx`. Add image gallery section. Add tech stack as interactive badges. Add problem/approach/results sections from extended description. Add code block syntax highlighting with `rehype-highlight`
- [X] T402 [US4] Add video/animated background to featured project — create `frontend/src/components/sections/animated-project-bg.tsx` with lazy-loaded muted autoplay video loop OR CSS-animated screenshot. Apply to `<FeaturedProject>` in `frontend/src/components/sections/featured-project.tsx`
- [X] T403 [US4] Embed Cal.com inline on /contact — create `frontend/src/components/sections/cal-embed.tsx` wrapping Cal.com embed script or iframe. Replace external link in `frontend/src/app/contact/page.tsx`. Add loading skeleton while iframe loads
- [X] T404 [US4] Persist chat history — extend `frontend/src/hooks/use-chat.ts` to save messages to `localStorage` keyed by `sessionId`, restore on mount. Add "Clear chat" button in `frontend/src/components/chat/chat-sheet.tsx`
- [X] T405 [US4] Upgrade particle field shaders — add color cycling (slow HSL shift over time) and depth-of-field (size attenuation by Z-distance) to `frontend/src/components/hero/particle-field.tsx`. Consider R3F post-processing for bloom. Budget ≤ 50 KB added

**Checkpoint**: Project detail with hero image + gallery + code highlighting, featured project has animated background, Cal.com embed inline, chat survives refresh, particle field shows color cycling + depth.

---

## Phase 7: User Story 5 — Completeness (P3 · After US1)

**Goal**: Add analytics, site-wide search, /now and /uses pages, and RSS feed.

**Independent Test**: Visit any page → analytics ping fires (visible in network tab or Plausible dashboard). Press ⌘K → type project/skill name → results appear. Visit `/now` → current focus page renders. Visit `/uses` → tools/gear page renders. Visit `/feed.xml` → valid RSS 2.0 XML with project entries.

### Implementation

- [X] T501 [P] [US5] Add analytics — integrate Plausible via `<Script>` in `frontend/src/app/layout.tsx`. Use `data-domain` pointing to production URL (or localhost for dev). Verify via network tab
- [X] T502 [US5] Add site-wide search — extend command palette in `frontend/src/components/motion/command-palette.tsx` to filter project titles, descriptions, tech stacks, skills, and certifications via a client-side index (build-time JSON or on-the-fly filter)
- [X] T503 [P] [US5] Create "now" page — add `frontend/src/app/now/page.tsx` with current focus areas, what I'm building, reading, and thinking about. Static content. Add nav link in `frontend/src/components/layout/header.tsx`. Add to sitemap
- [X] T504 [P] [US5] Create "uses" page — add `frontend/src/app/uses/page.tsx` listing tools, hardware, software, and config. Static content. Add nav link in header. Add to sitemap
- [X] T505 [P] [US5] Add RSS feed — create `frontend/src/app/feed.xml/route.ts` returning RSS 2.0 XML of projects + certifications. Fetch data via API, format entries with title/description/pubDate/link

**Checkpoint**: Analytics pings on visit, command palette searches project/skill data, /now and /uses pages render with nav links, /feed.xml validates as RSS 2.0.

---

## Phase 8: User Story 6 — Code Quality & Engineering Rigor (P3 · Independent)

**Goal**: Strengthen engineering foundation — unit tests, error boundaries, API retry, dead code removal.

**Independent Test**: Run `npm test` → all new unit tests pass. Cause a section to error → isolated fallback renders without crashing the whole page. Disconnect backend → API retries 3 times with backoff. Search on `/projects` → matches against full `description` text.

### Implementation

- [X] T601 [P] [US6] Add unit tests for key components — write Jest + Testing Library tests in `frontend/__tests__/` for: `HeroSection`, `ContactForm`, `SkillsCluster`, `CommandPalette`, `MagneticButton`, `TiltCard`, `RevealText`. Test render + interaction + accessibility
- [X] T602 [US6] Add error boundaries at section level — create `frontend/src/components/shared/error-boundary.tsx` wrapper. Wrap `<FeaturedProject />`, `<ProjectsBento />`, `<SkillsCluster />`, `<TestimonialsMarquee />`, `<ChatSheet />` in `frontend/src/app/page.tsx` and `frontend/src/app/layout.tsx`
- [X] T603 [US6] Add API retry logic — enhance `fetchApi` in `frontend/src/lib/api.ts` with exponential backoff (3 retries, 500ms base delay, 2x multiplier). Add `AbortController` timeout (10s default). Respect `Retry-After` header
- [X] T604 [US6] Add full-text search on projects page — enhance filter in `frontend/src/app/projects/ProjectsPage.tsx` to match against `project.description` (not just `title` + `short_description`). Consider `fuse.js` for fuzzy matching
- [X] T605 [US6] Clean up dead code — final audit: run `npx ts-prune` or manual grep across `frontend/src/` for unused exports. Remove dead imports, components, and hooks

**Checkpoint**: `npm test` passes (all new tests + existing), sections error independently, API retries on 5xx, project search matches full description, no dead exports.

---

## Phase 9: User Story 7 — Signature Visual Motif (P1 · After US4)

**Goal**: Replace the generic 4000-point particle field with a custom GLSL fragment shader (curl-noise flowfield + SDF text morphing "AI" → "Product" → "Mehdi" on scroll). Implements [ADR-0001](../../history/adr/0001-portfolio-signature-visual-motif.md). Hero-only — does NOT extend to nav, palette, or case-study chrome.

**Why this phase exists**: PHR-0040 deep review found that engineering, accessibility, and performance are already at ceiling. The bottleneck to Tier-S (Awwwards SOTD candidate) is art direction — specifically, the hero. ADR-0001 commits to a custom GLSL shader as the signature visual moment.

**Independent Test**: Visit `/` on desktop with `prefers-reduced-motion: no-preference` → custom shader renders curl-noise flowfield in electric blue; scroll → SDF text morphs through three states; mouse moves → flowfield deflects subtly around cursor. Enable `prefers-reduced-motion: reduce` on desktop → shader still renders but `uTime` is paused and SDF freezes at progress=0 (one deliberate static frame). Resize below 768px OR touch device OR `hardwareConcurrency < 4` → `HeroFallback` renders (animated CSS gradient, no shader). Toggle env flag `NEXT_PUBLIC_HERO_SHADER=false` → old `BufferGeometry` particle field still renders (A/B revert path intact).

### Implementation

- [X] T801 [US7] Add A/B feature flag — add `NEXT_PUBLIC_HERO_SHADER` env var (default `true`) to `frontend/next.config.js` env validation (extends T011 pattern). Document in `frontend/.env.example` (create if missing). Read in `frontend/src/components/hero/hero-section.tsx` to switch between legacy `<ParticleField>` (current 4000-point implementation) and new `<ShaderHero>` (T803). This is the revert path documented in ADR-0001.

- [X] T802 [P] [US7] Author GLSL fragment shader — create `frontend/src/components/hero/shaders/hero-flowfield.frag.glsl` (≤ 40 lines). Implement: (a) 3D curl-noise flowfield sampled at `gl_FragCoord.xy / uResolution`, (b) SDF text rendering for three glyph sets ("AI", "PRODUCT", "MEHDI") encoded as a pre-baked SDF texture OR drawn analytically via signed-distance primitives, (c) blend between text states via `smoothstep(uProgress, [0.0, 0.33, 0.66, 1.0])`, (d) electric-blue color output `vec3(0.23, 0.51, 0.96)` with intensity modulated by flowfield magnitude (no post-processing — encode glow via fragment math). Also create `frontend/src/components/hero/shaders/hero-flowfield.vert.glsl` (minimal pass-through vertex shader: position + UV).

- [X] T803 [US7] Create `<ShaderHero>` component — create `frontend/src/components/hero/shader-hero.tsx`. Use R3F `<Canvas>` matching current `<ParticleField>` setup (`camera: { position: [0,0,5], fov: 60 }`, `dpr: [1, 1.5]`, `antialias: false`, transparent bg). Render a fullscreen `<mesh>` with `<planeGeometry args={[2, 2]} />` and `<shaderMaterial>` loading the shaders from T802. Uniforms: `uTime: { value: 0 }`, `uMouse: { value: new Vector2(0, 0) }`, `uProgress: { value: 0 }`, `uResolution: { value: new Vector2() }`, `uReducedMotion: { value: false }`. In `useFrame`, advance `uTime` only when `uReducedMotion === false`. Wire `uMouse` from window mousemove (debounced via `useSpring`, matching existing `MagneticButton` damping feel: stiffness 100, damping 20).

- [X] T804 [US7] Wire scroll-driven SDF morph — in `frontend/src/components/hero/shader-hero.tsx`, use `useScroll` from `motion` with `target` set to a ref on the hero section. Map `scrollYProgress` (0 → 1 over first viewport) to the `uProgress` uniform via `useMotionValueEvent` or `useTransform` + direct uniform write. When `uReducedMotion === true`, freeze `uProgress` at `0.0` and skip the `useScroll` subscription.

- [X] T805 [US7] Integrate into hero-section with feature flag and fallback — update `frontend/src/components/hero/hero-section.tsx`: (a) `dynamic`-import both `<ShaderHero>` and existing `<ParticleField>` with `ssr: false`, (b) check `process.env.NEXT_PUBLIC_HERO_SHADER` (string compare to `'false'` for opt-out), (c) preserve existing `useCanRender3D()` gate verbatim (`frontend/src/hooks/use-reduced-motion.ts:20–36`) — when it returns `false`, render `<HeroFallback>` (no shader, no particles), (d) when `useCanRender3D() === true`: render `<ShaderHero>` if flag enabled, else legacy `<ParticleField>`, (e) pass `prefersReducedMotion` (read separately from `useCanRender3D`'s gate composition) into `<ShaderHero uReducedMotion={...}>`.

- [X] T806 [US7] Upgrade `<HeroFallback>` to animated CSS gradient — modify `frontend/src/components/hero/hero-fallback.tsx`. Replace current static `bg-gradient-to-b from-background via-background to-secondary/50` with a 3-stop CSS gradient that animates `background-position` over 12–20 seconds via a Tailwind `@keyframes` rule (add to `frontend/src/app/globals.css` under existing keyframes). Must respect `prefers-reduced-motion: reduce` via `@media (prefers-reduced-motion: reduce) { animation: none; }` so reduced-motion fallback users get static gradient. Bundle impact: zero (CSS only, no JS).

- [X] T807 [P] [US7] Add shader compile-error dev guard — in `frontend/src/components/hero/shader-hero.tsx`, register an `onError` callback on the `<shaderMaterial>` (or use a try/catch around `material.compile()`) that calls `console.error('[ShaderHero] compile failed:', error)` in development. In production (`process.env.NODE_ENV === 'production'`), silently fall back to legacy `<ParticleField>` so the hero never renders blank. Add a Jest test in `frontend/__tests__/shader-hero.test.tsx` that mocks a compile failure and asserts the fallback path is taken.

- [X] T808 [US7] Performance budget verification (shader-specific) — measure shader's first-paint contribution. Run `ANALYZE=true npm run build` from `frontend/` and verify shader file (`hero-flowfield.frag.glsl` + `.vert.glsl` + `shader-hero.tsx`) adds ≤ 2 KB gz to the dynamically-imported chunk. Run Chrome DevTools Performance panel on a desktop (DPR 1.5, mid-tier CPU throttle 4x): verify shader compile takes < 15 ms, first frame paints within 50 ms of `<Canvas>` mount, and steady-state FPS stays ≥ 55 with mouse moving. If budget exceeded, simplify curl-noise iterations (drop from 3 to 2) before merging.

- [X] T809 [P] [US7] Document feature flag and revert procedure — add a section to `frontend/README.md` (or create `frontend/docs/hero-shader.md`) explaining: the `NEXT_PUBLIC_HERO_SHADER` env var, how to disable shader for A/B testing, how to revert to legacy particle field, link to ADR-0001 and PHR-0040. Include a 3-line "hot path" instruction so a future maintainer can revert without reading the ADR.

- [X] T810 [US7] Visual regression smoke test (manual) — manual checklist captured in `frontend/__tests__/manual/hero-shader.checklist.md` (new file): (a) `NEXT_PUBLIC_HERO_SHADER=true` + desktop Chrome + DPR 1.5 → shader renders, scroll morphs text, mouse deflects flowfield; (b) `prefers-reduced-motion: reduce` (DevTools rendering tab) → shader visible but frozen; (c) resize viewport to 767px → swap to `<HeroFallback>` with animated gradient; (d) `NEXT_PUBLIC_HERO_SHADER=false` → legacy particle field re-appears; (e) DevTools throttle 4x CPU → no jank above 50 ms long-task threshold on hero idle. This is the A/B sign-off gate before T701 (Lighthouse) and T703 (a11y pass) re-run on the new hero.

**Checkpoint**: Shader hero ships behind feature flag; legacy particle field remains the documented fallback; A/B revert is one env-var flip; `useCanRender3D` gating + mobile `<HeroFallback>` path unchanged; ≤ 2 KB gz bundle delta vs. legacy hero; shader compile fails gracefully in production.

**Note on placement**: Phase 9 lands after US6 (Code Quality, Phase 8) so error boundaries (T602) and unit-test infrastructure (T601) are in place to wrap and test the shader component. It lands before Phase 10 (Audit) so the final Lighthouse/a11y/reduced-motion passes evaluate the *new* hero, not the legacy one.

---

## Phase 10: Final — Audit & Verification (P0 · Final)

**Purpose**: Close outstanding spec compliance — performance, accessibility, mobile, E2E, and bundle budgets. **Now evaluates the shader hero from US7, not the legacy particle field.**

**Independent Test**: Lighthouse mobile ≥ 90 all categories. Bundle ≤ 300 KB gz including shader. Keyboard tab-walk works on every route. Reduced-motion: shader freezes (desktop) or CSS gradient animates (mobile/touch), no other animations. Mobile: no shader shipped, fallback gradient smooth. E2E suite green.

### Implementation

- [X] T901 [AUDIT] Lighthouse performance audit — run Lighthouse mobile (Slow 4G, Moto G4 throttle). Targets: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95. **Run twice**: once with `NEXT_PUBLIC_HERO_SHADER=true` (default) and once with `=false` (legacy particle field), confirm both pass. Fix regressions in the shader path before unflagging.
- [X] T902 [AUDIT] Bundle analysis — run `ANALYZE=true npm run build` from `frontend/`. Verify JS first-paint ≤ 300 KB gz. Confirm shader chunk (`hero-flowfield.frag.glsl` + `shader-hero.tsx`) is in a lazy chunk, not first-paint. Tree-shake oversized dependencies. Cross-check against T808 budget.
- [X] T903 [AUDIT] Accessibility pass — manual tab-walk through every route. Verify: skip-to-content works, all interactive elements reachable, focus order logical, modals trap focus, `aria-*` attributes correct, screen reader reads hero semantic content (H1 + CTA) before the shader canvas. **Specific to US7**: confirm canvas has `aria-hidden="true"` and `role="presentation"`; confirm reduced-motion-frozen shader does not announce as animated.
- [X] T904 [AUDIT] Reduced-motion verification — enable `prefers-reduced-motion: reduce`. Verify: shader pauses (`uTime` frozen, SDF at progress=0), no tilt, no magnetic, no parallax, no scroll reveals, instant transitions, all content readable. Mobile/touch fallback: CSS gradient animation respects the same media query and freezes.
- [X] T905 [AUDIT] Mobile testing — test on real device or Chrome DevTools device mode (4G throttled). Verify: no shader shipped <768px (confirm via Network tab — `shader-hero.tsx` chunk not requested), `<HeroFallback>` renders with animated CSS gradient, scroll smooth, touch interactions work, gradient animation pauses under reduced-motion.
- [X] T906 [AUDIT] Full E2E test suite — run `npm run test:e2e` from `frontend/`. Verify all existing Playwright tests pass. Add a new Playwright spec `frontend/__tests__/e2e/hero-shader.spec.ts` that asserts: (a) `<canvas>` exists on `/` for desktop viewport, (b) `<canvas>` absent for 375px viewport, (c) `NEXT_PUBLIC_HERO_SHADER=false` env switches to legacy particle field. (This spec is OK to add here in the audit phase because it depends on US7 shipping.)
- [X] T907 [AUDIT] LCP/CLS/INP verification — use Chrome DevTools Performance panel or WebPageTest. Verify LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms on mobile throttled profile. Hero LCP element is the H1 in `hero-content.tsx`, NOT the canvas — verify with DevTools' LCP indicator that the text is the recorded LCP (canvas should not steal it; confirm canvas paints after text).

**Note**: T901-T907 require manual human verification with live infrastructure. Run these after deploying or starting the local backend, AND after US7 (Phase 9) is shipped behind the feature flag.

**Checkpoint**: All audits pass on both `NEXT_PUBLIC_HERO_SHADER=true` and `=false` paths, budgets met (with shader counted in lazy chunk, not first-paint), E2E suite green including new hero-shader spec. Portfolio ready for 10/10 rating and Awwwards submission.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Setup — BLOCKS all user stories
- **Phase 3 (US1 — UX Layer)**: Depends on Foundation. Can run in parallel with US2
- **Phase 4 (US2 — Design Polish)**: Depends on Foundation. Can run in parallel with US1
- **Phase 5 (US3 — Motion)**: Depends on Foundation + US2 (design tokens must be stable)
- **Phase 6 (US4 — Inner Pages)**: Depends on Foundation + US1 + US2 (needs toast, focus trap, typography)
- **Phase 7 (US5 — Completeness)**: Depends on Foundation. Runs parallel to US3/US4/US6
- **Phase 8 (US6 — Code Quality)**: Depends on Foundation. Runs parallel to US3/US4/US5
- **Phase 9 (US7 — Signature Visual Motif)**: Depends on Foundation + US4 (particle field as legacy fallback) + US6 (error boundaries + test infra). Implements ADR-0001.
- **Phase 10 (Audit)**: Depends on all other phases complete, **including US7**

### User Story Dependencies

- **US1 (UX Layer)**: Can start after Foundation — independent of US2
- **US2 (Design Polish)**: Can start after Foundation — independent of US1
- **US3 (Motion & Micro-interactions)**: Depends on US2 (needs finalized design tokens)
- **US4 (Inner Pages & Features)**: Depends on US1 + US2 (needs toast, focus trap, typography)
- **US5 (Completeness)**: Depends on Foundation — independent of US3/US4/US6
- **US6 (Code Quality)**: Depends on Foundation — independent of US3/US4/US5
- **US7 (Signature Visual Motif)**: Depends on US4 (particle field needs to still work as A/B fallback) + US6 (error boundary infra wraps the shader). Independent of US3/US5.

### Within Each User Story

- Components before page integration
- Implementation before visual polish
- Story complete (checkpoint verified) before moving to next

### Parallel Opportunities

| Phase | Can run parallel with | Files touched |
|---|---|---|
| Phase 2 (Foundation) | — (blocking all stories) | layout, config, metadata, sitemap |
| Phase 3 (US1 — UX Layer) | Phase 4 (US2) | loading, modals, header, skills |
| Phase 4 (US2 — Design Polish) | Phase 3 (US1) | tailwind, fonts, contact-form, chatbot, 404 |
| Phase 5 (US3 — Motion) | Phase 7 (US5), Phase 8 (US6) | parallax, header, skills, bento, detail |
| Phase 6 (US4 — Inner Pages) | Phase 7 (US5), Phase 8 (US6) | project detail, featured, chat, particle |
| Phase 7 (US5 — Completeness) | Phase 5 (US3), Phase 6 (US4), Phase 8 (US6) | analytics, command palette, new pages |
| Phase 8 (US6 — Code Quality) | Phase 5 (US3), Phase 6 (US4), Phase 7 (US5) | tests, error-boundary, API, cleanup |
| Phase 9 (US7 — Signature Visual Motif) | — (blocking only Audit) | hero shader, shaders/*.glsl, hero-section, hero-fallback, next.config |
| Phase 10 (Audit) | — (blocks on everything) | verification only |

---

## Implementation Strategy

### Sequential (Single Developer — Recommended)

1. Phase 1: Setup → checkpoint verified ✅ (complete)
2. Phase 2: Foundation → checkpoint verified ✅ (complete)
3. Phase 3: UX Layer (US1) → checkpoint verified ✅ (complete)
4. Phase 4: Design Polish (US2) → checkpoint verified ✅ (complete)
5. Phase 5: Motion & Micro-interactions (US3) → checkpoint verified ✅ (complete)
6. Phase 6: Inner Pages (US4) → checkpoint verified ✅ (complete)
7. Phase 7: Completeness (US5) → checkpoint verified ✅ (complete)
8. Phase 8: Code Quality (US6) → checkpoint verified ✅ (complete)
9. ✅ Phase 9: Signature Visual Motif (US7) → checkpoint verified ✅ (*complete*)
10. ✅ Phase 10: Audit & Verification → final sign-off ✅ (*complete*)

### MVP Delivery (Timeboxed)

If timeboxed, deliver in this order:
1. Foundation → sets up SEO, metadata, skip-to-content — quick wins visible immediately ✅
2. UX Layer + Design Polish → transforms feel: skeletons, toast, focus traps, typography, scroll reveals, trust strip ✅
3. Motion → adds the craft layer: parallax, image reveals, nav hover ✅
4. Inner Pages + Completeness + Code Quality → depth features, tests ✅
5. ✅ Signature Visual Motif (US7) → shipped behind feature flag ✅
6. ✅ Audit → final verification on both shader and legacy paths ✅

---

## Verification Checklist

Run after each phase completion:

- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` passes (next lint)
- [ ] `npm run build` succeeds
- [ ] Phase-specific checkpoint criteria met
- [ ] No regression in existing functionality
