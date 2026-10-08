---
title: Image-to-prompt — dotgrid-journal-page
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `dotgrid-journal-page`

**Kind: asset** — value is the hand-drawn line and white space; the dot-grid is reproducible in CSS but the studies are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a clean dot-grid journal page of fine-line technical studies — wireframe pyramids, isometric boxes, a spiral, zigzag and waveform studies, a latticed sphere, a ringed planet with construction lines, small charts, asterisks — with a few scattered handwritten words
STYLE / MEDIUM: fine pen on dot-grid paper, digital facsimile of an engineering journal, crisp and clean
COMPOSITION & CAMERA: portrait sheet, studies scattered as a loose constellation, generous white space, no hierarchy, no ruling beyond the dot grid
LIGHTING: flat even light, clean scan
PALETTE: two values only — cool off-white `#f9faf4` sheet, soft warm charcoal `#4e463c` line; no third color
MOOD: calm concentration, studious, airy, lightly playful
BACKGROUND / INTEGRATION: `scene` — full-bleed page
AVOID: no sepia, no staining, no aging, no pure black line, no rigid grid layout, no color, no typed text

## Natural-language version

A clean dot-grid engineering journal page: fine-line technical studies — wireframe pyramids, isometric boxes, a spiral, zigzag and waveform studies, a latticed sphere, a small ringed planet with construction lines — scattered as a loose constellation across generous white space, with a few handwritten words in the margins. Two values only: cool off-white paper (#f9faf4) and a soft warm charcoal line (#4e463c). The mood is calm concentration: a fresh page, a fine pen, and one whimsical planet among the geometry.

## Model adaptation notes

- **Midjourney**: `clean dot grid journal page, fine line technical studies, geometric doodles, lots of white space, minimal` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version; insist on "lots of empty white space, loose scattered layout" or models fill the page edge-to-edge.
- **SD/Flux**: structured tags; AVOID → negative prompt (`sepia, aged, texture, black, dense, color, grid layout`).

> **Prompt fidelity note**: expect 2–4 iterations; the failure mode is density — models over-fill. The reference's identity is the *space between* the studies.
