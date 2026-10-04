---
title: Image-to-prompt — crumpled-dotgrid-journal
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `crumpled-dotgrid-journal`

**Kind: asset** — crumpled paper, crease shadows, and hand-ink texture are photographic; CSS has nothing to contribute. (The emblem alone would be SVG-reproducible.) Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: an open A5 dot-grid notebook photographed against a pure black background — the left page carrying a dense hand-drawn black-ink emblem: a geometric mandala/circuit medallion of radiating bars, nested rings, hatch fields, and stippled dots, centered on the page; the right page blank dot grid; both pages heavily crumpled with deep crease shadows
STYLE / MEDIUM: staged object photography, recovered-document register, raking light
COMPOSITION & CAMERA: landscape frame, notebook centered at a slight angle, spine gutter vertical at mid-frame, emblem as the single focal event
LIGHTING: single raking key that makes every crease cast a shadow; black stage swallowing the edges
PALETTE: ink-black `#1a1b1b`, warm bone paper `#b8aa97`, pale page-cream `#d9cbb8`, crease-shadow taupe `#71695c`
MOOD: obsessive, tactile, ritualistic, intimate, worn
BACKGROUND / INTEGRATION: `scene` — black stage baked in
AVOID: no handwriting, no text, no color ink, no flat unwrinkled paper, no hands, no desk props, no daylight

## Natural-language version

An open A5 dot-grid notebook photographed against a pure black background. The left page carries a dense hand-drawn black-ink emblem — a geometric mandala/circuit medallion of radiating bars, nested rings, hatch fields, and stippled dot texture, centered on the page. The right page is blank dot grid. Both pages are heavily crumpled, deep crease shadows raking across the warm bone paper (#b8aa97, #d9cbb8) in taupe (#71695c), the ink near-black (#1a1b1b). Single raking light, black stage. The mood is intimate obsession: a private symbol worked and reworked, carried everywhere.

## Model adaptation notes

- **Midjourney**: `open dot grid notebook on black background, hand drawn geometric mandala emblem in black ink, crumpled pages, raking light, object photography` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "heavily crumpled pages, crease shadows".
- **SD/Flux**: structured tags; AVOID → negative prompt (`handwriting, text, color ink, flat paper, hands, props`).

> **Prompt fidelity note**: expect 3–5 iterations; models default to clean flat notebooks — "heavily crumpled, deep crease shadows" must be weighted. The emblem is the deterministic fallback: generate the sigil as SVG and composite onto a photographed page.
