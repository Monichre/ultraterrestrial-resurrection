---
title: Design — spy-lab-variant-6ymm
description: GOLD tier — vision-written 2026-08-13 (self). Night-shift surveillance scene.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Spy Lab Variant 6YMM
source: extractions/spy-lab-variant-6ymm/spy-lab-variant-6ymm.png
captured_at: 2026-08-13
colors:
  charcoal: "#3a3732"
  lamp-cream: "#e2d6b6"
  silhouette: "#000000"
  near-black: "#141414"
  khaki: "#978a75"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Spy Lab Variant 6YMM

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/spy-lab-variant-6ymm/spy-lab-variant-6ymm.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: monitor contents are glow-grade (only the central wireframe reads); the red panel's text is eyeballed ("ACCESS RESTRICTED / CLEARANCE 5") at the edge of legibility ⚠️.

## TL;DR

The spy-lab set after dark: one silhouetted operator, a wall of monitor glow, and a single red CLEARANCE 5 panel as the frame's only color. Conspiracy-thriller tension at a murmur.

## 1. Visual identity

**Personality**: nocturnal, clandestine, tense-quiet, lonely.
**Mood**: lonely vigilance — watching everything, cleared for secrets.
**Detectable stylistic references**: The Conversation / Condor-era conspiracy production design, bunker cinema.
**Information density**: dense set dressing organized by lamplight into readable layers.
**Implicit positioning**: the narrative pole of the spy-lab cluster; the room as a scene, not a survey.
**Confidence**: ✅ high.

### 1.2 Brand voice

Secrecy as atmosphere. The design believes the audience feels most inside a story when information is *withheld by lighting* — silhouettes instead of faces, glow instead of content, and one red stamp implying a whole hierarchy of hidden things.

### 1.3 The ONE brand thing

- **The thing**: the single red "ACCESS RESTRICTED / CLEARANCE 5" panel — the only hue in a grayscale-lamplight frame.
- **Why it carries the brand**: it converts set dressing into narrative — instantly implying classification systems, stakes, and the operator's rank.
- **How everything else supports it**: the entire palette stays in the charcoal/cream family so the red detonates; the silhouette faces away so the panel does the talking.
- **Where it appears**: once per frame, small, at the edge — scoping discipline is absolute. ✅ high (observed discipline).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `charcoal` | `#3a3732` | room mass | ✅ pixel |
| `lamp-cream` | `#e2d6b6` | monitor/lamp glow | ✅ pixel |
| `silhouette` | `#000000` | operator, deepest dark | ✅ pixel |
| `near-black` | `#141414` | shadow mids | ✅ pixel |
| `khaki` | `#978a75` | warm mids | ✅ pixel |
| restricted red | sub-1% accent | warning panel | ⚠️ eyeballed, below sampler threshold |

Typography: stencil/mono on the red panel, uppercase ⚠️ (treatment only).

## 3. Components inventory

Signature: **operator-silhouette vs monitor-wall** + **single-red-classification-panel**. Generic: none in UI terms — cinematic scene.

## 4. Layout & composition

Portrait 3:4; operator dead-center back-to-camera; monitor wall as luminous vanishing point; vertical layering (photos / screens / desk / chair); red panel right-edge as chromatic terminus.

## 5. Reconstruction notes

As UI: asset-class scene plate. Quick wins: charcoal + lamp-cream two-tone gets 90% of the mood. Tricky bits: monitor glow must bloom *onto* the operator's silhouette edges; the red accent must stay small and desaturated-adjacent (a warning, not a brand color).

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | night-surveillance read unambiguous |
| Colors | ✅ / ⚠️ | darks pixel-grounded; red eyeballed |
| Typography | ⚠️ | panel text at legibility edge |

## 6. Do's and Don'ts

**Do** — keep the operator faceless; light only with practicals (lamps, screens); reserve red for classification/warning marks.

**Don't** — don't add a second accent hue; don't show screen content beyond wireframe abstraction; don't daylight the room.

## 7. Open questions

- Does the "6ymm" suffix key to a variant series (6a/6b…) in the cluster? Manifest check.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: cinematic scene, not a UI screen.
