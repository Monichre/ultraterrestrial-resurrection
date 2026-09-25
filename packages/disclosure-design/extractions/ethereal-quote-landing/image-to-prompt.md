---
title: Image-to-prompt — ethereal-quote-landing
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: hybrid
---

# Image-to-prompt — `ethereal-quote-landing`

**Kind: hybrid** — the page structure is buildable in code (see `component.tsx`); the misty mountain is a raster art asset. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a minimal ethereal landing page — a soft luminous mountain peak dissolving into mist in the lower two-thirds, a centered serif headline "The frontiers of knowledge are stunning, yet haunting", a thin top nav (DISCLOSURE logotype + mono links FILE / PROFILE / SIGN UP), two quiet CTAs ("Begin Survey" filled, "View Evidence" outlined) centered below the headline
STYLE / MEDIUM: quiet-luxury editorial web design, minimal landing hero
COMPOSITION & CAMERA: square, strong vertical center stack — nav top, headline upper-center, CTAs below, mountain mass lower two-thirds dissolving into fog, enormous negative space
LIGHTING: soft, diffuse, misty — the peak luminous, no hard shadow
PALETTE: chroma-scarce cool mist — pale fog `#deded6` / `#d3d2cc` ground, soft dark `#2d2e31` headline/nav, mid grey `#9e9d99` secondary/ridge
MOOD: ethereal, hushed, reverent — awed calm
BACKGROUND / INTEGRATION: `screen` — full-bleed page
AVOID: no pure white, no card grids, no loud buttons, no second image, no color accent, no dense copy

## Natural-language version

A minimal ethereal landing page: a soft luminous mountain peak dissolving into mist fills the lower two-thirds, a centered serif headline reads "The frontiers of knowledge are stunning, yet haunting", a thin top nav carries a DISCLOSURE logotype and mono links (FILE, PROFILE, SIGN UP), and two quiet CTAs — "Begin Survey" filled, "View Evidence" outlined — sit centered below the headline. Cool mist palette: pale fog (#deded6), soft dark (#2d2e31), mid grey (#9e9d99). Enormous negative space; the mood is awed calm, the sublime made gentle.

## Model adaptation notes

- **Midjourney**: `minimal ethereal landing page, misty mountain peak, centered serif headline, quiet luxury web design, negative space, fog` — `--ar 1:1 --style raw`.
- **gpt-image / DALL-E**: NL version; for real type, build the page in code (`component.tsx`) and generate only the mountain asset.
- **SD/Flux**: structured tags; AVOID → negative prompt (`white, cards, loud, color, dense, buttons`).

> **Prompt fidelity note**: for production, generate *only* the mountain-with-mist asset and compose the page in code — models render landing-page text unreliably. The asset prompt: "luminous mountain peak dissolving into white mist, minimal, soft light, bottom-anchored".
