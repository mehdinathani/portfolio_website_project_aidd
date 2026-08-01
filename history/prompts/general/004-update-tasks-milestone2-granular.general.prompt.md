---
id: "004"
title: "Update tasks.md with granular Milestone 2 task list"
stage: tasks
date: "2026-04-30"
surface: "agent"
model: "claude-opus-4-7"
feature: "001-portfolio-platform"
branch: "001-portfolio-platform"
user: "unknown"
command: "/sp.tasks"
labels: ["tasks", "milestone2", "backend", "fastapi", "gemini", "rag"]
links:
  spec: "specs/001-portfolio-platform/spec.md"
  ticket: "null"
  adr: "null"
  pr: "https://github.com/mehdinathani/portfolio_website_project_aidd/pull/1"
files:
 - specs/001-portfolio-platform/tasks.md
tests:
 - none
---

## Prompt

Based on the newly generated Milestone 2 plan, please update `tasks.md`.
Create a highly granular, step-by-step task list for Milestone 2.
Ensure the tasks cover writing the SQL migration for the RPC, setting up the FastAPI routes, configuring the Gemini API SDK, and writing the specific RAG logic.

## Response snapshot

Rewrote the Milestone 2 section (Phase 2a-2i) in `specs/001-portfolio-platform/tasks.md` with 45 highly granular tasks (T021-T065):

1. **Phase 2a** (T021-T024): Supabase client config — config.py with Pydantic BaseSettings, requirements.txt, session.py singleton, vector_extension.py
2. **Phase 2b** (T025-T026): SQL migration — exact PL/pgSQL for `match_knowledge` RPC with `<=>` cosine distance, HNSW index, COMMENT; verification step
3. **Phase 2c** (T027-T035): Pydantic schemas — common.py (PaginatedResponse, ErrorResponse), per-resource response models, chat schemas (ChatRequest, ChatResponse, SourceRef), lead schemas with Literal types
4. **Phase 2d** (T036-T042): CRUD services via Supabase REST API — profile, project, skill, experience, certification, testimonial, lead services with exact method signatures and error handling
5. **Phase 2e** (T043): Gemini API SDK — lazy-init google.genai.Client, generate_embedding() with text-embedding-004 (768-dim), generate_chat_response() with gemini-1.5-flash
6. **Phase 2f** (T044-T046): RAG logic — rag_service.retrieve_context() with embed→RPC→filter pipeline, prompt_builder.build_system_prompt() with persona/context/history/lead-intent/grounding sections, cache_service with TTL dict
7. **Phase 2g** (T047-T056): FastAPI routes — router.py aggregating 9 sub-routers, 7 public GET endpoints, POST /chat with full pipeline (cache→retrieve→prompt→generate→lead-detect→cache→respond), health endpoint
8. **Phase 2h** (T057-T059): Middleware — LoggingMiddleware with structured JSON, RateLimiter with token bucket (15 RPM for /chat), main.py assembly with CORS, exception handlers
9. **Phase 2i** (T060-T065): Verification — 7 curl/httpx smoke tests, lead creation test, chat endpoint test with cache verification, Gemini embedding test, RAG retrieval test, rate limiter test

Each task includes exact file paths, function signatures, and enough detail for an LLM to implement without additional context.

## Outcome

- ✅ Impact: Milestone 2 now has 45 granular tasks (was ~37), each with file path, exact signatures, and implementation detail
- 🧪 Tests: 6 verification tasks (T060-T065) covering smoke tests, embedding, RAG, rate limiting
- 📁 Files: specs/001-portfolio-platform/tasks.md (updated Milestone 2 section, 45 tasks)
- 🔁 Next prompts: /sp.implement to start executing these tasks
- 🧠 Reflection: User asked to "update tasks.md" (not rewrite from scratch), so I preserved Milestones 1,3-8 intact and only replaced the Milestone 2 section with much more granular breakdown covering all 4 requested areas (SQL RPC, FastAPI routes, Gemini SDK, RAG logic)

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS — all 4 requested areas covered with high granularity
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
