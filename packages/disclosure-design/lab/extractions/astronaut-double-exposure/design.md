---
title: Design — astronaut-double-exposure
description: GOLD tier — vision-written 2026-08-13 (self). Sunlit duotone double-exposure poster.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Astronaut Double-Exposure
source: extractions/astronaut-double-exposure/astronaut-double-exposure.png
captured_at: 2026-08-13
colors:
  paper: "#fbe6b5"
  gold: "#fdd67a"
  ember: "#c36739"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Astronaut Double-Exposure

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/astronaut-double-exposure/astronaut-double-exposure.png` (1456×816)
- **Capture method**: direct vision
- **Detected limitations**: no type present to analyze; halftone grain means fine detail is printed-dot detail, not continuous tone.

## TL;DR

A sunlit cream-and-gold duotone double exposure: a profile whose head contains a shuttle launch, botanicals rising through the neck. The vault's warm, optimistic pole — risograph nostalgia for the space age.

## 1. Visual identity

**Personality**: nostalgic, optimistic, warm, analog, dreamy.
**Mood**: a memory of the future — space-age longing rendered in sunlight.
**Detectable stylistic references**: vintage NASA poster art, 1970s screen-print, riso zine covers, analog double-exposure film photography.
**Information density**: minimal — one figure, one nested scene, one botanical counterweight on an empty field.
**Implicit positioning**: the emotional register for wonder/hope beats — launch-day imagery, not dread imagery.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes the cosmos is *personal* — exploration happens inside an ordinary head, not in a hangar. Every choice serves that intimacy: the duotone removes the documentary coldness of space photography, the grain insists a human hand printed this, the empty cream field says there is nothing to sell you, only something to remember.

### 1.3 The ONE brand thing

- **The thing**: the head-as-visor double exposure — one profile containing an entire launch.
- **Why it carries the brand**: it fuses identity and cosmos in a single gesture; separate them and you have a portrait plus a rocket, neither remarkable.
- **How everything else supports it**: the palette is reduced to three values so the eye goes straight to the nested scene; the field stays empty.
- **Where it appears**: covers, hero art, chapter openers for wonder-themed material. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#fbe6b5` | field / light | ✅ pixel |
| `gold` | `#fdd67a` | mid-tone modeling | ✅ pixel |
| `ember` | `#c36739` | all darks / line | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **double-exposure portrait** (figure containing scene). Generic: none — poster art, not UI.

## 4. Layout & composition

Wide landscape field; profile left-of-center facing outward; nested launch scene in the cranium; botanicals rising from the bottom edge; negative space at right. Composition is tonal — depth by duotone value, not by line.

## 5. Reconstruction notes

As UI: asset-class. Quick wins: the three-value palette maps directly to `--color-bg-primary` / `--color-bg-secondary` / `--color-primary` (see `design-tokens.md`). Tricky bits: the halftone grain cannot be faked with flat fills — needs the raster or a grain overlay; on screens darker than the paper tone the duotone inverts mood.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | double-exposure read is unambiguous |
| Colors | ✅ | pixel-grounded trio |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — print or display on warm off-white (`#fbe6b5` family); let the grain show at large sizes; pair with serif or typewriter faces if type is ever added.

**Don't** — don't cool the palette (no blue shifts); don't add a fourth color; don't crop the negative space at right — the emptiness is structural.

## 7. Open questions

- Is there a companion series (other double exposures in the same duotone)? Siblings `-02`…`-04` exist in the vault — flag for cluster cross-check.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: poster art, not a UI screen.
