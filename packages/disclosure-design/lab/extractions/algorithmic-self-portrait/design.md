---
title: Design — algorithmic-self-portrait
description: GOLD tier — vision-written 2026-08-13 (self). Extreme low-key portrait.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Algorithmic Self-Portrait — Seed 004
source: extractions/algorithmic-self-portrait/algorithmic-self-portrait.png
captured_at: 2026-08-13
colors:
  void: "#090909"
  figure: "#2b2927"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Algorithmic Self-Portrait (Seed 004)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/algorithmic-self-portrait/algorithmic-self-portrait.png` (1400×1800)
- **Capture method**: direct vision
- **Detected limitations**: at this luma floor, fine facial detail is genuinely ambiguous — description stays at the level of what is observable (mass, tone, emergence), not features.

## TL;DR

The darkest frame in the vault: a face half-recovered from near-total black by the faintest warm-grey tonal line. Identity as signal barely above noise.

## 1. Visual identity

**Personality**: introspective, spectral, withheld, extreme.
**Mood**: presence surfacing from void.
**Detectable stylistic references**: tenebrism, generative/seed-based portraiture, low-key photography.
**Information density**: minimal by design — one tonal event in a black field.
**Implicit positioning**: the tonal floor of the identity system; an "origin" image.
**Confidence**: ✅ high (at the level of mass and tone).

### 1.2 Brand voice

Withholding as a stance. The brand does not always explain itself; sometimes it is a face you have to lean into the dark to see.

### 1.3 The ONE brand thing

- **The thing**: figure/void ratio — 3% tone carrying 97% black.
- **Why it carries the brand**: it defines the bottom of the vault's tonal ladder; every other plate is measured against this floor.
- **How everything else supports it**: nothing — the frame is deliberately featureless around the face.
- **Where it appears**: origin/about moments, covers, interstitials where silence is the point. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `void` | `#090909` | field | ✅ pixel |
| `figure` | `#2b2927` | facial tone | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **void portrait** (face emerging from black). Generic: none — art, not UI.

## 4. Layout & composition

Portrait, face in the middle darkness, no edges, no crop lines; composition is tonal, not linear.

## 5. Reconstruction notes

As UI: asset-class. Never place on pure-black backgrounds (`#000` will swallow it — the frame's own `#090909` is the minimum separation). Quick wins: two-value palette. Tricky bits: reproduction on OLED vs print will diverge; the figure may vanish in print — test.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | void-portrait read is unambiguous |
| Colors | ✅ | pixel-grounded pair |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — display large and dim; pair with generous black space; keep screen brightness in mind.

**Don't** — don't brighten/enhance the asset; don't add borders or frames; don't place text over the face region.

## 7. Open questions

- Does this seed series (004 implies siblings) belong in the manifest as its own cluster? Flag for next folderize pass.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: portrait art, not a UI screen.
