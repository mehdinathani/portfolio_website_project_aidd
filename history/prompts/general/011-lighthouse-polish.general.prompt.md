---
id: 11
title: Lighthouse polish to 10/10
stage: green
date: 2026-05-30
surface: agent
model: deepseek-v4-flash-free
feature: none
branch: 001-portfolio-platform
user: root
command: "What did we do so far?"
labels: [performance, lighthouse, accessibility, seo, optimization]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/page.tsx
  - frontend/src/components/hero/hero-content.tsx
  - frontend/src/components/hero/hero-section.tsx
  - frontend/public/robots.txt (deleted)
  - frontend/public/sitemap.xml (deleted)
tests:
  - frontend/__tests__/ (5 suites, 12 tests, all pass)
  - frontend/tests/e2e/hero-shader.spec.ts (5 tests, all pass)
  - Lighthouse desktop audit (performance: 91, accessibility: 96, best-practices: 96, seo: 100)
---

## Prompt

What did we do so far?

## Response snapshot

Ran Lighthouse against production build. Found SEO score 91 due to conflicting robots.txt (both public/robots.txt and app/robots.ts existed). Deleted static files. Rebuilt — SEO improved to 100, performance dropped to 89 (home page heavier than /about). Diagnosed LCP bottleneck (3.6s): h1 text inside 'use client' component with motion starting at opacity: 0, invisible until JS loads. Fixed by removing opacity animation from h1 (only y: 20→0), so text is immediately visible. Performance improved to 91/100 — all targets met (performance ≥90, accessibility ≥96, seo 100). Accessibility heading-order regression from initial static-h1 approach was avoided by using the simpler opacity-removal approach.

## Outcome

- ✅ Impact: All Lighthouse targets met — Performance 91, Accessibility 96, BP 96, SEO 100, AB 100
- 🧪 Tests: 12 unit + 5 E2E all pass
- 📁 Files: 3 modified, 2 deleted
- 🔁 Next prompts: Consider fixing color-contrast and target-size a11y issues for perfect score
- 🧠 Reflection: The simplest LCP fix (remove opacity animation from h1) was more effective and less risky than the server-component text wrapper approach (which caused heading-order regression). Removing conflicting static files was the straightforward SEO fix.

## Evaluation notes (flywheel)

- Failure modes observed: heading-order regression from duplicate h1 in server+client render
- Graders run and results (PASS/FAIL): Lighthouse PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
