---
title: design-tokens — photo-mood-collages-04
description: Pixel-grounded token sheet for photo-mood-collages-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `photo-mood-collages-04`

Source still: `./photo-mood-collages-04.jpeg` · 1536×2304 · JPEG · polarity **light** (mean luma 209.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [photo-mood-collages](../photo-mood-collages/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#eddec0` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#e7d7b9` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b18f7b` | max-contrast swatch vs bg-primary (2.23:1) | ✅ high |
| `--color-text-secondary` | `#b18f7b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#eddec0` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#b18f7b` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#eddec0` | 15.3% | 0.19 | 223.0 |
| `#b18f7b` | 6.4% | 0.305 | 148.8 |

Median `#e7d7b9` · dominant `#eddec0` · chroma peak `#b18f7b`.

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
  --color-bg-primary: #eddec0;
  --color-bg-secondary: #e7d7b9;
  --color-text-primary: #b18f7b;
  --color-text-secondary: #b18f7b;
  --color-border-primary: #eddec0;
  --color-primary: #b18f7b;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
