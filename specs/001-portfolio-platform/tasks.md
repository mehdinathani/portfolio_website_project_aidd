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
- [X] T017 Create `backend/src/db/session.py` — Supabase client utility using `supabase-py` REST API (not direct PostgreSQL connection)
- [X] T018 Create `backend/src/db/vector_extension.py` — pgvector column type registration for SQLAlchemy
- [X] T018b Create `migrations/010_create_match_rpc.sql` — Supabase RPC function `match_knowledge` for vector similarity search using cosine distance `<=>`
- [X] T019 Run all migrations against local Supabase: `npx supabase db push` and verify all 9 tables exist
- [X] T020 Run seed data: `npx supabase db seed --seed_data.sql` and verify data populated

**Checkpoint**: Database is live with 9 tables, seed data populated, pgvector extension enabled.

---

## Milestone 2: FastAPI Backend & Gemini AI Agent

**Purpose**: Backend foundation — Supabase client, SQL RPC migration, all CRUD + chat endpoints, Gemini SDK, RAG pipeline, and shared infrastructure.

### Phase 2a: Supabase Client & Configuration

- [X] T021 [P] Create `backend/src/config.py` — Pydantic BaseSettings class with fields: `supabase_url` (default `http://127.0.0.1:54321`), `supabase_service_role_key`, `supabase_anon_key`, `supabase_jwt_secret`, `gemini_api_key`; set `env_file=".env"`, `extra="ignore"`
- [X] T022 [P] Create `backend/requirements.txt` — dependencies: `fastapi`, `uvicorn[standard]`, `supabase`, `google-genai`, `pydantic-settings`, `slowapi`, `httpx`
- [X] T023 Create `backend/src/db/session.py` — `get_supabase() -> Client` function: lazily creates singleton via `create_client(settings.supabase_url, settings.supabase_service_role_key)`, stores in global `_supabase`, returns `Client`; imports from `supabase import create_client, Client`
- [X] T024 Create `backend/src/db/vector_extension.py` — register `pgvector.sqlalchemy.Vector` as SQLAlchemy type for `vector` columns (implements `bind_expression` and `result_processor` methods)

### Phase 2b: SQL Migration — match_knowledge RPC

- [X] T025 Create `supabase/migrations/010_create_match_rpc.sql` — PL/pgSQL function `match_knowledge(query_embedding vector(768), match_count int DEFAULT 5, similarity_threshold float DEFAULT 0.7)` returning TABLE(id uuid, content text, metadata jsonb, source text, source_id uuid, similarity float); body: `SELECT kb.id, kb.content, kb.metadata, kb.source, kb.source_id, 1 - (kb.embedding <=> query_embedding) AS similarity FROM knowledge_base kb WHERE 1 - (kb.embedding <=> query_embedding) > similarity_threshold ORDER BY kb.embedding <=> query_embedding LIMIT match_count`; add HNSW index `idx_knowledge_base_embedding_hnsw ON knowledge_base USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64)`; add COMMENT ON FUNCTION
- [X] T026 Verify RPC: run `npx supabase db push` then test with `supabase rpc match_knowledge '{"query_embedding": "[0.1, 0.2, ...]" , "match_count": 1}'` with a dummy 768-dim vector to confirm function executes without error

### Phase 2c: Pydantic Models (Schemas)

