---
title: design-tokens — volluid-sphere-statues-03
description: Pixel-grounded token sheet for volluid-sphere-statues-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `volluid-sphere-statues-03`

Source still: `./volluid-sphere-statues-03.png` · 1856×2464 · PNG · polarity **dark** (mean luma 54.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [volluid-sphere-statues](../volluid-sphere-statues/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#090c12` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#232529` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#888888` | max-contrast swatch vs bg-primary (5.52:1) | ✅ high |
| `--color-text-secondary` | `#59595a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#232529` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#090c12` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#090c12` | 16.0% | 0.5 | 11.8 |
| `#888888` | 13.0% | 0.0 | 136.0 |
| `#707070` | 12.9% | 0.0 | 112.0 |
| `#59595a` | 12.0% | 0.011 | 89.1 |
| `#373738` | 12.0% | 0.018 | 55.1 |

Median `#232529` · dominant `#090c12` · chroma peak `#090c12`.

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
  --color-bg-primary: #090c12;
  --color-bg-secondary: #232529;
  --color-text-primary: #888888;
  --color-text-secondary: #59595a;
  --color-border-primary: #232529;
  --color-primary: #090c12;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
