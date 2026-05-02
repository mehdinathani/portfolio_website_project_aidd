# Implementation Plan: Portfolio & Lead Generation Platform

**Feature**: 001-portfolio-platform
**Plan Date**: 2026-04-12
**Spec Version**: v1 (from `spec.md`)
**API Version**: v1 (from `api-contracts.md`)
**Data Model Version**: v1 (from `data-model.md`)
**Status**: ✅ READY FOR IMPLEMENTATION

---

## Overview

Build a full-stack portfolio and lead-generation platform for Mehdi Abbas Nathani, transitioning from Senior Finance Executive to Agentic AI & Software Engineer. Milestone 2 focuses on the **FastAPI Backend & Gemini AI Agent**: a Python FastAPI service that uses Supabase REST API (supabase-py) for all data operations, with a RAG-powered chatbot using Google Gemini 1.5 Flash and text-embedding-004.

---

## Technical Context

**Language/Version**: Python 3.11+, TypeScript 5+ (frontend)
**Primary Dependencies**: FastAPI, supabase-py, google-genai, pydantic-settings, slowapi
**Storage**: Supabase PostgreSQL (relational tables + pgvector for RAG embeddings), Supabase Auth
**Testing**: pytest + httpx (backend), Jest + React Testing Library (frontend)
**Target Platform**: Web — Vercel (frontend), Render free tier (backend)
**Project Type**: Web application with separate backend and frontend
**Performance Goals**: FCP < 1.5s, API p95 < 200ms (non-chat), chat response < 30s
**Constraints**: Gemini 1.5 Flash free tier 15 RPM; $0 hosting budget; all content from Supabase
**Scale/Scope**: ~100-500 daily visitors; RAG knowledge base ~50-200 chunks; single admin user

---

## Constitution Check

*GATE: Must pass before implementation.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Library-First | ✅ Pass | Backend organized as service modules (rag_service, gemini_service, etc.) |
| II. CLI Interface | ✅ Pass | FastAPI provides HTTP API; no CLI needed for this web project |
| III. Test-First | ⚠️ Partial | Tests exist in `backend/src/tests/` but coverage incomplete |
| IV. Integration Testing | ✅ Pass | Contract tests needed for Supabase REST API and Gemini API |
| V. Observability | ✅ Pass | Logging middleware in `backend/src/middleware/logging.py` |
| VI. Versioning | ✅ Pass | API versioned under `/api/v1/` |
| VII. Simplicity | ✅ Pass | No over-engineering; supabase-py over raw SQL |

---

## Project Structure

### Documentation (this feature)

```
specs/001-portfolio-platform/
├── plan.md              # This file
├── spec.md              # Feature requirements
├── research.md          # Research findings
├── data-model.md        # Database schema
├── quickstart.md        # Setup guide
├── contracts/           # API contracts
│   └── openapi.yaml    # OpenAPI schema
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Settings from env (Pydantic)
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py          # Supabase client singleton
│   │   └── vector_extension.py # pgvector helpers
│   ├── models/                 # Pydantic models (request/response)
│   │   ├── profile.py
│   │   ├── project.py
│   │   ├── skill.py
│   │   ├── experience.py
│   │   ├── certification.py
│   │   ├── testimonial.py
│   │   ├── knowledge_base.py
│   │   └── lead.py
│   ├── schemas/                # Request/response schemas
│   │   └── chat.py            # ChatRequest, ChatResponse, SourceRef
│   ├── services/               # Business logic
│   │   ├── rag_service.py     # RAG retrieval via Supabase RPC
│   │   ├── gemini_service.py  # Gemini embed + chat
│   │   ├── prompt_builder.py  # System prompt construction
│   │   ├── cache_service.py   # In-memory response cache
│   │   ├── profile_service.py
│   │   ├── project_service.py
│   │   ├── skill_service.py
│   │   ├── experience_service.py
│   │   ├── certification_service.py
│   │   ├── testimonial_service.py
│   │   └── lead_service.py
│   ├── api/
│   │   └── v1/                # API version 1 routers
│   │       ├── router.py      # Central router, mounts all sub-routers
│   │       ├── profile.py
│   │       ├── projects.py
│   │       ├── skills.py
│   │       ├── experience.py
│   │       ├── certifications.py
│   │       ├── testimonials.py
│   │       ├── chat.py        # POST /api/v1/chat
│   │       ├── leads.py
│   │       └── health.py
│   └── middleware/
│       ├── logging.py          # Structured request logging
│       └── rate_limiter.py    # 15 RPM rate limiting for chat
├── supabase/
│   ├── migrations/
│   │   ├── 001_enable_pgvector.sql
│   │   ├── 002_create_profiles.sql
│   │   ├── 003_create_projects.sql
│   │   ├── 004_create_skills.sql
│   │   ├── 005_create_experience.sql
│   │   ├── 006_create_certifications.sql
│   │   ├── 007_create_testimonials.sql
│   │   ├── 008_create_knowledge_base.sql
│   │   ├── 009_create_leads.sql
│   │   └── 010_create_match_rpc.sql  # match_knowledge RPC
│   └── seed_data.sql
├── .env.example
├── requirements.txt
└── tests/
```

