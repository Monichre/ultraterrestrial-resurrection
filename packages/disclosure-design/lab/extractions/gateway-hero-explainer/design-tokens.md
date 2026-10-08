---
title: design-tokens — gateway-hero-explainer
description: Pixel-grounded token sheet for gateway-hero-explainer (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `gateway-hero-explainer`

Source still: `./gateway-hero-explainer.png` · 2160×3240 · PNG · polarity **dark** (mean luma 20.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#030404` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0b0e0d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#42433d` | max-contrast swatch vs bg-primary (2.05:1) | ✅ high |
| `--color-text-secondary` | `#171715` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0b0e0d` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#030404` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#171715` | 16.1% | 0.087 | 22.9 |
| `#42433d` | 11.2% | 0.09 | 66.4 |
| `#030404` | 9.8% | 0.25 | 3.8 |

Median `#0b0e0d` · dominant `#171715` · chroma peak `#030404`.

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
  --color-bg-primary: #030404;
  --color-bg-secondary: #0b0e0d;
  --color-text-primary: #42433d;
  --color-text-secondary: #171715;
  --color-border-primary: #0b0e0d;
  --color-primary: #030404;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