- [X] T027 [P] Create `backend/src/schemas/common.py` — `PaginatedResponse(BaseModel)` with generic `items: List[T]`, `total: int`, `page: int`, `page_size: int`; `ErrorResponse(BaseModel)` with `detail: str`, `code: Optional[str]`
- [X] T028 Create `backend/src/schemas/profile.py` — `ProfileResponse(BaseModel)`: id, full_name, headline, bio, email, phone, location, linkedin_url, github_url, twitter_url, resume_url, profile_image_url, created_at, updated_at
- [X] T029 [P] Create `backend/src/schemas/project.py` — `ProjectResponse(BaseModel)` with id, title, description, short_description, tech_stack (List[str]), project_url, github_url, image_url, featured, order_index, start_date, end_date, created_at; `ProjectsListResponse(BaseModel)` wrapping `List[ProjectResponse]`
- [X] T030 [P] Create `backend/src/schemas/skill.py` — `SkillResponse(BaseModel)`: id, name, category, proficiency, icon_url, order_index; `SkillsGroupedResponse(BaseModel)`: category (str), skills (List[SkillResponse]); `SkillsListResponse(BaseModel)`: `List[SkillResponse]`
- [X] T031 [P] Create `backend/src/schemas/experience.py` — `ExperienceResponse(BaseModel)`: id, company, role, start_date, end_date, responsibilities, order_index, created_at; `ExperienceListResponse(BaseModel)`: `List[ExperienceResponse]`
- [X] T032 [P] Create `backend/src/schemas/certification.py` — `CertificationResponse(BaseModel)`: id, name, issuer, date_earned, credential_url, order_index, created_at; `CertificationsListResponse(BaseModel)`: `List[CertificationResponse]`
- [X] T033 [P] Create `backend/src/schemas/testimonial.py` — `TestimonialResponse(BaseModel)`: id, author_name, author_role, author_company, quote, date, linkedin_url, order_index, created_at; `TestimonialsListResponse(BaseModel)`: `List[TestimonialResponse]`
- [X] T034 Create `backend/src/schemas/chat.py` — `ChatMessage(BaseModel)`: role (str), content (str); `ChatRequest(BaseModel)`: message (str), session_id (Optional[str]), history (Optional[List[ChatMessage]]); `SourceRef(BaseModel)`: source (str), similarity (float); `ChatResponse(BaseModel)`: response (str), lead_intent (bool=False), lead_prompt (Optional[str]), sources (Optional[List[SourceRef]]), fallback (bool=False)
- [X] T035 [P] Create `backend/src/schemas/lead.py` — `LeadCreate(BaseModel)`: name (str), email (str), message (str), category (Optional[str] = "other") with Literal["job_offer","freelance","collaboration","chatbot_capture","other"]; `LeadUpdate(BaseModel)`: status (Optional[str]) with Literal["new","reviewed","replied","archived"]; `LeadResponse(BaseModel)`: id, name, email, message, category, status, source, created_at

### Phase 2d: CRUD Services (Supabase REST API)

- [X] T036 Create `backend/src/services/profile_service.py` — `get_profile() -> dict`: calls `get_supabase().table("profiles").select("*").single().execute()`, returns data; returns `None` if no rows; handles `SupabaseError`
- [X] T037 [P] Create `backend/src/services/project_service.py` — `get_projects(featured_only: bool = False) -> list`: queries `projects` table, orders by `order_index`, optionally filters `featured=eq.true`; `get_project_by_id(project_id: str) -> dict`: selects single project by id
- [X] T038 [P] Create `backend/src/services/skill_service.py` — `get_skills() -> list`: queries `skills` table ordered by `category, order_index`; `get_skills_grouped() -> dict`: groups results by `category` into list of `{category, skills}`
- [X] T039 [P] Create `backend/src/services/experience_service.py` — `get_experience() -> list`: queries `experience` table ordered by `order_index ASC` (chronological)
- [X] T040 [P] Create `backend/src/services/certification_service.py` — `get_certifications() -> list`: queries `certifications` table ordered by `date_earned DESC`
- [X] T041 [P] Create `backend/src/services/testimonial_service.py` — `get_testimonials() -> list`: queries `testimonials` table ordered by `order_index ASC`
- [X] T042 Create `backend/src/services/lead_service.py` — `create_lead(name, email, message, category="other", source="contact_form") -> dict`: inserts into `leads` table with `status="new"`, returns inserted row; `get_leads(status=None, category=None) -> list`: queries with optional filters; `update_lead_status(lead_id, status) -> dict`: updates lead status

### Phase 2e: Gemini API SDK Configuration

- [X] T043 Create `backend/src/services/gemini_service.py` — module-level `_client = None`; `_get_client()` function: lazy-init `google.genai.Client()` via `genai.configure(api_key=settings.gemini_api_key)`; `generate_embedding(text: str) -> List[float]`: calls `client.models.embed_content(model="models/text-embedding-004", contents=text, task_type="retrieval_document")`, returns `result.embeddings[0].values` (768-dim vector); `generate_chat_response(prompt: str, history: list = None) -> dict`: calls `client.models.generate_content(model="models/gemini-1.5-flash", contents=prompt)`, returns `{"response": response.text}`; handles `GoogleAPIError` with try/except returning fallback dict

### Phase 2f: RAG Logic — Retrieval & Prompt Building

