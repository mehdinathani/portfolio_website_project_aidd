# SwiftSolve.net — UI Research & Design Analysis

> Source: https://www.swiftsolve.net/
> Analyzed: 2026-09-09
> Stack: Next.js 15 / Turbopack / React / Tailwind CSS

---

## 1. Design System Tokens

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#000` | Page background |
| `--foreground` | `#f5f5f7` | Primary text (near-white) |
| `--muted` | `#6e6e73` | Secondary text (gray) |
| `--accent` / `--mint` | `#70ffd8` | Bright mint — primary accent |
| `--mint-light` | `#a8ffe8` | Lighter mint (gradient, wordmark) |
| `--teal` | `#2dd4bf` | Teal (secondary accent, gradients) |
| `--teal-deep` | `#14b8a6` | Deep teal |

### Surfaces

| Surface | Value | Usage |
|---|---|---|
| Base | `#000` / `#030303` | Default background |
| `.section-surface` | `#040404` | Slightly elevated sections (About, Services, Contact) |
| `.section-glow` | `#000` + radial gradients | Atmospheric glow sections (Portfolio, Trust) |

### Borders

All borders use **white at 6–15% opacity** — no hard colors:

- `border-white/[0.06]` — hairlines, dividers
- `border-white/[0.08]` — card borders, icon tiles
- `border-white/10` — eyebrow pills
- `border-white/15` — ghost buttons

### Typography

**Font**: Google Sans (variable, 400–700), locally loaded as woff2.

| Class | Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `.type-headline` | `clamp(1.875rem, 4.5vw, 2.75rem)` | 1.25 | semibold | tight | Section H2s |
| `.type-title` | `text-lg` (1.125rem) | 1.375 | semibold | — | Card titles |
| `.type-card-title` | `1.625rem` (26px) | 1.15 | semibold | tight | Portfolio cards |
| `.type-body` | `text-base` (1rem) | 1.625 | normal | — | Body paragraphs |
| `.type-card-lead` | `text-base` (1rem) | 1.65 | normal | — | Card lead text |
| `.type-card-body` | `text-sm` (0.875rem) | 1.75 | normal | — | Card body text |
| `.type-label` | `text-xs` (0.75rem) | default | medium | widest, UPPERCASE | Eyebrow labels |
| `.type-caption` | `text-sm` (0.875rem) | relaxed | normal | — | Buttons, captions |

### Radii

| Radius | Usage |
|---|---|
| `rounded-full` | Buttons, pills, chips, avatars |
| `rounded-xl` | Icon tiles |
| `rounded-2xl` | Feature cards, portfolio cards |

---

## 2. Layout Structure

### Page Skeleton

```
<body class="min-h-full antialiased bg-black text-foreground">
  <div class="bg-black">
    <nav>  fixed, inset-x-0 top-0 z-50, transparent  </nav>
    <section id="hero">      100dvh, snap-stop, overflow hidden  </section>
    <section id="problem">   100dvh snap section  </section>
    <section id="about">     snap + .section-surface (#040404)  </section>
    <section id="portfolio"> snap + .section-glow (radial glows)  </section>
    <section id="services">  snap + .section-surface  </section>
    <section id="process">   snap  </section>
    <section id="trust">     snap + .section-glow  </section>
    <section id="team">      snap  </section>
    <section id="contact">   snap + .section-surface  </section>
    <footer>  single line, border-t white/6  </footer>
  </div>
</body>
```

### Key Patterns

- **Full-viewport snap-scroll**: every section is `min-height: 100dvh` with `scroll-snap-align: start`
- **Section padding**: `px-4 py-14` mobile → `md:px-12 md:py-0` desktop (vertically centered)
- **Max-width**: `max-w-3xl` to `max-w-4xl` centered
- **Dividers**: `h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent`
- **Body**: `scroll-smooth` for anchor scrolling

---

## 3. Navigation

### Desktop Nav

- Fixed, transparent, never gets solid background
- **Logo**: "SwiftSolve" wordmark with animated gradient text (`logo-wordmark` class)
- **Menu** (hidden on mobile): horizontal list, `gap-8`
  - Links: About, Work, Services, Process, Team, Contact
  - Style: `type-caption text-muted hover:text-accent` (gray → mint on hover)
- **Mobile**: hamburger button (`lucide-menu`), 44px circle

### Scroll Indicator

