---
title: design-tokens — line-batch-8kto-02
description: Pixel-grounded token sheet for line-batch-8kto-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-8kto-02`

Source still: `./line-batch-8kto-02.png` · 928×1232 · PNG · polarity **light** (mean luma 140.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-8kto](../line-batch-8kto/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d3ccc2` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c0bab2` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000000` | max-contrast swatch vs bg-primary (13.19:1) | ✅ high |
| `--color-text-secondary` | `#907e66` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c0bab2` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#907e66` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d3ccc2` | 20.6% | 0.081 | 204.8 |
| `#000000` | 17.9% | 0.0 | 0.0 |
| `#b0aba3` | 11.5% | 0.074 | 171.5 |
| `#907e66` | 11.5% | 0.292 | 128.1 |

Median `#c0bab2` · dominant `#d3ccc2` · chroma peak `#907e66`.

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
  --color-bg-primary: #d3ccc2;
  --color-bg-secondary: #c0bab2;
  --color-text-primary: #000000;
  --color-text-secondary: #907e66;
  --color-border-primary: #c0bab2;
  --color-primary: #907e66;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
