---
id: 013
title: scroll-travel-3d-blob
stage: green
date: 2026-06-13
surface: agent
model: deepseek-v4-flash-free
feature: scroll-travel-blob
branch: 001-portfolio-platform
user: root
command: implement
labels: ["3d", "three.js", "scroll", "react-three-fiber", "blob", "morphing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/effects/blob-section-waypoints.ts
  - frontend/src/components/effects/organic-blob.tsx
  - frontend/src/components/effects/blob-travel-canvas.tsx
  - frontend/src/app/layout.tsx
tests:
  - null
---

## Prompt

in some modern website i saw a 3d art object which travel as we scroll the page (subsequent exchange: user clarified inline sections, organic metaball, left-right zigzag, gentle rotation, same on mobile)

## Response snapshot

Implemented a scroll-traveling 3D organic blob that morphs and alternates left-right per section:

- **blob-section-waypoints.ts** — 8 waypoints (one per homepage section) with x/y/scale
- **organic-blob.tsx** — IcosahedronGeometry(detail=3) with per-vertex sine displacement for organic morphing, dual-layered mesh (core + transparent glow shell), smooth rotation, scroll-driven position interpolation via `useScroll()`
- **blob-travel-canvas.tsx** — Fixed `pointer-events: none` R3F Canvas, deferred load via `requestIdleCallback`, wrapped in `useCanRender3D()` check for mobile/reduced-motion
- **layout.tsx** — Added dynamic import of BlobTravelCanvas after SmoothScroll

Build passes cleanly.

## Outcome

- ✅ Impact: Scroll-driven 3D organic blob travels between sections (left/right alternating) with morphing and rotation
- 🧪 Tests: Manual visual verification needed in dev
- 📁 Files: 3 new + 1 modified
- 🔁 Next prompts: Run dev server to preview
- 🧠 Reflection: AdaptiveDpr had to be imported from @react-three/drei not @react-three/fiber; leveraged existing useCanRender3D hook and dynamic import pattern

## Evaluation notes (flywheel)

- Failure modes observed: Import error on AdaptiveDpr (wrong package)
- Graders run and results: TypeScript compile: PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add bloom post-processing for glow
