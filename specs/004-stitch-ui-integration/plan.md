# Implementation Plan: 004 — Stitch UI Design Integration

**Branch**: `004-stitch-ui-integration` | **Date**: 2026-07-07
**Source**: Google Stitch project "Modern Minimalist Portfolio" (ID: `3682285703719208167`)

## Summary

Integrate the layout patterns, visual language, and page structure from the Google Stitch-generated UI design into Mehdi's existing portfolio. The Stitch design (originally modeled for "QMCC Creative") provides three richly structured pages — **Home**, **About**, **Services** — with a light, minimalist aesthetic (black `#0A0A0A` + orange `#F58327`, Sora/Hanken Grotesk fonts). This plan adapts those UI patterns to Mehdi's personal brand while preserving the existing dark theme, 3D hero, and advanced motion infrastructure already built.

**Core approach**: Extract layout patterns and section designs from Stitch (not brand copy), re-theme them to the existing dark/blue aesthetic, and fill sections with real data from Mehdi's API (profile, projects, skills, testimonials). Add a **Services** page that was missing.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18.3, Next.js 14.2 (App Router)
**Built on top of**: Existing `002-portfolio-redesign` (3D hero + editorial body) — all existing components, animations, hooks, and infrastructure remain untouched unless explicitly listed.
**Data source**: Backend API at `NEXT_PUBLIC_BACKEND_URL` (unchanged)
**Design source**: Google Stitch project — 3 generated HTML screens (Home, About, Services)

## What Exists (no change)
- 3D particle shader hero (`components/hero/`)
- Motion components (page transitions, custom cursor, magnetic button, tilt card, marquee, command palette, smooth scroll)
- Chat orb + chatbot sheet + RAG backend
- Header / Footer layout (rewritten in 002)
- All admin CRUD pages (untouched)
- Page-specific components (about-strip, featured-project, projects-bento, skills-cluster, testimonials-marquee, contact-cta)
- Project detail sticky-scroll case studies
- Contact form with Cal.com embed
- Supabase auth middleware

## What the Stitch Design Brings (new patterns to implement)

| Stitch Pattern | Current Portfolio Equivalent | Gap |
|---|---|---|
| Hero: large display headline + subtitle + CTAs + trust strip | 3D particle hero (already exists) | Hero content layout can be refreshed to match Stitch's bold typographic hierarchy |
| Stats counters (15+ years, 200+ projects, 150+ clients, 160 reviews) | No stats section exists | **New**: Add animated counter strip to homepage |
| Testimonials with star ratings + author cards | `TestimonialsMarquee` exists but is simple text scroll | Add star ratings, author images, richer card layout |
| "Why Choose Us" feature cards (3 columns with icons) | No equivalent section | **New**: Value proposition cards section for homepage |
| Services grid (6 service cards with icons + descriptions + CTA) | No Services page at all | **New**: Full Services page |
| Service highlight / deep-dive section | No equivalent | **New**: Featured service highlight on Services page |
| Process/methodology (numbered steps: 01-05) | No process section on About | **New**: Process steps on About page |
| Detailed footer (Services column, Company column, Contact/Office info) | Footer exists but is minimal (3 columns: Nav, Connect, Colophon) | Expand footer with richer structure |
| Navigation with brand wordmark + full menu + CTA | Header exists but is minimal | Refresh header layout to match Stitch's more prominent nav style |
| Light mode color scheme (black/white/orange) | Dark mode (dark/blue) | **Keep dark mode** but adopt Stitch's layout patterns |

## Phase Overview

```
Phase 0: Foundation — design tokens, spec write-up, route planning
Phase 1: Homepage sections — stats counters, why-choose-us, testimonial cards
Phase 2: About page refresh — process steps, richer layout
Phase 3: New Services page — service cards grid, highlight section, process
Phase 4: Persistent UI — header/footer refresh
Phase 5: Polish — responsive QA, accessibility, Lighthouse
```

## Design Token Principles

