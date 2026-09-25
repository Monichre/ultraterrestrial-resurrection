---
title: design-tokens — dossier-art-covers-17
description: Pixel-grounded token sheet for dossier-art-covers-17 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-17`

Source still: `./dossier-art-covers-17.png` · 896×1344 · PNG · polarity **light** (mean luma 162.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e0dbc7` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#ccc7b9` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1d1e1f` | max-contrast swatch vs bg-primary (12.03:1) | ✅ high |
| `--color-text-secondary` | `#5b5e5e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c5c1b5` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e0dbc7` | 14.6% | 0.112 | 218.6 |
| `#969793` | 13.9% | 0.026 | 150.5 |
| `#1d1e1f` | 13.8% | 0.065 | 29.9 |
| `#ccc7b9` | 12.9% | 0.093 | 199.1 |
| `#5b5e5e` | 8.6% | 0.032 | 93.4 |

Median `#c5c1b5` · dominant `#e0dbc7` · chroma peak `#e0dbc7`.

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
  --color-bg-primary: #e0dbc7;
  --color-bg-secondary: #ccc7b9;
  --color-text-primary: #1d1e1f;
  --color-text-secondary: #5b5e5e;
  --color-border-primary: #c5c1b5;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
