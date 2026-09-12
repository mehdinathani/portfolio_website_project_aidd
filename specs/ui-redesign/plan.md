# Plan: Portfolio UI Redesign — SwiftSolve Dark Ambient Style

> Reference: `.specify/memory/swiftsolve-ui-research.md`
> Created: 2026-09-09
> Status: Executed 2026-09-10 — all phases complete, build green, runtime-verified

---

## Goals

Convert the current portfolio website from blue-accent dark UI to a **SwiftSolve-inspired "dark ambient AI startup"** aesthetic — mint/teal accents, full-viewport snap-scroll, CSS aurora backgrounds, premium micro-animation, and zero 3D dependencies.

## Decisions

| Decision | Choice |
|---|---|
| Hero background | Replace Three.js with CSS aurora + canvas particles |
| Layout | Full-viewport snap-scroll (100dvh per section) |
| Typography | Switch to Google Sans (self-hosted woff2) |
| 3D effects | Remove TiltCard and MagneticButton entirely |
| Sections | Keep all current sections, restyle to match SwiftSolve |
| Admin panel | Restyle to match dark theme |

---

## Phase 1: Design System Foundation

### 1.1 — Update CSS Variables (`globals.css`)

**Current**: Blue accent (`#3b82f6`), HSL-based variables, dark navy surfaces
**Target**: Mint accent (`#70ffd8`), near-black surfaces, SwiftSolve token set

Replace `:root` / `.dark` variables:

```
--background: 0 0% 0%           (was 240 5% 4%)
--foreground: 60 5% 96%         (keep)
--muted: 0 0% 43%               (was 215 16% 60% — match #6e6e73)
--accent: 160 100% 64%          (was 217 91% 60% — match #70ffd8)
--primary: 160 100% 64%         (same as accent)
--border: 0 0% 100%/0.08        (was 240 5% 20% — much subtler)
```

Add new tokens:
```
--mint: #70ffd8
--mint-light: #a8ffe8
--teal: #2dd4bf
--teal-deep: #14b8a6
--section-surface: #040404
```

Add utility classes:
```
.section-surface { background-color: #040404; }
.section-glow { background: #000 + radial gradients; }
.type-headline, .type-title, .type-body, .type-label, .type-caption
```

### 1.2 — Update Tailwind Config (`tailwind.config.js`)

- Replace `primary` color from blue to mint
- Add `accent` with mint/teal shades
- Remove `accent-orange` and `accent-orange-hover`
- Update `border` color to `white/8%`
- Add custom animations: `logo-gradient-flow`, `aurora-drift`, `marquee-scroll`
- Add `scroll-snap-type` utilities
- Update font family to Google Sans

### 1.3 — Self-Host Google Sans Font

- Download Google Sans woff2 variable (400–700)
- Place in `public/fonts/google-sans/`
- Update `layout.tsx` font imports (next/font or @fontsource)
- Replace `--font-display` (Space Grotesk) with Google Sans
- Keep Inter as fallback, remove Space Grotesk dependency

### 1.4 — Install/Verify Dependencies

- `lucide-react` ✅ (already installed)
- `motion` ✅ (already installed)
- Remove: `@react-three/fiber`, `@react-three/drei`, `three` (after hero replacement)
- Remove: `@types/three`
- Verify: `lenis` (keep for smooth scroll + snap)

---

## Phase 2: Hero Section Rewrite

### 2.1 — Remove Three.js Hero Components

**Delete or gut:**
- `components/hero/shader-hero.tsx`
- `components/hero/particle-field.tsx`
- `components/hero/hero-mask-reveal.tsx`
- `components/hero/hero-fallback.tsx`
- `components/hero/shaders/` (entire directory)

### 2.2 — Create Aurora Background Component

**New:** `components/hero/aurora-background.tsx`

CSS-only aurora with:
- 3 blurred gradient curtains (`blur(60px)`, 18–24s drift animation)
- 3 colored orbs (mint, sky blue, teal at 8–18% opacity, `blur(100-120px)`)
- Grid overlay: `linear-gradient(#fff 1px, transparent)` at 72px with radial mask vignette
- Noise overlay: SVG `feTurbulence` at 4% opacity
- Base: `#030303` with bottom gradient fade