---

## Milestone 2: FastAPI Backend & Gemini AI Agent

### Objective

Implement a FastAPI backend service that exposes CRUD APIs for all portfolio content (profiles, projects, skills, experience, certifications, testimonials, leads) via Supabase REST API, and a RAG-powered chatbot endpoint that uses Google Gemini 1.5 Flash for response generation with text-embedding-004 for vector retrieval.

### 1. Supabase Client Initialization (`backend/src/db/session.py`)

**File**: `backend/src/db/session.py`

The Supabase client is initialized as a lazily-evaluated singleton using `supabase-py`. Configuration is loaded via Pydantic Settings from environment variables.

**Design**:

```python
# backend/src/db/session.py
from supabase import create_client, Client
from src.config import settings

_supabase: Client | None = None

def get_supabase() -> Client:
    """Lazily initialize and return the Supabase client singleton.

    Uses service_role key for backend-to-Supabase communication
    (bypasses RLS for admin operations). Public reads use anon key
    via separate client if needed.
    """
    global _supabase
    if _supabase is None:
        _supabase = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )
    return _supabase
```

**Configuration** (from `backend/src/config.py`):

```python
# backend/src/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str = "http://127.0.0.1:54321"   # Supabase project URL
    supabase_service_role_key: str = ""                # Service role key (backend auth)
    supabase_anon_key: str = ""                        # Anon key (public reads)
    supabase_jwt_secret: str = ""                      # JWT secret for Auth verification
    gemini_api_key: str = ""                           # Google Gemini API key

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
```

**Key decisions**:
- Singleton pattern: client created once, reused across requests (avoids reconnection overhead)
- Service role key: backend acts as admin; RLS bypassed for CRUD operations
- Lazy init: client not created at import time; only when first requested (enables testing with mocks)

---

### 2. RAG Vector Search RPC (`match_knowledge`)

**File**: `supabase/migrations/010_create_match_rpc.sql`

This Supabase RPC (stored procedure) performs cosine similarity search against the `knowledge_base` table using the `<=>` (cosine distance) operator from pgvector.

**SQL Schema**:

```sql
-- Migration 010: Create match_knowledge RPC function for RAG vector similarity search
-- Accepts a 768-dimension query embedding (text-embedding-004 output)
-- Returns top-matching knowledge base entries with similarity scores

CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
  match_count int DEFAULT 5,
  similarity_threshold float DEFAULT 0.7
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  source text,
  source_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    kb.source,
    kb.source_id,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- HNSW index for fast approximate nearest-neighbor search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding_hnsw
ON knowledge_base
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

COMMENT ON FUNCTION match_knowledge IS
  'RAG vector similarity search: accepts 768-dimension query embedding, '
  'returns top matching content with cosine similarity scores.';
```

**How it works**:
- `<=>` is the pgvector cosine distance operator (0 = identical, 2 = opposite)
- `1 - (embedding <=> query_embedding)` converts distance to similarity (1.0 = perfect match)
- `similarity_threshold` filters out low-relevance chunks (default 0.7 = 70%+ similarity)
- HNSW index (`vector_cosine_ops`) enables sub-linear search time for production scale
- Called from Python via: `supabase.rpc("match_knowledge", {...}).execute()`

---

### 3. API Contracts (`backend/src/api/v1/router.py`)

All endpoints are mounted under `/api/v1/` with tags for OpenAPI documentation.

#### 3.1 Central Router

```python
# backend/src/api/v1/router.py
from fastapi import APIRouter
from src.api.v1 import profile, projects, skills, experience, certifications, testimonials, chat, leads, health

router = APIRouter(prefix="/api/v1")

router.include_router(profile.router,     prefix="/profile",       tags=["Profile"])
router.include_router(projects.router,     prefix="/projects",      tags=["Projects"])
router.include_router(skills.router,      prefix="/skills",         tags=["Skills"])
router.include_router(experience.router,  prefix="/experience",    tags=["Experience"])
router.include_router(certifications.router, prefix="/certifications", tags=["Certifications"])
router.include_router(testimonials.router, prefix="/testimonials",  tags=["Testimonials"])
router.include_router(chat.router,         prefix="/chat",          tags=["Chat"])
router.include_router(leads.router,         prefix="/leads",         tags=["Leads"])
router.include_router(health.router,       prefix="/health",        tags=["Health"])
```

