---

description: "Task list for Portfolio & Lead Generation Platform"

---

# Tasks: Portfolio & Lead Generation Platform

**Input**: Design documents from `specs/001-portfolio-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Organization**: Tasks are grouped by milestone and user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Browse Portfolio, US2=AI Chatbot, US3=Contact Form, US4=Admin Dashboard, US5=Knowledge Base Auto-Embed)
- Include exact file paths in descriptions

---

## Milestone 1: Project Setup & Supabase DB/Vector Configuration

**Purpose**: Repository scaffolding, environment configuration, database schema, and seed data.

- [X] T001 Create frontend project structure with `npx create-next-app@latest frontend --typescript --tailwind --app`
- [X] T002 Create backend project structure with `mkdir backend && cd backend && python -m venv .venv` and create `requirements.txt` (fastapi, uvicorn, httpx, pydantic, pydantic-settings, supabase, psycopg2-binary, python-dotenv, openai)
- [X] T003 [P] Create frontend `.env.example` and `.env.local` in `frontend/.env.example` (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [X] T004 [P] Create backend `.env.example` in `backend/.env.example` (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, SUPABASE_JWT_SECRET)
- [X] T005 [P] Create `backend/src/__init__.py`, `backend/src/main.py` (FastAPI app stub with `/` ping endpoint), `backend/src/config.py` (pydantic-settings env loader)
- [X] T006 [P] Create `frontend/src/app/layout.tsx` (root layout with metadata), `frontend/src/app/page.tsx` (stub home page), `frontend/next.config.ts`, `frontend/tailwind.config.ts`
- [X] T007 [P] Create `migrations/` directory with `001_enable_pgvector.sql` (CREATE EXTENSION IF NOT EXISTS vector)
- [X] T008 Create `migrations/002_create_profiles.sql` — profiles table per data-model.md (14 columns, single-row constraint via trigger)
- [X] T009 [P] Create `migrations/003_create_projects.sql` — projects table with indexes (featured, order_index, created_at)
- [X] T010 [P] Create `migrations/004_create_skills.sql` — skills table + project_skills junction table with composite PK and indexes
- [X] T011 [P] Create `migrations/005_create_experience.sql` — experience table with indexes
- [X] T012 [P] Create `migrations/006_create_certifications.sql` — certifications table with indexes
- [X] T013 [P] Create `migrations/007_create_testimonials.sql` — testimonials table with CHECK constraints
- [X] T014 Create `migrations/008_create_knowledge_base.sql` — knowledge_base table with pgvector(768) column, HNSW index, JSONB metadata index
- [X] T015 Create `migrations/009_create_leads.sql` — leads table with category/status/source enums via CHECK constraints, indexes
- [X] T016 Create `migrations/seed_data.sql` — initial data: 1 profile row, 3 sample projects, 18 skills, 2 experience entries, 4 certifications, 2 testimonials, 7 knowledge base chunks with placeholder embeddings
- [X] T017 Create `backend/src/db/session.py` — async SQLAlchemy engine + session factory connecting to Supabase via psycopg2
- [X] T018 Create `backend/src/db/vector_extension.py` — pgvector column type registration for SQLAlchemy
- [ ] T019 Run all migrations against local Supabase: `npx supabase db push` and verify all 9 tables exist
- [ ] T020 Run seed data: `npx supabase db seed -- seed_data.sql` and verify data populated

**Checkpoint**: Database is live with 9 tables, seed data populated, pgvector extension enabled.

---

## Milestone 2: FastAPI Endpoints & Gemini AI Setup

**Purpose**: Backend foundation — all public API endpoints, Pydantic models, services, and Gemini API client.

- [X] T021 [P] Create `backend/src/models/base.py` — SQLAlchemy declarative base with id, created_at, updated_at mixin
- [X] T022 [P] Create `backend/src/models/profile.py` — Profile SQLAlchemy model
- [X] T023 [P] Create `backend/src/models/project.py` — Project SQLAlchemy model with tech_stack (ARRAY)
- [X] T024 [P] Create `backend/src/models/skill.py` — Skill + ProjectSkill SQLAlchemy models
- [X] T025 [P] Create `backend/src/models/experience.py` — Experience SQLAlchemy model
- [X] T026 [P] Create `backend/src/models/certification.py` — Certification SQLAlchemy model
- [X] T027 [P] Create `backend/src/models/testimonial.py` — Testimonial SQLAlchemy model
- [X] T028 [P] Create `backend/src/models/knowledge_base.py` — KnowledgeBase model with pgvector column (use `pgvector.sqlalchemy.Vector`)
- [X] T029 [P] Create `backend/src/models/lead.py` — Lead SQLAlchemy model
- [X] T030 [P] Create `backend/src/schemas/common.py` — Pydantic pagination schema (PaginatedResponse), error response schema
- [X] T031 Create `backend/src/schemas/profile.py` — Profile Pydantic response schema
- [X] T032 [P] Create `backend/src/schemas/project.py` — Project Pydantic request/response schemas (with nested skills)
- [X] T033 [P] Create `backend/src/schemas/skill.py` — Skill Pydantic schemas (flat + grouped response)
- [X] T034 [P] Create `backend/src/schemas/experience.py` — Experience Pydantic schemas
- [X] T035 [P] Create `backend/src/schemas/certification.py` — Certification Pydantic schemas
- [X] T036 [P] Create `backend/src/schemas/testimonial.py` — Testimonial Pydantic schemas
- [X] T037 [P] Create `backend/src/schemas/knowledge_base.py` — KnowledgeBase Pydantic schemas
- [X] T038 [P] Create `backend/src/schemas/lead.py` — Lead Pydantic request/response schemas
- [X] T039 Create `backend/src/services/profile_service.py` — get_profile() async function
- [X] T040 [P] Create `backend/src/services/project_service.py` — get_projects(), get_project_by_id() with skill joins
- [X] T041 [P] Create `backend/src/services/skill_service.py` — get_skills(), get_skills_grouped_by_category()
- [X] T042 [P] Create `backend/src/services/experience_service.py` — get_experience()
- [X] T043 [P] Create `backend/src/services/certification_service.py` — get_certifications()
- [X] T044 [P] Create `backend/src/services/testimonial_service.py` — get_testimonials()
- [X] T045 Create `backend/src/api/v1/router.py` — version router aggregating all public sub-routers
- [X] T046 Create `backend/src/api/v1/profile.py` — GET /api/v1/profile endpoint
- [X] T047 [P] Create `backend/src/api/v1/projects.py` — GET /api/v1/projects, GET /api/v1/projects/{id} endpoints
- [X] T048 [P] Create `backend/src/api/v1/skills.py` — GET /api/v1/skills endpoint (flat + grouped)
- [X] T049 [P] Create `backend/src/api/v1/experience.py` — GET /api/v1/experience endpoint
- [X] T050 [P] Create `backend/src/api/v1/certifications.py` — GET /api/v1/certifications endpoint
- [X] T051 [P] Create `backend/src/api/v1/testimonials.py` — GET /api/v1/testimonials endpoint
- [X] T052 Create `backend/src/middleware/logging.py` — structured logging middleware (log request method, path, duration, status)
- [X] T053 Create `backend/src/middleware/rate_limiter.py` — token bucket rate limiter (15 tokens/min, in-memory)
- [X] T054 Update `backend/src/main.py` — mount v1 router, add CORSMiddleware (allow frontend origin), attach logging middleware
- [X] T055 Create `backend/src/services/gemini_service.py` — Gemini API client: `generate_chat_response(prompt, history)`, `generate_embedding(text)` using `google-genai` SDK with Gemini 1.5 Flash
- [X] T056 Create `backend/src/services/cache_service.py` — in-memory TTL cache (dict-based, 5-min expiry) with `get(key)`, `set(key, value, ttl)`, `invalidate(key)`
- [X] T057 Test all public endpoints with curl/httpx: verify each returns 200 with seed data

**Checkpoint**: All 7 public GET endpoints working, Gemini client ready, cache and rate limiter ready.

---

## Milestone 3 (US1): Next.js Public Pages & Data Fetching

**Goal**: All public portfolio pages fetch data from FastAPI and render with modern, responsive, accessible UI.

**Independent Test**: Navigate every public page, verify all content renders from database, no hardcoded content, responsive at 320px/768px/1280px.

### Implementation for User Story 1

- [ ] T058 [P] [US1] Create `frontend/src/lib/api.ts` — FastAPI HTTP client with base URL from env, error handling, typed response functions (fetchProfile, fetchProjects, fetchSkills, fetchExperience, fetchCertifications, fetchTestimonials)
- [ ] T059 [P] [US1] Create `frontend/src/types/api.ts` — TypeScript interfaces for all API response types (Profile, Project, Skill, Experience, Certification, Testimonial)
- [ ] T060 [P] [US1] Create `frontend/src/components/ui/` — install shadcn/ui primitives (Button, Card, Badge, Input, Textarea, Dialog, Tabs)
- [ ] T061 [P] [US1] Create `frontend/src/components/layout/header.tsx` — site header with logo, navigation links (Home, About, Projects, Skills, Experience, Certifications, Contact), responsive hamburger menu
- [ ] T062 [P] [US1] Create `frontend/src/components/layout/footer.tsx` — site footer with social links (LinkedIn, GitHub, Twitter), copyright
- [ ] T063 [P] [US1] Create `frontend/src/components/sections/hero.tsx` — home page hero section with name, headline, profile image, CTA buttons (View Projects, Contact Me)
- [ ] T064 [P] [US1] Create `frontend/src/components/sections/project-card.tsx` — project card with title, short description, tech stack badges, image, links (live demo, GitHub)
- [ ] T065 [P] [US1] Create `frontend/src/components/sections/skill-badge.tsx` — skill badge with name, category color, proficiency indicator (dots/bars)
- [ ] T066 [P] [US1] Create `frontend/src/components/sections/timeline-item.tsx` — experience timeline item with company, role, dates, responsibilities
- [ ] T067 [US1] Update `frontend/src/app/layout.tsx` — integrate Header and Footer, set global metadata, font imports (Inter or similar)
- [ ] T068 [US1] Update `frontend/src/app/page.tsx` — home page: fetch profile + featured projects via Server Components, render Hero + featured projects grid
- [ ] T069 [US1] Create `frontend/src/app/about/page.tsx` — about page: fetch profile via Server Component, render bio, finance-to-tech narrative, social links, download resume button
- [ ] T070 [US1] Create `frontend/src/app/projects/page.tsx` — projects listing: fetch all projects via Server Component, render gallery grid with project cards, featured filter
- [ ] T071 [US1] Create `frontend/src/app/projects/[id]/page.tsx` — project detail page: fetch single project with skills, render full description, tech stack, links
- [ ] T072 [US1] Create `frontend/src/app/skills/page.tsx` — skills page: fetch skills grouped by category via Server Component, render category sections with skill badges/bars
- [ ] T073 [US1] Create `frontend/src/app/experience/page.tsx` — experience page: fetch experience entries, render chronological timeline
- [ ] T074 [US1] Create `frontend/src/app/certifications/page.tsx` — certifications page: fetch certifications, render list with name, issuer, date, credential link
- [ ] T075 [US1] Create `frontend/src/app/contact/page.tsx` — contact form page: name, email, message, category selector, client-side form submission to POST /api/v1/leads, validation, success/error states
- [ ] T076 [US1] Create `frontend/src/components/sections/contact-form.tsx` — reusable contact form component with React Hook Form + Zod validation, inline error messages
- [ ] T077 [US1] Add responsive styling: verify all pages render correctly at 320px (mobile), 768px (tablet), 1280px (desktop) breakpoints
- [ ] T078 [US1] Add accessibility: keyboard navigation for all interactive elements, ARIA labels on navigation, semantic headings (h1-h4), color contrast >= 4.5:1
- [ ] T079 [US1] Create `frontend/public/robots.txt` and `frontend/public/sitemap.xml`

**Checkpoint**: All public pages render with real data from database. Site is responsive and accessible. Contact form submits to backend.

---

## Milestone 4 (US2): RAG Chatbot Backend & Gemini Integration

**Goal**: POST /api/v1/chat endpoint with full RAG pipeline — embed query, retrieve from pgvector, construct prompt, call Gemini 1.5 Flash with JSON mode, return structured response with lead detection.

**Independent Test**: Send 10+ varied questions to chat endpoint, verify responses are grounded in knowledge base, sources returned, lead_intent flag works correctly.

### Implementation for User Story 2

- [ ] T080 [P] [US2] Create `backend/src/schemas/chat.py` — Pydantic schemas: ChatRequest (message, session_id, history), ChatResponse (response, lead_intent, lead_prompt, sources, fallback), SourceRef (source, similarity)
- [ ] T081 [P] [US2] Create `backend/src/services/rag_service.py` — RAG retrieval service: `retrieve_context(query: str, top_k: int = 5, threshold: float = 0.7)` — generates embedding via gemini_service, queries pgvector similarity, filters by threshold, returns top chunks
- [ ] T082 [US2] Create `backend/src/services/prompt_builder.py` — prompt construction service: `build_system_prompt(context_chunks: list, history: list)` — assembles role definition, retrieved context, grounding constraints, JSON output schema instruction
- [ ] T083 [US2] Update `backend/src/services/gemini_service.py` — add `generate_structured_chat(prompt: str, history: list, schema: dict) -> ChatResponse` using Gemini 1.5 Flash with `response_mime_type: "application/json"` and JSON schema
- [ ] T084 [US2] Create `backend/src/api/v1/chat.py` — POST /api/v1/chat endpoint: validate request → check cache → rate limit → rag_service.retrieve → prompt_builder.build → gemini_service.generate_structured_chat → return ChatResponse, apply cache on success
- [ ] T085 [US2] Integrate rate_limiter middleware into chat endpoint (15 RPM token bucket)
- [ ] T086 [US2] Integrate cache_service into chat endpoint (5-min TTL, cache key = hash of message)
- [ ] T087 [US2] Add error handling in chat endpoint: Gemini timeout → fallback response, Gemini 429 → queued/fallback, pgvector empty → fallback with flag, Supabase down → 503
- [ ] T088 [US2] Test chat endpoint with mock knowledge base entries: verify grounding (no hallucination), source attribution, lead_intent detection, fallback behavior
- [ ] T089 [US2] Test rate limiting: send 16 rapid requests, verify 16th returns 429 with Retry-After header

**Checkpoint**: Chat endpoint returns grounded JSON responses with lead detection, rate limiting, and caching operational.

---

## Milestone 5 (US3): Chatbot Widget on Frontend

**Goal**: Floating chat widget on all public pages — sends messages to FastAPI, displays structured responses, inline lead capture form when lead_intent=true.

**Independent Test**: Open chat widget on any page, send 5+ messages, verify responses display correctly, lead form appears when appropriate, lead submission stores in database.

### Implementation for User Story 3

- [ ] T090 [P] [US3] Create `frontend/src/hooks/use-chat.ts` — chat session state hook: messages array, session_id generation, send function, loading/error states
- [ ] T091 [P] [US3] Create `frontend/src/components/chatbot/chat-message.tsx` — chat message bubble component: user messages (right-aligned, blue), bot messages (left-aligned, gray), source citations, fallback styling
- [ ] T092 [P] [US3] Create `frontend/src/components/chatbot/chat-lead-form.tsx` — inline lead capture form: name, email, message fields, submits to POST /api/v1/leads with category="chatbot_capture", source="chatbot"
- [ ] T093 [US3] Create `frontend/src/components/chatbot/chat-widget.tsx` — floating chat panel: toggle button (bottom-right), message list, input field, send button, loading indicator, lead form integration (shows when lead_intent=true), session management
- [ ] T094 [US3] Update `frontend/src/app/layout.tsx` — embed ChatWidget as a client component in the root layout (rendered on all pages)
- [ ] T095 [US3] Add chat widget styling: floating button with animation, panel with max-height, scrollable message area, mobile-responsive (full-screen on small screens)
- [ ] T096 [US3] Test chat widget end-to-end: open widget, send message, verify response renders, trigger lead_intent response, fill inline form, verify lead stored in database

**Checkpoint**: Chat widget functional on all public pages with lead capture working.

---

## Milestone 6 (US4): Admin Dashboard & Supabase Auth

**Goal**: Protected admin dashboard with Supabase Auth login, CRUD forms for all content types, leads management view.

**Independent Test**: Login as admin, perform CRUD on each content type, verify changes appear on public pages. View leads, filter by category, update status.

### Implementation for User Story 4

- [ ] T097 [P] [US4] Install `@supabase/supabase-js` in frontend: `npm install @supabase/supabase-js`
- [ ] T098 [P] [US4] Create `frontend/src/lib/supabase-client.ts` — Supabase browser client initialization (uses NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] T099 [US4] Create `frontend/src/app/admin/login/page.tsx` — admin login page: email/password form, calls `supabase.auth.signInWithPassword()`, redirects to `/admin` on success, displays error on failure
- [ ] T100 [US4] Create `frontend/src/app/admin/layout.tsx` — admin auth guard: checks `supabase.auth.getSession()` on mount, redirects to `/admin/login` if not authenticated, renders admin sidebar navigation + main content area
- [ ] T101 [P] [US4] Create `frontend/src/app/admin/page.tsx` — admin dashboard overview: stats cards (total projects, total leads, new leads count)
- [ ] T102 [P] [US4] Create `frontend/src/app/admin/projects/page.tsx` — admin projects CRUD: table listing, add/edit/delete forms (title, descriptions, tech stack, URLs, featured, order_index, dates)
- [ ] T103 [P] [US4] Create `frontend/src/app/admin/skills/page.tsx` — admin skills CRUD: table listing grouped by category, add/edit/delete forms (name, category, proficiency slider, order_index)
- [ ] T104 [P] [US4] Create `frontend/src/app/admin/experience/page.tsx` — admin experience CRUD: table listing, add/edit/delete forms (company, role, dates, responsibilities rich text)
- [ ] T105 [P] [US4] Create `frontend/src/app/admin/certifications/page.tsx` — admin certifications CRUD: table listing, add/edit/delete forms (name, issuer, date, credential URL)
- [ ] T106 [P] [US4] Create `frontend/src/app/admin/testimonials/page.tsx` — admin testimonials CRUD: table listing, add/edit/delete forms (author name, role, company, quote, date, LinkedIn URL)
- [ ] T107 [P] [US4] Create `frontend/src/app/admin/leads/page.tsx` — admin leads management: table with columns (name, email, category, status, date), filter by category/status dropdown, click to update status (new → reviewed → replied → archived)
- [ ] T108 [US4] Create `backend/src/middleware/auth.py` — Supabase JWT verification middleware: extracts Bearer token, verifies via `supabase.auth.get_user(token)`, attaches user to request, returns 401 on failure
- [ ] T109 [US4] Create `backend/src/api/admin/router.py` — admin router aggregating all admin sub-routers
- [ ] T110 [P] [US4] Create `backend/src/api/admin/projects.py` — POST/PUT/DELETE /api/v1/admin/projects endpoints (protected by auth middleware)
- [ ] T111 [P] [US4] Create `backend/src/api/admin/skills.py` — POST/PUT/DELETE /api/v1/admin/skills endpoints
- [ ] T112 [P] [US4] Create `backend/src/api/admin/experience.py` — POST/PUT/DELETE /api/v1/admin/experience endpoints
- [ ] T113 [P] [US4] Create `backend/src/api/admin/certifications.py` — POST/PUT/DELETE /api/v1/admin/certifications endpoints
- [ ] T114 [P] [US4] Create `backend/src/api/admin/testimonials.py` — POST/PUT/DELETE /api/v1/admin/testimonials endpoints
- [ ] T115 [US4] Create `backend/src/api/admin/leads.py` — GET /api/v1/admin/leads (with category/status filters), GET /api/v1/admin/leads/{id}, PATCH /api/v1/admin/leads/{id} (status update)
- [ ] T116 [US4] Create `backend/src/schemas/chat.py` — add ChatRequest/ChatResponse if not already done in T080
- [ ] T117 [US4] Update `backend/src/main.py` — mount admin router under `/api/v1/admin`, ensure auth middleware applied to admin routes only
- [ ] T118 [US4] Wire admin frontend forms to backend admin API: each admin page uses `api.ts` functions with JWT from Supabase session
- [ ] T119 [US4] Test admin auth: verify unauthenticated access to `/admin` redirects to login, verify authenticated access shows dashboard, verify API calls without JWT return 401
- [ ] T120 [US4] Test admin CRUD: add a project via admin, verify it appears on public /projects page; update a skill, verify it appears on /skills; delete a testimonial, verify it disappears

**Checkpoint**: Admin dashboard fully functional with auth, all CRUD operations, and lead management.

---

## Milestone 7 (US5): Knowledge Base Auto-Embedding

**Goal**: When Mehdi creates/updates knowledge base entries via admin, embeddings are automatically generated via Gemini API.

**Independent Test**: Create a KB entry via admin, verify embedding is generated, ask chatbot a question that should retrieve that entry, verify it's included in sources.

### Implementation for User Story 5

- [ ] T121 [P] [US5] Create `backend/src/schemas/knowledge_base.py` — if not already done in T037, add KnowledgeBaseCreate, KnowledgeBaseUpdate, KnowledgeBaseResponse Pydantic schemas
- [ ] T122 [US5] Create `backend/src/services/knowledge_base_service.py` — CRUD: create_entry(content, source, metadata) → auto-generate embedding via gemini_service.generate_embedding(), update_entry(id, ...) → regenerate embedding, delete_entry(id) → remove row
- [ ] T123 [US5] Create `backend/src/api/admin/knowledge_base.py` — POST /api/v1/admin/knowledge-base (creates + embeds), PUT /api/v1/admin/knowledge-base/{id} (updates + re-embeds), DELETE /api/v1/admin/knowledge-base/{id}
- [ ] T124 [US5] Wire knowledge_base admin route into admin router (T109)
- [ ] T125 [US5] Create `frontend/src/app/admin/knowledge-base/page.tsx` — admin KB management: table listing entries with content preview, source type, add/edit/delete forms (content textarea, source dropdown, metadata JSON input), embedding status indicator
- [ ] T126 [US5] Test auto-embedding: create a KB entry with content "Mehdi completed Next.js certification at SMIT in 2025", verify embedding vector is populated in pgvector, ask chatbot "What certifications does Mehdi have?", verify the new entry is in sources

**Checkpoint**: Knowledge base auto-embedding operational. Chatbot retrieves newly added entries immediately.

---

## Milestone 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, accessibility audit, error handling, documentation, deployment readiness.

- [ ] T127 [P] Create `backend/src/api/v1/health.py` — GET /api/v1/health endpoint checking database connection, Gemini API availability, cache status
- [ ] T128 [P] Add structured error logging to all backend services (log exceptions with context: function name, params, traceback)
- [ ] T129 [P] Add `frontend/src/app/not-found.tsx` — custom 404 page with link back to home
- [ ] T130 [P] Add `frontend/src/app/error.tsx` — custom error boundary for client-side errors
- [ ] T131 Run Lighthouse audit on all public pages: verify performance score 90+, accessibility score 90+, FCP < 1.5s
- [ ] T132 Fix accessibility issues from audit: ensure all images have alt text, form fields have labels, color contrast >= 4.5:1, keyboard navigation works
- [ ] T133 [P] Optimize images: use Next.js Image component for all images, configure remote patterns for Supabase Storage URLs
- [ ] T134 [P] Create `frontend/public/robots.txt` and `frontend/public/sitemap.xml` if not already done
- [ ] T135 Verify quickstart.md: follow instructions from scratch on a clean machine, confirm both servers start and smoke tests pass
- [ ] T136 [P] Create `backend/pyproject.toml` with pytest, black, ruff configuration
- [ ] T137 [P] Create `frontend/package.json` scripts: `dev`, `build`, `start`, `lint`, `test`

---

## Dependencies & Execution Order

### Milestone Dependencies

- **Milestone 1 (Setup)**: No dependencies — can start immediately
- **Milestone 2 (Backend)**: Depends on M1 (database schema must exist for models/services)
- **Milestone 3 (US1 - Public Pages)**: Depends on M2 (API endpoints must be live for data fetching)
- **Milestone 4 (US2 - RAG Chatbot Backend)**: Depends on M2 (base services, Gemini client) + M1 (knowledge_base table)
- **Milestone 5 (US3 - Chat Widget)**: Depends on M4 (chat endpoint must work)
- **Milestone 6 (US4 - Admin Dashboard)**: Depends on M2 (admin API endpoints) + M1 (Supabase Auth setup)
- **Milestone 7 (US5 - Auto-Embed)**: Depends on M6 (admin KB page) + M4 (gemini_service embedding)
- **Milestone 8 (Polish)**: Depends on all previous milestones

### User Story Dependencies

```
M1 (Setup) → M2 (Backend Foundation)
                      ↓
        ┌─────────────┼─────────────┬──────────────┐
        ↓             ↓             ↓              ↓
    M3 (US1)      M4 (US2)     M6 (US4)      (Shared foundation)
    Public        RAG          Admin
    Pages         Backend      Dashboard
        ↓             ↓              ↓
    M5 (US3)      M7 (US5)
    Chat          Auto-Embed
    Widget
                      ↓
               M8 (Polish)
