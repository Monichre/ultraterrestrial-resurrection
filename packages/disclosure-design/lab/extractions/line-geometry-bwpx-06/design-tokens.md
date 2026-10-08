---
title: design-tokens — line-geometry-bwpx-06
description: Pixel-grounded token sheet for line-geometry-bwpx-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-geometry-bwpx-06`

Source still: `./line-geometry-bwpx-06.png` · 1232×928 · PNG · polarity **light** (mean luma 133.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-geometry-bwpx](../line-geometry-bwpx/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cbc2a8` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b7ad95` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1a1a1a` | max-contrast swatch vs bg-primary (9.8:1) | ✅ high |
| `--color-text-secondary` | `#5a5751` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b7ad95` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#cbc2a8` | 18.4% | 0.172 | 194.0 |
| `#1a1a1a` | 15.2% | 0.0 | 26.0 |
| `#a9a08b` | 14.2% | 0.178 | 160.4 |
| `#5a5751` | 4.7% | 0.1 | 87.2 |

Median `#b7ad95` · dominant `#cbc2a8` · chroma peak `#cbc2a8`.

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
  --color-bg-primary: #cbc2a8;
  --color-bg-secondary: #b7ad95;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #5a5751;
  --color-border-primary: #b7ad95;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
