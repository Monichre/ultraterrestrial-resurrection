---
title: design-tokens — bust-starfield-construction-17
description: Pixel-grounded token sheet for bust-starfield-construction-17 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-17`

Source still: `./bust-starfield-construction-17.png` · 928×1232 · PNG · polarity **dark** (mean luma 59.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#111616` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1c2120` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b9aa8d` | max-contrast swatch vs bg-primary (8.0:1) | ✅ high |
| `--color-text-secondary` | `#766d58` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#1c2120` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#766d58` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#111616` | 14.7% | 0.227 | 20.9 |
| `#766d58` | 13.1% | 0.254 | 109.4 |
| `#b9aa8d` | 11.8% | 0.238 | 171.1 |
| `#3d3d35` | 11.2% | 0.131 | 60.4 |

Median `#1c2120` · dominant `#111616` · chroma peak `#766d58`.

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
  --color-bg-primary: #111616;
  --color-bg-secondary: #1c2120;
  --color-text-primary: #b9aa8d;
  --color-text-secondary: #766d58;
  --color-border-primary: #1c2120;
  --color-primary: #766d58;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
