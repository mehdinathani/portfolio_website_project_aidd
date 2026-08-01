---
id: 0028
title: Redesign direction C spec drafted
stage: spec
date: 2026-05-29
surface: agent
model: claude-opus-4-8[1m]
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: mehdinathani
command: (freeform redesign decision + spec drafting)
labels: ["spec", "ui", "redesign", "3d", "r3f", "particles", "framer-motion", "tailwind", "bento", "performance-budget", "accessibility"]
links:
  spec: specs/002-portfolio-redesign/spec.md
  ticket: null
  adr: null
  pr: https://github.com/mehdinathani/portfolio_website_project_aidd/pull/1
files:
 - specs/002-portfolio-redesign/spec.md (new)
tests:
 - none (spec only)
---

## Prompt

c

## Response snapshot

User picked Direction C (3D Hero + 2D Body) from the brainstorm in PHR 0027. Agent then ran 4 follow-up AskUserQuestion rounds to lock the remaining gating decisions:

| Decision | Value |
|---|---|
| Audience | Mixed — recruiters + clients |
| Primary CTA | Book an intro call |
| Hero element | Mouse-reactive particle field (R3F point cloud) |
| Motion budget | Lean — 3D hero only, mobile 2D fallback |
| Color mood | Deep dark + single accent |
| Accent | Electric blue `#3b82f6` |
| Background | `#0a0a0b` |
| Foreground | `#f5f5f4` |
| Projects layout | Bento grid (1 large + 4–6 smaller, tilt-on-hover) |

Drafted `specs/002-portfolio-redesign/spec.md` covering: locked decisions table, route IA (admin untouched), tech stack with package-by-package size budgets (`motion`, `three`, `@react-three/fiber`, `drei`, `lenis`, `@use-gesture/react`, `cmdk`, `lucide-react`, `shiki`), hard motion/perf budgets (JS ≤300KB, LCP ≤2s on Slow 4G, INP ≤200ms, CLS ≤0.05), accessibility contract (`prefers-reduced-motion`, semantic underlay for R3F, mobile fallback strategy keyed on width + hardwareConcurrency + reduced-motion), section-by-section homepage behavior (hero, about strip, featured project, projects bento, skills cluster, testimonials marquee, contact CTA, footer), persistent UI (custom cursor, glass header, ⌘K palette, chat orb), page transitions (shared layoutId for card→detail), full component migration table mapping every current file to keep/rewrite/replace, 12 acceptance criteria (Lighthouse, LCP, CLS, a11y, keyboard, screen reader, mobile, transitions, E2E parity), explicit non-goals (no sound, no i18n, no theme toggle, no blog, no admin restyle, no backend change), 7 open questions (hero copy, sub-copy, Cal.com vs Calendly, /experience+/skills absorption, featured project pick, trust strip logos, avatar/portrait), top-3 risks (R3F polish creep, perf budget creep, animation polish gap), and 7-step next-steps roadmap.

Surfaced ADR suggestion for animation/3D stack selection (`motion` over `gsap`, `r3f` over vanilla three, `lenis`, no postprocessing/sound) — meets all three significance tests.

Open questions in spec §12 are now the blocker for `/sp.plan`.

## Outcome

- ✅ Impact: User has a frozen-decision spec to react to. Direction C + particle field + bento + electric blue + lean motion budget are all locked. Spec covers tech stack with bundle budgets, accessibility contract with concrete fallback rules, route-level scope, component migration map, and acceptance criteria — concrete enough that `/sp.plan` can produce a route-by-route implementation plan without further design discussion.
- 🧪 Tests: n/a (spec stage). Acceptance criteria define the test surface for the eventual implementation.
- 📁 Files: 1 new file (`specs/002-portfolio-redesign/spec.md`). No code changed.
- 🔁 Next prompts: (a) User answers 7 open questions in §12 — copy, Cal.com choice, featured project, /experience+/skills fate, avatar approach; (b) `/sp.adr animation-and-3d-stack-selection`; (c) wire up Playwright MCP (blocking for visual iteration); (d) vendor `motion` + `r3f` + `shadcn` skill packs; (e) `/sp.plan` → emits `plan.md` with pinned versions, design tokens, route-by-route component tree; (f) `/sp.tasks` → vertical-slice task list (hero → bento → transitions → chat orb).
- 🧠 Reflection: The "Lean" motion budget pick was the single highest-ROI decision — it eliminates ~50% of the implementation complexity (no full 3D nav, no postprocessing, no shader-heavy bento) without losing the "first 8 seconds feels designed" payoff. The mobile fallback strategy (poster + CSS gradient + animated SVG when hardwareConcurrency<4 or width<768) is what lets us ship this without recruiters bouncing on phones.

## Evaluation notes (flywheel)

- Failure modes observed: none — clean decision flow via AskUserQuestion previews; user didn't need to type free-form to make any of the 6 design picks.
- Graders run and results (PASS/FAIL): n/a.
- Prompt variant (if applicable): n/a.
- Next experiment (smallest change to try): Before /sp.plan, build a single `/preview/hero` route in isolation (just the R3F particle field + H1 + CTA, on a throwaway branch) to validate the look in <2 days. If the particle hero doesn't land, pivot to "rotating glass shard" hero without sunk cost in the rest of the redesign. This is the §13 risk-1 mitigation made concrete.
