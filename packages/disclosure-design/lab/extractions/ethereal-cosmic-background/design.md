---
title: Design — ethereal-cosmic-background
description: GOLD tier — vision-written 2026-08-13 (self). Near-black cosmic field plate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Ethereal Cosmic Background
source: extractions/ethereal-cosmic-background/ethereal-cosmic-background.png
captured_at: 2026-08-13
colors:
  field: "#090b0a"
  drift: "#3b3f3a"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Ethereal Cosmic Background

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/ethereal-cosmic-background/ethereal-cosmic-background.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: at mean luma 22.5 the nebula structure is near the vision floor — drift direction and density are described at the level of what survives; finer star-field detail is not claimed.

## TL;DR

A near-black cosmic field with a faint grey-green nebula drift and subdued stars — composition as absence. The vault's quietest, safest dark ground for typography.

## 1. Visual identity

**Personality**: vast, hushed, subliminal, patient, empty.
**Mood**: scale without threat — a hush, not a void.
**Detectable stylistic references**: deep-field astrophotography ambience, minimal space-cinema title cards.
**Information density**: minimal — deliberately eventless.
**Implicit positioning**: background plate behind heroes, titles, chapter backs.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes emptiness is a material: a field this quiet tells the viewer that whatever appears here matters. The design spends its entire budget on restraint — no color, no event, no center — so that a single line of type becomes the loudest thing in the universe.

### 1.3 The ONE brand thing

- **The thing**: centerlessness — a cosmic field with no focal point.
- **Why it carries the brand**: any nebula swirl or bright star cluster would compete with content; the discipline of *almost nothing* is what makes it a background rather than a picture.
- **How everything else supports it**: two-value palette, subdued stars, no horizon.
- **Where it appears**: behind type, titles, UI — never alone as art. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `field` | `#090b0a` | ground | ✅ pixel |
| `drift` | `#3b3f3a` | nebula event | ✅ pixel |

Typography: none present — but the field is measured safe for bone/white type (contrast vs `#f1d1a9`-class lights exceeds 12:1) ⚠️ derived.

## 3. Components inventory

None — background plate. Not a UI element.

## 4. Layout & composition

Landscape field, no center, no horizon; nebula drift without direction; stars subdued and sparse — negative space engineered for overlay.

## 5. Reconstruction notes

As UI: background-asset class; reproducible in code as a near-black base + large soft radial gradient (`drift` at low opacity) + sparse tiny star dots (SVG/canvas), though the raster's noise is more honest than CSS gradients (which band in this luma range). Quick wins: two-value palette. Tricky bits: dark-on-dark banding — dither any gradient; on OLED, `#090b0a` may crush to pure black and lose the drift entirely.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | background-plate read is unambiguous |
| Colors | ✅ | pixel-grounded pair |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — put content in the middle; keep overlays in bone/white; dither gradients if rebuilding in CSS.

**Don't** — don't brighten the drift into visibility-as-feature; don't add a horizon or planet; don't use behind dark UI chrome (everything will merge).

## 7. Open questions

- Is a seamless full-bleed variant needed at 4K? Current frame is 1232×928 — acceptable for web heroes, marginal for large-format display.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: background plate, not a UI screen.
