---
title: Design — roswell-clauson-page
description: GOLD tier — vision-written 2026-08-13 (self). Ghosted newsprint palimpsest.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Roswell Clauson — Faded Page
source: extractions/roswell-clauson-page/roswell-clauson-page.png
captured_at: 2026-08-13
colors:
  silvered-paper: "#c5c5bd"
  page-median: "#c3c3bb"
  ghost-ink: "#3d4143"
  halftone-haze: "#9da19f"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Roswell Clauson (Faded Page)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: degradation as the design material.

## Source

- **Source type**: local image · **Path**: `extractions/roswell-clauson-page/roswell-clauson-page.png` (896×1344)
- **Capture method**: direct vision
- **Detected limitations**: body text genuinely illegible — only word-islands quoted. Whether this is a true scan or a render *of* fading is undecidable at this fidelity; described at the level of what is seen.

## TL;DR

A newspaper page whose ink has ghosted back into the paper: column rules still stand, content has evaporated to a handful of words and one dissolving halftone photo. Structure outliving information — the most erased artifact in the dossier register.

## 1. Visual identity

**Personality**: spectral, patient, archival, withholding.
**Mood**: the melancholy of evidence time nearly erased.
**Detectable stylistic references**: palimpsest manuscripts, microfilm archives, found-document horror, newsprint noir.
**Information density**: inverted — a high-density *format* holding near-zero surviving information.
**Implicit positioning**: the inner-page counterpart to the vault's manila dossier covers; the "primary source" those folders would contain.
**Confidence**: ✅ high (subject, medium, degradation all unambiguous).

### 1.2 Brand voice

The record is fragile. The brand treats documents as things that decay — legibility is temporary, and what survives (a word, a photo-ghost) is made precious by the loss around it.

### 1.3 The ONE brand thing

- **The thing**: contrast collapse — a page designed for ~10:1 ink-on-paper now reading ~6:1, structure intact, content fogged.
- **Why it carries the brand**: it makes *time* the visible designer; no texture overlay fakes this — the degradation is in the signal itself.
- **How everything else supports it**: the column skeleton gives the eye a grid to mourn against; the clipping-hole proves handling and loss.
- **Where it appears**: dossier interiors, evidence plates, redaction/erasure motifs, loading states that "fade in from fog". ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `silvered-paper` | `#c5c5bd` | page ground | ✅ pixel |
| `page-median` | `#c3c3bb` | mid ground | ✅ pixel |
| `ghost-ink` | `#3d4143` | surviving text/rules | ✅ pixel |
| `halftone-haze` | `#9da19f` | photo ghost | ✅ pixel |

Typography: a text serif of the newspaper-roman class is implied by the column measure, but no letterform is legible enough to name. Confidence: ⚠️ low — omit.

## 3. Components inventory

Signature: **degraded-document plate** (column skeleton + ink islands). Generic: none — artifact, not UI.

## 4. Layout & composition

Portrait broadsheet, strict multi-column grid, column rules running full height; content mass concentrated upper-left (the surviving words) and center (the photo ghost); lower two-thirds near-empty — the fade is spatial as well as tonal.

## 5. Reconstruction notes

As UI: asset-class, but the *mechanic* is worth extracting — a `DegradedDocument` treatment: take any text block, render it at `--color-text-secondary` against `--color-bg-primary`, then mask ~80% of words to near-zero opacity, leaving rules and islands. Tricky bits: the fade must be *per-word*, not a global opacity wash, or it reads as a lazy filter.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | faded-newspaper read unambiguous |
| Colors | ✅ | pixel-grounded achromatic set |
| Typography | ⚠️ | implied serif, no legible letterforms |

## 6. Do's and Don'ts

**Do** — display flat and full-page; let the silence read; pair with the manila dossier covers as container → contents.

**Don't** — don't "restore" contrast; don't add coffee-stain clip-art (this degradation is tonal, not stained); don't typeset real content into it.

## 7. Open questions

- Is there a sharper capture of the same page elsewhere in the vault? The surviving words ("Phillies", "River") suggest a real masthead worth cross-referencing.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: archival document artifact, not a UI screen.
