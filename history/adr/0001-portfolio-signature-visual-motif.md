# ADR-0001: Portfolio Signature Visual Motif

> **Scope**: This ADR clusters the hero visual decision with its supporting infrastructure (shader pipeline, fallback strategy, reduced-motion policy, performance budget) because they only make sense together — changing the shader implies revisiting all four.

- **Status:** Accepted
- **Date:** 2026-05-30
- **Feature:** 003-polish-to-10
- **Context:** A deep review (PHR-0040) found the portfolio scores 8.0/10 — strong upper Tier-A — with engineering, accessibility, and performance all at or near ceiling. The bottleneck to Tier-S (Awwwards SOTD candidate) is **art direction**, specifically the hero. The current hero ships a 4000-point R3F particle field that is well-engineered but visually indistinguishable from the generic "AI engineer" portfolio pattern of 2026. Without a signature visual moment, no amount of polish elsewhere will produce the "ohh wow, next-level professional" reaction the user explicitly requested.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term — hero shader becomes the brand asset; expensive to redesign once shipped. ✓
     2) Alternatives: Three viable motifs evaluated (custom shader, agent-trace UI, ML-notebook). ✓
     3) Scope: Cross-cutting — touches hero, fallback, reduced-motion gating, perf budget, and future page-transition strategy. ✓ -->

## Decision

Adopt a **custom GLSL shader hero** as the portfolio's signature visual motif, replacing the generic 4000-point particle field. The decision cluster covers four coupled components that must ship together:

- **Hero rendering**: Replace `BufferGeometry` + `PointMaterial` (`frontend/src/components/hero/particle-field.tsx`) with a `drei`-provided `shaderMaterial` on a fullscreen plane. Fragment shader (~40 lines GLSL) implements a curl-noise flowfield. SDF-based text morphs between three states ("AI" → "Product" → "Mehdi") driven by a scroll-progress uniform. Uniforms exposed: `uTime`, `uMouse` (vec2), `uProgress` (float, 0–1), `uResolution`, `uReducedMotion` (bool).
- **Fallback strategy**: The existing `useCanRender3D()` gate (`frontend/src/hooks/use-reduced-motion.ts:20–36`) is preserved verbatim. When it returns false, the static `HeroFallback` gradient continues to render — no shader code paths reach mobile, low-CPU, narrow-viewport, or reduced-motion users. The fallback gradient is upgraded to a 3-stop animated CSS gradient (still GPU-cheap) so non-WebGL viewers still get *some* motion without WebGL.
- **Reduced-motion variant for WebGL viewers**: For desktop users with `prefers-reduced-motion: reduce` who *would otherwise* get the shader, the shader still runs but pauses `uTime` and freezes `uProgress` at 0.0 (renders one static SDF frame). This is the same pattern used elsewhere in the site (Lenis, page transitions) and means reduced-motion users still see a deliberate static composition rather than a flat gradient.
- **Performance budget**: Shader compilation cost (~5–15 ms first paint on mid-tier hardware) is hidden behind the existing `next/dynamic({ ssr: false })` boundary on `ParticleField`. No post-processing chain (no `<Bloom />`, no chromatic aberration) — the shader itself encodes glow via fragment math, keeping the bundle delta ≤ 2 KB gz vs. today's `PointMaterial` setup. JS first-paint budget of ≤ 300 KB gz (set in spec 002) remains binding.

The motif is **hero-only**. It explicitly does NOT extend to nav, command palette, section headers, or case-study chrome — those keep their current Vercel-aesthetic restraint. The contrast (one bold moment, then quiet) is the design.

## Consequences

### Positive

- **Signature differentiation**: A custom curl-noise + SDF-text shader is not something the next AI portfolio template can ship next week. It is reproducible knowledge but takes deliberate craft — the right signal.
- **Leverages existing investment**: R3F, `<Canvas>`, `drei`, `useCanRender3D`, `next/dynamic` boundary, and `HeroFallback` all stay. No new top-level dependency. Implementation lives almost entirely inside one file (`particle-field.tsx`) and a sibling GLSL file.
- **Aligned with strongest skill**: User's stated identity is "AI + product engineer." A shader that *spells* "AI / Product / Mehdi" on scroll *is* the positioning, encoded in pixels.
- **Reversible**: If the shader underperforms in user testing, swapping back to `BufferGeometry` points is a one-file revert. The `useCanRender3D` gate and `HeroFallback` are untouched, so the worst case is "back to the old hero."
- **Accessibility-preserving**: Reduced-motion users still get a deliberate static composition (paused shader on desktop, animated CSS gradient on mobile). Semantic H1/CTA layer in `hero-content.tsx` is unchanged — screen readers see the same content.
- **Performance-preserving**: No new render targets, no post-processing chain, no second WebGL pass. One fullscreen plane + one fragment shader is *less* GPU work than 4000 individually-positioned points with per-frame attribute updates.

### Negative

