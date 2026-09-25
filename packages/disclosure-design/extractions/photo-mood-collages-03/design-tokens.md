---
title: design-tokens — photo-mood-collages-03
description: Pixel-grounded token sheet for photo-mood-collages-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `photo-mood-collages-03`

Source still: `./photo-mood-collages-03.jpeg` · 971×1619 · JPEG · polarity **light** (mean luma 222.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [photo-mood-collages](../photo-mood-collages/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e7e2cf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#e6e0bf` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#e6e0bf` | max-contrast swatch vs bg-primary (1.03:1) | ✅ high |
| `--color-text-secondary` | `#e6e0bf` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#e7e2cf` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e6e0bf` | 21.5% | 0.17 | 222.9 |

Median `#e7e2cf` · dominant `#e6e0bf` · chroma peak `#e6e0bf`.

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
  --color-bg-primary: #e7e2cf;
  --color-bg-secondary: #e6e0bf;
  --color-text-primary: #e6e0bf;
  --color-text-secondary: #e6e0bf;
  --color-border-primary: #e7e2cf;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
