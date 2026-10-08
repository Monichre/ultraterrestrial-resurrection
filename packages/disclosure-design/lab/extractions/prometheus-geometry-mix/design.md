---
title: Design — prometheus-geometry-mix
description: GOLD tier — vision-written 2026-08-13 (self). Dark schematic plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Prometheus Geometry Mix — Dark Schematic Plate
source: extractions/prometheus-geometry-mix/prometheus-geometry-mix.png
captured_at: 2026-08-13
colors:
  ground: "#13171a"
  line: "#9d9d95"
  line-dim: "#888780"
  mid: "#545551"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Prometheus Geometry Mix

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/prometheus-geometry-mix/prometheus-geometry-mix.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: none material.

## TL;DR

The dark sibling: Prometheus as glowing schematic — half sketch, half wireframe — on a near-black blue-tinged field. The same construction language as the paper plates, but the inversion makes it cosmic.

## 1. Visual identity

**Personality**: nocturnal, analytic, luminous, schematic.
**Mood**: awe through instrumentation.
**Detectable stylistic references**: blueprints, chalkboard physics, HUD diagrammatics, reversed-chiaroscuro technical drawing.
**Information density**: moderate — figure plus full construction overlay.
**Implicit positioning**: the "night shift" identity plate; bridges the paper plates and the HUD clusters.
**Confidence**: ✅ high.

### 1.2 Brand voice

Measurement as devotion. In the dark register the grid stops being academic and becomes astronomical — the brand's research posture rendered as star-chart.

### 1.3 The ONE brand thing

- **The thing**: silver construction geometry glowing off near-black, fused with hand hatching.
- **Why it carries the brand**: it is the exact midpoint of the vault's two axes — paper craft and dark instrumentation.
- **How everything else supports it**: palette is three greys and one ground; nothing competes with the glow.
- **Where it appears**: hero plates, section dividers, dark-mode identity moments. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ground` | `#13171a` | field | ✅ pixel |
| `line` | `#9d9d95` | primary geometry | ✅ pixel |
| `line-dim` | `#888780` | secondary geometry | ✅ pixel |
| `mid` | `#545551` | median tone / hatching | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **dark schematic plate** (hybrid figure, construction overlay, near-black ground). Generic: none — art, not UI.

## 4. Layout & composition

Portrait, head central, geometry radiating into the dark field; density highest at the skull, dissolving outward — the vignette is geometric, not photographic.

## 5. Reconstruction notes

As UI: asset-class, but the palette maps 1:1 onto dark shells (`--color-bg-primary: #13171a` family). Quick wins: ground + two line greys are a complete dark theme seed. Tricky bits: glow is baked into the asset; don't fake it with CSS shadows.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | unambiguous dark-schematic read |
| Colors | ✅ | four measured values |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the blue tinge in the black (`#13171a`, not pure `#000`); let geometry dissolve at the edges.

**Don't** — don't add UI chrome around it (that tips it into the HUD clusters' job); don't warm the greys.

## 7. Open questions

- Should this plate's ground token be the canonical dark `--color-bg-primary` across the identity? Strong candidate.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: schematic art, not a UI screen.
