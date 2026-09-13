---
id: 013
title: audit-and-fix-portfolio-ux
stage: red
date: 2026-09-13
surface: agent
model: opencode/big-pickle
feature: none
branch: main
user: architext
command: audit website fixes (Playwright probe + CSS/component edits + verification)
labels: ["ui-ux", "accessibility", "css", "nextjs", "verification"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/globals.css
  - frontend/tailwind.config.js
  - frontend/src/components/layout/header.tsx
  - frontend/src/components/chat/orb.tsx
  - frontend/src/components/sections/contact-form.tsx
  - frontend/src/app/contact/page.tsx
  - frontend/src/app/about/page.tsx
  - frontend/src/app/now/page.tsx
  - frontend/src/app/uses/page.tsx
  - frontend/src/app/certifications/page.tsx
  - frontend/src/app/projects/[id]/page.tsx
  - frontend/src/app/not-found.tsx
  - frontend/src/app/error.tsx
  - frontend/src/app/admin/layout.tsx
  - frontend/package.json
  - frontend/package-lock.json
tests:
  - npx eslint --no-error-on-unmatched-pattern <edited files> (0 new errors)
  - npx tsc --noEmit (only pre-existing tests/e2e spec errors)
  - npm run build (passes; run only when dev server stopped)
  - Playwright verify_fixes2.py (mains==1, no overlaps, snap per viewport, marquee animating, select anim, header bg, orb hidden)
---

## Prompt

Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.

(Context: continuing the portfolio website UI/UX audit session — mobile snap-scroll trap, dead dropdown animations, chat orb overlap on the contact Send button, nested <main> duplicates, missing select accessible name, image CLS warning, transparent-header readability.)

## Response snapshot

Verified all outstanding fixes on the clean dev server (PID 82230, :3000):

- Chat orb overlap resolved by hiding ChatOrb on `/contact` (`usePathname() === '/contact'`) instead of the ineffective form `pb-24` (padding adds space after the button, does not lift it); reverted the form padding. Confirmed on 390px: no 56px orb on /contact, Send button intact.
- Header scrolled background: replaced the window `scroll` listener with a rAF loop reading `window.scrollY` — in headless Chromium under Lenis, capture/bubble `scroll` events never fire even though `scrollTop` changes and IntersectionObserver reveals work fine. Verified bg `rgba(0,0,0,0.7)` + blur(12px) after scroll, `rgba(0,0,0,0.157)` at top.
- tailwind.config.js: swapped `require('tailwindcss-animate')` (eslint `no-require-imports` error) for ESM default import `tailwindCssAnimate`; dropdown listbox animates (`animationName: enter`, 0.15s, 4 options).
- Confirmed regressions-free: `main` count == 1 on /, /about, /contact, /services, /now, /uses, /certifications; zero persistent leaf overlaps; snap enabled (`y`) at 1440/768, disabled at 390; skills/testimonial marquees animate (transform delta ~−33px); about image CLS console warning gone.

## Outcome

- ✅ Impact: Fixed the user-reported broken-animation/overlap cluster plus accessibility nits; the remaining new risk is the orb being unavailable on the contact page (deliberate tradeoff, chat still available everywhere else).
- 🧪 Tests: lint 0 new errors (1 pre-existing anonymous-default-export warning); tsc --noEmit only pre-existing spec errors; build passes (not rerun while serving dev to avoid shared .next corruption); Playwright verify suite green.
- 📁 Files: 14 source files + package.json/lock (tailwindcss-animate added).
- 🔁 Next prompts: run `squirrel audit` as a final pass; deploy/dev-flow note about never running `next build` while `next dev` is live; confirm whether Vercel production should be redeployed.
- 🧠 Reflection: root cause of three separate "dead-feeling" behaviors (header bg, scroll progress, scroll-to-top) is that no window `scroll` events are dispatched under Lenis in this environment — components depending on scroll listeners appear broken; a rAF or IO based pattern is the robust fix. Form-level padding cannot lift a last-child button, so overlay clearance needs the overlay moved/hidden rather than content nudged.

## Evaluation notes (flywheel)

- Failure modes observed: build-vs-dev shared `.next` corruption (CSS keyframes w/o w-full etc.) — must always `rm -rf .next` after killing dev and before rebuilding; `[style*="animation: marquee"]` selector misses React's space-less inline style; selector needing space after colon.
- Graders run and results (PASS/FAIL): Playwright overlay/mains/snap/marquee/header/select checks PASS; eslint/tsc PASS (no new issues); npm test 5 pre-existing failing suites (ShaderHero, MagneticButton, TiltCard, HeroSection, SkillsCluster — content drift/jsdom), unrelated.
- Prompt variant (if applicable): n/a.
- Next experiment (smallest change to try): reintroduce a primary contact CTA via the chat launcher on mobile if discoverability loss is felt; verify scroll-event behavior in non-headless browsers before other scroll-driven components are "fixed."