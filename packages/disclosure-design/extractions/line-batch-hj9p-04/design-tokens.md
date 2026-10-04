---
title: design-tokens — line-batch-hj9p-04
description: Pixel-grounded token sheet for line-batch-hj9p-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-hj9p-04`

Source still: `./line-batch-hj9p-04.png` · 1232×928 · PNG · polarity **light** (mean luma 141.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-hj9p](../line-batch-hj9p/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c6c2bf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b6b2af` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000001` | max-contrast swatch vs bg-primary (11.86:1) | ✅ high |
| `--color-text-secondary` | `#1f1816` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b6b2af` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000001` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000001` | 14.9% | 1.0 | 0.1 |
| `#b0aca8` | 14.8% | 0.045 | 172.6 |
| `#c6c2bf` | 13.7% | 0.035 | 194.6 |
| `#90857d` | 10.9% | 0.132 | 134.8 |
| `#1f1816` | 7.4% | 0.29 | 25.3 |

Median `#b6b2af` · dominant `#000001` · chroma peak `#000001`.

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
  --color-bg-primary: #c6c2bf;
  --color-bg-secondary: #b6b2af;
  --color-text-primary: #000001;
  --color-text-secondary: #1f1816;
  --color-border-primary: #b6b2af;
  --color-primary: #000001;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
