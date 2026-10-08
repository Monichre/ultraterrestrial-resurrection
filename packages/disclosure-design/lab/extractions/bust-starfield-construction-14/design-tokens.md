---
title: design-tokens — bust-starfield-construction-14
description: Pixel-grounded token sheet for bust-starfield-construction-14 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-14`

Source still: `./bust-starfield-construction-14.png` · 928×1232 · PNG · polarity **dark** (mean luma 84.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#13171d` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#31312e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#e2e2cd` | max-contrast swatch vs bg-primary (13.69:1) | ✅ high |
| `--color-text-secondary` | `#b3ac95` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#31312e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#13171d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#13171d` | 16.4% | 0.345 | 22.6 |
| `#e2e2cd` | 13.5% | 0.093 | 224.5 |
| `#41403d` | 12.8% | 0.062 | 64.0 |
| `#706c60` | 12.0% | 0.143 | 108.0 |
| `#b3ac95` | 11.1% | 0.168 | 171.8 |

Median `#31312e` · dominant `#13171d` · chroma peak `#13171d`.

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
  --color-bg-primary: #13171d;
  --color-bg-secondary: #31312e;
  --color-text-primary: #e2e2cd;
  --color-text-secondary: #b3ac95;
  --color-border-primary: #31312e;
  --color-primary: #13171d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
