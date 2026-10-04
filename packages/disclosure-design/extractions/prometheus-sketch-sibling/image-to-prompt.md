---
title: Image-to-prompt — prometheus-sketch-sibling
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `prometheus-sketch-sibling`

**Kind: asset** — gestural pencil and smudge shading are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: Prometheus the Titan as a gestural figure study — loose searching contour line, darker ink accents, form emerging from smudged tonal shading
STYLE / MEDIUM: pencil sketch with stump/smudge shading on cool mid-grey paper; life-drawing atelier page
COMPOSITION & CAMERA: portrait plate, figure central with breathing room, edges open like a sketchbook crop
LIGHTING: tonal, modeled by smudge rather than cast light
PALETTE: mid-grey paper `#b5b5af`, shaded grey `#a0a099`, ink accents `#34383d`; near-achromatic
MOOD: intimate, unresolved, searching
BACKGROUND / INTEGRATION: `scene` — paper ground baked in
AVOID: no construction geometry, no grid, no hatching, no color, no finish/polish, no text

## Natural-language version

A loose gestural pencil sketch of Prometheus the Titan on cool mid-grey paper (#b5b5af): searching contour lines with darker ink accents (#34383d), the figure's form modeled by smudged stump shading (#a0a099) pooled around it rather than hatched inside it. Portrait plate, figure central, edges left open like a page from a working sketchbook. Near-achromatic, intimate, deliberately unresolved — the artist still deciding.

## Model adaptation notes

- **Midjourney**: `gestural figure study, smudged graphite, sketchbook page` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; "unfinished sketch" phrasing helps.
- **SD/Flux**: structured tags; AVOID → negative prompt (`grid, construction lines, color, polished`).

> **Prompt fidelity note**: expect 2–3 iterations; the smudge-not-hatch distinction is the lever that keeps it out of the sibling's territory.
