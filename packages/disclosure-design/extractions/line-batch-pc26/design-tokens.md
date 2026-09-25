---
title: design-tokens — line-batch-pc26
description: Pixel-grounded token sheet for line-batch-pc26 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `line-batch-pc26`

Source still: `./line-batch-pc26.png` · 1232×928 · PNG · polarity **light** (mean luma 130.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c6c0b6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#aea598` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000000` | max-contrast swatch vs bg-primary (11.62:1) | ✅ high |
| `--color-text-secondary` | `#71685d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#aea598` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#111418` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c6c0b6` | 16.6% | 0.081 | 192.6 |
| `#a3998c` | 13.4% | 0.141 | 154.2 |
| `#111418` | 13.2% | 0.292 | 19.7 |
| `#000000` | 12.8% | 0.0 | 0.0 |
| `#71685d` | 8.4% | 0.177 | 105.1 |

Median `#aea598` · dominant `#c6c0b6` · chroma peak `#111418`.

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
  --color-bg-primary: #c6c0b6;
  --color-bg-secondary: #aea598;
  --color-text-primary: #000000;
  --color-text-secondary: #71685d;
  --color-border-primary: #aea598;
  --color-primary: #111418;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
