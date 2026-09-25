---
title: Image-to-prompt — line-batch-v7to
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `line-batch-v7to`

**Kind: asset** — hand hatch and etching texture are raster/drawn territory; flat CSS fills would betray the register. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a classical architectural capriccio — a colonnaded rotunda with coffered dome, triumphal arches, broken entablatures, statuary niches, and receding vaulted bays, all shadow built from dense hand hatch and cross-hatch
STYLE / MEDIUM: pen-and-ink etching in the Piranesi tradition, architectural frontispiece
COMPOSITION & CAMERA: landscape, one-point perspective down a colonnade pulling right-to-center, dome and arches stacked upper-left, paper visible at sky and margins
LIGHTING: depicted only through hatch density — no wash, no fill
PALETTE: ink `#151616` on warm bone paper `#d9d0bc`; hatch mids `#3b3a37`; faded distant line `#9d978a`
MOOD: erudite, theatrical, ruin-romantic, antiquarian, patient
BACKGROUND / INTEGRATION: `scene` — paper ground baked in
AVOID: no flat vector fills, no color, no wash or watercolor, no modern buildings, no people in modern dress, no text

## Natural-language version

A pen-and-ink etching in the Piranesi tradition: a classical architectural capriccio with a colonnaded rotunda and coffered dome, triumphal arches, broken entablatures, statuary niches, and vaulted bays receding in strict one-point perspective. Every shadow is built from dense hand hatch and cross-hatch — no wash, no flat fills. Dark ink (#151616) on warm bone paper (#d9d0bc), with hatch mids (#3b3a37) and faded distant lines (#9d978a). Landscape composition, dome stacked upper-left, paper breathing at the margins. The mood is scholarly awe: imaginary architecture rendered with real conviction, grandeur filtered through patience.

## Model adaptation notes

- **Midjourney**: `piranesi architectural capriccio etching, colonnaded rotunda coffered dome, cross hatch shading, pen and ink on bone paper` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "all shading is cross-hatch, no wash".
- **SD/Flux**: structured tags; AVOID → negative prompt (`flat fills, color, watercolor, modern, text`).

> **Prompt fidelity note**: expect 3–5 iterations; models drift to pencil-sketch looseness or watercolor wash — "etching, cross-hatch only" is the discipline.