- **Keep existing dark theme colors** (`background: #0a0a0b`, `foreground: #f5f5f4`, `primary: #3b82f6`)
- **Add orange accent** from Stitch (`#F58327`) as a secondary accent color for hover states, active indicators, and CTAs
- **Keep existing fonts** (Inter body, Space Grotesk display) — do NOT switch to Sora/Hanken Grotesk as that would bloat font loading
- **Adopt Stitch's spacing philosophy**: generous whitespace, 120px section gaps, max-width container 1280px
- **Adopt Stitch's card/container style**: thin 1px borders, subtle background shifts for elevation (no shadows)

## Design Tokens (Tailwind additions)

```js
// additions to existing tailwind.config.js
colors: {
  // Keep all existing colors, add:
  'accent-orange': '#f58327',
  'accent-orange-hover': '#e0701a',
}
```

## Route Changes

| Route | Action | Details |
|---|---|---|
| `/` | **Rewrite homepage sections** | Add stats strip, why-choose-us cards, richer testimonial cards. Keep existing hero, about strip, featured project, projects bento, skills cluster. Reorder sections to match Stitch hierarchy. |
| `/about` | **Enhance** | Add process/methodology numbered steps (05). Keep existing timeline + skills cluster. |
| `/services` | **NEW** | Create from scratch with: service grid (6 cards), service highlight section, process steps, stats strip, CTA section. |
| `/contact` | Untouched | Already has form + Cal.com embed |
| `/projects` | Untouched | Already has bento grid + filter |
| `/certifications` | Untouched | Card grid |
| `/admin/*` | Untouched | |

## Component Tree

### Homepage (`/`) — new section order

```text
app/page.tsx (server, async)
├── <HeroSection />                    ← UNCHANGED (existing 3D particle hero)
├── <TrustStrip />                     ← UNCHANGED (existing trust indicators)
├── <AboutStrip />                     ← UNCHANGED (existing editorial sentence)
├── <StatsStrip />                     ← NEW | animated counters: experience, projects, clients, reviews
├── <WhyChooseUs />                    ← NEW | 3 feature cards (icons: verified, architecture, groups)
├── <FeaturedProject />                ← UNCHANGED (existing featured project card)
├── <ProjectsBento />                  ← UNCHANGED (existing bento grid)
├── <SkillsCluster />                  ← UNCHANGED (existing floating chips)
├── <TestimonialsMarquee />            ← ENHANCED | richer cards with stars, author images
├── <ProcessSteps />                   ← NEW | 3-step "How It Works" section
├── <ContactCta />                     ← ENHANCED | match Stitch's bold editorial closer style
```

### About Page (`/about`) — enhanced

```text
app/about/page.tsx (server, async)
├── Hero section (existing)            ← ENHANCED | bolder headline layout (Stitch "Redefining the Digital Narrative")
├── Stats strip                        ← NEW | reuse StatsStrip component
├── Bio section (existing)             ← UNCHANGED
├── ProcessSteps (5 steps)             ← NEW | numbered steps 01-05 from Stitch
├── Timeline (existing)                ← UNCHANGED
├── SkillsCluster (existing)           ← UNCHANGED
├── ContactCta (existing)              ← UNCHANGED
```

### Services Page (`/services`) — NEW

```text
app/services/page.tsx (server, async)
├── <ServicesHero />                   ← NEW | headline + subtitle + stats
├── <ServiceGrid />                    ← NEW | 6 service cards (icon + title + desc + CTA)
│   ├── Web Development
│   ├── AI/ML/GenAI
│   ├── UI/UX Design
│   ├── Cloud Engineering
│   ├── E-commerce
│   └── Mobile App Development
├── <ServiceHighlight />               ← NEW | featured deep-dive (e.g., "Headless E-commerce")
├── <ProcessSteps />                   ← NEW | 3-step "How It Works" (reuse from homepage)
├── <StatsStrip />                     ← NEW | reuse stats component
├── <ServicesCta />                    ← NEW | bold CTA section
```

### Persistent UI

```text
components/layout/
├── header.tsx                         ← ENHANCED | add Services nav link, style CTA button with orange accent
├── footer.tsx                         ← ENHANCED | expand to 4 columns: Navigation, Services, Connect, Colophon/Office
```

## New Components to Create

