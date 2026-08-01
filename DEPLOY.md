# Deployment

## Frontend — Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set **Root Directory** to `frontend/` (auto-detected from `vercel.json`).
4. Add environment variables (from `frontend/.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_BACKEND_URL` — set to your Render backend URL once deployed
5. Deploy.

## Backend — Render

1. In [Render Dashboard](https://dashboard.render.com), click **New + > Blueprint**.
2. Connect your repo — Render will detect `backend/render.yaml`.
3. Fill in the secret environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CORS_ORIGINS` — set to your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
4. Deploy.
5. After deploy, copy the backend URL (e.g. `https://mehdi-portfolio-backend.onrender.com`) and set it as `NEXT_PUBLIC_BACKEND_URL` in Vercel, then redeploy the frontend.

## Supabase

Use your existing hosted Supabase project (already configured). The frontend env vars already point to it.
