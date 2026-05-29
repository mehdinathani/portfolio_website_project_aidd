# Quickstart — Mehdi Portfolio Platform

## Prerequisites

- Node.js 18+, npm
- Python 3.11+, pip
- Supabase CLI (`npx supabase`)
- Gemini API key (free tier)

---

## 1. Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your keys

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local
```

---

## 2. Database

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
npx supabase db seed -- seed_data.sql
```

---

## 3. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

---

## 4. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App at `http://localhost:3000` · Admin at `/admin/login`

---

## 5. Verify

```bash
curl http://localhost:8000/api/v1/health
curl http://localhost:8000/api/v1/profile
curl http://localhost:3000
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| Supabase connection fails | Check `SUPABASE_URL` and `SERVICE_ROLE_KEY` in `.env` |
| Gemini 429 | Free tier limit — wait 1 min or cache will help |
| Frontend shows no data | Backend must be running on port 8000; check API URL |
| Admin login fails | Verify admin user exists in Supabase Auth dashboard |
