---
title: design-tokens — daedalus-line-geometry-16
description: Pixel-grounded token sheet for daedalus-line-geometry-16 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `daedalus-line-geometry-16`

Source still: `./daedalus-line-geometry-16.png` · 928×1232 · PNG · polarity **light** (mean luma 171.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [daedalus-line-geometry](../daedalus-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c7c7bf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c7c7be` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#3f4445` | max-contrast swatch vs bg-primary (5.81:1) | ✅ high |
| `--color-text-secondary` | `#888987` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c7c7be` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c7c7bf` | 20.7% | 0.04 | 198.4 |
| `#aaaba5` | 12.8% | 0.035 | 170.4 |
| `#3f4445` | 11.4% | 0.087 | 67.0 |
| `#888987` | 10.7% | 0.015 | 136.6 |

Median `#c7c7be` · dominant `#c7c7bf` · chroma peak `#3f4445`.

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
  --color-bg-primary: #c7c7bf;
  --color-bg-secondary: #c7c7be;
  --color-text-primary: #3f4445;
  --color-text-secondary: #888987;
  --color-border-primary: #c7c7be;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
