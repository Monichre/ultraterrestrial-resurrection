---
title: design-tokens — prometheus-line-studies-04
description: Pixel-grounded token sheet for prometheus-line-studies-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-04`

Source still: `./prometheus-line-studies-04.png` · 928×1232 · PNG · polarity **light** (mean luma 125.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c1c1c1` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#ababac` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#12171c` | max-contrast swatch vs bg-primary (10.01:1) | ✅ high |
| `--color-text-secondary` | `#767777` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c1c1c1` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#12171c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c1c1c1` | 13.5% | 0.0 | 193.0 |
| `#767777` | 13.3% | 0.008 | 118.8 |
| `#12171c` | 12.7% | 0.357 | 22.3 |
| `#ababac` | 12.4% | 0.006 | 171.1 |
| `#303336` | 12.3% | 0.111 | 50.6 |

Median `#848585` · dominant `#c1c1c1` · chroma peak `#12171c`.

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
  --color-bg-primary: #c1c1c1;
  --color-bg-secondary: #ababac;
  --color-text-primary: #12171c;
  --color-text-secondary: #767777;
  --color-border-primary: #c1c1c1;
  --color-primary: #12171c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
