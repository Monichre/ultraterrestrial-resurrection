---
title: Design — line-batch-8kto
description: GOLD tier — vision-written 2026-08-13 (self). Scanned motif-taxonomy journal page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Line Batch — Motif Taxonomy Page
source: extractions/line-batch-8kto/line-batch-8kto.png
captured_at: 2026-08-13
colors:
  paper: "#dad1c4"
  paper-shadow: "#c8beb3"
  ink: "#0e0e0e"
  sepia-stain: "#907e6c"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Line Batch (Motif Taxonomy Page)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: analog texture / archival mood.

## Source

- **Source type**: local image · **Path**: `extractions/line-batch-8kto/line-batch-8kto.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: handwriting is partly illegible at 928px — label text quoted only where confident ("PYRAMID SCHEME", "HATCH", "FLUX" class); exact dot-grid pitch not measured.

## TL;DR

A scanned dot-grid journal page that reads as a motif index — dozens of tiny hand-drawn line-art cells (pyramids, hatches, charts, squiggles, starbursts) captioned in pencil. The source library behind the vault's line-and-geometry language, caught in sepia paper and graphite.

## 1. Visual identity

**Personality**: methodical, obsessive, archival, warm-analog.
**Mood**: quiet industriousness — someone working through permutations.
**Detectable stylistic references**: engineering notebooks, taxonomy plates, zine-era sketchbook scans.
**Information density**: very high cell count, very low per-cell complexity — accumulation over hierarchy.
**Implicit positioning**: the *index* of the line-batch cluster — raw material, not a hero plate.
**Confidence**: ✅ high (subject and medium unambiguous).

### 1.2 Brand voice

Craft made visible. The brand keeps its sketchbooks open — process, iteration and hand-tremor are part of the product, not mess to be cleaned away.

### 1.3 The ONE brand thing

- **The thing**: the grid-as-taxonomy — one page, every variant of a mark, hand-labelled.
- **Why it carries the brand**: it turns "line and geometry" from a look into a *practice*; the rendered plates become excerpts from this notebook.
- **How everything else supports it**: paper tooth, sepia staining and uneven ink all argue this is a real worked page, not a styled graphic.
- **Where it appears**: about/process pages, colophon spreads, "how the marks are made" interstitials, texture source for overlays. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#dad1c4` | page ground | ✅ pixel |
| `paper-shadow` | `#c8beb3` | median / cell recess | ✅ pixel |
| `ink` | `#0e0e0e` | line work | ✅ pixel |
| `sepia-stain` | `#907e6c` | age/ink warmth | ✅ pixel |

Typography: hand-lettered pencil captions — reproduction, not a face. If typeset, a rough hand font or archival mono at 10–11px equivalent.

## 3. Components inventory

Signature: **motif-taxonomy grid** (repeating hand-drawn cell + caption). Generic: none — art/document scan, not UI.

## 4. Layout & composition

Portrait sheet; rows of small square-ish motif cells at near-regular pitch, labels below each; margins minimal, page nearly full. Visual flow is row-major reading order, like a specimen tray.

## 5. Reconstruction notes

As UI: asset-class / texture source. The grid structure *could* become a real gallery/index component (motif + label cards) — if built, use the token palette and let cells be `1fr` columns at `--spacing-md` gaps. Tricky bits: reproducing paper tooth and ink-tremor in CSS is not worth it — keep it raster; desaturating to pure greyscale kills the sepia warmth that distinguishes it.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | scan-of-notebook read is unambiguous |
| Colors | ✅ | pixel-grounded paper/ink/sepia |
| Typography | ⚠️ | hand-lettering legible only in part |

## 6. Do's and Don'ts

**Do** — show the whole page as an archival artifact; crop single cells as motif assets; pair with the rendered line plates as "source → output".

**Don't** — don't clean it up, straighten it, or re-ink it digitally; don't set long body text over it; don't cool the palette toward grey.

## 7. Open questions

- Do the other line-batch members reuse exact cells from this page? A cross-reference pass could wire index → plates as a navigable graph.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: archival document scan, not a UI screen.
