---
title: Design — line-batch-pc26
description: GOLD tier — vision-written 2026-08-13 (self). Ink-mass draped figure.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Line Batch PC26 — Draped Figure
source: extractions/line-batch-pc26/line-batch-pc26.png
captured_at: 2026-08-13
colors:
  paper: "#c6c0b6"
  aged-tan: "#a3998c"
  ink-navy: "#111418"
  true-black: "#000000"
  umber: "#71685d"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Line Batch PC26 (Draped Figure)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/line-batch-pc26/line-batch-pc26.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: the figure's identity (veiled statue vs. hooded person) is deliberately unresolved — description preserves the ambiguity.

## TL;DR

A draped classical figure poured from black ink on warm paper — the line-batch cluster's mass register, where shadow is sculpted rather than hatched.

## 1. Visual identity

**Personality**: severe, monumental, sculptural, hushed-dramatic.
**Mood**: a presence under the drape.
**Detectable stylistic references**: statue-study ink chiaroscuro, Piranesi figures, poster ink work.
**Information density**: low shape-count, extreme value contrast.
**Implicit positioning**: the boldest plate of the line-batch set; ink as mass, not line.
**Confidence**: ✅ high.

### 1.2 Brand voice

Weight as eloquence. The design believes the audience feels mass before it reads detail — that a figure built from poured black says more about mourning and monument than any rendered face, and that the unresolved form is an invitation, not a failure.

### 1.3 The ONE brand thing

- **The thing**: poured-black mass — shadow as a solid, cut by paper-white highlights.
- **Why it carries the brand**: it's the cluster's value extreme; the hatch plates measure, this one *weighs*.
- **How everything else supports it**: paper stays warm and empty; no line work competes with the blacks; the silhouette does everything.
- **Where it appears**: covers, posters, act-break plates. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#c6c0b6` | ground + highlights | ✅ pixel |
| `aged-tan` | `#a3998c` | paper mids | ✅ pixel |
| `ink-navy` | `#111418` | primary black (blue cast) | ✅ pixel |
| `true-black` | `#000000` | deepest folds | ✅ pixel |
| `umber` | `#71685d` | hatch transitions | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **draped-mass figure** (poured black + paper highlights + hatch edges). Generic: none — art, not UI.

## 4. Layout & composition

Landscape; draped mass centered as near-abstract monument; highlights cut from folds; silhouette dominant.

## 5. Reconstruction notes

As UI: asset-class plate. Quick wins: the two-black system (`#111418` + `#000000`) on warm paper is instantly deployable. Tricky bits: the navy cast in the primary black must survive — pure `#000` everywhere flattens the ink into clip-art; keep hatch only at shadow transitions.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | draped-figure read unambiguous |
| Colors | ✅ | pixel-grounded, five-value |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — preserve the two blacks; let the form stay unresolved; print/display large so the mass can do its work.

**Don't** — don't add facial detail; don't smooth the hatch transitions; don't cool the paper to white.

## 7. Open questions

- Does this figure connect to the classical-bust cluster (daedalus, marcus-aurelius) as the "draped" sibling? Curatorial note.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: ink illustration, not a UI screen.
