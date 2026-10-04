---
title: design-tokens — merciful-split-page
description: Pixel-grounded token sheet for merciful-split-page (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `merciful-split-page`

Source still: `./merciful-split-page.png` · 1856×2464 · PNG · polarity **light** (mean luma 116.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c3baaa` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a7a092` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#191817` | max-contrast swatch vs bg-primary (9.22:1) | ✅ high |
| `--color-text-secondary` | `#666259` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#908a7e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c3baaa` | 14.1% | 0.128 | 186.8 |
| `#191817` | 13.9% | 0.08 | 24.1 |
| `#2d2b29` | 11.6% | 0.089 | 43.3 |
| `#a7a092` | 11.3% | 0.126 | 160.5 |
| `#666259` | 9.3% | 0.127 | 98.2 |

Median `#908a7e` · dominant `#c3baaa` · chroma peak `#c3baaa`.

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
  --color-bg-primary: #c3baaa;
  --color-bg-secondary: #a7a092;
  --color-text-primary: #191817;
  --color-text-secondary: #666259;
  --color-border-primary: #908a7e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
