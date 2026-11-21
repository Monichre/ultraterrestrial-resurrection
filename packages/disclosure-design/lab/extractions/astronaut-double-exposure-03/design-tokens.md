---
title: design-tokens — astronaut-double-exposure-03
description: Pixel-grounded token sheet for astronaut-double-exposure-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `astronaut-double-exposure-03`

Source still: `./astronaut-double-exposure-03.png` · 1456×816 · PNG · polarity **light** (mean luma 179.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [astronaut-double-exposure](../astronaut-double-exposure/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d1cbbb` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#d0cbb9` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#5b4c49` | max-contrast swatch vs bg-primary (5.04:1) | ✅ high |
| `--color-text-secondary` | `#5b4c49` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d0cbb9` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#dfb26c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d1cbbb` | 21.6% | 0.105 | 203.1 |
| `#5b4c49` | 15.8% | 0.198 | 79.0 |
| `#dfb26c` | 12.2% | 0.516 | 182.5 |

Median `#d0cbb9` · dominant `#d1cbbb` · chroma peak `#dfb26c`.

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
  --color-bg-primary: #d1cbbb;
  --color-bg-secondary: #d0cbb9;
  --color-text-primary: #5b4c49;
  --color-text-secondary: #5b4c49;
  --color-border-primary: #d0cbb9;
  --color-primary: #dfb26c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