#### 3.2 CRUD Endpoint Contracts

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| **Profile** | | | |
| GET | `/api/v1/profile/` | Get Mehdi's profile (single row) | Public |
| PUT | `/api/v1/profile/` | Update profile fields | Admin (Supabase Auth) |
| **Projects** | | | |
| GET | `/api/v1/projects/` | List all projects, ordered by display_order | Public |
| GET | `/api/v1/projects/{id}` | Get single project detail | Public |
| POST | `/api/v1/projects/` | Create new project | Admin |
| PUT | `/api/v1/projects/{id}` | Update project | Admin |
| DELETE | `/api/v1/projects/{id}` | Delete project | Admin |
| **Skills** | | | |
| GET | `/api/v1/skills/` | List all skills, grouped by category | Public |
| GET | `/api/v1/skills/{id}` | Get single skill | Public |
| POST | `/api/v1/skills/` | Create new skill | Admin |
| PUT | `/api/v1/skills/{id}` | Update skill | Admin |
| DELETE | `/api/v1/skills/{id}` | Delete skill | Admin |
| **Experience** | | | |
| GET | `/api/v1/experience/` | List all experience, ordered chronologically | Public |
| GET | `/api/v1/experience/{id}` | Get single experience entry | Public |
| POST | `/api/v1/experience/` | Create experience entry | Admin |
| PUT | `/api/v1/experience/{id}` | Update experience | Admin |
| DELETE | `/api/v1/experience/{id}` | Delete experience | Admin |
| **Certifications** | | | |
| GET | `/api/v1/certifications/` | List all certifications | Public |
| GET | `/api/v1/certifications/{id}` | Get single certification | Public |
| POST | `/api/v1/certifications/` | Create certification | Admin |
| PUT | `/api/v1/certifications/{id}` | Update certification | Admin |
| DELETE | `/api/v1/certifications/{id}` | Delete certification | Admin |
| **Testimonials** | | | |
| GET | `/api/v1/testimonials/` | List all testimonials | Public |
| POST | `/api/v1/testimonials/` | Create testimonial | Admin |
| PUT | `/api/v1/testimonials/{id}` | Update testimonial | Admin |
| DELETE | `/api/v1/testimonials/{id}` | Delete testimonial | Admin |
| **Leads** | | | |
| GET | `/api/v1/leads/` | List all leads (filter by status/category) | Admin |
| GET | `/api/v1/leads/{id}` | Get single lead | Admin |
| POST | `/api/v1/leads/` | Submit contact form (public) | Public |
| PUT | `/api/v1/leads/{id}` | Update lead status | Admin |
| DELETE | `/api/v1/leads/{id}` | Delete lead | Admin |
| **Health** | | | |
| GET | `/api/v1/health/` | Health check (DB + Gemini connectivity) | Public |

#### 3.3 Request/Response Schemas (excerpt for key endpoints)

**Chat** (`backend/src/schemas/chat.py`):

```python
from pydantic import BaseModel
from typing import Optional, List

class Message(BaseModel):
    role: str          # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = None

class SourceRef(BaseModel):
    source: str         # "resume", "project", "bio", etc.
    similarity: float   # 0.0 - 1.0

class ChatResponse(BaseModel):
    response: str
    lead_intent: bool = False
    lead_prompt: Optional[str] = None
    sources: Optional[List[SourceRef]] = None
    fallback: bool = False
```

**Lead Submission** (`backend/src/schemas/lead.py`):

```python
class LeadCreate(BaseModel):
    name: str
    email: str
    message: str
    category: Optional[str] = "other"  # "job_offer", "freelance", "collaboration", "other"

class LeadUpdate(BaseModel):
    status: Optional[str] = None  # "new", "reviewed", "replied", "archived"
```

---

### 4. `/api/v1/chat` Endpoint Architecture

The chat endpoint implements a **RAG (Retrieval-Augmented Generation)** pipeline with lead-intent detection.

#### 4.1 Data Flow

```
Visitor Message
       │
       ▼
┌─────────────────────┐
│ 1. Cache Lookup     │ ← SHA-256(message) → check in-memory cache (TTL 300s)
│   (skip if miss)    │
└─────────────────────┘
       │ (miss)
       ▼
┌──────────────────────────────────────────────┐
│ 2. Generate Query Embedding                  │
│    Input:  user message (string)             │
│    Action: google.genai Client.models.      │
│            embed_content(                     │
│              model="text-embedding-004",     │
│              contents=message,                │
│              task_type="retrieval_query"     │
│            )                                 │
│    Output: 768-dimension float vector        │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ 3. Retrieve Context via Supabase RPC        │
│    Action: supabase.rpc("match_knowledge", { │
│              "query_embedding": embedding,   │
│              "match_count": 5,               │
│              "similarity_threshold": 0.7     │
│            }).execute()                       │
│    Output: List of {content, metadata,       │
│            source, source_id, similarity}    │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ 4. Build System Prompt                      │
│    Action: prompt_builder.build_system_     │
│            prompt(context_chunks, history)   │
│                                              │
│    Prompt includes:                          │
│    - Mehdi's persona & background            │
│    - Retrieved knowledge base context        │
│    - Conversation history (if any)          │
│    - Lead capture instructions               │
│    - "No hallucination" constraint           │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ 5. Call Gemini 1.5 Flash                   │
│    Action: google.genai Client.models.      │
│            generate_content(                  │
│              model="gemini-1.5-flash",       │
│              contents=system_prompt           │
│            )                                 │
│    Output: {response: str}                  │
│                                              │
│    Error handling:                           │
│    - API error → fallback message + contact  │
│      form offer                              │
│    - Rate limit (15 RPM) → rate limiter      │
│      middleware returns 429                   │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ 6. Lead Intent Detection                    │
│    Heuristic check: response contains hiring  │
│    keywords OR explicit check on user message │
│    If lead intent detected → include         │
│    lead_prompt in response                   │
└──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 7. Cache & Return   │ ← Store response in cache, return ChatResponse
└─────────────────────┘
```

