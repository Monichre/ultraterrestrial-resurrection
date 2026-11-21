---
title: design-tokens — bust-starfield-construction-08
description: Pixel-grounded token sheet for bust-starfield-construction-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-08`

Source still: `./bust-starfield-construction-08.png` · 928×1232 · PNG · polarity **dark** (mean luma 51.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#13181c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1f252b` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8b8a88` | max-contrast swatch vs bg-primary (5.18:1) | ✅ high |
| `--color-text-secondary` | `#434b55` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#1f252b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#13181c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#2d353d` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#434b55` | 15.1% | 0.212 | 74.0 |
| `#13181c` | 13.7% | 0.321 | 23.2 |
| `#2d353d` | 13.4% | 0.262 | 51.9 |
| `#8b8a88` | 9.7% | 0.022 | 138.1 |

Median `#1f252b` · dominant `#434b55` · chroma peak `#13181c`.

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
  --color-bg-primary: #13181c;
  --color-bg-secondary: #1f252b;
  --color-text-primary: #8b8a88;
  --color-text-secondary: #434b55;
  --color-border-primary: #1f252b;
  --color-primary: #13181c;
  --chart-color-1: #2d353d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
