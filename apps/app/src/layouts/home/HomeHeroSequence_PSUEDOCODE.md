# HomeHeroSequence — Pseudocode

**Goal:** Implement `ANIMATION_SEQUENCE.md` exactly on `/` via `HomeAnimated` + `useUltraterrestrialAnimation`.  
**Date:** 2026-07-19 (corrected — do not gut cinematic layers)

## Non-negotiable

The sequence **includes** flash pulses, FluidShaderOrbs, big flash (scale 3×), stars, shooting stars, Prometheus, Earth, Moon orbital, title scramble, Lovecraft quote, nav reveal.  
A shortened stars→Earth-only timeline is **wrong**.

## Architecture

```
page.tsx → HomeAnimated
  └─ useUltraterrestrialAnimation (CINEMATIC_TIMING)
       refs: container, orbs, prometheus, moon, earth, title, stars, shootingStars, nav, cursor
       state: showFluidOrbs, titleVisible, quoteVisible, navVisible, isReady
```

## Timeline (from ANIMATION_SEQUENCE.md)

| t (s) | Action |
|------:|--------|
| 0–2 | Flash pulses ×5 |
| 0.5–4.5 | FluidShaderOrbs visible |
| 5–6 | Big flash, scale → 3 |
| 5.2 | Stars fade in |
| 5.3 | Shooting stars |
| 5.5 | Prometheus → opacity 0.85; Earth fade in |
| 8–11 | Moon from off-left → 25vw / -15vh / scale 0.6 |
| 8.5 | Title scramble 2.5s |
| 9 | Earth float yoyo |
| 11.5 | Lovecraft quote |
| 13 | Nav chrome slide in |

## A11y harden (allowed)

- `prefers-reduced-motion` → skip to final composed frame (all layers visible)
- Keep cinematic blur on moon **enter** only; clear to `blur(0)` at rest
- Do not delete Moon / Prometheus / orbs / quote to “simplify”

## Files

| File | Role |
|------|------|
| `ANIMATION_SEQUENCE.md` | Source of truth |
| `useUltraterrestrialAnimation.tsx` | Master GSAP timeline |
| `home-animated.tsx` | Layer wiring + refs |
| `TitleAlt.tsx` | Scramble wordmark |
| `LovecraftQuote.tsx` | Quote at 11.5s |
| `page.tsx` | Mounts `HomeAnimated` |
