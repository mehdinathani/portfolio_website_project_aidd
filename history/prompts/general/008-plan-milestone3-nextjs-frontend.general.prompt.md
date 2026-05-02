---
id: 008
title: Plan Milestone3 Next.js Frontend
stage: plan
date: 2026-05-01
surface: agent
model: claude-opus-4-7[1m]
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: AIDD
command: /sp.plan We are starting Milestone 3: Next.js Frontend & Admin Panel...
labels: ["milestone3", "planning", "nextjs", "frontend", "admin"]
links:
  spec: specs/001-portfolio-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-portfolio-platform/plan.md
tests:
 - none (planning phase)
---

## Prompt

```text
We are starting Milestone 3: Next.js Frontend & Admin Panel.
Please create a detailed technical plan for the frontend architecture.
Context: Backend FastAPI is fully functional. We are using Next.js 14+ (App Router), TypeScript, and TailwindCSS.
The plan must detail:
1. Directory structure for Public Pages (Home, About, Projects, Experience) and Protected Pages (/admin).
2. Supabase Auth implementation for the Admin route protection (using middleware or server-side checks).
3. Data Fetching Strategy: How Next.js Server Components will fetch dynamic data from our FastAPI endpoints.
4. AI Chat Widget Architecture: A floating Client Component, state management for message history, handling markdown/JSON responses from FastAPI's `/api/v1/chat`, and loading states (typing indicators).
5. Admin CRUD Forms: Client-side forms to POST/PUT/DELETE data back to FastAPI.
Do not write the code yet, just update the plan documentation.
```

## Response snapshot

Updated `specs/001-portfolio-platform/plan.md` with comprehensive Milestone 3 planning section covering:

1. **Directory Structure**: Full Next.js App Router layout with `frontend/src/app/` for public pages (home, about, projects, experience, certifications, contact), `frontend/src/app/admin/` for protected admin routes, `frontend/src/components/` for reusable UI/portfolio/chat/admin components, `frontend/src/lib/` for API client + Supabase clients, and `frontend/src/hooks/` for custom hooks.

2. **Supabase Auth**: Middleware using `@supabase/ssr` with `createServerClient` for cookie-based sessions. Middleware runs on all non-static routes, calls `supabase.auth.getUser()` to validate sessions, and redirects unauthenticated users from `/admin/*` to `/admin/login`. Separate server and browser Supabase client setups documented.

3. **Data Fetching Strategy**: Server Components fetch directly from FastAPI backend using `fetch()` with `cache: 'no-store'` for dynamic content. Centralized API client layer in `src/lib/api.ts` with typed wrappers. Admin routes include Supabase JWT as Bearer token. Revalidation strategy table included.

4. **AI Chat Widget Architecture**: Full component hierarchy (ChatWidget → ChatPanel → ChatHistory + ChatInput + TypingIndicator). `useChat` custom hook manages messages array, loading state, and lead intent detection. Markdown rendering via `react-markdown` + `remark-gfm`. Session persistence via `localStorage`. Widget rendered globally in root layout.

5. **Admin CRUD Forms**: Client Components with local `useState` form management, client-side validation, Supabase JWT forwarding, and success/error handling. Per-resource form patterns documented with Project Form as detailed example. Admin resource page mapping table included.

Also includes: TypeScript types from OpenAPI, environment configuration, implementation status table, and key design decisions matrix.

## Outcome

- ✅ Impact: Milestone 3 fully planned with 10 detailed sections covering all 5 required areas
- 🧪 Tests: Planning complete; testing strategy documented (Jest + RTL + Playwright)
- 📁 Files: 1 file updated (plan.md ~250 lines of new content)
- 🔮 Next prompts: `/sp.tasks` to generate implementation tasks, then `/sp.implement` to execute
- 🧠 Reflection: Used Context7 to research Next.js App Router patterns and Supabase Auth SSR best practices before writing plan. Architecture favors Server Components by default (per Next.js 14 best practices) with Client Components only where interactivity is needed (chat, forms, auth).
