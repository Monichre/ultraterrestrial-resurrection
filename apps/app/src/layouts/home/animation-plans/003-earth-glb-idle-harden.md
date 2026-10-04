# 003 — Harden Earth GLB load + procedural idle

- **Status**: DONE
- **Commit**: 8db933b
- **Severity**: MEDIUM
- **Category**: Performance / Accessibility
- **Estimated scope**: 1 file (`Earth.tsx`)

## Problem

`Earth.tsx` loads `/assets/earth2/TERRA.glb` via `useGLTF` without preload, runs float/parallax/light drift without a reduce-motion gate, and imports unused `framer-motion-3d` / texture paths on the main export.

## Target

```tsx
useGLTF.preload('/assets/earth2/TERRA.glb')

// Procedural only — no AnimationMixer unless clips exist
const { scene, animations } = useGLTF(EARTH_GLB_URL)
// if (animations.length === 0) → skip mixer (current asset)

useEarthIdleMotion(earthRef, lightRef, isIdle, reduceMotion)
// reduceMotion: spin only (or static); no float / parallax / light drift
```

Constants stay:

```ts
EARTH_SPIN_RATE = 0.1
EARTH_FLOAT_FREQ = 0.4
EARTH_FLOAT_AMP = 0.08
LIGHT_DRIFT_SPEED = 0.15
LIGHT_RADIUS = 1.2
PARALLAX_STRENGTH = 0.12
PARALLAX_DAMP = 0.06
```

## Steps

1. Add `EARTH_GLB_URL` constant + `useGLTF.preload`.
2. Pass `reduceMotion` from `Earth` props (parent reads matchMedia or reuses hero flag).
3. Gate float/parallax/light behind `!reduceMotion`.
4. Remove unused imports from the main Earth path if present (`motion` from framer-motion-3d on unused `EN` can stay isolated).

## Boundaries

- Do NOT swap the GLB asset.
- Do NOT add AnimationMixer for empty `animations` array.
- Do NOT animate DOM filter on the canvas wrapper.

## Verification

- Network: TERRA.glb starts loading early (preload).
- Reduced motion: Earth visible, no bobbing/parallax.
- Feel: after idle, gentle spin + float + light drift only when motion allowed.
