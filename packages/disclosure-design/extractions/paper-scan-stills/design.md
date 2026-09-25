---
title: Design — paper-scan-stills
description: GOLD tier — vision-written 2026-08-13 (self). Lo-fi night desk-scape photograph.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Paper Scan Stills — Night Desk
source: extractions/paper-scan-stills/paper-scan-stills.webp
captured_at: 2026-08-13
colors:
  glow: "#f6f6f6"
  grey-mid: "#cecac0"
  warm-dark: "#383532"
  brown-low: "#857f75"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Paper Scan Stills (Night Desk)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: photographic atmosphere; token/vision polarity divergence flagged.

## Source

- **Source type**: local image · **Path**: `extractions/paper-scan-stills/paper-scan-stills.webp` (1600×2400, read via /tmp JPEG)
- **Capture method**: direct vision
- **Detected limitations**: **token/vision polarity divergence** — the sampler read this frame as *light* (luma 178.4, dominant `#f6f6f6`), the vision pass reads a *dark* night-desk frame. The cluster ("Paper/scan stills — mixed") implies a multi-still asset; treat the pixel tokens as ⚠️ low confidence for this specific frame. Grain and darkness also limit fine detail.

## TL;DR

A grainy lo-fi photograph of a night-time desk-scape — scattered black documents, a glowing CRT/iMac screen as the single bright event, sticky notes, a device on a book. The photographic "behind the desk" register; atmosphere over composition.

## 1. Visual identity

**Personality**: nocturnal, grainy, insomniac, documentary.
**Mood**: late-night focus — a screen glowing in a dark room.
**Detectable stylistic references**: lo-fi night photography, analog-digital workspace aesthetic, surveillance/study-room stills.
**Information density**: high clutter, low legibility — texture over information.
**Implicit positioning**: the lived-in counterpoint to the clean journals and abstract plates — where the work actually happens.
**Confidence**: ⚠️ medium — subject unambiguous, but the polarity divergence and grain limit fine claims.

### 1.2 Brand voice

The work is messy and happens at night. The brand can show the un-staged desk — grain, clutter, a single screen — as honestly as it shows the finished plate.

### 1.3 The ONE brand thing

- **The thing**: a single bright screen burning in a dark, grainy room.
- **Why it carries the brand**: it is the *process* made visible — the disclosure aesthetic's source conditions (late, alone, lit by a screen).
- **How everything else supports it**: the darkness and grain strip everything except the glow.
- **Where it appears**: process/behind-the-scenes moments, lo-fi interstitials, "night shift" storytelling, atmospheric backgrounds. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `glow` | `#f6f6f6` | screen glow | ⚠️ low (polarity divergence) |
| `grey-mid` | `#cecac0` | lit paper/keys | ⚠️ low |
| `warm-dark` | `#383532` | shadow mass | ⚠️ low |
| `brown-low` | `#857f75` | warm mid | ⚠️ low |

Typography: none observed.

## 3. Components inventory

Signature: **night-desk photograph** (single glowing screen in darkness). Generic: none — photographic asset, not UI.

## 4. Layout & composition

Portrait; loose unstaged clutter, the bright screen as focal point upper-center, darkness pooling at the edges; no grid. Composition is documentary — found, not arranged.

## 5. Reconstruction notes

As UI: asset-class — an atmospheric background. Use under a heavy dark wash; the single-glow motif maps to a "focused panel in a dark UI" pattern. Tricky bits: the polarity divergence means the token sheet may not match — re-sample from this exact frame before building tokens into anything load-bearing.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ⚠️ | subject clear, polarity divergent |
| Colors | ⚠️ | token/vision mismatch on this frame |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — use as a dark atmospheric background; preserve the grain; keep the screen the only bright event; re-sample before trusting tokens.

**Don't** — don't brighten or de-noise; don't build tokens off this frame without re-sampling; don't stage it.

## 7. Open questions

- The token/vision polarity divergence needs resolution: is this WebP a multi-still contact sheet? If so, split into per-still assets and re-tokenize.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: photographic asset, not a UI screen.
