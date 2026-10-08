---
title: Design — monochrome-height-luma-maps
description: GOLD tier — vision-written 2026-08-13 (self). Survey diptych, render to diagram.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Monochrome Height/Luma Maps
source: extractions/monochrome-height-luma-maps/monochrome-height-luma-maps.webp
captured_at: 2026-08-13
colors:
  void: "#090909"
  charcoal: "#232323"
  median: "#0c0c0c"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Monochrome Height/Luma Maps

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/monochrome-height-luma-maps/monochrome-height-luma-maps.webp` (2048×1024, WebP)
- **Capture method**: direct vision (via JPEG convert)
- **Detected limitations**: at luma 14 the left panel's deepest terraces are near-illegible; the read is mass-and-fog, not architectural detail.

## TL;DR

A monument surveyed in total darkness: foggy height-map render on the left, radial contour diagram on the right. The vault's purest statement of "place reduced to measurement."

## 1. Visual identity

**Personality**: analytical, funereal, precise, ghosted.
**Mood**: a survey conducted in the dark.
**Detectable stylistic references**: LiDAR/photogrammetry bakes, control-room cartography, title-sequence data plates.
**Information density**: high in line-count, near-zero in tone count.
**Implicit positioning**: the analytical end of the vault's line-on-black register; diagram as art.
**Confidence**: ✅ high.

### 1.2 Brand voice

Understanding as subtraction. The design believes the audience trusts what has been *measured* — that stripping a monument to fog values and contour rings is a kind of respect, and that beauty lives at exactly two gray levels.

### 1.3 The ONE brand thing

- **The thing**: the object→diagram diptych — the same structure shown as atmosphere (left) and as abstraction (right).
- **Why it carries the brand**: it makes analysis itself visible; the gutter between panels is the act of understanding.
- **How everything else supports it**: zero color, zero type, zero ornament — nothing mediates between the two readings.
- **Where it appears**: section dividers, methodology plates, title cards. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `void` | `#090909` | field | ✅ pixel |
| `charcoal` | `#232323` | highest terrain / contour line | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **render→contour diptych** (foggy relief paired with radial diagram). Generic: none — art, not UI. The right panel alone would be SVG-reproducible; the diptych as presented is an asset plate.

## 4. Layout & composition

2:1 ultrawide, symmetric gutter split; left = depth (vertical fog gradient), right = flatness (concentric rings centered); reading order is left-to-right abstraction.

## 5. Reconstruction notes

As UI: asset-class divider/plate. Quick wins: two-value palette, endless black page blend. Tricky bits: the fog gradient on the left is the only tonal modeling — banding will show on OLED; use dithered gradients. The right panel could be regenerated as SVG (concentric jagged paths) for crisp scaling.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | diptych read unambiguous |
| Colors | ✅ | pixel-grounded pair |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — display on `#090909` or darker; preserve the 2:1 split; add mono microtype captions only below the plates, never on them.

**Don't** — don't colorize the contours; don't raise the black floor; don't swap panel order (abstraction must come second).

## 7. Open questions

- Is the rendered structure a real vault location (martian-pyramid? daedalus?) seen in survey form? Cross-cluster link worth investigating.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: art diptych, not a UI screen.
