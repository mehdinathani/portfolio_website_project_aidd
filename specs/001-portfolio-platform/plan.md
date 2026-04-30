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
| API contracts documentation | 🔲 Pending | Generate `contracts/openapi.yaml` |
| Integration tests | 🔲 Pending | Test Supabase RPC, Gemini API, full RAG flow |
| Error handling edge cases | 🔲 Pending | Test fallbacks, rate limits, invalid inputs |

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

## Next Steps (Post-Milestone 2)

1. **Milestone 3**: Next.js Frontend — public pages (Home, About, Projects, Skills, Experience, Certifications)
2. **Milestone 4**: Admin Dashboard — Supabase Auth protected CRUD interface
3. **Milestone 5**: Chat Widget — floating widget integration on all public pages
4. Generate OpenAPI contract file from FastAPI routes
5. Write integration tests for RAG pipeline and all CRUD endpoints
