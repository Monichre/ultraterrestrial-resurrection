# 002 — Complete HomeAnimated GSAP sequence (title gate + page switch)

- **Status**: DONE
- **Commit**: 8db933b
- **Severity**: HIGH
- **Category**: Purpose & frequency / Easing & duration / Accessibility
- **Estimated scope**: 4 files

## Problem

`HomeAnimated` leaves title always visible (`TitleAlt` with default `trigger=true`) and `page.tsx` still returns `<HomeGSAP />`, so the hardened hook never runs in production.

Current hook idle at 2.8s with DOM `y+=8` float:

```ts
// useHomeHeroSequence.ts — current idle call
idleTweenRef.current = gsap.to(layers.earth, {
  y: '+=8',
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

## Target

```ts
const HERO_TIMING = {
  STARS_START: 0,
  STARS_DURATION: 1.2,
  SHOOTING_START: 0.6,
  SHOOTING_DURATION: 0.8,
  EARTH_START: 1.2,
  EARTH_DURATION: 1.6,
  TITLE_AT: 2.8,
  TITLE_DURATION: 0.8,
  IDLE_AT: 4.0,
  READY_FALLBACK_MS: 3000,
} as const

// Title enter: opacity 0→1, scale 0.96→1, ease power2.out — never scale(0)
// No DOM idle float on earth wrapper
// gsap.registerPlugin(useGSAP) at module scope (client)
```

Easing tokens (GSAP equivalents of AUDIT.md):

- Enter: `power2.out` (≈ strong ease-out)
- On-screen morph (stars scale): `power2.inOut`
- Idle loops: `sine.inOut` / `none` only inside R3F, not on DOM earth

## Repo conventions

- Prefer `useGSAP` + `{ scope: container }` — exemplar: `useHomeHeroSequence.ts`
- `gsap.registerPlugin(useGSAP)` when window defined — exemplar: `hooks/useUltraterrestrialAnimation.tsx:8-11`

## Steps

1. Extend `HERO_TIMING` with `TITLE_AT`, `TITLE_DURATION`, `IDLE_AT: 4.0`.
2. Add `title` ref; expose `titleVisible`.
3. At `TITLE_AT`, set `titleVisible` and tween title opacity/scale.
4. Remove DOM earth idle yoyo.
5. Wire `home-animated.tsx`: title wrapper ref + `<TitleAlt trigger={titleVisible} />`.
6. `TitleAlt`: scramble wordmark when triggered; if reduced-motion, show final text immediately.
7. `page.tsx`: `return <HomeAnimated />`.

## Boundaries

- Do NOT modify `useHomeAnimations.ts` beyond optional Storybook note.
- Do NOT add ScrollTrigger.
- Do NOT animate `filter`, `width`, `height`, or `top`/`left`.

## Verification

- Mechanical: Storybook `Layouts/Home/HomeAnimated`; load `/` and confirm title appears after Earth.
- Feel: DevTools Animations panel at 10% — stars → earth → title → idle; no earth jump from dual float.
- Reduced motion: Rendering panel → reduce → all layers visible immediately, no scramble.
- Done when: `page.tsx` mounts `HomeAnimated` and `titleVisible` gates `TitleAlt`.
