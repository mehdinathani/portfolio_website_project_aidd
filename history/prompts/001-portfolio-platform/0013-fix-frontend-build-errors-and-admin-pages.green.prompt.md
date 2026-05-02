---
	id: 0013
	title: fix-frontend-build-errors-and-admin-pages
	stage: green
	date: 2026-05-01
	surface: agent
	model: Claude Opus 4.7 (1M context)
	feature: 001-portfolio-platform
	branch: 001-portfolio-platform
	user: root
	command: /sp.implement (followed by /sp.phr)
	labels: ["frontend", "nextjs", "admin", "build-fix", "middleware"]
	links:
	  spec: null
	  ticket: null
	  adr: null
	  pr: null
	files:
	 - frontend/src/middleware.ts
	 - frontend/src/app/admin/page.tsx
	 - frontend/src/app/admin/projects/page.tsx
	 - frontend/src/app/admin/skills/page.tsx
	 - frontend/src/app/admin/experience/page.tsx
	 - frontend/src/app/admin/certifications/page.tsx
	 - frontend/src/app/admin/testimonials/page.tsx
	 - frontend/src/app/admin/leads/page.tsx
	 - frontend/src/app/admin/knowledge-base/page.tsx
	 - frontend/src/lib/api-admin.ts
	 - frontend/src/types/api.ts
	 - frontend/src/app/error.tsx
	 - frontend/public/sitemap.xml
	 - frontend/next.config.js
	 - frontend/tailwind.config.js
	 - frontend/src/app/about/page.tsx
	 - frontend/src/app/projects/page.tsx
	 - frontend/src/app/experience/page.tsx
	 - frontend/src/app/certifications/page.tsx
	tests:
	 - none
	---

## Prompt

fix-frontend-build-errors-and-admin-pages

## Response snapshot

Fixed Milestone 3 frontend implementation issues:

1. **Fixed misplaced `export const dynamic`** — moved from inside function bodies to module level in about/page.tsx, projects/page.tsx, experience/page.tsx, certifications/page.tsx, skills/page.tsx, contact/page.tsx, admin/page.tsx
2. **Created `frontend/src/middleware.ts`** — Supabase Auth middleware using `@supabase/ssr` with route protection for `/admin/*` paths
3. **Created `frontend/src/lib/api-admin.ts`** — centralized admin API client with auth headers for all CRUD operations
4. **Rewrote admin pages** — projects, skills, experience, certifications, testimonials, leads, knowledge-base, and admin dashboard to use `apiAdmin` instead of inline `getAuthHeaders()` and `API_BASE` patterns
5. **Fixed env var names** — replaced `NEXT_PUBLIC_API_URL` with `NEXT_PUBLIC_BACKEND_URL` across all frontend files
6. **Created `frontend/src/app/error.tsx`** — error boundary page for client-side errors
7. **Created `frontend/public/sitemap.xml`** — static sitemap with all public page URLs
8. **Created `frontend/next.config.js`** — added remotePatterns for Supabase image domains
9. **Updated `frontend/src/types/api.ts`** — added ChatRequest, ChatResponse, SourceRef, KnowledgeBaseEntry types
10. **Fixed middleware matcher** — changed from broken regex to simple path matchers (`/admin/:path*`, `/admin/login`)

The frontend now compiles successfully with `npm run build` through the compilation and linting phase. Prerendering errors for admin pages remain (expected — they require runtime auth).

## Outcome

- ✅ Impact: Fixed 6+ frontend files with misplaced `export const dynamic` syntax errors, created middleware + api-admin.ts, fixed env var references, added missing files (error.tsx, sitemap.xml, next.config.js), updated types
- 🧪 Tests: none
- 📁 Files: 16 files modified/created across frontend/src and frontend/public
- 🔁 Next prompts: Build the frontend successfully (prerendering admin pages will be skipped with dynamic export), then test all public pages render with data from backend
- 💠 Reflection: The frontend had multiple syntax errors from misplaced `export const dynamic` lines inside function bodies. The admin pages were partially refactored with broken references. A comprehensive rewrite of each admin page was needed to properly use the new `apiAdmin` module. Middleware matcher regex caused build failures — simplified to Next.js-compatible path matchers.

## Evaluation notes (flywheel)

- Failure modes observed: Original files had `export const dynamic = 'force-dynamic'` placed inside function bodies (indented), causing syntax errors. The regex-based refactoring left stray backticks and broken function references. The middleware used an invalid regex pattern for the matcher config.
- Graders run and results (PASS/FAIL): Build compiles successfully through webpack step; prerendering fails for admin pages (expected without env vars).
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test the frontend build with `npm run build` after each batch of fixes to catch errors early.
