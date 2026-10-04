---
title: design-tokens — hud-line-geometry-12
description: Pixel-grounded token sheet for hud-line-geometry-12 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-12`

Source still: `./hud-line-geometry-12.png` · 928×1232 · PNG · polarity **light** (mean luma 163.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d7cab5` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cdbda7` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#10171b` | max-contrast swatch vs bg-primary (11.21:1) | ✅ high |
| `--color-text-secondary` | `#736b5e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cdbda7` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#10171b` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#beab92` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d7cab5` | 16.9% | 0.158 | 203.2 |
| `#10171b` | 12.7% | 0.407 | 21.8 |
| `#beab92` | 11.2% | 0.232 | 173.2 |
| `#736b5e` | 9.8% | 0.183 | 107.8 |

Median `#cdbda7` · dominant `#d7cab5` · chroma peak `#10171b`.

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
  --color-bg-primary: #d7cab5;
  --color-bg-secondary: #cdbda7;
  --color-text-primary: #10171b;
  --color-text-secondary: #736b5e;
  --color-border-primary: #cdbda7;
  --color-primary: #10171b;
  --chart-color-1: #beab92;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
