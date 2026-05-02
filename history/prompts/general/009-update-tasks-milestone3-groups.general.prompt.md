---
id: 009
title: Update Tasks Milestone3 Groups
stage: tasks
date: 2026-05-01
surface: agent
model: claude-opus-4-7[1m]
feature: 001-portfolio-platform
branch: 001-portfolio-platform
user: AIDD
command: /sp.tasks Based on the newly generated Milestone 3 plan, please update `tasks.md`...
labels: ["milestone3", "tasks", "frontend", "planning"]
links:
  spec: specs/001-portfolio-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-portfolio-platform/tasks.md
tests:
 - none (planning phase)
---

## Prompt

```text
Based on the newly generated Milestone 3 plan, please update `tasks.md`.
Create a granular, step-by-step task list for the Frontend.
Ensure the tasks are grouped logically:
- Group 1: Base UI Components & Tailwind Setup.
- Group 2: Supabase Auth & Protected Routes.
- Group 3: Server Components & FastAPI Data Fetching (Public Pages).
- Group 4: Admin CRUD Interfaces.
- Group 5: The AI Chat Widget (UI, State, and API Integration).
```

## Response snapshot

Updated `specs/001-portfolio-platform/tasks.md` with 80 new granular tasks (T301-T380) for Milestone 3, organized into 6 groups:

1. **Group 1 — Base UI Components & Tailwind Setup (T301-T316)**: Next.js project init, TailwindCSS config, reusable UI primitives (Button, Input, TextArea, Select, Card, Badge, LoadingSpinner), layout components (Header, Footer), root layout, 404 page, utility functions.

2. **Group 2 — Supabase Auth & Protected Routes (T317-T326)**: Install `@supabase/ssr`, create server/client Supabase clients, Next.js middleware for cookie-based auth + route protection, `useAuth` hook, admin login page, admin header/sidebar, admin layout with auth guard, admin dashboard overview.

3. **Group 3 — Server Components & Public Pages (T327-T342)**: API client (`api.ts`), TypeScript types from OpenAPI, portfolio components (HeroSection, ProjectCard, ProjectGallery, SkillsGroup, ExperienceTimeline, CertificationsList, ContactForm), all 7 public pages (home, about, projects, project detail, skills, experience, certifications, contact).

4. **Group 4 — Admin CRUD Interfaces (T343-T360)**: Admin API client with JWT forwarding, AdminTable + StatusBadge components, admin pages for projects (list/new/[id]), skills, experience, certifications, testimonials, knowledge base, and leads management with filtering.

5. **Group 5 — AI Chat Widget (T361-T372)**: Install `react-markdown` + `remark-gfm`, `useChat` hook with state management, ChatMessage (with markdown rendering), ChatHistory, ChatInput, TypingIndicator, LeadCaptureForm, ChatPanel, ChatWidget (floating, fixed position), integration into root layout, responsive styles, E2E testing.

6. **Group 6 — Polish & Cross-Cutting (T373-T380)**: Responsive verification at all breakpoints, accessibility audit (keyboard nav, ARIA, semantic HTML, color contrast), next/image optimization, robots.txt + sitemap.xml, error boundaries, admin→public flow verification, chat→lead flow verification.

Also updated the Dependencies & Execution Order section with M3-specific dependency graph, parallel opportunities (56% of tasks can run in parallel), MVP scope (Groups 1+3), and implementation strategy.

## Outcome

- ✅ Impact: 80 new tasks added for Milestone 3 frontend implementation
- 🧪 Tests: Planning complete; E2E test tasks included for chat widget and admin flows
- 📁 Files: 1 file updated (tasks.md now ~456 lines)
- 🔮 Next prompts: `/sp.implement` to execute the tasks, starting with Group 1 (Base UI)
- 🧠 Reflection: Tasks use T3XX numbering to distinguish from M1/M2 (T0XX) and M4-M8 (T1XX+). Each task has exact file paths and [P] parallel markers. Group execution order respects dependencies (Group 1 → Group 2+3 in parallel → Group 4+5 → Group 6).
