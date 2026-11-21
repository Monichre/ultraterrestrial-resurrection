---
title: Design — geometric-grid-hud
description: GOLD tier — vision-written 2026-08-13 (self). Grayscale analog-instrument collage.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Geometric Grid HUD
source: extractions/geometric-grid-hud/geometric-grid-hud.png
captured_at: 2026-08-13
colors:
  paper: "#bfbeb6"
  grey-mid: "#a19e97"
  grey-soft: "#8a8682"
  charcoal: "#393435"
typography:
  label:
    fontFamily: "technical mono / condensed sans (pre-digital instrument lettering)"
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Geometric Grid HUD

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/geometric-grid-hud/geometric-grid-hud.png` (1536×768)
- **Capture method**: direct vision
- **Detected limitations**: panel micro-labels are illegible at this size — instrument lettering class identifiable, words not. Individual panels are photograph/scan fragments; their source instruments are unclaimable.

## TL;DR

A six-panel survey of analog instrument grammar — scopes, reticles, contour fields, grids — in paper-grey monochrome. The vault's HUD language stated in its purest, pre-digital form.

## 1. Visual identity

**Personality**: instrumental, calibrated, methodical, archival, cold.
**Mood**: the reassurance of measurement — competence rendered in grey.
**Detectable stylistic references**: 1960s–70s CRT scopes, plotting tables, survey grids, op-art contour fields (Vasarely adjacency).
**Information density**: dense per panel, balanced as a sheet — texture-grade technicality.
**Implicit positioning**: reference material for interface skins, loading screens, "instrument mode" illustration.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes measurement is a moral good: an instrument does not editorialize, it *reports*. So the design adopts the instrument's manners — hairline scales, radial tick discipline, grey-on-grey restraint, labels too small to shout. Authority comes from calibration, not decoration.

### 1.3 The ONE brand thing

- **The thing**: radial × orthogonal instrument grammar — scopes and grids as the only ornament.
- **Why it carries the brand**: it asserts "this surface measures something" without a single data point; remove the reticles/grids and the grey is just grey.
- **How everything else supports it**: zero chroma, no brand color, no illustration — everything defers to the instrument vocabulary.
- **Where it appears**: loading/instrument screens, technical interstitials, print collateral for data-adjacent material. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#bfbeb6` | lightest field | ✅ pixel |
| `grey-mid` | `#a19e97` | dominant ground | ✅ pixel |
| `grey-soft` | `#8a8682` | secondary marks | ✅ pixel |
| `charcoal` | `#393435` | lines, reticles, labels | ✅ pixel |

Typography: technical mono / condensed instrument lettering on micro-labels; exact face unclaimable ⚠️.

## 3. Components inventory

Signature: **instrument panel** (reticle scope, contour field, survey grid). Generic: none — reference collage, not a screen.

## 4. Layout & composition

Six equal panels, 3×2; per-panel grammar alternates radial (scopes, tick rings) and orthogonal (grids, readouts) — a systematic survey read left-to-right, top-to-bottom.

## 5. Reconstruction notes

As UI: the panel grammar is genuinely code-able — SVG circles/tick rings/contour polylines on grey grounds; this collage is the best *component candidate* in the cluster, though the frame itself remains a moodboard (no component written — see 8). Quick wins: four-swatch grey scale, all geometry primitive-based. Tricky bits: contour fields need generated noise-paths (hand-drawn SVG looks wrong); print-scan grain requires a raster overlay if fidelity matters.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | instrument-collage read is unambiguous |
| Colors | ✅ | pixel-grounded grey scale |
| Typography | ⚠️ | lettering class certain, face unclaimable |

## 6. Do's and Don'ts

**Do** — keep instrument marks hairline; stay inside the four-step grey scale; prefer radial/orthogonal grammar over any illustrative element.

**Don't** — don't add chroma (no "radar green" nostalgia); don't use glow or phosphor effects — these are print instruments, not screens; don't let labels become legible UI text at display sizes.

## 7. Open questions

- Should a derived `HudScope`/`ContourField` component be built from this sheet? Strongest component candidate in batch 3 — flagged, not built, since the frame is a collage of sources rather than one screen.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: reference collage of instrument imagery, not a single UI mockup (SVG grammar noted in Reconstruction).
