---
title: Design — volluid-sphere-statues
description: GOLD tier — vision-written 2026-08-13 (self). Monumental title plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: VOLLUID — Sphere & Statues Title Plate
source: extractions/volluid-sphere-statues/volluid-sphere-statues.png
captured_at: 2026-08-13
colors:
  sphere: "#0a0d12"
  grey-mid: "#838689"
  grey-light: "#b8bbbd"
typography:
  wordmark:
    fontFamily: "grotesk, sans-serif"
    letterSpacing: 0.15em
    textTransform: uppercase
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — VOLLUID Sphere & Statues

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/volluid-sphere-statues/volluid-sphere-statues.png` (1856×2464)
- **Capture method**: direct vision
- **Detected limitations**: wordmark letterforms observed but exact face unidentifiable — grotesk with wide tracking is a ⚠️ visual call.

## TL;DR

The cluster's title plate: a deep blue-black sphere staged among classical statues under a full-field measurement grid, carrying the VOLLUID wordmark. Monumentality delivered through stillness and one chroma mass.

## 1. Visual identity

**Personality**: monumental, enigmatic, cool, staged.
**Mood**: hushed museological calm.
**Detectable stylistic references**: de Chirico metaphysical plazas, technical charts, restrained vaporwave classicism.
**Information density**: moderate — statues + grid + wordmark, but vast air between them.
**Implicit positioning**: identity/title artwork; the plate a series is named after.
**Confidence**: ✅ high.

### 1.2 Brand voice

The unknown object, catalogued. Everything in the frame is an instrument of measurement — grid, statuary scale, typography — pointed at one thing that refuses to be measured.

### 1.3 The ONE brand thing

- **The thing**: the single deep-chroma sphere in an achromatic measured world.
- **Why it carries the brand**: one anomaly, everything else instrumentation — the disclosure thesis as a still life.
- **How everything else supports it**: greys stay neutral; grid and statues exist to give the sphere scale.
- **Where it appears**: title plates, covers, hero art. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `sphere` | `#0a0d12` | chroma mass / near-black | ✅ pixel |
| `grey-mid` | `#838689` | statuary tone | ✅ pixel |
| `grey-light` | `#b8bbbd` | ground/grid field | ✅ pixel |

Typography: wordmark is a wide-tracked uppercase grotesk (⚠️ visual); no supporting text observed.

## 3. Components inventory

Signature: **title plate** (sphere + statuary + grid + wordmark). Generic: none — art, not UI.

## 4. Layout & composition

Tall portrait, central sphere, flanking statuary, full-field hairline grid; symmetry and stillness do the monumental work — nothing in the frame moves.

## 5. Reconstruction notes

As UI: asset-class hero art. The sphere hex `#0a0d12` doubles as a near-black surface token with more character than pure black. Quick wins: three-value palette; grid can be recreated in CSS (1px hairlines) if a live variant is needed. Tricky bits: halftone statuary is raster-only.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | unambiguous title-plate read |
| Colors | ✅ | pixel-grounded trio |
| Typography | ⚠️ | face inferred from letterforms |

## 6. Do's and Don'ts

**Do** — keep the sphere as the only chroma; preserve grid hairlines at true 1px when recreating.

**Don't** — don't animate the sphere; don't add glow effects; don't let statuary cross the wordmark.

## 7. Open questions

- Is VOLLUID a series name, a project codename, or a one-off? Manifest take implies a series; unconfirmed.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: title art, not a UI screen.
