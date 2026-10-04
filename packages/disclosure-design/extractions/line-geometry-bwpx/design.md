---
title: Design — line-geometry-bwpx
description: GOLD tier — vision-written 2026-08-13 (self). Luminous celestial-mechanics plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Line Geometry — Luminous Orrery Plate
source: extractions/line-geometry-bwpx/line-geometry-bwpx.png
captured_at: 2026-08-13
colors:
  black: "#000000"
  cream-line: "#f1e0c8"
  bone: "#ccbfad"
  warm-grey: "#a9a193"
  stone: "#686661"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Line Geometry (Luminous Orrery Plate)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the lit register of the line language.

## Source

- **Source type**: local image · **Path**: `extractions/line-geometry-bwpx/line-geometry-bwpx.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: fine hatch and tick detail below full resolution; constructions identified by geometry.

## TL;DR

A luminous line-and-geometry construction — a warm cream wireframe pyramid wrapped in orbital rings, with a radiating fan diagram and small globe — glowing against pure black. The lit twin of `geometry-sibling-vxtf`; celestial mechanics as light.

## 1. Visual identity

**Personality**: luminous, precise, engineered, radiant.
**Mood**: quiet wonder — an instrument measuring the heavens.
**Detectable stylistic references**: orrery/planetarium diagrams, celestial-mechanics engravings, incandescent instrument panels.
**Information density**: moderate — a primary construction plus orbiting accents.
**Implicit positioning**: the bright end of the line-on-dark register; defines the usable contrast ceiling (16.24:1).
**Confidence**: ✅ high.

### 1.2 Brand voice

Precision as warmth. The brand's diagrams don't glow cold neon — they burn incandescent, like a lit instrument in a dark room.

### 1.3 The ONE brand thing

- **The thing**: warm cream line (`#f1e0c8`) at 16.24:1 against pure black — incandescent, not neon.
- **Why it carries the brand**: it establishes that the line language's "glow" is warm and engineered, distinguishing it from every cyan-HUD cliché.
- **How everything else supports it**: the stepping bone/grey/stone values let constructions recede in layers.
- **Where it appears**: hero diagrams, "system" explainers, the lit state of any dark/light line-element animation (paired with `geometry-sibling-vxtf`). ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `black` | `#000000` | field | ✅ pixel |
| `cream-line` | `#f1e0c8` | primary construction | ✅ pixel |
| `bone` | `#ccbfad` | secondary line | ✅ pixel |
| `warm-grey` | `#a9a193` | tertiary marks | ✅ pixel |
| `stone` | `#686661` | faintest accents | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **luminous orrery construction** (wireframe + orbital rings + fan). Generic: none — art plate, not UI.

## 4. Layout & composition

Landscape; pyramid anchors center-left, orbital rings sweep concentrically around it, fan diagram radiates lower-right, small globe and accents fill remaining field. A celestial-mechanics balance of central mass and orbiting detail.

## 5. Reconstruction notes

As UI: asset-class, but the five-value warm ladder is a ready "lit register" token set. The constructions are SVG-friendly (1px strokes at the ladder values). Tricky bits: keep the line *warm* — shifting toward white or cyan turns it into generic sci-fi; the incandescent cream is the identity.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | luminous construction unambiguous |
| Colors | ✅ | pixel-grounded five-value warm ladder |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the cream warm; use the value ladder for depth; pair with `geometry-sibling-vxtf` as lit/dim twins.

**Don't** — don't shift toward cyan or white; don't add glow filters (the value *is* the glow); don't crowd the composition.

## 7. Open questions

- Is there a mid-value sibling between this and `geometry-sibling-vxtf`? A three-state (dim/mid/lit) set would make a strong animated sequence.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: art plate, not a UI screen (though the constructions are SVG-translatable).
