# IntroSequence

Cinematic Three.js + GSAP intro for the home page, integrated into the existing
`home.tsx` / `TitleAlt.tsx` setup.

## Key Modules

- `src/components/intro/IntroScene.tsx`
  - Single R3F `<Canvas>` containing Earth, Moon orbital pivot, atmosphere
    fresnel shell, depth-z star streaks, UFO orbs, flash lights, postprocessing
    stack (Bloom, Vignette, IntroFX), and the master GSAP timeline.
  - Exports a tiny pub/sub `onIntroPhase` / `setIntroPhase` so DOM overlays
    (`TitleAlt`, `LovecraftQuoteOverlay`) can react to scene-graph phases
    without sharing a timeline reference.
- `src/components/intro/IntroFX.tsx`
  - Custom `postprocessing.Effect` subclass with uniforms
    `uGlitch`, `uBlackout`, `uAscii`, `uStatic`, `uTime`. Implements:
    - Slice displacement + chromatic aberration (glitch)
    - Hash noise (static)
    - Cell-quantized luminance ASCII dither (ascii)
    - Multiplicative blackout
    - Scanlines that scale with glitch + ascii
- `src/layouts/home/LovecraftQuoteOverlay.tsx`
  - Mounts the existing `LovecraftQuote` component hidden, fades it in on the
    `static` phase using GSAP `expo.out`.
- `src/layouts/home/TitleAlt.tsx`
  - Existing per-character GSAP reveal, extended with a `useEffect` listener
    on `onIntroPhase("blackout")` that fades/blurs the title out before the
    glitch end-state.

## Component Architecture

```
Home (home.tsx)
├── IntroScene (single Canvas, shared camera)
│   ├── CameraRig            ← reads camState ref each frame
│   ├── TimelineDriver       ← the master gsap.timeline()
│   ├── EarthBody + Atmosphere
│   ├── MoonOrbit            ← pivot.rotation.y driven by moonAngle ref
│   ├── StarStreaks          ← travel-feel particles
│   ├── UFOOrb × 4 + FlashLight × 2
│   └── EffectComposer → Bloom → Vignette → IntroFX
├── TitleAlt (DOM, z-40)     ← reveal at t≈0.6, exit on blackout phase
├── LovecraftQuoteOverlay    ← reveals on static phase
├── CanvasCursor / ShootingStars / StarsBackground (untouched)
```

## Data Flow

All scene-graph state is held in **plain refs** so GSAP can mutate them at
60fps without React re-renders. R3F's `useFrame` reads these refs and applies
them to the actual three.js objects:

| Ref            | Type                  | Tweened by                  | Consumed by              |
|----------------|-----------------------|------------------------------|--------------------------|
| `camState`     | `{distance,angle,height,lookAtY}` | TimelineDriver | CameraRig.useFrame       |
| `atmos`        | `{current:number}`    | TimelineDriver               | Atmosphere shader uniform|
| `moonAngle`    | `{current:number}`    | TimelineDriver               | MoonOrbit.useFrame       |
| `moonScale`    | `{current:number}`    | TimelineDriver               | MoonOrbit.useFrame       |
| `fx`           | `IntroFXHandle`       | TimelineDriver               | IntroFX shader uniforms  |

DOM overlays sync via the `onIntroPhase` event bus. Phase calls (`approach`,
`arrival`, `orbit`, `flicker`, `blackout`, `static`) are emitted by
`tl.call()` at fixed timeline beats.

## Master Timeline (seconds, absolute)

| t    | Event                                                          |
|------|----------------------------------------------------------------|
| 0.0  | `approach`. Camera dolly distance 80 → 5.4 (`expo.out`).        |
| 1.0  | Atmosphere intensity 0 → 1.2.                                   |
| 3.0  | `arrival`. Camera begins orbital pivot.                         |
| 3.2  | Camera angle 0 → -π·0.6.                                        |
| 3.4  | `orbit`. Moon enters from behind-left (angle π·1.05 → π·0.55), scale 0 → 1. |
| 4.0  | `flicker` phase signal (UFO orbs + flash lights already self-scheduled). |
| 6.4  | Glitch micro-pulse (0.2).                                       |
| 7.0  | Camera continues orbit angle → -π·1.05; moon arc continues.    |
| 7.6  | Glitch micro-pulse (0.35).                                      |
| 8.4  | Glitch micro-pulse (0.5).                                       |
| 9.0  | `blackout`. uBlackout 0 → 1 (`power4.in`). TitleAlt exits.      |
| 9.6  | `static`. uStatic 0 → 0.85, uGlitch 0 → 1.                      |
| 10.4 | uAscii 0 → 1, uBlackout eases to 0.55. LovecraftQuoteOverlay reveals. |
| 11.5+| Sustained glitch jitter yoyo, end-state.                        |

## Design Notes

- One canvas → one camera so the orbital pivot can rotate the camera around
  Earth while the moon enters the same frame from behind. This is why the
  separate `<Moon />` and `<Earth />` mounts in `home.tsx` were collapsed into
  `IntroScene` (the standalone components remain available for other layouts).
- All time-based uniforms (`uTime`) advance inside the `Effect.update` hook,
  so the static/glitch/ASCII keep moving even when GSAP isn't tweening.
- ASCII dither is intentionally *cell-quantized hash* rather than a font
  texture: it reads as terminal/static without an asset dependency.
