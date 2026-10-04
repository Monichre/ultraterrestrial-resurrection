# RotatingGlobe

**Updated:** 2026-07-23 16:40:00 CDT  
**Path:** `apps/app/src/components/sci-fi/rotating-globe.tsx`

## Purpose

Interactive React Three Fiber northern-hemisphere globe with atmosphere glow, surface dots, city scatter markers, HTML labels, drag-to-spin, and optional Web Audio tick feedback.

## Architecture

| Module | Role |
| --- | --- |
| `RotatingGlobe` | Pointer shell + R3F canvas + audio lifecycle |
| `GlobeGroup` | Yaw integration, idle spring, tick scheduling |
| `CityDots` / `CityLabels` | Seeded scatter points and horizon-culled labels |
| Shader helpers | Outer atmosphere + inner fresnel glow |

## Data flow

```
props.cities → CityDots (hash scatter) + CityLabels (Html)
pointer events → rotationRef / velocityRef → GlobeGroup.useFrame → group.rotation.y
clickSound → AudioContext → playTick on angular steps
```

## Exports

- `RotatingGlobe`
- `ROTATING_GLOBE_DEFAULT_CITIES`
- `RotatingGlobeCity`, `RotatingGlobeProps`

## Storybook

`Sci-Fi/RotatingGlobe` — Default, WithClickSound, CustomCities, CompactHeight

## Dependencies

Existing: `@react-three/fiber`, `@react-three/drei`, `three` (already in `apps/app`).
