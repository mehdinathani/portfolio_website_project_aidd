# Implementation Plan: Portfolio & Lead Generation Platform

**Feature**: 001-portfolio-platform
**Plan Date**: 2026-04-12
**Spec Version**: v1 (from `spec.md`)
**API Version**: v1 (from `api-contracts.md`)
**Data Model Version**: v1 (from `data-model.md`)
**Status**: ✅ READY FOR IMPLEMENTATION

---

## Overview

Build a full-stack portfolio and lead-generation platform for Mehdi Abbas Nathani, transitioning from Senior Finance Executive to Agentic AI & Software Engineer. The platform consists of:

- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, deployed on Vercel
- **Backend**: Python FastAPI with Supabase (PostgreSQL + pgvector + Auth + Realtime), deployed on Render
- **AI Layer**: Google Gemini 1.5 Flash (chat) + text-embedding-004 (RAG embeddings)
- **Database**: Supabase PostgreSQL with 9 tables (profile, projects, skills, project_skills, experience, certifications, testimonials, knowledge_base, leads)

---

## Task Breakdown

### Phase 1: Database & Foundation (Tasks 1–3)

#### Task 1: Database Schema & Migrations
**Priority**: P0 | **Est**: 1–2h | **Status**: ⬜ Not Started

**Files Created**:
```
supabase/migrations/
  001_enable_pgvector.sql
  002_create_profiles.sql
  003_create_projects.sql
  004_create_skills.sql
  005_create_experience.sql
  006_create_certifications.sql
  007_create_testimonials.sql
  008_create_knowledge_base.sql
  009_create_leads.sql
supabase/seed_data.sql
```

**Actions**:
1. Create `001_enable_pgvector.sql` — `CREATE EXTENSION IF NOT EXISTS vector;`
2. Create `002_create_profiles.sql` — single-row profile table per `data-model.md` Section 1
3. Create `003_create_projects.sql` — projects table with `tech_stack TEXT[]`, `featured BOOLEAN`, `order_index INTEGER`, indexes per spec
4. Create `004_create_skills.sql` — skills table + `project_skills` junction table with CASCADE FK, per Section 4
5. Create `005_create_experience.sql` — experience table with date range, `order_index`, per Section 5
6. Create `006_create_certifications.sql` — certifications table per Section 6
7. Create `007_create_testimonials.sql` — testimonials table with CHECK constraints, per Section 7
8. Create `008_create_knowledge_base.sql` — `embedding vector(768)`, HNSW index `USING hnsw (embedding vector_cosine_ops)`, JSONB metadata, per Section 8
9. Create `009_create_leads.sql` — leads table with `category` and `status` CHECK constraints, per Section 9
10. Create `seed_data.sql` — Insert Mehdi's initial profile, 2 projects (BIDLY, Hospital Reception System), 8–10 skills, 1–2 experience entries, 2–3 certifications, 3–5 knowledge base chunks

**Verification**:
```bash
npx supabase db reset
npx supabase db seed
# In Supabase SQL Editor: SELECT COUNT(*) FROM projects; -- expect 2
```

---

#### Task 2: Backend Scaffolding (FastAPI)
**Priority**: P0 | **Est**: 1–2h | **Status**: ⬜ Not Started

**Files Created**:
```
backend/
  .env.example
  requirements.txt
  src/
    main.py
    config.py
    api/
      v1/
        router.py
        profile.py, projects.py, skills.py, experience.py
        certifications.py, testimonials.py, chat.py, leads.py
      admin/
        router.py
        projects.py, skills.py, experience.py, certifications.py
        testimonials.py, knowledge_base.py, leads.py
    models/
      base.py, profile.py, project.py, skill.py, experience.py
      certification.py, testimonial.py, knowledge_base.py, lead.py
    schemas/
      common.py, profile.py, project.py, skill.py, experience.py
      certification.py, testimonial.py, chat.py, lead.py, knowledge_base.py
    services/
      profile_service.py, project_service.py, skill_service.py
      experience_service.py, certification_service.py, testimonial_service.py
      lead_service.py, gemini_service.py, rag_service.py
      prompt_builder.py, cache_service.py, knowledge_base_service.py
    db/
      session.py, vector_extension.py
    middleware/
      auth.py, logging.py, rate_limiter.py
    tests/
      unit/, integration/, contract/
```

