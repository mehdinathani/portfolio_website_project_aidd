---
id: 1
title: initialize-constitution-mehdi-ai-portfolio
stage: constitution
date: 2026-04-10
surface: agent
model: qwen
feature: none
branch: master
user: MEHDI
command: /sp.constitution
labels: ["constitution","portfolio","next.js","fastapi","supabase","gemini","rag"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

/sp.constitution Create the constitution for "Mehdi AI Portfolio".
Stack: Next.js App Router, FastAPI, Supabase (PostgreSQL + pgvector), Google Gemini API Free Tier.
Rules:
1. Strict separation of concerns (Next.js for UI, FastAPI for logic/AI).
2. Zero hardcoded data; everything must be fetched from Supabase.
3. Optimize for 0$ deployment costs.
4. AI Chatbot must utilize RAG against Mehdi's unique background (Finance to Tech transition).
5. All UI must be modern, accessible, and highly responsive.

## Response snapshot

Constitution initialized at v2.0.0 (major bump from v1.0.0 generic template to project-specific).
Added 5 project-specific principles (VII-XI) covering separation of concerns, zero hardcoded data,
zero-cost deployment, RAG-powered chatbot, and modern accessible UI. Added Project Stack, Data
Architecture, and AI/ML Constraints sections. All placeholders resolved. Templates reviewed — no
updates required (plan/spec/tasks templates are designed to be filled per-feature).

## Outcome

- ✅ Impact: Constitution now fully specifies stack, principles, and constraints for Mehdi AI Portfolio
- 🧪 Tests: N/A (constitution artifact)
- 📁 Files: .specify/memory/constitution.md (overwritten with concrete constitution)
- 🔁 Next prompts: /sp.specify to define first feature specification
- 🧠 Reflection: Constitution went from generic template (v1.0.0) to project-specific (v2.0.0) in one pass

## Evaluation notes (flywheel)

- Failure modes: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Define first feature spec via /sp.specify
