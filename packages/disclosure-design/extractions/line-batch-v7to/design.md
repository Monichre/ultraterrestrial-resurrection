---
title: Design — line-batch-v7to
description: GOLD tier — vision-written 2026-08-13 (self). Piranesi-style architectural capriccio.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Line Batch V7TO — Architectural Capriccio
source: extractions/line-batch-v7to/line-batch-v7to.png
captured_at: 2026-08-13
colors:
  ink: "#151616"
  paper: "#d9d0bc"
  hatch-mid: "#3b3a37"
  faded-gray: "#9d978a"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Line Batch V7TO (Architectural Capriccio)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/line-batch-v7to/line-batch-v7to.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: finest cross-hatch merges at this resolution; read as tonal fields with hatch texture, not individual strokes.

## TL;DR

A Piranesi-grade architectural fantasy in ink on bone paper — rotunda, arches, vaulted depth, all shadow built by hand. The line-batch cluster's architectural register.

## 1. Visual identity

**Personality**: erudite, theatrical, antiquarian, dense.
**Mood**: scholarly awe — grandeur through patience.
**Detectable stylistic references**: Piranesi etchings, neoclassical capriccios, 18th-century architectural frontispieces.
**Information density**: saturated — hatch everywhere except the paper margins.
**Implicit positioning**: the hand-worked anchor of the line-batch cluster; proof the vault's line language predates screens.
**Confidence**: ✅ high.

### 1.2 Brand voice

Conviction through labor. The design believes the audience feels the difference between a shadow that was *worked* and one that was filled — that density of hatch is a moral quality, patience made visible.

### 1.3 The ONE brand thing

- **The thing**: hatch-built shadow — every dark is woven from visible strokes, no wash, no fill.
- **Why it carries the brand**: it's the etching contract; break it with a flat fill and the whole register collapses into clip-art.
- **How everything else supports it**: paper stays warm and empty at the margins so the worked darks detonate; perspective stays strict so the fantasy stays credible.
- **Where it appears**: frontispieces, chapter opens, endpapers. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ink` | `#151616` | line and deepest hatch | ✅ pixel |
| `paper` | `#d9d0bc` | ground | ✅ pixel |
| `hatch-mid` | `#3b3a37` | mid-density shadow | ✅ pixel |
| `faded-gray` | `#9d978a` | distant/eroded line | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **capriccio plate** (rotunda + arches + vaulted perspective + hatch shadow). Generic: none — art, not UI.

## 4. Layout & composition

Landscape; colonnade perspective pulling right-to-center; dome and arches stacked upper-left; paper reserved at sky/margins; hatch density as the tonal engine.

## 5. Reconstruction notes

As UI: asset-class plate. Quick wins: two-tone palette drops onto any warm-paper page. Tricky bits: do not attempt CSS/SVG reproduction of the hatch at full density — it's asset-class labor; a *sparse* hatch motif (single arcade, few strokes) is the honest code translation.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | capriccio read unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — print it large; pair with warm paper stocks or `#d9d0bc` page grounds; let margins stay empty.

**Don't** — don't vectorize with flat fills; don't cool the paper; don't crop into the dome.

## 7. Open questions

- Do the other line-batch slugs (hj9p, pc26) share this architectural subject or diverge? Cluster note pending their vision passes.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: etching-style art, not a UI screen.
