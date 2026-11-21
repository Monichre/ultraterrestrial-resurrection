---
title: Image-to-prompt — line-batch-8kto
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `line-batch-8kto`

**Kind: asset** — value is in paper tooth, hand tremor and sepia aging; CSS/code has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a dot-grid engineering journal page filled with a hand-drawn taxonomy of tiny line-art motifs — pyramids, cross-hatch swatches, stepped bar charts, topographic squiggles, asterisk bursts, flux arrows, latticed orbs — each captioned in small handwritten pencil labels
STYLE / MEDIUM: scanned physical notebook page, graphite and black ink on warm paper, visible tooth and ink unevenness
COMPOSITION & CAMERA: portrait sheet shot flat, rows of small motif cells at near-regular pitch filling the page, labels beneath each glyph, minimal margins
LIGHTING: flat scanner light, faint paper-shadow falloff toward edges
PALETTE: paper-cream `#dad1c4`, kraft-beige median `#c8beb3`, graphite near-black `#0e0e0e`, sepia mid-tone `#907e6c` staining
MOOD: methodical, obsessive, archival, warm-analog, pre-digital
BACKGROUND / INTEGRATION: `scene` — full-bleed page scan
AVOID: no digital vector cleanliness, no pure greyscale, no single hero motif, no perspective, no color accents, no typed labels

## Natural-language version

A scanned dot-grid engineering journal page: a dense, roughly regular grid of tiny hand-drawn black line-art motifs — pyramids, cross-hatch swatches, stepped bar charts, topographic squiggles, asterisk bursts, flux arrows, latticed orbs — each cell captioned in small handwritten pencil labels. Warm paper-cream (#dad1c4) with kraft-beige shadow (#c8beb3), graphite near-black ink (#0e0e0e) and faint sepia staining (#907e6c). The mood is methodical and archival: someone patiently cataloguing every permutation of a mark, paper tooth and hand tremor intact.

## Model adaptation notes

- **Midjourney**: `scanned dot grid sketchbook page, taxonomy of tiny ink geometric motifs, handwritten labels, sepia paper` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; insist on "hand-drawn, scanned paper" or models default to clean vector grids.
- **SD/Flux**: structured tags; AVOID → negative prompt (`vector, clean, greyscale, hero composition, typed text`).

> **Prompt fidelity note**: expect 3–5 iterations; the hard part is keeping it *many small cells* — models love escalating one motif into a hero. Repeat "grid of many small motifs, no single focus".
