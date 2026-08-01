---
id: 0002
title: ADR signature visual motif
stage: misc
date: 2026-05-30
surface: agent
model: claude-opus-4-8[1m]
feature: 003-polish-to-10
branch: 001-portfolio-platform
user: mehdi
command: /sp.adr portfolio-signature-visual-motif
labels: [adr, hero, glsl, shader, art-direction, polish-to-10, decision]
links:
  spec: specs/003-polish-to-10/plan.md
  ticket: null
  adr: history/adr/0001-portfolio-signature-visual-motif.md
  pr: null
files:
  - history/adr/0001-portfolio-signature-visual-motif.md
tests:
  - none (decision artifact)
---

## Prompt

/sp.adr portfolio-signature-visual-motif

(Slash command invoked by the user immediately after PHR-0040's deep review concluded with an ADR-suggestion for the signature visual motif. User passed only the topic; chosen direction was resolved via AskUserQuestion before drafting.)

## Response snapshot

Executed the `/sp.adr` workflow:

1. **Loaded planning context**: ran `check-prerequisites.sh` (resolved to 001-portfolio-platform per current branch, but ADR subject belongs to 003-polish-to-10 — corrected manually). Read `specs/003-polish-to-10/plan.md` + `tasks.md` for current state.
2. **Extracted decision cluster**: Hero visual + supporting infra (shader, fallback strategy, reduced-motion policy, perf budget) — clustered because they only make sense together.
3. **Checked existing ADRs**: `history/adr/` did not exist yet. This is ADR-0001.
4. **Significance test (Measure gate)**: PASSED all four checks — clustered decision, alternatives documented, pros/cons explicit, concise but detailed.
5. **Resolved ambiguity**: User prompt was `portfolio-signature-visual-motif` (category, not choice). Used AskUserQuestion with three substantive options surfaced in PHR-0040 (custom GLSL shader, agent-trace UI, ML-notebook). User selected **Custom GLSL shader hero (Recommended)**.
6. **Created ADR**: ran `create-adr.sh --title "Portfolio Signature Visual Motif" --json` → ADR-0001 at `history/adr/0001-portfolio-signature-visual-motif.md`. Filled all placeholders; verified zero `{{` remain.
7. **Updated memory**: amended `redesign-002-locked-decisions.md` (hero element swapped, all other locked decisions preserved); created new `adr-0001-signature-visual-motif.md` memory; updated `MEMORY.md` index.

ADR decision summary: Replace generic 4000-point particle field with a custom GLSL fragment shader (curl-noise flowfield + SDF text morphing AI → Product → Mehdi on scroll). Hero-only — does NOT extend to nav, palette, or case-study chrome. `useCanRender3D` gate + `HeroFallback` preserved verbatim. Reduced-motion desktop users get paused shader (one static frame). No post-processing chain; ≤ 2 KB gz bundle delta; 300 KB first-paint budget from spec 002 stays binding.

## Outcome

- ✅ Impact: ADR-0001 committed to disk as the authoritative record of the signature-visual-motif decision for 003-polish-to-10. Memory amended so future sessions don't re-litigate the hero choice. Lays implementation track for next `/sp.tasks` re-run to add shader tasks to spec 003.
- 🧪 Tests: None — decision artifact only, no code changes.
- 📁 Files: Created `history/adr/0001-portfolio-signature-visual-motif.md`. Amended memory: `redesign-002-locked-decisions.md`, `MEMORY.md`. New memory: `adr-0001-signature-visual-motif.md`.
- 🔁 Next prompts: `/sp.tasks 003-polish-to-10` to fold shader implementation into the tasks list (new Phase 8 or extension of Phase 4). Then either `/sp.implement` for the shader spike or a 1-day manual GLSL prototype behind a feature flag.
- 🧠 Reflection: User passed only the topic, not the chosen direction. Asking via AskUserQuestion with three concrete options + ASCII previews surfaced a clean decision in one round-trip instead of speculating. The check-prerequisites script returning the wrong feature (001 vs 003) is a workflow gap worth noting — the script binds to current branch, but ADR topics frequently cross feature boundaries. Documenting which feature the ADR belongs to is the user's call, not git's.

## Evaluation notes (flywheel)

- Failure modes observed: `check-prerequisites.sh` resolved FEATURE_DIR to the git branch (`001-portfolio-platform`) rather than the feature the ADR is about (`003-polish-to-10`). Caught and corrected by reading the user's intent + scanning `specs/`. Worth a small future fix: the `/sp.adr` command could accept `--feature` flag or detect from the topic slug.
- Graders run and results (PASS/FAIL): All four Measure-gate checks PASSED — (a) clustered decision not atomic, (b) at least one alternative with rationale (three alternatives documented), (c) explicit pros/cons for chosen + alternatives, (d) concise but detailed. Placeholder-resolution check: PASS (zero `{{` remain in ADR file).
- Prompt variant (if applicable): N/A — single round.
- Next experiment (smallest change to try): On next `/sp.adr` invocation, pre-populate the feature dropdown from `specs/*/` rather than relying on `check-prerequisites.sh` alone. Measures: avoid the 001-vs-003 misroute observed here.
