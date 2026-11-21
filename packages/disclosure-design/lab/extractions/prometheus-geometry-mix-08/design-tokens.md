---
title: design-tokens — prometheus-geometry-mix-08
description: Pixel-grounded token sheet for prometheus-geometry-mix-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-geometry-mix-08`

Source still: `./prometheus-geometry-mix-08.png` · 928×1232 · PNG · polarity **light** (mean luma 114.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-geometry-mix](../prometheus-geometry-mix/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#a4a59a` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#838882` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0f1417` | max-contrast swatch vs bg-primary (7.44:1) | ✅ high |
| `--color-text-secondary` | `#51595a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#7b807b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0f1417` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#a4a59a` | 16.0% | 0.067 | 164.0 |
| `#0f1417` | 12.9% | 0.348 | 19.2 |
| `#6f7572` | 12.6% | 0.051 | 115.5 |
| `#838882` | 12.2% | 0.044 | 134.5 |
| `#51595a` | 12.1% | 0.1 | 87.4 |

Median `#7b807b` · dominant `#a4a59a` · chroma peak `#0f1417`.

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
  --color-bg-primary: #a4a59a;
  --color-bg-secondary: #838882;
  --color-text-primary: #0f1417;
  --color-text-secondary: #51595a;
  --color-border-primary: #7b807b;
  --color-primary: #0f1417;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
