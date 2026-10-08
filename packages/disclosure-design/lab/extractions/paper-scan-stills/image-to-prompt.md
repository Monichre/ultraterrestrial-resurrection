---
title: Image-to-prompt — paper-scan-stills
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `paper-scan-stills`

**Kind: asset** — a lo-fi photograph; value is grain and a single light source. Provenance: **self** (note: token/vision polarity divergence — see `design.md`).

## Canonical prompt (structured)

SUBJECT: a grainy lo-fi photograph of a cluttered desk-scape at night — scattered black paper and documents, a glowing CRT/iMac screen as the single bright event, a smaller monitor, sticky notes, a small device resting on a book
STYLE / MEDIUM: candid night photograph, high-ISO grain, analog-digital workspace
COMPOSITION & CAMERA: portrait, loose unstaged arrangement, the bright screen as focal point upper-center, darkness pooling at the edges
LIGHTING: a single glowing screen in a dark room — everything else falls to warm darkness
PALETTE: warm near-black shadow mass with a single near-white screen glow; warm mid-browns in the lit paper (token set unreliable for this frame — see design.md)
MOOD: nocturnal, insomniac, intimate — late-night focus
BACKGROUND / INTEGRATION: `scene` — full-bleed photograph
AVOID: no daylight, no de-noise, no staging, no bright even light, no tidy desk, no color pop

## Natural-language version

A grainy lo-fi photograph of a cluttered desk at night: scattered black documents, a glowing CRT/iMac screen as the single bright event, a smaller monitor, sticky notes, a small device on a book — everything sunk in warm darkness except where the screen burns. High-ISO grain, candid and unstaged. The mood is late-night focus: a screen glowing in a dark room, work continuing past dark.

## Model adaptation notes

- **Midjourney**: `grainy lo-fi photo of a cluttered desk at night, single glowing computer screen in the dark, scattered papers, high ISO, candid, moody` — `--ar 2:3 --style raw`.
- **gpt-image / DALL-E**: NL version; stress "grainy, dark, single light source" — models default to clean bright desks.
- **SD/Flux**: structured tags; add film-grain; AVOID → negative prompt (`bright, clean, daylight, staged, sharp, color pop`).

> **Prompt fidelity note**: expect 2–4 iterations; the failure mode is a clean bright desk. Repeat "dark room, only the screen lights it, heavy grain".
