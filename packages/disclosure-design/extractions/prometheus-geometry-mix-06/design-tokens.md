---
title: design-tokens — prometheus-geometry-mix-06
description: Pixel-grounded token sheet for prometheus-geometry-mix-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-geometry-mix-06`

Source still: `./prometheus-geometry-mix-06.png` · 928×1232 · PNG · polarity **light** (mean luma 113.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-geometry-mix](../prometheus-geometry-mix/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#9fa49c` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#777a76` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#191d23` | max-contrast swatch vs bg-primary (6.66:1) | ✅ high |
| `--color-text-secondary` | `#595d5c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#777a76` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#191d23` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#9fa49c` | 19.4% | 0.049 | 162.4 |
| `#191d23` | 14.0% | 0.286 | 28.6 |
| `#6e716e` | 13.6% | 0.027 | 112.1 |
| `#595d5c` | 12.2% | 0.043 | 92.1 |
| `#353a3d` | 9.9% | 0.131 | 57.2 |

Median `#777a76` · dominant `#9fa49c` · chroma peak `#191d23`.

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
  --color-bg-primary: #9fa49c;
  --color-bg-secondary: #777a76;
  --color-text-primary: #191d23;
  --color-text-secondary: #595d5c;
  --color-border-primary: #777a76;
  --color-primary: #191d23;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