**Actions**:
1. Initialize FastAPI app in `main.py` with CORS, logging, rate limiter, health check, API routers
2. Create `config.py` loading env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET, GEMINI_API_KEY, CACHE_TTL
3. Create `db/session.py` — Supabase client using `supabase-py`
4. Create Pydantic schemas matching `api-contracts.md`
5. Create model classes mapping to Supabase rows
6. Create JWT auth middleware for `/api/v1/admin/*` routes
7. Create rate limiter middleware (15 RPM on `/api/v1/chat`)
8. Create `requirements.txt`: fastapi, uvicorn, supabase, python-dotenv, pydantic, google-generativeai

**Verification**:
```bash
cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload --port 8000
curl http://localhost:8000/api/v1/health
# Expect: {"status": "healthy"}
```

---

#### Task 3: Frontend Scaffolding (Next.js)
**Priority**: P0 | **Est**: 1–2h | **Status**: ⬜ Not Started

**Files Created**:
```
frontend/
  .env.example, next.config.js, tailwind.config.ts, postcss.config.js
  src/
    app/
      layout.tsx, page.tsx
      about/, projects/, projects/[id]/, skills/, experience/
      certifications/, contact/, not-found.tsx
      admin/
        layout.tsx, page.tsx, login/
        projects/, skills/, experience/, certifications/
        testimonials/, knowledge-base/, leads/
    components/
      layout/header.tsx, footer.tsx
      sections/hero.tsx, project-card.tsx, skill-badge.tsx
                timeline-item.tsx, contact-form.tsx
      chatbot/
        chat-widget.tsx, chat-message.tsx, chat-lead-form.tsx
    hooks/use-chat.ts
    lib/api.ts, supabase-client.ts
    types/api.ts
```

**Actions**:
1. Initialize Next.js 15+ project with TypeScript, Tailwind, App Router
2. Install: `@supabase/supabase-js`
3. Configure Tailwind with custom theme
4. Create Supabase client, API fetch wrapper, TypeScript types
5. Create root layout with Header + Footer
6. Create Header (nav links, admin login) and Footer (copyright, social links)
7. Create custom 404 page

**Verification**:
```bash
cd frontend && npm install && npm run dev
# Visit http://localhost:3000 — expect header, footer, blank content
npm run build  # No TypeScript errors
```

---

### Phase 2: Core Public Pages (Tasks 4–7)

#### Task 4: Home Page & Hero Section
**Priority**: P1 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Create hero.tsx — fetch profile, display name, headline, bio, CTA buttons
2. Update page.tsx (Home) — render Hero + Featured Projects (3) + Skills Overview + Chat Widget
3. Create project-card.tsx — title, description, tech_stack, hover effect, click → `/projects/[id]`

**API Calls**: `GET /api/v1/profile`, `GET /api/v1/projects?featured=true&limit=3`

**Verification**: Visit / — see hero, 3 featured project cards, chat widget in bottom-right

---

#### Task 5: Projects & Skills Pages
**Priority**: P1 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Backend: `GET /api/v1/projects` with query params (featured, sort, order, limit, offset)
2. Backend: `GET /api/v1/projects/{id}` with JOIN to skills
3. Frontend: `/projects` page — grid layout, featured filter toggle
4. Frontend: `/projects/[id]` — dynamic route, full details, linked skills
5. Backend: `GET /api/v1/skills?grouped=true` — skills grouped by category
6. Frontend: `/skills` page — grouped skills with proficiency bars
7. Create skill-badge.tsx component

**API Calls**: `GET /api/v1/projects`, `GET /api/v1/projects/{id}`, `GET /api/v1/skills?grouped=true`

**Verification**: Visit /projects — grid with filter; /projects/1 — detail page; /skills — grouped with proficiency

---

#### Task 6: About, Experience, Certifications Pages
**Priority**: P1 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Backend: `GET /api/v1/experience?sort=start_date&order=desc`
2. Backend: `GET /api/v1/certifications`
3. Frontend: `/about` — full bio, photo, social links, career journey
4. Frontend: `/experience` — vertical timeline using timeline-item.tsx
5. Frontend: `/certifications` — cards with name, issuer, date, credential link
6. Create timeline-item.tsx component

