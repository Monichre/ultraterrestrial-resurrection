---
title: Image-to-prompt — bust-nebula-hud-le
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `bust-nebula-hud-le`

**Kind: asset** — the nebula-in-marble composite and photographic stone are raster work; the HUD ring alone would be code, but the plate's value is the fusion. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a classical bearded-philosopher marble bust (Plato/Socrates type), centered and frontal like a specimen, its marble mass filled with a nebula — the head and chest as a window into deep space — ringed by hairline HUD apparatus: a circular gauge at left, small data readout blocks, faint grid, mono micro-labels
STYLE / MEDIUM: museum-bust photography × astrophotography × interface overlay; dark composite art plate; post-vaporwave classical revival without irony
COMPOSITION & CAMERA: portrait field, bust dead-center frontal, gauge at left, data blocks flanking, strict symmetry — the framing of an examination
LIGHTING: soft museum key on the stone; the nebula self-lit from within the marble; no environment
PALETTE: warm-black field `#100e0c`, charcoal `#242423` / `#373938` modeling, stone-grey `#706e6a`, pale bone `#aca699` for lit planes and HUD text — nebula stays tonal, not chromatic
MOOD: monumental, forensic, reverent — awe under analysis
BACKGROUND / INTEGRATION: `scene` — warm-black field baked in
AVOID: no cyan/blue HUD cliché, no vaporwave pink, no chrome, no legible paragraphs of text, no perspective angle, no pedestal or museum room

## Natural-language version

A dark composite art plate: a classical bearded marble bust (Plato/Socrates type), centered and frontal like a specimen under examination, its marble filled with a faint nebula so the head and chest read as a window into deep space. Around it, hairline HUD apparatus in pale bone (`#aca699`) — a circular gauge at left, small data readouts, a faint grid, mono micro-labels — on a warm-black field (`#100e0c`) with charcoal modeling (`#242423`, `#373938`) and stone-grey (`#706e6a`) transitions. Monumental, forensic, reverent. No cyan HUD cliché, no vaporwave pink, no legible text.

## Model adaptation notes

- **Midjourney**: `classical marble bust filled with nebula, HUD interface overlay, circular gauge, dark warm black, bone white labels` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "HUD lines thin and pale grey, NOT blue" — the cyan reflex is strong.
- **SD/Flux**: structured tags; AVOID → negative prompt (`cyan, blue HUD, pink, chrome, legible text, pedestal, room`); consider generating bust and HUD separately and compositing for control.

> **Prompt fidelity note**: expect 3–5 iterations; the two failure modes are cyan HUD spill and the nebula escaping the marble silhouette — both are called out in AVOID.
