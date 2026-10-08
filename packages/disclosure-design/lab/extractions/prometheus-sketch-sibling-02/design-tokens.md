---
title: design-tokens — prometheus-sketch-sibling-02
description: Pixel-grounded token sheet for prometheus-sketch-sibling-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-sketch-sibling-02`

Source still: `./prometheus-sketch-sibling-02.png` · 928×1232 · PNG · polarity **light** (mean luma 155.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-sketch-sibling](../prometheus-sketch-sibling/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c2c2bc` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#adada8` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#2c2e31` | max-contrast swatch vs bg-primary (7.61:1) | ✅ high |
| `--color-text-secondary` | `#888886` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#adada8` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#9e9e99` | 13.4% | 0.032 | 157.6 |
| `#c2c2bc` | 13.4% | 0.031 | 193.6 |
| `#888886` | 12.4% | 0.015 | 135.9 |
| `#2c2e31` | 10.1% | 0.102 | 45.8 |

Median `#adada8` · dominant `#9e9e99` · chroma peak `#2c2e31`.

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
  --color-bg-primary: #c2c2bc;
  --color-bg-secondary: #adada8;
  --color-text-primary: #2c2e31;
  --color-text-secondary: #888886;
  --color-border-primary: #adada8;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
