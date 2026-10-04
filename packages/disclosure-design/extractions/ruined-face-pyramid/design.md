---
title: Design — ruined-face-pyramid
description: GOLD tier — vision-written 2026-08-13 (self). Sickly-green ruin matte painting.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Ruined Face & Pyramid — Sickly Grade
source: extractions/ruined-face-pyramid/ruined-face-pyramid.png
captured_at: 2026-08-13
colors:
  shadow-floor: "#041817"
  sick-green-mist: "#164731"
  lit-stone: "#a19d69"
  rust-rubble: "#624c2e"
  median-green: "#1e3a28"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Ruined Face & Pyramid

> Vision-written gold pass. Date: 2026-08-13. Emphasis: color grade as identity.

## Source

- **Source type**: local image · **Path**: `extractions/ruined-face-pyramid/ruined-face-pyramid.png` (1680×720)
- **Capture method**: direct vision
- **Detected limitations**: matte-painting detail (individual masonry, carving) is soft at 720px tall — described at the level of mass, grade and composition.

## TL;DR

A wide cinematic matte painting: colossal ruined stone face left, stepped pyramid right, rubble between, all bathed in a sickly green-and-ochre grade. The most overtly narrative frame in the vault — identity carried entirely by the rotten complementary palette.

## 1. Visual identity

**Personality**: desolate, monumental, humid, elegiac.
**Mood**: the sublime with food-poisoning — awe turned queasy.
**Detectable stylistic references**: Romantic ruin painting, sword-and-sorcery paperback covers, Lovecraft archaeology, modern film color-grading (teal/ochre pushed sick).
**Information density**: moderate — two monumental anchors in a field of rubble and mist.
**Implicit positioning**: the "place with weather" plate — proof the vault's language can do narrative scene, not just abstract geometry.
**Confidence**: ✅ high.

### 1.2 Brand voice

Time is the antagonist. The brand can stage empire-after-the-fall — vast, humid, indifferent — without a single human figure.

### 1.3 The ONE brand thing

- **The thing**: the sickly green/ochre split grade (`#164731` mist vs `#a19d69` stone).
- **Why it carries the brand**: it is a color decision doing the narrative work — the same scene in neutral grade is just rocks; the grade *is* the doom.
- **How everything else supports it**: composition (face + pyramid) gives the grade something monumental to rot.
- **Where it appears**: chapter-break key art, world-building headers, disaster/collapse report covers, game loading screens. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `shadow-floor` | `#041817` | deep shadow / sky base | ✅ pixel |
| `sick-green-mist` | `#164731` | mist / mid field | ✅ pixel |
| `lit-stone` | `#a19d69` | lit monument faces | ✅ pixel |
| `rust-rubble` | `#624c2e` | rubble / warm shadow | ✅ pixel |
| `median-green` | `#1e3a28` | frame median | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **matte-painting establishing shot** (twin monumental anchors + mist band). Generic: none — key art, not UI.

## 4. Layout & composition

Extreme-wide (≈2.33:1). Left third: the face, cropped by frame edge, eroded features reading at distance. Right third: pyramid, smaller, atmospheric-perspectived. Bottom third: rubble and mist band. Sky occupies upper half as a near-featureless bruised gradient — negative space that lets the monuments breathe.

## 5. Reconstruction notes

As UI: asset-class. The transferable system is the *grade*: a two-stop duotone (`--color-bg-primary` → `--color-text-primary`) with a single warm counter (`--color-text-secondary`) can reproduce this mood over any imagery. Tricky bits: the green must stay desaturated-sick, not go vivid-teal — vivid turns it into a music-visualizer palette.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | face + pyramid + grade unambiguous |
| Colors | ✅ | pixel-grounded five-swatch grade |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — use full-bleed and wide; let the grade carry narrative; pair with the dossier/lovecraft splits as "the world those files describe".

**Don't** — don't re-grade toward healthy teal-orange; don't add figures or vehicles (scale dies); don't crop to portrait (the width is the sublime).

## 7. Open questions

- Is there a companion night/variant frame in the same cluster? A two-state (day-sick / night-sick) pair would make a strong hero rotation.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: cinematic key art, not a UI screen.
