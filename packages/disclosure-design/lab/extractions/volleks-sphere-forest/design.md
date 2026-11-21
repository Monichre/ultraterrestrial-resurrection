---
title: Design — volleks-sphere-forest
description: GOLD tier — vision-written 2026-08-13 (self). Sub-visible night forest walk.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Volleks Sphere Forest — Night Path
source: extractions/volleks-sphere-forest/volleks-sphere-forest.png
captured_at: 2026-08-13
colors:
  ground: "#020206"
  ground-raised: "#0a0c10"
  mass: "#1a1f24"
  signal: "#374a4f"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Volleks Sphere Forest (Night Path)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/volleks-sphere-forest/volleks-sphere-forest.png` (1456×816)
- **Capture method**: direct vision
- **Detected limitations**: at mean luma 19.5 the namesake sphere is not confidently separable from canopy/ground black — described at the level of what survives the dark.

## TL;DR

The vault's darkest landscape: a one-point-perspective forest path at night, a lone figure at the vanishing point, stars in a slit of sky. Four blue-black values do everything; the brightest pixel-family in the frame is a slate that barely clears 2:1 contrast.

## 1. Visual identity

**Personality**: nocturnal, hushed, remote, watchful.
**Mood**: watched solitude — quiet, not frightening.
**Detectable stylistic references**: slow-cinema night establishing shots, romantic-dark forest painting, surveillance-footage luma.
**Information density**: minimal — one path, one figure, one slit of sky.
**Implicit positioning**: atmospheric chapter-break / ambient background plate.
**Confidence**: ✅ high at mass-and-tone level; ❓ on sphere presence.

### 1.2 Brand voice

Scale through subtraction. The plate believes the viewer will lean in if given almost nothing — a path, a figure, a slit of stars — and that dread accrued quietly outlasts dread announced.

### 1.3 The ONE brand thing

- **The thing**: the funnel — a single bare-earth path dragging the eye to one tiny figure.
- **Why it carries the brand**: it converts a forest into a sightline; remove the path and the frame is just dark trees.
- **How everything else supports it**: canopy black, star slit, and palette all stay subordinate to the perspective pull.
- **Where it appears**: ambient backgrounds, chapter breaks, loading/interstitial plates. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ground` | `#020206` | field / canopy black | ✅ pixel |
| `ground-raised` | `#0a0c10` | median night tone | ⚠️ medium |
| `mass` | `#1a1f24` | tree walls | ⚠️ medium |
| `signal` | `#374a4f` | path, sky slit, figure catch | ✅ pixel |

Typography: none observed.

A11y note: `signal` on `ground` measures 2.22:1 — atmosphere only; never set functional text in this pair.

## 3. Components inventory

Signature: **vanishing-point night path**. Generic: none — art, not UI.

## 4. Layout & composition

Landscape; strict one-point perspective with the horizon/vanishing point dead center; trees as converging verticals, sky as a thin upper band, figure as the terminal anchor. Composition is the perspective itself.

## 5. Reconstruction notes

As UI: asset-class, background-plate duty. Quick wins: four-value blue-black ramp. Tricky bits: banding risk is extreme at this luma — serve with dithering or as high-bit-depth source; on OLED the tree/mass separation may vanish entirely — test on hardware.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | night-path read is unambiguous |
| Colors | ✅ | pixel-grounded four-value ramp |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — display at full-bleed landscape; keep any overlay text in the `signal` register or brighter and off the path axis; preserve the star slit.

**Don't** — don't brighten or lift shadows; don't crop to portrait; don't place UI chrome along the path's vanishing line; don't use this palette pair for readable text (2.22:1).

## 7. Open questions

- Does a sphere sit above the canopy in the full-res original? Sub-visible here — needs a brightness-lifted inspection pass to confirm (do not re-export at full res; check the source still).

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: cinematic plate, not a UI screen.
