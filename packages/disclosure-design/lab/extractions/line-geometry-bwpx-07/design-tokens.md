---
title: design-tokens — line-geometry-bwpx-07
description: Pixel-grounded token sheet for line-geometry-bwpx-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-geometry-bwpx-07`

Source still: `./line-geometry-bwpx-07.png` · 1232×928 · PNG · polarity **light** (mean luma 112.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-geometry-bwpx](../line-geometry-bwpx/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d1c1a4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bdad93` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000101` | max-contrast swatch vs bg-primary (11.82:1) | ✅ high |
| `--color-text-secondary` | `#5b564e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#968d7e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000101` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#8e8578` | 17.9% | 0.155 | 134.0 |
| `#000101` | 14.7% | 1.0 | 0.8 |
| `#bdad93` | 13.9% | 0.222 | 174.5 |
| `#d1c1a4` | 10.8% | 0.215 | 194.3 |
| `#5b564e` | 4.1% | 0.143 | 86.5 |

Median `#968d7e` · dominant `#8e8578` · chroma peak `#000101`.

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
  --color-bg-primary: #d1c1a4;
  --color-bg-secondary: #bdad93;
  --color-text-primary: #000101;
  --color-text-secondary: #5b564e;
  --color-border-primary: #968d7e;
  --color-primary: #000101;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
