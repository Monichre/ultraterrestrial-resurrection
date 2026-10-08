---
title: design-tokens — ethereal-cosmic-background
description: Pixel-grounded token sheet for ethereal-cosmic-background (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `ethereal-cosmic-background`

Source still: `./ethereal-cosmic-background.png` · 1232×928 · PNG · polarity **dark** (mean luma 22.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#090b0a` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#090b0b` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#3b3f3a` | max-contrast swatch vs bg-primary (1.84:1) | ✅ high |
| `--color-text-secondary` | `#3b3f3a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#090b0a` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#090b0a` | 31.7% | 0.182 | 10.5 |
| `#3b3f3a` | 14.9% | 0.079 | 61.8 |

Median `#090b0b` · dominant `#090b0a` · chroma peak `#090b0a`.

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
  --color-bg-primary: #090b0a;
  --color-bg-secondary: #090b0b;
  --color-text-primary: #3b3f3a;
  --color-text-secondary: #3b3f3a;
  --color-border-primary: #090b0a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