#### 4.2 Key Implementation Files

| File | Responsibility |
|------|----------------|
| `backend/src/api/v1/chat.py` | FastAPI route handler, cache check, response construction |
| `backend/src/services/rag_service.py` | `retrieve_context()`: embedding → Supabase RPC → context chunks |
| `backend/src/services/gemini_service.py` | `generate_embedding()` and `generate_chat_response()` |
| `backend/src/services/prompt_builder.py` | `build_system_prompt()`: assembles RAG context into Gemini prompt |
| `backend/src/services/cache_service.py` | In-memory TTL cache (LRU, 300s TTL for chat) |
| `backend/src/middleware/rate_limiter.py` | SlowAPI-based rate limiting (15 RPM for `/chat`) |

#### 4.3 Error Handling & Fallbacks

| Scenario | Behavior |
|----------|----------|
| Gemini API unavailable | Return fallback message: "Mehdi's assistant is temporarily unavailable. Please use the contact form." |
| Gemini rate limited (15 RPM) | Rate limiter middleware returns HTTP 429 with retry-after header |
| No relevant context found (< 0.7 similarity) | Gemini receives prompt with "No relevant information found" context → responds accordingly |
| Supabase RPC fails | Return fallback message, log error with structured context |
| Invalid request (empty message) | FastAPI validation returns HTTP 422 with field errors |

---

## Milestone 2 Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| `db/session.py` — Supabase client | ✅ Done | Singleton pattern implemented |
| `config.py` — Settings | ✅ Done | Pydantic Settings with `.env` support |
| `010_create_match_rpc.sql` — RPC | ✅ Done | `match_knowledge` with HNSW index |
| `008_create_knowledge_base.sql` | ✅ Done | Table + embedding column (768-dim) |
| `api/v1/router.py` — Central router | ✅ Done | All 9 sub-routers mounted |
| `api/v1/chat.py` — Chat endpoint | ✅ Done | Full RAG pipeline wired |
| `services/rag_service.py` | ✅ Done | Calls `match_knowledge` RPC |
| `services/gemini_service.py` | ✅ Done | text-embedding-004 + gemini-1.5-flash |
| `services/prompt_builder.py` | ✅ Done | System prompt assembly |
| `services/cache_service.py` | ✅ Done | In-memory TTL cache |
| `middleware/rate_limiter.py` | ✅ Done | 15 RPM limit on chat |
| CRUD endpoints (profile, projects, etc.) | ✅ Done | All routers and services exist |
| API contracts documentation | ✅ Done | `contracts/openapi.yaml` generated |
| Integration tests | ✅ Done | 23 tests in `tests/test_integration.py` |
| Error handling edge cases | ✅ Done | Enhanced Gemini/RAG error handling, rate limiter improvements |

---

## Research Findings

### RAG Embedding Strategy
- **Decision**: Use `text-embedding-004` with `task_type="retrieval_document"` for indexing and `"retrieval_query"` for queries
- **Rationale**: Gemini embeddings are free-tier eligible and produce 768-dimension vectors optimized for retrieval
- **Alternative considered**: OpenAI `text-embedding-3-small` — rejected (cost, no free tier for this project)

