---
title: Image-to-prompt — spy-lab-war-room-moodboard
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `spy-lab-war-room-moodboard`

**Kind: asset** — photographic set-design collage; nothing CSS can express. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a tall photographic moodboard of a spy war-room / horological laboratory — wall of small CRT monitors, a huge black-and-white blow-up of a mechanical watch face dominating one wall, a terrain-model planning table, strips of hanging surveillance photographs, archive shelving with labeled boxes, pendant workshop lamps, a desk cluttered with mechanical watches and papers, one lone figure standing amid it all
STYLE / MEDIUM: production-design reference collage, analog film photography, warm-gray grade
COMPOSITION & CAMERA: portrait 3:4 plate, loose grid of interior shots, the giant watch blow-up anchoring the top, survey reading order
LIGHTING: warm tungsten practicals (pendant lamps, monitor glow), soft and dim
PALETTE: bone `#c8c2b4`, taupe `#9c9a91`, bronze-tan `#947f61`, near-black `#171513`, off-white `#e1ded5`
MOOD: archival, obsessive, methodical, lived-in, analog
BACKGROUND / INTEGRATION: `scene` — the collage plate is the deliverable
AVOID: no modern flatscreens, no saturated color, no daylight, no clean minimal surfaces, no digital UI, no text captions

## Natural-language version

A tall photographic moodboard of a 1970s–80s spy war-room crossed with a horological laboratory: a wall of small CRT monitors, one wall dominated by a huge black-and-white photographic blow-up of a mechanical watch face, a terrain-model planning table, strips of surveillance photographs hanging from wires, archive shelving with labeled boxes, pendant workshop lamps, a desk cluttered with mechanical watches and papers, and a lone figure standing amid the archive. Warm-gray archival grade throughout — bone (#c8c2b4), taupe (#9c9a91), bronze-tan (#947f61), near-black (#171513), off-white (#e1ded5) — lit by dim tungsten practicals. The mood is methodical obsession: a life's work wallpapered around one person.

## Model adaptation notes

- **Midjourney**: `photographic moodboard collage, 1970s spy war room, wall of crt monitors, giant black and white watch photograph, archive shelves, hanging photo strips, tungsten lamps, warm gray` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "collage of multiple photos of the same room".
- **SD/Flux**: structured tags; AVOID → negative prompt (`flatscreen, saturated color, daylight, minimal, text`).

> **Prompt fidelity note**: expect 3–5 iterations; models struggle with coherent multi-panel collages — generating the room as one wide shot and cropping panels in post is the deterministic fallback.
