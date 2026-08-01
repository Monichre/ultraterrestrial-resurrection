# Lab Prototypes — Pseudocode

**Source:** `~/Desktop/lab/WEB & UI DESIGN/`
**Date:** 2026-07-19

## Goal

Port six design prototypes into `apps/app` as Storybook-ready, Next.js client components under `design-system/lab-prototypes/`, with a gallery route for live review.

## Inventory

| Source | Component | Status |
|--------|-----------|--------|
| `react-app.js` | `SymbolonArchive` | NEW — archival doc shell (spine + nav + data panel) |
| `react-app (1).js` | `SemioticVoid` | NEW — WebGL nebula landing + semiotic rail |
| `react-app (2).js` | `PlanetaryTransit` | NEW — mobile orbital transit HUD |
| `react-app (3).js` | `OryzaeTimeline` | EXISTS — re-export in gallery only |
| `react-app (4).js` | `EnergyInputHub` | NEW — glass synth input + template cards |
| `diagnostic-architecture-model-teardown.html` | `DiagnosticArchitecture` | DONE — exploded wireframe teardown |

## Structure (per new component)

```
component-name/
  ComponentName.tsx
  component-name.css
  fixtures.ts
  types.ts          # when needed
  index.ts
  ComponentName.stories.tsx
  ComponentName.md
```

Shared:
- `use-symbolon-fonts.ts` — Cormorant Garamond + JetBrains Mono
- `index.ts` — barrel exports
- `LabPrototypes.md` — architecture doc
- Gallery: `apps/app/src/app/(site)/lab-prototypes/page.tsx`

## Implementation steps

1. Shared font hook (Cormorant + JetBrains Mono)
2. Port SymbolonArchive — CSS vars, no react-router (local nav state)
3. Port SemioticVoid — `import * as THREE from 'three'` (no CDN)
4. Port PlanetaryTransit — 2D starfield fallback + WebGL when available
5. Port EnergyInputHub — scoped CSS + functional particle system
6. Port DiagnosticArchitecture — GSAP timeline + Lucide icons (no iconify CDN)
7. Stories (fullscreen) + gallery page with tab switcher
8. Document each component + update openmemory.md Components

## Constraints

- `'use client'` for all interactive surfaces
- Named exports only
- No react-router — use `useState` for nav/pages
- Scope CSS under root class (`.sa-root`, `.sv-root`, etc.)
- Preserve visual language of prototypes; do not force Microfilm Dark tokens onto Symbolon/Energy aesthetics
- OryzaeTimeline: link from gallery, do not re-port
