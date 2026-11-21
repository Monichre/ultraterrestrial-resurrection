---
title: Design — prometheus-portrait-arrow
description: GOLD tier — vision-written 2026-08-13 (self). High-key emblem plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Prometheus Portrait + Arrow — High-Key Emblem
source: extractions/prometheus-portrait-arrow/prometheus-portrait-arrow.png
captured_at: 2026-08-13
colors:
  paper: "#e0dfd9"
  graphite: "#9b9fa1"
  ink: "#34383d"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Prometheus Portrait + Arrow

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/prometheus-portrait-arrow/prometheus-portrait-arrow.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: darkest token (`ink`) is inferred from the sibling sampler row and arrow weight, not from this folder's own swatch set (only two greys cleared the dedup threshold) — flagged ⚠️.

## TL;DR

The lightest Prometheus plate: an idealized graphite head on near-white, struck through by one diagonal arrow. Myth compressed toward a logo — maximum negative space, one assertive gesture.

## 1. Visual identity

**Personality**: airy, idealized, allegorical, poised.
**Mood**: heraldic calm; cool idealism.
**Detectable stylistic references**: neoclassical academic drawing, emblem books, fashion-illustration line economy.
**Information density**: low — two marks (head, arrow) on empty paper.
**Implicit positioning**: emblem/portrait plate; could carry a wordmark.
**Confidence**: ✅ high.

### 1.2 Brand voice

Restraint as authority. Where the line-studies sibling shows the work, this plate withholds it — the brand can afford silence, then one decisive diagonal.

### 1.3 The ONE brand thing

- **The thing**: the arrow diagonal interrupting a weightless graphite portrait.
- **Why it carries the brand**: it turns reverence into direction — fire brought *somewhere*.
- **How everything else supports it**: achromatic palette and empty field keep the diagonal singular.
- **Where it appears**: covers, title plates, chapter breaks. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#e0dfd9` | ground | ✅ pixel |
| `graphite` | `#9b9fa1` | portrait line | ✅ pixel |
| `ink` | `#34383d` | arrow / accent | ⚠️ visual |

Typography: none observed; plate is unlettered.

## 3. Components inventory

Signature: **emblem plate** (graphite portrait + single arrow diagonal). Generic: none — art, not UI.

## 4. Layout & composition

Portrait, head floating high-center in negative space, arrow diagonal as the only dynamic axis; static balance deliberately broken by the one gesture.

## 5. Reconstruction notes

As UI: asset-class emblem — drop onto `--color-bg-primary` shells; the near-white ground must NOT be flattened to pure white or the paper warmth dies. Quick wins: two-value palette, trivially themeable. Tricky bits: graphite line texture needs the raster asset.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | emblem read is unambiguous |
| Colors | ✅ | measured achromatic pair |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the field near-white warm grey (`#e0dfd9`), not `#fff`; let the arrow stay the only dark mass.

**Don't** — don't add grid, hatching, or annotations (that is the sibling plate's language); don't add color.

## 7. Open questions

- Is the arrow a reusable brand glyph on its own? Candidate, undecided.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: emblem art, not a UI screen.
