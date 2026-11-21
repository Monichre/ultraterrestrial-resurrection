---
title: Design — nasa-dossier-1978
description: GOLD tier — vision-written 2026-08-13 (self). Sun-faded post-Apollo dossier page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: NASA Dossier 1978
source: extractions/nasa-dossier-1978/nasa-dossier-1978.png
captured_at: 2026-08-13
colors:
  cream: "#dacba8"
  tan: "#c3b698"
  dusty-rose: "#b2968c"
  mauve-brown: "#836d6f"
  olive-grey: "#8c8b7c"
typography:
  body:
    fontFamily: "typewriter mono (Courier-class)"
  header:
    fontFamily: "agency letterhead sans (gothic-class)"
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — NASA Dossier 1978

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/nasa-dossier-1978/nasa-dossier-1978.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: body text illegible at this size — typewriter class certain, content not; the photograph's exact subject (spacecraft vs. astronaut) read at the level of class. Whether this is a genuine scan or a faithful facsimile is unclaimable from the pixels.

## TL;DR

A sun-faded NASA dossier page from 1978: cream stock, dusty-rose photo tint, typewriter columns. The warm, sincere end of the disclosure-document register — press-kit optimism aged four decades.

## 1. Visual identity

**Personality**: archival, earnest, bureaucratic, sun-faded, gently heroic.
**Mood**: faded optimism — the space age remembered through forty years of sunlight.
**Detectable stylistic references**: post-Apollo government print, agency press kits, offset-print letterhead.
**Information density**: balanced — one photo anchor, header, text columns, stamp furniture.
**Implicit positioning**: found-artifact page for editorial/series use; the document register's warm pole.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes institutional sincerity ages well: this page was optimistic without irony, and sunlight has only made it more honest. Wear is treated as provenance — fading is not damage but *evidence of time*, and the design would rather show forty years of sun than fake a crisp reprint.

### 1.3 The ONE brand thing

- **The thing**: unified sun-fading — red ink and photo tint decayed together into the same dusty rose.
- **Why it carries the brand**: it is the signature of *real* aging; a facsimile that fades its elements separately reads as costume.
- **How everything else supports it**: the whole palette sits in the warm cream/tan family so the rose reads as time, not as a color choice.
- **Where it appears**: document openers, artifact pages, era-establishing material. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `cream` | `#dacba8` | stock | ✅ pixel |
| `tan` | `#c3b698` | secondary stock / shadow | ✅ pixel |
| `dusty-rose` | `#b2968c` | faded photo tint + old red ink | ✅ pixel |
| `mauve-brown` | `#836d6f` | text weight | ✅ pixel |
| `olive-grey` | `#8c8b7c` | shadow neutral | ✅ pixel |

Typography: typewriter mono body (Courier-class); agency letterhead sans in the header (gothic-class) — both class-level ⚠️.

## 3. Components inventory

Signature: **dossier page** (header + photo anchor + type columns + stamp furniture). Generic: none — prop document, not UI.

## 4. Layout & composition

Landscape page; header top, photograph as visual anchor, type in bureaucratic columns, stamps/signatures at margins — the paper-dossier grammar of the pre-digital era.

## 5. Reconstruction notes

As UI: asset-class (the value is aged materiality). A derived UI "document card" would take `cream`/`tan` surfaces, `mauve-brown` text, and dusty-rose accents for stamps/labels — derived, not this frame. Quick wins: five-swatch warm scale fully measured. Tricky bits: unified fading is the whole effect — tint photo and ink with the *same* rose or the illusion breaks; paper grain required.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | dossier-page read is unambiguous |
| Colors | ✅ | pixel-grounded warm scale |
| Typography | ⚠️ | classes certain, faces unclaimable |

## 6. Do's and Don'ts

**Do** — keep every element in the sun-aged family; fade ink and imagery together; let stamps and signatures sit at margins, slightly rotated.

**Don't** — don't use saturated NASA red/blue (the worm logo's colors must arrive *faded*); don't crisp the type — offset print softness is required; don't mix with the colder beige of `case-file-dossier-covers` in one layout.

## 7. Open questions

- Genuine 1978 scan or modern facsimile? Unclaimable from pixels — provenance check against the source collection.
- What does the page record? Body text illegible; needs a higher-resolution capture.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: prop document, not a UI screen.
