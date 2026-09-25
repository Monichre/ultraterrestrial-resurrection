---
title: Image-to-prompt — bust-geometry-reverse
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `bust-geometry-reverse`

**Kind: asset** — photographic stone meeting a wireframe cage is composite raster work (the cage alone is SVG-able; the seam is not). Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a classical marble bust — shoulders, chest, drapery intact, museum-conventional — whose head is replaced by a wireframe polyhedral cage occupying exactly the cranial volume, lit to match the stone
STYLE / MEDIUM: sculpture photography × wireframe geometry composite; dark art plate; surrealist substitution executed in drafting language
COMPOSITION & CAMERA: portrait field, bust centered and frontal, classical pose; the geometric head sits precisely where the head should be — the shock is positional
LIGHTING: soft museum key from above; the wireframe catches the same light as the stone; no environment
PALETTE: warm dark greys — deep umber-grey `#272624` field, charcoal `#3f3f3b` shadows, mid stone `#5b5d5b`, pale bone `#9f9f94` for lit planes and wireframe lines; achromatic with a warm lean
MOOD: cerebral, uncanny, analytic — productive unease, the monument's interior logic exposed
BACKGROUND / INTEGRATION: `scene` — dark field baked in
AVOID: no color, no glow on the wireframe, no second surreal element, no floating geometry beside the bust, no text, no pedestal plaque, no camera angle other than frontal

## Natural-language version

A dark art plate: a classical marble bust — shoulders, chest and drapery rendered with full museum convention, centered and frontal — but the head is a wireframe polyhedral cage occupying exactly the cranial volume, its pale bone lines (`#9f9f94`) catching the same soft museum light as the stone. The field is warm dark grey (`#272624`, `#3f3f3b`, `#5b5d5b`), achromatic. The substitution must be positionally exact — the cage IS the head, not near it. Cerebral, uncanny, analytic. No color, no glow, no second surreal element, no text.

## Model adaptation notes

- **Midjourney**: `classical marble bust, head replaced by wireframe polyhedron, museum lighting, dark grey, surrealist` — `--ar 3:4 --style raw`.
- **gpt-image / DALL-E**: NL version as-is; repeat "the wireframe IS the head, in the exact position of the head" — models love floating the geometry beside the bust.
- **SD/Flux**: structured tags; AVOID → negative prompt (`color, glow, floating shapes, text, plaque, angle view`); img2img from a real bust photo with a masked head region gives the cleanest seam.

> **Prompt fidelity note**: expect 4–6 iterations; positional exactness of the substitution is the fragile element — budget retries for it.