### Vector Search Approach
- **Decision**: Supabase RPC (`match_knowledge`) using pgvector `<=>` operator + HNSW index
- **Rationale**: Keeps vector search server-side (Supabase), avoids fetching all embeddings to Python
- **Alternative considered**: Python-side cosine similarity — rejected (would require fetching all rows, doesn't scale)

### Chat Model Selection
- **Decision**: Gemini 1.5 Flash via `google-genai` SDK
- **Rationale**: Free tier (15 RPM), fast responses, good grounding capability
- **Alternative considered**: Gemini 1.5 Pro — rejected (slower, same RPM limit on free tier)

---

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|-----------|--------------------------------------|
| RAG pipeline (4 services) | Required for grounded AI responses per FR-007 | Single monolithic chat handler would be untestable |
| HNSW index | Sub-linear search for growing knowledge base | Brute-force (`<=>` without index) too slow beyond ~1k rows |

---

---

## Milestone 3: Next.js Frontend & Admin Panel

**Objective**: Build the complete frontend using Next.js 14+ (App Router), TypeScript, and TailwindCSS. Includes public portfolio pages, a floating AI chat widget, and a Supabase Auth-protected admin dashboard for content management.

**Status**: 🔵 PLANNING

---

### 1. Technical Context

| Item | Value |
|------|-------|
| **Language/Version** | TypeScript 5+, Next.js 14+ (App Router) |
| **Primary Dependencies** | next, react@18+, tailwindcss, @supabase/ssr, @supabase/supabase-js, react-markdown, remarkable (or marked) |
| **Styling** | TailwindCSS 3.x (utility-first) |
| **Auth** | Supabase Auth (cookie-based sessions via @supabase/ssr) |
| **Data Fetching** | Next.js Server Components (`fetch` with `cache: 'no-store'` or `revalidate`), Client Components for interactive UI |
| **State Management (Client)** | React useState/useReducer for chat widget, React Context for auth state |
| **Testing** | Jest + React Testing Library, Playwright (E2E for chat + admin flows) |
| **Target Platform** | Vercel (frontend), Render (backend API) |
| **Performance Goals** | FCP < 1.5s, Lighthouse 90+ (perf + a11y), chat response rendered < 2s |
| **Constraints** | Must use existing FastAPI backend at `/api/v1/*`; all content dynamic from Supabase via backend; WCAG 2.1 AA compliance |
| **Scale/Scope** | ~100-500 daily visitors; single admin user |

---

### 2. Directory Structure

```
frontend/
├── public/
│   └── images/                  # Static assets (profile photo, project thumbnails)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: HTML shell, fonts, global styles, ChatWidget
│   │   ├── page.tsx             # Home page (Server Component)
│   │   ├── about/
│   │   │   └── page.tsx        # About page (Server Component)
│   │   ├── projects/
│   │   │   ├── page.tsx        # Projects listing (Server Component)
│   │   │   └── [id]/page.tsx  # Single project detail (Server Component)
│   │   ├── experience/
│   │   │   └── page.tsx        # Experience timeline (Server Component)
│   │   ├── certifications/
│   │   │   └── page.tsx        # Certifications list (Server Component)
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact form page (Client Component)
│   │   ├── admin/
│   │   │   ├── layout.tsx      # Admin layout with auth guard + sidebar
│   │   │   ├── page.tsx        # Admin dashboard overview (Server Component)
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login form (Client Component)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx    # Project list + create button (Server Component)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Edit project form (Client Component)
│   │   │   │       └── new/
│   │   │   │           └── page.tsx  # Create project form (Client Component)
│   │   │   ├── skills/
│   │   │   │   ├── page.tsx    # Skills management (Server Component)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit skill form (Client Component)
│   │   │   ├── experience/
│   │   │   │   └── page.tsx    # Experience management (Server Component)
│   │   │   ├── certifications/
│   │   │   │   └── page.tsx    # Certifications management (Server Component)
│   │   │   ├── testimonials/
│   │   │   │   └── page.tsx    # Testimonials management (Server Component)
│   │   │   ├── knowledge-base/
│   │   │   │   └── page.tsx    # KB entry management (Server Component)
│   │   │   └── leads/
│   │   │       └── page.tsx    # Leads inbox (Server Component)
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # Optional: proxy chat to backend (Server-side)
│   │   ├── globals.css         # Tailwind directives + global styles
│   │   └── not-found.tsx       # Custom 404 page
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx     # Site navigation (Client Component for mobile menu)
│   │   │   ├── Footer.tsx     # Site footer (Server Component)
│   │   │   └── AdminSidebar.tsx  # Admin nav (Client Component)
│   │   ├── portfolio/          # Portfolio-specific components
│   │   │   ├── HeroSection.tsx      # Home page hero (Server Component)
│   │   │   ├── ProjectCard.tsx      # Project display card (Server Component)
│   │   │   ├── ProjectGallery.tsx  # Projects grid (Server Component)
│   │   │   ├── SkillsGroup.tsx      # Skills by category (Server Component)
│   │   │   ├── ExperienceTimeline.tsx # Experience entries (Server Component)
│   │   │   ├── CertificationsList.tsx  # Certifications (Server Component)
│   │   │   └── ContactForm.tsx     # Lead capture form (Client Component)
│   │   ├── chat/               # Chat widget components
│   │   │   ├── ChatWidget.tsx       # Floating trigger + panel (Client Component)
│   │   │   ├── ChatMessage.tsx      # Single message bubble (Client Component)
│   │   │   ├── ChatInput.tsx        # Message input field (Client Component)
│   │   │   ├── ChatHistory.tsx      # Scrollable message list (Client Component)
│   │   │   └── TypingIndicator.tsx # "Bot is typing..." animation
│   │   └── admin/              # Admin-specific components
│   │       ├── AdminHeader.tsx      # Admin top bar with user menu
│   │       ├── LeadTable.tsx        # Leads data table (Client Component)
│   │       └── StatusBadge.tsx     # Lead status indicator
│   ├── lib/
│   │   ├── api.ts              # API client functions (fetch wrappers for FastAPI)
│   │   ├── types.ts            # TypeScript types generated from OpenAPI schema
│   │   ├── supabase.ts         # Supabase server client (for Server Components)
│   │   ├── supabase-client.ts  # Supabase browser client (for Client Components)
│   │   ├── chat.ts             # Chat API interaction logic
│   │   └── utils.ts            # Formatting helpers, date utils, etc.
│   ├── middleware.ts           # Next.js middleware for Supabase Auth + route protection
│   └── hooks/
│       ├── useAuth.ts          # Auth hook (Client Components)
│       └── useChat.ts          # Chat state management hook (Client Components)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local.example          # NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_SUPABASE_URL, etc.
└── postcss.config.js
```

---

### 3. Supabase Auth Implementation

#### 3.1 Next.js Middleware (`src/middleware.ts`)

Uses `@supabase/ssr` to create a server client that reads/writes cookies. The middleware runs on every request (except static assets) to:

1. **Refresh the auth token** — keeps the session alive via `supabase.auth.getUser()`
2. **Protect `/admin/*` routes** — redirect unauthenticated users to `/admin/login`
3. **Allow public routes** — `/`, `/about`, `/projects/*`, `/experience`, `/certifications`, `/contact`

```typescript
// src/middleware.ts (conceptual)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Always call getUser() to validate the session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = new URL('/admin/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect logged-in users away from login page
  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*'],
}
```

#### 3.2 Supabase Client Setup

**Server Client** (`src/lib/supabase.ts`) — for Server Components, Route Handlers, and Server Actions:
- Uses `cookies()` from `next/headers` to read request cookies
- Creates a Supabase client with `createServerClient` from `@supabase/ssr`
- Used in Server Components to verify auth for admin pages

**Browser Client** (`src/lib/supabase-client.ts`) — for Client Components:
- Uses `createBrowserClient` from `@supabase/ssr`
- Singleton pattern to avoid multiple instances
- Used in login form, auth state hooks

#### 3.3 Auth Flow

```
/admin/* request
     │
     ▼
Middleware: supabase.auth.getUser()
     │
     ├── No user → redirect to /admin/login?redirect=<original_url>
     │
     └── Has user → allow request to proceed
              │
              ▼
         Admin layout: Double-check auth via server-side Supabase client
              │
              ├── Authenticated → render admin page
              └── Not authenticated → redirect to login (defense-in-depth)
```

---

### 4. Data Fetching Strategy

#### 4.1 Principle: Server Components Fetch Directly

All public pages use **Server Components** that fetch data from the FastAPI backend at build time (ISR) or request time (SSR), depending on content volatility.

```typescript
// src/app/projects/page.tsx (Server Component)
async function getProjects(): Promise<ProjectResponse[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/`, {
    cache: 'no-store', // Always fresh for dynamic content
  })
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectGallery projects={projects} />
}
```

#### 4.2 API Client Layer (`src/lib/api.ts`)

Centralized fetch wrappers for each backend resource:

| Function | Method | Endpoint | Used In |
|----------|--------|----------|---------|
| `getProfile()` | GET | `/api/v1/profile/` | Home, About pages |
| `getProjects(featured?)` | GET | `/api/v1/projects/` | Projects page |
| `getProject(id)` | GET | `/api/v1/projects/{id}` | Project detail |
| `getSkillsGrouped()` | GET | `/api/v1/skills/grouped` | Skills section |
| `getExperience()` | GET | `/api/v1/experience/` | Experience page |
| `getCertifications()` | GET | `/api/v1/certifications/` | Certifications page |
| `getTestimonials()` | GET | `/api/v1/testimonials/` | Home page |
| `submitLead(data)` | POST | `/api/v1/leads/` | Contact form |
| `sendChatMessage(msg, history)` | POST | `/api/v1/chat/` | Chat widget |
| `getAdminProjects()` | GET | `/api/v1/admin/projects/` | Admin (with auth header) |
| `createProject(data)` | POST | `/api/v1/admin/projects/` | Admin (with auth header) |
| `updateProject(id, data)` | PUT | `/api/v1/admin/projects/{id}` | Admin (with auth header) |
| `deleteProject(id)` | DELETE | `/api/v1/admin/projects/{id}` | Admin (with auth header) |
| `getLeads(filters)` | GET | `/api/v1/admin/leads/` | Admin leads page |
| `updateLeadStatus(id, status)` | PATCH | `/api/v1/admin/leads/{id}` | Admin leads page |

#### 4.3 Admin API Calls with Auth

For admin routes, API calls from Server Components include the Supabase JWT as a Bearer token:

```typescript
// In Server Component for admin pages
const supabase = createServerClient(...)
const { data: { session } } = await supabase.auth.getSession()

