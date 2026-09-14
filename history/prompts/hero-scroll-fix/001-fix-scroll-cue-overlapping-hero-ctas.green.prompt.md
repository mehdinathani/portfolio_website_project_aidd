---
id: "001"
title: "Fix SCROLL cue overlapping hero CTAs"
stage: "green"
date: "2026-09-13"
surface: "agent"
model: "big-pickle"
feature: "hero-scroll-fix"
branch: "001-portfolio-platform"
user: "mehdinathani"
command: "fix bug: SCROLL text hiding between Book a 15-min call and View selected work"
labels: ["hero", "scroll-indicator", "overlap", "layout", "playwright"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - frontend/src/components/hero/hero-content.tsx
  - frontend/__tests__/HeroSection.test.tsx
  - history/prompts/hero-scroll-fix/001-fix-scroll-cue-overlapping-hero-ctas.green.prompt.md
tests:
  - "Playwright overlap check across viewports (1440x900, 390x844, 1152x640@1.25, 1024x600, 900x560) — anyOverlap PASS (was FAIL before fix)"
  - "npx jest HeroSection — PASS (2/2)"
  - "npx eslint hero-content.tsx + HeroSection.test.tsx — 0 errors"
  - "npm run lint — only pre-existing errors in unrelated files (api.ts etc.)"
---

## Prompt

i dont know why you cant find the bug, there is a text button between 2 button named scroll, which is hiding between book a 15 min call and view selected work

## Response snapshot

Root cause: in `frontend/src/components/hero/hero-content.tsx` the SCROLL cue was `absolute bottom-8 left-1/2 -translate-x-1/2` inside a `min-h-screen justify-center` hero. The centered content block is ~515px tall, so on shorter viewports (Windows 125% scaling, small laptops ~600px tall) the CTA buttons' bottom and the bottom-pinned SCROLL overlapped — measured `gapBtnToScroll` of -14px and -34px (SCROLL text sitting on/over the "View selected work" button). Framer-motion also freezes Tailwind's `-translate-x-1/2` to a mount-time pixel value.

Fix: moved SCROLL out of `position: absolute` into normal flex flow. The hero root now centers the CTA content block in a `flex-1` wrapper (`min-h-0`) and SCROLL sits below it (`shrink-0, pt-8`), so it can never overlap the buttons at any viewport. Desktop keeps the intended near-bottom placement (content centered above, cue below).

Verified identical layout across 5 viewports (desktop, mobile, 2 short-laptop sizes, minimal window): `anyOverlap: false` everywhere, gap after CTAs 32–173px. Also fixed the stale `HeroSection.test.tsx` assertion (`intersection of AI` → current copy).

## Outcome

- ✅ Impact: SCROLL indicator no longer renders between/over the "Book a 15-minute fit call" and "View selected work" buttons on short viewports; cue stays cleanly below CTAs on all screens.
- 🧪 Tests: Playwright overlap matrix PASS, jest PASS (2/2), eslint clean for changed files.
- 📁 Files: frontend/src/components/hero/hero-content.tsx, frontend/__tests__/HeroSection.test.tsx
- 🔁 Next prompts: deploy to Vercel; optionally visually review hero on real laptop with 125% scaling.
- 🧠 Reflection: The layout measured "correct" at 900px tall, so unit reasoning missed the failure. Reproducing with realistic viewports (Windows 125% DPR, short windows) revealed absolute position + centered content inevitably collide when content height approaches viewport height — normal flow with a flex-1 centering wrapper is the deterministic fix.

## Evaluation notes (flywheel)

- Failure modes observed: assuming one viewport size; `getBoundingClientRect`/selector false positives when matching textContent on the root container (matched root div, full-height rect).
- Graders run and results (PASS/FAIL): Playwright matrix PASS, jest PASS, eslint PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none required