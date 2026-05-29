# Implementation Plan: 002 — Portfolio Redesign (3D Hero + Editorial Body)

**Branch**: `002-portfolio-redesign` | **Date**: 2026-05-29 | **Spec**: `specs/002-portfolio-redesign/spec.md`
**Input**: Feature specification from `/specs/002-portfolio-redesign/spec.md`

## Summary

Redesign the public-facing surface of Mehdi's portfolio from a functional-but-plain layout to a visually striking experience. The core change is replacing the static hero with a **3D mouse-reactive particle field** (R3F) while keeping the rest of the page in a **2D editorial body** — bento grid projects, testimonial marquee, skill clusters, and Cal.com booking. Backend, data model, routes (mostly), admin area, and RAG chatbot logic are untouched.

**Technical approach**: Incremental — restyle existing pages without breaking existing functionality. Ship hero prototype first (isolated `/preview/hero`), then layer on bento, motion, and persistent UI (header, cursor, ⌘K, chat orb).

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 18+, React 18.3, Next.js 14.2
**Primary Dependencies**: `motion` (~35 KB), `three` (~150 KB lazy), `@react-three/fiber` (~25 KB), `@react-three/drei` (~10 KB), `lenis` (~8 KB), `@use-gesture/react` (~10 KB), `cmdk` (~6 KB), `lucide-react` (~1 KB/icon), shadcn/ui (tree-shaken per component)
**Storage**: Supabase (unchanged — same backend, same schema)
**Testing**: Jest (unit), Playwright (E2E) — existing test suite must continue to pass
**Target Platform**: Web (modern browsers), mobile fallback (no 3D shipped <768px or reduced-motion)
**Project Type**: Web — frontend (`frontend/`) + backend (`backend/`) — redesign only touches `frontend/`
**Performance Goals**: LCP ≤ 2.0s on Slow 4G (Moto G4), JS first-paint ≤ 300 KB gz, INP ≤ 200ms, CLS ≤ 0.05, total page weight ≤ 1.2 MB
**Constraints**: 3D hero is lazy-loaded (`next/dynamic` with `ssr: false`); mobile/reduced-motion gets static poster + CSS gradient; no regressions on existing E2E tests
**Scale/Scope**: ~12 public routes restyled visually; ~20 components created or rewritten; ~5 new directories; admin untouched

## Constitution Check

The project constitution (`.specify/memory/constitution.md`) is a placeholder template with no actionable gates. No violations to track. Upon ratification of a real constitution, this plan should be re-checked.

## Project Structure

### Documentation (this feature)

```text
specs/002-portfolio-redesign/
├── spec.md              # Feature requirements (existing)
├── plan.md              # This file
├── research.md          # Phase 0 — tech research (to be created)
├── data-model.md        # N/A — no data model changes
├── contracts/           # N/A — no API contract changes
└── tasks.md             # Phase 2 — created by /sp.tasks
```

### Source Code (frontend only — backend unchanged)