- [X] T044 Create `backend/src/services/rag_service.py` — `retrieve_context(query: str, top_k: int = 5, threshold: float = 0.7) -> List[dict]`: (1) calls `gemini_service.generate_embedding(query)` to get 768-dim vector, (2) calls `get_supabase().rpc("match_knowledge", {"query_embedding": embedding, "match_count": top_k, "similarity_threshold": threshold}).execute()`, (3) returns `result.data` (list of `{content, metadata, source, source_id, similarity}` dicts) or empty list on error
- [X] T045 Create `backend/src/services/prompt_builder.py` — `build_system_prompt(context_chunks: list, history: list = None) -> str`: constructs prompt string with: (a) persona section ("You are Mehdi's AI assistant..."), (b) context section iterating `context_chunks` and appending `content` + `source`, (c) conversation history from `history` (role/content pairs), (d) lead-intent detection instruction ("If user wants to hire Mehdi, offer to collect contact info..."), (e) no-hallucination constraint ("Only use information from the provided context")
- [X] T046 Create `backend/src/services/cache_service.py` — module-level `cache: Dict[str, tuple]` (key -> (value, expiry_timestamp)); `get(key) -> Optional[Any]`: returns value if not expired, else None; `set(key, value, ttl: int = 300)`: stores (value, time.time() + ttl); `invalidate(key)`: removes entry; auto-cleanup on `get` (remove expired entries)

### Phase 2g: FastAPI Routes — Public CRUD & Chat

- [X] T047 Create `backend/src/api/v1/router.py` — `APIRouter(prefix="/api/v1")`, include routers: `profile.router` (prefix="/profile"), `projects.router` (prefix="/projects"), `skills.router` (prefix="/skills"), `experience.router` (prefix="/experience"), `certifications.router` (prefix="/certifications"), `testimonials.router` (prefix="/testimonials"), `chat.router` (prefix="/chat"), `leads.router` (prefix="/leads"), `health.router` (prefix="/health")
- [X] T048 Create `backend/src/api/v1/profile.py` — `router = APIRouter(tags=["Profile"])`; `GET /` endpoint: calls `profile_service.get_profile()`, returns `ProfileResponse` or 404 if None
- [X] T049 [P] Create `backend/src/api/v1/projects.py` — `router = APIRouter(tags=["Projects"])`; `GET /` endpoint: accepts optional `featured: bool = False` query param, calls `project_service.get_projects(featured)`, returns `ProjectsListResponse`; `GET /{project_id}` endpoint: calls `get_project_by_id(project_id)`, returns `ProjectResponse` or 404
- [X] T050 [P] Create `backend/src/api/v1/skills.py` — `router = APIRouter(tags=["Skills"])`; `GET /` endpoint: accepts `grouped: bool = False` query param, calls grouped or flat service method, returns appropriate response
- [X] T051 [P] Create `backend/src/api/v1/experience.py` — `router = APIRouter(tags=["Experience"])`; `GET /` endpoint: calls `experience_service.get_experience()`, returns `ExperienceListResponse`
- [X] T052 [P] Create `backend/src/api/v1/certifications.py` — `router = APIRouter(tags=["Certifications"])`; `GET /` endpoint: calls `certification_service.get_certifications()`, returns `CertificationsListResponse`
- [X] T053 [P] Create `backend/src/api/v1/testimonials.py` — `router = APIRouter(tags=["Testimonials"])`; `GET /` endpoint: calls `testimonial_service.get_testimonials()`, returns `TestimonialsListResponse`
- [X] T054 Create `backend/src/api/v1/leads.py` — `router = APIRouter(tags=["Leads"])`; `POST /` endpoint: accepts `LeadCreate`, calls `lead_service.create_lead(...)`, returns `LeadResponse` with 201 status; input validation via Pydantic
- [X] T055 Create `backend/src/api/v1/chat.py` — `router = APIRouter(tags=["Chat"])`; `POST /` endpoint: (1) compute cache key via `sha256(message.encode()).hexdigest()[:16]`, (2) check `cache_service.get(key)`, return cached `ChatResponse` if hit, (3) call `rag_service.retrieve_context(request.message, top_k=5, threshold=0.7)`, (4) build prompt via `prompt_builder.build_system_prompt(context_chunks, request.history)`, (5) call `gemini_service.generate_chat_response(system_prompt)`, (6) detect lead intent from response text (check for hiring keywords), (7) build `ChatResponse` with sources from context_chunks, (8) cache response via `cache_service.set(key, response, ttl=300)`, (9) return `ChatResponse`; on Gemini error return fallback `ChatResponse(response="Assistant unavailable, please use contact form", fallback=True)`
- [X] T056 Create `backend/src/api/v1/health.py` — `router = APIRouter(tags=["Health"])`; `GET /` endpoint: checks Supabase connectivity via `get_supabase().table("profiles").select("id").limit(1).execute()`, returns `{"status": "healthy", "supabase": true, "gemini": true}` or 503 on failure

