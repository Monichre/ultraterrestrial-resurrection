---
title: Image-to-prompt — hud-line-geometry
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: hybrid
---

# Image-to-prompt — `hud-line-geometry`

**Kind: hybrid** — ruler scales, crosshairs, scan bar, and labels are DOM/CSS/SVG (see `component.tsx`); the field-line face is an asset core (SVG trace or generated illustration). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: an androgynous classical human face in three-quarter view, gaze lowered, modeled entirely in flowing topographic contour lines that stream over the cranium like a magnetic field — line density carrying all shading
STYLE / MEDIUM: vector-style field-line illustration, drafting-instrument precision, specimen-plate aesthetics
COMPOSITION & CAMERA: portrait 3:4, face centered and dominant, slight tilt, generous paper margin
LIGHTING: none depicted — shading expressed through line density only
PALETTE: navy-black ink `#090b11` and silver `#aeaaa5` lines on warm bone paper `#e0dad2`; slate `#303138` for dense regions
MOOD: clinical, elegant, serene, exacting
BACKGROUND / INTEGRATION: `isolated` — face on transparent or flat `#e0dad2`, to be placed inside the specimen-plate chrome
AVOID: no photographic skin, no fills, no straight wireframe mesh (lines must flow), no color beyond navy/gray, no expression

## Natural-language version

An androgynous classical face in three-quarter view, gaze lowered, drawn entirely in flowing topographic contour lines that stream over the cranium like a magnetic field — shading expressed only through line density. Navy-black ink (#090b11) and silver (#aeaaa5) on warm bone paper (#e0dad2), with slate (#303138) in the densest regions. Portrait format, face centered with generous margin. The mood is clinical and serene: a person rendered as a surveyed specimen, beautiful and unsettling in equal parts.

## Model adaptation notes

- **Midjourney**: `face drawn in flowing topographic contour lines, magnetic field line portrait, navy ink on bone paper, specimen plate` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; API `background: "transparent"` if compositing over the plate.
- **SD/Flux**: structured tags; AVOID → negative prompt (`photo, skin, fills, wireframe mesh, color`).

> **Prompt fidelity note**: expect 3–5 iterations; models drift to fingerprint-like rings or photo-faces — "lines must flow over the cranium" is the discipline. Traced SVG from a depth map is the deterministic alternative.

## Consistency notes

Place inside the `hud-line-geometry` code shell (`component.tsx`) on `var(--color-bg-primary)` `#e0dad2`; linework resolves to `var(--color-text-primary)` `#090b11`. Keep the chrome rectilinear — the face is the only organic element. Do not mix with hud-reverse-batch's sepia ink on the same screen.
