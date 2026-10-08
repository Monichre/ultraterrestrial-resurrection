---
title: Image-to-prompt — daedalus-hatched-bust
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `daedalus-hatched-bust`

**Kind: asset** — engraved portrait; the hatch is the art, not reproducible in code. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a classical bust of a bearded, laurel-crowned figure (Daedalus / philosopher type) rendered entirely in fine engraved cross-hatching, with faint geometric construction lines (a pyramid wireframe, guide lines) ghosted behind the head, a small serif caption "DÆDALUS" at the base
STYLE / MEDIUM: copperplate engraving / neoclassical frontispiece, fine burin line work
COMPOSITION & CAMERA: portrait, bust centered and frontal in the middle two-thirds, generous plate margins, caption centered at base
LIGHTING: even, print-like — form built from hatch density, not cast light
PALETTE: cool near-achromatic — pale silver-grey paper `#c1c1c1`, mid grey `#a2a4a5` hatch, soft dark `#3f3f3f` deepest hatch + caption
MOOD: scholarly, patient, neoclassical — quiet mastery
BACKGROUND / INTEGRATION: `scene` — full plate with margins
AVOID: no color, no warm sepia, no photographic shading, no tight crop, no modern sans type, no heavy blacks

## Natural-language version

A classical bust of a bearded, laurel-crowned figure rendered entirely in fine engraved cross-hatching — a Daedalus/philosopher type — with faint geometric construction lines (a pyramid wireframe, guide lines) ghosted behind the head like a halo of method, and a small serif caption "DÆDALUS" at the base. Cool near-achromatic: pale silver-grey paper (#c1c1c1), mid grey hatch (#a2a4a5), soft dark deepest lines (#3f3f3f). Portrait, centered, generous plate margins. The mood is patient mastery: a face conjured line by line.

## Model adaptation notes

- **Midjourney**: `neoclassical engraved frontispiece, classical bearded bust in cross-hatching, faint geometric construction lines behind head, copperplate, caption DAEDALUS` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version; the Æ ligature and small caption will be unreliable — set type in post.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, sepia, photo, smooth shading, modern, black, crop`).

> **Prompt fidelity note**: expect 3–5 iterations; the failure mode is photographic shading — models default to rendered form. Repeat "engraved cross-hatching, burin line, no smooth shading" to hold the print register.
