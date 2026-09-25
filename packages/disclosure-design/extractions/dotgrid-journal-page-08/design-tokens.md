---
title: design-tokens — dotgrid-journal-page-08
description: Pixel-grounded token sheet for dotgrid-journal-page-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dotgrid-journal-page-08`

Source still: `./dotgrid-journal-page-08.png` · 928×1232 · PNG · polarity **light** (mean luma 162.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dotgrid-journal-page](../dotgrid-journal-page/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d0ccba` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b9b7a6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#353733` | max-contrast swatch vs bg-primary (7.46:1) | ✅ high |
| `--color-text-secondary` | `#807f73` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b4b1a1` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d0ccba` | 13.6% | 0.106 | 203.6 |
| `#9c9a8c` | 13.6% | 0.103 | 153.4 |
| `#b9b7a6` | 12.7% | 0.103 | 182.2 |
| `#807f73` | 12.3% | 0.102 | 126.3 |
| `#353733` | 10.8% | 0.073 | 54.3 |

Median `#b4b1a1` · dominant `#d0ccba` · chroma peak `#d0ccba`.

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
  --color-bg-primary: #d0ccba;
  --color-bg-secondary: #b9b7a6;
  --color-text-primary: #353733;
  --color-text-secondary: #807f73;
  --color-border-primary: #b4b1a1;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
