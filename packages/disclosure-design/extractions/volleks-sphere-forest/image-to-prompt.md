---
title: Image-to-prompt — volleks-sphere-forest
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `volleks-sphere-forest`

**Kind: asset** — sub-visible night matte is raster art; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a narrow bare-earth path through a dense night conifer forest, a tiny lone figure standing at the distant vanishing point, a thin strip of star field above the tree line
STYLE / MEDIUM: cinematic digital matte / concept frame, slow-cinema night photography finish, very low-key
COMPOSITION & CAMERA: landscape, severe one-point perspective — path as a central sightline funnel, trees as converging dark walls, sky confined to a thin upper band, eye-level camera
LIGHTING: almost none — faint cool ambient separating path from tree mass; stars are the only point sources
PALETTE: ground `#020206`, night median `#0a0c10`, tree mass `#1a1f24`, path/sky/figure catch `#374a4f` — a four-value blue-black ramp, nothing brighter
MOOD: nocturnal, hushed, remote, watchful
BACKGROUND / INTEGRATION: `scene` — darkness baked in edge to edge
AVOID: no moon, no fog glow, no visible sphere or craft, no warm tones, no detail in shadows, no text, no day-for-night blue wash

## Natural-language version

An extremely low-key cinematic night shot: a narrow bare-earth path runs straight through dense conifer forest in strict one-point perspective, a tiny lone figure standing at the vanishing point, a thin slit of star field above the tree line. The whole frame is a four-value blue-black ramp — ground #020206, tree mass #1a1f24, the path and sky barely lifted to #374a4f. No moon, no fog, no warm tones. The mood is watched solitude: quiet, remote, hushed — walking toward something that already knows you're coming.

## Model adaptation notes

- **Midjourney**: `night forest path one point perspective, lone figure at vanishing point, star slit above treeline, extreme low key, blue-black` — `--ar 16:9 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; models over-light night scenes — repeat "almost entirely black, only the path faintly visible".
- **SD/Flux**: structured tags; AVOID → negative prompt (`moon, fog, glow, warm, detailed shadows`).

> **Prompt fidelity note**: expect 3–5 iterations; the whole game is darkness discipline — models will try to add a moon. Resist.
