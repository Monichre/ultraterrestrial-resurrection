---
title: design-tokens — photo-mood-collages
description: Pixel-grounded token sheet for photo-mood-collages (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `photo-mood-collages`

Source still: `./photo-mood-collages.jpeg` · 1536×2304 · JPEG · polarity **light** (mean luma 198.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e9d7b1` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#e7d4ad` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#355aa7` | max-contrast swatch vs bg-primary (4.67:1) | ✅ high |
| `--color-text-secondary` | `#355aa7` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#e9d7b1` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#355aa7` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e9d7b1` | 16.5% | 0.24 | 216.1 |
| `#355aa7` | 9.4% | 0.683 | 87.7 |

Median `#e7d4ad` · dominant `#e9d7b1` · chroma peak `#355aa7`.

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
  --color-bg-primary: #e9d7b1;
  --color-bg-secondary: #e7d4ad;
  --color-text-primary: #355aa7;
  --color-text-secondary: #355aa7;
  --color-border-primary: #e9d7b1;
  --color-primary: #355aa7;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
