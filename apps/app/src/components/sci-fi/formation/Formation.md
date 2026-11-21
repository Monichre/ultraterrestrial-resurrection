# Formation°

**Date:** 2026-07-24  
**Source:** `~/Downloads` Formation package (© phbn / formation.phobon.io)  
**Target:** `apps/app/src/components/sci-fi/formation/`

## Purpose

Generative flow-field particle trails via R3F + FBO accumulation. Seven surfaces cycle palettes and re-seed fields.

## Modules

| File | Role |
| --- | --- |
| `perlin.ts` | Gustavson `perlin3` |
| `surfaces.ts` | Surface presets + generators |
| `Formation.tsx` | Canvas-only component |
| `FormationUI.tsx` | Site chrome (nav / title / orb) |
| `formation-ui.css` | Chrome styles |
| `ui.html` | Vanilla Formation° donor (2026-08-06) |

## Usage

```tsx
import { Formation, FormationUI } from '@/components/sci-fi/formation'

<Formation surface='cellular' style={{ height: '100vh' }} />
<div style={{ height: '100vh' }}><FormationUI /></div>
```

## Surfaces

`cellular` · `circular` · `spiral` · `network` · `atrophy` · `fundament` · `monde`

## Storybook

**Sci-Fi/Formation**
