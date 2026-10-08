---
title: design-tokens — hud-line-geometry-22
description: Pixel-grounded token sheet for hud-line-geometry-22 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-22`

Source still: `./hud-line-geometry-22.png` · 928×1232 · PNG · polarity **light** (mean luma 152.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cdc5bc` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c2b9ae` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#14141c` | max-contrast swatch vs bg-primary (10.74:1) | ✅ high |
| `--color-text-secondary` | `#594f4a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c2b9ae` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#14141c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#cdc5bc` | 17.2% | 0.083 | 198.1 |
| `#14141c` | 15.4% | 0.286 | 20.6 |
| `#bbb2a7` | 14.7% | 0.107 | 179.1 |
| `#a59b90` | 12.2% | 0.127 | 156.3 |
| `#594f4a` | 7.7% | 0.169 | 80.8 |

Median `#c2b9ae` · dominant `#cdc5bc` · chroma peak `#14141c`.

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
  --color-bg-primary: #cdc5bc;
  --color-bg-secondary: #c2b9ae;
  --color-text-primary: #14141c;
  --color-text-secondary: #594f4a;
  --color-border-primary: #c2b9ae;
  --color-primary: #14141c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
