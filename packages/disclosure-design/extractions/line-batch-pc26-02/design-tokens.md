---
title: design-tokens — line-batch-pc26-02
description: Pixel-grounded token sheet for line-batch-pc26-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-pc26-02`

Source still: `./line-batch-pc26-02.png` · 1232×928 · PNG · polarity **light** (mean luma 113.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-pc26](../line-batch-pc26/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cec1ae` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a29787` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000306` | max-contrast swatch vs bg-primary (11.68:1) | ✅ high |
| `--color-text-secondary` | `#393733` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#918677` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000306` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000306` | 15.2% | 1.0 | 2.6 |
| `#cec1ae` | 13.6% | 0.155 | 194.4 |
| `#a29787` | 12.2% | 0.167 | 152.2 |
| `#766d61` | 11.8% | 0.178 | 110.0 |
| `#393733` | 10.4% | 0.105 | 55.1 |

Median `#918677` · dominant `#000306` · chroma peak `#000306`.

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
  --color-bg-primary: #cec1ae;
  --color-bg-secondary: #a29787;
  --color-text-primary: #000306;
  --color-text-secondary: #393733;
  --color-border-primary: #918677;
  --color-primary: #000306;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
