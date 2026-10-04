---
title: design-tokens — dotgrid-journal-page-05
description: Pixel-grounded token sheet for dotgrid-journal-page-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dotgrid-journal-page-05`

Source still: `./dotgrid-journal-page-05.png` · 928×1232 · PNG · polarity **light** (mean luma 147.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dotgrid-journal-page](../dotgrid-journal-page/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e1dfd4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cec9bb` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#030709` | max-contrast swatch vs bg-primary (15.13:1) | ✅ high |
| `--color-text-secondary` | `#675e51` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cec9bb` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#030709` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e1dfd4` | 25.8% | 0.058 | 222.6 |
| `#030709` | 15.8% | 0.667 | 6.3 |
| `#bbb4a5` | 12.7% | 0.118 | 180.4 |
| `#675e51` | 8.9% | 0.214 | 95.0 |

Median `#cec9bb` · dominant `#e1dfd4` · chroma peak `#030709`.

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
  --color-bg-primary: #e1dfd4;
  --color-bg-secondary: #cec9bb;
  --color-text-primary: #030709;
  --color-text-secondary: #675e51;
  --color-border-primary: #cec9bb;
  --color-primary: #030709;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
