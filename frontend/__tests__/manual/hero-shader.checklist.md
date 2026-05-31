# Manual Smoke Test — Hero Shader (US7)

Run these checks before signing off on Phase 9.

## Prerequisites
- [ ] Local backend running (`npm run dev` in both `backend/` and `frontend/`)
- [ ] `NEXT_PUBLIC_HERO_SHADER` not set (defaults to `true`)

## Test Scenarios

### 1. Default shader path
- [ ] Visit `/` on desktop Chrome (≥768px, DPR ≥1)
- [ ] `<canvas>` element is present inside hero section
- [ ] Curl-noise flowfield renders (electric blue animated pattern)
- [ ] Scroll down one viewport — text morphs through "AI" → "PRODUCT" → "MEHDI"
- [ ] Move mouse — flowfield deflects subtly around cursor
- [ ] H1 + CTA text is readable above the canvas (canvas has `aria-hidden="true"`)

### 2. Reduced motion
- [ ] Enable `prefers-reduced-motion: reduce` in DevTools Rendering tab
- [ ] Reload `/` — shader canvas still renders but animation is frozen
- [ ] SDF text stays at "AI" (progress=0)
- [ ] No tilt, magnetic, parallax, or reveal animations active anywhere on page

### 3. Mobile/touch fallback
- [ ] Resize viewport to ≤767px OR enable touch emulation
- [ ] No shader `<canvas>` present (confirm via Elements panel)
- [ ] `<HeroFallback>` renders animated CSS gradient background
- [ ] Gradient animates continuously (check for `background-position` changes)
- [ ] Enable `prefers-reduced-motion: reduce` on mobile — gradient freezes

### 4. Feature flag — revert to legacy
- [ ] Set `NEXT_PUBLIC_HERO_SHADER=false` in `.env.local`
- [ ] Restart dev server
- [ ] Reload `/` — legacy `ParticleField` renders instead of shader
- [ ] Particle field matches pre-shader behavior (4000-point cloud)
- [ ] Restore env var (or delete it) and restart

### 5. Low-CPU/touch device gate
- [ ] In DevTools, throttle CPU to 4x
- [ ] Reload `/` — verify `useCanRender3D()` path still works
- [ ] If `hardwareConcurrency < 4` OR touch — fallback gradient renders

### 6. Performance
- [ ] DevTools Performance panel: shader compile < 15ms
- [ ] First frame paints within 50ms of `<Canvas>` mount
- [ ] Steady-state FPS ≥ 55 with mouse moving (DPR 1.5, 4x CPU throttle)
- [ ] No long tasks (>50ms) on hero idle — check Performance panel

### 7. Accessibility
- [ ] Keyboard tab through hero — focus order: skip-to-content → H1 → CTA buttons
- [ ] Screen reader reads hero semantic content before canvas
- [ ] `<canvas>` element has `aria-hidden="true"` and `role="presentation"`
- [ ] Reduced-motion-frozen shader does NOT announce as animated

## Sign-off
All checks pass: [ ] YES / [ ] NO (note failures below)

## Notes
