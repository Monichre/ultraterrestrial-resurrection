# Home Animation Sequence Documentation

## Overview

The home page is a two-act cinematic experience: an autorun intro resolves into a composed hero, then a scroll-scrubbed 3D journey carries the viewer from Earth orbit past the Moon to the archive CTA.

**Implementation:** `HomeAnimated` (`home-animated.tsx`) + `useUltraterrestrialAnimation`
**Timing constants:** `CINEMATIC_TIMING` (Act 1, seconds) and `JOURNEY_TIMING` (Act 2, timeline units) in the hook — must match this document.
**Typography:** `HeroTypography.tsx` (structure only; all motion is GSAP-driven from the hook)
**Camera choreography:** `journeyProgress` ref → `EarthJourneyRig` / `MoonJourneyRig` (stops via `lib/animations/scroll-journey.ts`)

---

## ACT 1 — Intro Cinematic (autorun, ~0–10s)

Scroll stays locked (`body overflow hidden`) until Act 1 completes. Any wheel/touch intent during the intro fast-forwards it to the composed hero (`intro.progress(1)`).

### Phase 0: Initial Setup (0s)

- All layers hidden (`.hero-layer` gated by `data-home-ready`)
- Wordmark chars parked in masks (`yPercent: 118`, `rotateX: -42`), tagline/quote lines masked, author blurred
- Flash overlay created

### Phase 1: Quick Flashes (0–0.5s)

- 5 rapid flash pulses (0.09s each) — anticipation beat

### Phase 2: Fluid Shader Orbs (0.4–3.6s)

- Orbs visible during scene assembly; self-fades over 0.8s on release (`showFluidOrbs`)

### Phase 3: Big Flash Transition (3.8–5.3s)

- Flash snaps in at 3.8s (0.18s), expands + fades (scale 3x, 1.3s)

### Phase 4: Background Elements (4.0–4.1s)

- Stars fade in (4.0s, 0.9s)
- Shooting stars appear (4.1s, 0.8s)

### Phase 5: Celestial Bodies (4.2–7.8s)

- **Prometheus** fades in ethereally (4.2s, 2.2s → opacity 0.85)
- **Earth** reveals (4.2s, 1.6s)
- **Moon** orbits in from behind left shoulder (5.4s, 2.4s, `cosmic` ease)
  - Lands at x: 25vw, y: -15vh, scale 0.6, blur 50→0
- Earth floats continuously *inside* its R3F scene (`useEarthIdleMotion`) — the old wrapper float tween was removed to avoid fighting the journey scrub

### Phase 6: Typography (5.8–9.7s)

- **Wordmark** (5.8s): per-char masked rise — `yPercent 118→0`, `rotateX -42→0`, 1.1s, `power4.out`, 0.038 stagger; wordmark letter-spacing eases 0.62em→0.35em with blur 7→0 over 1.6s
- **Tagline** (6.9s): single masked line rise + blur clear (0.9s)
- **Quote** (7.1s): SplitType lines wrapped in `.hero-line-mask`, rise `yPercent 112→0` + blur 6→0, 0.85s, 0.085 stagger
- **Author** (8.9s): blur fade + rise (0.8s)

### Phase 7: Chrome (9.2–10s)

- **Navigation** slides down (9.2s, 0.9s, staggered)
- **Scroll cue** fades in (9.4s) — mono "SCROLL" + drifting line
- Intro `onComplete`: scroll unlocks, `introComplete` set

---

## ACT 2 — Scroll Journey (scrubbed, 380vh track)

The stage is `sticky top-0` inside a 380vh track; a ScrollTrigger (`start: top top`, `end: bottom bottom`, `scrub: 1`) drives the journey timeline (10 units) and writes `journeyProgress.current ∈ [0,1]` for the R3F camera rigs.

### J1 — Departure (0–2.2)

- Wordmark chars exit up through their masks (`yPercent → -118`, blur 10px, 0.03 stagger) — mirrored path of the entrance
- Tagline / quote lines / author exit upward through the same masks (blur + rise)
- Scroll cue fades (0–0.4)
- Earth wrapper pushes in: scale 1→1.14, y →+4vh; **camera rig** dollies z 5→3.4
- Prometheus dims 0.85→0.3

### J2 — Lunar Flyby (2.2–6.2)

