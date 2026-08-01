---
id: 0005
title: fix-hero-mask-reveal-and-wow-background
stage: green
date: 2026-06-05
surface: agent
model: claude-opus-4-8[1m]
feature: 003-polish-to-10
branch: 001-portfolio-platform
user: root
command: read latest phr / fix mask / wow background
labels: [hero, mask, shader, glsl, frontend, a11y, performance, polish]
links:
  spec: null
  ticket: null
  adr: history/adr/ADR-0001-signature-visual-motif.md
  pr: null
files:
  - frontend/src/components/hero/hero-mask-reveal.tsx
  - frontend/src/app/globals.css
  - frontend/src/components/hero/shaders/hero-flowfield.frag.glsl
tests:
  - Build: npm run build PASS (bundle unchanged at 87.7 kB shared)
  - Mask spotlight: --mask-r = 260px on hover over [data-mask-target], 0px when away (Playwright)
  - A11y tree (ariaSnapshot): hero exposes exactly 1 heading[level=1], 1 "Book a call", 1 "View Projects" (overlay inert+aria-hidden removes duplicate)
  - Shader: WebGL canvas renders rich electric-blue→cyan→violet flowfield with mouse bloom; headline legible on top
---

## Prompt

User requested fixing the hero "mask" effect (previously "not truly handled"), then
added: "also the background is very basic, the website should be like wow effect that this
developer is next level, not simple one, need to use best practices and modern animations etc."

## Response snapshot

Two fixes shipped on the hero (feature 003-polish-to-10, ADR-0001 shader motif):

### 1. Hero spotlight mask reveal — rewritten (hero-mask-reveal.tsx)
Old impl was structurally broken: rendered the full `HeroContent` TWICE (duplicate
`<h1>`/buttons/links in DOM + a11y tree), `setState` on every mousemove (re-rendered the
whole hero subtree ~60×/s), and the reveal SNAPPED because `transition: mask-size` doesn't
animate a radius baked into the gradient string.

New impl (confirmed intent = "spotlight text reveal"):
- `children` rendered ONCE as the interactive base; ONE absolutely-pinned overlay copy
  marked `aria-hidden` + `inert` + `pointer-events-none` (same markup → pixel-perfect
  alignment; removed from tab order & a11y tree so no duplicate buttons).
- Spotlight driven by CSS custom props (`--mask-x/y/r`) written imperatively via ref —
  matches the project's own `custom-cursor.tsx` pattern, no React state on move.
- Radius eased via `@property --mask-r` (registered in globals.css) so it transitions
  instead of snapping. Reduced-motion / touch → plain children, no overlay, no listeners.

### 2. "Wow" background — fragment shader rewrite (hero-flowfield.frag.glsl)
Root cause of "basic": the sophisticated curl-noise field was rendered at only
`alpha = 0.15 + 0.85*textAlpha`, so 85% of the screen was a near-invisible 15% wash over
near-black. Rewrote the fragment shader:
- Flowing light FILAMENTS via curl-advected fbm streaks (`flowStreaks`) instead of a flat wash.
- Rich palette ramp electric-blue → cyan → violet driven by flow intensity + drift.
- Strong interactive mouse bloom + bright core (fixed screen-space y flip).
- Energised SDF text (AI→PRODUCT→MEHDI morph) with glowing edge.
- Cinematic finish: radial vignette, film grain (anti-banding), Reinhard tone-map.
- Field now genuinely present (`alpha` ~0.55 base + flow/bloom/text), no longer a faint tint.

## Outcome

- ✅ Impact: Hero now has a working cursor-spotlight text reveal AND a high-impact animated
  background, with no a11y regression and no perf regression.
- 🧪 Tests: build PASS (87.7 kB unchanged — shaders are string assets); Playwright verified
  spotlight radius toggles 260px↔0px on headline hover; ariaSnapshot shows single
  heading/links (inert overlay invisible to AT).
- 📁 Files: hero-mask-reveal.tsx (full rewrite), globals.css (@property --mask-r + overlay
  styles + gradient text fill), hero-flowfield.frag.glsl (full rewrite).
- 🔁 Next prompts: tune palette/intensity to taste; consider raising the shader gate
  (useCanRender3D) thresholds; commit the working-tree hero changes.
- 🧠 Reflection: The "wow" was already computed by the curl-noise math — it was being
  thrown away at the final `alpha` line. Visual impact lived in the output stage, not the
  algorithm. The mask bug was a classic "render children twice" overlay anti-pattern; the
  fix is one base + one inert visual clone driven by CSS vars.

## Evaluation notes (flywheel)

- Failure modes observed: (1) `transition: mask-size` does not animate a gradient-embedded
  radius — must use a registered `@property` custom prop. (2) Headless Playwright fails
  `useCanRender3D()` (low hardwareConcurrency) → falls back to HeroFallback; override
  `navigator.hardwareConcurrency` via addInitScript to test the WebGL path. (3) Raw
  `.locator('h1')` / `getByRole` DOM counts don't reflect `inert` — use `ariaSnapshot()`
  for true a11y-tree verification.
- Graders run and results (PASS/FAIL): Build PASS, Mask spotlight PASS, A11y single-landmark PASS, Shader render PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): A/B the REVEAL_RADIUS (260px) and the violet
  drift weight (0.35) for the strongest "premium" read.
