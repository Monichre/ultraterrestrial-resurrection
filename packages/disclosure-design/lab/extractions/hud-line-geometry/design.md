---
title: Design — hud-line-geometry
description: GOLD tier — vision-written 2026-08-13 (self). Portrait specimen plate, navy on bone.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: HUD Line Geometry — Specimen Plate
source: extractions/hud-line-geometry/hud-line-geometry.png
captured_at: 2026-08-13
colors:
  paper: "#e0dad2"
  ink-navy: "#090b11"
  pale-gray: "#cac4bd"
  silver: "#aeaaa5"
  slate: "#303138"
typography:
  label-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 9px
    letterSpacing: 0.2em
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — HUD Line Geometry (Specimen Plate)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/hud-line-geometry/hud-line-geometry.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: micro labels unreadable at this size — treatment (mono, tracked, hairline) observable, content not.

## TL;DR

A face drawn as a magnetic field, pinned between ruler scales and crossed by a scan bar — the vault's HUD language at its most portrait-forward. Navy ink on bone paper.

## 1. Visual identity

**Personality**: clinical, elegant, exacting, serene.
**Mood**: beautiful objectification — total documentation, calmly presented.
**Detectable stylistic references**: topographic wireframe art, drafting instruments, museum specimen plates.
**Information density**: moderate — one dominant figure, annotation kept to the margins.
**Implicit positioning**: the portrait-specimen pole of the HUD cluster; identity as a measured object.
**Confidence**: ✅ high.

### 1.2 Brand voice

Precision as respect. The design believes the audience reads measurement as devotion — that drawing a face in field-lines and ruler ticks says "this subject was worth surveying," and that keeping the ink navy and the paper warm keeps the scrutiny humane.

### 1.3 The ONE brand thing

- **The thing**: the flowing field-line contour system — lines that behave like weather over the skull, not mesh.
- **Why it carries the brand**: it's the vault's line language at its most organic; the same apparatus with straight wireframe would be ordinary FUI.
- **How everything else supports it**: rulers, crosshairs, and the scan bar stay rectilinear — the contrast makes the face's curves the only organic event.
- **Where it appears**: scan/identity plates, covers, specimen series. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `paper` | `#e0dad2` | field | ✅ pixel |
| `ink-navy` | `#090b11` | primary line | ✅ pixel |
| `pale-gray` | `#cac4bd` | secondary rules | ✅ pixel |
| `silver` | `#aeaaa5` | faded annotation | ✅ pixel |
| `slate` | `#303138` | scan-bar density | ✅ pixel |

Typography: mono micro-labels ~9px, +0.2em tracking, uppercase ⚠️ (treatment certain, family inferred).

## 3. Components inventory

Signature: **field-line face medallion** + **ruler-scale margins** + **horizontal scan bar**. Generic: crosshair registration marks, mono labels.

## 4. Layout & composition

Portrait 3:4; face centered and dominant; ruler ticks pinned to left/right margins; scan bar bisecting at eye level; annotation kept to edges.

## 5. Reconstruction notes

Suggested stack: vanilla CSS + inline SVG — the whole chrome layer (rulers, crosshairs, scan bar) is code; the face linework is an SVG trace asset. Quick wins: two-ink palette (navy + gray on bone). Tricky bits: the contour flow must *follow the cranium* — generic topographic rings read as a fingerprint, not a face. Implicit states: scan-bar sweep animation unobserved ❓.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | specimen-plate read unambiguous |
| Colors | ✅ | pixel-grounded |
| Typography | ⚠️ | treatment clear, family inferred |

## 6. Do's and Don'ts

**Do** — keep rulers and crosshairs rectilinear against the organic linework; use navy `#090b11` not pure black; hold the scan bar to exactly one per plate.

**Don't** — don't fill the face; don't add a second scan bar or glow; don't let annotation invade the medallion.

## 7. Open questions

- Is the face the same subject as hud-reverse-batch's (a series)? Cross-reference the contour plates.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md` · [x] `component.tsx`
