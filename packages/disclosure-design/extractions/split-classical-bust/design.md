---
title: Design — split-classical-bust
description: GOLD tier — vision-written 2026-08-13 (self). Dissolving classical bust plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Split Classical Bust — Dissolution Plate
source: extractions/split-classical-bust/split-classical-bust.png
captured_at: 2026-08-13
colors:
  field: "#20282a"
  slate: "#46504f"
  bone: "#b6b7ad"
  sage: "#838781"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Split Classical Bust (Dissolution Plate)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the build/unbuild thesis on the figure.

## Source

- **Source type**: local image · **Path**: `extractions/split-classical-bust/split-classical-bust.png` (1024×1024)
- **Capture method**: direct vision
- **Detected limitations**: cascade line detail and construction-ghost detail soft at 1024px; described at the level of mass and effect.

## TL;DR

A classical female bust in pale line on dark slate, split vertically — left half modeled face, right half dissolving into a cascade of glowing vertical lines. The dissolution counterpart to `daedalus-hatched-bust`'s construction: identity between marble and data.

## 1. Visual identity

**Personality**: spectral, elegiac, half-formed, glacial.
**Mood**: elegy for the solid self.
**Detectable stylistic references**: glitch-classicism, vaporwave statuary, line-art construction, digital dissolution effects.
**Information density**: moderate — one figure, one effect.
**Implicit positioning**: the unbuild plate of the bust cluster; the vault's thesis (the figure as constructed data) made visible.
**Confidence**: ✅ high.

### 1.2 Brand voice

The figure is not fixed. The brand treats identity as something assembled line by line — and therefore able to come apart line by line, beautifully.

### 1.3 The ONE brand thing

- **The thing**: the vertical split — half solid face, half cascading lines.
- **Why it carries the brand**: it literalizes "the figure as data" in a single, immediately readable gesture; the cascade is a signature, reusable motif.
- **How everything else supports it**: the cool glacial palette keeps it serene rather than horror-glitch; the construction ghosts tie it to the geometry system.
- **Where it appears**: identity/about plates, transition states (solid→data), album/cover art, the "unbuild" half of any build/unbuild pair. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `field` | `#20282a` | dark slate ground | ✅ pixel |
| `slate` | `#46504f` | modeled shadow | ✅ pixel |
| `bone` | `#b6b7ad` | lit face + cascade | ✅ pixel |
| `sage` | `#838781` | mid transition | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **split/dissolving figure** (solid → cascade). Generic: none — art plate, not UI. The cascade is a reusable *motif*.

## 4. Layout & composition

Square; bust centered, head upper-center; the vertical split runs through the face; the cascade pours down the right, giving strong vertical flow against the bust's stillness. Composition balances stability (left, solid) against dissolution (right, falling).

## 5. Reconstruction notes

As UI: asset-class. The cascade is a real, buildable effect — a figure edge dissolving into vertical 1px lines of varying length/value (SVG or canvas), in `bone`→`sage`→`slate`. Pairs with a "construct" counterpart for transitions. Tricky bits: the cascade lines must vary in length and value to read as a pour; uniform lines read as blinds.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | split-bust read unambiguous |
| Colors | ✅ | pixel-grounded cool slate set |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the palette glacial; vary cascade line length/value; pair with `daedalus-hatched-bust` as unbuild/build.

**Don't** — don't push it toward horror-glitch (it is serene); don't warm the palette; don't make the cascade uniform.

## 7. Open questions

- Is there a matching *construct* (lines→solid) version? A bidirectional pair would power strong transitions.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: art plate; the cascade is noted as a motif candidate, not a standalone component.
