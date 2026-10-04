---
title: Image-to-prompt — photo-mood-collages
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `photo-mood-collages`

**Kind: asset** — a collage of film photographs; CSS can build the grid but not the pictures. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a tall grid collage of small analog photographs — sunlit interiors, vernacular Mediterranean architecture, doorway and shutter details, textured walls, quiet street fragments — all washed in warm cream and faded beige, with one or two frames in saturated cobalt blue (painted door/shutters)
STYLE / MEDIUM: 35mm point-and-shoot film photography, contact-sheet moodboard
COMPOSITION & CAMERA: portrait 2:3 sheet, uniform small frames with thin equal gutters, meandering reading order, the cobalt frame(s) placed off-center
LIGHTING: hard warm sunlight inside every frame; the sheet itself evenly lit
PALETTE: warm cream `#e9d7b1` dominant across the sheet; saturated cobalt `#355aa7` as the single cold accent
MOOD: sun-bleached, nostalgic, domestic, tactile, quietly curated
BACKGROUND / INTEGRATION: `scene` — the collage sheet is the deliverable
AVOID: no mixed color grades, no digital-clean frames, no second accent color, no captions or text, no people posing, no black frames

## Natural-language version

A tall contact-sheet collage of small 35mm film photographs: sunlit interiors, vernacular Mediterranean doorways and shutters, textured walls, quiet street fragments — every frame washed in the same warm cream (#e9d7b1) and faded beige film grade, except one or two frames that detonate in saturated cobalt blue (#355aa7), a painted door or shutter, placed off-center. Uniform small frames, thin equal gutters, portrait sheet. The mood is archived summer: nostalgic, domestic, quietly curated — someone looked carefully at the world.

## Model adaptation notes

- **Midjourney**: `contact sheet collage of 35mm film photos, sunlit mediterranean details, warm cream grade, one cobalt blue door photo, uniform grid` — `--ar 2:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "every photo shares one warm film grade except the blue door".
- **SD/Flux**: structured tags; AVOID → negative prompt (`mixed grades, digital look, second accent, text, posed people`).

> **Prompt fidelity note**: expect 3–5 iterations; multi-frame coherence is hard — generating individual frames and gridding them in post (thin gutters, one grade) is the deterministic fallback.
