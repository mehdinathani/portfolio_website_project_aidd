---
id: 0029
title: UI redesign decisions locked
stage: explainer
date: 2026-05-29
surface: agent
model: claude-opus-4-7[1m]
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: mehdinathani
command: Locked UI redesign decisions for Direction C (3D Hero + 2D Body) and answered all open questions
links:
  spec: specs/002-portfolio-redesign/spec.md
  ticket: null
  adr: null
  pr: https://github.com/mehdinathani/portfolio_website_project_aidd/pull/1
files:
  - specs/002-portfolio-redesign/spec.md
tests:
  - none
---

## Prompt

User wanted to lock in UI redesign decisions and create a PHR for record-keeping. We had previously brainstormed 5 design directions (PHR 0027) and selected Direction C (3D Hero + 2D Body), then drafted the spec (PHR 0028). Today we answered the final 7 open questions to completely lock the redesign specifications.

## Response snapshot

Locked all UI redesign decisions for the portfolio platform. Summary of decisions:

**Previously locked:**
- Direction C: 3D Hero + 2D Body
- Audience: Mixed recruiters + clients
- Primary CTA: Book intro call
- Hero: Mouse-reactive particle field (R3F)
- Colors: Deep dark (#0a0a0b) + electric blue (#3b82f6) accent
- Projects: Bento grid layout
- Motion: Lean budget (3D hero only, mobile 2D fallback)
- Performance: JS ≤300KB, LCP ≤2s on Slow 4G

**Just answered (open questions):**
1. Hero copy: "AI engineer building intelligent systems"
2. Sub-copy: "I help businesses deploy AI solutions that actually work"
3. Booking: Cal.com (open source)
4. Routes: Absorb /experience and /skills into /about
5. Featured project: Current portfolio platform (AI chatbot)
6. Trust strip: No logos - use role/credentials line instead
7. Avatar: Illustrated/cartoon version

## Outcome

- ✅ Impact: All redesign decisions are now completely locked. Spec is ready for implementation planning.
- 🧪 Tests: n/a (decision locking turn)
- 📁 Files: 1 new PHR created for documentation
- 🔁 Next steps: Wire up Playwright MCP, vendor skill packs (motion, r3f, shadcn), then run /sp.plan to create detailed implementation plan

## Evaluation notes (flywheel)

- Failure modes observed: None - clean decision completion
- Graders run and results: n/a
- Next experiment: Proceed with implementation planning workflow