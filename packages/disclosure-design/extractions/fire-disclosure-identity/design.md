---
title: Design — fire-disclosure-identity
description: GOLD tier — vision-written 2026-08-13 (self). Desaturated disaster-sublime key art.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Fire Disclosure Identity
source: extractions/fire-disclosure-identity/fire-disclosure-identity.png
captured_at: 2026-08-13
colors:
  soot: "#000101"
  bone-flame: "#e9e3c3"
  charcoal: "#1f2123"
  ash: "#5a5f5e"
  greige: "#b2afa0"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Fire Disclosure Identity

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/fire-disclosure-identity/fire-disclosure-identity.png` (1024×1024)
- **Capture method**: direct vision
- **Detected limitations**: figure's suit detail is silhouette-grade; flame texture summarized as tonal bands.

## TL;DR

A suited figure points into a wall of flame rendered in ash and bone instead of orange — disaster-sublime with the color drained out. Spectacle converted to testimony.

## 1. Visual identity

**Personality**: solemn, confrontational, cinematic, scorched.
**Mood**: one small human vs. an overwhelming force.
**Detectable stylistic references**: Chernobyl/First Man disaster cinema, album-cover key art, silver-gelatin documentary photography.
**Information density**: low element count (figure, wall, ground), high tonal drama.
**Implicit positioning**: the "witness" plate — disclosure as a human act.
**Confidence**: ✅ high.

### 1.2 Brand voice

Testimony over spectacle. The design believes the audience is exhausted by orange explosions — that draining fire to grayscale makes it *more* overwhelming, because it reads as document rather than entertainment. The pointing figure says: look, this happened.

### 1.3 The ONE brand thing

- **The thing**: desaturated flame — fire rendered in bone-cream and ash, heat expressed as value alone.
- **Why it carries the brand**: it's the inversion of every disaster image ever made; the restraint is instantly recognizable.
- **How everything else supports it**: figure, ground, and smoke all stay in the same ash family; nothing competes with the wall.
- **Where it appears**: covers, campaign heroes, statement plates. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `soot` | `#000101` | deepest shadow, suit darks | ✅ pixel |
| `bone-flame` | `#e9e3c3` | flame highlights, suit lights | ✅ pixel |
| `charcoal` | `#1f2123` | smoke mass | ✅ pixel |
| `ash` | `#5a5f5e` | mid smoke | ✅ pixel |
| `greige` | `#b2afa0` | ground reflection | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **witness-at-the-wall** (small suited figure + full-frame element + pointing vector). Generic: none — art, not UI.

## 4. Layout & composition

Square 1:1; figure low-center-right in the lower third; fire wall as total background; single diagonal gesture into the blaze; reflective ground band as base.

## 5. Reconstruction notes

As UI: asset-class cover/hero. Quick wins: grayscale-with-warmth palette tolerates any page blend from `#000101` to `#e9e3c3`. Tricky bits: the flame must stay *tonal*, not orange — any saturation breaks the register; the ground reflection needs to be dimmer and softer than the wall.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | witness composition unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep flames in the bone/ash family; give the figure room (lower third only); use the square format or crop to it, never letterbox.

**Don't** — don't add orange; don't add type over the flame wall; don't show the figure's face (the anonymity is the point).

## 7. Open questions

- Is this part of a fire series (other frames with the same suited figure)? Flag for cluster-linking.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: key art, not a UI screen.
