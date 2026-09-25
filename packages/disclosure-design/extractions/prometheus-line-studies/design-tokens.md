---
title: design-tokens — prometheus-line-studies
description: Pixel-grounded token sheet for prometheus-line-studies (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `prometheus-line-studies`

Source still: `./prometheus-line-studies.png` · 928×1232 · PNG · polarity **light** (mean luma 111.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#bdb297` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a49980` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#121618` | max-contrast swatch vs bg-primary (8.65:1) | ✅ high |
| `--color-text-secondary` | `#736858` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#988c74` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#121618` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#bdb297` | 14.6% | 0.201 | 178.4 |
| `#121618` | 13.6% | 0.25 | 21.3 |
| `#a49980` | 13.2% | 0.22 | 153.5 |
| `#2d2725` | 11.0% | 0.178 | 40.1 |
| `#736858` | 9.3% | 0.235 | 105.2 |

Median `#988c74` · dominant `#bdb297` · chroma peak `#121618`.

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
  --color-bg-primary: #bdb297;
  --color-bg-secondary: #a49980;
  --color-text-primary: #121618;
  --color-text-secondary: #736858;
  --color-border-primary: #988c74;
  --color-primary: #121618;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
