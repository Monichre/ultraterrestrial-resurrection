---
title: design-tokens — bust-starfield-construction-09
description: Pixel-grounded token sheet for bust-starfield-construction-09 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-09`

Source still: `./bust-starfield-construction-09.png` · 928×1232 · PNG · polarity **dark** (mean luma 49.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0e1014` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#191f25` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#938f87` | max-contrast swatch vs bg-primary (5.91:1) | ✅ high |
| `--color-text-secondary` | `#4c545b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#191f25` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#1e252b` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#2f3840` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0e1014` | 16.8% | 0.3 | 15.9 |
| `#4c545b` | 14.8% | 0.165 | 82.8 |
| `#1e252b` | 13.0% | 0.302 | 35.9 |
| `#2f3840` | 12.5% | 0.266 | 54.7 |
| `#938f87` | 10.2% | 0.082 | 143.3 |

Median `#191f25` · dominant `#0e1014` · chroma peak `#0e1014`.

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
  --color-bg-primary: #0e1014;
  --color-bg-secondary: #191f25;
  --color-text-primary: #938f87;
  --color-text-secondary: #4c545b;
  --color-border-primary: #191f25;
  --color-primary: #1e252b;
  --chart-color-1: #2f3840;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
