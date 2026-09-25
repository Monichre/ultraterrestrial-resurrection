---
title: Design — plate-047-brand-bible
description: GOLD tier — vision-written 2026-08-13 (self). Design-system specimen plate, not a product screen.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Ultraterrestrial Canvas Studies — Plate 047
source: extractions/plate-047-brand-bible/plate-047-brand-bible.png
captured_at: 2026-08-13
colors:
  surface: "#dfd8c4"
  surface-alt: "#dbd3bf"
  text-primary: "#3a352a"
  text-muted: "#7b7264"
  regolith: "#8b7d6b"
  clay: "#b04a2f"
  dust-storm: "#d97b4a"
  obsidian: "#1a1f2e"
  amber: "#f59e0b"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontWeight: 600
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: 10px
    letterSpacing: 0.18em
    textTransform: uppercase
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
spacing:
  base: 4px
rounded:
  sm: 4px
  md: 8px
---

# Design Analysis — Ultraterrestrial Canvas Studies, Plate 047

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood + design system (spec plate).

## Source

- **Source type**: local image
- **Path**: `extractions/plate-047-brand-bible/plate-047-brand-bible.png` (2000×2800)
- **Capture method**: direct vision
- **Detected limitations**: single static plate; text below ~10px mono is partly illegible at capture fidelity; ink hexes on paper are inferred darker than the pixel sampler's low-contrast swatches.

## TL;DR

Archival brand plate declaring the canvas design language: warm paper ground, Swiss editorial grid, two specimen cards (dot-matrix Mars cartography, orthographic obsidian globe) plus one glowing contour-sphere hero. The accent discipline (clay/amber/obsidian used only inside specimens) is the whole system — the paper stays silent so the artifacts glow.

## 1. Visual identity

**Personality**: archival, methodical, clinical-warm, precise, institutional.
**Mood**: quiet authority — a canon being declared, not sold.
**Detectable stylistic references**: NASA technical plates, Swiss-international spec sheets, classified-dossier stationery.
**Information density**: dense (spec rail) but hierarchically calm.
**Implicit positioning**: internal design-org canon for a research-canvas product.
**Confidence**: ✅ high (layout, palette roles) / ⚠️ medium (exact ink hexes, font names are plate-declared).

### 1.2 Brand voice

This design believes its audience are *investigators, not consumers*. Every choice serves that: paper instead of pixels-white, mono micro-labels instead of marketing copy, specimen cards treated like evidence mounts. Restraint is the credibility signal — the plate refuses saturated UI chrome anywhere except the objects under study.

The one saturated element — the clay/amber contour sphere — works precisely because everything around it is desaturated paper and hairline rules. The system spends its entire chroma budget on the artifact.

### 1.3 The ONE brand thing

- **The thing**: the glowing contour/elevation sphere on obsidian — artifact-as-hero.
- **Why it carries the brand**: remove it and the plate is generic stationery; with it, the system says "we study objects."
- **How everything else supports it**: paper ground, mono labels, hairline borders all stay below 20% visual volume.
- **Where it appears**: hero specimen only; never as decoration, never miniaturized. ✅ high.

## 2. Design system (tokens)

Colors and type as declared on the plate (colorway chips read visually, ⚠️ medium; paper tones pixel-grounded ✅):

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `surface` | `#dfd8c4` | paper field | ✅ pixel |
| `surface-alt` | `#dbd3bf` | median paper | ✅ pixel |
| `text-primary` | `#3a352a` | ink on paper (inferred) | ⚠️ inferred |
| `regolith` | `#8b7d6b` | Mars Atlas chip | ⚠️ visual |
| `clay` | `#b04a2f` | Mars Atlas chip / sphere | ⚠️ visual |
| `dust-storm` | `#d97b4a` | Mars Atlas chip | ⚠️ visual |
| `obsidian` | `#1a1f2e` | globe card ground | ⚠️ visual |
| `amber` | `#f59e0b` | viewport glow / highlight | ⚠️ visual |

**Typography** (plate-declared): Space Grotesk 600 display; IBM Plex Mono 10px uppercase +0.18em labels; Inter body. Iconography: 1.5px stroke, geometric.

**Motion** (plate-declared): 240ms standard entrance, 120ms micro-interactions.

## 3. Components inventory

Generic: specimen card (hairline border, paper bg, mono header strip), colorway chip row, annotation rail. Signature: **dot-matrix elevation cartography card** and **orthographic globe in obsidian glass with amber viewport glow** — both are evidence-mount patterns, not generic cards.

## 4. Layout & composition

12-col editorial grid, generous paper margins, header rule + footer annotation ribbon. Portrait plate 5:7. No responsive variants observable (print-style artifact).

## 5. Reconstruction notes

Quick wins: paper palette + mono label style + hairline cards reproduce 90% of the voice. Tricky bits: the sphere render is an asset, not CSS; dot-matrix cartography needs canvas/SVG generation. Implicit states: none observable (static plate).

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | plate is explicit canon |
| Colors | ⚠️ | paper pixel-grounded; accent chips read visually |
| Typography | ✅ | declared on plate |
| Components | ⚠️ | specimens visible, states not |

## 6. Do's and Don'ts

**Do** — keep the paper field under all UI; set annotations in uppercase mono with wide tracking; spend saturated color only on artifacts under study; use hairline (≤1px) borders.

**Don't** — don't fill backgrounds with obsidian (it's a specimen ground, not the page); don't use clay/amber decoratively; don't round cards beyond 8px; don't set body copy in mono.

## 7. Open questions

- Are the colorway chip hexes canonical tokens or per-plate? (Likely canonical: named "Mars Atlas".)
- Dark-mode counterpart plate not in this set.

## 8. Companion files

- [x] `source.md` (vision, self)
- [x] `design-tokens.md` (pixel sample)
- [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: spec plate, not a product screen (see contract §component rule).
