---
title: design-tokens — prometheus-geometry-mix-05
description: Pixel-grounded token sheet for prometheus-geometry-mix-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-geometry-mix-05`

Source still: `./prometheus-geometry-mix-05.png` · 928×1232 · PNG · polarity **light** (mean luma 114.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-geometry-mix](../prometheus-geometry-mix/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#a0a39b` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#878a81` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0c1115` | max-contrast swatch vs bg-primary (7.42:1) | ✅ high |
| `--color-text-secondary` | `#595c59` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#80837c` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0c1115` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#a0a39b` | 13.7% | 0.049 | 161.8 |
| `#0c1115` | 12.9% | 0.429 | 16.2 |
| `#878a81` | 12.7% | 0.065 | 136.7 |
| `#595c59` | 12.7% | 0.033 | 91.1 |
| `#747771` | 11.8% | 0.05 | 117.9 |

Median `#80837c` · dominant `#a0a39b` · chroma peak `#0c1115`.

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
  --color-bg-primary: #a0a39b;
  --color-bg-secondary: #878a81;
  --color-text-primary: #0c1115;
  --color-text-secondary: #595c59;
  --color-border-primary: #80837c;
  --color-primary: #0c1115;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
