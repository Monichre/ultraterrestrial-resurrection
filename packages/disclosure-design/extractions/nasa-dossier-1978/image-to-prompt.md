---
title: Image-to-prompt — nasa-dossier-1978
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `nasa-dossier-1978`

**Kind: asset** — sun-aged paper, faded photo tint and offset-print softness are raster materiality; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a vintage NASA dossier page dated 1978 — aged cream stock with a letterhead header block, one faded dusty-rose tinted photograph (spacecraft/astronaut subject) as the visual anchor, typewriter text columns, rubber stamps and a signature at the margins
STYLE / MEDIUM: post-Apollo government print ephemera; offset-print letterhead and typewriter mono; forty years of sun-fading unified across ink and photo
COMPOSITION & CAMERA: landscape page scanned flat; header top, photo anchor, bureaucratic text columns, stamp furniture at margins, slightly rotated stamps
LIGHTING: flat scan light; soft offset-print edges, no gloss
PALETTE: cream `#dacba8` stock, tan `#c3b698`, dusty rose `#b2968c` (faded photo + old red ink — the SAME rose for both), deep mauve-brown `#836d6f` text, olive-grey `#8c8b7c` shadows
MOOD: archival, earnest, gently heroic — faded optimism, the space age remembered through sunlight
BACKGROUND / INTEGRATION: `scene` — the page fills the frame
AVOID: no saturated NASA red or blue, no crisp digital type, no modern layout grids, no legible paragraphs of real text, no plastic-laminate gloss, no pristine white paper

## Natural-language version

A vintage NASA dossier page from 1978, scanned flat: aged cream stock (`#dacba8`) with a letterhead header, one faded photograph of a spacecraft/astronaut subject tinted dusty rose (`#b2968c`) — the same rose as the old red rubber-stamp ink, because both faded together in the sun — typewriter text columns in deep mauve-brown (`#836d6f`), tan shadows (`#c3b698`) and olive-grey (`#8c8b7c`) in the worn areas. Post-Apollo press-kit sincerity, bureaucratic and earnest. No saturated color, no crisp type, no legible real paragraphs, no pristine paper.

## Model adaptation notes

- **Midjourney**: `vintage 1978 NASA dossier page, faded photograph, typewriter text, rubber stamps, sun-aged cream paper, dusty rose ink` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "all body text unreadable" and "faded, not saturated".
- **SD/Flux**: structured tags; AVOID → negative prompt (`saturated red, blue, crisp digital type, modern layout, legible text, gloss, white paper`).

> **Prompt fidelity note**: expect 3–5 iterations; the unified-fade instruction (photo and ink the same rose) is the subtle part — check that stamps and photo tint match before accepting a generation.
