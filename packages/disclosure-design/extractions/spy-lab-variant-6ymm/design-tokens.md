---
title: design-tokens — spy-lab-variant-6ymm
description: Pixel-grounded token sheet for spy-lab-variant-6ymm (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `spy-lab-variant-6ymm`

Source still: `./spy-lab-variant-6ymm.png` · 928×1232 · PNG · polarity **dark** (mean luma 70.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#000000` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#141414` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#e2d6b6` | max-contrast swatch vs bg-primary (14.53:1) | ✅ high |
| `--color-text-secondary` | `#978a75` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#000000` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#3a3732` | 18.2% | 0.138 | 55.3 |
| `#e2d6b6` | 13.4% | 0.195 | 214.2 |
| `#000000` | 12.8% | 0.0 | 0.0 |
| `#141414` | 11.3% | 0.0 | 20.0 |
| `#978a75` | 11.1% | 0.225 | 139.2 |

Median `#37342f` · dominant `#3a3732` · chroma peak `#978a75`.

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
  --color-bg-primary: #000000;
  --color-bg-secondary: #141414;
  --color-text-primary: #e2d6b6;
  --color-text-secondary: #978a75;
  --color-border-primary: #000000;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
