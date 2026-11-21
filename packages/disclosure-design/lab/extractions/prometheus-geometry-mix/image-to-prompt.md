---
title: Image-to-prompt — prometheus-geometry-mix
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `prometheus-geometry-mix`

**Kind: asset** — glow, hatching and wireframe fusion are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: Prometheus the Titan's head rendered as a hybrid — half hand-hatched sketch, half luminous wireframe — wrapped in construction circles, triangulation and hairline grid
STYLE / MEDIUM: white-ink / chalk technical drawing on a near-black blue-tinged board; blueprint × classical study
COMPOSITION & CAMERA: portrait plate, head central, geometry radiating outward and dissolving into the dark
LIGHTING: self-luminous line; no external light source, no cast shadow
PALETTE: ground `#13171a`, primary line `#9d9d95`, dim line `#888780`, median `#545551`; silvered dark register
MOOD: analytic, nocturnal, cosmic, reverent
BACKGROUND / INTEGRATION: `scene` — dark ground baked in
AVOID: no UI widgets/readouts, no color accents, no paper texture, no photorealism, no text

## Natural-language version

Prometheus the Titan's head on a near-black blue-tinged field (#13171a), drawn half in hand-hatched sketch line and half in luminous silver wireframe (#9d9d95, dimmed #888780), encircled by glowing construction geometry — circles, triangulation, hairline grid — that radiates outward and dissolves into darkness. Portrait plate, self-luminous line, no cast light. The mood is a star-chart of a myth: analytic, nocturnal, reverent.

## Model adaptation notes

- **Midjourney**: `glowing technical drawing, white line on black, construction geometry` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; "chalk on blackboard" anchors the medium.
- **SD/Flux**: structured tags; AVOID → negative prompt (`UI, text, color, paper`).

> **Prompt fidelity note**: expect 2–4 iterations; the half-sketch/half-wireframe split is the lever — name it explicitly or models pick one.
