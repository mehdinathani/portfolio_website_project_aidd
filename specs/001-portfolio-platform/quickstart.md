# Quickstart: Portfolio & Lead Generation Platform

**Feature**: 001-portfolio-platform | **Date**: 2026-04-12

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.11+ and pip/uv
- Supabase CLI (for local DB management)
- Google Gemini API key (free tier)
- Git

## Setup

### 1. Clone and Configure Environment

```bash
git clone <repo-url>
cd <repo-root>

# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env:
#   SUPABASE_URL=https://your-project.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
#   GEMINI_API_KEY=your-gemini-api-key
#   SUPABASE_JWT_SECRET=your-jwt-secret (from Supabase dashboard)

# Frontend environment
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:8000
#   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup

```bash
# Link to your Supabase project
npx supabase link --project-ref <your-project-ref>

# Run all migrations
npx supabase db push

# Seed initial data (Mehdi's profile, projects, skills, knowledge base)
npx supabase db seed -- seed_data.sql
```

### 3. Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn src.main:app --reload --port 8000
```

Backend available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`
Health check: `http://localhost:8000/api/v1/health`

### 4. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend available at: `http://localhost:3000`
Admin login: `http://localhost:3000/admin/login`

## Verification

### Smoke Tests

```bash
# 1. Health check
curl http://localhost:8000/api/v1/health
# Expected: {"status": "healthy", "services": {"database": "connected", "gemini_api": "available"}}

# 2. Profile endpoint
curl http://localhost:8000/api/v1/profile
# Expected: JSON with Mehdi's profile data

# 3. Projects listing
curl http://localhost:8000/api/v1/projects
# Expected: JSON array of projects

# 4. Chat endpoint (requires valid Gemini API key)
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Mehdi"}'
# Expected: {"response": "...", "lead_intent": false, "sources": [...]}

# 5. Contact form submission
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "message": "Hello", "category": "other"}'
# Expected: 201 Created with lead data

# 6. Frontend loads
curl http://localhost:3000
# Expected: HTML with portfolio page content
```

### Run Tests

```bash
# Backend unit tests
cd backend && pytest tests/unit/

# Backend integration tests (requires backend running)
cd backend && pytest tests/integration/

# Backend contract tests
cd backend && pytest tests/contract/

# Frontend unit tests
cd frontend && npm run test

# E2E tests (both servers running)
cd frontend && npx playwright test
```

## Common Issues

### Supabase Connection Fails
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Ensure migrations ran: `npx supabase db push`
- Check Supabase project status in dashboard

### Gemini API Errors (429 or 503)
- Free tier limit: 15 RPM — wait and retry
- Verify `GEMINI_API_KEY` is valid and not expired
- Check cache is operational (reduces API calls)

### Frontend Shows No Data
- Backend must be running on port 8000
- Verify `NEXT_PUBLIC_API_URL` points to backend URL
- Check browser console for CORS errors
- Ensure CORS is configured in FastAPI (`CORSMiddleware`)

### Admin Login Fails
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in frontend `.env.local`
- Ensure admin user exists in Supabase Auth (check dashboard → Authentication → Users)
- Check that backend JWT verification middleware has correct `SUPABASE_JWT_SECRET`

### Chat Returns Generic/Fallback Responses
- Knowledge base may be empty — run seed script or add entries via admin
- Verify embeddings are 768 dimensions (Gemini `text-embedding-004` model)
- Check RAG retrieval query returns results (test in Supabase SQL editor)

## Development Workflow

```bash
# Backend: auto-reload on file changes
cd backend && uvicorn src.main:app --reload

# Frontend: auto-refresh on file changes
cd frontend && npm run dev

# Database: create new migration
npx supabase migration new <name>

# API contract: validate against OpenAPI spec
cd backend && pytest tests/contract/
```

## Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
cd frontend && vercel --prod
# Set environment variables in Vercel dashboard:
#   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
#   NEXT_PUBLIC_SUPABASE_URL=https://...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Backend (Render)
```bash
# Push to main branch — auto-deploy if Git integration configured
# Or deploy manually via Render dashboard
# Set environment variables in Render dashboard:
#   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, SUPABASE_JWT_SECRET
```

### Database (Supabase)
```bash
# Production migrations
npx supabase db push --db-url <production-url>
```
