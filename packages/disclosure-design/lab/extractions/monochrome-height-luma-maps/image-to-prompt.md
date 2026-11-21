---
title: Image-to-prompt — monochrome-height-luma-maps
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `monochrome-height-luma-maps`

**Kind: asset** — the foggy height-map render is raster territory (the contour panel alone would be SVG-able, but the diptych is one plate). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a two-panel monochrome diptych — LEFT: a fog-drowned grayscale height-map render of impossible monument architecture (stepped terraces, arches, monolith towers, a radial spire crown) like a machined relief or LiDAR bake; RIGHT: a radial topographic contour map of the same structure, jagged concentric signal rings around a central peak
STYLE / MEDIUM: technical-visualization art plate, photogrammetry aesthetic, survey-report presentation
COMPOSITION & CAMERA: ultrawide 2:1 frame split by a black gutter; left panel atmospheric depth, right panel flat centered diagram
LIGHTING: none depicted — value carries elevation, fog carries depth
PALETTE: near-black `#090909` field, charcoal `#232323` high terrain and contour lines, nothing else
MOOD: surveyed, funereal, precise, analytical, ghosted
BACKGROUND / INTEGRATION: `scene` — black baked in, edges are `#090909`
AVOID: no color, no text, no axis labels, no gridlines beyond the contours, no glow, no mid-gray clutter beyond the two-value system

## Natural-language version

A two-panel monochrome diptych on near-black (#090909). Left panel: a fog-drowned grayscale height-map render of impossible monument architecture — stepped terraces, arches, monolith towers, a radial spire crown — rendered like a machined relief or LiDAR bake, depth carried by fog. Right panel: a radial topographic contour map of the same structure — jagged concentric rings around a central peak, a polar seismograph plot in charcoal (#232323) on black. No text, no color, no grid. The mood is forensic reverence: a monument reduced to its measurements, surveyed in total darkness.

## Model adaptation notes

- **Midjourney**: `monochrome diptych, foggy height map render of monument architecture, radial topographic contour map, black background, lidar aesthetic` — `--ar 2:1 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "two panels side by side, only black and charcoal gray".
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, text, labels, glow, grid`).

> **Prompt fidelity note**: expect 3–5 iterations; models want to add axis labels and blue heightmap gradients — "no text, no color" is the discipline. The right panel is deterministically rebuildable as SVG if generations drift.
