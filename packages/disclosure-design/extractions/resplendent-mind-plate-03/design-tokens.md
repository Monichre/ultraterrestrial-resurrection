---
title: design-tokens — resplendent-mind-plate-03
description: Pixel-grounded token sheet for resplendent-mind-plate-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `resplendent-mind-plate-03`

Source still: `./resplendent-mind-plate-03.png` · 1232×928 · PNG · polarity **dark** (mean luma 64.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [resplendent-mind-plate](../resplendent-mind-plate/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#05050e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#251a17` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#5f5c54` | max-contrast swatch vs bg-primary (3.04:1) | ✅ high |
| `--color-text-secondary` | `#2d3333` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2d3333` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#05050e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#414746` | 18.0% | 0.085 | 69.7 |
| `#5f5c54` | 15.5% | 0.116 | 92.1 |
| `#05050e` | 13.0% | 0.643 | 5.6 |
| `#2d3333` | 12.7% | 0.118 | 49.7 |
| `#251a17` | 11.0% | 0.378 | 28.1 |

Median `#44423e` · dominant `#414746` · chroma peak `#05050e`.

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
  --color-bg-primary: #05050e;
  --color-bg-secondary: #251a17;
  --color-text-primary: #5f5c54;
  --color-text-secondary: #2d3333;
  --color-border-primary: #2d3333;
  --color-primary: #05050e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
