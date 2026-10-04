---
title: Image-to-prompt — volluid-sphere-statues
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `volluid-sphere-statues`

**Kind: asset** — halftone statuary and the sphere's tonal depth are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a large deep blue-black sphere centered among classical Greco-Roman statues, with the wordmark "VOLLUID" in wide-tracked uppercase grotesk, all under a full-field hairline measurement grid
STYLE / MEDIUM: fine line and halftone digital illustration; metaphysical stillness × technical chart
COMPOSITION & CAMERA: tall portrait poster (3:4), sphere central, statues flanking as witnesses, grid unifying the field, symmetrical and still
LIGHTING: flat, even, museological — no drama, no cast shadow
PALETTE: sphere `#0a0d12` (only chroma), statuary grey `#838689`, ground/grid `#b8bbbd`; otherwise achromatic
MOOD: enigmatic, monumental, hushed
BACKGROUND / INTEGRATION: `scene` — grid field baked in
AVOID: no glow, no motion, no extra color, no clouds/atmosphere, no modern objects, no body text

## Natural-language version

A tall portrait poster: one large deep blue-black sphere (#0a0d12) standing centered among classical Greco-Roman statues rendered in fine line and halftone (#838689), all beneath a hairline measurement grid spanning the entire field (#b8bbbd ground). The word "VOLLUID" set in wide-tracked uppercase grotesk. Flat, even, museological light; total stillness. The sphere is the only chroma in an achromatic measured world — an unknown object catalogued by antiquity.

## Model adaptation notes

- **Midjourney**: `metaphysical plaza, dark sphere, classical statues, measurement grid` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; wordmark text will need a short string — "VOLLUID" only.
- **SD/Flux**: structured tags; AVOID → negative prompt (`glow, motion, clouds, color`).

> **Prompt fidelity note**: expect 3–5 iterations; keeping the sphere matte (no glow) is the hardest constraint — say "matte sphere, no glow" explicitly.
