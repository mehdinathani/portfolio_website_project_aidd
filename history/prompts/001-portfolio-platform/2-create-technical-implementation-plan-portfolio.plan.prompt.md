---
id: 2
title: create-technical-implementation-plan-portfolio
stage: plan
date: 2026-04-12
surface: agent
model: qwen-code
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: Mehdi
command: /sp.plan
labels: ["plan", "architecture", "ai-flow", "rag", "supabase-auth", "data-model"]
links:
  spec: specs/001-portfolio-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-portfolio-platform/plan.md
  - specs/001-portfolio-platform/research.md
  - specs/001-portfolio-platform/data-model.md
  - specs/001-portfolio-platform/quickstart.md
  - specs/001-portfolio-platform/contracts/api-contracts.md
  - QWEN.md (agent context updated)
tests: []
---

## Prompt

/sp.plan Create the technical implementation plan for Mehdi's Portfolio. 
Include the following in the architecture:
- Frontend: Next.js App Router deployed on Vercel.
- Backend: FastAPI deployed on a free host (Render/Koyeb).
- Database Schema: Supabase PostgreSQL tables for Users, Projects, Experience, Certifications, Leads, and KnowledgeBase (using pgvector).
- AI Flow: Explain how Next.js sends a chat payload to FastAPI, how FastAPI queries Supabase pgvector for context, and how it uses Gemini 1.5 Flash API to return structured JSON answers (Lead vs General Q&A).
- Auth: Supabase Auth integration for the /admin route.

## Response snapshot

Completed all Phase 0 and Phase 1 planning artifacts for the portfolio platform:

1. **plan.md** — Full technical implementation plan with:
   - Technical Context (all unknowns resolved)
   - Constitution Check: 11/11 principles PASS
   - Detailed 8-step AI Flow Architecture diagram (Next.js → FastAPI → pgvector → Gemini → structured JSON)
   - Supabase Auth integration flow (JWT verification for admin routes)
   - Complete source tree (frontend/ + backend/ with all files)
   - 9-table data model summary

2. **research.md** — 10 research decisions documented:
   - Next.js App Router, FastAPI, Gemini 1.5 Flash, Supabase Auth, Custom RAG, Gemini embeddings, Vercel+Render+Supabase, in-memory TTL cache, Gemini native JSON mode, lead categorization enum

3. **data-model.md** — Complete schema for 9 tables:
   - profiles, projects, project_skills, skills, experience, certifications, testimonials, knowledge_base (pgvector), leads
   - All constraints, indexes, state transitions (lead lifecycle), and migration order

4. **quickstart.md** — Environment setup, migration, dev server, smoke tests, troubleshooting, deployment instructions

5. **contracts/api-contracts.md** — 10 public endpoints + admin CRUD pattern:
   - Profile, Projects, Skills, Experience, Certifications, Testimonials, Chat (RAG), Leads (contact form), Health
   - Admin: CRUD for all resources + leads management + knowledge base management
   - Error codes, rate limiting details, structured JSON chat response format

6. **QWEN.md** — Agent context updated with Gemini 1.5 Flash, Supabase Auth, pgvector details

## Outcome

- ✅ Impact: Complete technical plan with AI flow architecture, auth flow, full data model, and API contracts
- 🧪 Tests: N/A (planning phase)
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/api-contracts.md, QWEN.md
- 🔁 Next prompts: Run /sp.tasks to break plan into executable tasks
- 🧠 Reflection: The AI flow architecture (8-step RAG pipeline with structured JSON output) and Supabase Auth JWT verification flow are the key architectural differentiators from the master plan

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
