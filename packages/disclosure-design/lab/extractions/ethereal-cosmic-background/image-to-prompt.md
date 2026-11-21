---
title: Image-to-prompt — ethereal-cosmic-background
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `ethereal-cosmic-background`

**Kind: asset** — sub-visual nebula noise is raster territory; CSS gradients band at this luma floor. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: empty deep space — a near-black cosmic field with the faintest grey-green nebula drift and sparse, subdued star points; no subject, no horizon, no event, no center of interest
STYLE / MEDIUM: deep-field astrophotography ambience; minimal space-cinema title-card restraint
COMPOSITION & CAMERA: landscape field, deliberately centerless — nebula drift without direction, stars sparse and dim; negative space engineered for type overlay
LIGHTING: none — self-lit ambience at the vision floor
PALETTE: near-black field `#090b0a` (≈32%), one mid event grey-green `#3b3f3a` (≈15%) — nothing else, no color
MOOD: vast, hushed, patient — scale without threat; a hush, not a void
BACKGROUND / INTEGRATION: `scene` — field fills the frame edge to edge
AVOID: no bright nebula color, no Milky Way core, no planets or horizons, no lens flare, no bright star cluster, no visible banding, no text

## Natural-language version

An almost-empty deep-space background: a near-black field (`#090b0a`) with the faintest grey-green nebula drift (`#3b3f3a`) and sparse, dim star points — no center of interest, no horizon, no event. The restraint of a minimal space-cinema title card: vast and hushed, scale without threat, engineered so a single line of type in the middle would be the loudest thing in the frame. No color, no bright nebula, no planets, no flare, no banding.

## Model adaptation notes

- **Midjourney**: `empty deep space background, near black, faint grey nebula drift, sparse dim stars, minimal, no focal point` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "almost entirely black" several times — models compulsively add a bright nebula core.
- **SD/Flux**: structured tags; AVOID → negative prompt (`bright nebula, color, milky way, planet, lens flare, star cluster, text`); add fine grain in post to prevent banding.

> **Prompt fidelity note**: expect 3–5 iterations; generative models are allergic to emptiness — the AVOID block is the entire prompt, strategically.
