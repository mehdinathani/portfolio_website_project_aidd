---
id: 10
title: Create Frontend Components and Pages
stage: green
date: 2026-04-27
surface: agent
model: claude-opus-4-7[1m]
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: AIDD
command: create frontend components and utility files
labels: ["frontend","nextjs","typescript","tailwind","components","pages"]
links:
  spec: specs/001-portfolio-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
  - frontend/src/types/api.ts
  - frontend/src/components/layout/header.tsx
  - frontend/src/components/layout/footer.tsx
  - frontend/src/components/sections/hero.tsx
  - frontend/src/components/sections/project-card.tsx
  - frontend/src/components/sections/skill-badge.tsx
  - frontend/src/components/sections/timeline-item.tsx
  - frontend/src/components/sections/contact-form.tsx
  - frontend/src/app/page.tsx
  - frontend/src/app/about/page.tsx
  - frontend/src/app/projects/page.tsx
  - frontend/src/app/projects/[id]/page.tsx
  - frontend/src/app/skills/page.tsx
  - frontend/src/app/experience/page.tsx
  - frontend/src/app/certifications/page.tsx
  - frontend/src/app/contact/page.tsx
  - frontend/src/app/layout.tsx
  - frontend/src/app/not-found.tsx
tests:
  - null
---

## Prompt

Create the following frontend components and utility files for a Next.js App Router project (TypeScript + Tailwind CSS). These are for the PUBLIC portfolio pages.

Create these files:

1. `/frontend/src/lib/api.ts` — FastAPI HTTP client with base URL from NEXT_PUBLIC_API_URL env, error handling, typed response functions

2. `/frontend/src/types/api.ts` — TypeScript interfaces for Profile, Project, Skill, Experience, Certification, Testimonial

3. `/frontend/src/components/layout/header.tsx` — Site header with logo ("Mehdi"), navigation links, responsive hamburger menu. Use 'use client' directive. Tailwind CSS.

4. `/frontend/src/components/layout/footer.tsx` — Site footer with social links (LinkedIn, GitHub), copyright. Simple and clean.

5. `/frontend/src/components/sections/hero.tsx` — Home page hero section with name, headline, brief bio, CTA buttons.

6. `/frontend/src/components/sections/project-card.tsx` — Project card with title, short description, tech stack badges, image, links.

7. `/frontend/src/components/sections/skill-badge.tsx` — Skill badge with name, category color, proficiency indicator (dots).

8. `/frontend/src/components/sections/timeline-item.tsx` — Experience timeline item with company, role, dates, responsibilities.

9. `/frontend/src/components/sections/contact-form.tsx` — Reusable contact form with validation, success/error states. Use 'use client'.

10. `/frontend/src/app/page.tsx` — Home page: fetch profile + featured projects, render Hero + featured projects grid.

11. `/frontend/src/app/about/page.tsx` — About page: fetch profile, render bio, finance-to-tech narrative, social links.

12. `/frontend/src/app/projects/page.tsx` — Projects listing: fetch all projects, render gallery grid with project cards, featured filter.

13. `/frontend/src/app/projects/[id]/page.tsx` — Project detail page: fetch single project, render full description, tech stack, links.

14. `/frontend/src/app/skills/page.tsx` — Skills page: fetch skills grouped by category, render category sections with skill badges.

15. `/frontend/src/app/experience/page.tsx` — Experience page: fetch experience entries, render chronological timeline.

16. `/frontend/src/app/certifications/page.tsx` — Certifications page: fetch certifications, render list with name, issuer, date, credential link.

17. `/frontend/src/app/contact/page.tsx` — Contact form page: render contact form component.

18. `/frontend/src/app/layout.tsx` — Root layout: integrate Header and Footer, set global metadata, font imports.

19. `/frontend/src/app/not-found.tsx` — Custom 404 page with link back to home.