- **GLSL learning curve**: GLSL fragment shaders are a different mental model from TypeScript. The user has not shipped one before. Mitigation: scope is one well-trodden technique (curl noise + SDF text); reference implementations exist in `lygia` and on Shadertoy; the existing fallback de-risks a botched first version.
- **One-file blast radius is a feature and a risk**: A bad shader bug (NaN propagation, infinite loop in a `while`, uniform mismatch) can blank the entire hero. Mitigation: dev-time `console.error` on shader compile failure + the same `useCanRender3D` short-circuits we already trust.
- **Mobile experience is now further from desktop**: Mobile gets a CSS gradient; desktop gets a custom shader. The two will diverge in "feel." Mitigation: the upgraded animated gradient narrows the gap, and the contrast is acceptable because mobile portfolio viewers (recruiters skimming on a phone) are not the primary "wow" audience.
- **Hero becomes load-bearing for first impression**: If the shader is mediocre, the whole site falls back to 7.5/10. The previous particle field set a lower ceiling but also a lower floor. Mitigation: ship behind a feature flag (env var) during iteration; A/B against current hero on a staging URL before swapping production.
- **Lock-in to "one bold moment" art direction**: Choosing hero-only signature means we are *not* picking the agent-trace or ML-notebook motifs (see alternatives). Future polish work cannot retroactively add a system-wide motif without breaking the deliberate quiet/loud contrast.

## Alternatives Considered

**Alternative A — Agent-trace UI motif (rejected for now, documented for future)**

Treat AI engineering as the brand: section chrome renders as tool-call traces (`[01] ▸ tool_call: about.fetch()`), command palette rows as streaming-token reveals, case studies as `[TOOL] → [RESULT]` blocks. Monospace ordinals throughout.

- **Pros**: Cross-cutting motif (nav + palette + section headers + case studies) → higher motif density per visitor scroll. Uniquely tied to AI engineer identity. Cheap — typography and CSS, no shaders.
- **Cons**: Reads as gimmick if not sustained meticulously across *every* surface. High maintenance cost when adding new pages. Risk of feeling like Mangham/Wodniack derivative (terminal-aesthetic is becoming saturated in 2025–2026). Conflicts with the current restrained Vercel-aesthetic on inner pages — would force a larger redesign than 003 has scope for.
- **Why rejected**: Scope creep beyond 003-polish-to-10 (which is hero + polish, not full visual-system rebuild). Keep as candidate for a future feature spec (e.g., 004-agent-trace-system) once the hero shader has shipped and earned its place.

**Alternative B — ML notebook / REPL motif (rejected)**

Editorial Jupyter aesthetic: `In [1]:` / `Out [1]:` brackets on case studies, cell numbering on sections, plot-like skill visualization. Echoes Observable / Jupyter.

- **Pros**: Strong AI/ML positioning signal. Natural fit for case studies (problem → code → result reads as a notebook). `rehype-highlight` already planned in spec 003 (T103) → low marginal cost on case-study side.
- **Cons**: The "notebook" aesthetic has been done extensively by data-science portfolios and is now associated with junior data-bootcamp work, not senior AI engineering. Confines art direction to a niche (ML researcher) narrower than user's stated identity ("AI + product"). Hero is still unsolved — notebook chrome doesn't fix the generic-particle-hero problem; it just adds chrome elsewhere.
- **Why rejected**: Doesn't solve the actual bottleneck (the hero). Positioning narrower than user wants. Cosmetic overlap with junior-tier portfolios reduces signal value.

**Alternative C — Status quo: keep generic particle field, invest polish elsewhere (rejected)**

Skip the hero shader entirely; pour the days into case studies, Awwwards submission, content depth, and easter eggs.

- **Pros**: Zero risk. Zero GLSL learning. All effort goes into proven Tier-A polish patterns.
- **Cons**: Locks the site at 8.0–8.5/10 ceiling. The deep review explicitly identified the hero as the bottleneck; investing elsewhere is treating a symptom. Every minute spent on case-study polish above an indistinct hero is leveraged at a lower multiple.
- **Why rejected**: The user's prompt was specifically "make it next-level wow." Status quo is incompatible with the stated success criterion.

## References

- Feature Spec: `specs/003-polish-to-10/plan.md`, `specs/003-polish-to-10/tasks.md`
- Implementation Plan: To be added as new tasks in `specs/003-polish-to-10/tasks.md` (Phase 4 or a new Phase 8 — TBD by `/sp.tasks` re-run)
- Related ADRs: None yet (this is ADR-0001)
- Evaluator Evidence: `history/prompts/002-portfolio-redesign/0040-deep-review-rating-benchmarks.explainer.prompt.md` — review producing 8.0/10 score, benchmark set of 16 portfolios, and the gap-analysis that motivates this ADR
- Reference implementations: `lygia` GLSL library (curl noise, SDF primitives); Bruno Simon's `folio-2025` (shader-driven hero, MIT-licensed, public source); 14islands `r3f-scroll-rig` (DOM↔WebGL sync pattern, for future page-transition work)
- Related memory: `[[redesign-002-locked-decisions]]` — Direction C (3D particle hero, electric blue, lean motion budget) is amended, not superseded: lean budget and electric blue stay; particle field is replaced.
