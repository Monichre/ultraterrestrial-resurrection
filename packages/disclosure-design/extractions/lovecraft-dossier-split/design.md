---
title: Design — lovecraft-dossier-split
description: GOLD tier — vision-written 2026-08-13 (self). Noir manuscript/evidence split page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Lovecraft Dossier — Manuscript/Evidence Split
source: extractions/lovecraft-dossier-split/lovecraft-dossier-split.png
captured_at: 2026-08-13
colors:
  ground: "#211f1d"
  ground-median: "#22201e"
  taupe: "#998f86"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Lovecraft Dossier (Manuscript/Evidence Split)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the split as narrative device.

## Source

- **Source type**: local image · **Path**: `extractions/lovecraft-dossier-split/lovecraft-dossier-split.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: cursive body illegible; quote partially legible ("The most merciful thing in the world… correlate all its contents"). Structure observed, not full text.

## TL;DR

A noir dossier page split vertically: dense cursive testimony left, a rendered hand reaching toward a hatched portal right, the "most merciful thing" quote spanning the foot. The rendered counterpart to `merciful-split-page`.

## 1. Visual identity

**Personality**: confessional, occult, noir, hushed.
**Mood**: dread tempered by confession.
**Detectable stylistic references**: weird-fiction case files, noir evidence boards, manuscript facsimiles, horror ARG documents.
**Information density**: high text mass balanced against a single strong image.
**Implicit positioning**: the dossier *interior* — the testimony inside the manila covers; rendered sibling of the line-drawn split.
**Confidence**: ✅ high.

### 1.2 Brand voice

Testimony as evidence. The brand lets a first-person voice and a forensic image sit side by side and implicate each other — neither is believed alone.

### 1.3 The ONE brand thing

- **The thing**: the vertical split — manuscript | evidence — with the quote as a unifying foot.
- **Why it carries the brand**: it is a *narrative* layout device, not decoration; the split stages the vault's core tension (what is written vs. what is seen).
- **How everything else supports it**: the warm dark ground and single taupe value keep text and image in one hushed register.
- **Where it appears**: dossier interiors, chapter openers, testimony+evidence spreads, the "case file" content type. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ground` | `#211f1d` | page ground | ✅ pixel |
| `ground-median` | `#22201e` | median | ✅ pixel |
| `taupe` | `#998f86` | text + rendered image | ✅ pixel |

Typography: body is cursive handwriting (a hand font); the quote is a wide-tracked uppercase serif or engraved caps, small, letterspaced. ⚠️ medium (faces inferred).

## 3. Components inventory

Signature: **manuscript/evidence split** (text column + image column + unifying quote foot). Generic: two-column layout, caption — a real layout pattern worth extracting.

## 4. Layout & composition

Portrait. Strong vertical split roughly 50/50: left a dense cursive text block, right a tonal image (hand + hatched portal) with the bright portal upper-right. The quote spans full width at the foot in small caps, acting as a baseline. Composition stages a dialogue between testimony (left) and evidence (right).

## 5. Reconstruction notes

As UI: the split layout is a genuine, buildable pattern — a two-column `DossierSplit` (text | figure) with a full-width `footer` quote, on `ground` with `taupe` text. This is a candidate for a component, though the handwritten body and rendered hand remain raster assets. Tricky bits: the quote foot must be wide-tracked and quiet — a loud caption breaks the hush.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | split-dossier read unambiguous |
| Colors | ✅ | pixel-grounded warm dark set |
| Typography | ⚠️ | hand + engraved caps inferred |

## 6. Do's and Don'ts

**Do** — keep text and image in one tonal register; let the portal be the only bright event; set the quote quiet and wide-spaced.

**Don't** — don't add a second accent color; don't justify the cursive into tidy columns; don't separate the quote from the page foot.

## 7. Open questions

- Confirm the pairing with `merciful-split-page` (same quote, line-drawn vs. rendered) and link them as deliberate variants.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: body content is raster art (handwriting, rendered hand); the split *layout* is noted as a future pattern candidate.
