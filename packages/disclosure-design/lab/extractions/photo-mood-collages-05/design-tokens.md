---
title: design-tokens — photo-mood-collages-05
description: Pixel-grounded token sheet for photo-mood-collages-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `photo-mood-collages-05`

Source still: `./photo-mood-collages-05.jpeg` · 971×1619 · JPEG · polarity **light** (mean luma 207.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [photo-mood-collages](../photo-mood-collages/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d9d5cb` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b5b1ab` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b5b1ab` | max-contrast swatch vs bg-primary (1.46:1) | ✅ high |
| `--color-text-secondary` | `#b5b1ab` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d9d5cb` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d9d5cb` | 16.1% | 0.065 | 213.1 |
| `#b5b1ab` | 7.2% | 0.055 | 177.4 |

Median `#d9d5cb` · dominant `#d9d5cb` · chroma peak `#d9d5cb`.

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
  --color-bg-primary: #d9d5cb;
  --color-bg-secondary: #b5b1ab;
  --color-text-primary: #b5b1ab;
  --color-text-secondary: #b5b1ab;
  --color-border-primary: #d9d5cb;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
