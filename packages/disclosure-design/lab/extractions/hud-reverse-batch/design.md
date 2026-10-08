---
title: Design — hud-reverse-batch
description: GOLD tier — vision-written 2026-08-13 (self). Light-polarity forensic HUD console.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: HUD Reverse Batch — Bone Console
source: extractions/hud-reverse-batch/hud-reverse-batch.png
captured_at: 2026-08-13
colors:
  paper: "#daccb6"
  cream: "#c5b6a0"
  ink: "#0c0c0c"
  tan-line: "#a7917b"
  umber-deep: "#3f332c"
typography:
  label-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 10px
    letterSpacing: 0.18em
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — HUD Reverse Batch (Bone Console)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/hud-reverse-batch/hud-reverse-batch.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: readout text is faux-microtype at this resolution — glyph content unreadable; type *treatment* (mono, tracked, hairline) is what's observable.

## TL;DR

The vault's HUD language photocopied onto bone paper: sepia wireframe face, hairline rules, mono microtype. A dossier, not a cockpit — forensic warmth instead of terminal glow.

## 1. Visual identity

**Personality**: clinical, archival, precise, quietly uneasy.
**Mood**: forensic intimacy — a person rendered as measurement.
**Detectable stylistic references**: vintage-futurist FUI, blueprint drafting, 70s government dossier graphics.
**Information density**: dense — columns, gauges, and ticks wall-to-wall, but all hairline-weight.
**Implicit positioning**: the archival pole of the HUD cluster; identity-verification theatre.
**Confidence**: ✅ high.

### 1.2 Brand voice

Measurement as intimacy. The design believes the audience reads scrutiny as care — that a face drawn in contour lines and surrounded by quiet data says "we know you precisely," and that paper-warmth keeps the surveillance from feeling cold.

### 1.3 The ONE brand thing

- **The thing**: polarity inversion — the cluster's wireframe HUD language printed in sepia ink on bone.
- **Why it carries the brand**: it converts the same geometry from operational (glowing terminal) to archival (filed document) — proof the system owns both registers.
- **How everything else supports it**: no fills, no glow, no color beyond the tan family; every element is a hairline.
- **Where it appears**: identity/verification screens, dossier plates, print-adjacent UI. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#daccb6` | field | ✅ pixel |
| `cream` | `#c5b6a0` | panel secondary | ✅ pixel |
| `ink` | `#0c0c0c` | primary line + microtype | ✅ pixel |
| `tan-line` | `#a7917b` | secondary rules, faded data | ✅ pixel |
| `umber-deep` | `#3f332c` | emphasis fills (rare) | ✅ pixel |

Typography: mono microtype, ~10px, +0.18em tracking, uppercase — treatment certain, family unverifiable (⚠️).

## 3. Components inventory

Signature: **contour-face medallion** (wireframe portrait as data object) + **hairline registration frame**. Generic: mono stat rows, reticle gauges, rule-separated header.

## 4. Layout & composition

Landscape console; face medallion left-center; data columns right; hairline inset frame with edge ticks; strict grid, zero radius, zero shadow.

## 5. Reconstruction notes

Suggested stack: vanilla CSS + inline SVG for contour/reticle work — no fills needed. Quick wins: the whole system is `1px` rules + mono type on `paper`. Tricky bits: the face contour lines are asset-class (SVG trace or generative); don't substitute a photo. Implicit states: scan-in-progress animation (line sweep) unobserved ❓.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | archival HUD read unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | ⚠️ | treatment clear, family inferred |

## 6. Do's and Don'ts

**Do** — keep every rule at 1px; set all labels uppercase mono with wide tracking; reserve `umber-deep` for one emphasis element per screen.

**Don't** — don't add glow or shadow; don't round any corner; don't introduce a hue outside the tan family.

## 7. Open questions

- Is there a matching dark-polarity twin screen in the batch cluster? (Name implies one of several.)

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md` · [x] `component.tsx`
