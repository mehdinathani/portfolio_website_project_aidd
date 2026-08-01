---
id: 9
title: Implement Admin Backend T108-T117
stage: green
date: 2026-04-20
surface: agent
model: minimax-m2.7:cloud
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: AIDD
command: implement admin backend
labels: ["admin","auth","fastapi","supabase","crud","milestone-6"]
links:
  spec: specs/001-portfolio-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/src/middleware/auth.py
  - backend/src/src/schemas/admin.py
  - backend/src/src/api/admin/router.py
  - backend/src/src/api/admin/projects.py
  - backend/src/src/api/admin/skills.py
  - backend/src/src/api/admin/experience.py
  - backend/src/src/api/admin/certifications.py
  - backend/src/src/api/admin/testimonials.py
  - backend/src/src/api/admin/leads.py
  - backend/src/src/main.py
tests:
  - null
---

## Prompt

Implement the admin backend for the portfolio platform at /home/AIDD/portfolio_website_mehdinathani_qwen_antigravity.

Read these files first for context:
- /home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/specs/001-portfolio-platform/tasks.md
- /home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/specs/001-portfolio-platform/plan.md
- /home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/backend/src/src/main.py
- /home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/backend/src/src/config.py

## What to implement

### 1. Auth Middleware (T108)
Create `/home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/backend/src/src/middleware/auth.py`:
- Supabase JWT verification middleware
- Extract Bearer token from Authorization header
- Verify via supabase-py `auth.admin.get_user(token)` (use SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
- Attach user to request state
- Return 401 on failure

### 2. Admin Router (T109)
Create `/home/AIDD/portfolio_website_mehdinathani_qwen_antigravity/backend/src/src/api/admin/router.py`:
- Aggregate all admin sub-routers
- Apply auth middleware to all routes

### 3. Admin API Endpoints (T110-T115)

Create these files:
- `backend/src/src/api/admin/projects.py` - POST/PUT/DELETE /api/v1/admin/projects
- `backend/src/src/api/admin/skills.py` - POST/PUT/DELETE /api/v1/admin/skills
- `backend/src/src/api/admin/experience.py` - POST/PUT/DELETE /api/v1/admin/experience
- `backend/src/src/api/admin/certifications.py` - POST/PUT/DELETE /api/v1/admin/certifications
- `backend/src/src/api/admin/testimonials.py` - POST/PUT/DELETE /api/v1/admin/testimonials
- `backend/src/src/api/admin/leads.py` - GET/PATCH /api/v1/admin/leads

Each CRUD endpoint should:
- Use auth middleware (from T108)
- Call Supabase via REST API (use service role key)
- Return proper Pydantic response models

### 4. Update main.py (T117)
Mount admin router under /api/v1/admin

## Response snapshot

Created 10 files implementing the complete admin backend for Milestone 6 (T108-T117):

1. `middleware/auth.py` — `verify_jwt` async FastAPI dependency: extracts Bearer token, calls `supabase.auth.get_user(token)` with service-role client, attaches user to `request.state.user`, raises HTTP 401 on any failure.

2. `schemas/admin.py` — Admin-specific Pydantic request schemas: `ProjectCreate/Update`, `SkillCreate/Update`, `ExperienceCreate/Update`, `CertificationCreate/Update`, `TestimonialCreate/Update`, `LeadFilters`.

3. `api/admin/projects.py` — POST (201), PUT, DELETE `/api/v1/admin/projects/{id}` — with skill join on PUT, 404 guard on update/delete.

4. `api/admin/skills.py` — POST (201), PUT, DELETE `/api/v1/admin/skills/{id}`.

5. `api/admin/experience.py` — POST (201), PUT, DELETE `/api/v1/admin/experience/{id}`.

6. `api/admin/certifications.py` — POST (201), PUT, DELETE `/api/v1/admin/certifications/{id}`.

7. `api/admin/testimonials.py` — POST (201), PUT, DELETE `/api/v1/admin/testimonials/{id}`.

8. `api/admin/leads.py` — GET (list with category/status filters), GET `/{id}`, PATCH `/{id}` (status update only).

9. `api/admin/router.py` — aggregates all 6 sub-routers under `tags=["admin"]`.

10. `main.py` — updated to import and mount admin router at `/api/v1/admin`.

## Outcome

- Impact: Admin CRUD API fully implemented and wired into FastAPI app; all 6 content types + leads management protected by Supabase JWT
- Tests: None run — requires live Supabase instance with service role key
- Files: 10 files created/modified
- Next prompts: Implement frontend admin dashboard pages (T097-T107, T118); implement knowledge base auto-embedding (T121-T126)
- Reflection: Auth is implemented as a FastAPI Depends dependency rather than Starlette middleware — this is the idiomatic FastAPI pattern and avoids middleware ordering issues

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): None
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add integration tests with mock JWT in backend/tests/integration/test_admin_api.py
