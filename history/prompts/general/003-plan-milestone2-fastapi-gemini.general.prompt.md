---
id: "003"
title: "Plan Milestone 2 FastAPI backend and Gemini agent"
stage: plan
date: "2026-04-30"
surface: "agent"
model: "claude-opus-4-7"
feature: "001-portfolio-platform"
branch: "001-portfolio-platform"
user: "unknown"
command: "/sp.plan"
labels: ["plan", "milestone2", "fastapi", "gemini", "rag", "supabase"]
links:
  spec: "specs/001-portfolio-platform/spec.md"
  ticket: "null"
  adr: "null"
  pr: "https://github.com/mehdinathani/portfolio_website_project_aidd/pull/1"
files:
 - specs/001-portfolio-platform/plan.md
tests:
 - none
---

## Prompt

We are starting Milestone 2: FastAPI Backend & Gemini AI Agent.
Please create a detailed technical plan for this phase.
Context: We are using Supabase REST API (supabase-py), NOT raw PostgreSQL strings.
The plan must detail:
1. How `backend/src/src/db/session.py` will initialize the Supabase client.
2. The exact SQL schema for a Supabase RPC (Stored Procedure) named `match_knowledge` that uses `<=>` (cosine distance) to query the `knowledge_base` table based on a query embedding.
3. The API contracts for the CRUD endpoints in `api/v1/router.py`.
4. The architecture of the `/api/v1/chat` endpoint: How it takes user input -> calls Google `text-embedding-004` -> queries Supabase `match_knowledge` RPC -> sends context to Gemini 1.5 Flash.
Do not write the code yet, just update the plan documentation.

## Response snapshot

Analyzed existing codebase: session.py (Supabase singleton), config.py (Pydantic Settings), router.py (9 sub-routers), chat.py (RAG pipeline), rag_service.py (match_knowledge RPC call), gemini_service.py (text-embedding-004 + gemini-1.5-flash), match_knowledge RPC (010_create_match_rpc.sql), and all CRUD service/router files.

Updated `specs/001-portfolio-platform/plan.md` with:
1. Supabase client initialization pattern (singleton, lazy init, service role key)
2. Exact SQL for `match_knowledge` RPC with `<=>` cosine distance, HNSW index, 768-dim vectors
3. Full API contracts table for all 9 resource types (35+ endpoints) with method, path, description, auth
4. Complete `/api/v1/chat` architecture diagram (7-step RAG pipeline: cache → embed → retrieve → prompt → Gemini → lead detect → cache & return)
5. Implementation status table showing most components ✅ Done, API contracts and integration tests 🔲 Pending

## Outcome

- ✅ Impact: Plan.md fully documents Milestone 2 architecture; all 4 requested areas covered in detail
- 🧪 Tests: none run (planning phase only)
- 📁 Files: specs/001-portfolio-platform/plan.md (updated, ~330 lines of detailed technical plan)
- 🔁 Next prompts: /sp.tasks to generate task breakdown, then implement
- 🧠 Reflection: Most code already exists from prior work; plan documents and validates the architecture rather than designing from scratch. User specifically asked "do not write code yet, just update plan documentation" — followed exactly.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS — all 4 requested areas documented
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Run /sp.tasks to generate implementation tasks from this plan
