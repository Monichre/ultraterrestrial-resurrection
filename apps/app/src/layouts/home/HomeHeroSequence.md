# HomeHeroSequence

**Date:** 2026-07-19  
**Canon:** `ANIMATION_SEQUENCE.md`  
**Status:** Production `/` — full cinematic sequence

## Purpose

Run the documented multi-phase home intro (flashes → orbs → celestial dance → UI), not a shortened substitute.

## Modules

| Module | Responsibility |
|--------|----------------|
| `useUltraterrestrialAnimation.ts` | `CINEMATIC_TIMING` master timeline + phase flags |
| `home-animated.tsx` | Mounts every layer with refs |
| `TitleAlt` / `LovecraftQuote` | Gated UI reveals |
| Earth / Moon / Prometheus / FluidShaderOrbs | Celestial + pre-flash texture |

## Data flow

```
isReady (#earth-canvas + moon|prometheus)
  → GSAP timeline (CINEMATIC_TIMING)
    → showFluidOrbs / titleVisible / quoteVisible / navVisible
```

## Harden notes (not scope cuts)

- Reduced-motion → final frame immediately
- Global MenuTrigger stands in for retired CosmicNav at t=13s
- Moon orbital path and Prometheus opacity are required by the sequence doc