- Hero bottom: "Scroll" pill with vertical gradient line
- No sidebar dot navigation

### CTAs

- Buttons link to `mailto:` (Cloudflare email protection)
- Label: "Book a 15-minute fit call"

---

## 4. Sections Detail

### Hero (`#hero`)

- **Eyebrow pill**: `type-label rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white/60 backdrop-blur-sm`
- **Animated giant gradient wordmark**: letter-by-letter reveal
- **H1**: "Build production AI software, not just demos."
- **Subcopy**: SwiftSolve description
- **2 CTAs**:
  1. White pill: `rounded-full bg-white text-black font-medium px-6 py-2.5 min-h-11 hover:bg-white/90`
  2. Ghost pill: `rounded-full border border-white/15 text-white/70 hover:border-white/30 hover:text-white`
- **Background**: animated aurora — 3 blurred curtains, 3 colored orbs, particle canvas, grid lines, noise overlay

### Problem (`#problem`)

- Label: "The challenge"
- H2: "AI demos are easy. Production AI products are not."
- Two paragraphs of body copy
- Pure text section, no cards

### About (`#about`)

- Label: "What we do"
- H2: "More than a prototype. Software your team can rely on."
- Two paragraphs
- **Infinite marquee** of skill chips (counter-scrolling, two rows)
- Chips: `inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-white/50`
- Skills: Computer Vision, LLM Systems, Agent Systems, Generative AI, NLP, Deep Learning, RAG Pipelines

### Portfolio (`#portfolio`)

- H2: "Selected work"
- **Carousel** with 2 case-study cards (prev/next buttons + 6 dot indicators)
- **Card anatomy**:
  - Header: icon tile (48×48, `rounded-xl`) + category label + card title
  - Lead paragraph
  - Outcome box: `border-left: 2px solid var(--card-accent)`
  - "What we delivered" list: 2-col grid with check icons
  - Tech tags: `rounded-full px-2.5 py-1 text-[0.6875rem]` with accent-colored border
- Card accents: `--card-accent` = `#6ee7b7` (green) / `#bef264` (lime)

### Services (`#services`)

- Label: "How we help"
- H2: "Engagements mapped to real buying needs"
- **5 pill chips** ("Common starting points") with glowing mint dot
- **6 service cards** in `grid grid-cols-1 lg:grid-cols-3`:
  1. AI Product Builds (bot icon)
  2. LLM, RAG & Agent Systems (brain-circuit)
  3. Computer Vision Products (scan-eye)
  4. AI Automation Platforms (workflow)
  5. Data & ML Infrastructure (database)
  6. Product UX for AI Systems (panels-top-left)

### Process (`#process`)

- Label: "How we work"
- H2: "From idea to production"
- **4 steps** in `grid grid-cols-1 sm:grid-cols-2 gap-8`:
  1. Target → Define (target icon)
  2. Flask → Build (flask-conical icon)
  3. Blocks → Validate (blocks icon)
  4. Rocket → Ship (rocket icon)

### Trust (`#trust`)

- Label: "Why teams choose us"
- H2: "Built for teams that need AI to work in the real world"
- **3 feature cards** in `grid grid-cols-1 md:grid-cols-3`:
  - activity, users, layers icons

### Team (`#team`)

- Label: "Who's behind SwiftSolve"
- H2: "A small team that ships production AI"
- **3 team cards** in `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3`:
  - Circular initials avatar (14×14, `rounded-full`, mint text)
  - Name, role (mint), bio
  - Social buttons (LinkedIn/GitHub as 36px icon pills)

### Contact (`#contact`)

- Label: "Contact"
- H2: "Have an AI product to build?"
- Two paragraphs
- **Primary CTA**: solid mint button — `rounded-full bg-accent text-black font-medium px-8 py-3.5 hover:brightness-110`
- Secondary: "Or email us directly at [email]"

### Footer

- Single line: `© 2026 SwiftSolve. All rights reserved.`
- `type-caption text-white/35`, `border-t border-white/[0.06]`

---

## 5. Component Patterns

### Buttons

| Variant | Styling |
|---|---|
| Solid white | `rounded-full bg-white text-black font-medium px-6 py-2.5 min-h-11 hover:bg-white/90` |
| Solid accent (mint) | `rounded-full bg-accent text-black font-medium px-8 py-3.5 hover:brightness-110` |
| Ghost | `rounded-full border border-white/15 text-white/70 hover:border-white/30 hover:text-white` |
| Icon circle | `flex h-11 w-11 rounded-full items-center justify-center hover:bg-white/5` |

