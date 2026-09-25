---
title: design-tokens — prometheus-line-studies-05
description: Pixel-grounded token sheet for prometheus-line-studies-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-05`

Source still: `./prometheus-line-studies-05.png` · 928×1232 · PNG · polarity **dark** (mean luma 63.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#131517` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#2d2e2d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8b8b87` | max-contrast swatch vs bg-primary (5.35:1) | ✅ high |
| `--color-text-secondary` | `#434442` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2d2e2d` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#434442` | 15.6% | 0.029 | 67.6 |
| `#2d2e2d` | 14.1% | 0.022 | 45.7 |
| `#131517` | 12.3% | 0.174 | 20.7 |
| `#8b8b87` | 10.3% | 0.029 | 138.7 |

Median `#3b3b3a` · dominant `#434442` · chroma peak `#131517`.

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
  --color-bg-primary: #131517;
  --color-bg-secondary: #2d2e2d;
  --color-text-primary: #8b8b87;
  --color-text-secondary: #434442;
  --color-border-primary: #2d2e2d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
