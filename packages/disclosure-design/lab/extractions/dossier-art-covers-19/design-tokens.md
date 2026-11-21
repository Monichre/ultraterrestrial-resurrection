---
title: design-tokens — dossier-art-covers-19
description: Pixel-grounded token sheet for dossier-art-covers-19 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-19`

Source still: `./dossier-art-covers-19.png` · 896×1344 · PNG · polarity **light** (mean luma 165.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e1d7be` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c8c1b0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#2b2d30` | max-contrast swatch vs bg-primary (9.64:1) | ✅ high |
| `--color-text-secondary` | `#5d5b5d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c8c1b0` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#e1d7be` | 14.9% | 0.156 | 215.3 |
| `#2b2d30` | 13.9% | 0.104 | 44.8 |
| `#bbb6a8` | 13.0% | 0.102 | 182.1 |
| `#9d9a93` | 11.2% | 0.064 | 154.1 |
| `#5d5b5d` | 10.2% | 0.022 | 91.6 |

Median `#c8c1b0` · dominant `#e1d7be` · chroma peak `#e1d7be`.

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
  --color-bg-primary: #e1d7be;
  --color-bg-secondary: #c8c1b0;
  --color-text-primary: #2b2d30;
  --color-text-secondary: #5d5b5d;
  --color-border-primary: #c8c1b0;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
