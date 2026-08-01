# Implementation Plan: Mehdi AI Portfolio Website

**Branch**: `master` | **Date**: 2026-04-12 | **Spec**: `specs/master/spec.md` (deep-research-report.md)
**Input**: Feature specification from `deep-research-report.md` + constitution v2.0.1

## Summary

A modern, dynamic portfolio website with a Next.js frontend, FastAPI backend, Supabase database (with pgvector for RAG), and a Gemini-powered AI chatbot. The system is optimized for zero-cost deployment on Vercel (frontend) + Render/Railway (backend) + Supabase (database). The plan targets a 4-week MVP delivery with four specialized agent roles working in parallel after a shared foundation phase.

## Technical Context

**Language/Version**: TypeScript 5+ (frontend), Python 3.11+ (backend)
**Primary Dependencies**: Next.js 14+ (App Router), FastAPI, Supabase (PostgreSQL + pgvector), Google Gemini API, Tailwind CSS + shadcn/ui
**Storage**: Supabase PostgreSQL (primary data store + vector embeddings via pgvector)
**Testing**: pytest + httpx (backend), Jest + React Testing Library + Playwright (frontend), custom RAG accuracy tests
**Target Platform**: Web — Linux server deployment (Vercel edge + Render free tier)
**Project Type**: Web application (separate frontend + backend per Constitution Principle VII)
**Performance Goals**: FCP < 1.5s, TTI < 3.5s, API p95 < 200ms (non-chat), chat response < 30s
**Constraints**: Gemini API 15 RPM free-tier limit; $0 hosting budget; all content from Supabase (zero hardcoded data)
**Scale/Scope**: Single-user portfolio site; ~100-500 daily visitors; 5-10 projects; 20-30 skills; RAG knowledge base ~50-200 chunks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | ✅ PASS | Spec sourced from `deep-research-report.md`; plan derived from it |
| II. Test-Driven | ✅ PASS | Test strategy defined in research.md (pytest, Jest, Playwright, RAG tests) |
| III. CLI-Compatible | ✅ PASS | Supabase migrations via CLI, FastAPI CLI tools, Next.js dev server via CLI |
| IV. Observability | ✅ PASS | Structured logging planned for FastAPI; health endpoint defined in contracts |
| V. Versioning & Breaking Changes | ✅ PASS | API versioned via URL path (`/api/v1/`); semantic versioning for all contracts |
| VI. Simplicity | ✅ PASS | Custom RAG (no LangChain), simplest viable stack, YAGNI applied |
| VII. Strict Separation of Concerns | ✅ PASS | Next.js = UI only; FastAPI = all business logic + AI; HTTP API boundary defined |
| VIII. Zero Hardcoded Data | ✅ PASS | All content from Supabase; data-model.md defines all tables; no static JSON |
| IX. Zero-Cost Deployment | ✅ PASS | Vercel Hobby + Render Free + Supabase Free + Gemini Free tier |
| X. RAG-Powered AI Chatbot | ✅ PASS | RAG pipeline defined: pgvector retrieval → Gemini prompt → grounded response |
| XI. Modern, Accessible, Responsive UI | ✅ PASS | Tailwind + shadcn/ui; WCAG 2.1 AA target; responsive breakpoints defined |

**Gate Result**: ✅ ALL PASS — proceeding to Phase 0/1 artifacts

## Project Structure

### Documentation (this feature)