**API Calls**: `GET /api/v1/profile`, `GET /api/v1/experience`, `GET /api/v1/certifications`

**Verification**: Visit /about, /experience, /certifications — all render correctly, timeline responsive

---

#### Task 7: Contact Page & Lead Capture
**Priority**: P1 | **Est**: 2h | **Status**: ⬜ Not Started

**Actions**:
1. Backend: `POST /api/v1/leads` — validate, store lead with status="new"
2. Frontend: contact-form.tsx — Name, Email, Message, Category fields with validation
3. Frontend: `/contact` page — form + profile contact info

**API Calls**: `POST /api/v1/leads`, `GET /api/v1/profile`

**Verification**: Submit contact form → success message, lead stored in DB with status="new"

---

### Phase 3: AI Chatbot & RAG (Tasks 8–10)

#### Task 8: Gemini Service & RAG Pipeline
**Priority**: P2 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Create gemini_service.py — init Gemini 1.5 Flash, generate_response(), generate_embedding()
2. Create rag_service.py — cosine similarity search on knowledge_base table (top_k=5, threshold=0.7)
3. Create prompt_builder.py — build prompt with context chunks, history, user message
4. Create cache_service.py — in-memory cache with TTL (1 hour)
5. Create `POST /api/v1/chat` endpoint — rate limit → cache → embed → RAG → prompt → Gemini → response
6. Lead intent detection (keyword matching: hire, work with, contact, project)

**API Request**: `POST /api/v1/chat { message, session_id, history? }`
**API Response**: `{ response, lead_intent, lead_prompt, sources, fallback }`

**Verification**:
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Mehdi", "session_id": "test-123"}'
# Expect: JSON with response, sources, lead_intent=false
```

---

#### Task 9: Chatbot UI (Floating Widget)
**Priority**: P2 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Create use-chat.ts hook — state management, sendMessage(), lead intent handling
2. Create chat-message.tsx — user (right, blue) and assistant (left, gray) bubbles, sources
3. Create chat-widget.tsx — floating button, slide-up window, auto-scroll, visible on all pages
4. Create chat-lead-form.tsx — appears on lead_intent=true, submits to /api/v1/leads with source="chatbot"

**API Calls**: `POST /api/v1/chat`, `POST /api/v1/leads` (source="chatbot")

**Verification**: Click chat button → open widget → send message → see response. Type "hire" → lead form appears

---

#### Task 10: Knowledge Base Management & Embeddings
**Priority**: P2 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Create knowledge_base_service.py — create/update/delete with auto embedding generation
2. Backend: `POST /api/v1/admin/knowledge-base` — create + auto-generate embedding
3. Backend: `PUT /api/v1/admin/knowledge-base/{id}` — update + regenerate embedding
4. Backend: `DELETE /api/v1/admin/knowledge-base/{id}` — delete entry

**API Calls**: POST/PUT/DELETE `/api/v1/admin/knowledge-base`

**Verification**: Create KB entry via API → embedding auto-generated. Verify in Supabase: `SELECT content, embedding IS NOT NULL FROM knowledge_base;`

---

### Phase 4: Admin Dashboard (Tasks 11–12)

#### Task 11: Admin Dashboard Core (Auth + Layout + CRUD UI)
**Priority**: P1 | **Est**: 3–4h | **Status**: ⬜ Not Started

**Actions**:
1. Create admin/layout.tsx — auth guard (Supabase session check), sidebar nav, responsive
2. Create admin/login/page.tsx — email/password form, Supabase Auth signIn, redirect on success
3. Create admin/page.tsx — dashboard home with stats, recent leads, quick links
4. Create admin CRUD pages for Projects, Skills, Experience, Certifications, Testimonials:
   - List view with table/grid, edit/delete buttons
   - Create/Edit form modal or page
   - Delete confirmation dialog
5. Create admin/knowledge-base/page.tsx — list entries, create form, embedding status

**API Calls** (admin, with JWT): GET/POST/PUT/DELETE `/api/v1/admin/{resource}`

**Verification**: Login → dashboard → CRUD operations on all resources → unauthenticated redirect to login

---

#### Task 12: Leads Management (Admin)
**Priority**: P1 | **Est**: 1–2h | **Status**: ⬜ Not Started

**Actions**:
1. Backend: `GET /api/v1/admin/leads` — list with filters (category, status, sort, pagination)
2. Backend: `GET /api/v1/admin/leads/{id}` — single lead detail
3. Backend: `PATCH /api/v1/admin/leads/{id}` — update status (new → reviewed → replied → archived)
4. Frontend: admin/leads/page.tsx — table view, filters, status update dropdown, visual indicators

**API Calls**: GET/PATCH `/api/v1/admin/leads`

**Verification**: Submit contact form → appears in admin leads → filter by status → update status → verify UI updates

---

### Phase 5: Polish & Testing (Tasks 13–15)

#### Task 13: Responsive Design & Accessibility (WCAG 2.1 AA)
**Priority**: P1 | **Est**: 2–3h | **Status**: ⬜ Not Started

**Actions**:
1. Audit all pages at 320px, 768px, 1280px — no horizontal overflow, readable fonts, tap targets ≥ 44x44px
2. WCAG 2.1 AA: color contrast ≥ 4.5:1, alt attributes, form labels, keyboard nav, aria attributes
3. Run Lighthouse: target 90+ Accessibility, 90+ Performance
4. Chat widget accessibility: aria-label, aria-live regions

**Verification**: `npx lighthouse http://localhost:3000 --only-categories=accessibility,performance` → 90+

