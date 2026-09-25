---
title: design-tokens — astronaut-double-exposure
description: Pixel-grounded token sheet for astronaut-double-exposure (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `astronaut-double-exposure`

Source still: `./astronaut-double-exposure.png` · 1456×816 · PNG · polarity **light** (mean luma 206.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#fbe6b5` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#fdd67a` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c36739` | max-contrast swatch vs bg-primary (3.21:1) | ✅ high |
| `--color-text-secondary` | `#c36739` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#fbe6b5` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#c36739` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#fbe6b5` | 28.1% | 0.279 | 230.9 |
| `#fdd67a` | 16.0% | 0.518 | 215.6 |
| `#c36739` | 14.9% | 0.708 | 119.2 |

Median `#fbe6b5` · dominant `#fbe6b5` · chroma peak `#c36739`.

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
  --color-bg-primary: #fbe6b5;
  --color-bg-secondary: #fdd67a;
  --color-text-primary: #c36739;
  --color-text-secondary: #c36739;
  --color-border-primary: #fbe6b5;
  --color-primary: #c36739;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
