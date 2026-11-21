---
title: design-tokens — bust-geometry-reverse-04
description: Pixel-grounded token sheet for bust-geometry-reverse-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-geometry-reverse-04`

Source still: `./bust-geometry-reverse-04.png` · 928×1232 · PNG · polarity **dark** (mean luma 104.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-geometry-reverse](../bust-geometry-reverse/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#2b2e32` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#4b4e51` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#e2cfac` | max-contrast swatch vs bg-primary (8.93:1) | ✅ high |
| `--color-text-secondary` | `#a29a8e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#4b4e51` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#2b2e32` | 14.7% | 0.14 | 45.7 |
| `#c4b6a0` | 14.4% | 0.184 | 183.4 |
| `#a29a8e` | 12.6% | 0.123 | 154.8 |
| `#e2cfac` | 11.9% | 0.239 | 208.5 |
| `#6a6a6a` | 9.5% | 0.0 | 106.0 |

Median `#4b4e51` · dominant `#2b2e32` · chroma peak `#e2cfac`.

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
  --color-bg-primary: #2b2e32;
  --color-bg-secondary: #4b4e51;
  --color-text-primary: #e2cfac;
  --color-text-secondary: #a29a8e;
  --color-border-primary: #4b4e51;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
