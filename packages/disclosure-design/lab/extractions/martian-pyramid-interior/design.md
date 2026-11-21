---
title: Design — martian-pyramid-interior
description: GOLD tier — vision-written 2026-08-13 (self). Inhabited megastructure interior.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Martian Pyramid Interior
source: extractions/martian-pyramid-interior/martian-pyramid-interior.png
captured_at: 2026-08-13
colors:
  floor: "#100402"
  wall: "#553928"
  mid-earth: "#3c2214"
  haze-light: "#9c816d"
  median: "#27140a"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Martian Pyramid Interior

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/martian-pyramid-interior/martian-pyramid-interior.png` (1344×896)
- **Capture method**: direct vision
- **Detected limitations**: haze swallows wall texture beyond mid-frame; figure detail is silhouette-only by design.

## TL;DR

A cathedral-scale alien interior rendered as one glowing throat of amber light and two rails of floor lamps, with human specks for scale. The vault's megastructure register experienced from inside.

## 1. Visual identity

**Personality**: monolithic, reverent, hushed, dread-tinged.
**Mood**: awe at the edge of fear — scale as sublime.
**Detectable stylistic references**: Dune/Prometheus production design, brutalist sacred space, 70s sci-fi paperback covers modernized.
**Information density**: low element count, extreme tonal depth.
**Implicit positioning**: worldbuilding anchor — the "we are small" plate.
**Confidence**: ✅ high.

### 1.2 Brand voice

Scale is the argument. The design believes the audience wants to feel dwarfed — that wonder comes from withholding the full shape of the thing and letting one slit of light imply the rest.

### 1.3 The ONE brand thing

- **The thing**: the single blinding atrium slit — one vertical wound of light the entire perspective kneels toward.
- **Why it carries the brand**: it is simultaneously light source, vanishing point, and narrative (something is *up there*).
- **How everything else supports it**: walls desaturate into umber, floor lights queue subordinately, figures point inward.
- **Where it appears**: establishing shots, section dividers, loading/interstitial art. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `floor` | `#100402` | nave floor, deepest dark | ✅ pixel |
| `wall` | `#553928` | dominant wall tone | ✅ pixel |
| `mid-earth` | `#3c2214` | shadowed wall mids | ✅ pixel |
| `haze-light` | `#9c816d` | atrium haze, lit dust | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **converging-nave megastructure** (one-point interior + scale figures + light rails). Generic: none — art, not UI.

## 4. Layout & composition

Perfect central one-point perspective; vertical symmetry; human scale anchored low-center; light slit top-center as both terminus and source.

## 5. Reconstruction notes

As UI: asset-class full-bleed hero. Quick wins: the palette is effectively two stops (dark umber + haze tan). Tricky bits: volumetric haze and the glow's bloom — flat fills flatten the scale; needs gradient + grain.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | interior megastructure unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep any overlay type small, centered, and low-contrast; preserve the vertical symmetry; use `#100402` as the page-side blend color.

**Don't** — don't crop off the atrium slit; don't add a second light color; don't sharpen the haze.

## 7. Open questions

- Are there sibling exterior shots of this pyramid elsewhere in the vault? Flag for cluster-linking.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: concept-art still, not a UI screen.
