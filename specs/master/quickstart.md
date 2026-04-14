# Quickstart: Mehdi AI Portfolio Website

**Feature**: master | **Date**: 2026-04-12

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
# Edit backend/.env with your values:
#   SUPABASE_URL=your-project-url
#   SUPABASE_KEY=your-service-role-key
#   GEMINI_API_KEY=your-api-key

# Frontend environment
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Database Setup

```bash
# Connect to your Supabase project
npx supabase link --project-ref <your-project-ref>

# Run all migrations
npx supabase db push

# Seed initial data
npx supabase db seed -- seed.sql
```

### 3. Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/Scripts/activate   # Windows
# source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn src.main:app --reload --port 8000
```

Backend is now available at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.
Health check: `http://localhost:8000/api/v1/health`

### 4. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend is now available at `http://localhost:3000`.

## Verification

### Smoke Tests

```bash
# 1. Health check
curl http://localhost:8000/api/v1/health
# Expected: {"status": "healthy", ...}

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
# Expected: Streaming or JSON response with grounded answer

# 5. Frontend loads
curl http://localhost:3000
# Expected: HTML with portfolio page content
```

### Run Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test

# E2E tests (both frontend and backend running)
cd backend && pytest tests/integration/
cd frontend && npx playwright test
```

## Common Issues

### Supabase Connection Fails
- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Ensure migrations have run: `npx supabase db push`
- Check Supabase project status in dashboard

### Gemini API Errors (429 or 503)
- Free tier limit: 15 RPM — wait and retry
- Verify `GEMINI_API_KEY` is valid
- Check cache is operational (reduces API calls)

### Frontend Shows No Data
- Backend must be running on port 8000
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check browser console for CORS errors

### Chat Returns Generic Responses
- Knowledge base may be empty — run seed script
- Verify embeddings are 768 dimensions (Gemini model)
- Check RAG retrieval query returns results

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
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend && vercel --prod
```

### Backend (Render)
```bash
# Push to main branch — auto-deploy if Git integration configured
# Or use Render CLI:
render deploy --workdir backend
```

### Database (Supabase)
```bash
# Production migrations
npx supabase db push --db-url <production-url>
```
