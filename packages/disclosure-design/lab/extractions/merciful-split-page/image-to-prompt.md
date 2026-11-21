---
title: Image-to-prompt — merciful-split-page
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `merciful-split-page`

**Kind: asset** — literary print page; handwriting, hatch corridor and hand are raster art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a light split page in black ink on cream paper — left a dense column of cursive handwriting ending in two dark scribbled redaction blocks, right a tall narrow corridor walled in dense vertical hatch-lines with a small hand reaching up at its base, the Lovecraft "most merciful thing" quote in tracked-out caps across the foot
STYLE / MEDIUM: weird-fiction letterpress / ink illustration, flat high-contrast line on paper
COMPOSITION & CAMERA: portrait, strong vertical split (cursive left / corridor right), quote spanning the full foot, corridor verticals pulling the eye up
LIGHTING: flat — print, no scene light
PALETTE: cream paper `#c3baaa`, near-black ink `#191817` / `#2d2b29`, warm greys `#a7a092` / `#666259` in hatch density; chroma-scarce warm-neutral
MOOD: stark, graphic, claustrophobic — dread made legible
BACKGROUND / INTEGRATION: `scene` — full-bleed page
AVOID: no rendering/shading, no color, no dark background, no tidy type, no glow, no clean margins

## Natural-language version

A light split page in black ink on cream paper (#c3baaa): the left column a dense block of cursive handwriting ending in two dark scribbled redaction blocks, the right a tall narrow corridor walled in dense vertical hatch-lines with a small hand reaching up at its base, and the Lovecraft quote in tracked-out caps across the foot. Flat, high-contrast ink — no shading. The mood is dread made legible: confession typeset for the record, the corridor claustrophobic.

## Model adaptation notes

- **Midjourney**: `black ink on cream paper, split page, handwritten cursive column and a tall hatched corridor with a small reaching hand, lovecraft quote footer, letterpress, flat line` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version; quote text imperfect — set type in post.
- **SD/Flux**: structured tags; AVOID → negative prompt (`shaded, rendered, color, dark background, glow, clean type`).

> **Prompt fidelity note**: expect 4–6 iterations; the failure mode is (a) shading the corridor and (b) illegible quote. Keep "flat ink, hatched not shaded" explicit, and plan to set the quote separately.
