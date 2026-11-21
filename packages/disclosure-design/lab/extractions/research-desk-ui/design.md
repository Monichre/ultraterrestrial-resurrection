---
version: anydesign-1
name: research-desk-ui — document panel component spec
source: extractions/research-desk-ui/research-desk-ui.png
captured_at: 2026-08-13
description: |
  Archival component-spec sheet on bone paper. The product's document panel is
  presented like a museum mount: hairline rules, mono measurement labels, warm
  parchment surfaces. Restraint is the brand voice — ink and brass tones do all
  the work; no hue, no shadow theatre.
colors:
  primary: "#7b7669"
  surface: "#f4f0e9"
  text-primary: "#7b7669"
  text-muted: "#7b7669"
  border: "#cbc2b3"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 400
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64]
rounded:
  sm: 4px
---

# Design Analysis — document panel spec (still)

> Analysis per `prompts/output-template.md`, still-scoped. Emphasis: design system.
> Date: 2026-08-13. Pixel truth: `design-tokens.md` in this folder.

## Source

- **Source type**: local image (vision-read, gold pass)
- **Detected limitations**: single still — no states, no responsive material ❓

## TL;DR

Archival spec-sheet register: warm bone surface, ink-taupe annotation, hairline
chrome. The document panel is treated as evidence, not UI furniture.

## 1. Visual identity

**Personality**: archival, clinical, warm, precise.
**Mood**: instrument-grade calm; provenance you can measure.
**Density**: balanced. **Positioning**: researchers who read primary sources.
**Confidence**: ✅ high (surface + tokens measured), ⚠️ medium (type family inferred).

### 1.3 The ONE brand thing

**The thing**: the paper. Bone `#f4f0e9` carries the entire identity — remove it
and this is a generic wireframe. Everything else (hairlines, mono labels) is
restrained *in service of* the paper register.

## 2. Tokens

Measured: `design-tokens.md`. Key roles: `--color-bg-primary` `#f4f0e9`,
`--color-border-primary` `#cbc2b3`, `--color-text-primary` `#7b7669` (note: on
paper the ink reads darker than the measured mid-taupe — vision ⚠️). No accent
qualified (chroma-scarce frame); do not invent one.

## 4. Layout & composition

Centered specimen on a larger sheet; callout labels keyed to edges with leader
lines; margins ≈ 64–96px rhythm; vertical hierarchy by rule weight, not color.

## 6. Do's and Don'ts

**Do**: keep annotations mono 11–12px; keep the sheet flat (no drop shadows);
use hairline `#cbc2b3` rules as the only chrome.
**Don't**: no hue accents on the paper register; no rounded-pill chrome on an
archival card; don't darken the paper to "make it pop".

## 7. Open questions

- Exact typeface of the mono labels (looks like a grotesque mono — ⚠️ medium).
- Hover/focus states for the panel: not observable in a still.
