---
title: Design — paper-grain-textures
description: GOLD tier — vision-written 2026-08-13 (self). Neutral paper-grain tile.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Paper Grain Textures
source: extractions/paper-grain-textures/paper-grain-textures.png
captured_at: 2026-08-13
colors:
  paper: "#d2d2d2"
  paper-mid: "#c7c7c7"
  paper-shadow: "#b5b5b5"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Paper Grain Textures

> Vision-written gold pass. Date: 2026-08-13. Emphasis: reconstruction (as a reusable asset).

## Source

- **Source type**: local image · **Path**: `extractions/paper-grain-textures/paper-grain-textures.png` (300×300)
- **Capture method**: direct vision
- **Detected limitations**: seamlessness is unverified — edges were not wrap-tested; at 300×300, tile size is small and repeat banding is a real risk on large surfaces.

## TL;DR

A blank grey paper-grain tile — pure substrate, zero chroma, zero subject. The vault's material primer: tooth for print-imitation pipelines and flat-color UI surfaces.

## 1. Visual identity

**Personality**: neutral, quiet, tactile, invisible.
**Mood**: none asserted — it lends mood to whatever it underlies.
**Detectable stylistic references**: scanner-bed paper capture; riso/photocopy effect pipelines.
**Information density**: minimal by design.
**Implicit positioning**: infrastructure — an overlay layer, never a deliverable image.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes digital surfaces are too clean: a whisper of fibre restores the body of paper without nostalgia pastiche. This tile is that belief reduced to an asset — no color opinion, no composition, just tooth.

### 1.3 The ONE brand thing

- **The thing**: compositionless evenness — grain with no center so it can repeat.
- **Why it carries the brand**: any visible structure would pattern when tiled; the asset's discipline is its refusal to be an image.
- **How everything else supports it**: zero chroma, tight grey range (1.36:1 max internal contrast).
- **Where it appears**: multiply/overlay layers, background texture under flat UI color, print-effect passes. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#d2d2d2` | light grain peak | ✅ pixel |
| `paper-mid` | `#c7c7c7` | median ground | ✅ pixel |
| `paper-shadow` | `#b5b5b5` | grain valley | ✅ pixel |

Typography: none present.

## 3. Components inventory

None — this *is* the material components are made of. Not a UI element.

## 4. Layout & composition

Deliberately none: evenly distributed mottle, no focal point, no directional fibre — engineered for repetition.

## 5. Reconstruction notes

As UI: asset-class, deployed as `background-image` with `background-repeat`, or as a CSS-blend (`multiply`/`overlay`) layer at 5–15% opacity over flat color. Quick wins: tiny file, trivially embeddable. Tricky bits: verify the seam (offset the tile 50% and inspect); on OLED the grey range may band — consider a dithered PNG-8 re-export if it ships.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | substrate read is unambiguous |
| Colors | ✅ | pixel-grounded grey trio |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — apply at low opacity over flat surfaces; test the tile offset before shipping; keep it achromatic.

**Don't** — don't display it as an image; don't tint it per-page (tint the layer beneath, not the grain); don't upscale it — regenerate from a larger scan instead.

## 7. Open questions

- Is the tile seamless? Unverified — flag for an offset test before it enters any component pipeline.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: texture asset, not a UI screen.
