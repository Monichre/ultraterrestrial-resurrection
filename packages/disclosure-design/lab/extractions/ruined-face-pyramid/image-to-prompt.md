---
title: Image-to-prompt — ruined-face-pyramid
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `ruined-face-pyramid`

**Kind: asset** — cinematic matte painting; the transferable system is the grade, not geometry. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a colossal ruined stone face half-buried in rubble, features eroded, with a stepped pyramid rising behind-right and scattered masonry and drifting mist across the plain
STYLE / MEDIUM: cinematic concept-art matte painting, film-frame key art, painterly with photographic scale
COMPOSITION & CAMERA: extreme-wide 2.33:1, face as left anchor cropped by frame edge, pyramid as right anchor in atmospheric perspective, rubble diagonal between, heavy low mist band, bruised gradient sky
LIGHTING: diffuse sickly daylight, low sun behind mist, no hard shadows
PALETTE: bruised teal-black `#041817` shadow floor, mossy sick-green `#164731` mist, jaundiced ochre `#a19d69` lit stone, rust-browns `#624c2e` and `#312c1e` rubble — desaturated complementary-rotten
MOOD: desolate, monumental, humid, elegiac — awe turned queasy
BACKGROUND / INTEGRATION: `scene` — full-bleed environment
AVOID: no vivid teal/orange, no healthy blue sky, no human figures, no vehicles, no sharp modern edges, no text

## Natural-language version

A cinematic wide matte painting: a colossal ruined stone face half-buried in rubble dominates the left, a stepped pyramid rises through mist to the right, scattered masonry between. The whole scene is bathed in a sickly grade — mossy green mist (#164731) over a bruised teal-black shadow floor (#041817), with jaundiced ochre light (#a19d69) catching the eroded stone. No people, no sky detail — just monument, mist and time. The mood is the sublime with food-poisoning: awe turned queasy, empire after the fall.

## Model adaptation notes

- **Midjourney**: `colossal ruined stone face half-buried, stepped pyramid, sickly green mist, ochre light, cinematic matte painting` — `--ar 21:9 --style raw`.
- **gpt-image / DALL-E**: NL version; stress "desaturated, sickly, no people" — models default to healthy adventure palettes.
- **SD/Flux**: structured tags; AVOID → negative prompt (`vivid, saturated, people, blue sky, modern, text`).

> **Prompt fidelity note**: expect 3–5 iterations; the failure mode is *healthy* epic fantasy color. Keep hammering "sickly, desaturated, humid" and pin the two hexes in the prompt if the model accepts color anchors.
