---
title: Image-to-prompt — astronaut-double-exposure
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `astronaut-double-exposure`

**Kind: asset** — halftone duotone double exposure is raster print art; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a man's head in left-facing profile as a double exposure — the cranium opens into an astronaut-helmet visor scene holding a space-shuttle launch on a flat horizon; dried wheat / flower stalks rise from the bottom edge through the neck
STYLE / MEDIUM: 1970s screen-print / risograph poster, visible halftone dot grain, warm single-family duotone, vintage NASA-ephemera finish
COMPOSITION & CAMERA: wide landscape frame, profile anchored left-of-center facing the left edge, botanicals counterweighting the bottom, generous empty paper at right
LIGHTING: flat print light — no source, no cast shadow; depth built purely from duotone value steps
PALETTE: paper `#fbe6b5` field (≈28%), mid gold `#fdd67a` modeling (≈16%), deep orange-brown `#c36739` for every dark (≈15%) — nothing else
MOOD: nostalgic, optimistic, sunlit, dreamy — a memory of the future
BACKGROUND / INTEGRATION: `scene` — cream paper field baked in, grain continuous to the edges
AVOID: no blue or cool tones, no photorealistic skin, no modern digital gloss, no text, no borders, no hard vector edges

## Natural-language version

A 1970s risograph screen-print poster in warm duotone: a man's head in left-facing profile, doubled with an astronaut-helmet visor scene that holds a space-shuttle launch on a flat horizon; dried wheat and flower stalks rise from the bottom edge through the neck. Everything is printed in three values — cream paper `#fbe6b5`, mid gold `#fdd67a`, deep orange-brown `#c36739` — with visible halftone grain across the whole wide landscape frame. The mood is sunlit space-age nostalgia: optimistic, dreamy, analog. No text, no cool colors, no digital gloss.

## Model adaptation notes

- **Midjourney**: `double exposure portrait, astronaut helmet visor shuttle launch, risograph duotone, halftone grain, cream gold ochre` — `--ar 16:9 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "only cream, gold and orange-brown inks" — models drift to full color.
- **SD/Flux**: structured tags; AVOID → negative prompt (`blue, photorealistic, glossy, text, border`).

> **Prompt fidelity note**: expect 3–5 iterations; the duotone discipline (three values, no cool spill) is the first thing models break — the PALETTE and AVOID blocks are the levers.
