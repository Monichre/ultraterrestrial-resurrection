---
title: design-tokens — prometheus-geometry-mix-07
description: Pixel-grounded token sheet for prometheus-geometry-mix-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-geometry-mix-07`

Source still: `./prometheus-geometry-mix-07.png` · 928×1232 · PNG · polarity **light** (mean luma 115.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-geometry-mix](../prometheus-geometry-mix/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#a6a9a2` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#838a87` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0d1215` | max-contrast swatch vs bg-primary (7.91:1) | ✅ high |
| `--color-text-secondary` | `#515b5c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#7b8280` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0d1215` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#a6a9a2` | 14.3% | 0.041 | 167.9 |
| `#0d1215` | 12.7% | 0.381 | 17.2 |
| `#838a87` | 12.6% | 0.051 | 136.3 |
| `#6e7675` | 12.3% | 0.068 | 116.2 |
| `#515b5c` | 12.1% | 0.12 | 88.9 |

Median `#7b8280` · dominant `#a6a9a2` · chroma peak `#0d1215`.

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
  --color-bg-primary: #a6a9a2;
  --color-bg-secondary: #838a87;
  --color-text-primary: #0d1215;
  --color-text-secondary: #515b5c;
  --color-border-primary: #7b8280;
  --color-primary: #0d1215;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
