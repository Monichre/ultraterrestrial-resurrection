---
title: design-tokens — line-geometry-bwpx-02
description: Pixel-grounded token sheet for line-geometry-bwpx-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-geometry-bwpx-02`

Source still: `./line-geometry-bwpx-02.png` · 1232×928 · PNG · polarity **dark** (mean luma 92.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-geometry-bwpx](../line-geometry-bwpx/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0a0b0b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#5a544d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b9a490` | max-contrast swatch vs bg-primary (8.24:1) | ✅ high |
| `--color-text-secondary` | `#7f7165` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0a0b0b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |
| `--chart-color-1` | `#938373` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0a0b0b` | 21.1% | 0.091 | 10.8 |
| `#b9a490` | 14.2% | 0.222 | 167.0 |
| `#938373` | 11.9% | 0.218 | 133.2 |
| `#5a544d` | 7.0% | 0.144 | 84.8 |

Median `#7f7165` · dominant `#0a0b0b` · chroma peak `#b9a490`.

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
  --color-bg-primary: #0a0b0b;
  --color-bg-secondary: #5a544d;
  --color-text-primary: #b9a490;
  --color-text-secondary: #7f7165;
  --color-border-primary: #0a0b0b;
  --chart-color-1: #938373;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
