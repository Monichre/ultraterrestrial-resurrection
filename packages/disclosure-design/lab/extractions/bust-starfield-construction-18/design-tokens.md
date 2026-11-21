---
title: design-tokens — bust-starfield-construction-18
description: Pixel-grounded token sheet for bust-starfield-construction-18 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-18`

Source still: `./bust-starfield-construction-18.png` · 928×1232 · PNG · polarity **dark** (mean luma 75.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#171d1f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#262b2b` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#cec0a5` | max-contrast swatch vs bg-primary (9.5:1) | ✅ high |
| `--color-text-secondary` | `#a79b84` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#262b2b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#171d1f` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#171d1f` | 16.2% | 0.258 | 27.9 |
| `#cec0a5` | 15.7% | 0.199 | 193.0 |
| `#2d3130` | 13.7% | 0.082 | 48.1 |
| `#52504a` | 10.8% | 0.098 | 80.0 |
| `#a79b84` | 9.4% | 0.21 | 155.9 |

Median `#262b2b` · dominant `#171d1f` · chroma peak `#171d1f`.

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
  --color-bg-primary: #171d1f;
  --color-bg-secondary: #262b2b;
  --color-text-primary: #cec0a5;
  --color-text-secondary: #a79b84;
  --color-border-primary: #262b2b;
  --color-primary: #171d1f;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
