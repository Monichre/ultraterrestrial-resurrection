---
title: Design — uss-roosevelt-sphere
description: GOLD tier — vision-written 2026-08-13 (self). Deadpan UAP evidence aesthetic.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: USS Roosevelt Sphere
source: extractions/uss-roosevelt-sphere/uss-roosevelt-sphere.png
captured_at: 2026-08-13
colors:
  sea-gray: "#4c4941"
  horizon-pale: "#a09d8d"
  deck-charcoal: "#262424"
  steel-mid: "#6c685b"
  median: "#373532"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — USS Roosevelt Sphere

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/uss-roosevelt-sphere/uss-roosevelt-sphere.png` (1232×928)
- **Capture method**: direct vision
- **Detected limitations**: grain obscures hull numbers/markings — no positive ship ID beyond class; treated as "carrier, unnamed."

## TL;DR

A matte black sphere parked on the horizon behind an aircraft carrier, shot like a leaked recon photo — all gray, all grain, no drama. The disclosure aesthetic: the impossible, bureaucratically framed.

## 1. Visual identity

**Personality**: deadpan, evidentiary, ominous, restrained.
**Mood**: calm seas, impossible object.
**Detectable stylistic references**: declassified UAP imagery, military reconnaissance photography, New Topographics deadpan.
**Information density**: low — three masses (sea, ship, sphere) and grain.
**Implicit positioning**: the "state evidence" pole of the sphere cluster; authenticity through imperfection.
**Confidence**: ✅ high.

### 1.2 Brand voice

Credibility through underreaction. The design believes the audience trusts what looks captured rather than composed — grain, flat light, and an unimpressed horizon say "this was filed, not staged."

### 1.3 The ONE brand thing

- **The thing**: the sphere-as-matte-void — a perfect geometry with no light behavior, sitting in a photograph that obeys all the rules the object doesn't.
- **Why it carries the brand**: the tension between documentary realism and the physically impossible is the entire disclosure genre.
- **How everything else supports it**: desaturated palette, centered horizon, and the carrier give it scale and institutional context; nothing editorializes.
- **Where it appears**: article heroes, document plates, "evidence" sections. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `sea-gray` | `#4c4941` | dominant ocean | ✅ pixel |
| `horizon-pale` | `#a09d8d` | sky/horizon band | ✅ pixel |
| `deck-charcoal` | `#262424` | sphere + ship mass | ✅ pixel |
| `steel-mid` | `#6c685b` | haze mids | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **horizon-stare composition** (military anchor + impossible sphere + deadpan sky). Generic: none — art, not UI.

## 4. Layout & composition

Landscape, horizon dead-center, sphere right-of-center behind the carrier's island; three horizontal bands (sea / ship-line / sky) with the sphere breaking the register as a pure circle.

## 5. Reconstruction notes

As UI: asset-class editorial hero. Quick wins: two-band gray palette, generous grain overlay. Tricky bits: the sphere must stay *lightless* — any specular or glow breaks the evidentiary spell; grain must be uniform, not vignetted.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | UAP-evidence read unambiguous |
| Colors | ✅ | pixel-grounded, near-achromatic |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep saturation near zero; caption it like a document (date, coordinates, mono type); let grain carry authenticity.

**Don't** — don't glow the sphere; don't dramatize the sky; don't crop the horizon off-center.

## 7. Open questions

- Is this keyed to a specific real incident (the Roosevelt encounters) intentionally? Context note, not visible in-frame.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: evidence-style photograph, not a UI screen.
