---
title: Image-to-prompt — uss-roosevelt-sphere
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `uss-roosevelt-sphere`

**Kind: asset** — film grain, maritime haze, and photographic realism are raster territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a colossal smooth matte dark sphere hovering low over a gray ocean directly behind a US Navy aircraft carrier — flat-topped deck, island superstructure, escort ships as specks on the horizon
STYLE / MEDIUM: simulated telephoto surveillance photograph, heavy analog film grain, leaked-image aesthetic
COMPOSITION & CAMERA: landscape frame, horizon dead-center, sphere sitting on the horizon line just right of the carrier island, its mass rivaling the ship; sea in the lower half, flat overcast sky above
LIGHTING: flat overcast noon — no shadows, no highlights, no sun position
PALETTE: near-achromatic maritime grays — sea `#4c4941`, horizon band `#a09d8d`, sphere and deck `#262424`, haze mids `#6c685b`
MOOD: deadpan, evidentiary, ominous, bureaucratically calm
BACKGROUND / INTEGRATION: `scene` — overcast sky baked in
AVOID: no glow, no specular highlight on the sphere, no dramatic clouds, no color, no text or timestamp overlays, no lens flare, no visible crew reaction

## Natural-language version

A grainy telephoto reconnaissance photograph: a colossal, perfectly smooth matte-black sphere hovering low on the horizon directly behind a US Navy aircraft carrier, its mass rivaling the ship. Flat gray ocean (#4c4941), pale overcast sky (#a09d8d), escort vessels as specks at the horizon line. The light is dead flat — noon under cloud sheet, no shadows. Heavy analog film grain and atmospheric haze make it read as captured, not composed. The mood is bureaucratic dread: an impossible object, calmly framed, nobody reacting.

## Model adaptation notes

- **Midjourney**: `grainy telephoto photo, huge matte black sphere hovering over aircraft carrier, gray overcast ocean, surveillance aesthetic, film grain` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "flat overcast, no glow on sphere".
- **SD/Flux**: structured tags; AVOID → negative prompt (`glow, specular, dramatic clouds, color, text, lens flare`); add `film grain, haze` positive weight.

> **Prompt fidelity note**: expect 2–4 iterations; models insist on glowing orbs and dramatic skies — "matte, lightless, flat overcast" is the whole discipline.
