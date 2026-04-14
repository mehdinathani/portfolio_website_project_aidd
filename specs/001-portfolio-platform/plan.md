# Implementation Plan: Portfolio & Lead Generation Platform

**Branch**: `001-portfolio-platform` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-portfolio-platform/spec.md`

## Summary

A dynamic portfolio website with an AI-powered chatbot and lead-generation system. The frontend is a Next.js App Router application deployed on Vercel, serving public portfolio pages and a protected admin dashboard. The backend is a FastAPI service deployed on Render, handling all content CRUD operations, RAG-powered chatbot queries via Gemini 1.5 Flash, and contact form lead storage. Supabase PostgreSQL serves as the single source of truth for all content, including pgvector embeddings for the RAG knowledge base. Supabase Auth protects the `/admin` route.

## Technical Context

**Language/Version**: TypeScript 5+ (frontend), Python 3.11+ (backend)
**Primary Dependencies**: Next.js 14+ (App Router), FastAPI, Supabase (PostgreSQL + pgvector + Auth), Google Gemini 1.5 Flash API, Tailwind CSS + shadcn/ui
**Storage**: Supabase PostgreSQL (relational tables for all content + pgvector for RAG embeddings)
**Testing**: pytest + httpx (backend), Jest + React Testing Library + Playwright (frontend), custom RAG accuracy tests
**Target Platform**: Web — Linux serverless (Vercel) + container (Render free tier)
**Project Type**: Web application with separate frontend and backend (Constitution Principle VII)
**Performance Goals**: FCP < 1.5s, TTI < 3.5s, API p95 < 200ms (non-chat), chat response < 30s
**Constraints**: Gemini 1.5 Flash free tier 15 RPM; $0 hosting budget; all content from Supabase; Supabase Auth for admin only
**Scale/Scope**: ~100-500 daily visitors; 5-10 projects; 20-30 skills; RAG knowledge base ~50-200 chunks; single admin user

## AI Flow Architecture: Chat Payload → Structured JSON Response

This section details the complete AI request lifecycle:

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Next.js FE  │  HTTP  │   FastAPI    │  SQL   │   Supabase   │  HTTP  │   Gemini     │
│  (Vercel)    │───────▶│   (Render)   │───────▶│   PostgreSQL │        │   1.5 Flash  │
│              │◀───────│              │◀───────│   + pgvector │◀───────│   API        │
└──────────────┘        └──────────────┘        └──────────────┘        └──────────────┘
     │                         │
     │                         │  SQL (if lead captured)
     │                         ▼
     │                  ┌──────────────┐
     │                  │   Supabase   │
     │                  │   leads tbl  │
     │                  └──────────────┘
```

### Step-by-Step Flow

**Step 1 — Next.js Chat Widget → FastAPI**

The floating chat widget on the Next.js frontend captures the user's message. It sends a POST request to `POST /api/v1/chat` on the FastAPI backend with this payload:

```json
{
  "message": "Tell me about Mehdi's transition from finance to tech",
  "session_id": "anon-session-uuid",
  "history": [
    {"role": "user", "content": "What is Mehdi's background?"},
    {"role": "assistant", "content": "Mehdi has 10+ years in finance..."}
  ]
}
```

The frontend sets `Accept: application/json` for non-streaming or `Accept: text/event-stream` for streaming responses.

**Step 2 — FastAPI Receives Request, Applies Rate Limiting**

FastAPI's rate limiting middleware checks the request against a token bucket (15 tokens/minute, matching Gemini free tier). If the limit is exceeded, it returns `429 Too Many Requests` immediately. If allowed, the request proceeds to the RAG pipeline.

**Step 3 — Cache Check**

FastAPI checks an in-memory TTL cache (5-minute expiry) for an identical query. If a cached response exists, it returns it immediately — skipping pgvector and Gemini entirely.

**Step 4 — Supabase pgvector Retrieval**

FastAPI generates an embedding for the user's message using the Gemini embeddings API (`models/text-embedding-004`). It then queries Supabase pgvector:

