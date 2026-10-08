---
title: Design — crumpled-dotgrid-journal
description: GOLD tier — vision-written 2026-08-13 (self). Drawn emblem on crumpled dot grid.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Crumpled Dot-Grid Journal
source: extractions/crumpled-dotgrid-journal/crumpled-dotgrid-journal.png
captured_at: 2026-08-13
colors:
  ink: "#1a1b1b"
  bone-paper: "#b8aa97"
  page-cream: "#d9cbb8"
  crease-taupe: "#71695c"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Crumpled Dot-Grid Journal

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/crumpled-dotgrid-journal/crumpled-dotgrid-journal.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: emblem's finest stipple/hatch detail summarized; dot-grid pitch eyeballed (~5mm standard).

## TL;DR

A hand-drawn geometric sigil on a crumpled dot-grid page, shot like a recovered artifact. Obsession rendered in ink, wear rendered in creases.

## 1. Visual identity

**Personality**: obsessive, tactile, ritualistic, intimate.
**Mood**: a private symbol, carried everywhere.
**Detectable stylistic references**: grimoire/outsider-diagram aesthetics, technical drawing, bullet-journal materiality.
**Information density**: one dense medallion in a field of emptiness.
**Implicit positioning**: the journal cluster's "constructed symbol" pole (vs. handwritten pages).
**Confidence**: ✅ high.

### 1.2 Brand voice

Process as proof. The design believes the audience trusts what looks *handled* — that crumples and wear authenticate the symbol more than any rendering could, and that a page mostly left blank says the emblem earned its space.

### 1.3 The ONE brand thing

- **The thing**: the drawn medallion — radiating bars, rings, hatch, stipple — a constructed sigil sitting on the dot grid's faint order.
- **Why it carries the brand**: it fuses the vault's two registers (geometry + paper) into one object; remove it and this is a stationery photo.
- **How everything else supports it**: right page stays blank, background stays black, the crumple provides the only other texture.
- **Where it appears**: artifact plates, chapter marks, "evidence of process" moments. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ink` | `#1a1b1b` | drawing + stage black | ✅ pixel |
| `bone-paper` | `#b8aa97` | page ground | ✅ pixel |
| `page-cream` | `#d9cbb8` | lit paper | ✅ pixel |
| `crease-taupe` | `#71695c` | fold shadows | ✅ pixel |

Typography: none observed (the emblem is drawn, not typeset).

## 3. Components inventory

Signature: **sigil-on-dotgrid** (constructed emblem + crumpled paper + black stage). Generic: none — art, not UI.

## 4. Layout & composition

Landscape, notebook centered with slight angle, spine gutter vertical at mid-frame; medallion centered on left page; crease shadows as chaotic counter-geometry to the grid.

## 5. Reconstruction notes

As UI: asset-class artifact plate. Quick wins: bone-on-black palette drops onto any dark page. Tricky bits: the crumple is photographic — CSS crumple effects will read as kitsch; use the asset. The emblem itself is SVG-reproducible (radial bars + rings + hatch) if a crisp version is needed.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | journal-artifact read unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the black stage; let creases fall where they may; crop loose so the notebook breathes.

**Don't** — don't flatten or de-wrinkle the paper; don't add handwriting to the blank page; don't color the ink.

## 7. Open questions

- Is the emblem a one-off or part of a drawn-symbol series across the journal cluster? Worth a cross-reference pass.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: object photograph, not a UI screen.