---

#### Task 14: Error Handling & Edge Cases
**Priority**: P1 | **Est**: 1–2h | **Status**: ⬜ Not Started

**Actions**:
1. Frontend: API errors → user-friendly messages, network errors, 429 rate limit, 503 unavailable
2. Backend: Global exception handler → structured JSON per api-contracts.md, correct HTTP codes
3. Edge cases: DB unavailable → graceful message, Gemini rate limited → fallback, empty DB → "No content", invalid route → custom 404
4. Structured logging: JSON format with timestamp, method, path, status, response time

**Verification**: Stop backend → visit frontend → graceful error. Trigger 429 → rate limit message. Invalid route → custom 404

---

#### Task 15: Testing Suite (Unit, Integration, E2E)
**Priority**: P1 | **Est**: 3–4h | **Status**: ⬜ Not Started

**Actions**:
1. Backend unit tests (pytest): profile, project, chat (mock Gemini), lead, rate limiter
2. Backend integration tests: full request/response cycle for all API endpoints
3. Backend contract tests: validate endpoints match api-contracts.md schemas
4. Frontend unit tests (Jest + RTL): chat-widget, contact-form
5. E2E tests (Playwright): portfolio.spec.ts (home, projects, skills, contact, chat), admin.spec.ts (login, CRUD, leads)

**Verification**:
```bash
cd backend && pytest tests/ -v          # All pass
cd frontend && npm run test             # Unit tests pass
cd frontend && npx playwright test     # E2E tests pass
```

---

## Summary

| Phase | Tasks | Priority | Est. Total |
|-------|-------|----------|------------|
| Phase 1: Database & Foundation | 1–3 | P0 | 3–6h |
| Phase 2: Core Public Pages | 4–7 | P1 | 8–12h |
| Phase 3: AI Chatbot & RAG | 8–10 | P2 | 6–9h |
| Phase 4: Admin Dashboard | 11–12 | P1 | 4–6h |
| Phase 5: Polish & Testing | 13–15 | P1 | 6–9h |
| **Total** | **15 tasks** | | **27–42h** |

---

## Dependencies & Assumptions

- **Supabase project** created with URL, anon key, service role key, JWT secret
- **Google Gemini API key** obtained from Google AI Studio (free tier, 15 RPM)
- **Node.js 18+**, **Python 3.11+** installed
- **Single admin user** (Mehdi) — no multi-admin support needed for MVP
- **No email notifications** for leads in MVP
- **English-only** content for MVP
- **HNSW index** on `knowledge_base` requires pgvector extension enabled (Task 1)

---

## Implementation Order (Recommended)

```
Task 1 (DB) → Task 2 (Backend) → Task 3 (Frontend)
    ↓              ↓                    ↓
Task 4-7       Task 8-10           (Public pages)
(Public UI)    (AI Chatbot)
                     ↓
              Task 11-12 (Admin)
                     ↓
              Task 13-15 (Polish & Test)
```

---

**Status**: ✅ PLAN COMPLETE — Ready for `/sp.implement` or task-by-task execution
