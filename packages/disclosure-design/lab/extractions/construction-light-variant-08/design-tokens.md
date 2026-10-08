---
title: design-tokens — construction-light-variant-08
description: Pixel-grounded token sheet for construction-light-variant-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `construction-light-variant-08`

Source still: `./construction-light-variant-08.png` · 1232×928 · PNG · polarity **light** (mean luma 169.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [construction-light-variant](../construction-light-variant/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c6c7c3` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c5c7c3` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#38454c` | max-contrast swatch vs bg-primary (5.82:1) | ✅ high |
| `--color-text-secondary` | `#38454c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c6c7c3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#38454c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c6c7c3` | 22.4% | 0.02 | 198.5 |
| `#38454c` | 16.4% | 0.263 | 66.7 |

Median `#c5c7c3` · dominant `#c6c7c3` · chroma peak `#38454c`.

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
  --color-bg-primary: #c6c7c3;
  --color-bg-secondary: #c5c7c3;
  --color-text-primary: #38454c;
  --color-text-secondary: #38454c;
  --color-border-primary: #c6c7c3;
  --color-primary: #38454c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
