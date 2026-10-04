---
title: design-tokens — prometheus-geometry-mix-04
description: Pixel-grounded token sheet for prometheus-geometry-mix-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-geometry-mix-04`

Source still: `./prometheus-geometry-mix-04.png` · 928×1232 · PNG · polarity **light** (mean luma 124.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-geometry-mix](../prometheus-geometry-mix/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#9fa6a4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#8a918d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#121417` | max-contrast swatch vs bg-primary (7.44:1) | ✅ high |
| `--color-text-secondary` | `#565855` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#868b88` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#9fa6a4` | 15.1% | 0.042 | 164.4 |
| `#6e716d` | 13.9% | 0.035 | 112.1 |
| `#8a918d` | 12.7% | 0.048 | 143.2 |
| `#565855` | 11.5% | 0.034 | 87.4 |
| `#121417` | 10.9% | 0.217 | 19.8 |

Median `#868b88` · dominant `#9fa6a4` · chroma peak `#121417`.

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
  --color-bg-primary: #9fa6a4;
  --color-bg-secondary: #8a918d;
  --color-text-primary: #121417;
  --color-text-secondary: #565855;
  --color-border-primary: #868b88;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
