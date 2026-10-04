---
title: design-tokens — prometheus-line-studies-16
description: Pixel-grounded token sheet for prometheus-line-studies-16 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-16`

Source still: `./prometheus-line-studies-16.png` · 928×1232 · PNG · polarity **dark** (mean luma 48.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#181715` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1b1917` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b39f84` | max-contrast swatch vs bg-primary (7.0:1) | ✅ high |
| `--color-text-secondary` | `#4a423a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#1b1917` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#b39f84` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#181715` | 16.5% | 0.125 | 23.1 |
| `#4a423a` | 12.7% | 0.216 | 67.1 |
| `#b39f84` | 11.3% | 0.263 | 161.3 |

Median `#1b1917` · dominant `#181715` · chroma peak `#b39f84`.

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
  --color-bg-primary: #181715;
  --color-bg-secondary: #1b1917;
  --color-text-primary: #b39f84;
  --color-text-secondary: #4a423a;
  --color-border-primary: #1b1917;
  --color-primary: #b39f84;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
