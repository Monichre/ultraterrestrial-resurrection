---
title: design-tokens — hud-line-geometry-11
description: Pixel-grounded token sheet for hud-line-geometry-11 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-11`

Source still: `./hud-line-geometry-11.png` · 928×1232 · PNG · polarity **light** (mean luma 116.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d6caba` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c6b8a6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#161d25` | max-contrast swatch vs bg-primary (10.53:1) | ✅ high |
| `--color-text-secondary` | `#7d6e5b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d6caba` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#161d25` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#9c8d7a` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#161d25` | 22.3% | 0.405 | 28.1 |
| `#7d6e5b` | 16.1% | 0.272 | 111.8 |
| `#c6b8a6` | 14.9% | 0.162 | 185.7 |
| `#9c8d7a` | 12.8% | 0.218 | 142.8 |
| `#d6caba` | 11.7% | 0.131 | 203.4 |

Median `#8f806d` · dominant `#161d25` · chroma peak `#161d25`.

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
  --color-bg-primary: #d6caba;
  --color-bg-secondary: #c6b8a6;
  --color-text-primary: #161d25;
  --color-text-secondary: #7d6e5b;
  --color-border-primary: #d6caba;
  --color-primary: #161d25;
  --chart-color-1: #9c8d7a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
