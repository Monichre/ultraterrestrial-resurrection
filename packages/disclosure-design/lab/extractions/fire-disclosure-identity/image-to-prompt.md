---
title: Image-to-prompt — fire-disclosure-identity
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `fire-disclosure-identity`

**Kind: asset** — flame, smoke, and wet-ground reflection are raster territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a lone figure in a bulky fire-proximity suit and hood, seen from behind at three-quarter angle, right arm raised pointing into a towering wall of flame that fills the entire background; rolling smoke above, wet reflective ground below
STYLE / MEDIUM: cinematic concept-art key still, disaster-sublime, silver-gelatin tonal range
COMPOSITION & CAMERA: square 1:1, figure low-center-right in the lower third, fire wall total, single diagonal pointing vector into the blaze
LIGHTING: the fire wall is the only source — but rendered in pale bone-cream, not orange; smoke diffuses everything above
PALETTE: true black `#000101`, bone-cream flame `#e9e3c3`, charcoal smoke `#1f2123`, ash mid `#5a5f5e`, greige ground reflection `#b2afa0` — fire desaturated to grayscale-with-warmth
MOOD: solemn, confrontational, apocalyptic, testimonial
BACKGROUND / INTEGRATION: `scene` — smoke and fire baked in
AVOID: no orange or red flames, no visible face, no text, no other people, no blue emergency lights, no action-movie debris

## Natural-language version

A cinematic square key-art still: a lone figure in a bulky fire-proximity suit, hood up, seen from behind at a three-quarter angle, right arm raised and pointing into a towering wall of flame that fills the entire frame behind them. Rolling smoke above, wet ground below mirroring the firelight dimly. The fire is desaturated — pale bone-cream (#e9e3c3) and ash gray (#5a5f5e) instead of orange — against true black (#000101) and charcoal smoke (#1f2123), with a greige reflection (#b2afa0) underfoot. The mood is solemn testimony: one small human gesturing at an overwhelming force, saying look, this happened.

## Model adaptation notes

- **Midjourney**: `figure in fire suit pointing at towering wall of flame, desaturated monochrome fire, smoke, wet ground reflection, cinematic key art` — `--ar 1:1 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "flames are pale cream and gray, NOT orange".
- **SD/Flux**: structured tags; AVOID → negative prompt (`orange flames, red, face, text, debris`).

> **Prompt fidelity note**: expect 3–5 iterations; every model's prior for "fire" is orange — the desaturation instruction must be repeated and weighted. Consider generating normally and desaturating in post as the deterministic fallback.
