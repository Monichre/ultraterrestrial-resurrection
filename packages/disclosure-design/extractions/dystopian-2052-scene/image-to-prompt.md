---
title: Image-to-prompt — dystopian-2052-scene
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `dystopian-2052-scene`

**Kind: asset** — smog, rain, and concrete atmosphere are raster territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a rain-soaked dystopian city canyon — brutalist concrete megastructures dissolving into smog, a colossal screen glowing faintly in the distance, tiny pedestrians with umbrellas crossing the foreground, wet pavement reflecting the scarce light
STYLE / MEDIUM: cinematic concept-art still, near-future production design, smog documentary register
COMPOSITION & CAMERA: portrait 3:4 street canyon, walls converging overhead, the glowing screen high-center as the only light event, umbrella figures small and low
LIGHTING: overcast smog daylight — no sun, no neon, the distant screen the single weak source
PALETTE: green-gray concrete `#555b57`, asphalt `#292e30`, slate `#3d4444`, pale phosphor glow `#8d8c7c`
MOOD: sodden, oppressive, smog-choked, monumental, anonymous, weary
BACKGROUND / INTEGRATION: `scene` — smog baked in
AVOID: no neon signage, no flying vehicles, no readable screen content, no individual faces, no blue-hour romance, no rain-bokeh prettiness

## Natural-language version

A cinematic portrait-format still of a rain-soaked dystopian city canyon: brutalist concrete megastructures dissolve upward into smog, and a colossal screen glows faintly in the distance — the frame's only light. Tiny pedestrians with umbrellas cross the foreground, silhouetted on wet reflective pavement. The palette is wet concrete: green-gray (#555b57), asphalt (#292e30), slate (#3d4444), and a pale phosphor glow (#8d8c7c). Overcast smog daylight, no neon, no sun. The mood is atmospheric defeat: a near-future city that has stopped noticing itself — bigger concrete, worse air.

## Model adaptation notes

- **Midjourney**: `rain-soaked brutalist city canyon in smog, huge distant glowing screen, tiny pedestrians with umbrellas, wet concrete, overcast, cinematic dystopia` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "no neon, overcast gray-green".
- **SD/Flux**: structured tags; AVOID → negative prompt (`neon, flying cars, readable text, faces, blue hour, bokeh`).

> **Prompt fidelity note**: expect 3–5 iterations; models reflexively add neon cyberpunk signage — "no neon, smog daylight" is the discipline.
