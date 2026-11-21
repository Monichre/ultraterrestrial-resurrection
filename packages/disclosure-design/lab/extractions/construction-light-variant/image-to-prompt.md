---
title: Image-to-prompt — construction-light-variant
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `construction-light-variant`

**Kind: asset** — architectural scale, atmosphere, and figure-specks are raster territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a vast white cleanroom/gallery interior — perspective-gridded floor receding to tall panel walls; at center a huge dark monolithic slab/vessel under assembly, held by gantry lines from above; tiny white-suited technician figures scattered at its base
STYLE / MEDIUM: cinematic concept-art render, science-fiction production design, cleanroom documentary register
COMPOSITION & CAMERA: landscape one-point perspective down the gridded floor, monolith centered as the single dark mass in a white field, gantry diagonals raking from above
LIGHTING: flat bleached institutional light — no shadows with drama, no glow
PALETTE: near-white `#c5c7c4` field, navy-black `#0c1118` object, cool gray `#8b9295` mids, slate `#48545d` structure
MOOD: sterile, reverent-industrial, hushed, monumental, procedural
BACKGROUND / INTEGRATION: `scene` — white room baked in
AVOID: no warm tones, no pure `#000000` black (keep the navy cast), no dramatic rim light, no visible faces, no text or signage, no second dark object

## Natural-language version

A cinematic concept render: a vast white cleanroom interior, its gridded floor receding in one-point perspective to tall panel walls. At center, a huge dark monolithic slab — navy-black (#0c1118), not pure black — hangs under assembly from gantry lines, the single dark mass in an otherwise bleached field (#c5c7c4, #8b9295, #48545d). Tiny white-suited technicians stand scattered at its base like ants at a plinth. Flat institutional light, no drama. The mood is sterile reverence: something enormous being born under fluorescence, assembled with liturgical care.

## Model adaptation notes

- **Midjourney**: `vast white cleanroom interior, huge dark monolith under assembly, gantry lines, tiny white-suited technicians, gridded floor, one point perspective, cinematic concept art` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "flat white institutional light, no drama".
- **SD/Flux**: structured tags; AVOID → negative prompt (`warm tones, pure black, rim light, glow, faces, text`).

> **Prompt fidelity note**: expect 2–4 iterations; models will try to light the monolith dramatically or add orange safety details — "flat light, no warm tones" is the discipline.
