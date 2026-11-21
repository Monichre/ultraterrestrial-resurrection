---
title: Design — geometry-sibling-vxtf
description: GOLD tier — vision-written 2026-08-13 (self). Dim chalk-on-black geometry plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Geometry Sibling — Chalk on Black
source: extractions/geometry-sibling-vxtf/geometry-sibling-vxtf.png
captured_at: 2026-08-13
colors:
  black: "#000000"
  grey-1: "#191a1a"
  grey-2: "#343433"
  grey-3: "#565656"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Geometry Sibling (Chalk on Black)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the dim register of the geometry language.

## Source

- **Source type**: local image · **Path**: `extractions/geometry-sibling-vxtf/geometry-sibling-vxtf.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: at luma 5.0 mean, the faintest marks are at the edge of visibility — constructions identified by their geometry, fine dimension-text illegible.

## TL;DR

A sparse vertical stack of geometric constructions — a wireframe pyramid, an orbital ring system, tick-marks — drawn in dim grey chalk on a near-pure-black field. The night register of the line-geometry language; same vocabulary as the lit plates, whispered.

## 1. Visual identity

**Personality**: austere, nocturnal, schematic, withheld.
**Mood**: hushed concentration — a chalkboard in a dark room.
**Detectable stylistic references**: blackboard geometry, dark-mode schematics, astronomical plates, minimal notation.
**Information density**: very low — a handful of constructions in a large black field.
**Implicit positioning**: the dim sibling / dark twin of the lit geometry plates (`line-geometry-bwpx`).
**Confidence**: ✅ high (at the level of construction identity).

### 1.2 Brand voice

Restraint to the point of difficulty. The brand is willing to make the viewer lean in — to hold its marks at the edge of visibility and trust they are worth approaching.

### 1.3 The ONE brand thing

- **The thing**: the value floor — geometry held at max 2.86:1 contrast against pure black.
- **Why it carries the brand**: it tests whether the constructions survive on silhouette alone; they do, which proves the strength of the underlying forms.
- **How everything else supports it**: the vertical stack and generous black remove every compositional crutch.
- **Where it appears**: dark-mode schematic backgrounds, "night" register plates, transitions where content fades toward black. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `black` | `#000000` | field | ✅ pixel |
| `grey-1` | `#191a1a` | faintest marks | ✅ pixel |
| `grey-2` | `#343433` | mid marks | ✅ pixel |
| `grey-3` | `#565656` | strongest lines | ✅ pixel |

Typography: none observed (dimension-marks are notation, not type).

## 3. Components inventory

Signature: **chalk-on-black construction stack**. Generic: none — schematic plate, not UI.

## 4. Layout & composition

Portrait; constructions in a loose vertical stack with large black intervals; no grid, no border, no frame; the eye travels top-to-bottom through diminishing light. Composition is *interval* — the black between marks is the subject as much as the marks.

## 5. Reconstruction notes

As UI: asset-class. The four-value grey ladder (`#000` → `#565656`) is a ready "dim register" token set. Note: 2.86:1 max contrast fails WCAG for any text — graphic marks only. Tricky bits: on OLED the pure black will read as screen-off; consider `#050505` as a display floor in production.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | construction identity unambiguous |
| Colors | ✅ | pixel-grounded grey ladder |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — let the black dominate; keep marks dim and few; pair with `line-geometry-bwpx` as dark/light twins.

**Don't** — don't brighten for legibility; don't add a grid or frame; don't use for text-bearing UI.

## 7. Open questions

- Is there a matching lit version of this exact stack? If so, animate between them as a "powering up" transition.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: schematic art plate, not a UI screen.
