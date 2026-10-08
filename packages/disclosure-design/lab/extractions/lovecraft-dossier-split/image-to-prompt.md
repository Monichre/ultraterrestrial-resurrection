---
title: Image-to-prompt — lovecraft-dossier-split
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `lovecraft-dossier-split`

**Kind: asset** — the handwriting and rendered hand are raster art; the split layout alone is code-able. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a noir dossier page split vertically — left a dense block of running cursive handwriting, right a rendered hand reaching up toward a tall diagonally-hatched portal of parallel lines, with the Lovecraft quote "The most merciful thing in the world is the inability of the human mind to correlate all its contents" in faint wide-spaced caps across the foot
STYLE / MEDIUM: weird-fiction case-file page, half manuscript facsimile, half tonal evidence photo
COMPOSITION & CAMERA: portrait, strong vertical split (text left / image right), quote spanning full width at the foot, the bright portal upper-right
LIGHTING: low, hushed, the portal the only bright event
PALETTE: warm near-black `#211f1d` / `#22201e` ground, muted warm taupe `#998f86` for all text and the rendered hand; chroma-scarce monochrome warm-dark
MOOD: confessional, occult, noir — dread tempered by confession
BACKGROUND / INTEGRATION: `scene` — full-bleed page
AVOID: no color accent, no bright white, no tidy justified type, no second image, no modern UI chrome

## Natural-language version

A noir dossier page split vertically: the left column a dense block of running cursive handwriting, the right a rendered hand reaching up toward a tall diagonally-hatched portal of parallel lines (the only bright event), and the Lovecraft line "The most merciful thing in the world is the inability of the human mind to correlate all its contents" set in faint wide-spaced caps across the foot. Warm near-black ground (#211f1d), everything in a muted warm taupe (#998f86). The mood is testimony that knows too much: intimate, occult, quietly frightened.

## Model adaptation notes

- **Midjourney**: `noir dossier page, split layout, handwritten cursive column and a hand reaching toward a hatched portal, lovecraft quote footer, dark, monochrome` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version; quote text will render imperfectly — consider adding real type in post.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, bright, white, tidy type, modern, clean`).

> **Prompt fidelity note**: expect 4–6 iterations; models struggle with (a) legible long quotes and (b) the split discipline. Generate the split + hand, then set the quote in type separately for fidelity.
