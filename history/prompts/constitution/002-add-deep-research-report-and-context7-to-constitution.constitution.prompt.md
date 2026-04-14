---
id: 002
title: add-deep-research-report-and-context7-to-constitution
stage: constitution
date: 2026-04-12
surface: agent
model: qwen-code
feature: none
branch: main
user: Mehdi
command: /sp.constitution
labels: ["constitution", "resources", "context7", "deep-research-report"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

## Prompt

/sp.constitution please update that there is also a detailed file @deep-research-report.md is avaialble regarding portfolio details and our plan, also we have a mcp server context7 for latest documentation

## Response snapshot

Updated the constitution (v2.0.0 → v2.0.1, patch bump) to:
1. Add an "Authoritative Resources" section referencing `deep-research-report.md` as the single source of truth for portfolio content and planning.
2. Document the Context7 MCP server (`mcp__context7__*`) as the authoritative tool for fetching up-to-date library/framework documentation. Agents are now required to use Context7 MCP for library-specific questions.
3. Updated Sync Impact Report (no principle changes, no template updates needed).
4. Version bumped to 2.0.1 with Last Amended date set to 2026-04-12.

## Outcome

- ✅ Impact: Constitution now explicitly references deep-research-report.md and Context7 MCP as authoritative resources
- 🧪 Tests: N/A (documentation-only change)
- 📁 Files: `.specify/memory/constitution.md` — added Authoritative Resources section, updated version
- 🔁 Next prompts: Consider updating specs to reference deep-research-report.md for content requirements
- 🧠 Reflection: Clean additive change — no principles altered, only resource governance clarified

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