- **Z-swap**: moon layer 10→30 (opaque canvas must stack above Earth to pass in front; restored to 10 when scrubbed back)
- Moon sweeps x 25vw→0, y -15vh→0, scale 0.6→2.35 — owns the frame
- **Moon camera rig** pushes z 5→3.1, y -0.5→-0.15
- Earth recedes x →-22vw, y →+14vh, scale →0.8, opacity →0.45; camera eases back z →4.6
- Prometheus fades to 0; stars parallax y →-5vh, scale →1.06
- **Flyby caption** (2.8 in / 5.4 out): "LUNAR PROXIMITY" kicker + "WHAT THE FAR SIDE KEEPS" — masked line rise/scrub-out

### J3 — Arrival (6.2–10)

- Moon settles x →10vw, y →-4vh, scale →1.55; moon camera eases z →4.4
- Earth dims to 0.15, scale 0.7; camera pulls to z 7.2, y 1.1
- Stars drift to -8vh
- **Arrival block**: kicker "THE ARCHIVE IS OPEN" (6.9), line (7.5), CTA "Enter the Research Canvas" → `/research-canvas` (8.2, `pointer-events: auto` at 9.8)

---

## Component Hierarchy (Z-Index Layers)

```
z-[50] - Navigation (MenuTrigger chrome)
z-[47] - Scroll cue (Act 1 outro)
z-[46] - Arrival block + CTA (Act 2)
z-[45] - Flyby caption (Act 2)
z-[40] - Hero copy (wordmark / tagline / quote)
z-[30] - Moon (journey flyby only; z-[10] otherwise)
z-[20] - Earth
z-[10] - Moon (resting)
z-[5]  - Prometheus
z-[3]  - Fluid Shader Orbs (when visible)
z-[2]  - Shooting Stars
z-[1]  - Stars Background
```

## Animation States

- `isReady`: 3D canvases detected (or 6s fallback → `staticMode`)
- `introComplete`: Act 1 resolved, viewport unlocked
- `staticMode`: reduced-motion or forced reveal — single 100vh composed hero, no track/scrub, inline CTA
- `navVisible`: gates global MenuTrigger chrome via `data-home-cinematic`
- `journeyProgress`: `{current: 0..1}` — shared ref read by Earth/Moon camera rigs

## Keyboard Shortcuts (Dev Mode Only)

- **Space**: Pause intro
- **Enter**: Resume intro
- **R**: Restart intro (re-locks viewport, scrolls to top)
- **S**: Skip to composed hero

## Key Features

### Masked Typography

- Wordmark chars and copy lines live in `overflow: hidden` masks (`.hero-char-mask`, `.hero-line-mask`)
- Entrances rise from below; exits depart upward through the same masks (spatial consistency)
- Quote lines are produced by SplitType at timeline build; reverted on cleanup

### Camera Rigs

- `journeyProgress` is written by the ScrollTrigger `onUpdate` and sampled per-frame via `sampleStops` (smoothstep keyframes) with frame-rate independent damping
- Rigs are opt-in via the `journeyRef` prop — all other Moon/Earth consumers are unaffected

### Interruptibility

- Scroll intent during Act 1 fast-forwards the intro instead of being swallowed by the scroll lock
- Act 2 is fully scrubbed and reversible at any point

## Performance Optimizations

1. **Dynamic Imports**: Heavy 3D components loaded on-demand
2. **SSR Disabled**: 3D components skip server rendering
3. **Transform/opacity only**: journey scrubs never touch layout properties
4. **Dev-Only Features**: Keyboard shortcuts only in development
5. **Reduced motion**: `prefers-reduced-motion: reduce` renders the static composed hero with inline CTA

## Customization Points

### Timing Adjustments

Edit `CINEMATIC_TIMING` / `JOURNEY_TIMING` in `useUltraterrestrialAnimation.tsx` — keep this doc in sync.

### Camera Moves

Edit `EARTH_CAM_Z/Y` in `components/earth/Earth.tsx` and `MOON_CAM_Z/Y` in `components/moon/Moon.tsx` (progress, value) stop pairs.

### Track Length

`h-[380vh]` on the track wrapper in `home-animated.tsx` controls scroll distance (280vh of scrub).

## Troubleshooting

### Animation Not Playing

- Check `isReady` from `useUltraterrestrialAnimation`
- Confirm `#earth-canvas`, `#moon-canvas`, `.prometheus-container` exist
- Check browser console for GSAP / WebGL errors

### Journey Not Scrubbing

- Confirm the track wrapper (`refs.track`) renders (absent in `staticMode`)
- `ScrollTrigger` is registered in the hook; check `document.body.style.overflow` isn't stuck `hidden` (intro should release it on complete)

### Typography Stuck Hidden

- Wordmark/tagline/quote start parked in masks — if the intro never runs (static mode), they render at rest inside visible masks
- SplitType failures revert cleanly; check console
