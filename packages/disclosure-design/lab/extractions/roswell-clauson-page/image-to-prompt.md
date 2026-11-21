---
title: Image-to-prompt — roswell-clauson-page
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `roswell-clauson-page`

**Kind: asset** — the design material is degradation itself, tonal and per-word; code can mimic it but the artifact is the reference. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a single faded newspaper page — column rules and grid intact, but the ink ghosted almost entirely back into the paper, only scattered word-islands and one dissolving halftone photograph surviving, a white-edged lost-clipping hole upper-left
STYLE / MEDIUM: aged newsprint scan / archival document, flat-lit, silvered and spectral
COMPOSITION & CAMERA: portrait broadsheet shot flat, strict multi-column skeleton running full height, content concentrated upper-left and center, lower two-thirds near-empty
LIGHTING: flat archival scan light, no shadows
PALETTE: achromatic — silvered paper `#c5c5bd`, median `#c3c3bb`, ghost-ink `#3d4143`, halftone haze `#9da19f`; no color
MOOD: melancholy, hushed, haunted, patient — history failing to be read
BACKGROUND / INTEGRATION: `scene` — full-bleed page
AVOID: no coffee stains, no burnt edges, no restored contrast, no legible body text, no color, no folded-paper theatrics

## Natural-language version

A faded newspaper page from a Roswell-era local paper: the tall column grid still stands, but the ink has ghosted almost entirely back into silvered paper (#c5c5bd), leaving only scattered word-islands in grey (#3d4143) and a single halftone photograph dissolving into haze (#9da19f) mid-page, with a white-edged hole upper-left where a clipping was lost. Flat archival light, achromatic, portrait broadsheet. The mood is structure outliving information — evidence degraded past legibility, quiet and haunted.

## Model adaptation notes

- **Midjourney**: `faded newspaper page, ghosted ink, column grid intact, text mostly illegible, archival scan, grey on grey` — `--ar 2:3 --style raw`.
- **gpt-image / DALL-E**: NL version; models resist making text illegible — say "text faded beyond reading, only a few words visible" explicitly.
- **SD/Flux**: structured tags; AVOID → negative prompt (`stains, burnt, high contrast, legible, color, folds`).

> **Prompt fidelity note**: expect 3–5 iterations; the failure mode is theatrical aging (stains, tears) — the real reference is *tonal* fade, ink retreating into paper, structure intact.
