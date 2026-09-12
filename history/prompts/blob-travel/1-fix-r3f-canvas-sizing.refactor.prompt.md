---
id: 1
title: Fix R3F Canvas sizing for blob travel
stage: refactor
date: 2026-06-13
surface: agent
model: deepseek-v4-flash-free
feature: blob-travel
branch: 001-portfolio-platform
user: unknown
command: what did we do so far?
labels: [bug, canvas-sizing, r3f, debugging]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/components/effects/blob-travel-canvas.tsx
 - frontend/src/app/layout.tsx
 - frontend/src/components/effects/organic-blob.tsx
 - frontend/src/components/effects/blob-section-waypoints.ts
tests:
 - Playwright script (check-blob.js)
---

## Prompt

What did we do so far?

## Response snapshot

Diagnosed a canvas sizing bug: the R3F Canvas component's internal container div had `height: 100%` but ancestors collapsed to 0px height when using `position: fixed` via style prop on Canvas directly. Two changes fixed it:

1. **Wrapped Canvas in a fixed container div** (instead of passing fixed styles directly to Canvas) — this ensured the outer R3F div properly inherited viewport dimensions
2. Added `resize={{ scroll: false, debounce: 0 }}` to Canvas to disable scroll-based resize and minimize debounce on window resize

Discovered the hero shader's canvas (canvas 1 at 300x150) also has this sizing issue — it's inside a ParallaxSection where all children are `position: absolute`, so the container chain collapses to 0px. This is a pre-existing issue, not caused by the blob changes.

BlobTravelCanvas now renders at 1280×720 (correct viewport size) with WebGL context active and three.js rendering the organic blob mesh.

## Outcome

- ✅ Impact: Blob canvas renders at correct viewport size (1280×720), WebGL context active, blob mesh animating
- 🧪 Tests: Playwright confirms fixed canvas at 1280×720 with `.fixed` ancestor; hero canvas unchanged at 300×150 (pre-existing)
- 📁 Files: `blob-travel-canvas.tsx` rewritten to use wrapper div + explicit Canvas sizing
- 🔁 Next prompts: Verify blob visual appearance and scroll-travel behavior; fix hero shader canvas sizing (separate issue)
- 🧠 Reflection: R3F Canvas sizing depends on the inner container div's CSS `height: 100%` resolving correctly via `useMeasure`. Passing `position: fixed` via style prop to Canvas directly bypasses the wrapper div structure and breaks `useMeasure` because the container updates don't propagate correctly. Using a wrapper div with explicit `fixed inset-0 h-screen w-screen` and letting Canvas keep default `width: 100%; height: 100%` solves it reliably.

## Evaluation notes (flywheel)

- Failure modes observed: Initial approach of passing `position: fixed` inline styles directly to Canvas component caused R3F's internal `useMeasure` to return 0 dimensions; `gl.setSize()` in `onCreated` was overwritten by subsequent resize
- Graders run and results (PASS/FAIL): PASS — Blob canvas confirmed at 1280×720 via Playwright
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Remove `resize` prop to check if wrapper div alone is sufficient
