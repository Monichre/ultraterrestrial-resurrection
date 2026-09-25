---
title: design-tokens — ethereal-quote-landing
description: Pixel-grounded token sheet for ethereal-quote-landing (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `ethereal-quote-landing`

Source still: `./ethereal-quote-landing.png` · 1024×1024 · PNG · polarity **light** (mean luma 165.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#deded6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#d3d2cc` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#2d2e31` | max-contrast swatch vs bg-primary (10.04:1) | ✅ high |
| `--color-text-secondary` | `#9e9d99` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d3d2cc` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#2d2e31` | 24.0% | 0.082 | 46.0 |
| `#deded6` | 18.6% | 0.036 | 221.4 |
| `#c7c6c0` | 13.6% | 0.035 | 197.8 |
| `#9e9d99` | 10.8% | 0.032 | 156.9 |

Median `#d3d2cc` · dominant `#2d2e31` · chroma peak `#2d2e31`.

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
  --color-bg-primary: #deded6;
  --color-bg-secondary: #d3d2cc;
  --color-text-primary: #2d2e31;
  --color-text-secondary: #9e9d99;
  --color-border-primary: #d3d2cc;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
