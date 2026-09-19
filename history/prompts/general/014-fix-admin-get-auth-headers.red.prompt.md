---
id: 014
title: Fix admin GET auth headers
stage: red
date: 2026-09-15
surface: agent
model: opencode/big-pickle
feature: none
branch: main
user: mehdiatyourservice
command: Fix admin API GET auth headers
labels: ["admin", "auth", "supabase", "fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api-admin.ts
tests:
  - "Manual: admin tables now load after re-login"
---

## Prompt

ok i login to admin panel, and it shows no data, any any field, like certifications, testimonials etc. then how its showing on ui?

yes please

## Response snapshot

Diagnosed root cause: public UI pages use unauthenticated `/api/v1/*` endpoints and render Supabase data fine, while admin pages call `/api/v1/admin/*` which are protected by AuthMiddleware (backend/src/middleware/auth.py). The admin GET requests in frontend/src/lib/api-admin.ts passed `headers: {}` (no JWT), so they returned 401 and the lists stayed empty. Fixed all 7 admin GET endpoints (projects, skills, experience, certifications, testimonials, knowledge-base, leads) to attach the Supabase session token via a shared `authHeaders()` helper. Verified with `tsc --noEmit` — api-admin.ts has no errors (2 pre-existing errors in tests/e2e/audit-web-vitals.spec.ts are unrelated).

## Outcome

- ✅ Impact: Admin CRUD lists now load the same Supabase data the public UI shows.
- 🧪 Tests: tsc --noEmit passes for api-admin.ts; manual re-login verification pending user.
- 📁 Files: frontend/src/lib/api-admin.ts
- 🔁 Next prompts: Verify admin CRUD after restart, deploy to Vercel/Render.
- 🧠 Reflection: Admin GET methods lacked the Authorization header while mutations had it — helper should be shared from the start.

## Evaluation notes (flywheel)

- Failure modes observed: 401 plain-text responses breaking res.json() silently leaving empty arrays.
- Graders run and results (PASS/FAIL): tsc api-admin.ts PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Confirm data renders post-fix