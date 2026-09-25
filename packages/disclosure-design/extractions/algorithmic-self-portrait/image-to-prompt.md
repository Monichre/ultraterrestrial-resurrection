---
title: Image-to-prompt — algorithmic-self-portrait
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `algorithmic-self-portrait`

**Kind: asset** — tonal emergence from black is raster art; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a human self-portrait half-dissolved into near-total blackness — face and head barely modeled by the faintest warm-grey tonal line
STYLE / MEDIUM: generative portrait study, extreme low-key; tenebrism pushed to near-abstraction
COMPOSITION & CAMERA: portrait field, face held in the middle darkness, no hard edges, no crop
LIGHTING: almost none — form implied by the smallest tonal deviation above black
PALETTE: void `#090909` (≈86% of frame), figure tone `#2b2927` (≈3%); nothing else
MOOD: introspective, spectral, withheld, haunting
BACKGROUND / INTEGRATION: `scene` — void baked in
AVOID: no visible light source, no rim light, no detail in shadows, no color, no sharp edges, no text

## Natural-language version

An extreme low-key generative self-portrait: a human face half-dissolved into a near-total black field (#090909), the head barely modeled by the faintest warm-grey tonal line (#2b2927) — form implied, never stated. Portrait orientation, the face held in the middle darkness with no edges and no visible light source. The mood is presence barely surfacing from void: introspective, spectral, withheld. The viewer's eye should have to work.

## Model adaptation notes

- **Midjourney**: `extreme low key portrait, tenebrism, face emerging from black` — `--ar 7:9 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; models resist this much darkness — repeat "almost entirely black".
- **SD/Flux**: structured tags; AVOID → negative prompt (`rim light, detail, color, sharp`).

> **Prompt fidelity note**: expect 3–5 iterations; models over-light by default — the AVOID list is the whole game here.
