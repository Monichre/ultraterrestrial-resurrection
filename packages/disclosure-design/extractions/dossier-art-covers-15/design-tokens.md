---
title: design-tokens — dossier-art-covers-15
description: Pixel-grounded token sheet for dossier-art-covers-15 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-15`

Source still: `./dossier-art-covers-15.png` · 1536×1024 · PNG · polarity **dark** (mean luma 41.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#000202` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#241e12` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8b7859` | max-contrast swatch vs bg-primary (4.88:1) | ✅ high |
| `--color-text-secondary` | `#615238` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#241e12` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000202` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#433825` | remaining saturated swatch, share order | ⚠️ medium |
| `--chart-color-2` | `#2d2618` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000202` | 19.0% | 1.0 | 1.6 |
| `#433825` | 13.4% | 0.448 | 57.0 |
| `#615238` | 13.0% | 0.423 | 83.3 |
| `#8b7859` | 12.0% | 0.36 | 121.8 |
| `#2d2618` | 11.5% | 0.467 | 38.5 |

Median `#241e12` · dominant `#000202` · chroma peak `#000202`.

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
  --color-bg-primary: #000202;
  --color-bg-secondary: #241e12;
  --color-text-primary: #8b7859;
  --color-text-secondary: #615238;
  --color-border-primary: #241e12;
  --color-primary: #000202;
  --chart-color-1: #433825;
  --chart-color-2: #2d2618;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