```

### Within Each Milestone

- Setup tasks marked [P] can run in parallel
- Models before services
- Services before endpoints
- Core implementation before integration
- Milestone complete before moving to next

### Parallel Opportunities

- M1: T003-T006 (env + project scaffolding) all parallel
- M1: T008-T015 (all migration files) parallel — but sequential execution
- M2: T021-T029 (all model files) parallel
- M2: T030-T038 (all schema files) parallel
- M2: T040-T044 (all service files) parallel
- M2: T047-T051 (all endpoint files) parallel
- M3 (US1): T058-T066 (all component/utility files) parallel
- M5 (US3): T090-T092 (hook + message + lead form) parallel
- M6 (US4): T102-T107 (all admin page files) parallel
- M6 (US4): T110-T114 (all admin endpoint files) parallel
- M8: T127-T130 (error handling + health) parallel

---

## MVP Scope (Milestones 1-3)

For the fastest path to a working demo:

1. Complete **Milestone 1** (Setup) — database live
2. Complete **Milestone 2** (Backend) — all GET endpoints working
3. Complete **Milestone 3** (US1) — all public pages rendering from database
4. **STOP and VALIDATE**: Navigate all pages, verify content from DB, confirm responsive design

This delivers a functional portfolio site that showcases Mehdi's background — the core value proposition. Chatbot, admin dashboard, and auto-embedding can follow in subsequent iterations.

---

## Parallel Example: Milestone 3 (US1)

```bash
# Launch all component files in parallel:
Task: "Create frontend/src/lib/api.ts"
Task: "Create frontend/src/types/api.ts"
Task: "Create frontend/src/components/ui/ (shadcn/ui setup)"
Task: "Create frontend/src/components/layout/header.tsx"
Task: "Create frontend/src/components/layout/footer.tsx"
Task: "Create frontend/src/components/sections/hero.tsx"
Task: "Create frontend/src/components/sections/project-card.tsx"
Task: "Create frontend/src/components/sections/skill-badge.tsx"
Task: "Create frontend/src/components/sections/timeline-item.tsx"
```

---

## Implementation Strategy

### MVP First (Milestones 1-3 Only)

1. Complete Milestone 1: Setup (database + migrations + seed)
2. Complete Milestone 2: Backend (all GET endpoints)
3. Complete Milestone 3: US1 (public pages)
4. **STOP and VALIDATE**: Navigate all pages, verify data from DB
5. Deploy to Vercel + Render for demo

### Incremental Delivery

1. M1 + M2 + M3 → Public portfolio live (MVP!)
2. + M4 + M5 → Chatbot added (differentiator)
3. + M6 → Admin dashboard (maintainability)
4. + M7 → Auto-embedding (AI quality)
5. + M8 → Polish (production readiness)

### Parallel Team Strategy

If multiple developers/agents available:

- **Agent A** (Database): M1 migrations + seed data
- **Agent B** (Backend): M2 endpoints + services (after M1 DB ready)
- **Agent C** (Frontend): M3 public pages (after M2 endpoints ready)
- **Agent D** (AI): M4 RAG pipeline + M5 chat widget (after M1+M2 ready)
- **Agent E** (Admin): M6 dashboard (after M2 admin endpoints ready)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US1-US5] labels map tasks to specific user stories for traceability
- Each milestone is independently completable and testable
- Total tasks: 137
- Parallel opportunities: ~60 tasks (44% of total)
- MVP scope: 79 tasks (Milestones 1-3)
