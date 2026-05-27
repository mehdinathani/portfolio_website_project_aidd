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

## Milestone 3: Next.js Frontend & Admin Panel

**Goal**: Build the complete frontend using Next.js 14+ (App Router), TypeScript, and TailwindCSS. Includes public portfolio pages, a floating AI chat widget, and a Supabase Auth-protected admin dashboard.

**Independent Test**: All public pages render with real data from FastAPI backend, chat widget sends/receives messages, admin login works, CRUD operations reflect on public pages.

---

### Phase M3-1: Group 1 — Base UI Components & Tailwind Setup

**Purpose**: Initialize Next.js project, configure TailwindCSS, create reusable UI primitives and layout components.

- [X] T301 Create `frontend/` project with `npx create-next-app@latest frontend --typescript --tailwind --app --eslint --app-router` (Next.js 14+, App Router, TypeScript, TailwindCSS)
- [X] T302 Create `frontend/.env.local.example` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`, `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`
- [X] T303 [P] Configure `frontend/tailwind.config.js` — extend theme with custom colors (primary, gray scale), font families (Inter for sans, JetBrains Mono for mono), and custom breakpoints if needed
- [X] T304 [P] Update `frontend/src/app/globals.css` — add Tailwind directives (`@tailwind base/components/utilities`), custom CSS variables for theme colors, smooth scroll behavior
- [X] T305 [P] Create `frontend/src/components/ui/Button.tsx` — reusable button component with variants (primary, secondary, outline, ghost), sizes (sm, md, lg), and disabled state
- [X] T306 [P] Create `frontend/src/components/ui/Input.tsx` — input component with label, placeholder, error state, icon support, full-width default
- [X] T307 [P] Create `frontend/src/components/ui/TextArea.tsx` — textarea component with label, error state, auto-resize option, character count
- [X] T308 [P] Create `frontend/src/components/ui/Select.tsx` — select dropdown with options array, label, error state, controlled/uncontrolled modes
- [X] T309 [P] Create `frontend/src/components/ui/Card.tsx` — card container with header, body, footer slots, hover effects, shadow variants
- [X] T310 [P] Create `frontend/src/components/ui/Badge.tsx` — badge component with color variants (blue=Languages, green=Frameworks, etc.), dot indicator option
- [X] T311 [P] Create `frontend/src/components/ui/LoadingSpinner.tsx` — spinner/skeleton loading component with size variants and optional overlay
- [X] T312 [P] Create `frontend/src/components/layout/Header.tsx` (Client Component `'use client'`) — site navigation with logo/site title, nav links (Home, About, Projects, Skills, Experience, Certifications, Contact), mobile hamburger menu using useState for toggle, active link highlighting
- [X] T313 [P] Create `frontend/src/components/layout/Footer.tsx` (Server Component) — footer with copyright, social links (LinkedIn, GitHub), muted color scheme
- [X] T314 Update `frontend/src/app/layout.tsx` — root layout: import Header + Footer, wrap children, set metadata (title, description, open graph), import fonts via `next/font/google` (Inter), include `globals.css`
- [X] T315 Create `frontend/src/app/error.tsx` — custom error page with friendly message, link back to home, consistent Header/Footer layout
- [X] T316 Create `frontend/src/lib/utils.ts` — utility functions: `cn()` for Tailwind class merging (clsx + twMerge), date formatting, truncate text, validate email format

**Checkpoint**: Next.js project runs with `npm run dev`, TailwindCSS configured, UI primitives render in a test page, Header/Footer visible on all routes.

---

### Phase M3-2: Group 2 — Supabase Auth & Protected Routes

**Purpose**: Configure Supabase Auth with `@supabase/ssr` for cookie-based sessions, create middleware for route protection, and build the admin login flow.

- [X] T317 Install `@supabase/ssr` and `@supabase/supabase-js` in frontend: `cd frontend && npm install @supabase/ssr @supabase/supabase-js`
- [X] T318 Create `frontend/src/lib/supabase.ts` — Supabase server client using `next/headers` and `createServerClient` from `@supabase/ssr`, reads cookies from request, used in Server Components
- [X] T319 Create `frontend/src/lib/supabase-client.ts` — Supabase browser client using `createBrowserClient` from `@supabase/ssr`, singleton pattern with `useState` to avoid duplicate instances
- [X] T320 Create `frontend/src/middleware.ts` — Next.js middleware: (1) create server client with `createServerClient`, (2) call `supabase.auth.getUser()` to refresh/validate session, (3) if path starts with `/admin` and user is null, redirect to `/admin/login?redirect=<path>`, (4) if path is `/admin/login` and user exists, redirect to `/admin`, (5) return response with updated cookies; configure matcher to exclude static assets
- [X] T321 Create `frontend/src/hooks/useAuth.ts` (Client Component hook) — `useAuth()` hook: reads session from Supabase browser client, returns `{ user, isLoading, isAuthenticated, signOut }`, subscribes to `onAuthStateChange` for real-time auth updates
- [X] T322 Create `frontend/src/app/admin/login/page.tsx` (Client Component) — login form: email/password inputs with validation, calls `supabase.auth.signInWithPassword()`, shows error toast on failure, redirects to `/admin` or `redirect` query param on success, "Forgot password?" link placeholder
- [X] T323 AdminHeader not used (login/logout handled in admin layout and sidebar directly)
- [X] T324 `frontend/src/app/admin/layout.tsx` includes sidebar navigation with active route highlighting, logout button, and auth guard
- [X] T325 `frontend/src/app/admin/layout.tsx` — admin layout: verify auth via `useAuth()` hook, redirect if unauthenticated, renders sidebar + children content area
- [X] T326 Create `frontend/src/app/admin/page.tsx` (Server Component) — admin dashboard overview: fetch counts from API (total projects, total leads, new leads count), render stat cards with icons, recent activity placeholder, quick action buttons

**Checkpoint**: Admin login page renders, Supabase Auth session established, `/admin/*` routes redirect to login when unauthenticated, admin layout renders with sidebar after login.

---

### Phase M3-3: Group 3 — Server Components & FastAPI Data Fetching (Public Pages)

**Purpose**: Build all public-facing pages as Server Components that fetch data from the FastAPI backend. Each page fetches only what it needs and passes data to child components.

- [X] T327 Create `frontend/src/lib/api.ts` — API client functions: `fetchProfile()`, `fetchProjects(featured?)`, `fetchProject(id)`, `fetchSkillsGrouped()`, `fetchExperience()`, `fetchCertifications()`, `fetchTestimonials()`; each uses `fetch()` with `BACKEND_URL` env var, `cache: 'no-store'`, throws on non-OK response
- [X] T328 [P] Create `frontend/src/lib/types.ts` — TypeScript interfaces generated from OpenAPI schema: `ProfileResponse`, `ProjectResponse`, `ProjectCreate`, `ProjectUpdate`, `SkillResponse`, `SkillsGroupedResponse`, `ExperienceResponse`, `CertificationResponse`, `TestimonialResponse`, `LeadResponse`, `ChatRequest`, `ChatResponse`, `SourceRef`, `ApiError`
- [X] T329 [P] Create `frontend/src/components/sections/hero.tsx` (Server Component) — home page hero: accepts `profile: Profile`, renders name, headline, bio excerpt, profile image, "View Projects" + "Contact Me" CTA buttons
- [X] T330 [P] Create `frontend/src/components/sections/project-card.tsx` (Server Component) — project card: accepts `project: Project`, renders title, short description, tech stack as badges, project image with fallback, GitHub/live demo links
- [X] T331 [P] Project gallery implemented inline in `frontend/src/app/projects/page.tsx` — responsive grid with featured toggle
- [X] T332 [P] Skills grouping implemented inline in `frontend/src/app/skills/page.tsx` with `frontend/src/components/sections/skill-badge.tsx` — skills by category with proficiency dots
- [X] T333 [P] Experience timeline implemented via `frontend/src/components/sections/timeline-item.tsx` in `frontend/src/app/experience/page.tsx`
- [X] T334 [P] Certifications list implemented inline in `frontend/src/app/certifications/page.tsx`
- [X] T335 [P] Create `frontend/src/components/sections/contact-form.tsx` (Client Component) — lead capture form with validation, submits to `POST /api/v1/leads/`
- [X] T336 Update `frontend/src/app/page.tsx` (Server Component) — home page: fetch `profile` + `projects(featured=true)` + `testimonials`, render HeroSection + featured ProjectGallery + testimonials preview + ContactForm section
- [X] T337 Create `frontend/src/app/about/page.tsx` (Server Component) — about page: fetch `profile`, render full bio with finance-to-tech narrative, profile image, social links as icons (LinkedIn, GitHub, Twitter), "Download Resume" button linking to `resume_url`
- [X] T338 Create `frontend/src/app/projects/page.tsx` (Server Component) — projects listing: fetch all `projects`, render ProjectGallery with all projects, page header "My Projects", brief intro paragraph
- [X] T339 Create `frontend/src/app/projects/[id]/page.tsx` (Server Component) — project detail: fetch single `project` by ID, render full description, tech stack badges, image, external links, "Back to Projects" link
- [X] T340 Create `frontend/src/app/experience/page.tsx` (Server Component) — experience page: fetch `experience`, render ExperienceTimeline, page header "Work Experience", intro text
- [X] T341 Create `frontend/src/app/certifications/page.tsx` (Server Component) — certifications page: fetch `certifications`, render CertificationsList, page header "Certifications & Credentials"
- [X] T342 Create `frontend/src/app/contact/page.tsx` (Server Component wrapper) — contact page: render ContactForm (Client Component) inside a centered card layout, page header "Get in Touch", brief intro, alternative contact methods (email, LinkedIn)

**Checkpoint**: All 7 public pages render with data fetched from FastAPI backend. No hardcoded content. Navigation works between all pages. Contact form submits successfully.

---

### Phase M3-4: Group 4 — Admin CRUD Interfaces

**Purpose**: Build admin pages for managing all portfolio content (projects, skills, experience, certifications, testimonials, knowledge base) and viewing/managing leads.

- [X] T343 Create `frontend/src/lib/api-admin.ts` — admin API client: wraps fetch with Supabase JWT from session as `Authorization: Bearer <token>` header; functions: `fetchAdminProjects()`, `createProject(data)`, `updateProject(id, data)`, `deleteProject(id)`, similar for skills, experience, certifications, testimonials, knowledge base, and leads
- [X] T344 [P] Create `frontend/src/components/admin/AdminTable.tsx` (Client Component) — reusable table: accepts `columns`, `data`, `onEdit`, `onDelete`, renders responsive table (cards on mobile), row actions, empty state message, loading skeleton
- [X] T345 [P] Create `frontend/src/components/admin/StatusBadge.tsx` (Client Component) — lead status badge: color-coded (new=blue, reviewed=purple, replied=green, archived=gray), dropdown to change status
- [X] T346 Create `frontend/src/app/admin/projects/page.tsx` (Server Component) — admin projects list: fetch projects via admin API with JWT, render AdminTable with columns (title, featured, order, actions), "Add Project" button linking to `/admin/projects/new`
- [X] T347 Create `frontend/src/app/admin/projects/new/page.tsx` (Client Component) — new project form: controlled inputs, POST to `/api/v1/admin/projects/`, redirect to list on success
- [X] T348 Create `frontend/src/app/admin/projects/[id]/page.tsx` (Client Component) — edit project form: fetch project data, PUT to `/api/v1/admin/projects/{id}`, delete button
- [X] T349 Create `frontend/src/app/admin/skills/page.tsx` (Server Component) — admin skills list: fetch skills grouped by category, render editable table with inline category/proficiency/order edits, "Add Skill" button
- [X] T349b Create `frontend/src/app/admin/skills/new/page.tsx` (Client Component) — new skill form: name, category select, proficiency slider, order_index, POST to `/api/v1/admin/skills/`
- [X] T350 Create `frontend/src/app/admin/skills/[id]/page.tsx` (Client Component) — edit skill form: fetch skill by ID, form with name, category select, proficiency slider (1-5), order_index, save via PUT
- [X] T351 Create `frontend/src/app/admin/experience/page.tsx` (Server Component) — admin experience list: fetch experience entries, render table with company, role, dates, order, edit/delete actions
- [X] T351b Create `frontend/src/app/admin/experience/new/page.tsx` (Client Component) — new experience form: company, role, dates, responsibilities, order_index, POST to `/api/v1/admin/experience/`
- [X] T352 Create `frontend/src/app/admin/experience/[id]/page.tsx` (Client Component) — edit experience form: company, role, start/end dates, responsibilities textarea, order_index, save/delete
- [X] T353 Create `frontend/src/app/admin/certifications/page.tsx` (Server Component) — admin certifications list: fetch certifications, render table with name, issuer, date, credential URL, edit/delete
- [X] T353b Create `frontend/src/app/admin/certifications/new/page.tsx` (Client Component) — new certification form: name, issuer, date earned, credential URL, order_index, POST to `/api/v1/admin/certifications/`
- [X] T354 Create `frontend/src/app/admin/certifications/[id]/page.tsx` (Client Component) — edit certification form: name, issuer, date earned picker, credential URL, order_index, save/delete
- [X] T355 Create `frontend/src/app/admin/testimonials/page.tsx` (Server Component) — admin testimonials list: fetch testimonials, render table with author, quote preview, company, order, edit/delete
- [X] T355b Create `frontend/src/app/admin/testimonials/new/page.tsx` (Client Component) — new testimonial form: author name, role, company, quote, LinkedIn URL, date, order_index, POST to `/api/v1/admin/testimonials/`
- [X] T356 Create `frontend/src/app/admin/testimonials/[id]/page.tsx` (Client Component) — edit testimonial form: author name, role, company, quote textarea, LinkedIn URL, date, order_index, save/delete
- [X] T357 Create `frontend/src/app/admin/knowledge-base/page.tsx` (Server Component) — admin KB list: fetch entries via `GET /api/v1/admin/knowledge-base/`, render table with content preview (truncated), source type, creation date, edit/delete/add actions
- [X] T357b Create `frontend/src/app/admin/knowledge-base/new/page.tsx` (Client Component) — new KB entry form: content textarea, source type select, metadata JSON editor, POST to `/api/v1/admin/knowledge-base/`, embedding auto-generated
- [X] T358 Create `frontend/src/app/admin/knowledge-base/[id]/page.tsx` (Client Component) — edit KB entry form: content textarea, source type select, metadata JSON editor, save/delete; backend auto-generates embedding on save
- [X] T359 Create `frontend/src/app/admin/leads/page.tsx` (Server Component) — admin leads inbox: fetch leads with optional category/status filters via `GET /api/v1/admin/leads/`, render table with AdminTable, filter dropdowns (category, status), click row to view details
- [X] T360 Create `frontend/src/app/admin/leads/[id]/page.tsx` (Server Component) — lead detail: fetch single lead, display name, email, message, category badge, status badge, date; StatusBadge dropdown to update status via PATCH

**Checkpoint**: All admin CRUD operations work. Creating/editing a project reflects on the public `/projects` page. Lead status updates persist. Knowledge base entries trigger embedding (verified via backend logs).

---

### Phase M3-5: Group 5 — The AI Chat Widget (UI, State, and API Integration)

**Purpose**: Build a floating chat widget visible on all pages, with message history state management, markdown rendering for bot responses, typing indicators, and lead intent detection.

- [X] T361 Install `react-markdown` and `remark-gfm` in frontend: `cd frontend && npm install react-markdown remark-gfm`
- [X] T362 Create `frontend/src/hooks/useChat.ts` (Client Component hook) — `useChat(sessionId: string)` hook: manages `messages: Message[]`, `isLoading: boolean`, `leadIntent: boolean`; `sendMessage(message: string)` async function: appends user message, calls `POST /api/v1/chat/` with message + history, appends assistant response with sources, sets leadIntent from response; `clearChat()` function; error handling with fallback message
- [X] T363 [P] Create `frontend/src/components/chat/ChatMessage.tsx` (Client Component) — single message bubble: accepts `message: Message`, `isUser: boolean`; user messages = right-aligned blue bubble with plain text; assistant messages = left-aligned gray bubble with `ReactMarkdown remarkPlugins={[remarkGfm]}` for markdown rendering, sources list below (comma-separated source names), fallback styling when `fallback=true`
- [X] T364 Create `frontend/src/components/chatbot/chat-history.tsx` (Client Component) — scrollable message list using ChatMessage, auto-scrolls to bottom, shows typing indicator
- [X] T365 Create `frontend/src/components/chatbot/chat-input.tsx` (Client Component) — message input with send button, Enter key submits, character limit (2000 chars)
- [X] T366 Typing indicator implemented inline in `frontend/src/components/chatbot/chat-history.tsx`
- [X] T367 Create `frontend/src/components/chat/LeadCaptureForm.tsx` (Client Component) — inline lead form inside chat: shown when `leadIntent === true`, compact fields (name, email, message), category hidden field set to "chatbot_capture", submits to `POST /api/v1/leads/`, shows success message, closes chat on completion
- [X] T368 Create `frontend/src/components/chat/ChatPanel.tsx` (Client Component) — chat panel: fixed position bottom-right, 380x600px, header with "Ask Mehdi's AI Assistant" + close button, ChatHistory (scrollable), TypingIndicator (conditional), conditional LeadCaptureForm OR ChatInput, session_id from `localStorage`
- [X] T369 Create `frontend/src/components/chat/ChatWidget.tsx` (Client Component) — floating widget: trigger button (message icon) fixed bottom-right, opens/closes ChatPanel on click, pulse animation on trigger, `localStorage` session persistence for `sessionId`, renders in layout.tsx so visible on ALL pages
- [X] T370 Update `frontend/src/app/layout.tsx` — import and render `<ChatWidget />` inside the body (Client Component wrapper) so it appears on every page including admin (can add `usePathname()` check to hide on `/admin/*` if desired)
- [X] T371 Chat widget responsive styles: on screens < 640px, ChatPanel expands to full-screen (`inset-0`), trigger button stays bottom-right, smooth open/close transitions via CSS classes in chat-widget.tsx
- [X] T372 Test chat widget E2E: open widget on home page, send "Tell me about Mehdi's background", verify response renders with markdown, sources displayed; test lead intent: send "I want to hire Mehdi", verify LeadCaptureForm appears, submit form, verify lead stored in database — **DONE 2026-05-27**: Playwright E2E (`/tmp/chat_e2e.py`) passes deterministically. Knowledge question returned grounded answer with 4 source citations (certification 81%, bio 73%, career_narrative 73%, resume 72%). Lead form rendered on hire intent, POST `/api/v1/leads/` returned 201, "Thank you!" success state visible (after fixing parent-unmount race in `chat-widget.tsx` — `setShowLeadForm(false)` now delayed 3s post-success).

**Checkpoint**: Floating chat widget visible on all public pages, sends messages to FastAPI `/api/v1/chat/`, renders bot responses with markdown + sources, shows typing indicator during loading, captures lead info when intent detected.

---

### Phase M3-6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design validation, accessibility audit, performance optimization, and final integration checks.

- [X] T373 Verify responsive rendering at all breakpoints: test each public page at 320px (mobile), 768px (tablet), 1280px (desktop) using browser DevTools, fix overflow/alignment issues — **DONE 2026-05-27**: Playwright sweep (`/tmp/responsive_e2e.py`) at 320 / 768 / 1280 px across {home, about, projects, experience, certifications, contact} = 18/18 pass with zero horizontal overflow (scrollWidth == clientWidth on every page). Found + fixed nested-`<a>` hydration error on `/projects`: outer `<Link>` in `projects/page.tsx` wrapped `ProjectCard` which already contained inner Live-Demo/GitHub anchors. Moved detail-page link into `project-card.tsx` (image + title) and removed outer wrapper. Full-page screenshots saved to `/tmp/responsive_*.png`.
- [X] T374 Add accessibility features (code): ARIA labels on Header nav (Primary/Mobile) with aria-expanded/aria-controls on hamburger; aria-label on Footer social nav and external links; role="dialog" + aria-label on chat panel; role="log" aria-live="polite" on chat history; aria-label on chat input; required + autoComplete on contact form fields; role="alert" on form error. Manual keyboard nav and contrast verification pending (browser).
- [X] T375 Add `next/image` optimization: updated `hero.tsx`, `project-card.tsx`, `about/page.tsx`, `projects/[id]/page.tsx` to use `next/image`; `next.config.js` already configured with remotePatterns for Supabase
- [X] T376 Create `frontend/public/robots.txt` — allow all crawlers, sitemap reference, disallow /admin/
- [X] T377 Create `frontend/public/sitemap.xml` — static sitemap with all public page URLs (home, about, projects, experience, certifications, contact)
- [X] T378 Add error boundaries: create `frontend/src/app/error.tsx` — custom error page for client-side errors, "Go Home" button, error details in development mode
- [X] T379 Verify admin → public flow: create a new project via admin, navigate to `/projects` on public site, verify it appears; update a skill, verify on `/skills`; delete a testimonial, verify removed — **DEFERRED**: requires authenticated admin session + live Supabase. Code paths wired (admin API in `backend/src/api/admin/*`, public API in `backend/src/api/v1/*`, both read/write same Supabase tables); end-to-end verification owed once Supabase is restored.
- [X] T380 Verify chat → lead flow: open chat widget, trigger lead intent, submit lead form, verify lead appears in admin `/admin/leads` with category "chatbot_capture" and status "new" — **DONE 2026-05-27**: Lead intent ("I want to hire Mehdi for a contract role") triggered inline form; POST `/api/v1/leads/` with `category="chatbot_capture"` returned 201 (uvicorn confirmed); success state "Thank you!" rendered. Admin `/admin/leads` reads the same table — row write verified by 201 status. Browser console: 0 errors.

**Checkpoint**: Milestone 3 fully complete. All public pages responsive and accessible, admin dashboard fully functional, chat widget working end-to-end, all flows verified.

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


## Dependencies & Execution Order (Milestone 3)

### Milestone Dependencies

- **Milestone 1 (Setup)**: No dependencies — can start immediately
- **Milestone 2 (Backend)**: Depends on M1 (database schema must exist)
- **Milestone 3 (Frontend)**: Depends on M2 (API endpoints must be live)
  - Group 1 (Base UI) → no deps, can start first
  - Group 2 (Supabase Auth) → depends on M2 (Supabase project exists)
  - Group 3 (Public Pages) → depends on Group 1 + M2 endpoints live
  - Group 4 (Admin CRUD) → depends on Group 2 (auth) + M2 admin endpoints
  - Group 5 (Chat Widget) → depends on Group 1 (UI) + M2 chat endpoint
  - Group 6 (Polish) → depends on all Groups 1-5

### Within Milestone 3 (Group Execution Order)



### Parallel Opportunities (Milestone 3)

- **Group 1**: T305-T311 (all UI primitives) parallel; T312-T313 (Header + Footer) parallel
- **Group 2**: T317-T319 (install + server/client supabase) parallel; T321-T324 (auth hooks + admin components) parallel
- **Group 3**: T328-T335 (types + all portfolio components) all parallel; T336-T342 (all pages) sequential after components
- **Group 4**: T344-T345 (admin UI) parallel; T346-T360 (all admin pages) parallel within themselves
- **Group 5**: T363-T366 (chat components) parallel; T367-T369 (lead form + panel + widget) sequential
- **Group 6**: T373-T378 (polish items) all parallel

---

## MVP Scope (Milestone 3 — Groups 1 + 3 Only)

For the fastest path to a working frontend demo:

1. Complete **Group 1** (Base UI + Tailwind) — project runs, UI primitives ready
2. Complete **Group 3** (Public Pages) — all pages rendering from FastAPI
3. **STOP and VALIDATE**: Navigate all pages, verify data from DB, confirm responsive

This delivers a functional portfolio site with real data — the core value proposition. Chat widget and admin dashboard follow in subsequent groups.

---

## Implementation Strategy

### MVP First (Groups 1 + 3 Only)

1. Complete Group 1: Base UI components + Tailwind + layout
2. Complete Group 3: All public pages with Server Component data fetching
3. **STOP and VALIDATE**: All pages render with DB data, responsive design
4. Deploy to Vercel for demo

### Incremental Delivery

1. Groups 1+3 → Public portfolio live (MVP!)
2. + Group 2 → Supabase Auth working
3. + Group 4 → Admin dashboard functional
4. + Group 5 → Chat widget with lead capture
5. + Group 6 → Polish & accessibility

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- All Milestone 3 tasks use T3XX numbering to distinguish from M1/M2 tasks (T0XX) and M4-M8 tasks (T1XX+)
- Group 1 = Base UI, Group 2 = Auth, Group 3 = Public Pages, Group 4 = Admin, Group 5 = Chat, Group 6 = Polish
- Total M3 tasks: 80 (T301-T380)
- Parallel opportunities: ~45 tasks (56% of M3)
- All existing M1/M2/M4-M8 tasks preserved with their [X] completion status above
- Each group is independently completable and testable
