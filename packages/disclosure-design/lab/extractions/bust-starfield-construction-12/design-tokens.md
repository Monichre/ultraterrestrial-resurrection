---
title: design-tokens — bust-starfield-construction-12
description: Pixel-grounded token sheet for bust-starfield-construction-12 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-12`

Source still: `./bust-starfield-construction-12.png` · 928×1232 · PNG · polarity **dark** (mean luma 74.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#1e1e1c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#31302d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#baab91` | max-contrast swatch vs bg-primary (7.41:1) | ✅ high |
| `--color-text-secondary` | `#625f59` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#31302d` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#baab91` | 15.4% | 0.22 | 172.3 |
| `#1e1e1c` | 13.8% | 0.067 | 29.9 |
| `#3b3a37` | 13.0% | 0.068 | 58.0 |
| `#9d9382` | 10.7% | 0.172 | 147.9 |
| `#625f59` | 10.4% | 0.092 | 95.2 |

Median `#31302d` · dominant `#baab91` · chroma peak `#baab91`.

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
  --color-bg-primary: #1e1e1c;
  --color-bg-secondary: #31302d;
  --color-text-primary: #baab91;
  --color-text-secondary: #625f59;
  --color-border-primary: #31302d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
