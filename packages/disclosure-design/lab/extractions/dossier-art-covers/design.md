---
title: Design — dossier-art-covers
description: GOLD tier — vision-written 2026-08-13 (self). Dossier cover art direction.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Dossier Art — Socorro & Roswell Evidence Folders
source: extractions/dossier-art-covers/dossier-art-covers.png
captured_at: 2026-08-13
colors:
  kraft: "#aa8544"
  kraft-dark: "#89632f"
  kraft-shadow: "#6c4c23"
  ground: "#15150e"
  ink: "#1c1a14"
  stamp-red: "#a33b2a"
typography:
  label:
    fontFamily: "Courier, ui-monospace, monospace"
    textTransform: uppercase
  band:
    fontFamily: "grotesk condensed, sans-serif"
    letterSpacing: 0.2em
    textTransform: uppercase
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Dossier Art: Socorro & Roswell Evidence Folders

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/dossier-art-covers/dossier-art-covers.png` (1024×1536)
- **Capture method**: direct vision
- **Detected limitations**: stamp red hex inferred (below sampler's chroma threshold); small typed text partly illegible.

## TL;DR

Two manila evidence-folder covers staged like seized records — typed labels, routing boxes, red EYES ONLY stamp. The entire identity is mid-century records bureaucracy rendered tactile; darkness and wear do the emotional work.

## 1. Visual identity

**Personality**: bureaucratic, noir-archival, tactile, confidential, sober.
**Mood**: withheld knowledge; institutional gravity.
**Detectable stylistic references**: FOIA releases, FBI vault files, true-crime evidence boards, NASA/USAF project folders.
**Information density**: balanced — real cover-sheet density, not cluttered.
**Implicit positioning**: research-archive product that treats documents as physical evidence.
**Confidence**: ✅ high.

### 1.2 Brand voice

The design believes truth is *filed*, not published. Kraft paper, typewriter ink and rubber stamps say: this material pre-exists you, survived redaction, and must be handled with care. Nothing is decorative; every mark is a bureaucratic trace — a case number, a routing slip, a warning.

### 1.3 The ONE brand thing

- **The thing**: the manila folder as object — kraft tone + typed label + stamp.
- **Why it carries the brand**: without the physical-records metaphor the project is just another dark UI.
- **How everything else supports it**: ground stays near-black and empty; no competing chrome.
- **Where it appears**: covers, document shells, case-file surfaces. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `kraft` | `#aa8544` | folder body | ✅ pixel |
| `kraft-dark` | `#89632f` | folder shade | ✅ pixel |
| `kraft-shadow` | `#6c4c23` | folds/edges | ✅ pixel |
| `ground` | `#15150e` | surround | ✅ pixel |
| `stamp-red` | `#a33b2a` | EYES ONLY stamp | ⚠️ visual |

Typography: typewriter mono for labels (uppercase, ragged alignment); condensed gothic caps with wide tracking for classification bands. No radii — paper corners only.

## 3. Components inventory

Signature: **case-folder cover** (kraft body, typed label block top-third, stamp overlay, classification band top edge). Generic: none — this is art, not UI.

## 4. Layout & composition

Two-up symmetrical stack, slight angle for tactility, top-lit, vignette ground. Portrait.

## 5. Reconstruction notes

As UI: folder covers are asset-class (paper fiber, stamp ink) — wrap in code shells. Quick wins: kraft palette + mono labels + red stamp accent. Tricky bits: paper grain and stamp over-inking need texture assets.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | unambiguous records metaphor |
| Colors | ✅ | kraft tones pixel-grounded |
| Typography | ⚠️ | faces inferred from letterforms |

## 6. Do's and Don'ts

**Do** — keep stamps red and singular; align labels to the top third like real cover sheets; let wear and vignette carry age.

**Don't** — don't add color beyond kraft/ink/red; don't use rounded UI corners on folder surfaces; don't modernize the typewriter face.

## 7. Open questions

- Is stamp red a canonical token (`--color-classified`)? Not declared elsewhere yet.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: document art, not a UI screen.
