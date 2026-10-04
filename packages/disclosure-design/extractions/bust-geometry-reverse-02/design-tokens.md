---
title: design-tokens — bust-geometry-reverse-02
description: Pixel-grounded token sheet for bust-geometry-reverse-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-geometry-reverse-02`

Source still: `./bust-geometry-reverse-02.png` · 928×1232 · PNG · polarity **dark** (mean luma 49.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-geometry-reverse](../bust-geometry-reverse/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#070b0e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#101315` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b7ae9d` | max-contrast swatch vs bg-primary (8.99:1) | ✅ high |
| `--color-text-secondary` | `#797066` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#101315` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#070b0e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#070b0e` | 16.3% | 0.5 | 10.4 |
| `#b7ae9d` | 14.9% | 0.142 | 174.7 |
| `#2f2d2d` | 12.4% | 0.043 | 45.4 |
| `#797066` | 8.6% | 0.157 | 113.2 |

Median `#101315` · dominant `#070b0e` · chroma peak `#070b0e`.

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
  --color-bg-primary: #070b0e;
  --color-bg-secondary: #101315;
  --color-text-primary: #b7ae9d;
  --color-text-secondary: #797066;
  --color-border-primary: #101315;
  --color-primary: #070b0e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
