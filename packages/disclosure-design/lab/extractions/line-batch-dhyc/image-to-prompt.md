---
title: Image-to-prompt — line-batch-dhyc
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `line-batch-dhyc`

**Kind: asset** — engraved hatching and parchment aging are raster/hand work; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a reference sheet of fine engraved line-art plates — technical patent-style figures, geometric diagrams and figural sketches in a loose grid; some plates black line on aged cream, others inverted cream line on black
STYLE / MEDIUM: nineteenth-century steel engraving / patent-office figure sheet; visible hatching and section lines; aged parchment ground
COMPOSITION & CAMERA: landscape sheet, loose grid of self-contained plates, each figure centered with margin; flat frontal scan view
LIGHTING: flat scan light; no depth or cast shadow
PALETTE: pale parchment `#f1d1a9`, absolute black `#000000`, mid sepia `#9d8165`, median panel grey `#2c2c2c` — warm register throughout
MOOD: archival, meticulous, scholarly — the pleasure of the archive, a draftsman's quiet pride
BACKGROUND / INTEGRATION: `scene` — the sheet fills the frame
AVOID: no color accents, no modern vector line quality, no text or legible labels, no photographic elements, no rough sketchy strokes (engraved = deliberate)

## Natural-language version

A landscape reference sheet of nineteenth-century engraved line plates in a loose grid: technical patent-style figures, geometric diagrams and figural sketches, each centered in its own plate with margin. Some plates are black line on aged parchment cream (`#f1d1a9`), others invert to cream line on absolute black (`#000000`), with mid sepia (`#9d8165`) aging throughout. Fine deliberate hatching, section lines, the discipline of a patent-office figure sheet. Archival, meticulous, warm. No color, no modern vector look, no legible text.

## Model adaptation notes

- **Midjourney**: `vintage patent drawing sheet, engraved line plates, black on cream and cream on black, aged parchment, fine hatching` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "some panels inverted: cream lines on black" — models default to one polarity.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, sketchy, rough, modern, text, photo`).

> **Prompt fidelity note**: expect 3–5 iterations; the dual-polarity instruction is the fragile part — if the model collapses to one register, generate the two polarities separately and compose the sheet in post.
