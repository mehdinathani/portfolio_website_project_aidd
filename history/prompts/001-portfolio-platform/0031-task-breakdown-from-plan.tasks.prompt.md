---
id: 0031
title: Task breakdown from plan
stage: tasks
date: 2026-05-29
surface: agent
model: deepseek-v4-flash-free
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: mehdinathani
command: /sp.tasks — create tasks as per latest plan
labels: ["tasks", "spec-002", "portfolio-redesign"]
links:
  spec: specs/002-portfolio-redesign/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-portfolio-redesign/tasks.md
tests:
  - N/A — task creation, no tests run
---

## Prompt

/sp.tasks create tasks as per latest plan

## Response snapshot

Created task breakdown at `specs/002-portfolio-redesign/tasks.md` based on the implementation plan. Organized into 6 phases mapped to 5 user stories:

- **Phase 1: Foundation (P0, blocking)** — 14 tasks: shadcn init, deps install, tailwind rewrite, globals.css rewrite, next/font, bundle-analyzer, delete old ui/ files
- **Phase 2: US1 — Persistent UI (P1, MVP)** — 6 tasks: header rewrite, footer rewrite, page-transition, custom-cursor, command-palette, layout.tsx update
- **Phase 3: US2 — 3D Hero (P1, MVP)** — 8 tasks: mouse-position hook, reduced-motion hook, particle-field, hero-content, hero-fallback, hero-section orchestrator, preview sandbox, page integration
- **Phase 4: US3 — Home Sections (P2)** — 12 tasks: about-strip, featured-project, projects-bento, tilt-card, shared-layout, skills-cluster, marquee, contact-cta, reveal-text, magnetic-button, page integration
- **Phase 5: US4 — Inner Pages (P2)** — 10 tasks: projects page, project detail, about page, timeline-item restyle, contact page, contact-form restyle, certifications restyle, error/not-found restyle, remove old routes, add redirects
- **Phase 6: US5 — Chat Orb + Polish (P3)** — 8 tasks: orb, chat-sheet, layout update, performance audit, accessibility pass, mobile testing, run existing tests, cleanup

Total: 58 tasks across 6 phases. Parallel opportunities documented for single or multi-dev workflows. MVP delivery path described.

## Outcome

- ✅ Impact: Complete task breakdown ready. All tasks reference exact file paths and have clear checkpoints.
- 🧪 Tests: N/A — task creation output
- 📁 Files: 1 new tasks.md file
- 🔁 Next prompts: Begin implementation — start with Phase 1 Foundation tasks, or run `/sp.adr animation-stack-selection` first
- 🧠 Reflection: Tasks are organized for sequential single-dev execution (recommended) with parallel lanes documented if needed. Each phase ends with a verifiable checkpoint.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results: N/A
- Prompt variant: Direct create from plan
- Next experiment: Proceed with implementation — start T001/T002 (Playwright MCP + config)
