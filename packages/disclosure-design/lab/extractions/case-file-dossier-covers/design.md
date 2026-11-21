---
title: Design — case-file-dossier-covers
description: GOLD tier — vision-written 2026-08-13 (self). Found-folder dossier collage.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Case File Dossier Covers
source: extractions/case-file-dossier-covers/case-file-dossier-covers.png
captured_at: 2026-08-13
colors:
  stock: "#d7ceba"
  taupe: "#c6b9a3"
  olive-tan: "#938776"
  brown-grey: "#74695a"
  ink: "#0b0b0a"
typography:
  memo:
    fontFamily: "typewriter mono (Courier-class)"
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Case File Dossier Covers

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/case-file-dossier-covers/case-file-dossier-covers.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: memo body text is illegible at this size — letterforms (typewriter mono) identifiable, words not. Photograph tint read is reliable; the figure's identity is not the subject and is not claimed.

## TL;DR

A "found folder" collage: tinted photo of a suited figure holding a CASE FILE folder, layered over a typewritten memo on aged beige stock. The disclosure aesthetic's documentary grammar — evidence above, record below.

## 1. Visual identity

**Personality**: bureaucratic, secretive, archival, analogue, withheld.
**Mood**: institutional secrecy made mundane — the beige thrill of the forbidden file.
**Detectable stylistic references**: Cold-War file-room ephemera, x-files title language, mid-century government print (manila, typewriter, rubber stamp).
**Information density**: balanced — two documents, layered, with breathing room.
**Implicit positioning**: series/film artifact or editorial illustration about classified material; the vault's "document" register.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes truth is filed, not published: disclosure arrives as paperwork, and paperwork has a texture — manila, carbon, ribbon ink. Every aesthetic choice serves verisimilitude: desaturated stock, physical layering, typewriter mono. The design asks the viewer to feel like the *finder* of the document, not its audience.

### 1.3 The ONE brand thing

- **The thing**: the evidence-over-record layering — a photograph physically stacked on a typed memo.
- **Why it carries the brand**: the stack is what makes it a *file* rather than a poster; remove the layering and both pieces become flat clip-art documents.
- **How everything else supports it**: desaturated beige family unifies disparate pieces; near-black ink is reserved for lettering and the suit; no ornament.
- **Where it appears**: covers, episode/series artifacts, dossier-section openers. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `stock` | `#d7ceba` | base paper | ✅ pixel |
| `taupe` | `#c6b9a3` | secondary paper | ✅ pixel |
| `olive-tan` | `#938776` | aged photo tone | ✅ pixel |
| `brown-grey` | `#74695a` | shadow / wear | ✅ pixel |
| `ink` | `#0b0b0a` | suit, lettering, type | ✅ pixel |

Typography: typewriter-family mono on the memo (Courier-class); family beyond that unclaimable at this size.

## 3. Components inventory

Signature: **dossier stack** (photo evidence + typed record on stock). Generic: none — prop-document art, not UI.

## 4. Layout & composition

Portrait field; photograph in the upper half, memo in the lower half; shallow physical stack with soft inter-layer shadows; vertical reading order: person → paperwork.

## 5. Reconstruction notes

As UI: asset-class (the collage's value is physical texture). A UI dossier-card *informed* by this would use `stock`/`taupe` surfaces, hairline brown-grey borders, and mono labels — but that is a derived component, not this frame. Quick wins: five-swatch palette is fully measured. Tricky bits: paper grain and layer shadows need raster texture; flat CSS fills will read as "beige website," not "file."

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | dossier-collage read is unambiguous |
| Colors | ✅ | five pixel-grounded swatches |
| Typography | ⚠️ | typewriter class certain, exact face unclaimable |

## 6. Do's and Don'ts

**Do** — keep everything in the aged-paper family; let layer edges cast soft shadows; set any label in a typewriter mono.

**Don't** — don't saturate; don't add blue "classified" stamps in pure primary colors (aged ink only); don't flatten the stack into a single plane; don't modernize the mono into a geometric sans.

## 7. Open questions

- What does the memo say? Body text illegible at this size — needs the source scan.
- Are the `-02`…`-08` siblings alternate covers of the same folder or different folders? Cluster cross-check flag.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: prop-document collage, not a UI screen.
