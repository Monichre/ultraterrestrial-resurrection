---
title: design-tokens — bust-starfield-construction-07
description: Pixel-grounded token sheet for bust-starfield-construction-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-07`

Source still: `./bust-starfield-construction-07.png` · 928×1232 · PNG · polarity **dark** (mean luma 59.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#12110f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#242421` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b0a99a` | max-contrast swatch vs bg-primary (8.08:1) | ✅ high |
| `--color-text-secondary` | `#76746d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#242421` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#12110f` | 16.8% | 0.167 | 17.1 |
| `#292927` | 14.5% | 0.049 | 40.9 |
| `#b0a99a` | 13.1% | 0.125 | 169.4 |
| `#3d3e3e` | 11.5% | 0.016 | 61.8 |
| `#76746d` | 11.2% | 0.076 | 115.9 |

Median `#242421` · dominant `#12110f` · chroma peak `#12110f`.

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
  --color-bg-primary: #12110f;
  --color-bg-secondary: #242421;
  --color-text-primary: #b0a99a;
  --color-text-secondary: #76746d;
  --color-border-primary: #242421;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
