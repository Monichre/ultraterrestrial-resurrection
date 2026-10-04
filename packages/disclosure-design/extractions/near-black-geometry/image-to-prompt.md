---
title: Image-to-prompt — near-black-geometry
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `near-black-geometry`

**Kind: asset** — the value is in the exact hairline-at-visibility-floor balance and the paper grain; a redraw is possible (see `design.md`) but the reference itself is raster plate art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a vintage geometry book plate — one large upright diamond (two triangles joined base-to-base) drawn in faint hairline grey, subdivided by construction lines into triangular facets, a small circle floating near the apex, a faint illegible caption line centered below
STYLE / MEDIUM: nineteenth-century scientific-plate engraving scanned from a printed page; visible paper grain; sacred-geometry diagram tradition
COMPOSITION & CAMERA: portrait field, figure dead-centered on the vertical axis, wide black margins, caption anchored at the bottom — classic figure-over-legend plate layout
LIGHTING: none — flat scan; the figure exists only as tonal deviation from black
PALETTE: absolute black `#000000` field (≈74%), faint mid-grey `#50504f` line (≈5%), warm near-black `#1f1e1c` grain (≈4%) — nothing else
MOOD: hermetic, patient, subterranean — quiet revelation, knowledge disclosed to the patient
BACKGROUND / INTEGRATION: `scene` — black field baked in, grain continuous to the edges
AVOID: no bright or white lines, no color, no glow, no thick strokes, no modern vector crispness, no legible text, no borders or frames

## Natural-language version

A vintage sacred-geometry book plate on an almost entirely black field (`#000000`): one large upright diamond formed of two triangles joined at the base, drawn in the faintest hairline grey (`#50504f`), subdivided by construction lines into triangular facets, with a small circle floating near the apex and a faint, illegible caption line centered below. Visible paper grain across the whole portrait field; the lines sit right at the floor of visibility, so the viewer leans into the dark to read the figure. Hermetic, patient, quiet. No glow, no color, no thick strokes.

## Model adaptation notes

- **Midjourney**: `sacred geometry book plate, faint grey hairline diamond diagram on black, antique engraving, paper grain` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; models will over-brighten — repeat "lines barely visible, almost black on black".
- **SD/Flux**: structured tags; AVOID → negative prompt (`glow, white lines, color, thick stroke, legible text`); add a light noise/grain pass in post if the render comes out too clean.

> **Prompt fidelity note**: expect 3–5 iterations; generative models strongly resist near-invisible line work — the AVOID block and "barely visible" phrasing do the heavy lifting.
