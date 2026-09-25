---
title: Design — marcus-aurelius-dusk
description: GOLD tier — vision-written 2026-08-13 (self). Candlelit stoic bust at dusk.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Marcus Aurelius Dusk
source: extractions/marcus-aurelius-dusk/marcus-aurelius-dusk.png
captured_at: 2026-08-13
colors:
  field: "#160e0c"
  stone-shadow: "#4b1411"
  mid-sienna: "#5e3720"
  gilt: "#9c7951"
  border-umber: "#371e14"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Marcus Aurelius Dusk

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/marcus-aurelius-dusk/marcus-aurelius-dusk.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: haze obscures column count and any inscription on the book spine — description stays at mass/tone/light level.

## TL;DR

A stoic marble bust lit like the last minute of a museum's day — ember browns, oxblood shadow, one pale-gold register. The vault's classical cluster at its warmest and most intact.

## 1. Visual identity

**Personality**: meditative, reverent, timeworn, hushed.
**Mood**: candlelit contemplation at closing time.
**Detectable stylistic references**: neoclassical Romantic painting (Hubert Robert ruins), cinematic CGI concept stills, chiaroscuro.
**Information density**: minimal — one figure, one plinth, one book, receding columns.
**Implicit positioning**: the contemplative pole of the classical-antiquity cluster; philosophy as atmosphere.
**Confidence**: ✅ high.

### 1.2 Brand voice

Stillness as authority. The design believes its audience slows down for things that have lasted — eroded marble, gilt, dusk — and that restraint (one figure, deep shadow) signals seriousness better than ornament.

### 1.3 The ONE brand thing

- **The thing**: the raking warm rim-light that separates bust from black — a single light economy doing all the modeling.
- **Why it carries the brand**: remove it and the frame is a dark rectangle; the light *is* the narrative (enlightenment, literally).
- **How everything else supports it**: colonnade, book, and gilt all sit a stop below the bust's lit planes; nothing competes.
- **Where it appears**: covers, chapter opens, quote plates. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `field` | `#160e0c` | background darkness | ✅ pixel |
| `stone-shadow` | `#4b1411` | colonnade glow / deepest tone | ✅ pixel |
| `mid-sienna` | `#5e3720` | column mids, book leather | ✅ pixel |
| `gilt` | `#9c7951` | lit marble planes, gilt emboss | ✅ pixel |
| `border-umber` | `#371e14` | median tone | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **dusk-lit bust tableau** (figure + pedestal + book + colonnade recession). Generic: none — art, not UI.

## 4. Layout & composition

Landscape, rule-of-thirds bust placement left, vanishing glow right; tonal depth via atmospheric haze rather than line; upper half near-empty darkness.

## 5. Reconstruction notes

As UI: asset-class hero/cover. Pair with bone serif display type (out of frame) if typeset. Quick wins: two-zone palette (dark field + gilt accent). Tricky bits: the haze gradient is the render's soul — flat fills kill it; keep grain/softness.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | bust tableau unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the figure small in a large dark field; warm the blacks (umber, never neutral grey); let one gold accent carry all highlights.

**Don't** — don't add UI chrome over the darkness; don't cool the palette; don't sharpen the haze.

## 7. Open questions

- Is the book title/spine legible in the full-res original? Not at this fidelity.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: cinematic still, not a UI screen.
