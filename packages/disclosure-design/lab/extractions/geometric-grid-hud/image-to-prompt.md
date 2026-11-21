---
title: Image-to-prompt — geometric-grid-hud
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `geometric-grid-hud`

**Kind: asset** — the collage's print-scan grain and photographic panel fragments are raster work (the *grammar* inside panels is SVG-code-able; the sheet itself is an asset). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a six-panel collage (3×2) of vintage analog instrument imagery — circular scopes with crosshair reticles, radial tick rings, contour-line fields, orthogonal survey grids, blocky technical readouts — each panel a different display fragment
STYLE / MEDIUM: print-scanned 1960s–70s instrumentation ephemera; oscilloscope / plotting-table / survey-plate aesthetic; subtle scan grain
COMPOSITION & CAMERA: strict 3×2 grid of equal panels, flat frontal; panels alternate radial grammar (scopes, rings) and orthogonal grammar (grids, readouts)
LIGHTING: flat scan light; no depth, no cast shadows
PALETTE: paper-grey monochrome — pale grey `#bfbeb6`, warm mid-grey `#a19e97`, soft grey `#8a8682`, near-black charcoal `#393435` for every line and label; zero chroma
MOOD: calibrated, methodical, archival — cold-war competence, the reassurance of measurement
BACKGROUND / INTEGRATION: `scene` — the sheet fills the frame
AVOID: no color (no radar green, no phosphor blue), no glow or bloom, no modern UI widgets, no legible words, no people, no perspective depth

## Natural-language version

A print-scanned collage of six equal panels in a strict 3×2 grid, each showing a fragment of 1960s–70s analog instrumentation: circular scopes with crosshair reticles, radial tick rings, contour-line fields, orthogonal survey grids, blocky technical readouts. Everything in paper-grey monochrome — pale `#bfbeb6`, mid `#a19e97`, soft `#8a8682`, with all lines and labels in near-black charcoal `#393435` — flat scan light, subtle grain, zero color. The mood is calibrated cold-war competence: measurement as the only ornament. No glow, no modern UI, no legible words.

## Model adaptation notes

- **Midjourney**: `vintage analog instrument collage, oscilloscope reticles, contour lines, survey grids, grayscale print scan` — `--ar 2:1 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "strict 3×2 panel grid" and "grayscale only".
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, glow, bloom, modern UI, legible text, people, depth`).

> **Prompt fidelity note**: expect 3–5 iterations; models will smuggle in phosphor green the moment "HUD" or "scope" appears — the AVOID block and "zero chroma" phrasing are the levers.
