---
title: Image-to-prompt — daedalus-line-geometry
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `daedalus-line-geometry`

**Kind: asset** — graphite line and proportion-study nuance are drawn territory (the geometry layer alone would be SVG-reproducible, but not the head). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a classical bearded head — the Daedalus/maker archetype — drawn in fine graphite line, three-quarter view, with its construction geometry left visible: proportional circles, arcs, center-lines, and radial guides scribed across and around the face
STYLE / MEDIUM: Renaissance proportion study, Dürer-style measurement plate, treatise illustration
COMPOSITION & CAMERA: portrait 3:4, head centered slightly low, construction arcs radiating beyond the skull into the margins
LIGHTING: none depicted — uniform fine line, hierarchy carried by density
PALETTE: paper `#c5c5c3`, construction guides `#a9abaa`, figure line `#636464` — saturation near zero throughout
MOOD: scholastic, exacting, luminous-pale, methodical, revelatory
BACKGROUND / INTEGRATION: `scene` — paper baked in
AVOID: no hatch or shading, no ink-black strokes, no color, no decorative circles that don't construct the head, no text or numerals, no frame ornament

## Natural-language version

A Renaissance proportion study: a classical bearded head in three-quarter view, drawn in fine graphite line, with all its construction geometry left visible — proportional circles, arcs, center-lines, and radial guides scribed across and around the face, radiating into the margins. Paper white (#c5c5c3), guides in light gray (#a9abaa), figure line in mid graphite (#636464). Uniform fine line weight; no hatch, no shading, no color. Portrait format, head centered slightly low. The mood is quiet intellectual intimacy: a mind measuring beauty, the scaffolding the finished work will hide.

## Model adaptation notes

- **Midjourney**: `renaissance proportion study, classical bearded head with construction geometry circles and arcs visible, fine graphite line drawing, durer measurement plate` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "construction lines left visible, no shading".
- **SD/Flux**: structured tags; AVOID → negative prompt (`hatch, shading, black ink, color, text, ornament`).

> **Prompt fidelity note**: expect 3–5 iterations; models add shading or drop the geometry — "no hatch, guides visible" is the discipline. Verify the arcs actually intersect the head's landmarks; decorative circles are the failure mode.
