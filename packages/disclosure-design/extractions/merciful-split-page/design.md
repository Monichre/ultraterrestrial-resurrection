---
title: Design — merciful-split-page
description: GOLD tier — vision-written 2026-08-13 (self). Light ink-on-cream split page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Merciful Split — Ink on Cream
source: extractions/merciful-split-page/merciful-split-page.png
captured_at: 2026-08-13
colors:
  paper: "#c3baaa"
  ink: "#191817"
  ink-soft: "#2d2b29"
  grey-mid: "#a7a092"
  grey-low: "#666259"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Merciful Split (Ink on Cream)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the light/line twin of the dossier split.

## Source

- **Source type**: local image · **Path**: `extractions/merciful-split-page/merciful-split-page.png` (1856×2464)
- **Capture method**: direct vision
- **Detected limitations**: cursive body illegible; quote partially legible. Generation artifact (broken hand icons, top edge) noted honestly as part of the artifact.

## TL;DR

The light, line-drawn twin of `lovecraft-dossier-split`: black ink on cream, cursive testimony left (ending in redaction scribbles), a tall hatch-walled corridor with a reaching hand right, the "merciful" quote tracked across the foot. Dread made legible.

## 1. Visual identity

**Personality**: stark, graphic, literary, claustrophobic.
**Mood**: confession typeset for the record.
**Detectable stylistic references**: weird-fiction letterpress, ink illustration, zine/print literary objects, typographic footers.
**Information density**: high text mass + one strong graphic corridor.
**Implicit positioning**: the *print* variant of the Lovecraft split — flatter, more graphic, more literary than the rendered dark version.
**Confidence**: ✅ high.

### 1.2 Brand voice

The same confession, on the record. Where the dark dossier whispers, this one prints — flat ink, high contrast, the corridor and the hand reduced to pure graphic statement.

### 1.3 The ONE brand thing

- **The thing**: the hatch corridor — a claustrophobic vertical space built purely from parallel ink lines, with a small hand at its base.
- **Why it carries the brand**: it shows the line language can build *space and dread*, not just ornament — architecture from hatching alone.
- **How everything else supports it**: cream/ink contrast and the tracked-caps quote give it printed-literary authority.
- **Where it appears**: chapter openers, literary print pieces, quote plates, the light register of the dossier system. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#c3baaa` | page ground | ✅ pixel |
| `ink` | `#191817` | primary line/text | ✅ pixel |
| `ink-soft` | `#2d2b29` | secondary dark | ✅ pixel |
| `grey-mid` | `#a7a092` | hatch density | ✅ pixel |
| `grey-low` | `#666259` | deep hatch | ✅ pixel |

Typography: cursive hand for body; tracked-out uppercase serif/engraved caps for the quote. ⚠️ medium (faces inferred).

## 3. Components inventory

Signature: **hatch-corridor figure** + **manuscript/evidence split + quote foot**. Generic: two-column layout, tracked caption. The corridor is a strong standalone motif.

## 4. Layout & composition

Portrait. Strong vertical split (~50/50): left cursive column ending in redaction blocks, right a tall narrow corridor of dense vertical hatching with a small hand at its base. Quote spans the full foot in tracked caps. The corridor's verticals pull the eye up; the hand anchors it.

## 5. Reconstruction notes

As UI: asset-class, but the corridor motif and the split+quote layout are both extractable. The hatch corridor is genuinely buildable in SVG (repeating vertical lines with varying density). Tricky bits: hatch must vary in weight/spacing to read as space, not as a flat pattern; uniform hatching flattens it.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | light split + corridor unambiguous |
| Colors | ✅ | pixel-grounded cream/ink set |
| Typography | ⚠️ | hand + engraved caps inferred |

## 6. Do's and Don'ts

**Do** — keep it flat and graphic; vary hatch density for spatial depth; let the redaction blocks stay brutal.

**Don't** — don't render/shade it (that's the dark sibling's job); don't remove the redaction scribbles; don't tighten the quote tracking.

## 7. Open questions

- The broken hand icons (top) are a generation artifact — keep as provenance/honesty marker, or note for a clean re-render? Flag for curation decision.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: literary print page; body and figure are raster art.
