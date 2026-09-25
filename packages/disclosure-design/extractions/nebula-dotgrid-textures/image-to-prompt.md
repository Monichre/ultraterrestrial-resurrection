---
title: Image-to-prompt — nebula-dotgrid-textures
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `nebula-dotgrid-textures`

**Kind: asset** — the nebula's organic noise is raster territory (the hex grid alone would be code; fused, the asset wins). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a 2×2 contact sheet of background textures — each panel dark olive nebula smoke drifting diagonally, pinned under a fine hairline hexagonal dot grid, thin dividers between panels
STYLE / MEDIUM: digital texture reference sheet; military-sim map-backdrop finish; night-vision olive register over deep-field astrophotography
COMPOSITION & CAMERA: strict 2×2 grid of equal landscape panels, flat frontal view, no perspective; inside each panel the smoke drifts while the hex lattice stays fixed
LIGHTING: none — self-luminous texture, no source, no shadows
PALETTE: near-black olive `#11180b`, dark moss `#252d1a` / `#212a17`, mid olive `#404c30`, greyed sage `#717a5c` as the lightest glint — nothing warm, nothing blue
MOOD: murky, tactical, patient — sonar-room calm, surveying something vast
BACKGROUND / INTEGRATION: `scene` — panels fill the frame edge to edge
AVOID: no stars as points (smoke only), no blue or purple space clichés, no bright grid lines, no text or labels, no UI widgets, no vignette

## Natural-language version

A texture reference sheet divided into four equal panels (2×2, thin dividers): each panel shows dark olive nebula smoke drifting diagonally — layered wisps in near-black olive `#11180b`, moss `#252d1a` and mid olive `#404c30` — with a fine hairline hexagonal dot grid laid over the smoke in greyed sage `#717a5c`. Night-vision military-sim register, no stars as points, no blue. The mood is sonar-room calm: vast organic drift surveyed by a precise instrument. Flat, frontal, edge-to-edge texture.

## Model adaptation notes

- **Midjourney**: `dark olive nebula smoke texture, hexagonal dot grid overlay, military sim map background, night vision palette` — `--ar 8:5 --style raw --tile` (test the tile).
- **gpt-image / DALL-E**: NL version as-is; repeat "four panels separated by thin dividers" or it will return one continuous field.
- **SD/Flux**: structured tags; AVOID → negative prompt (`stars, blue, purple, text, UI, vignette`); generate single panels and assemble the sheet in post for cleaner tiling assets.

> **Prompt fidelity note**: expect 3–5 iterations; models love adding star points and blue spill — both are in the AVOID block for a reason.
