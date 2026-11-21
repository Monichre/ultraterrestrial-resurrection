---
title: Design — journal-crop-handd
description: GOLD tier — vision-written 2026-08-13 (self). Close crop across a worked journal page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Journal Crop — Worked Surface Texture
source: extractions/journal-crop-handd/journal-crop-handd.png
captured_at: 2026-08-13
colors:
  paper: "#d7c8ae"
  kraft: "#bfb19a"
  honey: "#b7a993"
  ink: "#1f1e1c"
  pencil: "#675f54"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Journal Crop (Worked Surface Texture)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: material texture over composed document.

## Source

- **Source type**: local image · **Path**: `extractions/journal-crop-handd/journal-crop-handd.png` (2464×1856)
- **Capture method**: direct vision
- **Detected limitations**: handwriting illegible at this crop/angle; described as texture and structure, not content.

## TL;DR

A tight landscape crop across a worked dot-grid journal page — dense handwriting colliding with hand-drawn diagrams, content running off all edges. The most tactile, least staged of the journal cluster: a texture/background, not a document.

## 1. Visual identity

**Personality**: intimate, dense, unguarded, tactile.
**Mood**: leaning over the page, ink still wet.
**Detectable stylistic references**: documentary texture shots, macro paper photography, process-film close-ups.
**Information density**: high and even, edge-to-edge.
**Implicit positioning**: the material sibling of the journal pages — the *surface*, not the spread.
**Confidence**: ✅ high.

### 1.2 Brand voice

Materiality as honesty. The brand is willing to get close enough to show ink-bleed and hand pressure — the page as a worked physical thing, not a layout.

### 1.3 The ONE brand thing

- **The thing**: the crop-as-window — content running off every edge, refusing to compose a tidy page.
- **Why it carries the brand**: it converts the journal from a *document* into a *texture*; a reusable warm-analog surface.
- **How everything else supports it**: the warmest paper palette in the batch and the even density make it read as material.
- **Where it appears**: textured backgrounds, section dividers, behind-glass "evidence" textures, warm analog overlays. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#d7c8ae` | page ground | ✅ pixel |
| `kraft` | `#bfb19a` | median / recess | ✅ pixel |
| `honey` | `#b7a993` | paper tooth warmth | ✅ pixel |
| `ink` | `#1f1e1c` | handwriting | ✅ pixel |
| `pencil` | `#675f54` | secondary marks | ✅ pixel |

Typography: cursive handwriting — a hand font if typeset; texture-level, not legible copy.

## 3. Components inventory

Signature: **worked-surface texture**. Generic: none — a texture/background asset, not UI.

## 4. Layout & composition

Landscape; off-center close crop, no margins, content running off all edges; even density across the frame. Composition is deliberately *uncomposed* — a window onto a larger surface.

## 5. Reconstruction notes

As UI: asset-class — a background/texture. Use as a `background-image` at low opacity or under a `--color-bg-primary` wash; the warm palette pairs with the dossier/journal system. Tricky bits: it must stay a *texture* — if the handwriting becomes legible it competes with UI text; keep it blurred, faded, or behind content.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | journal-crop texture unambiguous |
| Colors | ✅ | pixel-grounded warm paper set |
| Typography | ⚠️ | handwriting, texture-level |

## 6. Do's and Don'ts

**Do** — use as a warm analog background; keep it faded/blurred behind content; lean into the warmth.

**Don't** — don't present it as a readable document; don't cool the palette; don't tile it (the crop's edge-off density is the point).

## 7. Open questions

- Is this a crop of the same physical page as `hand-annotated-journal`? If so, register them as surface ↔ spread.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: texture/background asset, not a UI screen.
