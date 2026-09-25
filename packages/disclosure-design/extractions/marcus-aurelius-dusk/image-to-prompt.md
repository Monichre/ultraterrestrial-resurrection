---
title: Image-to-prompt — marcus-aurelius-dusk
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `marcus-aurelius-dusk`

**Kind: asset** — eroded marble, gilt emboss, and dusk haze are raster render territory; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a weathered classical marble bust of Marcus Aurelius (bearded, curly-haired, eroded surface) on a black pedestal, standing on a thick antique hardcover book with gilt-embossed cover ornament
STYLE / MEDIUM: cinematic 3D render, neoclassical romanticism, museum-at-dusk concept still
COMPOSITION & CAMERA: landscape frame, bust in three-quarter profile quartered left-of-center facing right, receding fluted colonnade to a soft vanishing glow, shallow depth of field, upper half near-empty darkness
LIGHTING: single raking warm key from the left (last sunlight through a portico), deep oxblood shadows, atmospheric haze
PALETTE: near-black umber `#160e0c` field, bark-brown `#302518`, oxblood `#4b1411` shadow glow, sienna `#5e3720` mids, pale gold `#9c7951` reserved for gilt and lit marble planes
MOOD: meditative, reverent, stoic, crepuscular, hushed
BACKGROUND / INTEGRATION: `scene` — darkness baked in, edges fall to `#160e0c`
AVOID: no text, no watermark, no modern objects, no cool/blue light, no sharp midday light, no crowds, no color accents outside the ember palette

## Natural-language version

A cinematic 3D render of a weathered marble bust of Marcus Aurelius — bearded philosopher-emperor, eroded curls — mounted on a black pedestal atop a thick gilt-embossed antique hardcover book. Behind, a colonnade of fluted stone columns recedes into warm dusk haze. The light is the last of sunset raking in from the left: ember browns (#302518, #5e3720), deep oxblood shadow (#4b1411), near-black umber field (#160e0c), with pale gold (#9c7951) touching only the gilt emboss and the bust's lit planes. Meditative, reverent, hushed — a museum at closing time. Landscape frame, bust quartered left-of-center, the upper half falling away into darkness.

## Model adaptation notes

- **Midjourney**: `weathered marble bust of Marcus Aurelius on antique gilt book, dusk colonnade, chiaroscuro, cinematic 3d render` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "warm ember palette, no blue".
- **SD/Flux**: structured tags; AVOID → negative prompt (`text, watermark, blue light, modern objects`).

> **Prompt fidelity note**: expect 2–4 iterations; models tend to over-brighten museum scenes — the AVOID list's "no sharp midday light" is the lever.