### 2.3 — Create Canvas Particle Component

**New:** `components/hero/canvas-particles.tsx`

Lightweight HTML5 canvas (not Three.js):
- 200–400 small dots/stars
- Subtle drift animation
- Mouse parallax (optional)
- `prefers-reduced-motion` respected

### 2.4 — Rewrite Hero Content (`hero-content.tsx`)

- Eyebrow pill: `type-label rounded-full border border-white/10 bg-white/5 px-4 py-1.5`
- Animated gradient wordmark: letter-by-letter reveal with `blur + translateY`
- H1: large `clamp(2.5rem, 11vw, 8rem)` gradient text
- Subcopy: `type-body text-white/50`
- 2 CTAs: solid white pill + ghost pill
- Scroll indicator at bottom

### 2.5 — Rewrite Hero Orchestrator (`hero-section.tsx`)

- Combine `AuroraBackground` + `CanvasParticles` + `HeroContent`
- Remove all Three.js/R3F imports
- Set `snap-section` and `100dvh`

---

## Phase 3: Global Layout — Snap-Scroll

### 3.1 — Update Root Layout (`layout.tsx`)

- Add `scroll-snap-type: y mandatory` to body/container
- Add `scroll-smooth` behavior
- Remove `CustomCursor` component (SwiftSolve doesn't have one)
- Remove `MagneticButton` usage
- Keep: `SmoothScroll` (Lenis), `PageProgress`, `Analytics`, `Toaster`, `CommandPalette`

### 3.2 — Update Header (`header.tsx`)

- Make fully transparent (remove `bg-background/80 backdrop-blur-md`)
- Logo: animated gradient text (`logo-wordmark` class)
- Nav links: `type-caption text-muted hover:text-accent` (gray → mint)
- Mobile hamburger: 44px circle
- Remove orange "Book a call" button → white pill or ghost

### 3.3 — Make Every Section a Snap Section

Add to each section wrapper:
```
class="snap-section" → min-height: 100dvh; scroll-snap-align: start;
```

Section-specific backgrounds:
- `.section-surface` → `#040404` (About, Services, Contact)
- `.section-glow` → black + radial gradients (Portfolio, Trust)
- Default: pure black `#000`

### 3.4 — Update Footer (`footer.tsx`)

- Simplify to single line: `© 2026 Mehdi Nathani. All rights reserved.`
- `type-caption text-white/35`
- `border-t border-white/[0.06]`

### 3.5 — Add Section Dividers

Between each section:
```html
<div class="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
```

---

## Phase 4: Section-by-Section Restyle

### 4.1 — Trust Strip / Stats

**Current**: 4-item stats row with animated counters
**Target**: Keep as stats row, restyle to SwiftSolve cards:
- `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6`
- Icons in mint accent tiles

### 4.2 — About Strip

**Current**: Bio with TiltCard image
**Target**:
- Remove TiltCard (3D effect removed)
- Simple text section with `section-surface` background
- Add marquee of skill chips (counter-scrolling, two rows)
- Chips: `rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5` + lucide icon

### 4.3 — Stats Strip (Animated Counters)

- Keep but restyle numbers to mint accent
- `type-headline` for numbers, `type-label` for labels

### 4.4 — Why Choose Us

**Current**: 6-card feature grid
**Target**: 3-card grid (condense to most important)
- Icon tiles: `rounded-xl border border-white/[0.08] bg-white/[0.04] text-accent`
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6`

### 4.5 — Featured Project + Projects Bento

**Current**: Large featured card + bento grid
**Target**: Carousel or grid with SwiftSolve card anatomy:
- Icon tile + category label + title
- Lead paragraph
- Outcome box (left accent border)
- Tech tags: `rounded-full` with mint border

### 4.6 — Skills Cluster

**Current**: Interactive pills with keyboard nav
**Target**: Marquee-style infinite scroll (like SwiftSolve About section)
- Remove keyboard navigation interactivity
- Two counter-scrolling rows
- Chips with lucide icons

### 4.7 — Testimonials Marquee

**Current**: Dual-row infinite scroll
**Target**: Keep marquee style, restyle cards:
- `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6`
- Remove star ratings (amber) or restyle to mint

### 4.8 — Process Steps

**Current**: 3-step process
**Target**: 4-step grid (expand if needed) or keep 3
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`
- Each step: icon (`text-accent`) + `type-label` step number + title + body

### 4.9 — Contact CTA

**Current**: Dark CTA section
**Target**: `section-surface` background
- Primary CTA: solid mint button `rounded-full bg-accent text-black`
- Secondary: email link

### 4.10 — Services Page Sections

- `services-hero.tsx`: Restyle hero to match new hero style
- `service-grid.tsx`: 6 cards → SwiftSolve icon-tile + title + body pattern
- `service-highlight.tsx`: Restyle
- `services-cta.tsx`: Match contact CTA
- `services-faq.tsx`: Keep accordion, restyle to dark cards

### 4.11 — Other Pages

- `about/page.tsx`: Restyle with section-surface backgrounds
- `projects/[id]/page.tsx`: Restyle project detail cards
- `certifications/page.tsx`: Restyle grid
- `contact/page.tsx`: Restyle form + Cal.com embed
- `uses/page.tsx`, `now/page.tsx`: Restyle static content

---

## Phase 5: Component Cleanup

### 5.1 — Remove 3D Effects

- Delete `components/motion/tilt-card.tsx`
- Delete `components/motion/magnetic-button.tsx`
- Remove all imports/usages of these components
- Remove `organic-blob.tsx` and `blob-travel-canvas.tsx` (already commented out)
- Remove `blob-section-waypoints.ts`

### 5.2 — Remove Three.js Dependencies

- Remove from `package.json`: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`
- Remove all `shader-hero`, `particle-field`, `hero-mask-reveal`, `hero-fallback` imports
- Remove shader files from `public/` or `components/hero/shaders/`

### 5.3 — Restyle Motion Components

- `reveal-section.tsx`: Update to match SwiftSolve fade-in (blur + translateY + scale)
- `parallax-section.tsx`: Keep or simplify
- `marquee.tsx`: Keep, ensure dual-row counter-scrolling works
- `smooth-scroll.tsx`: Keep Lenis
- `scroll-to-top.tsx`: Restyle to mint accent
- `custom-cursor.tsx`: **Delete** (not in SwiftSolve style)
- `command-palette.tsx`: Restyle to dark theme

### 5.4 — Restyle Chat Components

- `chat-sheet.tsx`: Update gradient backgrounds from blue to mint
- `orb.tsx`: Update accent color
- `chatbot/` components: Update accent colors

---

## Phase 6: Admin Panel Restyle

### 6.1 — Update Admin Layout

- Sidebar: `bg-[#0a0a0a]` with `border-white/[0.08]` borders
- Active link: `bg-white/[0.05] text-accent` (mint)
- Text: `text-white/70` (not `text-gray-900`)

### 6.2 — Update Admin Pages

- Dashboard cards: `bg-white/[0.03] border-white/[0.08]`
- Status badges: mint-based instead of blue/green/yellow
- Tables: `border-white/[0.06]` borders, `text-white/70` text
- Forms: dark inputs with `border-white/[0.08]`
- Buttons: mint accent primary

---

## Phase 7: Animation & Motion

### 7.1 — Scroll Reveal Animations

Update `RevealSection` to match SwiftSolve:
- `blur(8-14px)` → 0
- `translateY(20-72px)` → 0
- `scale(0.92-0.95)` → 1
- Staggered timing per child
- `transition-ease-[cubic-bezier(0.22,1,0.36,1)]` (expo-out)

### 7.2 — Hero Animations

- Letter-by-letter gradient wordmark reveal
- Logo gradient flow (8s animation)
- Aurora curtain drift (18-24s)
- Orb pulse (22-30s)

### 7.3 — Continuous Animations

- Counter-scrolling marquee (two rows, opposite directions)
- Subtle card hover transitions

---

## Phase 8: Testing & Verification

### 8.1 — Visual Testing

- [ ] All sections snap to viewport
- [ ] Aurora background renders smoothly
- [ ] Canvas particles perform well (60fps)
- [ ] All accent colors are mint/teal (no blue remnants)
- [ ] No Three.js errors in console
- [ ] Responsive on mobile/tablet/desktop

### 8.2 — Performance Testing

- [ ] Bundle size reduced (Three.js removed)
- [ ] Lighthouse score maintained/improved
- [ ] No layout shift from font swap
- [ ] Scroll snap works with Lenis

### 8.3 — Accessibility

- [ ] `prefers-reduced-motion` disables animations
- [ ] All sections navigable via keyboard
- [ ] Color contrast ratios pass WCAG AA
- [ ] Screen reader labels intact

### 8.4 — Code Quality

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` (or `tsc --noEmit`) passes
- [ ] No unused imports/variables
- [ ] Build succeeds (`npm run build`)

---

## File Change Summary

### Files to CREATE (new):
- `components/hero/aurora-background.tsx`
- `components/hero/canvas-particles.tsx`
- `public/fonts/google-sans/*.woff2`

### Files to DELETE:
- `components/hero/shader-hero.tsx`
- `components/hero/particle-field.tsx`
- `components/hero/hero-mask-reveal.tsx`
- `components/hero/hero-fallback.tsx`
- `components/hero/shaders/` (entire directory)
- `components/motion/tilt-card.tsx`
- `components/motion/magnetic-button.tsx`
- `components/effects/organic-blob.tsx`
- `components/effects/blob-travel-canvas.tsx`
- `components/effects/blob-section-waypoints.ts`
- `components/motion/custom-cursor.tsx`

### Files to HEAVILY MODIFY:
- `src/app/globals.css` (design tokens, animations, utility classes)
- `tailwind.config.js` (colors, fonts, animations)
- `src/app/layout.tsx` (snap-scroll, remove cursor, fonts)
- `src/components/layout/header.tsx` (transparent nav, gradient logo, mint links)
- `src/components/layout/footer.tsx` (minimal single-line)
- `src/components/hero/hero-section.tsx` (aurora + particles + content)
- `src/components/hero/hero-content.tsx` (SwiftSolve hero layout)
- All section components (restyle to SwiftSolve patterns)
- All page files (snap sections, backgrounds)
- All admin pages (dark theme)

### Files to MODERATELY MODIFY:
- `src/components/motion/reveal-section.tsx` (new animation params)
- `src/components/motion/marquee.tsx` (dual-row support)
- `src/components/motion/scroll-to-top.tsx` (mint accent)
- `src/components/motion/command-palette.tsx` (dark theme)
- `src/components/chat/chat-sheet.tsx` (accent colors)
- `src/components/chat/orb.tsx` (accent colors)
- `src/components/chatbot/*.tsx` (accent colors)
- `src/components/sections/*.tsx` (all section restyling)
- `package.json` (remove Three.js deps)

---

## Execution Order

1. **Phase 1**: Design system foundation (CSS vars, Tailwind config, fonts)
2. **Phase 2**: Hero rewrite (aurora + particles + content)
3. **Phase 3**: Global layout (snap-scroll, header, footer, dividers)
4. **Phase 4**: Section-by-section restyle
5. **Phase 5**: Component cleanup (remove 3D, restyle motion)
6. **Phase 6**: Admin panel restyle
7. **Phase 7**: Animation tuning
8. **Phase 8**: Testing & verification

---

## Risks

- **Snap-scroll + Lenis interaction**: May need Lenis config tweaks for snap behavior
- **Font licensing**: Google Sans is not openly licensed — may need to use Inter as alternative
- **Performance**: Canvas particles must be lightweight to maintain 60fps
- **Admin scope**: Large number of admin pages to restyle
- **Three.js removal**: Must ensure no orphaned imports cause build errors
