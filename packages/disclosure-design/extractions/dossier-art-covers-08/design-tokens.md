---
title: design-tokens — dossier-art-covers-08
description: Pixel-grounded token sheet for dossier-art-covers-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-08`

Source still: `./dossier-art-covers-08.png` · 896×1344 · PNG · polarity **light** (mean luma 120.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dadbd6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c4c1ba` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1b1d20` | max-contrast swatch vs bg-primary (12.13:1) | ✅ high |
| `--color-text-secondary` | `#5a5654` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#dadbd6` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1b1d20` | 16.0% | 0.156 | 28.8 |
| `#dadbd6` | 14.0% | 0.023 | 218.4 |
| `#c4c1ba` | 11.5% | 0.051 | 193.1 |
| `#9f9992` | 11.0% | 0.082 | 153.8 |
| `#5a5654` | 10.2% | 0.067 | 86.7 |

Median `#817a74` · dominant `#1b1d20` · chroma peak `#1b1d20`.

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
  --color-bg-primary: #dadbd6;
  --color-bg-secondary: #c4c1ba;
  --color-text-primary: #1b1d20;
  --color-text-secondary: #5a5654;
  --color-border-primary: #dadbd6;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
