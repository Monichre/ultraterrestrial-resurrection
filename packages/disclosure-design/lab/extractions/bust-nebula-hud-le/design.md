---
title: Design — bust-nebula-hud-le
description: GOLD tier — vision-written 2026-08-13 (self). Nebula-filled bust under HUD examination.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Bust Nebula HUD — LE
source: extractions/bust-nebula-hud-le/bust-nebula-hud-le.png
captured_at: 2026-08-13
colors:
  void: "#100e0c"
  charcoal: "#242423"
  charcoal-hi: "#373938"
  stone: "#706e6a"
  bone: "#aca699"
typography:
  micro-label:
    fontFamily: "technical mono (HUD register)"
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Bust Nebula HUD (LE)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/bust-nebula-hud-le/bust-nebula-hud-le.png` (1856×2464)
- **Capture method**: direct vision
- **Detected limitations**: HUD micro-labels are illegible — mono letterform class certain, content not. The bust's identity (specific philosopher) is inferred from type, not verified.

## TL;DR

A classical bust filled with nebula, framed as a specimen under HUD examination — gauge, readouts, hairline grid. The vault's fullest fusion of sculpture, cosmos and instrument.

## 1. Visual identity

**Personality**: monumental, analytical, nocturnal, reverent, forensic.
**Mood**: awe under analysis — the ancient mind measured and found to contain stars.
**Detectable stylistic references**: classical-bust revival (post-vaporwave, de-ironized), HUD-as-frame composites, museum specimen photography.
**Information density**: dense — figure + instrument ring + labels, but hierarchically ordered.
**Implicit positioning**: hero/plate imagery for cosmic-inquiry or disclosure-flavored properties.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes antiquity and instrumentation are the same gesture separated by time: both are attempts to hold the infinite still enough to study. So the marble is not ironic here — it is *evidence*. The HUD does not decorate the bust; it examines it, and what it finds inside is space.

### 1.3 The ONE brand thing

- **The thing**: the nebula *inside* the marble — the bust as a window, not a statue.
- **Why it carries the brand**: it literalizes "the mind contains the cosmos"; a plain bust with HUD chrome would be generic sci-fi clip-art.
- **How everything else supports it**: the palette stays in warm blacks and bone so the nebula read is tonal, not chromatic; the HUD stays hairline and peripheral.
- **Where it appears**: hero plates, covers, keynote-scale imagery; never as an inline thumbnail. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `void` | `#100e0c` | field | ✅ pixel |
| `charcoal` | `#242423` | bust shadow mass | ✅ pixel |
| `charcoal-hi` | `#373938` | mid modeling | ✅ pixel |
| `stone` | `#706e6a` | lit stone / secondary HUD | ✅ pixel |
| `bone` | `#aca699` | lit planes / HUD text | ✅ pixel |

Typography: technical mono for HUD micro-labels; exact face unclaimable ⚠️.

## 3. Components inventory

Signature: **specimen plate** (centered figure + instrument ring). Generic: none — composite art, not UI (the HUD ring is decorative framing, not an operable interface).

## 4. Layout & composition

Portrait field; bust centered and frontal; circular gauge at left as primary instrument; data blocks flanking; hairline grid unifying the field. Symmetry = examination.

## 5. Reconstruction notes

As UI: asset-class. The HUD ring is *code-able* (SVG gauge + mono labels on `void`) and a derived `SpecimenFrame` component is feasible — but this frame is an art plate, so no component is written. Quick wins: five-step warm-grey scale fully measured. Tricky bits: the nebula-in-marble effect is a raster composite (displacement + inner glow); CSS masks approximate it poorly.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | bust + HUD read is unambiguous |
| Colors | ✅ | pixel-grounded five-step scale |
| Typography | ⚠️ | mono class certain, face unclaimable |

## 6. Do's and Don'ts

**Do** — display at plate scale (large); keep HUD elements hairline and peripheral; stay in the warm-black/bone scale.

**Don't** — don't add chroma to the HUD (no cyan); don't crop the gauge; don't use the composition at avatar/favicon sizes — the nebula read collapses below ~400px.

## 7. Open questions

- Which philosopher is the bust? Type reads Plato/Socrates; unverified — matters if captions ever name it.
- Is there a light-register sibling ("LE" suffix suggests a limited edition or variant series)? Cluster cross-check flag.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: composite art plate, not a UI screen (derived `SpecimenFrame` noted in Reconstruction).
