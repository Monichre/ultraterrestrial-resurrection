---
title: Image-to-prompt — prometheus-portrait-arrow
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `prometheus-portrait-arrow`

**Kind: asset** — graphite line texture and the portrait itself are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: portrait of Prometheus the Titan as a youthful classical demi-god, idealized profile/three-quarter head in fine graphite contour line, crossed by one bold diagonal arrow
STYLE / MEDIUM: high-key graphite sketch on near-white warm paper; emblem-book minimalism, academic drawing
COMPOSITION & CAMERA: portrait plate, head floating high-center in vast negative space, arrow cutting a single decisive diagonal
LIGHTING: even, shadowless — scanned drawing register
PALETTE: near-white `#e0dfd9` ground, graphite `#9b9fa1` line, arrow near-black `#34383d`; achromatic
MOOD: poised, allegorical, heraldic calm
BACKGROUND / INTEGRATION: `scene` — paper ground baked in
AVOID: no hatching or wash, no grid, no annotations, no color, no photorealism, no ornament

## Natural-language version

A high-key graphite portrait of Prometheus as a youthful classical demi-god on near-white warm paper (#e0dfd9): an idealized profile head drawn in fine silver-grey contour line (#9b9fa1), floating in generous negative space, with a single bold near-black arrow cutting a decisive diagonal across the plate. Achromatic, emblematic, no hatching, no grid, no text — myth compressed toward a logo, calm and heraldic.

## Model adaptation notes

- **Midjourney**: `graphite portrait emblem, minimal line drawing` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; insist on "one arrow only" (models tend to multiply arrows).
- **SD/Flux**: structured tags; AVOID → negative prompt (`hatching, grid, text, color`).

> **Prompt fidelity note**: expect 2–4 iterations; keeping the field empty (AVOID list) is the strongest lever.
