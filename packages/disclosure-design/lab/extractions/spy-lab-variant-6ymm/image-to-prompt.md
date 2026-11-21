---
title: Image-to-prompt — spy-lab-variant-6ymm
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `spy-lab-variant-6ymm`

**Kind: asset** — lamplight, silhouette, and monitor bloom are raster territory. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a night-time surveillance room — a silhouetted operator seated at a desk, back to camera, facing a wall of glowing monitors whose central screen carries a pale wireframe diagram; wall clock, venetian blinds, filing cabinets, and hanging photographs completing the set; one small red panel stamped "ACCESS RESTRICTED / CLEARANCE 5" glowing at the right edge
STYLE / MEDIUM: cinematic photographic still, 1970s conspiracy-thriller production design
COMPOSITION & CAMERA: portrait 3:4, operator dead-center facing away, monitor wall as luminous vanishing point, vertical layering of photos / screens / desk / chair
LIGHTING: practicals only — desk lamp and monitor glow; everything else falls to silhouette
PALETTE: warm charcoal `#3a3732`, lamp-cream `#e2d6b6`, true black `#000000` silhouette, near-black `#141414`, khaki mids `#978a75`, with one small red accent panel
MOOD: nocturnal, clandestine, tense-quiet, lonely vigilance
BACKGROUND / INTEGRATION: `scene` — room darkness baked in
AVOID: no visible face, no daylight, no modern flatscreens, no second accent color, no readable screen content beyond the wireframe, no text anywhere except the red panel

## Natural-language version

A cinematic 1970s conspiracy-thriller still, portrait format: a silhouetted operator sits at a desk with his back to us, facing a wall of glowing monitors — the central screen showing a pale wireframe diagram. A wall clock, venetian blinds, filing cabinets, and strips of hanging photographs complete the room. The only color in the lamplight palette of charcoal (#3a3732), lamp-cream (#e2d6b6), black (#000000), and khaki (#978a75) is one small red panel at the right edge stamped "ACCESS RESTRICTED / CLEARANCE 5". The mood is lonely vigilance: one person watching everything, cleared for secrets, at 3 a.m.

## Model adaptation notes

- **Midjourney**: `1970s surveillance room at night, silhouetted operator facing wall of glowing monitors, wireframe diagram on central screen, red ACCESS RESTRICTED panel, tungsten lamp, conspiracy thriller film still` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; stress "only red accent in an otherwise warm grayscale frame".
- **SD/Flux**: structured tags; AVOID → negative prompt (`face, daylight, flatscreen, second accent color, readable text`).

> **Prompt fidelity note**: expect 3–5 iterations; models will try to show the operator's face or add blue screen-glow — "back to camera, practicals only" is the discipline.