### Phase 2h: Middleware & App Assembly

- [X] T057 Create `backend/src/middleware/logging.py` — `LoggingMiddleware(BaseHTTPMiddleware)`: on dispatch, records `time.time()` before/after, logs `{"method": request.method, "path": request.url.path, "status": response.status_code, "duration_ms": elapsed_ms, "client_ip": request.client.host}` via `logging.getLogger("api")`
- [X] T058 Create `backend/src/middleware/rate_limiter.py` — `RateLimiter`: in-memory dict `_buckets` mapping IP -> `(tokens: int, last_refill: float)`; `token_bucket_check(ip, capacity=15, refill_rate=15/60)` returns True if token available; middleware applies only to `/api/v1/chat` path, returns `JSONResponse(status_code=429, content={"detail": "Rate limit exceeded", "retry_after": seconds})` when exhausted
- [X] T059 Update `backend/src/main.py` — create FastAPI app with `title="Portfolio API", version="1.0"`; add `CORSMiddleware` with `allow_origins=["*"]` (configure per env later); add `LoggingMiddleware`; add `RateLimiter` only on chat route via `app.middleware("http")` or route-specific dependency; include `router` from `api.v1.router`; add exception handler for `SupabaseError` -> 500 JSON response

### Phase 2i: Verification & Smoke Tests

- [X] T060 Test all public GET endpoints with `curl` or `httpx`: `GET /api/v1/profile` (200 + JSON), `GET /api/v1/projects` (200 + array), `GET /api/v1/skills` (200 + array), `GET /api/v1/experience` (200 + array), `GET /api/v1/certifications` (200 + array), `GET /api/v1/testimonials` (200 + array), `GET /api/v1/health` (200 + healthy JSON)
- [X] T061 Test `POST /api/v1/leads` with valid payload `{"name":"Test","email":"test@example.com","message":"Hello"}` -> 201; with invalid email -> 422
- [X] T062 Test `POST /api/v1/chat` with `{"message":"Tell me about Mehdi"}`: verify non-empty response, check `response` field exists; test cache by sending same message twice (second should be faster, same response)
- [X] T063 Test Gemini embedding: call `gemini_service.generate_embedding("test query")`, verify returns list of 768 floats; on invalid API key, verify graceful fallback
- [X] T064 Test RAG retrieval: insert test row into `knowledge_base` with known embedding, call `rag_service.retrieve_context("test query")`, verify returns context chunks with similarity scores
- [X] T065 Test rate limiter: send 16 rapid requests to `/api/v1/chat`, verify 16th returns 429 with `Retry-After` or similar indicator

**Checkpoint**: All 7 public GET endpoints working, Gemini client initialized, RAG pipeline operational (embed -> retrieve -> prompt -> generate), caching and rate limiting active, all smoke tests passing.

---

## Milestone 3 (US1): Next.js Public Pages & Data Fetching

**Goal**: All public portfolio pages fetch data from FastAPI and render with modern, responsive, accessible UI.

**Independent Test**: Navigate every public page, verify all content renders from database, no hardcoded content, responsive at 320px/768px/1280px.

### Implementation for User Story 1

