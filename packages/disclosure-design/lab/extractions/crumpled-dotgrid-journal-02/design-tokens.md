---
title: design-tokens — crumpled-dotgrid-journal-02
description: Pixel-grounded token sheet for crumpled-dotgrid-journal-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `crumpled-dotgrid-journal-02`

Source still: `./crumpled-dotgrid-journal-02.png` · 1232×928 · PNG · polarity **light** (mean luma 111.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [crumpled-dotgrid-journal](../crumpled-dotgrid-journal/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d2c7b2` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#9d9281` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1a1b19` | max-contrast swatch vs bg-primary (10.33:1) | ✅ high |
| `--color-text-secondary` | `#676158` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d2c7b2` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1a1b19` | 14.8% | 0.074 | 26.6 |
| `#d2c7b2` | 14.5% | 0.152 | 199.8 |
| `#423f39` | 11.0% | 0.136 | 63.2 |
| `#9d9281` | 7.8% | 0.178 | 147.1 |

Median `#676158` · dominant `#1a1b19` · chroma peak `#d2c7b2`.

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
  --color-bg-primary: #d2c7b2;
  --color-bg-secondary: #9d9281;
  --color-text-primary: #1a1b19;
  --color-text-secondary: #676158;
  --color-border-primary: #d2c7b2;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
