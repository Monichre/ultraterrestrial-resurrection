---
title: design-tokens — crumpled-dotgrid-journal
description: Pixel-grounded token sheet for crumpled-dotgrid-journal (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `crumpled-dotgrid-journal`

Source still: `./crumpled-dotgrid-journal.png` · 1232×928 · PNG · polarity **light** (mean luma 123.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d9cbb8` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b8aa97` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1a1b1b` | max-contrast swatch vs bg-primary (10.84:1) | ✅ high |
| `--color-text-secondary` | `#71695c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d9cbb8` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1a1b1b` | 22.6% | 0.037 | 26.8 |
| `#b8aa97` | 14.3% | 0.179 | 171.6 |
| `#d9cbb8` | 14.2% | 0.152 | 204.6 |
| `#71695c` | 7.6% | 0.186 | 105.8 |

Median `#a79a87` · dominant `#1a1b1b` · chroma peak `#b8aa97`.

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
  --color-bg-primary: #d9cbb8;
  --color-bg-secondary: #b8aa97;
  --color-text-primary: #1a1b1b;
  --color-text-secondary: #71695c;
  --color-border-primary: #d9cbb8;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
