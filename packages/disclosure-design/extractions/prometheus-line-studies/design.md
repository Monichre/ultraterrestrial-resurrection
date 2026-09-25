---
title: Design — prometheus-line-studies
description: GOLD tier — vision-written 2026-08-13 (self). Atelier line-study art direction.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Prometheus Line Studies — Titan Identity Plate
source: extractions/prometheus-line-studies/prometheus-line-studies.png
captured_at: 2026-08-13
colors:
  paper: "#bdb297"
  paper-shade: "#a49980"
  ink: "#121618"
typography:
  annotation:
    fontFamily: "ui-monospace, monospace"
    textTransform: uppercase
    letterSpacing: 0.08em
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Prometheus Line Studies

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/prometheus-line-studies/prometheus-line-studies.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: annotation text (if any) below legibility threshold; no UI chrome present to extract type scale from.

## TL;DR

A Titan head measured like a relic: atelier pencil hatching on warm dot-grid paper, wrapped in draughtsman's construction circles. The identity lives in the collision — myth rendered as engineering worksheet.

## 1. Visual identity

**Personality**: studious, mythic, hand-wrought, diagrammatic.
**Mood**: reverent measurement; quiet gravity.
**Detectable stylistic references**: Renaissance cartoon underdrawings, patent-figure annotation, engineering-journal grid culture.
**Information density**: moderate — figure + geometry, generous paper margin.
**Implicit positioning**: identity-level art for a project that treats myth as research material.
**Confidence**: ✅ high.

### 1.2 Brand voice

Nothing here is polished for display; the drawing is caught mid-thought. Hatching is work, the grid is work, the circles are work — the brand speaks through evidence of process, not finish.

### 1.3 The ONE brand thing

- **The thing**: fine ink hatching + hairline construction geometry on warm grid paper.
- **Why it carries the brand**: it is the myth-as-specimen thesis in a single mark-making system.
- **How everything else supports it**: duotone palette refuses decoration; margins stay empty so the worksheet reads as one plate.
- **Where it appears**: identity plates, section openers, dossier covers. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#bdb297` | ground | ✅ pixel |
| `paper-shade` | `#a49980` | paper shadow / grid tone | ✅ pixel |
| `ink` | `#121618` | line + hatch | ✅ pixel |

Typography: none set in-frame; annotation style would be uppercase mono at caption size (⚠️ inferred from genre, not observed).

## 3. Components inventory

Signature: **identity plate** (centered figure study, construction overlay, grid paper ground). Generic: none — art, not UI.

## 4. Layout & composition

Portrait, head high-center, geometry radiating to margins; grid sets an even worksheet rhythm; negative space is the luxury.

## 5. Reconstruction notes

As UI: asset-class (hatching, paper tooth) — use as hero/section art inside dark or paper shells. Quick wins: duotone palette + mono captions. Tricky bits: hatch texture cannot be CSS'd; needs raster asset.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | unambiguous atelier-meets-engineering read |
| Colors | ✅ | three-swatch duotone, pixel-grounded |
| Typography | ⚠️ | inferred from genre only |

## 6. Do's and Don'ts

**Do** — keep ink truly near-black; let hatch carry tone; preserve visible grid as process evidence.

**Don't** — don't add accent color; don't wash the paper to pure white; don't crop the construction circles.

## 7. Open questions

- Should annotation captions be real text overlays in-product? Undecided; plate carries none legibly.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: identity art, not a UI screen.
