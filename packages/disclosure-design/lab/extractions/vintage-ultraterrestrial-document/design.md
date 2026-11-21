---
title: Design — vintage-ultraterrestrial-document
description: GOLD tier — vision-written 2026-08-13 (self). Occult-scientific journal page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Vintage Ultraterrestrial Document
source: extractions/vintage-ultraterrestrial-document/vintage-ultraterrestrial-document.png
captured_at: 2026-08-13
colors:
  paper: "#ded5bf"
  ink: "#1b1c1e"
  aged-tan: "#cac1b0"
  foxed: "#b5aea0"
  age-spot: "#938e85"
typography:
  masthead:
    fontFamily: "condensed grotesque, sans-serif"
    fontWeight: 700
    letterSpacing: 0.02em
  body:
    fontFamily: "serif"
    fontSize: 10px
    lineHeight: 1.4
  motto:
    fontFamily: "serif"
    letterSpacing: 0.35em
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Vintage Ultraterrestrial Document

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/vintage-ultraterrestrial-document/vintage-ultraterrestrial-document.png` (896×1344)
- **Capture method**: direct vision
- **Detected limitations**: body text is below x-height legibility (reads as justified gray columns); masthead and motto legible; illustration halftone summarized.

## TL;DR

A complete fringe-cosmology journal page: condensed masthead, two celestial halftones, justified columns, and a SOLVE COAGULA footer. The vault's most fully typeset artifact.

## 1. Visual identity

**Personality**: earnest, archival, occult-scientific, crackpot-rigorous.
**Mood**: belief preserved in foxed paper.
**Detectable stylistic references**: Flammarion-era astronomy publishing, letterpress pamphlets, fringe journals.
**Information density**: saturated — a full page, properly composed.
**Implicit positioning**: the document cluster's composed-page pole; the treatise as artifact.
**Confidence**: ✅ high.

### 1.2 Brand voice

Rigor in service of wonder. The design believes its audience respects *form* as evidence — that a wrong idea set in proper columns with real diagrams carries more conviction than a right one in a chat window. Typography as testimony.

### 1.3 The ONE brand thing

- **The thing**: the page as complete system — masthead, figures, columns, motto, all in one composed artifact.
- **Why it carries the brand**: it's the vault's proof that the disclosure register extends to *typography*; the document itself is the disclosure aesthetic.
- **How everything else supports it**: palette stays aged-paper monochrome; no ornament beyond letterpress rules; the foxing does the atmosphere.
- **Where it appears**: artifact plates, chapter fronts, facsimile inserts. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#ded5bf` | page | ✅ pixel |
| `ink` | `#1b1c1e` | type + halftone | ✅ pixel |
| `aged-tan` | `#cac1b0` | page mids | ✅ pixel |
| `foxed` | `#b5aea0` | age staining | ✅ pixel |
| `age-spot` | `#938e85` | deepest foxing | ✅ pixel |

Typography: masthead condensed grotesque 700 caps; body serif justified ~10px; motto serif caps +0.35em tracking — treatment ✅, exact faces ⚠️ (unverifiable from a scan).

## 3. Components inventory

Signature: **treatise page** (masthead + figure band + columns + motto). Generic: letterpress rules, halftone figures. Print, not screen — no UI components.

## 4. Layout & composition

Portrait 2:3; centered masthead; two-figure band; justified columns; motto footer; strict symmetry; foxed margins as frame.

## 5. Reconstruction notes

As UI: hybrid — the page skeleton (masthead, columns, rules, motto) is honest HTML/CSS on a `#ded5bf` ground; the two halftone illustrations are asset-class. Quick wins: letterpress texture = aged-paper ground + near-black ink. Tricky bits: foxing must be *uneven* (edges and spots, not a uniform tint); justified serif with real hyphenation or the columns read as pastiche.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | treatise-page read unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | ⚠️ | treatment clear, faces inferred |

## 6. Do's and Don'ts

**Do** — set the masthead in condensed bold caps; justify the columns; keep foxing to edges and spots; track the motto wide.

**Don't** — don't modernize to a sans body; don't clean the paper to white; don't add color beyond ink.

## 7. Open questions

- Is this page part of a multi-page document set (paper-scan-stills as siblings)? Cluster-link note.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: print document, not a UI screen (layout guidance lives in §5).
