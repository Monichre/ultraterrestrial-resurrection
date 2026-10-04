---
title: Design — line-batch-dhyc
description: GOLD tier — vision-written 2026-08-13 (self). Warm parchment line-plate batch.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Line Batch DHYC
source: extractions/line-batch-dhyc/line-batch-dhyc.png
captured_at: 2026-08-13
colors:
  parchment: "#f1d1a9"
  ink: "#000000"
  sepia: "#9d8165"
  panel-grey: "#2c2c2c"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Line Batch DHYC

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/line-batch-dhyc/line-batch-dhyc.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: a batch sheet — individual plates are small; fine hatching detail and any figure numbering are below reliable resolution. Plate count and per-plate subject matter are described at the level of class (technical/figural/diagram), not identity.

## TL;DR

A warm parchment batch of engraved line plates — patent-style figures alternating black-on-cream and cream-on-black. The vault's line language in its warmest, most archival register.

## 1. Visual identity

**Personality**: archival, meticulous, scholarly, warm, hand-made.
**Mood**: the pleasure of the archive — many small certainties drawn with total conviction.
**Detectable stylistic references**: nineteenth-century steel engraving, patent-office figure sheets, alchemical/manual illustration.
**Information density**: dense — a sheet of many plates, each internally detailed.
**Implicit positioning**: drawing-style reference; illustration system for a print-flavored identity.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes drawing is thinking: every figure is a small proof, hatched and sectioned until the idea holds still. Warmth comes from the parchment, authority from the line discipline — nothing is sketched, everything is *engraved*, as if each plate expected to be cited.

### 1.3 The ONE brand thing

- **The thing**: polarity alternation — the same engraved line taught in black-on-cream and cream-on-black within one sheet.
- **Why it carries the brand**: it demonstrates the line language is register-independent; the system, not the surface, is the identity.
- **How everything else supports it**: a restrained three-value palette (parchment, ink, sepia) keeps attention on line behavior.
- **Where it appears**: illustration systems, chapter figures, explanatory plates. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `parchment` | `#f1d1a9` | light ground / inverted line | ✅ pixel |
| `ink` | `#000000` | black panels / deepest line | ✅ pixel |
| `sepia` | `#9d8165` | aged mid-tone | ✅ pixel |
| `panel-grey` | `#2c2c2c` | median panel tone | ✅ pixel |

Typography: none observed (figure numbering below resolution).

## 3. Components inventory

Signature: **engraved plate** (centered figure, margin, optional polarity inversion). Generic: none — illustration reference, not UI.

## 4. Layout & composition

Landscape sheet; loose grid of self-contained plates; per-plate composition is centered-figure-with-margin; the sheet reads as a catalog, not a scene.

## 5. Reconstruction notes

As UI: asset-class (engraving hatching is hand/raster work; CSS cannot fake the burin). Quick wins: three-value palette; the polarity-inversion convention maps directly to a light/dark illustration token pair. Tricky bits: sourcing or commissioning line work of this discipline is the real cost; AI approximations hatch unevenly.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | plate-batch read is unambiguous |
| Colors | ✅ | pixel-grounded trio + median |
| Typography | — | no legible type present |

## 6. Do's and Don'ts

**Do** — keep plates self-contained with generous margins; honor the polarity convention (a figure may invert, its line discipline may not); age grounds toward sepia, never toward grey.

**Don't** — don't mix registers within a single plate; don't add color accents; don't scale plates so small that hatching moirés.

## 7. Open questions

- Are these plates excerpts of one manual or many? Provenance unknown — the batch may be a curated gather rather than a single source.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: illustration reference sheet, not a UI screen.
