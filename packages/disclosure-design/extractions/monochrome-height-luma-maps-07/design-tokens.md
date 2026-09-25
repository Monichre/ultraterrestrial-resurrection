---
title: design-tokens — monochrome-height-luma-maps-07
description: Pixel-grounded token sheet for monochrome-height-luma-maps-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `monochrome-height-luma-maps-07`

Source still: `./monochrome-height-luma-maps-07.png` · 512×1024 · PNG · polarity **dark** (mean luma 25.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [monochrome-height-luma-maps](../monochrome-height-luma-maps/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#010101` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0e0e0e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#626262` | max-contrast swatch vs bg-primary (3.42:1) | ✅ high |
| `--color-text-secondary` | `#2d2d2d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#010101` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#010101` | 25.8% | 0.0 | 1.0 |
| `#2d2d2d` | 15.5% | 0.0 | 45.0 |
| `#131313` | 11.3% | 0.0 | 19.0 |
| `#626262` | 9.7% | 0.0 | 98.0 |

Median `#0e0e0e` · dominant `#010101` · chroma peak `#010101`.

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
  --color-bg-primary: #010101;
  --color-bg-secondary: #0e0e0e;
  --color-text-primary: #626262;
  --color-text-secondary: #2d2d2d;
  --color-border-primary: #010101;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