```sql
SELECT content, metadata, source, source_id, 1 - (embedding <=> $1) AS similarity
FROM knowledge_base
ORDER BY embedding <=> $1
LIMIT 5;
```

This returns the top 5 most similar knowledge chunks with cosine similarity scores. Only chunks with similarity > 0.7 are used (configurable threshold).

**Step 5 — Prompt Construction**

FastAPI constructs a system prompt that includes:
1. **Role definition**: "You are Mehdi's AI portfolio assistant. Answer questions about Mehdi's background, skills, projects, and career transition."
2. **Retrieved context**: The top matching knowledge base chunks, each labeled with source type and similarity score.
3. **Grounding constraint**: "Only use the provided context to answer. If the answer cannot be found in the context, say you don't have that information and suggest the visitor use the contact form."
4. **Intent detection instruction**: "If the user expresses interest in hiring Mehdi or working together, set 'lead_intent': true in your response and provide a polite prompt to collect their contact info."
5. **Structured output format**: JSON schema for the response.

**Step 6 — Gemini 1.5 Flash API Call**

FastAPI sends the constructed prompt to Gemini 1.5 Flash with `response_mime_type: "application/json"` and a JSON schema:

```json
{
  "response": "string — the chatbot's answer (max 500 chars)",
  "lead_intent": "boolean — true if user wants to hire/contact Mehdi",
  "lead_prompt": "string — optional message to collect contact info (only if lead_intent is true)",
  "sources": [
    {"source": "string — source type (project, bio, career_narrative, etc.)", "similarity": "float"}
  ],
  "fallback": "boolean — true if no relevant context was found"
}
```

**Step 7 — Response Handling**

FastAPI receives the structured JSON from Gemini and returns it to the Next.js frontend:

- If `lead_intent: true`: The chat widget displays the answer AND shows a contact form inline within the chat.
- If `fallback: true`: The chat widget displays the answer with a suggestion to use the main contact form.
- If normal response: The chat widget streams or displays the answer text.

**Step 8 — Lead Capture (Conditional)**

If `lead_intent: true` and the user provides their name, email, and message through the inline chat contact form, the frontend sends a POST to `POST /api/v1/leads`. FastAPI stores the lead in Supabase with category `"chatbot_capture"` and status `"new"`.

### Error Paths

| Failure Point | Detection | Response |
|---|---|---|
| Gemini API timeout (>20s) | httpx.TimeoutException | Return `{"response": "Mehdi's assistant is temporarily unavailable. Please use the contact form.", "fallback": true, "lead_intent": false}` |
| Gemini rate limit (429) | HTTP 429 from Gemini | Return `{"response": "I'm getting a lot of questions right now! Please try again in a minute, or use the contact form.", "fallback": true, "lead_intent": false}` |
| pgvector returns no matches (>0.7 threshold) | Empty or low-similarity results | Prompt Gemini with reduced context; set `fallback: true` |
| Supabase connection failure | Connection exception | Return `503 Service Unavailable` with graceful message |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | ✅ PASS | Spec defined at `specs/001-portfolio-platform/spec.md` with 20 FRs, 8 SCs, 5 user stories |
| II. Test-Driven | ✅ PASS | pytest (backend), Jest+RTL (frontend), Playwright (E2E), RAG accuracy tests defined |
| III. CLI-Compatible | ✅ PASS | Supabase CLI for migrations, uvicorn/npm for dev servers, all I/O via stdin/stdout |
| IV. Observability | ✅ PASS | Structured logging in FastAPI, health endpoint, error context in all services |
| V. Versioning & Breaking Changes | ✅ PASS | API URL versioning (`/api/v1/`), semantic versioning for contracts |
| VI. Simplicity | ✅ PASS | Custom RAG (no LangChain), simplest viable stack, Gemini 1.5 Flash (free, fast) |
| VII. Strict Separation of Concerns | ✅ PASS | Next.js = UI/routing only; FastAPI = all business logic + AI; HTTP API boundary |
| VIII. Zero Hardcoded Data | ✅ PASS | All content from Supabase; 8 content tables; no static JSON or hardcoded strings |
| IX. Zero-Cost Deployment | ✅ PASS | Vercel Hobby + Render Free + Supabase Free + Gemini 1.5 Flash Free tier |
| X. RAG-Powered AI Chatbot | ✅ PASS | 8-step RAG pipeline: embed → pgvector retrieve → construct prompt → Gemini → grounded JSON |
| XI. Modern, Accessible, Responsive UI | ✅ PASS | Tailwind + shadcn/ui; WCAG 2.1 AA; responsive at 320px/768px/1280px |