```text
specs/master/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output — all NEEDS CLARIFICATION resolved ✅
├── data-model.md        # Phase 1 output — 6 tables defined ✅
├── quickstart.md        # Phase 1 output (generated below)
├── contracts/           # Phase 1 output — 6 endpoints defined ✅
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/sp.tasks command — NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/                        # Next.js App Router (TypeScript)
├── src/
│   ├── app/                     # App Router pages and layouts
│   │   ├── layout.tsx           # Root layout (fonts, metadata)
│   │   ├── page.tsx             # Home page
│   │   ├── about/               # About Me page
│   │   ├── projects/            # Projects listing + detail page
│   │   ├── skills/              # Skills page
│   │   ├── experience/          # Experience timeline
│   │   ├── certifications/      # Certifications list
│   │   ├── contact/             # Contact form page
│   │   └── admin/               # Admin dashboard (protected routes)
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── layout/              # Header, Footer, Nav
│   │   ├── chatbot/             # Chat widget (floating)
│   │   └── sections/            # Page-level sections
│   ├── lib/                     # Utilities, API client
│   │   └── api.ts               # FastAPI HTTP client (fetch wrapper)
│   ├── hooks/                   # React custom hooks
│   └── styles/                  # Global CSS, Tailwind config
├── public/                      # Static assets (favicon, robots.txt)
├── next.config.ts
├── tailwind.config.ts
└── package.json

backend/                         # FastAPI (Python 3.11+)
├── src/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Environment configuration
│   ├── models/                  # Pydantic models + SQLAlchemy entities
│   ├── services/                # Business logic
│   │   ├── profile_service.py
│   │   ├── project_service.py
│   │   ├── skill_service.py
│   │   ├── testimonial_service.py
│   │   ├── rag_service.py       # RAG retrieval + prompt construction
│   │   ├── gemini_service.py    # Gemini API client (chat + embeddings)
│   │   └── cache_service.py     # In-memory TTL cache
│   ├── api/                     # API routes
│   │   ├── v1/
│   │   │   ├── profile.py
│   │   │   ├── projects.py
│   │   │   ├── skills.py
│   │   │   ├── testimonials.py
│   │   │   ├── chat.py          # RAG chat endpoint (streaming)
│   │   │   └── health.py
│   │   └── router.py            # API version router
│   ├── db/                      # Database layer
│   │   ├── session.py           # Supabase connection pool
│   │   └── migrations/          # SQL migration files
│   └── middleware/              # Rate limiting, CORS, logging
├── tests/
│   ├── unit/                    # Service unit tests (pytest)
│   ├── integration/             # API integration tests (httpx)
│   └── contract/                # API contract validation
├── requirements.txt
└── pyproject.toml

migrations/                      # Supabase SQL migrations (shared)
├── 001_initial_schema.sql
├── 002_projects.sql
├── 003_skills.sql
├── 004_testimonials.sql
├── 005_knowledge_base.sql
└── seed.sql                   # Initial data population

contracts/                       # API contract validation artifacts
└── openapi.yaml               # Full OpenAPI 3.0 spec
```

**Structure Decision**: Web application with separate `frontend/` and `backend/` directories. This enforces Constitution Principle VII (Strict Separation of Concerns). The frontend handles ONLY UI/routing; the backend handles ALL business logic, data access, and AI operations. Communication is exclusively via HTTP REST API with contracts defined in `contracts/api-contracts.md`.

## Agent-Driven Execution Roles

### UI/UX Agent (Next.js Frontend)
- **Scope**: All `frontend/` code — pages, components, styling, chat widget, admin dashboard UI
- **Responsibilities**: Component implementation, page layouts, responsive design, accessibility, API client integration
- **Deliverables**: All frontend pages, shadcn/ui component setup, chat widget UI, admin CMS pages
- **Dependencies**: Backend API contracts must be stable before integration

### Backend Agent (FastAPI Endpoints)
- **Scope**: All `backend/src/api/` and `backend/src/services/` (except RAG/gemini)
- **Responsibilities**: REST API endpoints, CRUD services, Pydantic models, rate limiting, health checks, CORS
- **Deliverables**: Profile, Projects, Skills, Testimonials, Health endpoints; middleware; API versioning
- **Dependencies**: Database schema must exist before service implementation

### Database Agent (Supabase Schemas + pgvector)
- **Scope**: `migrations/` directory, Supabase project setup, seed data scripts
- **Responsibilities**: All 6 table migrations, indexes, constraints, RLS policies, seed data generation, pgvector extension
- **Deliverables**: 5 migration files, seed script, Supabase project configuration
- **Dependencies**: None — can start immediately (foundation layer)

