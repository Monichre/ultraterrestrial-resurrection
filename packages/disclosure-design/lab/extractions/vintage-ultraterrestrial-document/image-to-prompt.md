---
title: Image-to-prompt — vintage-ultraterrestrial-document
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: hybrid
---

# Image-to-prompt — `vintage-ultraterrestrial-document`

**Kind: hybrid** — the page skeleton (masthead, columns, rules, motto) is reconstructable in HTML/CSS per `design.md` §5; the two halftone celestial illustrations are the asset core, prompted below. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: two vintage halftone illustrations for a fringe-cosmology journal page — (1) planet Earth seen from space, continents and cloud swirls in engraved dot texture; (2) a ringed celestial-mechanics diagram: concentric orbital circles, radial geometry, a small planet at center
STYLE / MEDIUM: 19th-century halftone/engraving reproduction, letterpress illustration
COMPOSITION & CAMERA: each a small standalone figure, centered, generous paper margin, figure-band proportions
LIGHTING: none depicted — engraved line and dot texture carry all form
PALETTE: ink `#1b1c1e` on aged cream paper `#ded5bf`; foxing stains in `#b5aea0` at edges
MOOD: earnest, archival, occult-scientific, musty
BACKGROUND / INTEGRATION: `isolated` — each figure on flat `#ded5bf` (or transparent PNG) for placement in the document layout
AVOID: no photographic realism, no color, no modern vector smoothness, no labels or lettering inside the figures, no glow

## Natural-language version

Two small vintage halftone illustrations in ink (#1b1c1e) on aged cream paper (#ded5bf), with foxed edges (#b5aea0): first, planet Earth seen from space, continents and cloud swirls rendered in engraved dot texture; second, a celestial-mechanics diagram of concentric orbital rings and radial geometry around a small central planet. 19th-century letterpress style — engraved line and stipple carrying all form, no photography, no color, no lettering inside the figures. The mood is earnest occult-scientific: a wrong cosmology argued beautifully.

## Model adaptation notes

- **Midjourney**: `19th century halftone engraving, planet earth from space, celestial orbital diagram, stipple texture, ink on aged cream paper` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; generate each figure separately for layout control.
- **SD/Flux**: structured tags; AVOID → negative prompt (`photo, color, modern, smooth vector, text, glow`).

> **Prompt fidelity note**: expect 3–5 iterations; models drift to photographic planets — "engraved dot texture, letterpress" is the discipline. Period engraving scans (public domain) are the deterministic alternative.

## Consistency notes

Figures must sit on the document's `paper` ground `#ded5bf` inside the code skeleton — do not place them on white. The masthead's condensed caps and the motto's wide tracking are part of the same system; transplanting the figures without the typography loses the register.
