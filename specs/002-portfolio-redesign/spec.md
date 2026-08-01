# Spec — 002 · Portfolio Redesign (3D Hero + Editorial Body)

**Status:** Draft (pending user sign-off before /sp.plan)
**Owner:** Mehdi Abbas Nathani
**Branch (target):** `002-portfolio-redesign` (to be cut from `main` after PR #1 merges; or off current HEAD if user wants to start sooner)
**Supersedes (visually):** the visual layer of `001-portfolio-platform`. **Backend, schema, RAG, auth, admin are unchanged.**

---

## 1. Why this exists

The site at `001-portfolio-platform` is functionally complete (RAG chatbot, projects, testimonials, contact, admin, auth) but the **visual layer does not signal craft**. For a portfolio whose product is *the engineer behind it*, that's the only thing that matters in the first 8 seconds. This spec redesigns the public-facing surface to land that first impression and convert visitors to a single CTA.

**Non-goals:** rewriting the backend, changing the data model, changing the routes, redesigning the admin area (admin stays as-is — it's internal), adding new content types.

## 2. Locked decisions (from brainstorm 0027)

| Decision | Value | Source |
|---|---|---|
| Direction | **C — 3D Hero + 2D Body** | User pick |
| Audience | Mixed — recruiters + clients | User pick |
| Primary CTA | **Book an intro call** (Cal.com / Calendly) | User pick |
| Secondary CTAs | "Chat with my AI" (chat orb), "View projects" | Derived |
| Hero element | **Mouse-reactive particle field** (point cloud, R3F) | User pick |
| Color mood | Deep dark + single accent | User pick |
| Accent | Electric blue `#3b82f6` | User pick |
| Background | `#0a0a0b` | Derived |
| Foreground text | `#f5f5f4` | Derived |
| Projects layout | **Bento grid** (1 large + 4–6 smaller, tilt-on-hover, image reveal) | User pick |
| Motion budget | **Lean** — 3D hero only; mobile gets 2D fallback | User pick |
| Performance target | JS ≤ 300KB first paint, LCP ≤ 2s on Slow 4G (375×667 throttled) | Derived from "Lean" |

These are **frozen** for this spec. Changing any of them invalidates downstream sections; we re-spec, not patch.

## 3. Information architecture (routes are unchanged)

| Route | Status | Visual treatment |
|---|---|---|
| `/` | Heavily redesigned | Hero (3D), about strip, featured project, projects bento, testimonials marquee, contact CTA |
| `/projects` | Redesigned | Full bento + filter chips + search |
| `/projects/[slug]` | Redesigned | Sticky-scroll case-study layout (one project = one story) |
| `/about` | Redesigned | Long-form editorial, timeline, skill cluster |
| `/experience` | Merged into `/about` timeline OR kept as standalone — **decision deferred to /sp.plan** |
| `/skills` | Merged into `/about` skill cluster OR kept — **decision deferred to /sp.plan** |
| `/certifications` | Kept, minor restyle | Card grid, no major motion |
| `/contact` | Redesigned | Single hero panel with form + Cal.com inline embed |
| `/admin/*` | **Untouched** | Out of scope |

## 4. Tech stack additions (precise versions to be pinned in /sp.plan)

| Package | Why | Approx. size (gz) |
|---|---|---|
| `motion` (rebrand of framer-motion) | Page transitions, scroll triggers, layout shared elements, gesture | ~35 KB |
| `three` | WebGL primitives | ~150 KB (lazy-loaded, hero only) |
| `@react-three/fiber` | Declarative R3F | ~25 KB |
| `@react-three/drei` | Helpers — only `<Points />`, `<PerspectiveCamera />`, `<AdaptiveDpr />` imported | tree-shaken to ~10 KB |
| `lenis` | Smooth scroll | ~8 KB |
| `@use-gesture/react` | Mouse/touch gestures for magnetic buttons + tilt cards | ~10 KB |
| `cmdk` | ⌘K command palette (nav + theme + chat shortcut) | ~6 KB |
| `lucide-react` | Icons (tree-shaken per icon) | ~1 KB per used icon |
| `shiki` (optional, /projects/[slug] only) | Code block syntax highlighting in case studies | lazy ~30 KB |
| `next/font` (Inter Display + JetBrains Mono) | Variable display font + monospace | n/a (self-hosted) |

**Removed/avoided:**
- `gsap` — covered by `motion` + scroll triggers; not worth the bundle.
- `@react-three/postprocessing` — not needed for "Lean" budget.
- Sound libraries — explicit non-goal.
- Any heavy UI kit (Material, Chakra) — Tailwind + shadcn primitives only.

**Skill packs to vendor (alongside existing Supabase skills):**
- `motion` (framer-motion v12 docs)
- `react-three-fiber` (R3F + drei)
- `tailwind` (if not already on registry)
- `shadcn` (component install + theming)

**MCP servers to wire up before implementation:**
- **Playwright MCP** — *blocking dependency*. Agent must be able to screenshot and interact with the dev server to iterate on visuals. Without this, design iteration is blind.
- **Image-gen MCP** (Replicate or fal) — *optional but useful* for placeholder hero textures, OG cards, project thumbnails until real assets exist.

## 5. Motion budget & accessibility contract

These are **hard ceilings**, enforced in CI via Lighthouse + bundle-analyzer:

| Metric | Budget |
|---|---|
| JS first-paint (mobile) | ≤ 300 KB compressed |
| LCP (Slow 4G, Moto G4 throttle) | ≤ 2.0 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| Total page weight (mobile, no-cache) | ≤ 1.2 MB |
| 3D hero loads | **lazy** (`next/dynamic` with `ssr: false`), starts after hero text/CTA paint |

**Accessibility contract (non-negotiable):**
- `prefers-reduced-motion: reduce` → particle hero swaps to a static poster image; magnetic/tilt/parallax disabled; page transitions collapse to instant.
- 3D canvas always has a semantic HTML `<h1>`/`<p>`/`<a>` *underneath* it (positioned above in DOM, behind in z-index). SEO and screen readers see real content.
- All interactive elements keyboard reachable; `:focus-visible` rings use the accent color at ≥3:1 contrast.
- Color contrast: body text 7:1, UI 4.5:1. Accent on dark bg: verified ≥4.5:1.
- Custom cursor: only adds visual layer, **never replaces** the native cursor as the source of truth (so keyboard/touch users are unaffected).

**Mobile fallback strategy:**
- Width < 768 OR `(prefers-reduced-motion)` OR `navigator.hardwareConcurrency < 4`: hero serves a pre-rendered WebP poster of the particle field + CSS gradient + animated SVG noise. No Three.js shipped.
- Tilt-on-hover → no-op on touch.
- Custom cursor → no-op on touch.

## 6. Section-by-section behavior (homepage)

### 6.1 Hero (full viewport, 100vh)
**Visual:** Particle point cloud (~3000–5000 points) suspended in dark space. Mouse position drives a force field — points within ~300px of cursor flow toward / away in a fluid ripple. On scroll, camera dollies inward and particles re-form into a tighter cluster behind the type. Lazy-loaded; first paint shows the H1 + CTA, then particles fade in over ~600ms once R3F mounts.

**Layout:**
- H1 (60–96px clamp): "AI engineer. Shipping intelligent products."  *(copy is placeholder — to confirm with user)*
- Sub (18px): one sentence on positioning.
- Primary CTA: `Book a call →` (filled, electric blue, magnetic).
- Secondary CTA: `Chat with my AI ⌘K` (ghost button, opens chat orb).
- Trust strip below the fold: 4–6 logos of companies/products/clients (greyscale, hover → color).

**Motion:**
- Custom cursor (12px disc, blends with content under it).
- CTA magnetic radius: 40px.
- Word-by-word reveal on H1 (`motion.span` with `staggerChildren`).
- Particle force field: shader-based, runs on GPU, capped at 60fps with `<AdaptiveDpr />`.

### 6.2 About strip (50vh)
**Visual:** Single sentence in large editorial type with a small portrait/avatar on the left. Hover the portrait → subtle tilt-on-mouse.

### 6.3 Featured project (75vh)
**Visual:** One large hero card for the pinned project. Background is a video loop OR animated screenshot (lazy, autoplay, muted, loops). Tilt on hover; on click, the card expands into `/projects/[slug]` using shared-layout transition (`layoutId`).

### 6.4 Projects bento (auto height)
**Layout:** As confirmed:
```
┌─────────────────┬──────────┐
│                 │          │
│   FEATURED      │  proj 2  │
│   (or 2nd big)  ├──────────┤
│                 │          │
│                 │  proj 3  │
├─────────┬───────┴──────────┤
│ proj 4  │  proj 5  │ proj6 │
└─────────┴──────────┴───────┘
```
**Motion:**
- Cards tilt ±5° max on cursor proximity.
- Image fades in on hover (sharp WebP, blur-up placeholder).
- Click → shared-layout expansion to detail page.

### 6.5 Skills cluster (auto height)
**Visual:** Skills as floating chips arranged in a soft cluster. On hover, related chips glow with the accent; unrelated dim. Optional: chips have a tiny physics jiggle when the page scrolls past them.

### 6.6 Testimonials marquee (40vh)
**Visual:** Horizontal infinite scroll of testimonial cards (real quotes, names, roles). Pauses on hover. Two rows scrolling opposite directions.

### 6.7 Contact CTA (60vh)
**Visual:** Big editorial closer. "Let's build something." + Cal.com inline embed OR a large `Book a call →` button. Form is on `/contact`.

### 6.8 Footer (auto)
Minimal. Three columns: links, socials, "made with [tools]". A small typographic flourish — your name as a tight wordmark.

## 7. Persistent UI

- **Custom cursor** (desktop only, prefers-reduced-motion respected). Default: 12px disc, blend-mode difference. Over interactive: scales to 32px ring. Over media: shows "view" / "play" label.
- **Header**: minimal, sticky, blurs background on scroll. Logo (wordmark) + 3 nav items + Cal.com CTA + ⌘K hint.
- **⌘K command palette**: nav, "Open chat", "Toggle reduced motion", "Copy email", "Book a call". Always available.
- **Chat orb**: floating bottom-right, soft glass effect, gentle idle pulse. Click → expands to side sheet with the existing chat UI (unchanged backend).

## 8. Page transitions

- Route changes use `motion`'s `AnimatePresence` + a wrapper layout. Default: 180ms fade + 8px Y slide.
- Project card → project detail: shared `layoutId` for the card surface; image and title smoothly morph into the detail hero. ~400ms.
- Reduced motion: all transitions collapse to instant.

## 9. Component migration plan

Map of current → redesigned (full plan happens in /sp.plan; this is the rough surface):

| Current file | Action |
|---|---|
| `components/layout/header.tsx` | Rewrite — glass blur, ⌘K hint, Cal.com CTA |
| `components/layout/footer.tsx` | Rewrite — minimal editorial |
| `components/sections/hero.tsx` | **Replaced** by new `components/hero/` (3D canvas + 2D overlay) |
| `components/sections/project-card.tsx` | Rewrite — tilt + shared-layout |
| `components/sections/skill-badge.tsx` | Rewrite — chip with hover glow |
| `components/sections/timeline-item.tsx` | Restyled, no structural change |
| `components/sections/contact-form.tsx` | Restyled (inputs + button), schema unchanged |
| `components/chatbot/*` | **Untouched logic.** Wrap in new "orb → sheet" container. |
| `components/ui/*` (Button, Card, Input, …) | Replaced by shadcn-based equivalents themed to our tokens. Old files deleted after migration. |
| `components/admin/*` | **Untouched.** |
| `app/globals.css` | Rewrite — new tokens, fonts, reset |
| `tailwind.config.js` | Rewrite — color tokens, font families, animation keyframes |

New folders:
- `components/hero/` (R3F canvas + shaders + 2D fallback)
- `components/motion/` (reusable wrappers: `<RevealText />`, `<MagneticButton />`, `<TiltCard />`, `<Marquee />`, `<CommandPalette />`, `<CustomCursor />`)
- `components/chat/orb.tsx` (replaces the current widget shell, reuses inner messages/input)

## 10. Acceptance criteria

A redesign is "done" when ALL of these are true on the deployed preview URL:

- [ ] Lighthouse mobile (Slow 4G, Moto G4 throttle): Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] First-paint JS ≤ 300 KB gz (verified via `next build` analyze)
- [ ] LCP ≤ 2.0s on the throttled mobile profile
- [ ] CLS ≤ 0.05
- [ ] Hero renders semantic H1 + CTA before R3F mounts (verified by disabling JS)
- [ ] `prefers-reduced-motion: reduce` → no particles, no tilt, no magnetic, instant transitions (manually verified)
- [ ] All interactive elements reachable + operable by keyboard alone (manual tab-walk)
- [ ] Screen reader reads hero copy and primary CTA before any decorative content (NVDA or VoiceOver pass)
- [ ] Mobile (real device, 4G): hero loads <2s, no 3D shipped, scroll is buttery (no jank > 50ms)
- [ ] Cal.com CTA opens working booking flow
- [ ] Chat orb opens, sends a message, receives a RAG reply (existing backend unchanged)
- [ ] Bento → detail shared-layout transition lands smoothly (no flash)
- [ ] All Playwright E2E tests from 001 still pass against the new UI

## 11. What's NOT in scope (so we don't drift)

- Sound design
- Internationalization
- Dark/light theme toggle (we ship dark only — light mode is a separate spec)
- Blog / writing surface (out of scope; spec separately if needed)
- Admin panel restyle
- Backend changes of any kind
- Replacing the chat backend or RAG pipeline
- A new CMS

## 12. Open questions (need user answer before /sp.plan)

1. **Hero copy.** Placeholder is "AI engineer. Shipping intelligent products." — replace with your actual one-liner? (3–7 words, declarative, no buzzwords.)
2. **Sub-copy.** One sentence positioning. Suggested template: "I help [audience] [outcome] with [your edge]." Draft yours.
3. **Cal.com vs Calendly vs Savvycal?** Pick one — we'll embed it inline on `/contact` and link it from the hero.
4. **`/experience` and `/skills`** — keep as standalone routes or absorb into `/about`? (My lean: absorb. Fewer pages = stronger story.)
5. **Featured project** — which existing project gets the "pinned" featured slot? (Look at your DB, name one.)
6. **Trust strip logos** — do you have permission/assets for the company logos under the hero? If no, we omit the strip and replace with a single line of role/credentials.
7. **Avatar/portrait** — real photo, illustrated avatar, or just a typographic mark? (No headshot is fine if we go full typographic.)

## 13. Risks (top 3)

1. **R3F + shader work expands.** Particle hero looks deceptively simple. Budget 2–3 days of iteration to land it. Mitigation: prototype hero in isolation on `/preview/hero` first; if it doesn't feel right in 2 days, pivot to a simpler hero (rotating glass shard) without redoing the rest.
2. **Performance budget creep.** Every "small" library adds up. Mitigation: bundle-analyzer in CI, hard fail PRs that push first-paint JS over 300KB.
3. **Animation polish gap.** Janky animations look worse than no animations. Mitigation: every motion component reviewed at 60fps on a mid-range Android via Playwright MCP screenshots/video before merging.

## 14. Next steps after sign-off

1. User answers §12 open questions (especially copy + Cal.com choice + featured project).
2. Wire up Playwright MCP (blocking).
3. Vendor `motion`, `r3f`, `shadcn` skill packs.
4. Run `/sp.plan` → emits `plan.md` with: route-by-route component tree, exact shadcn install commands, design tokens (Tailwind config), font setup, package versions pinned.
5. Surface ADR for animation stack (`motion` chosen over `gsap`, `r3f` chosen over vanilla three) — significant + multi-option + cross-cutting → ADR-worthy.
6. Cut branch `002-portfolio-redesign` (probably off `main` after PR #1 lands; or off `001-portfolio-platform` if user wants to start now).
7. `/sp.tasks` → testable task list, vertical slices (hero first, then bento, then transitions, then chat orb).
