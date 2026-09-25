---
title: design-tokens — resplendent-mind-plate
description: Pixel-grounded token sheet for resplendent-mind-plate (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `resplendent-mind-plate`

Source still: `./resplendent-mind-plate.png` · 1232×928 · PNG · polarity **dark** (mean luma 62.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0a070d` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#222122` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#907d66` | max-contrast swatch vs bg-primary (5.06:1) | ✅ high |
| `--color-text-secondary` | `#3a4346` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#222122` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0a070d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#4b352e` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#3a4346` | 27.2% | 0.171 | 65.3 |
| `#0a070d` | 13.2% | 0.462 | 8.1 |
| `#907d66` | 11.4% | 0.292 | 127.4 |
| `#222122` | 9.6% | 0.029 | 33.3 |
| `#4b352e` | 9.3% | 0.387 | 57.2 |

Median `#3c4141` · dominant `#3a4346` · chroma peak `#0a070d`.

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
  --color-bg-primary: #0a070d;
  --color-bg-secondary: #222122;
  --color-text-primary: #907d66;
  --color-text-secondary: #3a4346;
  --color-border-primary: #222122;
  --color-primary: #0a070d;
  --chart-color-1: #4b352e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
