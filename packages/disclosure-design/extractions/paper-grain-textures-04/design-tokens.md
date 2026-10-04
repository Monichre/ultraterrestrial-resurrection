---
title: design-tokens — paper-grain-textures-04
description: Pixel-grounded token sheet for paper-grain-textures-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `paper-grain-textures-04`

Source still: `./paper-grain-textures-04.png` · 98×98 · PNG · polarity **light** (mean luma 195.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [paper-grain-textures](../paper-grain-textures/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c1cad4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bac8d6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8bb9e8` | max-contrast swatch vs bg-primary (1.24:1) | ✅ high |
| `--color-text-secondary` | `#8bb9e8` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c1cad4` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#8bb9e8` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c1cad4` | 24.3% | 0.09 | 200.8 |
| `#8bb9e8` | 11.1% | 0.401 | 178.6 |

Median `#bac8d6` · dominant `#c1cad4` · chroma peak `#8bb9e8`.

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
  --color-bg-primary: #c1cad4;
  --color-bg-secondary: #bac8d6;
  --color-text-primary: #8bb9e8;
  --color-text-secondary: #8bb9e8;
  --color-border-primary: #c1cad4;
  --color-primary: #8bb9e8;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
