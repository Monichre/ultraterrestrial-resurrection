---
title: design-tokens — martian-pyramid-interior-03
description: Pixel-grounded token sheet for martian-pyramid-interior-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `martian-pyramid-interior-03`

Source still: `./martian-pyramid-interior-03.png` · 1344×896 · PNG · polarity **dark** (mean luma 39.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [martian-pyramid-interior](../martian-pyramid-interior/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#1a0b0a` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#211613` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8f8f85` | max-contrast swatch vs bg-primary (5.87:1) | ✅ high |
| `--color-text-secondary` | `#403832` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#211613` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#1a0b0a` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#3c1e18` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#3c1e18` | 14.4% | 0.6 | 35.9 |
| `#1a0b0a` | 14.0% | 0.615 | 14.1 |
| `#403832` | 11.8% | 0.219 | 57.3 |
| `#8f8f85` | 10.0% | 0.07 | 142.3 |

Median `#211613` · dominant `#3c1e18` · chroma peak `#1a0b0a`.

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
  --color-bg-primary: #1a0b0a;
  --color-bg-secondary: #211613;
  --color-text-primary: #8f8f85;
  --color-text-secondary: #403832;
  --color-border-primary: #211613;
  --color-primary: #1a0b0a;
  --chart-color-1: #3c1e18;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