**Gate Result**: ✅ ALL PASS — proceeding to Phase 0/1 artifacts

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-platform/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/sp.tasks command — NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/                              # Next.js App Router (TypeScript)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout: fonts, metadata, global providers
│   │   ├── page.tsx                   # Home page (hero, featured projects, CTA)
│   │   ├── about/
│   │   │   └── page.tsx               # About Me (bio, finance-to-tech narrative)
│   │   ├── projects/
│   │   │   ├── page.tsx               # Projects listing (gallery grid)
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Project detail page
│   │   ├── skills/
│   │   │   └── page.tsx               # Skills (grouped by category, proficiency bars)
│   │   ├── experience/
│   │   │   └── page.tsx               # Experience timeline
│   │   ├── certifications/
│   │   │   └── page.tsx               # Certifications list
│   │   ├── contact/
│   │   │   └── page.tsx               # Contact form page
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx           # Supabase Auth login page
│   │       ├── layout.tsx             # Admin auth guard (redirects if not authenticated)
│   │       ├── page.tsx               # Admin dashboard overview
│   │       ├── projects/
│   │       │   └── page.tsx           # Admin: CRUD for projects
│   │       ├── skills/
│   │       │   └── page.tsx           # Admin: CRUD for skills
│   │       ├── experience/
│   │       │   └── page.tsx           # Admin: CRUD for experience
│   │       ├── certifications/
│   │       │   └── page.tsx           # Admin: CRUD for certifications
│   │       ├── testimonials/
│   │       │   └── page.tsx           # Admin: CRUD for testimonials
│   │       ├── knowledge-base/
│   │       │   └── page.tsx           # Admin: manage RAG knowledge base entries
│   │       └── leads/
│   │           └── page.tsx           # Admin: view and manage leads (contact submissions)
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (Button, Card, Input, etc.)
│   │   ├── layout/
│   │   │   ├── header.tsx             # Site header with navigation
│   │   │   └── footer.tsx             # Site footer with social links
│   │   ├── sections/
│   │   │   ├── hero.tsx               # Home page hero section
│   │   │   ├── project-card.tsx       # Project card component
│   │   │   ├── skill-badge.tsx        # Skill badge with proficiency
│   │   │   ├── timeline-item.tsx      # Experience timeline item
│   │   │   └── contact-form.tsx       # Contact form with validation
│   │   └── chatbot/
│   │       ├── chat-widget.tsx        # Floating chat button + panel
│   │       ├── chat-message.tsx       # Individual message bubble
│   │       └── chat-lead-form.tsx     # Inline lead capture form (shown when lead_intent=true)
│   ├── lib/
│   │   ├── api.ts                     # FastAPI HTTP client (fetch wrapper with error handling)
│   │   └── supabase-client.ts         # Supabase browser client (for Auth in admin)
│   ├── hooks/
│   │   └── use-chat.ts                # Chat session state management hook
│   ├── types/
│   │   └── api.ts                     # TypeScript types for API responses
│   └── styles/
│       └── globals.css                # Tailwind imports, CSS variables
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json

