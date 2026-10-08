---
title: design-tokens — line-batch-pc26-04
description: Pixel-grounded token sheet for line-batch-pc26-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-pc26-04`

Source still: `./line-batch-pc26-04.png` · 1232×928 · PNG · polarity **dark** (mean luma 95.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-pc26](../line-batch-pc26/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#070a0d` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#504841` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b5ada3` | max-contrast swatch vs bg-primary (8.95:1) | ✅ high |
| `--color-text-secondary` | `#86796c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#504841` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#070a0d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#b5ada3` | 16.3% | 0.099 | 174.0 |
| `#070a0d` | 15.3% | 0.462 | 9.6 |
| `#95897c` | 14.7% | 0.168 | 138.6 |
| `#504841` | 5.9% | 0.188 | 73.2 |

Median `#86796c` · dominant `#b5ada3` · chroma peak `#070a0d`.

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
  --color-bg-primary: #070a0d;
  --color-bg-secondary: #504841;
  --color-text-primary: #b5ada3;
  --color-text-secondary: #86796c;
  --color-border-primary: #504841;
  --color-primary: #070a0d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