```text
frontend/src/
├── app/
│   ├── globals.css                 # REWRITE — new color tokens, fonts, keyframes, shadcn vars
│   ├── layout.tsx                  # REWRITE — metadata updates, dynamic imports for new persistent UI
│   ├── page.tsx                    # REWRITE — hero + about strip + featured + bento + marquee + contact CTA + footer
│   ├── projects/
│   │   ├── page.tsx                # REWRITE — bento grid + filter chips + search
│   │   └── [slug]/page.tsx         # REWRITE — sticky-scroll case study
│   ├── about/page.tsx              # REWRITE — long-form editorial + timeline + skill cluster (absorbs /experience + /skills)
│   ├── contact/page.tsx            # REWRITE — hero panel + form + Cal.com embed
│   ├── certifications/page.tsx     # RESTYLE — card grid, minor visual refresh
│   ├── experience/                 # REMOVED — merged into /about timeline
│   ├── skills/                     # REMOVED — merged into /about skill cluster
│   ├── admin/                      # UNTOUCHED
│   ├── error.tsx                   # RESTYLE
│   ├── not-found.tsx               # RESTYLE
│   └── preview/
│       └── hero/page.tsx           # NEW — isolated hero prototype sandbox
│
├── components/
│   ├── hero/
│   │   ├── hero-section.tsx        # NEW — orchestrator: detects device/motion pref → 3D or fallback
│   │   ├── particle-field.tsx      # NEW — R3F canvas with point cloud + mouse force
│   │   ├── hero-content.tsx        # NEW — H1, sub, CTAs (semantic HTML overlaying canvas)
│   │   └── hero-fallback.tsx       # NEW — static WebP poster + CSS gradient for mobile/reduced-motion
│   │
│   ├── motion/
│   │   ├── reveal-text.tsx         # NEW — word-by-word stagger reveal (motion.span)
│   │   ├── magnetic-button.tsx     # NEW — button with 40px magnetic radius (@use-gesture)
│   │   ├── tilt-card.tsx           # NEW — card tilt ±5° on cursor proximity (@use-gesture)
│   │   ├── marquee.tsx             # NEW — horizontal infinite scroll (motion + CSS)
│   │   ├── page-transition.tsx     # NEW — AnimatePresence wrapper, 180ms fade + 8px slide
│   │   ├── shared-layout.tsx       # NEW — layoutId wrapper for shared element transitions
│   │   └── custom-cursor.tsx       # NEW — 12px disc, blend-mode difference, expands over interactives
│   │
│   ├── sections/
│   │   ├── about-strip.tsx         # NEW — 50vh editorial sentence + avatar with tilt
│   │   ├── featured-project.tsx    # NEW — 75vh hero card with video/animated bg, tilt, shared-layout
│   │   ├── projects-bento.tsx      # NEW — bento grid (1 large + 4-6 small), tilt, hover image reveal
│   │   ├── skills-cluster.tsx      # NEW — floating skill chips with hover glow + physics jiggle
│   │   ├── testimonials-marquee.tsx # NEW — two-row infinite scroll, pause on hover
│   │   ├── contact-cta.tsx         # NEW — editorial closer + Cal.com embed / button
│   │   ├── hero.tsx                # REMOVED — replaced by components/hero/
│   │   ├── project-card.tsx        # REMOVED — replaced by tilt-card in bento
│   │   ├── skill-badge.tsx         # REPLACED — by skills-cluster.tsx
│   │   ├── timeline-item.tsx       # RESTYLED — visual refresh, keep logic
│   │   └── contact-form.tsx        # RESTYLED — input/button restyle, schema unchanged
│   │
│   ├── chat/
│   │   ├── orb.tsx                 # NEW — floating bottom-right glass orb with idle pulse
│   │   ├── chat-sheet.tsx          # NEW — side sheet container for existing chat UI
│   │   └── chatbot/*               # UNTOUCHED — imported into chat-sheet
│   │
│   ├── layout/
│   │   ├── header.tsx              # REWRITE — glass blur, reduced nav, ⌘K hint, Cal.com CTA, wordmark
│   │   └── footer.tsx              # REWRITE — minimal editorial 3-column: links, socials, "made with"
│   │
│   ├── ui/                         # REPLACED — by shadcn equivalents (old files deleted after migration)
│   │   ├── Button.tsx              # → shadcn button
│   │   ├── Card.tsx                # → shadcn card
│   │   ├── Input.tsx               # → shadcn input
│   │   ├── TextArea.tsx            # → shadcn textarea
│   │   ├── Badge.tsx               # → shadcn badge
│   │   ├── Select.tsx              # → shadcn select
│   │   └── LoadingSpinner.tsx      # → shadcn or custom
│   │
│   └── admin/                      # UNTOUCHED
│
├── hooks/
│   ├── useAuth.ts                  # UNTOUCHED
│   ├── use-chat.ts                 # UNTOUCHED
│   ├── use-reduced-motion.ts       # NEW — prefers-reduced-motion + hardwareConcurrency check
│   └── use-mouse-position.ts       # NEW — normalized mouse position for particle field
│
├── lib/
│   ├── api.ts                     # UNTOUCHED
│   ├── api-admin.ts               # UNTOUCHED
│   ├── supabase-client.ts         # UNTOUCHED
│   ├── supabase.ts                # UNTOUCHED
│   └── utils.ts                   # EXTEND — add animation-related utilities
│
└── types/
    └── api.ts                     # UNTOUCHED

tailwind.config.js                  # REWRITE — color tokens, font families, animation keyframes
next.config.js                      # EXTEND — bundle analyzer, image domains if needed
```

**Structure Decision**: Frontend-only redesign following the existing Next.js App Router convention. New directories (`hero/`, `motion/`, `chat/`) keep concerns separated. Old `ui/` components are deleted after shadcn replacement. No backend changes.

## Dependency Installation Order

