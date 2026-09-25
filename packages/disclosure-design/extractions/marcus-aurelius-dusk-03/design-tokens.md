---
title: design-tokens — marcus-aurelius-dusk-03
description: Pixel-grounded token sheet for marcus-aurelius-dusk-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `marcus-aurelius-dusk-03`

Source still: `./marcus-aurelius-dusk-03.png` · 1232×928 · PNG · polarity **dark** (mean luma 48.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [marcus-aurelius-dusk](../marcus-aurelius-dusk/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#110f0f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#2b1312` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#ae8373` | max-contrast swatch vs bg-primary (5.73:1) | ✅ high |
| `--color-text-secondary` | `#8c5045` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2b1312` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#6c2c27` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#311d18` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#110f0f` | 21.5% | 0.118 | 15.4 |
| `#8c5045` | 14.8% | 0.507 | 92.0 |
| `#6c2c27` | 12.4% | 0.639 | 57.2 |
| `#311d18` | 12.2% | 0.51 | 32.9 |
| `#ae8373` | 11.0% | 0.339 | 139.0 |

Median `#2b1312` · dominant `#110f0f` · chroma peak `#6c2c27`.

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
  --color-bg-primary: #110f0f;
  --color-bg-secondary: #2b1312;
  --color-text-primary: #ae8373;
  --color-text-secondary: #8c5045;
  --color-border-primary: #2b1312;
  --color-primary: #6c2c27;
  --chart-color-1: #311d18;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
