---
id: 012
title: deploy-vercel-render
stage: general
date: 2026-05-31
surface: agent
model: deepseek-v4-flash-free
feature: none
branch: 001-portfolio-platform
user: root
command: pls deploy
labels: [deploy, vercel, render, frontend, backend, production]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .gitignore
  - backend/.python-version
  - backend/src/main.py
  - backend/requirements.txt
  - backend/.env
  - backend/.env.example
tests:
  - Frontend: https://mehdi-portfolio-tan.vercel.app (HTTP 200)
  - Backend: https://mehdi-portfolio-backend.onrender.com (health check passes, Supabase + Gemini OK)
  - Backend API: curl /api/v1/health/ returns {"status":"healthy","supabase":true,"gemini":true}
---

## Prompt

pls deploy

## Response snapshot

Full deployment pipeline executed:

1. **Git**: Committed & pushed all pending changes (~103 files, final polish-to-10)
2. **Frontend (Vercel)**: Deployed via Vercel CLI — https://mehdi-portfolio-tan.vercel.app (bundle 87.7 kB gz)
3. **Backend (Render)**: Created web service via Render API (POST /services) with env vars
4. **Build fixes**:
   - Python 3.14 default had no pre-built pydantic-core wheels → pinned to 3.12.9 via .python-version + PYTHON_VERSION env var
   - Missing `from src.config import settings` in main.py → NameError on startup → added import
   - Health check path corrected to /api/v1/health/
   - Removed duplicate pydantic[email] dependency
   - Removed unsupported runtime.txt
5. **Wiring**: Set NEXT_PUBLIC_BACKEND_URL on Vercel to https://mehdi-portfolio-backend.onrender.com → redeployed frontend

## Outcome

- ✅ Impact: Full-stack portfolio deployed — frontend on Vercel (tan.vercel.app), backend on Render (onrender.com), Supabase connected
- 🧪 Tests: Backend health endpoint reports supabase=true, gemini=true. Frontend returns HTTP 200.
- 📁 Files: main.py (settings import), .python-version (Python 3.12.9 pin), requirements.txt (deduped), .gitignore (updated), .env/.env.example (Render API key placeholder)
- 🔁 Next prompts: Consider setting up custom domain, SSL, monitoring, and CI/CD automation
- 🧠 Reflection: Render deploy needed 3 iterations: (1) pydantic-core Rust build failed on free plan's read-only filesystem → pinned Python 3.12 for pre-built wheels, (2) missing settings import, (3) wrong health check path. Vercel deploy was straightforward once backend URL was updated.

## Evaluation notes (flywheel)

- Failure modes observed: Rust compilation (maturin) on free Render → use Python version with pre-built wheels; env vars set during service creation via API not used for subsequent deploys → must update via PUT /services/{id}/env-vars
- Graders run and results (PASS/FAIL): Build PASS, Deploy PASS, Health Check PASS, Frontend 200 PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add custom domain for production URL
