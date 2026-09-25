---
title: Image-to-prompt — hand-annotated-journal
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: asset
---

# Image-to-prompt — `hand-annotated-journal`

**Kind: asset** — the value is the hand and the associative layout; code can mimic the mechanic but not the artifact. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a landscape dot-grid engineering journal page densely worked over — hand-drawn technical diagrams (a wireframe head/bust, geometric constructions, arrow-flow charts, hatched pyramids) interleaved with running handwritten annotation, underlines, circled phrases, marginal arrows wiring drawing to note
STYLE / MEDIUM: scanned physical journal, pen and pencil on warm dot-grid paper, da Vinci notebook register
COMPOSITION & CAMERA: landscape sheet shot flat, organic non-grid flow, dense central cluster with annotation radiating outward, breathing room at edges
LIGHTING: flat even scan light
PALETTE: warm aged paper `#dad0bf`, kraft mid-tones `#c6bcab`/`#afa596`, near-black ink `#151515` primary, grey-brown pencil `#706a60` secondary; chroma-scarce
MOOD: intimate, obsessive, cerebral — thinking on paper
BACKGROUND / INTEGRATION: `scene` — full-bleed page
AVOID: no typed text, no clean grid layout, no white paper, no single hero diagram, no color ink, no neat margins

## Natural-language version

A landscape dot-grid engineering journal page, densely worked: hand-drawn technical diagrams — a wireframe head, geometric constructions, arrow-flow charts, hatched pyramids — interleaved with running handwritten annotation in two registers (near-black pen #151515, grey-brown pencil #706a60), with underlines, circled phrases and marginal arrows wiring drawings to notes, all on warm aged paper (#dad0bf). The layout is organic, not gridded — a dense central cluster with annotation radiating outward. The mood is a mind thinking on paper: intimate, obsessive, cerebral.

## Model adaptation notes

- **Midjourney**: `hand-annotated engineering journal page, dot grid, technical diagrams with handwritten notes, arrows and circles, warm paper, da vinci notebook` — `--ar 4:3 --style raw`.
- **gpt-image / DALL-E**: NL version; insist on "handwritten, messy, organic layout" or models produce clean infographics.
- **SD/Flux**: structured tags; AVOID → negative prompt (`typed, clean, grid, white paper, color, neat, single diagram`).

> **Prompt fidelity note**: expect 3–5 iterations; failure mode is tidiness. The reference's identity is the *dialogue* between drawing and note — arrows, circles, second thoughts. Ask for "annotation connecting the diagrams" explicitly.