Write all files using the Write tool. Use 'use client' directive only where interactivity is needed (forms, mobile menu). Use Tailwind CSS for all styling. Keep it clean and modern. Use neutral colors with blue accent.

## Response snapshot

Created 19 frontend files for the Next.js App Router portfolio project:

1. **`frontend/src/lib/api.ts`** — HTTP client with `fetchApi<T>` generic function and `api` object with typed methods for all backend endpoints (profile, projects, skills, experience, certifications, testimonials, leads, chat).

2. **`frontend/src/types/api.ts`** — TypeScript interfaces: `Profile`, `Project`, `Skill`, `Experience`, `Certification`, `Testimonial`.

3. **`frontend/src/components/layout/header.tsx`** — Sticky header with "Mehdi" logo, 7 nav links, animated hamburger menu for mobile. Uses `'use client'` for state.

4. **`frontend/src/components/layout/footer.tsx`** — Footer with dynamic year copyright, LinkedIn and GitHub links.

5. **`frontend/src/components/sections/hero.tsx`** — Hero section accepting `profile` prop, renders name, headline, bio, CTA buttons (View Projects, Contact Me), resume download.

6. **`frontend/src/components/sections/project-card.tsx`** — Card with image, title, short description, tech stack badges, live demo and GitHub links.

7. **`frontend/src/components/sections/skill-badge.tsx`** — Skill badge with category color coding, 5-dot proficiency indicator, order index support.

8. **`frontend/src/components/sections/timeline-item.tsx`** — Timeline item with blue dot, connecting line, company/role, dates, responsibilities.

9. **`frontend/src/components/sections/contact-form.tsx`** — Form with name, email, category selector, message, client-side validation, success/error states. Uses `'use client'`.

10. **`frontend/src/app/page.tsx`** — Server Component home page, fetches profile + featured projects via `Promise.all`, renders Hero + featured project grid.

11. **`frontend/src/app/about/page.tsx`** — Server Component about page with bio, finance-to-tech narrative box, social links, resume download button.

12. **`frontend/src/app/projects/page.tsx`** — Server Component projects listing with All/Featured filter toggle, responsive grid of project cards with links.

13. **`frontend/src/app/projects/[id]/page.tsx`** — Server Component project detail page with full description, tech stack, links, back navigation.

14. **`frontend/src/app/skills/page.tsx`** — Server Component skills page with grouping by category, sorted rendering, skill badges grid.

15. **`frontend/src/app/experience/page.tsx`** — Server Component experience page with chronological timeline using TimelineItem components.

16. **`frontend/src/app/certifications/page.tsx`** — Server Component certifications page with list of certs, issuer, date, credential links.

17. **`frontend/src/app/contact/page.tsx`** — Contact page rendering the ContactForm component with heading and description.

18. **`frontend/src/app/layout.tsx`** — Root layout integrating Header and Footer, global metadata with OpenGraph, clean body structure.

19. **`frontend/src/app/not-found.tsx`** — Custom 404 page with large 404 text, message, and "Go Back Home" button.

All files use Tailwind CSS with neutral colors and blue accent. `'use client'` directive used only in `header.tsx` (mobile menu) and `contact-form.tsx` (form state). Server Components used for all pages with `export const revalidate = 60` for ISR.

## Outcome

- Impact: Complete public-facing frontend implemented for the portfolio platform with 19 files covering all major pages and reusable components
- Tests: None run — frontend requires Next.js dev server and backend API connection
- Files: 19 files created/updated
- Next prompts: Create frontend admin dashboard pages (T097-T107, T118); implement chatbot widget integration on frontend; add unit/integration tests for frontend components
- Reflection: Used Next.js App Router patterns with Server Components for data fetching and `'use client'` only where interactivity is needed. API client uses generic `fetchApi<T>` for type safety. All pages use ISR with 60s revalidation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): None
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add Jest/React Testing Library tests for components; add E2E tests with Playwright
