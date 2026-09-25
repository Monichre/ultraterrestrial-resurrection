---
title: design-tokens — prometheus-line-studies-14
description: Pixel-grounded token sheet for prometheus-line-studies-14 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-14`

Source still: `./prometheus-line-studies-14.png` · 928×1232 · PNG · polarity **dark** (mean luma 56.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0a0d14` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#25282c` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8b8c8b` | max-contrast swatch vs bg-primary (5.76:1) | ✅ high |
| `--color-text-secondary` | `#5c5c5c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#25282c` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0a0d14` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0a0d14` | 17.6% | 0.5 | 12.9 |
| `#737373` | 13.9% | 0.0 | 115.0 |
| `#8b8c8b` | 12.4% | 0.007 | 139.7 |
| `#393a3b` | 11.9% | 0.034 | 57.9 |
| `#5c5c5c` | 11.8% | 0.0 | 92.0 |

Median `#25282c` · dominant `#0a0d14` · chroma peak `#0a0d14`.

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
  --color-bg-primary: #0a0d14;
  --color-bg-secondary: #25282c;
  --color-text-primary: #8b8c8b;
  --color-text-secondary: #5c5c5c;
  --color-border-primary: #25282c;
  --color-primary: #0a0d14;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
