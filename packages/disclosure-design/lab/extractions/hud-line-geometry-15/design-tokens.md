---
title: design-tokens — hud-line-geometry-15
description: Pixel-grounded token sheet for hud-line-geometry-15 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-15`

Source still: `./hud-line-geometry-15.png` · 928×1232 · PNG · polarity **light** (mean luma 124.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#ebdabe` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cbb89c` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000000` | max-contrast swatch vs bg-primary (15.3:1) | ✅ high |
| `--color-text-secondary` | `#80725e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b8a68b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#80725e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#2e2922` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000000` | 19.4% | 0.0 | 0.0 |
| `#2e2922` | 17.1% | 0.261 | 41.6 |
| `#ebdabe` | 13.6% | 0.191 | 219.6 |
| `#cbb89c` | 12.8% | 0.232 | 186.0 |
| `#80725e` | 7.5% | 0.266 | 115.5 |

Median `#b8a68b` · dominant `#000000` · chroma peak `#2e2922`.

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
  --color-bg-primary: #ebdabe;
  --color-bg-secondary: #cbb89c;
  --color-text-primary: #000000;
  --color-text-secondary: #80725e;
  --color-border-primary: #b8a68b;
  --color-primary: #80725e;
  --chart-color-1: #2e2922;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
