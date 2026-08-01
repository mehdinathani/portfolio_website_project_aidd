---
id: 0017
title: implement-milestone3-remaining-tasks
stage: general
date: 2026-05-02
surface: agent
model: Claude Opus 4.7 (1M context)
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: root
command: /sp.implement but first read latest phr and use context7 mcp server
labels: ["frontend", "context7", "milestone3", "implementation", "admin-pages", "new-forms", "next-image", "robots.txt", "build-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/components/chatbot/chat-history.tsx
 - frontend/src/components/chatbot/chat-input.tsx
 - frontend/src/components/chatbot/chat-widget.tsx
 - frontend/src/components/sections/hero.tsx
 - frontend/src/components/sections/project-card.tsx
 - frontend/src/app/about/page.tsx
 - frontend/src/app/projects/[id]/page.tsx
 - frontend/src/app/admin/projects/new/page.tsx
 - frontend/src/app/admin/skills/new/page.tsx
 - frontend/src/app/admin/experience/new/page.tsx
 - frontend/src/app/admin/certifications/new/page.tsx
 - frontend/src/app/admin/testimonials/new/page.tsx
 - frontend/src/app/admin/knowledge-base/new/page.tsx
 - frontend/src/app/admin/projects/page.tsx
 - frontend/src/app/admin/skills/page.tsx
 - frontend/src/app/admin/experience/page.tsx
 - frontend/src/app/admin/certifications/page.tsx
 - frontend/src/app/admin/testimonials/page.tsx
 - frontend/src/app/admin/knowledge-base/page.tsx
 - frontend/public/robots.txt
 - frontend/next.config.js
 - specs/001-portfolio-platform/tasks.md
tests:
 - frontend npm run build (passes with dummy env vars)
---

## Prompt

but first read latest phr and use context7 mcp server

## Response snapshot

Implemented remaining Milestone 3 tasks and fixes:

**Context7 docs consulted:**
- Next.js (vercel/next.js): App Router Server Components with async/await data fetching, Client Components with 'use client', dynamic = 'force-dynamic' for auth-protected pages

**New files created:**
1. `frontend/src/components/chatbot/chat-history.tsx` — Scrollable message list with auto-scroll, typing indicator, renders ChatMessage for each message
2. `frontend/src/components/chatbot/chat-input.tsx` — Message input with send button, Enter key submit, 2000 char limit, disabled state
3. `frontend/src/app/admin/projects/new/page.tsx` — New project form (Client Component) with all fields, POST to /api/v1/admin/projects/
4. `frontend/src/app/admin/skills/new/page.tsx` — New skill form with name, category select, proficiency slider
5. `frontend/src/app/admin/experience/new/page.tsx` — New experience form with company, role, dates, responsibilities
6. `frontend/src/app/admin/certifications/new/page.tsx` — New certification form with name, issuer, date, credential URL
7. `frontend/src/app/admin/testimonials/new/page.tsx` — New testimonial form with author, role, quote, LinkedIn URL
8. `frontend/src/app/admin/knowledge-base/new/page.tsx` — New KB entry form with content textarea, source type select, metadata JSON editor

**Files updated:**
- `frontend/src/components/chatbot/chat-widget.tsx` — Refactored to use ChatHistory and ChatInput standalone components; added smooth open/close transitions
- `frontend/src/components/sections/hero.tsx` — Migrated from `<img>` to `next/image` with width/height props
- `frontend/src/components/sections/project-card.tsx` — Migrated to `next/image` with `fill` prop and responsive aspect ratio
- `frontend/src/app/about/page.tsx` — Migrated to `next/image` for profile image
- `frontend/src/app/projects/[id]/page.tsx` — Migrated to `next/image` with explicit dimensions
- `frontend/src/app/admin/projects/page.tsx` — Updated "Add Project" button to link to `/admin/projects/new`
- `frontend/src/app/admin/skills/page.tsx` — Updated "Add Skill" button to link to `/admin/skills/new`
- `frontend/src/app/admin/experience/page.tsx` — Updated "Add Experience" button to link to `/admin/experience/new`
- `frontend/src/app/admin/certifications/page.tsx` — Updated "Add Certification" button to link to `/admin/certifications/new`
- `frontend/src/app/admin/testimonials/page.tsx` — Updated "Add Testimonial" button to link to `/admin/testimonials/new`
- `frontend/src/app/admin/knowledge-base/page.tsx` — Updated "Add Entry" button to link to `/admin/knowledge-base/new`
- `frontend/public/robots.txt` — Added sitemap reference and Disallow /admin/ rule
- `specs/001-portfolio-platform/tasks.md` — Updated to reflect actual implementation state; marked T312-T360 range as completed; added T349b-T357b for new pages

**Build fixes:**
- Added `export const dynamic = 'force-dynamic'` to all admin pages that were missing it (projects, skills, experience, certifications, testimonials, knowledge-base)
- Fixed duplicate `dynamic` exports in admin pages (had been added twice during earlier edits)
- Fixed missing `Image` import in `about/page.tsx` and `projects/[id]/page.tsx`
- Fixed missing `Link` import in `knowledge-base/page.tsx`
- Fixed `hero.tsx` to accept `Profile | null` for build-time resilience
- Fixed home `page.tsx` to handle backend unavailability during build with try/catch

**Build status:** TypeScript compilation passes. Next.js build succeeds with 25/25 static pages generated. All admin pages correctly marked as (Dynamic).

## Outcome

- ✅ Impact: Created 8 new files, updated 16 existing files. All Milestone 3 admin "new" pages now exist with full CRUD. Chat components refactored into standalone pieces. All `<img>` tags migrated to `next/image`. Build passes clean.
- 🧪 Tests: `npm run build` passes with dummy env vars (NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- 📁 Files: 24 files modified/created (listed in YAML above)
- 🔁 Next steps: Remaining tasks are T372-T380 (chat E2E testing, responsive verification, accessibility audit, admin→public flow verification, chat→lead flow verification)
- 💠 Reflection: The tasks.md file had many tasks marked `[ ]` that were actually implemented with different file paths (e.g., `sections/hero.tsx` vs `portfolio/HeroSection.tsx`). The `chat-widget.tsx` had inline ChatHistory/ChatInput/TypingIndicator that needed extraction. Admin "new" pages were completely missing. Next.js build required `force-dynamic` on all admin pages to prevent prerender errors when backend is unavailable.