```bash
# Phase 0 — Core animation & UI (blocking)
cd frontend
npx shadcn@latest init               # sets up shadcn/ui (components.json, cn utility, base styles)
npx shadcn@latest add button card input textarea badge select
npm install motion@latest
npm install @use-gesture/react@latest

# Phase 1 — 3D Hero (isolated, lazy-loaded)
npm install three@latest @react-three/fiber@latest @react-three/drei@latest

# Phase 2 — Scroll & UX
npm install lenis@latest
npm install cmdk@latest
npm install lucide-react@latest

# Phase 3 — Dev tooling
npm install -D @next/bundle-analyzer@latest
```

**Version pinning**: All `@latest` resolved at install time and locked in `package-lock.json`. No manual version pins unless a compatibility issue is found. Known compatibility: R3F v8.x works with React 18; `motion` is the renamed framer-motion v12.

## Design Tokens (Tailwind Config)

```js
// Key additions to tailwind.config.js
colors: {
  background: '#0a0a0b',       // deep dark
  foreground: '#f5f5f4',       // off-white
  primary: '#3b82f6',          // electric blue
  'primary-foreground': '#ffffff',
  secondary: '#1e1e2e',        // dark card surface
  'secondary-foreground': '#e2e8f0',
  muted: '#1e1e2e',
  'muted-foreground': '#94a3b8',
  accent: '#3b82f6',
  'accent-foreground': '#ffffff',
  destructive: '#ef4444',
  border: '#2a2a3e',
  input: '#2a2a3e',
  ring: '#3b82f6',
},
fontFamily: {
  sans: ['Inter Display', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  display: ['Inter Display', 'system-ui', 'sans-serif'],  // for editorial headings
},
animation: {
  'fade-in': 'fadeIn 0.6s ease-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'marquee': 'marquee 30s linear infinite',
  'marquee-reverse': 'marquee 30s linear infinite reverse',
  'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
},
keyframes: {
  fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
  pulseSoft: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
},
```

CSS custom properties in `globals.css` use the same values as shadcn's dark theme (since we ship dark-only). No light mode.

## Font Setup

```tsx
// app/layout.tsx — add next/font import
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

Apply `inter.variable` and `jetbrainsMono.variable` to `<html>` className. Tailwind `fontFamily` tokens reference `var(--font-inter)` and `var(--font-mono)`.

## shadcn/ui Configuration

```json
// components.json (generated by npx shadcn@latest init)
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

`globals.css` will need shadcn's `@tailwind base/components/utilities` layer directives and CSS variable definitions (dark theme only). The existing `cn()` utility already matches shadcn's expected export.

## Route-by-Route Component Tree

| Route | Page Component | Section Components | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | `<HeroSection />`, `<AboutStrip />`, `<FeaturedProject />`, `<ProjectsBento />`, `<TestimonialsMarquee />`, `<ContactCta />` | All new components |
| `/projects` | `app/projects/page.tsx` | `<ProjectsBento />` with filter + search | Reuses bento with filter state |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | sticky-scroll case study: `<ProjectHero />`, `<ProjectContent />`, `<ShikiCode />` | Shared-layout transition from bento |
| `/about` | `app/about/page.tsx` | editorial intro, `<TimelineItem />` (restyled), `<SkillsCluster />` | Now absorbs /experience + /skills |
| `/contact` | `app/contact/page.tsx` | hero panel, contact form (restyled), Cal.com embed | Cal.com iframe or button |
| `/certifications` | `app/certifications/page.tsx` | card grid (restyled) | No major motion |
| `/preview/hero` | `app/preview/hero/page.tsx` | `<ParticleField />` in isolation | Dev sandbox, removed before prod |

### Persistent UI (present on all routes)

| Component | Location | Behavior |
|---|---|---|
| `<Header />` | `app/layout.tsx` | Sticky, glass blur on scroll, wordmark + 3 nav + Cal.com CTA + ⌘K hint |
| `<Footer />` | `app/layout.tsx` | Minimal editorial, 3 columns |
| `<CustomCursor />` | `app/layout.tsx` | Desktop only, respects reduced-motion |
| `<CommandPalette />` | `app/layout.tsx` | ⌘K trigger, nav + "Open chat" + "Copy email" + "Book a call" |
| `<ChatOrb />` | `app/layout.tsx` | Floating bottom-right, glass effect, idle pulse, expands to `<ChatSheet />` |
| `<PageTransition />` | wrapper in layout | AnimatePresence, 180ms fade + 8px slide |

## Implementation Phases

