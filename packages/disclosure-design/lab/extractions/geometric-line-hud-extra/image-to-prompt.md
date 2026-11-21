---
title: Image-to-prompt — geometric-line-hud-extra
description: GOLD tier — vision-written 2026-08-13 (self).
type: note
created: 2026-08-13
author: agent
tags: [folderize, image-to-prompt, gold, vision-self]
kind: hybrid
---

# Image-to-prompt — `geometric-line-hud-extra`

**Kind: hybrid** — the screen is buildable in CSS/SVG (see `component.tsx`), but the full frame's density and wireframe filigree are best generated as art. Provenance: **self**.

## Canonical prompt (structured)

SUBJECT: a wide monochrome heads-up display built entirely from geometric line art — a wireframe pyramid in a targeting reticle, a wireframe globe, concentric orbital rings with tick marks, circular gauges, blocks of tiny code text, horizontal progress bars, a bottom timeline ruler
STYLE / MEDIUM: speculative sci-fi interface / HUD screen, 1px line work, instrument-grade
COMPOSITION & CAMERA: extreme-wide 2:1 frame on a faint grid, focal instrument cluster left (reticle + pyramid), data column right (code, bars, gauges), full-width timeline ruler along the bottom
LIGHTING: self-lit screen, no scene lighting
PALETTE: chroma-scarce — warm near-black `#1e1d1b` field, panel greys `#2e2f2e`/`#434647`, instrument grey `#62686b`, cool silver `#bdbeba` primary line; no color accent
MOOD: precise, clinical, forensic — calm competence
BACKGROUND / INTEGRATION: `screen` — full-bleed UI frame
AVOID: no neon accent, no color, no rounded corners, no thick strokes, no photographic imagery, no legible paragraphs

## Natural-language version

A wide monochrome HUD screen built entirely from 1px geometric line art: a wireframe pyramid held in a targeting reticle at center-left, a wireframe globe and concentric orbital rings with tick marks, small circular gauges, blocks of tiny decorative code text, horizontal progress bars, and a full-width timeline ruler along the bottom edge. Chroma-scarce palette — warm near-black field (#1e1d1b), layered panel greys (#2e2f2e, #434647), instrument grey (#62686b), cool silver primary line (#bdbeba) — hierarchy by value alone, no color. The mood is precise and clinical: a system that has already measured everything.

## Model adaptation notes

- **Midjourney**: `monochrome sci-fi HUD interface, geometric line art, wireframe pyramid in reticle, gauges and code blocks, thin lines, dark UI` — `--ar 2:1 --style raw`.
- **gpt-image / DALL-E**: NL version; say "thin 1px lines, no color, dark background" explicitly — models default to neon-blue HUDs.
- **SD/Flux**: structured tags; AVOID → negative prompt (`neon, blue, color, rounded, thick lines, photo, text paragraphs`).

> **Prompt fidelity note**: expect 3–5 iterations; the failure mode is *neon*. The reference is silver-on-black and chroma-scarce — repeat "no color, grey only, thin lines". For production, prefer building from `component.tsx` over generating.