### AI Agent (Gemini API + RAG Pipeline)
- **Scope**: `backend/src/services/rag_service.py`, `gemini_service.py`, `cache_service.py`, RAG tests
- **Responsibilities**: RAG retrieval logic, Gemini API integration, embedding generation, prompt engineering, rate limiting, caching, hallucination prevention
- **Deliverables**: RAG service, Gemini client, TTL cache, rate limiter, streaming chat endpoint, RAG accuracy tests
- **Dependencies**: knowledge_base table (Database Agent), chat API contract (Backend Agent)

## 4-Week Roadmap to MVP

### Week 1: Foundation (Days 1-7)
| Day | Database Agent | Backend Agent | UI/UX Agent | AI Agent |
|-----|---------------|---------------|-------------|----------|
| 1-2 | Supabase project setup, migration 001 (profiles) | FastAPI project scaffold, main.py, config.py | Next.js project scaffold, layout, header/footer | Research Gemini API, design RAG architecture |
| 3-4 | Migrations 002-004 (projects, skills, testimonials) | Profile + Projects endpoints + services | Home + About + Skills pages | Design embedding pipeline, cache service |
| 5-6 | Migration 005 (knowledge_base + pgvector) | Skills + Testimonials + Health endpoints | Projects listing + detail page | Implement embedding_service.py + cache_service.py |
| 7 | Seed data script, verify all tables | Integration tests for all GET endpoints | Responsive styling, accessibility audit prep | rag_service.py — retrieval logic |

**Week 1 Checkpoint**: Database populated, all GET endpoints working, frontend pages rendering with real data (no chatbot yet).

### Week 2: Core Features (Days 8-14)
| Day | Database Agent | Backend Agent | UI/UX Agent | AI Agent |
|-----|---------------|---------------|-------------|----------|
| 8-9 | RLS policies, connection pooling | POST/PUT/DELETE endpoints for CRUD | Contact form page + validation | RAG prompt engineering, system prompt design |
| 10-11 | Indexes optimization, query analysis | Rate limiting middleware, CORS | Experience + Certifications pages | Gemini API integration (chat completions) |
| 12-13 | Backup/restore procedures | Error handling, structured logging | Admin dashboard (login + CRUD forms) | Streaming SSE response implementation |
| 14 | Performance review, pgvector indexing test | API contract validation tests | Admin content management integration | RAG end-to-end test (mock embeddings) |

**Week 2 Checkpoint**: Full CRUD operations, admin dashboard functional, RAG chatbot working with mock data.

### Week 3: AI Integration & Polish (Days 15-21)
| Day | Database Agent | Backend Agent | UI/UX Agent | AI Agent |
|-----|---------------|---------------|-------------|----------|
| 15-16 | Knowledge base seed data (embed real content) | Chat endpoint hardening, timeout config | Chat widget UI (floating, responsive) | Real Gemini API integration, rate limit testing |
| 17-18 | Query performance tuning | Hallucination prevention middleware | Chat message styling, animations | Grounding verification, source citation |
| 19-20 | — | OpenAPI spec generation | Accessibility fixes (axe-core results) | RAG accuracy testing, similarity threshold tuning |
| 21 | — | Full API test suite pass | Performance optimization (Lighthouse) | Multi-turn conversation support |

**Week 3 Checkpoint**: Chatbot live with real Gemini API, full system integration, accessibility passing.

### Week 4: Deployment & Launch (Days 22-28)
| Day | Database Agent | Backend Agent | UI/UX Agent | AI Agent |
|-----|---------------|---------------|-------------|----------|
| 22-23 | Production Supabase config | Render deployment setup | Vercel deployment, custom domain | Production Gemini API key config |
| 24-25 | Data backup verification | Environment variables, secrets | SEO optimization (meta tags, sitemap) | Rate limit monitoring, cache warm-up |
| 26-27 | — | CI/CD pipeline (GitHub Actions) | Analytics integration (GA/Plausible) | Chatbot usage analytics |
| 28 | — | — | **LAUNCH** | — |

**Week 4 Checkpoint**: Production deployment, all systems operational, portfolio live.

## Complexity Tracking

> No constitution violations justified. All principles pass gates cleanly.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