const res = await fetch(`${BACKEND_URL}/api/v1/admin/projects/`, {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`,
  },
  cache: 'no-store',
})
```

#### 4.4 Revalidation Strategy

| Content Type | Strategy | Reason |
|-------------|-----------|--------|
| Profile, Projects, Skills, Experience, Certifications | `cache: 'no-store'` | Content changes via admin dashboard should appear immediately |
| Testimonials | `cache: 'no-store'` | New testimonials added via admin |
| Health check | `revalidate: 60` | Infrequent changes, can be slightly stale |
| Chat responses | N/A (Client-side) | Handled by chat widget in browser |

---

### 5. AI Chat Widget Architecture

#### 5.1 Component Hierarchy

```
ChatWidget (Client Component — 'use client')
├── ChatTrigger (floating button, fixed position)
└── ChatPanel (shown/hidden on trigger click)
    ├── ChatHistory (scrollable message list)
    │   ├── ChatMessage (user bubble) — renders markdown
    │   └── ChatMessage (assistant bubble) — renders markdown + sources
    ├── TypingIndicator ("Bot is typing..." animation)
    └── ChatInput (text input + send button)
        └── LeadCaptureForm (conditionally shown when lead_intent = true)
```

#### 5.2 State Management (`useChat` hook)

The `useChat` hook manages the entire chat lifecycle:

```typescript
// src/hooks/useChat.ts (conceptual)
'use client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: SourceRef[]
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  leadIntent: boolean
  sendMessage: (message: string) => Promise<void>
  clearChat: () => void
}

export function useChat(sessionId: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [leadIntent, setLeadIntent] = useState(false)

  const sendMessage = async (message: string) => {
    setIsLoading(true)
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }])

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data: ChatResponse = await response.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        sources: data.sources,
      }])

      if (data.lead_intent) {
        setLeadIntent(true)
      }
    } catch (error) {
      // Show fallback message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Mehdi's assistant is temporarily unavailable. Please use the contact form.",
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, leadIntent, sendMessage, clearChat }
}
```

#### 5.3 Markdown Rendering

Assistant messages contain markdown (from Gemini responses). Use `react-markdown` with `remark-gfm` for GitHub-flavored markdown support:

```typescript
// ChatMessage.tsx (conceptual)
'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function ChatMessage({ message, role }: { message: Message, role: 'user' | 'assistant' }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
        role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
      }`}>
        {role === 'assistant' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
        {message.sources && (
          <div className="mt-2 text-xs text-gray-500">
            Sources: {message.sources.map(s => s.source).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 5.4 Loading States & Typing Indicator

- **TypingIndicator**: Animated dots (CSS animation or Lottie) shown while `isLoading === true`
- **Disabled input**: Chat input is disabled while `isLoading === true`
- **Error state**: If the chat API returns an error (429, 503), display a user-friendly fallback message
- **Lead intent prompt**: When `leadIntent` becomes `true`, render `LeadCaptureForm` inside the chat panel (name, email, message fields) instead of the input

#### 5.5 Chat Widget Positioning & Persistence

- **Position**: Fixed bottom-right corner (`fixed bottom-4 right-4`)
- **Default state**: Collapsed (trigger button only)
- **Open state**: Shows a 380x600px panel with header "Ask Mehdi's AI Assistant"
- **Session persistence**: `sessionId` stored in `localStorage` to maintain conversation across page navigations
- **Global presence**: ChatWidget rendered in `src/app/layout.tsx` so it appears on ALL pages (including admin, though possibly hidden there)

---

### 6. Admin CRUD Forms

#### 6.1 Architecture Pattern

All admin forms are **Client Components** that:
1. Receive initial data as props (for edit forms) from the Server Component parent
2. Manage form state locally via `useState`
3. Validate inputs client-side before submission
4. Call the FastAPI backend with the Supabase JWT in the `Authorization` header
5. On success: show toast notification + redirect or revalidate
6. On error: display field-level errors

#### 6.2 Form Structure (Example: Project Form)

```typescript
// src/components/admin/ProjectForm.tsx (Client Component)
'use client'

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectCreate | ProjectUpdate>(
    project ?? defaultProject
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Client-side validation
    const validationErrors = validateProject(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const token = await getSupabaseToken() // Get current session token
      const res = await fetch(
        project
          ? `${BACKEND_URL}/api/v1/admin/projects/${project.id}`
          : `${BACKEND_URL}/api/v1/admin/projects/`,
        {
          method: project ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) throw new Error('Failed to save')
      onSubmit() // Callback: redirect or refresh
    } catch (error) {
      setErrors({ general: 'Failed to save project. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <Input label="Title" value={formData.title} onChange={...} error={errors.title} />
      {/* Description */}
      <TextArea label="Description" value={formData.description} onChange={...} />
      {/* Tech Stack (comma-separated input) */}
      <Input label="Tech Stack" value={formData.tech_stack.join(', ')} onChange={...} />
      {/* URLs */}
      <Input label="Project URL" value={formData.project_url} onChange={...} />
      <Input label="GitHub URL" value={formData.github_url} onChange={...} />
      {/* Featured toggle */}
      <Checkbox label="Featured" checked={formData.featured} onChange={...} />
      {/* Order index */}
      <Input type="number" label="Display Order" value={formData.order_index} onChange={...} />

      {errors.general && <p className="text-red-500">{errors.general}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
```

#### 6.3 Admin Resource Pages

| Page | Server Component | Client Components |
|------|-----------------|-------------------|
| `/admin` | Dashboard overview (counts from API) | — |
| `/admin/projects` | Fetch projects list, pass to table | `ProjectTable` (delete button, edit link) |
| `/admin/projects/new` | — | `ProjectForm` (create mode) |
| `/admin/projects/[id]` | Fetch project data, pass to form | `ProjectForm` (edit mode) |
| `/admin/skills` | Fetch skills list | `SkillTable`, `SkillForm` (inline create) |
| `/admin/experience` | Fetch experience list | `ExperienceTable`, `ExperienceForm` |
| `/admin/certifications` | Fetch certifications list | `CertificationTable`, `CertificationForm` |
| `/admin/testimonials` | Fetch testimonials list | `TestimonialTable`, `TestimonialForm` |
| `/admin/knowledge-base` | Fetch KB entries | `KBTable`, `KBForm` (triggers embedding) |
| `/admin/leads` | Fetch leads with filters | `LeadTable` (status update, filter controls) |

#### 6.4 Lead Management

The leads page allows Mehdi to:
- View all leads in a sortable, filterable table (filter by category, status)
- Update lead status: `new` → `reviewed` → `replied` → `archived`
- View lead details (name, email, message, category, date)
- Each status update calls `PATCH /api/v1/admin/leads/{id}` with `{ "status": "reviewed" }`

---

### 7. TypeScript Types (from OpenAPI)

Generate types from the OpenAPI schema (`specs/001-portfolio-platform/contracts/openapi.yaml`):

```typescript
// src/lib/types.ts (generated/conceptual)
export interface ProfileResponse {
  id: string
  full_name: string
  headline: string | null
  bio: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  github_url: string | null
  twitter_url: string | null
  resume_url: string | null
  profile_image_url: string | null
  created_at: string  // ISO datetime
  updated_at: string | null
}

export interface ProjectResponse {
  id: string
  title: string
  description: string | null
  short_description: string | null
  tech_stack: string[] | null
  project_url: string | null
  github_url: string | null
  image_url: string | null
  featured: boolean
  order_index: number
  start_date: string | null  // ISO date
  end_date: string | null    // ISO date
  created_at: string
  updated_at: string | null
}

export interface ChatRequest {
  message: string
  session_id?: string | null
  history?: ChatMessage[] | null
}

export interface ChatResponse {
  response: string
  lead_intent?: boolean
  lead_prompt?: string | null
  sources?: SourceRef[] | null
  fallback?: boolean
}

export interface SourceRef {
  source: string
  similarity: number
}

// ... additional types for Skill, Experience, Certification, Testimonial, Lead, etc.
```

---

### 8. Environment Configuration

```bash
# .env.local (frontend)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: The Supabase service role key is NOT needed in the frontend — admin auth uses the logged-in user's JWT, which is forwarded to the FastAPI backend. The backend uses its own service role key for Supabase operations.

---

### 9. Milestone 3 Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Next.js project initialization | ⏳ Pending | `create-next-app` with TypeScript + TailwindCSS |
| Root layout + navigation | ⏳ Pending | Header, Footer, global styles |
| Public pages (Server Components) | ⏳ Pending | Home, About, Projects, Experience, Certifications |
| Chat widget (Client Components) | ⏳ Pending | Floating widget, useChat hook, markdown rendering |
| Contact form + lead submission | ⏳ Pending | Client Component with validation |
| Supabase Auth middleware | ⏳ Pending | `@supabase/ssr` middleware + route protection |
| Admin login page | ⏳ Pending | Login form with Supabase Auth |
| Admin layout + sidebar | ⏳ Pending | Protected layout with auth guard |
| Admin CRUD forms | ⏳ Pending | Projects, Skills, Experience, Certifications, Testimonials |
| Admin leads management | ⏳ Pending | Lead table with status updates |
| Admin knowledge base | ⏳ Pending | KB entry CRUD (embedding handled by backend) |
| TypeScript types from OpenAPI | ⏳ Pending | Generated types for all API responses |
| Responsive design + a11y | ⏳ Pending | TailwindCSS, WCAG 2.1 AA compliance |

---

### 10. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Server vs Client Components** | Server by default, Client only for interactivity | Aligns with Next.js 14 best practices; better perf (less JS shipped) |
| **Chat widget state** | Custom `useChat` hook with `useState` | Sufficient for single-widget; no need for Redux/Zustand |
| **Auth strategy** | Supabase Auth with `@supabase/ssr` cookies | Official Next.js integration; works across Server + Client Components |
| **API calls from Server Components** | Direct `fetch` to FastAPI backend | No need for SWR/React Query on server; revalidated per request |
| **Admin API auth** | Forward Supabase JWT as Bearer token | Backend verifies JWT and uses service role for Supabase operations |
| **Chat message rendering** | `react-markdown` + `remark-gfm` | Gemini returns markdown; this handles rendering + GitHub-flavored extensions |
| **Form state** | Local `useState` + manual validation | Admin forms are simple; no need for react-hook-form yet |
| **No API route proxy** | Frontend calls FastAPI backend directly | Simpler architecture; CORS handled by FastAPI backend |

---

## Next Steps (Post-Milestone 3)

1. **Milestone 4**: Deploy frontend to Vercel, backend to Render, configure production environment
2. **Milestone 5**: End-to-end testing, Lighthouse audits, accessibility compliance
3. Set up CI/CD pipeline (GitHub Actions) for automated testing and deployment
4. Configure custom domain + SSL for production
