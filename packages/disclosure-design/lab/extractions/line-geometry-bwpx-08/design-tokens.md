---
title: design-tokens — line-geometry-bwpx-08
description: Pixel-grounded token sheet for line-geometry-bwpx-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-geometry-bwpx-08`

Source still: `./line-geometry-bwpx-08.png` · 1232×928 · PNG · polarity **dark** (mean luma 93.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-geometry-bwpx](../line-geometry-bwpx/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#292c2d` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#5c5843` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c3b683` | max-contrast swatch vs bg-primary (6.93:1) | ✅ high |
| `--color-text-secondary` | `#7e7655` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#5c5843` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#9e9367` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#666148` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#292c2d` | 17.5% | 0.089 | 43.4 |
| `#666148` | 12.8% | 0.294 | 96.3 |
| `#7e7655` | 12.8% | 0.325 | 117.3 |
| `#c3b683` | 12.7% | 0.328 | 181.1 |
| `#9e9367` | 12.2% | 0.348 | 146.2 |

Median `#5c5843` · dominant `#292c2d` · chroma peak `#9e9367`.

## 2. Typography

Not observable from a still at this fidelity — apply `prompts/fonts.md` only if the gold
`design.md` names a face. Canon fallback: `--font-sans: system-ui, sans-serif`;
mono reserved for code/technical labels.

## 3–7. Spacing · borders · shadows · motion · z-index

## Canon defaults — not observable in a still

These come from the assembling-components canon (`references/token-validation-rules.md`,
`references/anydesign-token-rename-map.md`), not from the pixels. 4px spacing base.

| Token | Value | Provenance |
| --- | --- | --- |
| `--spacing-xs` / `--spacing-sm` / `--spacing-md` / `--spacing-lg` / `--spacing-xl` | 4px / 8px / 16px / 24px / 32px | canon default |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 4px / 8px / 12px | canon default |
| `--shadow-sm` / `--shadow-md` | `0 1px 2px rgb(0 0 0 / 0.06)` / `0 2px 8px rgb(0 0 0 / 0.12)` | canon default |
| `--duration-fast` / `--duration-normal` / `--duration-slow` | 150ms / 200ms / 300ms | canon default |
| `--z-dropdown` … `--z-toast` | 1000 … 1080 | canon default |


## CSS

```css
:root {
  --color-bg-primary: #292c2d;
  --color-bg-secondary: #5c5843;
  --color-text-primary: #c3b683;
  --color-text-secondary: #7e7655;
  --color-border-primary: #5c5843;
  --color-primary: #9e9367;
  --chart-color-1: #666148;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