### Pills / Chips

- Eyebrow label: `rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white/60 backdrop-blur-sm`
- Marquee chips: `rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-white/50` + 14px lucide icon
- Starting-point chips: same + glowing mint dot `bg-accent/80 shadow-[0_0_6px_rgba(112,255,216,0.35)]`
- Tech tags: `rounded-full px-2.5 py-1 text-[0.6875rem] text-white/50` with accent-colored border

### Cards

- **Feature cards**: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6`
- **Icon tiles**: `inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-accent`
- **Portfolio cards**: icon tile + outcome box (left accent border) + check-list + tech tags
- **Team cards**: circular initials + name/role/bio + social icon pills

### Icons

- **Lucide** (`lucide-react`), 1.5px stroke, `h-3.5 w-3.5` → `h-5 w-5`
- Brand icons (LinkedIn/GitHub): inline SVG with `fill="currentColor"`
- Full set: menu, scan-eye, brain-circuit, bot, sparkles, languages, network, file-search, workflow, database, boxes, cloud, cpu, gauge, code-xml, scan-text, file-text, layers, activity, chart-column, panels-top-left, mouse-pointer-2, wallet, check, scan-line, chevron-left/right, target, flask-conical, blocks, rocket, users, mail

---

## 6. Animations & Motion

### Hero

- **Letter-by-letter gradient wordmark reveal**: each letter in `overflow-hidden` span, stagger-revealed with `blur + translateY(120%) → in`
- **Logo gradient flow**: `background-size: 220% 220%` animated 8s
- **Aurora curtains**: 3 blurred gradient layers (`blur(60px)`), drifting 18–24s
- **Orbs**: 3 colored circles (`blur(100-120px)` at 8–18% opacity), pulsing 22–30s
- **Canvas particle field**: animated star/particle field
- **Grid overlay**: `linear-gradient(#fff 1px, transparent)` at 72px spacing with radial mask vignette
- **Noise overlay**: SVG `feTurbulence` at 4% opacity, 128px tiles

### Scroll Animations

- Every headline/paragraph/card **fades in** with:
  - `blur(8–14px)` → 0
  - `translateY(20–72px)` → 0
  - `scale(0.92–0.95)` → 1
  - Staggered timing

### Continuous

- Counter-scrolling marquee (two rows, opposite directions)
- `transition-ease-[cubic-bezier(0.22,1,0.36,1)]` (expo-out) throughout

---

## 7. Assets

- **Zero raster images** — entirely CSS-generated
- Aurora backgrounds (blurred gradients + orbs)
- Canvas particle field
- Gradient text via `background-clip`
- Inline SVG icons (Lucide + social logos)
- External: favicon.ico, Google Sans woff2 fonts

---

## 8. Overall Design Style

**"Dark ambient AI startup"** — premium, minimal, motion-rich.

- Dark-only: near-black surfaces, no light mode
- Mint/teal accent on black (Linear, Vercel, Cognition/Devin aesthetic)
- Full-viewport snap-scroll slideshow
- Heavy micro-animation throughout
- Low-contrast text hierarchy (whites at 35–70% opacity)
- Subtle hairline borders, no shadows, depth from glows and blur
- Generous whitespace, centered layout
- Stack: Tailwind v4 + shadcn/ui + framer-motion (likely)

---

## 9. Replication Cheat-Sheet

```css
:root {
  --background: #000;
  --foreground: #f5f5f7;
  --muted: #6e6e73;
  --accent: #70ffd8;
  --mint-light: #a8ffe8;
  --teal: #2dd4bf;
  --teal-deep: #14b8a6;
}
```

- Font: `"Google Sans", system-ui` variable 400–700
- Surfaces: `#000` / `#030303` / `#040404` with `white/[0.03–0.08]` borders
- Radii: `rounded-full` (buttons/chips) · `rounded-xl` (icon tiles) · `rounded-2xl` (cards)
- Border dividers: `via-white/[0.08]` gradients
- Marquee fade mask: `linear-gradient(90deg, transparent, black 26% 74%, transparent)`
- Portfolio accents: `--card-accent` = `#6ee7b7` / `#bef264`