backend/                               # FastAPI (Python 3.11+)
├── src/
│   ├── main.py                        # FastAPI app entry, CORS middleware, router mount
│   ├── config.py                      # Environment variable configuration (pydantic-settings)
│   ├── models/
│   │   ├── base.py                    # SQLAlchemy base model
│   │   ├── profile.py                 # Profile entity
│   │   ├── project.py                 # Project entity
│   │   ├── skill.py                   # Skill entity
│   │   ├── experience.py              # Experience entity
│   │   ├── certification.py           # Certification entity
│   │   ├── testimonial.py             # Testimonial entity
│   │   ├── knowledge_base.py          # Knowledge base entry (with pgvector column)
│   │   └── lead.py                    # Lead (contact submission) entity
│   ├── schemas/
│   │   ├── profile.py                 # Pydantic request/response schemas
│   │   ├── project.py
│   │   ├── skill.py
│   │   ├── experience.py
│   │   ├── certification.py
│   │   ├── testimonial.py
│   │   ├── knowledge_base.py
│   │   ├── lead.py
│   │   ├── chat.py                    # Chat request/response schemas (structured JSON)
│   │   └── common.py                  # Pagination, error response schemas
│   ├── services/
│   │   ├── profile_service.py         # CRUD for profiles
│   │   ├── project_service.py         # CRUD for projects
│   │   ├── skill_service.py           # CRUD for skills
│   │   ├── experience_service.py      # CRUD for experience
│   │   ├── certification_service.py   # CRUD for certifications
│   │   ├── testimonial_service.py     # CRUD for testimonials
│   │   ├── lead_service.py            # CRUD + status management for leads
│   │   ├── knowledge_base_service.py  # CRUD + auto-embedding on create/update
│   │   ├── rag_service.py             # RAG retrieval (pgvector similarity search)
│   │   ├── gemini_service.py          # Gemini API client (chat completions + embeddings)
│   │   └── cache_service.py           # In-memory TTL cache for chat queries
│   ├── api/
│   │   ├── v1/
│   │   │   ├── profile.py             # GET /api/v1/profile
│   │   │   ├── projects.py            # GET /api/v1/projects, GET /api/v1/projects/{id}
│   │   │   ├── skills.py              # GET /api/v1/skills
│   │   │   ├── experience.py          # GET /api/v1/experience
│   │   │   ├── certifications.py      # GET /api/v1/certifications
│   │   │   ├── testimonials.py        # GET /api/v1/testimonials
│   │   │   ├── chat.py                # POST /api/v1/chat (RAG chatbot)
│   │   │   ├── leads.py               # POST /api/v1/leads (contact form + chatbot lead capture)
│   │   │   ├── health.py              # GET /api/v1/health
│   │   │   └── router.py              # Version router aggregation
│   │   └── admin/
│   │       ├── projects.py            # POST/PUT/DELETE /api/v1/admin/projects
│   │       ├── skills.py              # POST/PUT/DELETE /api/v1/admin/skills
│   │       ├── experience.py          # POST/PUT/DELETE /api/v1/admin/experience
│   │       ├── certifications.py      # POST/PUT/DELETE /api/v1/admin/certifications
│   │       ├── testimonials.py        # POST/PUT/DELETE /api/v1/admin/testimonials
│   │       ├── knowledge_base.py      # POST/PUT/DELETE /api/v1/admin/knowledge-base
│   │       ├── leads.py               # GET/PATCH /api/v1/admin/leads
│   │       └── router.py              # Admin router (protected by Supabase Auth verification)
│   ├── middleware/
│   │   ├── auth.py                    # Supabase JWT verification middleware (admin routes)
│   │   ├── rate_limiter.py            # Token bucket rate limiter (chat endpoint)
│   │   └── logging.py                 # Structured logging middleware
│   └── db/
│       ├── session.py                 # Supabase async engine + session factory
│       └── vector_extension.py        # pgvector column type registration
├── tests/
│   ├── unit/
│   │   ├── test_rag_service.py
│   │   ├── test_gemini_service.py
│   │   ├── test_cache_service.py
│   │   └── test_lead_service.py
│   ├── integration/
│   │   ├── test_public_api.py         # All GET endpoint tests
│   │   ├── test_chat_endpoint.py      # Chat RAG pipeline integration
│   │   ├── test_contact_form.py       # Lead creation tests
│   │   └── test_admin_api.py          # Admin CRUD tests (with mock auth)
│   └── contract/
│       └── test_api_contracts.py      # Validate responses match OpenAPI schema
├── migrations/
│   ├── 001_enable_pgvector.sql
│   ├── 002_create_profiles.sql
│   ├── 003_create_projects.sql
│   ├── 004_create_skills.sql
│   ├── 005_create_experience.sql
│   ├── 006_create_certifications.sql
│   ├── 007_create_testimonials.sql
│   ├── 008_create_knowledge_base.sql
│   ├── 009_create_leads.sql
│   └── seed_data.sql                  # Initial content population
├── requirements.txt
├── pyproject.toml
└── .env.example
```

**Structure Decision**: Separate `frontend/` and `backend/` directories enforce Constitution Principle VII (Strict Separation of Concerns). The Next.js frontend handles ONLY UI, routing, and client-side state. The FastAPI backend handles ALL business logic, data access, AI operations, and authentication verification. Communication is exclusively via HTTP REST API with contracts defined in `contracts/api-contracts.md`. Admin authentication uses Supabase Auth — the frontend obtains a JWT via Supabase browser client, includes it in API requests, and the backend verifies it via middleware.

## Supabase Auth Integration for /admin

### Authentication Flow

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Next.js FE  │     │  Supabase Auth   │     │   FastAPI    │
│  (Browser)   │     │  (Cloud Service) │     │   (Render)   │
└──────┬───────┘     └────────┬─────────┘     └──────┬───────┘
       │                      │                       │
       │  1. Email/Password   │                       │
       ├─────────────────────▶│                       │
       │                      │                       │
       │  2. JWT Token        │                       │
       │◀─────────────────────┤                       │
       │                      │                       │
       │  3. Access /admin    │                       │
       │  (layout.tsx guard   │                       │
       │   checks session)    │                       │
       │                      │                       │
       │  4. GET /api/v1/     │                       │
       │     admin/projects   │                       │
       │  Header:             │                       │
       │  Authorization:      │                       │
       │  Bearer <JWT>        │                       │
       ├─────────────────────────────────────────────▶│
       │                      │                       │
       │                      │        5. Verify JWT  │
       │                      │        (supabase-py)  │
       │                      │◀──────────────────────┤
       │                      │                       │
       │  6. 200 OK + Data    │                       │
       │◀─────────────────────────────────────────────┤
```

