---
id: 0006
title: Lighthouse perf optimization to 94
stage: green
date: 2026-06-06
surface: agent
model: deepseek-v4-flash-free
feature: 003-polish-to-10
branch: 001-portfolio-platform
user: mehdinathani
command: based on last session check our score? → yes → yes → phr record
labels: [lighthouse, performance, optimization, LCP, TBT, shader, favicon]
links:
  spec: specs/003-polish-to-10/tasks.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/hero/hero-section.tsx
  - frontend/src/components/hero/hero-content.tsx
  - frontend/src/app/layout.tsx
  - frontend/public/favicon.svg
  - .gitignore
tests:
  - Lighthouse desktop audit (Performance: 94, Accessibility: 100, Best Practices: 100, SEO: 100)
  - LCP: 3.1s, TBT: 70ms, FCP: 1.1s, Speed Index: 2.2s, CLS: 0
  - Backend health check: supabase=true, gemini=true
  - Frontend HTTP 200: mehdi-portfolio-tan.vercel.app
---

## Prompt

User asked "based on last session check our score?" — ran Lighthouse against production (mehdi-portfolio-tan.vercel.app). Initial score 85/100. Main issues: main thread work 4.3s, TBT 330ms, LCP 3.4s, favicon 404. After two optimization rounds, re-ran Lighthouse scoring 94/100.

## Response snapshot

Two optimization rounds deployed to Vercel production:

**Round 1**: Deferred WebGL shader hero via requestIdleCallback (TBT 330→120ms), added favicon.svg to fix 404, added icons metadata in layout.tsx. Score 85→88.

**Round 2**: Removed word-by-word motion.span staggered animation on h1 (LCP element), replaced with single block animation with opacity transition. Added CSS fade transition for shader overlay (gradient→shader swap). Reduced idle timeout 2000→1000ms. Score 88→94.

Final: Performance 94, Accessibility 100, Best Practices 100, SEO 100. TBT 70ms (-79%), LCP 3.1s (-9%), no console errors.

## Outcome

- ✅ Impact: Lighthouse Performance improved from 85→94 (+9). All sub-90 metrics resolved. Bundle 87.7 kB shared, zero console errors.
- 🧪 Tests: Lighthouse desktop audit PASS (94/100). Backend health endpoint returns healthy with Supabase + Gemini connected. Frontend HTTP 200.
- 📁 Files: hero-section.tsx (shader defer + fade transition), hero-content.tsx (simplified h1 animation), layout.tsx (favicon metadata), favicon.svg (new), .gitignore (cleanup)
- 🔁 Next prompts: Consider running Lighthouse on mobile preset, set up custom domain, or tackle unused JS (75 KiB from R3F chunks)
- 🧠 Reflection: The single biggest win was deferring R3F/WebGL initialization from page load to idle callback — shader compilation was consuming 2s+ of main thread time. The word-by-word h1 animation (10+ motion.span with staggered delays) was adding unnecessary LCP cost for marginal visual gain. Transition from gradient→shader needed CSS opacity fade to avoid Speed Index regression.

## Evaluation notes (flywheel)

- Failure modes observed: (1) Vercel auto-deploy failed on branch push (wrong production branch) — used `vercel deploy --prod --yes` directly instead. (2) Lighthouse Chrome connection failed via CLI — had to launch Chrome with explicit remote-debugging-port. (3) Speed Index increased from 2.3→4.2s on first round due to hard swap from gradient to shader — fixed by adding CSS opacity fade transition.
- Graders run and results (PASS/FAIL): Lighthouse Desktop PASS (94), Backend Health PASS, Frontend 200 PASS, No Console Errors PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Defer R3F chunk loading entirely (not just render) via dynamic import factory with idle callback in the import() promise chain — could save additional 75 KiB of unused JS
