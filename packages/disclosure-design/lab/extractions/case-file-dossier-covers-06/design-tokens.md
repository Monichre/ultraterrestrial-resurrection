---
title: design-tokens — case-file-dossier-covers-06
description: Pixel-grounded token sheet for case-file-dossier-covers-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `case-file-dossier-covers-06`

Source still: `./case-file-dossier-covers-06.png` · 928×1232 · PNG · polarity **light** (mean luma 132.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [case-file-dossier-covers](../case-file-dossier-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c2b8a5` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a9a18e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#131413` | max-contrast swatch vs bg-primary (9.4:1) | ✅ high |
| `--color-text-secondary` | `#6a6257` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#a9a18e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c2b8a5` | 14.5% | 0.149 | 184.8 |
| `#9a9180` | 14.2% | 0.169 | 145.7 |
| `#2e2d2a` | 13.6% | 0.087 | 45.0 |
| `#131413` | 13.2% | 0.05 | 19.7 |
| `#6a6257` | 7.6% | 0.179 | 98.9 |

Median `#a9a18e` · dominant `#c2b8a5` · chroma peak `#9a9180`.

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
  --color-bg-primary: #c2b8a5;
  --color-bg-secondary: #a9a18e;
  --color-text-primary: #131413;
  --color-text-secondary: #6a6257;
  --color-border-primary: #a9a18e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
