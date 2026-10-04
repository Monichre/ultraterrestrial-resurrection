---
title: Image-to-prompt — geometry-sibling-vxtf
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `geometry-sibling-vxtf`

**Kind: asset** — a tonal schematic plate; value is the dim register, not reproducible meaningfully in code. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a sparse vertical stack of geometric line constructions — a wireframe pyramid with internal construction lines, a faint orbital ring system, small tick-marks and dimension lines — on a near-pure-black field
STYLE / MEDIUM: blackboard geometry / dark schematic, dim grey chalk-like line on black
COMPOSITION & CAMERA: portrait, constructions in a loose vertical stack with generous black intervals, no grid, no border, marks floating
LIGHTING: none — marks self-present as dim grey
PALETTE: near-total black `#000000` (≈79% of frame), faint grey ladder `#191a1a` / `#343433` / `#565656`; achromatic
MOOD: austere, nocturnal, withheld — hushed concentration
BACKGROUND / INTEGRATION: `scene` — full-bleed black field
AVOID: no bright lines, no white, no grid, no border, no color, no glow, no dense composition

## Natural-language version

A sparse vertical stack of geometric constructions — a wireframe pyramid with internal construction lines, a faint orbital ring system, small tick-marks and dimension lines — drawn in dim grey chalk on a near-pure-black field (#000000, 79% of frame), the marks in a faint grey ladder (#191a1a to #565656). Portrait, loose vertical stack with generous black between, no grid, no border. The mood is hushed concentration: geometry whispered, a chalkboard in a dark room.

## Model adaptation notes

- **Midjourney**: `minimal geometric line constructions on pure black background, dim grey chalk lines, wireframe pyramid, orbital rings, sparse, dark schematic` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version; repeat "very dim grey on pure black, mostly empty black" — models default to bright white lines.
- **SD/Flux**: structured tags; AVOID → negative prompt (`white, bright, glow, grid, border, color, dense`).

> **Prompt fidelity note**: expect 3–5 iterations; the failure mode is bright white-on-black. The reference is *dim* — max contrast 2.86:1. Say "dim grey, barely visible, mostly black" explicitly.