### Phase 0: Foundation (blocking — do first)
1. Wire up Playwright MCP (blocking for visual iteration)
2. Install shadcn/ui + init
3. Install `motion`, `@use-gesture/react`
4. Rewrite `tailwind.config.js` with new design tokens
5. Rewrite `globals.css` with shadcn dark tokens + custom keyframes
6. Add `next/font` imports in root layout
7. Install bundle-analyzer, configure in `next.config.js`
8. Delete old `components/ui/` files (replaced by shadcn)

### Phase 1: Persistent UI
1. `Header` — glass blur, wordmark, reduced nav (Home, Projects, About, Contact), Cal.com CTA button, ⌘K hint
2. `Footer` — minimal 3-column editorial
3. `CustomCursor` — 12px disc, difference blend, expand on interactive
4. `CommandPalette` — cmdk-based, nav + actions
5. `PageTransition` — AnimatePresence wrapper

### Phase 2: Hero (isolated prototype first)
1. Create `/preview/hero` sandbox page
2. `ParticleField` — R3F canvas, ~4000 points, mouse force field shader
3. `HeroContent` — H1 + sub + CTAs (semantic HTML overlaid)
4. `HeroFallback` — static poster for mobile/reduced-motion
5. `HeroSection` — orchestrator: detect capabilities → render 3D or fallback
6. Iterate on hero until it feels right (budget: 2-3 days max)
7. Integrate into home page

### Phase 3: Home Page Sections
1. `AboutStrip` — editorial sentence + avatar tilt
2. `FeaturedProject` — hero card with video/animated bg + shared-layout
3. `ProjectsBento` — bento grid + tilt + image reveal
4. `SkillsCluster` — floating chips + glow + physics jiggle
5. `TestimonialsMarquee` — two-row infinite scroll
6. `ContactCta` — editorial closer + Cal.com

### Phase 4: Inner Pages
1. `/projects` — full bento + filter chips + search
2. `/projects/[slug]` — sticky-scroll case study with shared-layout transition
3. `/about` — editorial + timeline + skill cluster (absorb /experience + /skills data)
4. `/contact` — hero panel + Cal.com embed
5. `/certifications` — card grid restyle

### Phase 5: Chat Orb + Polish
1. `ChatOrb` — floating glass orb, idle pulse
2. `ChatSheet` — side sheet wrapping existing chat components
3. Remove `/experience` and `/skills` routes, add redirects to `/about`
4. Performance audit — Lighthouse, bundle-analyzer, manual throttled testing
5. Accessibility pass — keyboard, screen reader, reduced-motion verification
6. Mobile testing — real device 4G

## Open Technical Decisions

1. **Particle shader**: GLSL point shader vs R3F `<Points />` from drei. Start with `<Points />` (simpler), fallback to custom shader if performance or look requires it.
2. **Cal.com embed**: `<iframe>` vs Cal.com embed script. Start with a styled "Book a call" link → Cal.com page; upgrade to inline embed if desired.
3. **Lenis vs native smooth scroll**: Lenis gives consistent cross-browser smooth scroll. If bundle size is a concern, native `scroll-behavior: smooth` + IntersectionObserver is the fallback.
4. **Chat orb animation**: CSS `@keyframes` pulse vs motion keyframes. Start with CSS (zero JS cost), upgrade to motion if more complex animation needed.
5. **Hero poster generation**: Pre-render a WebP of the particle field during build (script) or create a CSS-only gradient + SVG noise placeholder. Start with CSS + SVG (no build step), upgrade to pre-rendered WebP if quality isn't enough.

## Risks & Mitigations

1. **R3F bundle size** — Three.js is ~150 KB gz. Mitigation: lazy-load with `next/dynamic` + `ssr: false`; hero content paints before 3D loads.
2. **Animation Polish Gap** — Janky animations look worse than none. Mitigation: review every motion component at 60fps on mid-range Android via Playwright MCP before merging.
3. **shadcn/ui theming** — shadcn expects specific CSS variable patterns. Mitigation: init shadcn first, then customize; verify button/card render correctly before migrating all components.
4. **Route absorption** — Removing `/experience` and `/skills` breaks existing links. Mitigation: add Next.js redirects in `next.config.js`; update internal nav links; update sitemap.

## ADR Candidates

📋 Architectural decision detected: **Animation stack** — `motion` (framer-motion v12) chosen over `gsap` for page transitions + scroll triggers + shared layout; R3F chosen over vanilla Three.js for declarative 3D hero. Multi-option, cross-cutting, long-term impact. Document reasoning and tradeoffs? Run `/sp.adr animation-stack-selection`