- [X] T058 [P] [US1] Create `frontend/src/lib/api.ts` — FastAPI HTTP client with base URL from env, error handling, typed response functions (fetchProfile, fetchProjects, fetchSkills, fetchExperience, fetchCertifications, fetchTestimonials)
- [X] T059 [P] [US1] Create `frontend/src/types/api.ts` — TypeScript interfaces for all API response types (Profile, Project, Skill, Experience, Certification, Testimonial)
- [X] T060 [P] [US1] Create `frontend/src/components/ui/` — install shadcn/ui primitives (Button, Card, Badge, Input, Textarea, Dialog, Tabs)
- [X] T061 [P] [US1] Create `frontend/src/components/layout/header.tsx` — site header with logo, navigation links (Home, About, Projects, Skills, Experience, Certifications, Contact), responsive hamburger menu
- [X] T062 [P] [US1] Create `frontend/src/components/layout/footer.tsx` — site footer with social links (LinkedIn, GitHub, Twitter), copyright
- [X] T063 [P] [US1] Create `frontend/src/components/sections/hero.tsx` — home page hero section with name, headline, profile image, CTA buttons (View Projects, Contact Me)
- [X] T064 [P] [US1] Create `frontend/src/components/sections/project-card.tsx` — project card with title, short description, tech stack badges, image, links (live demo, GitHub)
- [X] T065 [P] [US1] Create `frontend/src/components/sections/skill-badge.tsx` — skill badge with name, category color, proficiency indicator (dots/bars)
- [X] T066 [P] [US1] Create `frontend/src/components/sections/timeline-item.tsx` — experience timeline item with company, role, dates, responsibilities
- [X] T067 [US1] Update `frontend/src/app/layout.tsx` — integrate Header and Footer, set global metadata, font imports (Inter or similar)
- [X] T068 [US1] Update `frontend/src/app/page.tsx` — home page: fetch profile + featured projects via Server Components, render Hero + featured projects grid
- [X] T069 [US1] Create `frontend/src/app/about/page.tsx` — about page: fetch profile via Server Component, render bio, finance-to-tech narrative, social links, download resume button
- [X] T070 [US1] Create `frontend/src/app/projects/page.tsx` — projects listing: fetch all projects via Server Component, render gallery grid with project cards, featured filter
- [X] T071 [US1] Create `frontend/src/app/projects/[id]/page.tsx` — project detail page: fetch single project with skills, render full description, tech stack, links
- [X] T072 [US1] Create `frontend/src/app/skills/page.tsx` — skills page: fetch skills grouped by category via Server Component, render category sections with skill badges/bars
- [X] T073 [US1] Create `frontend/src/app/experience/page.tsx` — experience page: fetch experience entries, render chronological timeline
- [X] T074 [US1] Create `frontend/src/app/certifications/page.tsx` — certifications page: fetch certifications, render list with name, issuer, date, credential link
- [X] T075 [US1] Create `frontend/src/app/contact/page.tsx` — contact form page: name, email, message, category selector, client-side form submission to POST /api/v1/leads, validation, success/error states
- [X] T076 [US1] Create `frontend/src/components/sections/contact-form.tsx` — reusable contact form component with React Hook Form + Zod validation, inline error messages
- [X] T077 [US1] Add responsive styling: verify all pages render correctly at 320px (mobile), 768px (tablet), 1280px (desktop) breakpoints
- [X] T078 [US1] Add accessibility: keyboard navigation for all interactive elements, ARIA labels on navigation, semantic headings (h1-h4), color contrast >= 4.5:1
- [X] T079 [US1] Create `frontend/public/robots.txt` and `frontend/public/sitemap.xml`

**Checkpoint**: All public pages render with real data from database. Site is responsive and accessible. Contact form submits to backend.

---

## Milestone 4 (US2): RAG Chatbot Backend & Gemini Integration

**Goal**: POST /api/v1/chat endpoint with full RAG pipeline — embed query, retrieve from pgvector, construct prompt, call Gemini 1.5 Flash with JSON mode, return structured response with lead detection.

**Independent Test**: Send 10+ varied questions to chat endpoint, verify responses are grounded in knowledge base, sources returned, lead_intent flag works correctly.

### Implementation for User Story 2

- [X] T080 [P] [US2] Create `backend/src/schemas/chat.py` — Pydantic schemas: ChatRequest (message, session_id, history), ChatResponse (response, lead_intent, lead_prompt, sources, fallback), SourceRef (source, similarity)
- [X] T081 [P] [US2] Create `backend/src/services/rag_service.py` — RAG retrieval service: `retrieve_context(query: str, top_k: int = 5, threshold: float = 0.7)` — generates embedding via gemini_service, queries pgvector similarity, filters by threshold, returns top chunks
- [X] T082 [US2] Create `backend/src/services/prompt_builder.py` — prompt construction service: `build_system_prompt(context_chunks: list, history: list)` — assembles role definition, retrieved context, grounding constraints, JSON output schema instruction
- [X] T083 [US2] Update `backend/src/services/gemini_service.py` — add `generate_structured_chat(prompt: str, history: list, schema: dict) -> ChatResponse` using Gemini 1.5 Flash with `response_mime_type: "application/json"` and JSON schema
- [X] T084 [US2] Create `backend/src/api/v1/chat.py` — POST /api/v1/chat endpoint: validate request -> check cache -> rate limit -> rag_service.retrieve -> prompt_builder.build -> gemini_service.generate_structured_chat -> return ChatResponse, apply cache on success
- [X] T085 [US2] Integrate rate_limiter middleware into chat endpoint (15 RPM token bucket)
- [X] T086 [US2] Integrate cache_service into chat endpoint (5-min TTL, cache key = hash of message)
- [X] T087 [US2] Add error handling in chat endpoint: Gemini timeout -> fallback response, Gemini 429 -> queued/fallback, pgvector empty -> fallback with flag, Supabase down -> 503
- [x] T088 [US2] Test chat endpoint with mock knowledge base entries: verify grounding (no hallucination), source attribution, lead_intent detection, fallback behavior
- [x] T089 [US2] Test rate limiting: send 16 rapid requests, verify 16th returns 429 with Retry-After header