| Component | File | Data Source | Description |
|---|---|---|---|
| `<StatsStrip />` | `components/sections/stats-strip.tsx` | Static config or API | Animated counter strip: years, projects, clients, reviews |
| `<WhyChooseUs />` | `components/sections/why-choose-us.tsx` | Static content | 3 value prop cards with icons |
| `<ProcessSteps />` | `components/sections/process-steps.tsx` | Static content | Numbered step cards (3 or 5 steps) |
| `<ServicesHero />` | `components/sections/services-hero.tsx` | Static content | Hero for services page |
| `<ServiceGrid />` | `components/sections/service-grid.tsx` | Static content | 6 service cards with icons |
| `<ServiceHighlight />` | `components/sections/service-highlight.tsx` | Static content | Featured service deep-dive |
| `<ServicesCta />` | `components/sections/services-cta.tsx` | Static content | CTA for services page |

## Existing Components to Enhance

| Component | Enhancement |
|---|---|
| `<TestimonialsMarquee />` | Add star ratings from testimonial data, author images/avatars, richer card design with quotes |
| `<ContactCta />` | Bolder typography, larger CTA button, match Stitch's "Ready to Scale Your Vision?" layout |
| `<Header />` | Add "Services" nav link, update CTA button style with orange accent |
| `<Footer />` | Expand to 4-column layout: Navigation, Services, Connect, Colophon |
| `<AboutStrip />` | Enhance to match Stitch's editorial heading style |

## Implementation Phases

### Phase 1: Homepage Sections
1. Create `<StatsStrip />` — animated counters with `motion` (count up on scroll into view)
2. Create `<WhyChooseUs />` — 3 feature cards with icons (reuse existing `Card` shadcn component)
3. Enhance `<TestimonialsMarquee />` — add star ratings, author images, richer card layout
4. Reorder homepage sections and integrate new components into `app/page.tsx`

### Phase 2: About Page
1. Refine hero/heading layout to match Stitch's bold "Redefining the Digital Narrative" style
2. Create `<ProcessSteps />` — 05 numbered steps from Stitch's About page
3. Add stats strip to About page

### Phase 3: Services Page (NEW)
1. Create `app/services/page.tsx` (server component)
2. Create `<ServicesHero />` — big headline + subtitle + stats
3. Create `<ServiceGrid />` — 6 service cards with descriptions
4. Create `<ServiceHighlight />` — featured deep-dive section
5. Add process steps + stats + CTA
6. Register route in header, footer, sitemap

### Phase 4: Persistent UI
1. Update `<Header />` — add "Services" nav link, orange accent CTA
2. Update `<Footer />` — expand to richer 4-column layout

### Phase 5: Polish & QA
1. Responsive testing on all screen sizes
2. Verify all existing tests pass
3. Lighthouse audit (target: ≥90 Performance, ≥95 A11y)
4. Keyboard navigation + screen reader pass
5. `npm run lint` + `npm run typecheck` pass

## Data Model

- No new database tables needed
- All data for new sections is **static content** hardcoded in components (service descriptions, process steps, value propositions)
- Stats are static (updateable via component props)
- Testimonials continue to come from the API (`api.getTestimonials()`) — just displayed in enhanced card format

## Risks & Mitigations

1. **Visual inconsistency** — Stitch design is light mode; existing site is dark mode. Mitigation: adapt layout patterns and spacing, not colors. Use existing dark theme with orange accent addition.
2. **Stitch design is for a different brand** (QMCC Creative vs Mehdi's personal portfolio). Mitigation: extract layout patterns only; write original copy for Mehdi's brand voice.
3. **Content gaps** — Services page needs descriptions, icons, and detail content. Mitigation: use placeholder content inspired by Stitch's structure but personalized.

## ADR Candidates

📋 Architectural decision detected: **Stitch UI integration approach** — extracting layout patterns rather than copying generated HTML directly, maintaining existing dark theme with orange accent addition rather than full theme switch. Multi-option (copy HTML directly vs extract patterns), cross-cutting (affects all pages), long-term impact. Document reasoning and tradeoffs? Run `/sp.adr stitch-ui-integration-strategy`
