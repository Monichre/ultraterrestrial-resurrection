---
title: Image-to-prompt — paper-grain-textures
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `paper-grain-textures`

**Kind: asset** — paper fibre is photographic noise; no CSS approximation survives scrutiny. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a blank sheet of paper captured flat — nothing but fine fibre grain, faint tonal clouding, the soft irregularity of real stock; no subject, no figure, no marks
STYLE / MEDIUM: scanner-bed paper capture; texture tile for overlay use
COMPOSITION & CAMERA: perfectly flat, even, edge-to-edge; compositionless — no center of interest so it can tile
LIGHTING: perfectly even diffuse light; no shadows, no vignette, no direction
PALETTE: neutral grey only — light paper `#d2d2d2`, mid `#c7c7c7`, soft valley `#b5b5b5`; fully desaturated, zero chroma
MOOD: neutral, tactile, invisible — tooth without opinion
BACKGROUND / INTEGRATION: `scene` — the paper IS the frame, edge to edge
AVOID: no color cast, no creases or folds, no stains, no watermarks, no visible repeat structure, no text, no deckled edges

## Natural-language version

A flat scanner-bed capture of blank paper: fine fibre grain and faint tonal clouding in neutral grey only — `#d2d2d2` peaks, `#c7c7c7` mid, `#b5b5b5` valleys — perfectly even edge to edge with no subject, no marks, no creases, no color cast. The texture should be compositionless and uniform enough to tile seamlessly as an overlay. Invisible, tactile, neutral.

## Model adaptation notes

- **Midjourney**: `blank paper texture scan, fine fibre grain, uniform neutral grey, seamless tile` — `--ar 1:1 --style raw --tile`.
- **gpt-image / DALL-E**: NL version as-is; repeat "no marks, no creases, completely blank" — models love adding character.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color cast, crease, stain, watermark, text, vignette`); honestly, shooting a real scanner bed beats generating this — flag it.

> **Prompt fidelity note**: expect 2–4 iterations; generated paper tends to invent creases and warm casts. Verify seamlessness by offsetting the tile 50% — generation rarely honors it.
