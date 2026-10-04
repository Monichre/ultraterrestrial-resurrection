---
title: Design — dystopian-cosmic-dread
description: GOLD tier — vision-written 2026-08-13 (self). Memento-mori etching under a cosmic sky.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Dystopian Cosmic Dread — Death with Hourglass
source: extractions/dystopian-cosmic-dread/dystopian-cosmic-dread.png
captured_at: 2026-08-13
colors:
  ground: "#111a16"
  ground-raised: "#292b1f"
  ink-mid: "#625535"
  ink-high: "#a09466"
  shadow-block: "#2c3023"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Dystopian Cosmic Dread (Death with Hourglass)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/dystopian-cosmic-dread/dystopian-cosmic-dread.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: engraving hatch detail at this size is direction-readable but not line-countable; palette is pixel-grounded.

## TL;DR

A memento-mori bookplate etching: Death full-length with hourglass, dead trees as columns, a crescent moon and ringed planet overhead. One olive-khaki ink family on near-black — dread delivered with a librarian's patience.

## 1. Visual identity

**Personality**: allegorical, sepulchral, patient, macabre.
**Mood**: cosmic indifference — time personified, unhurried.
**Detectable stylistic references**: 19th-century chapbook engraving, Danse Macabre iconography, Romantic night-sky painting (Friedrich-adjacent), occult-revival cover art.
**Information density**: balanced — dense hatch work contained in a clear frontal figure.
**Implicit positioning**: the mythic/allegorical wing of the vault's dystopian material; cover or frontispiece art.
**Confidence**: ✅ high.

### 1.2 Brand voice

Mortality as structure, not spectacle. The plate believes dread lands hardest when it is *ordered* — symmetrical trees, centered reaper, heavens arranged like a title page. Nothing screams; the hourglass is simply running.

### 1.3 The ONE brand thing

- **The thing**: the single-ink engraving register — olive-khaki hatch (`#625535` → `#a09466`) on `#111a16`, nothing else.
- **Why it carries the brand**: it fuses medieval print mortality with cosmic scale; any second hue breaks the spell and turns it into poster art.
- **How everything else supports it**: strict frontal symmetry and a quiet sky keep all attention on the figure's gesture.
- **Where it appears**: covers, chapter frontispieces, interstitials. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `ground` | `#111a16` | field | ✅ pixel |
| `ground-raised` | `#292b1f` | cloud/shadow mass | ⚠️ medium |
| `ink-mid` | `#625535` | hatch body tone | ✅ pixel |
| `ink-high` | `#a09466` | figure highlights, moon | ✅ pixel |
| `shadow-block` | `#2c3023` | tree/robe darks | ⚠️ medium |

Typography: none observed — plate carries no lettering.

## 3. Components inventory

Signature: **memento-mori frontispiece** (centered allegorical figure + celestial register). Generic: none — art, not UI.

## 4. Layout & composition

Portrait; figure on the vertical centerline, trees as flanking columns, celestial bodies in the upper third, outcrop anchoring the bottom. Composition is heraldic — read top (cosmos) to bottom (earth) as a sentence.

## 5. Reconstruction notes

As UI: asset-class. Quick wins: five-value olive/black palette. Tricky bits: crosshatch texture is resolution-dependent — serve at ≥1× intrinsic size or the hatch moirés; do not upscale for print without a native-resolution source.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | etching + reaper read is unambiguous |
| Colors | ✅ | pixel-grounded olive/black ladder |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — display large with wide `ground`-colored margins; pair with serif/smallcaps titling if type must appear; keep the olive register intact.

**Don't** — don't recolor toward green or sepia beyond the measured family; don't crop the celestial register; don't overlay text on the figure; don't add glow effects (the plate's restraint is the point).

## 7. Open questions

- Is there a companion plate (a "life" counterpart to this "death") in the unprocessed stills? Flag for next folderize pass.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: allegorical plate art, not a UI screen.