**Checkpoint**: Chat endpoint returns grounded JSON responses with lead detection, rate limiting, and caching operational.

---

## Milestone 5 (US3): Chatbot Widget on Frontend

**Goal**: Floating chat widget on all public pages — sends messages to FastAPI, displays structured responses, inline lead capture form when lead_intent=true.

**Independent Test**: Open chat widget on any page, send 5+ messages, verify responses display correctly, lead form appears when appropriate, lead submission stores in database.

### Implementation for User Story 3

- [x] T090 [P] [US3] Create `frontend/src/hooks/use-chat.ts` — chat session state hook: messages array, session_id generation, send function, loading/error states
- [x] T091 [P] [US3] Create `frontend/src/components/chatbot/chat-message.tsx` — chat message bubble component: user messages (right-aligned, blue), bot messages (left-aligned, gray), source citations, fallback styling
- [x] T092 [P] [US3] Create `frontend/src/components/chatbot/chat-lead-form.tsx` — inline lead capture form: name, email, message fields, submits to POST /api/v1/leads with category="chatbot_capture", source="chatbot"
- [x] T093 [US3] Create `frontend/src/components/chatbot/chat-widget.tsx` — floating chat panel: toggle button (bottom-right), message list, input field, send button, loading indicator, lead form integration (shows when lead_intent=true), session management
- [x] T094 [US3] Update `frontend/src/app/layout.tsx` — embed ChatWidget as a client component in the root layout (rendered on all pages)
- [x] T095 [US3] Add chat widget styling: floating button with animation, panel with max-height, scrollable message area, mobile-responsive (full-screen on small screens)
- [x] T096 [US3] Test chat widget end-to-end: open widget, send message, verify response renders, trigger lead_intent response, fill inline form, verify lead stored in database

**Checkpoint**: Chat widget functional on all public pages with lead capture working.

---

## Milestone 6 (US4): Admin Dashboard & Supabase Auth

**Goal**: Protected admin dashboard with Supabase Auth login, CRUD forms for all content types, leads management view.

**Independent Test**: Login as admin, perform CRUD on each content type, verify changes appear on public pages. View leads, filter by category, update status.

### Implementation for User Story 4

