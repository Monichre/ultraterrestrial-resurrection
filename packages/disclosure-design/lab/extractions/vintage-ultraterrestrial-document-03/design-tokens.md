---
title: design-tokens — vintage-ultraterrestrial-document-03
description: Pixel-grounded token sheet for vintage-ultraterrestrial-document-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `vintage-ultraterrestrial-document-03`

Source still: `./vintage-ultraterrestrial-document-03.png` · 896×1344 · PNG · polarity **light** (mean luma 163.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [vintage-ultraterrestrial-document](../vintage-ultraterrestrial-document/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e2dac4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#ccc5b3` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1d2126` | max-contrast swatch vs bg-primary (11.6:1) | ✅ high |
| `--color-text-secondary` | `#4e5254` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#ccc5b3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e2dac4` | 14.3% | 0.133 | 218.1 |
| `#c3bcab` | 13.3% | 0.123 | 188.3 |
| `#1d2126` | 13.2% | 0.237 | 32.5 |
| `#4e5254` | 11.5% | 0.071 | 81.3 |
| `#97948b` | 9.6% | 0.079 | 148.0 |

Median `#ccc5b3` · dominant `#e2dac4` · chroma peak `#1d2126`.

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
  --color-bg-primary: #e2dac4;
  --color-bg-secondary: #ccc5b3;
  --color-text-primary: #1d2126;
  --color-text-secondary: #4e5254;
  --color-border-primary: #ccc5b3;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
