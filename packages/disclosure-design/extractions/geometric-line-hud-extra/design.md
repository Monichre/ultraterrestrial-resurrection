---
title: Design — geometric-line-hud-extra
description: GOLD tier — vision-written 2026-08-13 (self). Monochrome line-art HUD screen.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Geometric Line HUD — Analysis Station
source: extractions/geometric-line-hud-extra/geometric-line-hud-extra.png
captured_at: 2026-08-13
colors:
  field: "#1e1d1b"
  panel: "#2e2f2e"
  panel-hi: "#434647"
  instrument: "#62686b"
  line: "#bdbeba"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Geometric Line HUD (Analysis Station)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: instrument / speculative UI.

## Source

- **Source type**: local image · **Path**: `extractions/geometric-line-hud-extra/geometric-line-hud-extra.png` (3072×1536)
- **Capture method**: direct vision
- **Detected limitations**: code-text is decorative micro-type (illegible); gauge values not readable. Structure and components observed, not data.

## TL;DR

A wide monochrome HUD built entirely from geometric line work: a wireframe pyramid in a targeting reticle, a globe, orbital rings, gauges, code blocks, progress bars and a bottom timeline. The most complete instrument panel in the line cluster — and the batch's clearest candidate for an actual UI component.

## 1. Visual identity

**Personality**: precise, clinical, forensic, systematic.
**Mood**: calm competence — a system that has already measured everything.
**Detectable stylistic references**: sci-fi analysis-station interfaces, CAD/EDA tooling, air-traffic and telemetry consoles, film HUD design.
**Information density**: high but *organized* — many instruments, each in its own cell.
**Implicit positioning**: the UI-facing expression of the line-and-geometry language; the screen a dossier station would run.
**Confidence**: ✅ high.

### 1.2 Brand voice

Measurement as reassurance. The brand's interface does not persuade — it *reports*: everything is already instrumented, gridded, and quietly ticking.

### 1.3 The ONE brand thing

- **The thing**: value-only hierarchy — a chroma-scarce screen where every distinction is carried by grey value and line weight, never color.
- **Why it carries the brand**: it proves the line language is a real *interface* system, not just decoration; restraint reads as authority.
- **How everything else supports it**: the faint grid, the micro-type, the reticle — all reinforce instrument-grade precision.
- **Where it appears**: telemetry/analysis screens, loading and processing states, data-dense dashboards, diegetic film UI. ⚠️→✅ this one genuinely is UI.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `field` | `#1e1d1b` | screen ground | ✅ pixel |
| `panel` | `#2e2f2e` | panel fill | ✅ pixel |
| `panel-hi` | `#434647` | raised panel / hover | ✅ pixel |
| `instrument` | `#62686b` | secondary marks | ✅ pixel |
| `line` | `#bdbeba` | primary line/text | ✅ pixel |

Typography: a technical mono for the code/labels and a fine geometric sans for headers — the micro-type blocks read as mono. Suggested: `--font-mono` for data, tracking-wide uppercase for section labels. ⚠️ medium (face not legible, class inferred).

## 3. Components inventory

Signature: **reticle-targeted wireframe**, **orbital-ring gauge**, **code-block panel**, **progress-bar row**, **timeline ruler**. Generic: panel, label, divider — all present. This folder earns a `component.tsx`.

## 4. Layout & composition

2:1 frame on a faint grid. Left half: primary instrument cluster (reticle + pyramid focal, globe below/beside). Right half: stacked data column (code blocks, bars, small gauges). Bottom edge: full-width timeline ruler. Composition balances a *focal* left against a *data* right — figure vs readout.

## 5. Reconstruction notes

As UI: buildable. The whole screen is CSS/SVG-friendly — wireframes as SVG strokes at `1px` `line`, panels at `panel`, grid as a faint repeating background. See `component.tsx` for a distilled `HudPanel`. Tricky bits: keep strokes at 1px and values restrained — thickening lines or adding a color accent collapses it into generic sci-fi.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | HUD read unambiguous |
| Colors | ✅ | pixel-grounded grey ladder |
| Typography | ⚠️ | mono class inferred, face illegible |

## 6. Do's and Don'ts

**Do** — keep everything 1px line; use value, not color, for hierarchy; let micro-type be decorative texture; keep the grid faint.

**Don't** — don't add a neon accent; don't round the corners; don't animate faster than a slow tick; don't thicken strokes.

## 7. Open questions

- Should the reticle + pyramid become the canonical "analysis in progress" loader across the system? It's the strongest single motif here.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md` · [x] `component.tsx`
