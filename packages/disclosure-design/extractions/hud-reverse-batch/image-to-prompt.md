---
title: Image-to-prompt — hud-reverse-batch
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: hybrid
---

# Image-to-prompt — `hud-reverse-batch`

**Kind: hybrid** — the frame, rules, readouts, and reticles are DOM/CSS/SVG (see `component.tsx`); the contour-line face is an asset core (SVG trace or generated illustration). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a human face, frontal with eyes lowered, modeled entirely in fine sepia wireframe contour lines — topographic hatching following the facial planes, line density carrying the shading
STYLE / MEDIUM: vector-style contour-line illustration, blueprint/drafting-table linework, vintage-futurist FUI asset
COMPOSITION & CAMERA: straight-on portrait, face centered in a circular medallion crop, generous paper margin
LIGHTING: none depicted — shading is expressed through line density only
PALETTE: sepia ink `#0c0c0c` and faded tan `#a7917b` lines on bone paper `#daccb6`; deepest accent umber `#3f332c` used once
MOOD: clinical, archival, forensic, quietly intimate
BACKGROUND / INTEGRATION: `isolated` — face medallion on transparent or flat `#daccb6`, to be placed inside the HUD panel frame
AVOID: no photographic skin, no shading fills, no glow, no color outside the sepia family, no expression (eyes lowered, neutral)

## Natural-language version

A frontal human face, eyes lowered and expression neutral, drawn entirely in fine sepia wireframe contour lines — topographic hatching that follows the planes of the face, with shading expressed only through line density. Ink (#0c0c0c) and faded tan (#a7917b) lines on bone paper (#daccb6), one deep umber accent (#3f332c). Centered in a circular medallion crop with generous margin. The mood is clinical and archival: a person rendered as measurement, a dossier portrait rather than a photograph.

## Model adaptation notes

- **Midjourney**: `face drawn in fine contour lines, topographic wireframe portrait, sepia ink on bone paper, blueprint style` — `--ar 1:1 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; request `background: "transparent"` via API if placing over the panel.
- **SD/Flux**: structured tags; AVOID → negative prompt (`photo, skin, shading fills, glow, color`).

> **Prompt fidelity note**: expect 3–5 iterations; models drift to photographic faces — "contour lines only, no photographic skin" is the discipline. A traced-SVG pipeline from a real photo is the deterministic alternative.

## Consistency notes

The asset must sit inside the `hud-reverse-batch` code shell (`component.tsx`) on `var(--color-bg-primary)` `#daccb6`; line color resolves to `var(--color-text-primary)` `#0c0c0c`. Transplanting into a dark-polarity HUD means inverting both — do not mix bone paper with a dark terminal frame.
