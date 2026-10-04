# HomeCelestial Design Lab

**Updated:** 2026-08-07  
**Route:** `/design-lab/home-celestial`  
**Brief:** `.claude-design/home-celestial-brief.json`

## Summary

Design exploration for the home hero celestial system. Improves the existing Earth + Moon composition against production SoT, and offers two elite primary-body swaps (Mars, Neptune) using newly installed GLTF packs.

## Architecture

| Module | Role |
| -------- | ------ |
| `CelestialStage.tsx` | Shared R3F stage: load/normalize GLTF, Earth PBR, light rigs, framing |
| `VariantA–E.tsx` | Distinct design axes (baseline / elite Mars / elite Neptune / motion / dual) |
| `page.tsx` | Lab shell + FeedbackOverlay |
| `public/assets/planets/{mars,neptune,moon-2}/` | Installed Sketchfab GLTF packs |

## Data flow

1. Lab page mounts five variants with shared fixture grammar (wordmark + caption).
2. Each variant configures `CelestialStage` (primary / secondary / framing / light).
3. User annotates via FeedbackOverlay → paste into chat → synthesis or SDD plan.

## Constraints (binding)

- No DOM `scale` or CSS `blur` on WebGL wrappers
- Prefer mesh/camera transforms for flyby motion
- Keep Ultraterrestrial wordmark + archival dark chrome

## Next

Await winner feedback → finalize → SDD into `home-animated.tsx` / Earth / Moon.
