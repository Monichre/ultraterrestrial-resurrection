---
title: Design — photo-mood-collages
description: GOLD tier — vision-written 2026-08-13 (self). Sunlit analog contact-sheet collage.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Photo Mood Collages
source: extractions/photo-mood-collages/photo-mood-collages.jpg
captured_at: 2026-08-13
colors:
  cream: "#e9d7b1"
  cobalt: "#355aa7"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Photo Mood Collages

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/photo-mood-collages/photo-mood-collages.jpg` (1536×2304; token sheet references `.jpeg` — same file, extension drift noted)
- **Capture method**: direct vision
- **Detected limitations**: individual frames are thumbnail-scale; read as tonal/chromatic events, not detailed scenes.

## TL;DR

A contact-sheet collage of sun-bleached Mediterranean fragments — all cream and beige except one cobalt door. The vault's warmest, lightest plate: domestic analog nostalgia with a single cold interruption.

## 1. Visual identity

**Personality**: nostalgic, domestic, tactile, quietly curated.
**Mood**: summer, archived.
**Detectable stylistic references**: 35mm point-and-shoot film, Mediterranean vernacular photography, inspiration-board culture.
**Information density**: many frames, one mood.
**Implicit positioning**: the vault's daylight-domestic pole; proof the reference set isn't all darkness and dread.
**Confidence**: ✅ high.

### 1.2 Brand voice

Curation as affection. The design believes the audience trusts a sensibility that finds the unremarkable beautiful — that a wall of small sunlit photos says "someone looked carefully at the world" more eloquently than any hero image.

### 1.3 The ONE brand thing

- **The thing**: the cobalt interruption — one saturated blue frame in a cream field.
- **Why it carries the brand**: it demonstrates the entire curatorial argument in one move — discipline everywhere, detonation once.
- **How everything else supports it**: every other frame stays in the cream/beige family so the blue lands like a chord change.
- **Where it appears**: moodboards, palette references, "taste" pages. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `cream` | `#e9d7b1` | dominant field | ✅ pixel |
| `cobalt` | `#355aa7` | single accent | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **contact-sheet grid with one cold frame**. Generic: none — photographic collage, not UI.

## 4. Layout & composition

Portrait 2:3; uniform small frames, thin gutters; meandering contact-sheet order; cobalt off-center.

## 5. Reconstruction notes

As UI: the *format* is honestly code-reproducible (uniform grid, thin gutters) — but the content is photographic, so the plate stays asset-class. Quick wins: the cream/cobalt pair is a ready-made two-color system. Tricky bits: the frames must share one film grade — mixed color temperatures destroy the contact-sheet illusion.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | moodboard read unambiguous |
| Colors | ✅ | pixel-grounded pair |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — hold every frame to one warm grade; allow exactly one cobalt-frame event per sheet; keep gutters thin and equal.

**Don't** — don't add a second accent color; don't mix digital-clean and film-grain frames; don't caption the frames.

## 7. Open questions

- Do the source frames exist individually in the vault? They'd folderize as a photo cluster if so.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: photographic collage, not a UI screen.