### Implementation Details

1. **Supabase project setup**: Email/password auth enabled. Single admin user created in Supabase dashboard.
2. **Frontend** (`/admin/login/page.tsx`): Uses `@supabase/supabase-js` browser client to sign in with email/password. On success, stores session in cookies.
3. **Frontend** (`/admin/layout.tsx`): Supabase Auth guard — checks `supabase.auth.getSession()` on every admin page render. If no session, redirects to `/admin/login`.
4. **Frontend API calls**: All admin API requests include the JWT in the `Authorization: Bearer <token>` header.
5. **Backend** (`middleware/auth.py`): FastAPI middleware extracts the JWT, verifies it using `supabase-py`'s `auth.admin.get_user(token)`, and rejects unauthenticated requests with `401 Unauthorized`.
6. **Row Level Security (RLS)**: Supabase RLS policies ensure only authenticated admin users can write to content tables. Public GET queries use the Supabase service role key (backend only — never exposed to frontend).

## Data Model Summary

See `data-model.md` for full schema. Key tables:

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | Mehdi's bio and contact info | full_name, headline, bio, email, social URLs |
| `projects` | Portfolio projects | title, description, tech_stack, URLs, featured, order_index |
| `skills` | Technical competencies | name, category, proficiency (1-5), order_index |
| `experience` | Work history | company, role, start_date, end_date, responsibilities |
| `certifications` | Credentials | name, issuer, date, credential_url |
| `testimonials` | Recommendations | author_name, author_role, quote, date |
| `knowledge_base` | RAG embeddings | content, source, metadata, embedding (vector 768) |
| `leads` | Contact submissions | name, email, message, category, status, created_at |

## Complexity Tracking

> No constitution violations justified. All principles pass gates cleanly.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
