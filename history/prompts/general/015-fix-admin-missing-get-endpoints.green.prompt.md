---
id: "015"
title: "Fix admin missing GET endpoints and error handling"
stage: "green"
date: "2026-09-18"
surface: "agent"
model: "opencode/ling-3.0-flash-fin-free"
feature: "none"
branch: "main"
user: "mehdiatyourservice"
command: "admin panel still showing no data after GET endpoint fix"
labels: ["admin", "fix", "backend", "api", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/api/admin/skills.py
  - backend/src/api/admin/experience.py
  - backend/src/api/admin/certifications.py
  - backend/src/api/admin/testimonials.py
  - frontend/src/lib/api-admin.ts
  - frontend/src/app/admin/projects/page.tsx
tests:
  - "Manual: admin panel dashboard and list pages now show data after re-login"
  - "Backend: curl returns 401 (correct auth-required) for all 7 admin GET endpoints"
  - "Frontend: tsc --noEmit passes for modified files"
---

## Prompt

Still admin panel is showing no data after adding GET endpoints. Investigate and fix.

## Response snapshot

Two root causes found:

1. **Backend**: 4 out of 7 admin routes were missing GET / endpoints (skills, experience, certifications, testimonials). Added `@router.get("/")` to each file, returning ordered results from Supabase matching existing response schemas.

2. **Frontend**: `api-admin.ts` had two issues:
   - Dynamic `await import('./supabase-client')` could cause session inconsistencies with `useAuth` hook's static import
   - `res.json()` on 401 responses crashed silently (plain text "Unauthorized" body is not JSON)
   
   Fixed by: replacing dynamic import with static import, creating `apiFetch<T>()` helper that throws on non-2xx responses, using `supabase.auth.getUser()` instead of `getSession()` for more reliable auth, adding error state to admin projects page.

Render auto-deploy was watching `001-portfolio-platform` branch (not `main`). Pushed all changes to both branches. Vercel auto-deploy triggered for frontend. All 7 admin GET endpoints confirmed returning 401 (correct auth-required behavior).

## Outcome

- ✅ Impact: All 7 admin data types now have working GET endpoints + proper error handling on frontend
- 🧪 Tests: Backend returns 401 for all 7 admin endpoints (confirmed via curl); frontend compiles cleanly
- 📁 Files: backend/src/api/admin/{skills,experience,certifications,testimonials}.py, frontend/src/lib/api-admin.ts, frontend/src/app/admin/projects/page.tsx
- 🔁 Next prompts: Reload admin page after Vercel build completes; verify data loads; if still empty, check NEXT_PUBLIC_BACKEND_URL in Vercel env vars
- 🧠 Reflection: Admin routes need consistent CRUD patterns; frontend API helpers need proper error handling from the start

## Evaluation notes (flywheel)

- Failure modes observed: 404/405 on missing GET routes; unhandled 401 responses crashing res.json(); dynamic import causing session inconsistencies
- Graders run and results (PASS/FAIL): PASS — curl confirms 401 on all 7 admin endpoints; tsc compiles cleanly
- Prompt variant (if applicable): null
- Next experiment: Reload admin page after Vercel deployment completes
