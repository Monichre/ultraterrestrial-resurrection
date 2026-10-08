---
title: design-tokens — line-geometry-bwpx-03
description: Pixel-grounded token sheet for line-geometry-bwpx-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-geometry-bwpx-03`

Source still: `./line-geometry-bwpx-03.png` · 1232×928 · PNG · polarity **dark** (mean luma 79.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-geometry-bwpx](../line-geometry-bwpx/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0e0e0e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#313130` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#d2d3cc` | max-contrast swatch vs bg-primary (12.81:1) | ✅ high |
| `--color-text-secondary` | `#676762` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0e0e0e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0e0e0e` | 14.7% | 0.0 | 14.0 |
| `#676762` | 13.5% | 0.049 | 102.6 |
| `#313130` | 13.0% | 0.02 | 48.9 |
| `#4b4b47` | 12.4% | 0.053 | 74.7 |
| `#d2d3cc` | 12.2% | 0.033 | 210.3 |

Median `#3d3e3c` · dominant `#0e0e0e` · chroma peak `#4b4b47`.

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
  --color-bg-primary: #0e0e0e;
  --color-bg-secondary: #313130;
  --color-text-primary: #d2d3cc;
  --color-text-secondary: #676762;
  --color-border-primary: #0e0e0e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
