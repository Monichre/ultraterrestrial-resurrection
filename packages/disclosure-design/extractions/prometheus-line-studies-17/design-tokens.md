---
title: design-tokens — prometheus-line-studies-17
description: Pixel-grounded token sheet for prometheus-line-studies-17 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-17`

Source still: `./prometheus-line-studies-17.png` · 928×1232 · PNG · polarity **dark** (mean luma 55.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#061018` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#15232a` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#a79e85` | max-contrast swatch vs bg-primary (7.19:1) | ✅ high |
| `--color-text-secondary` | `#616961` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#15232a` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#061018` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#1d2b31` | remaining saturated swatch, share order | ⚠️ medium |
| `--chart-color-2` | `#374446` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#616961` | 14.6% | 0.076 | 102.7 |
| `#061018` | 14.1% | 0.75 | 14.5 |
| `#1d2b31` | 13.0% | 0.408 | 40.5 |
| `#374446` | 11.4% | 0.214 | 65.4 |
| `#a79e85` | 10.9% | 0.204 | 158.1 |

Median `#15232a` · dominant `#616961` · chroma peak `#061018`.

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
  --color-bg-primary: #061018;
  --color-bg-secondary: #15232a;
  --color-text-primary: #a79e85;
  --color-text-secondary: #616961;
  --color-border-primary: #15232a;
  --color-primary: #061018;
  --chart-color-1: #1d2b31;
  --chart-color-2: #374446;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
