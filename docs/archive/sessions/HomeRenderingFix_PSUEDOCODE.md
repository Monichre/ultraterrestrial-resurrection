# HomeRenderingFix_PSUEDOCODE

## Objective

Stabilize the landing hero so the cosmic background, moon, and typography match the intended art direction regardless of animation timing issues.

## High-Level Steps

1. Harden `useUltraterrestrialAnimation` so it always reveals the scene (with or without the cinematic GSAP sequence).
2. Update `Home` layout markup to include the animation container ref, a static gradient backdrop, and ensure background layers are pointer-event safe.
3. Refresh `TitleAlt` typography to use the design-system font stack and a neutral glow instead of the blue gradient.
4. Fix `StarsBackground` utility classes so the SVG never intercepts pointer events.

## Detailed Pseudocode

### 1. Animation Hook

```
initialize state: isReady, showFluidOrbs, titleVisible, navVisible
add new state: forcedReveal (boolean) default false

useEffect -> determine prefersReducedMotion; if true, call revealSceneImmediately()

useEffect -> start interval to check for '#earth-canvas', '#moon-canvas', '.prometheus-container'
  when found -> clear fallback timeout, setIsReady(true)
  also set fallback timeout (~3500ms); if it fires first, set forcedReveal(true) and call revealSceneImmediately()

function revealSceneImmediately():
  set showFluidOrbs false
  set titleVisible true
  set navVisible true
  for refs.stars/shootingStars/prometheus/moon/earth/nav/title -> gsap.set opacity 1, clear transforms

useGSAP callback:
  if (!isReady || forcedReveal or prefersReducedMotion) return
  build custom eases
  set initial states (using gsap.set)
  create timeline exactly as before
  onComplete -> clear overlay

Cleanup ensures flash overlay removed even on fallback.
```

### 2. Home Layout

```
<div ref={refs.container} className='...' style bg #000>
  add <div className='absolute inset-0 z-0 bg-[radial-gradient(...)] pointer-events-none' />
  keep Stars/Shooting stars wrappers but rename pointer-none -> pointer-events-none
  ensure CanvasCursor sits above backgrounds but below overlay
```

### 3. TitleAlt Typography

```
use fontFamily 'var(--font-monument-grotesk)'
set text color to transparent gradient from #f4f9ff to #d7e4ff
add soft glow (#8ec5ff) but reduce intensity
maybe add subtle letter spacing adjustments
```

### 4. StarsBackground Utility Fix

```
update wrapper div className to use 'pointer-events-none'
update svg className likewise
```

### 5. Preserve Cosmic Backdrop During Timeline

```
Problem: gsap.set() drives stars/shootingStars opacity to 0 at timeline start,
         so when the flash overlay runs the background disappears (looks like a white wash).

Solution Steps:
1. Remove the initial gsap.set(refs.stars...), gsap.set(refs.shootingStars...) calls.
2. Remove the tl.to(...) steps that fade them in later; let them stay rendered from mount.
3. Optionally clamp their opacity via CSS if needed, but keep them >= 0.8 throughout.
4. Keep flash overlay effect (short burst) but ensure it no longer corresponds to a blank canvas.
5. Test reload: background should remain visible even while the flash overlay plays.
```

## Acceptance Validation

- Load page with JS disabled -> static gradient prevents white flash.
- Wait <4 seconds -> fallback ensures Moon, stars, nav visible even if 3D canvases delayed.
- With motion preference reduce -> timeline skipped but view still composed.
- Typography renders using Monument Grotesk with soft glow instead of solid blue.

```

