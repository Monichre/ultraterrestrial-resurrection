---
title: design-tokens — ethereal-cosmic-background-02
description: Pixel-grounded token sheet for ethereal-cosmic-background-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `ethereal-cosmic-background-02`

Source still: `./ethereal-cosmic-background-02.png` · 1232×928 · PNG · polarity **dark** (mean luma 29.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [ethereal-cosmic-background](../ethereal-cosmic-background/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0d0e0e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0e100f` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#5d6258` | max-contrast swatch vs bg-primary (3.09:1) | ✅ high |
| `--color-text-secondary` | `#252b29` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0e100f` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0d0e0e` | 16.7% | 0.071 | 13.8 |
| `#252b29` | 14.6% | 0.14 | 41.6 |
| `#5d6258` | 10.1% | 0.102 | 96.2 |

Median `#0e100f` · dominant `#0d0e0e` · chroma peak `#252b29`.

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
  --color-bg-primary: #0d0e0e;
  --color-bg-secondary: #0e100f;
  --color-text-primary: #5d6258;
  --color-text-secondary: #252b29;
  --color-border-primary: #0e100f;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