- [x] T097 [P] [US4] Install `@supabase/supabase-js` in frontend: `npm install @supabase/supabase-js`
- [x] T098 [P] [US4] Create `frontend/src/lib/supabase-client.ts` — Supabase browser client initialization (uses NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [x] T099 [US4] Create `frontend/src/app/admin/login/page.tsx` — admin login page: email/password form, calls `supabase.auth.signInWithPassword()`, redirects to `/admin` on success, displays error on failure
- [x] T100 [US4] Create `frontend/src/app/admin/layout.tsx` — admin auth guard: checks `supabase.auth.getSession()` on mount, redirects to `/admin/login` if not authenticated, renders admin sidebar navigation + main content area
- [x] T101 [P] [US4] Create `frontend/src/app/admin/page.tsx` — admin dashboard overview: stats cards (total projects, total leads, new leads count)
- [x] T102 [P] [US4] Create `frontend/src/app/admin/projects/page.tsx` — admin projects CRUD: table listing, add/edit/delete forms (title, descriptions, tech stack, URLs, featured, order_index, dates)
- [x] T103 [P] [US4] Create `frontend/src/app/admin/skills/page.tsx` — admin skills CRUD: table listing grouped by category, add/edit/delete forms (name, category, proficiency slider, order_index)
- [x] T104 [P] [US4] Create `frontend/src/app/admin/experience/page.tsx` — admin experience CRUD: table listing, add/edit/delete forms (company, role, dates, responsibilities rich text)
- [x] T105 [P] [US4] Create `frontend/src/app/admin/certifications/page.tsx` — admin certifications CRUD: table listing, add/edit/delete forms (name, issuer, date, credential URL)
- [x] T106 [P] [US4] Create `frontend/src/app/admin/testimonials/page.tsx` — admin testimonials CRUD: table listing, add/edit/delete forms (author name, role, company, quote, date, LinkedIn URL)
- [x] T107 [P] [US4] Create `frontend/src/app/admin/leads/page.tsx` — admin leads management: table with columns (name, email, category, status, date), filter by category/status dropdown, click to update status (new -> reviewed -> replied -> archived)
- [x] T108 [US4] Create `backend/src/middleware/auth.py` — Supabase JWT verification middleware: extracts Bearer token, verifies via `supabase.auth.get_user(token)`, attaches user to request, returns 401 on failure
- [x] T109 [US4] Create `backend/src/api/admin/router.py` — admin router aggregating all admin sub-routers
- [x] T110 [P] [US4] Create `backend/src/api/admin/projects.py` — POST/PUT/DELETE /api/v1/admin/projects endpoints (protected by auth middleware)
- [x] T111 [P] [US4] Create `backend/src/api/admin/skills.py` — POST/PUT/DELETE /api/v1/admin/skills endpoints
- [x] T112 [P] [US4] Create `backend/src/api/admin/experience.py` — POST/PUT/DELETE /api/v1/admin/experience endpoints
- [x] T113 [P] [US4] Create `backend/src/api/admin/certifications.py` — POST/PUT/DELETE /api/v1/admin/certifications endpoints
- [x] T114 [P] [US4] Create `backend/src/api/admin/testimonials.py` — POST/PUT/DELETE /api/v1/admin/testimonials endpoints
- [x] T115 [US4] Create `backend/src/api/admin/leads.py` — GET /api/v1/admin/leads (with category/status filters), GET /api/v1/admin/leads/{id}, PATCH /api/v1/admin/leads/{id} (status update)
- [x] T116 [US4] Create `backend/src/schemas/chat.py` — add ChatRequest/ChatResponse if not already done in T080
- [x] T117 [US4] Update `backend/src/main.py` — mount admin router under `/api/v1/admin`, ensure auth middleware applied to admin routes only
- [x] T118 [US4] Wire admin frontend forms to backend admin API: each admin page uses `api.ts` functions with JWT from Supabase session
- [X] T119 [US4] Test admin auth: verify unauthenticated access to `/admin` redirects to login, verify authenticated access shows dashboard, verify API calls without JWT return 401
- [X] T120 [US4] Test admin CRUD: add a project via admin, verify it appears on public /projects page; update a skill, verify it appears on /skills; delete a testimonial, verify it disappears

**Checkpoint**: Admin dashboard fully functional with auth, all CRUD operations, and lead management.

---

## Milestone 7 (US5): Knowledge Base Auto-Embedding

**Goal**: When Mehdi creates/updates knowledge base entries via admin, embeddings are automatically generated via Gemini API.

**Independent Test**: Create a KB entry via admin, verify embedding is generated, ask chatbot a question that should retrieve that entry, verify it's included in sources.

### Implementation for User Story 5

- [X] T121 [P] [US5] Create `backend/src/schemas/knowledge_base.py` — if not already done in T037, add KnowledgeBaseCreate, KnowledgeBaseUpdate, KnowledgeBaseResponse Pydantic schemas
- [x] T122 [US5] Create `backend/src/services/knowledge_base_service.py` — CRUD: create_entry(content, source, metadata) -> auto-generate embedding via gemini_service.generate_embedding(), update_entry(id, ...) -> regenerate embedding, delete_entry(id) -> remove row
- [x] T123 [US5] Create `backend/src/api/admin/knowledge_base.py` — POST /api/v1/admin/knowledge-base (creates + embeds), PUT /api/v1/admin/knowledge-base/{id} (updates + re-embeds), DELETE /api/v1/admin/knowledge-base/{id}
- [x] T124 [US5] Wire knowledge_base admin route into admin router (T109)
- [x] T125 [US5] Create `frontend/src/app/admin/knowledge-base/page.tsx` — admin KB management: table listing entries with content preview, source type, add/edit/delete forms (content textarea, source dropdown, metadata JSON input), embedding status indicator
- [X] T126 [US5] Test auto-embedding: create a KB entry with content "Mehdi completed Next.js certification at SMIT in 2025", verify embedding vector is populated in pgvector, ask chatbot "What certifications does Mehdi have?", verify the new entry is in sources

**Checkpoint**: Knowledge base auto-embedding operational. Chatbot retrieves newly added entries immediately.

---

## Milestone 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, accessibility audit, error handling, documentation, deployment readiness.

- [x] T127 [P] Create `backend/src/api/v1/health.py` — GET /api/v1/health endpoint checking database connection, Gemini API availability, cache status
- [x] T128 [P] Add structured error logging to all backend services (log exceptions with context: function name, params, traceback)
- [x] T129 [P] Add `frontend/src/app/not-found.tsx` — custom 404 page with link back to home
- [x] T130 [P] Add `frontend/src/app/error.tsx` — custom error boundary for client-side errors
- [X] T131 Run Lighthouse audit on all public pages: verify performance score 90+, accessibility score 90+, FCP < 1.5s
- [X] T132 Fix accessibility issues from audit: ensure all images have alt text, form fields have labels, color contrast >= 4.5:1, keyboard navigation works
- [x] T133 [P] Optimize images: use Next.js Image component for all images, configure remote patterns for Supabase Storage URLs
- [x] T134 [P] Create `frontend/public/robots.txt` and `frontend/public/sitemap.xml` if not already done
- [x] T135 Verify quickstart.md: follow instructions from scratch on a clean machine, confirm both servers start and smoke tests pass
- [x] T136 [P] Create `backend/pyproject.toml` with pytest, black, ruff configuration
- [x] T137 [P] Create `frontend/package.json` scripts: `dev`, `build`, `start`, `lint`, `test`

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
M1 (Setup) -> M2 (Backend Foundation)
                      |
        +-------------+-------------+-------------+
        |             |             |              |
    M3 (US1)      M4 (US2)     M6 (US4)      (Shared foundation)
    Public        RAG          Admin
    Pages         Backend      Dashboard
        |             |              |
    M5 (US3)      M7 (US5)
    Chat          Auto-Embed
    Widget
                      |
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
- M2: T021-T024 (config + requirements + session + vector) parallel
- M2: T027-T035 (all schema files) parallel
- M2: T036-T042 (all CRUD service files) parallel
- M2: T043 (gemini), T044 (rag), T045 (prompt) — sequential (T044 depends on T043, T045 depends on T044)
- M2: T047-T056 (all route files) parallel
- M2: T057-T059 (middleware + main) parallel
- M2: T060-T065 (all verification tests) sequential (build on each other)
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

## Parallel Example: Milestone 2 (Backend)

```bash
# Launch all schema files in parallel:
Task: "Create backend/src/schemas/common.py"
Task: "Create backend/src/schemas/profile.py"
Task: "Create backend/src/schemas/project.py"
Task: "Create backend/src/schemas/skill.py"
Task: "Create backend/src/schemas/experience.py"
Task: "Create backend/src/schemas/certification.py"
Task: "Create backend/src/schemas/testimonial.py"
Task: "Create backend/src/schemas/chat.py"
Task: "Create backend/src/schemas/lead.py"

# Launch all CRUD service files in parallel:
Task: "Create backend/src/services/profile_service.py"
Task: "Create backend/src/services/project_service.py"
Task: "Create backend/src/services/skill_service.py"
Task: "Create backend/src/services/experience_service.py"
Task: "Create backend/src/services/certification_service.py"
Task: "Create backend/src/services/testimonial_service.py"
Task: "Create backend/src/services/lead_service.py"

# Launch all API route files in parallel:
Task: "Create backend/src/api/v1/router.py"
Task: "Create backend/src/api/v1/profile.py"
Task: "Create backend/src/api/v1/projects.py"
Task: "Create backend/src/api/v1/skills.py"
Task: "Create backend/src/api/v1/experience.py"
Task: "Create backend/src/api/v1/certifications.py"
Task: "Create backend/src/api/v1/testimonials.py"
Task: "Create backend/src/api/v1/leads.py"
Task: "Create backend/src/api/v1/chat.py"
Task: "Create backend/src/api/v1/health.py"
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

1. M1 + M2 + M3 -> Public portfolio live (MVP!)
2. + M4 + M5 -> Chatbot added (differentiator)
3. + M6 -> Admin dashboard (maintainability)
4. + M7 -> Auto-embedding (AI quality)
5. + M8 -> Polish (production readiness)

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
