---
title: Design — nebula-dotgrid-textures
description: GOLD tier — vision-written 2026-08-13 (self). Olive nebula × hex-grid texture sheet.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Nebula Dotgrid Textures
source: extractions/nebula-dotgrid-textures/nebula-dotgrid-textures.png
captured_at: 2026-08-13
colors:
  abyss: "#11180b"
  moss: "#252d1a"
  moss-alt: "#212a17"
  olive: "#404c30"
  sage: "#717a5c"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Nebula Dotgrid Textures

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/nebula-dotgrid-textures/nebula-dotgrid-textures.png` (1920×1205)
- **Capture method**: direct vision
- **Detected limitations**: the four panels are variations of one recipe (nebula × hex grid), not four distinct systems — token sheet samples the whole frame, so per-panel variance is averaged out.

## TL;DR

A 2×2 contact sheet of dark-olive nebula textures pinned under fine hexagonal dot grids — the background layer for tactical/terminal interfaces. Organic drift, military order, one palette.

## 1. Visual identity

**Personality**: murky, tactical, patient, nocturnal, systematic.
**Mood**: sonar-room calm — watching something vast through equipment.
**Detectable stylistic references**: RTS/sim map backdrops, hex-grid wargame boards, night-vision optics, deep-field astrophotography.
**Information density**: dense but uniform — texture, not information.
**Implicit positioning**: background assets for interfaces that want depth without pulling focus.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes a background should behave like terrain: present, navigable, never the subject. The nebula supplies awe at low volume; the hex grid supplies the instrument — together they say *this space is being surveyed*. Nothing in the texture is allowed to be prettier than the data it will carry.

### 1.3 The ONE brand thing

- **The thing**: organic nebula × systematic hex grid, fused in one layer.
- **Why it carries the brand**: either alone is generic — starfield or graph paper; the fusion is the signature "surveyed cosmos."
- **How everything else supports it**: the olive palette desaturates the drama out of the nebula; the grid is hairline so it reads as instrument, not ornament.
- **Where it appears**: full-bleed backgrounds behind HUDs, maps, terminals; never as cards or foreground. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `abyss` | `#11180b` | deepest field | ✅ pixel |
| `moss` | `#252d1a` | dominant body | ✅ pixel |
| `moss-alt` | `#212a17` | median body | ✅ pixel |
| `olive` | `#404c30` | mid drift | ✅ pixel |
| `sage` | `#717a5c` | lightest event / grid glint | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **surveyed-cosmos texture** (nebula under hex grid). Generic: none — background asset sheet, not UI.

## 4. Layout & composition

Strict 2×2 panel grid with thin dividers (the catalog is the composition); inside panels, diagonal nebula drift against the fixed hex lattice.

## 5. Reconstruction notes

As UI: background-asset class. The recipe is reproducible in code: olive-noise nebula (layered radial gradients or a noise PNG) + SVG hex-dot pattern overlay at low opacity — a genuine candidate for `background-image` stacking. Quick wins: five-swatch olive scale is fully measured; hex grid is trivial SVG. Tricky bits: nebula needs real noise (pure CSS gradients band badly in dark olives); keep the grid opacity low or it Moirés on scaled displays.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | texture-sheet read is unambiguous |
| Colors | ✅ | pixel-grounded olive scale |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — use at full bleed behind interfaces; keep the hex grid hairline and low-contrast; darken further with an overlay when text sits on top.

**Don't** — don't tile a visibly repeating patch without offset; don't raise `sage` contrast until it becomes a color accent; don't use as a foreground/card surface; don't mix with warm paper textures in the same view.

## 7. Open questions

- Are the four panels four *severity levels* of one texture (contrast/density ramp) or alternates? A per-panel pixel sample would answer; current sheet is frame-averaged.
- Seamless-tile status unknown — test edges before shipping as `background-repeat`.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: background texture sheet, not a UI screen.
