---
title: design-tokens — geometric-grid-hud
description: Pixel-grounded token sheet for geometric-grid-hud (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `geometric-grid-hud`

Source still: `./geometric-grid-hud.png` · 1536×768 · PNG · polarity **light** (mean luma 148.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#bfbeb6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a19e97` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#393435` | max-contrast swatch vs bg-primary (6.56:1) | ✅ high |
| `--color-text-secondary` | `#8a8682` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bfbeb6` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#a19e97` | 15.1% | 0.062 | 158.1 |
| `#bfbeb6` | 11.1% | 0.047 | 189.6 |
| `#393435` | 9.9% | 0.088 | 53.1 |
| `#8a8682` | 9.2% | 0.058 | 134.6 |

Median `#a19d97` · dominant `#a19e97` · chroma peak `#393435`.

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
  --color-bg-primary: #bfbeb6;
  --color-bg-secondary: #a19e97;
  --color-text-primary: #393435;
  --color-text-secondary: #8a8682;
  --color-border-primary: #bfbeb6;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
