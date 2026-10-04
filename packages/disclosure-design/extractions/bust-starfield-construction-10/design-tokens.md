---
title: design-tokens — bust-starfield-construction-10
description: Pixel-grounded token sheet for bust-starfield-construction-10 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-10`

Source still: `./bust-starfield-construction-10.png` · 928×1232 · PNG · polarity **dark** (mean luma 59.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#101216` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#24262d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#9ea4a2` | max-contrast swatch vs bg-primary (7.4:1) | ✅ high |
| `--color-text-secondary` | `#5f697a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#24262d` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#101216` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#454c5a` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#101216` | 15.5% | 0.273 | 17.9 |
| `#5f697a` | 14.6% | 0.221 | 104.1 |
| `#2d2f38` | 12.6% | 0.196 | 47.2 |
| `#454c5a` | 12.1% | 0.233 | 75.5 |
| `#9ea4a2` | 10.8% | 0.037 | 162.6 |

Median `#24262d` · dominant `#101216` · chroma peak `#101216`.

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
  --color-bg-primary: #101216;
  --color-bg-secondary: #24262d;
  --color-text-primary: #9ea4a2;
  --color-text-secondary: #5f697a;
  --color-border-primary: #24262d;
  --color-primary: #101216;
  --chart-color-1: #454c5a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
