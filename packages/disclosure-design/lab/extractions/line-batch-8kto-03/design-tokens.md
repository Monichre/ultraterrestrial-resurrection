---
title: design-tokens — line-batch-8kto-03
description: Pixel-grounded token sheet for line-batch-8kto-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-8kto-03`

Source still: `./line-batch-8kto-03.png` · 928×1232 · PNG · polarity **light** (mean luma 120.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-8kto](../line-batch-8kto/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#bdbbbb` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#979597` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#504641` | max-contrast swatch vs bg-primary (4.79:1) | ✅ high |
| `--color-text-secondary` | `#997550` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bdbbbb` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#997550` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#838386` | 18.9% | 0.022 | 131.2 |
| `#979597` | 18.9% | 0.013 | 149.6 |
| `#504641` | 15.8% | 0.188 | 71.8 |
| `#997550` | 13.0% | 0.477 | 122.0 |
| `#bdbbbb` | 8.7% | 0.011 | 187.4 |

Median `#887f7e` · dominant `#838386` · chroma peak `#997550`.

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
  --color-bg-primary: #bdbbbb;
  --color-bg-secondary: #979597;
  --color-text-primary: #504641;
  --color-text-secondary: #997550;
  --color-border-primary: #bdbbbb;
  --color-primary: #997550;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
