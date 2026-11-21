---
title: Image-to-prompt — dystopian-cosmic-dread
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `dystopian-cosmic-dread`

**Kind: asset** — crosshatch engraving is raster art; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a robed skeleton — Death as Grim Reaper — standing full-length on a rocky outcrop, holding an hourglass out in its left hand, right arm raised pointing at the sky; flanked by two dead gnarled trees; overhead a crescent moon, a ringed Saturn-like planet, and scattered stars above rolling clouds
STYLE / MEDIUM: 19th-century bookplate etching — fine crosshatch engraving, woodcut line discipline, print-plate finish
COMPOSITION & CAMERA: portrait field, figure centered and frontal, trees as symmetrical flanking columns, celestial bodies staged in the upper third, outcrop anchoring the bottom
LIGHTING: no literal light source — form built entirely from hatched line density; moon and planet are the only bright accents
PALETTE: ground `#111a16`, shadow mass `#292b1f` / `#2c3023`, hatch body `#625535`, highlights `#a09466` — one olive-khaki family on near-black, no other hue
MOOD: sepulchral, patient, macabre, cosmic-indifferent
BACKGROUND / INTEGRATION: `scene` — dark field baked in, plate edges clean
AVOID: no color beyond the olive family, no glow or bloom, no text or border ornament, no photorealism, no horror-movie lighting

## Natural-language version

A memento-mori bookplate etching in fine crosshatch: a robed skeleton Death stands full-length on a rocky outcrop, hourglass extended in its left hand, right arm raised toward a cosmic sky — crescent moon, ringed planet, scattered stars over rolling clouds — flanked symmetrically by two dead trees. The entire plate is one olive-khaki ink family (#625535 to #a09466 highlights) hatched onto a near-black green-tinged ground (#111a16). Heraldic frontal composition, 19th-century chapbook engraving finish. The mood is patient, sepulchral, cosmic-indifferent: time personified, unhurried.

## Model adaptation notes

- **Midjourney**: `memento mori etching, grim reaper with hourglass, dead trees, crescent moon ringed planet, crosshatch bookplate, olive ink on black` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; insist on "engraving, not illustration" and repeat the palette restriction.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, glow, bloom, photorealistic, text`).

> **Prompt fidelity note**: expect 2–4 iterations; models drift toward horror lighting and saturated oranges — the single-ink olive discipline is the lever that keeps it in-family.
