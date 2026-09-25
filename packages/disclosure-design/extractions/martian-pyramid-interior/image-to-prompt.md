---
title: Image-to-prompt — martian-pyramid-interior
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `martian-pyramid-interior`

**Kind: asset** — volumetric haze, scale figures, and monolithic stone are raster render territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: the interior of a colossal subterranean pyramid — smooth sloping megastructure walls rising to a blinding amber atrium slit, twin ranks of small warm floor lights receding down a vast nave, tiny silhouetted human figures walking the center aisle
STYLE / MEDIUM: cinematic science-fiction concept art, establishing-shot render, volumetric haze
COMPOSITION & CAMERA: symmetrical one-point perspective, camera low and centered, walls converging to the glowing slot top-center, figures dwarfed low-center
LIGHTING: single overwhelming amber source at the atrium slit, subordinate warm pin-lights along the floor, everything else falling to umber shadow
PALETTE: floor near-black dried-blood `#100402`, walls roasted brown `#553928`, mids `#3c2214`, lit haze dusty tan `#9c816d`
MOOD: monolithic, reverent, hushed, dread-awe, biblical scale
BACKGROUND / INTEGRATION: `scene` — darkness baked in, edges fall to `#100402`
AVOID: no text, no UI overlays, no exterior sky, no cool/blue light, no visible technology or machinery, no crisp wall texture (haze swallows it)

## Natural-language version

A cinematic sci-fi concept render: standing inside a colossal subterranean pyramid, smooth sloping walls of roasted umber (#553928) rising through haze to a single blinding amber slit of light at the top of the frame. Two receding ranks of small warm floor lights draw perspective rails down the vast dark nave (#100402), and tiny human silhouettes walk the center aisle, dwarfed to insignificance. Symmetrical one-point perspective, low camera, volumetric dust turning the light tan (#9c816d). The mood is reverence and dread — architecture built by giants, experienced from within.

## Model adaptation notes

- **Midjourney**: `vast pyramid interior, one-point perspective, amber light slit, rows of floor lights, tiny silhouettes, volumetric haze, cinematic sci-fi concept art` — `--ar 3:2 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "interior, no sky visible".
- **SD/Flux**: structured tags; AVOID → negative prompt (`text, ui, sky, blue light, machinery`).

> **Prompt fidelity note**: expect 2–4 iterations; models often add exterior windows or tech greebles — "interior, no sky, no technology" is the discipline.
