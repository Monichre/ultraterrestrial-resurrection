---
title: Image-to-prompt — case-file-dossier-covers
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `case-file-dossier-covers`

**Kind: asset** — physical paper texture, photo tinting and layer shadows are raster work; CSS has nothing to contribute. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a "found folder" dossier collage — a tinted photograph of a dark-suited figure holding a folder emblazoned CASE FILE, physically layered over a typewritten memorandum page, on aged beige stock
STYLE / MEDIUM: prop-document collage; Cold-War file-room ephemera; mid-century government print (manila, typewriter ribbon, rubber stamp); visible paper grain and wear
COMPOSITION & CAMERA: portrait field shot flat, photograph occupying the upper half as evidence, typed memo filling the lower half as record, shallow stack with soft shadows between layers
LIGHTING: flat overhead scan-light; soft contact shadows at layer edges only
PALETTE: beige stock `#d7ceba`, warm taupe `#c6b9a3`, dusty olive-tan `#938776`, deep brown-grey `#74695a`, near-black ink `#0b0b0a` for the suit, folder lettering and type
MOOD: bureaucratic, secretive, archival — institutional secrecy made mundane
BACKGROUND / INTEGRATION: `scene` — aged stock baked in edge to edge
AVOID: no saturated colors, no modern typefaces, no digital UI elements, no glossy photo finish, no legible paragraphs of real text, no plastic or modern office materials

## Natural-language version

A Cold-War dossier collage photographed flat: in the upper half, a tinted photograph of a dark-suited figure holding a folder boldly lettered CASE FILE; beneath it, a typewritten memorandum page in typewriter mono. Everything sits on aged beige stock (`#d7ceba`, `#c6b9a3`) with dusty olive-tan photo tones (`#938776`), brown-grey wear (`#74695a`), and near-black ink (`#0b0b0a`); paper grain and soft shadows between the layers sell the physical stack. The mood is bureaucratic secrecy — the quiet thrill of reading a file you were not supposed to find. No saturation, no modern materials, no legible real text.

## Model adaptation notes

- **Midjourney**: `vintage case file dossier collage, suited man holding folder, typewritten memo, aged manila paper, flat lay` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "all text unreadable/gibberish except the words CASE FILE" — models will otherwise invent legible paragraphs.
- **SD/Flux**: structured tags; AVOID → negative prompt (`saturated, modern, glossy, legible text, digital`).

> **Prompt fidelity note**: expect 3–5 iterations; text generation is the failure mode — keep "CASE FILE" as the only claimed words and fuzz everything else.
