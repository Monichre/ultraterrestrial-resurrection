---
title: design-tokens — ruined-face-pyramid
description: Pixel-grounded token sheet for ruined-face-pyramid (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `ruined-face-pyramid`

Source still: `./ruined-face-pyramid.png` · 1680×720 · PNG · polarity **dark** (mean luma 65.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#041817` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#312c1e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#a19d69` | max-contrast swatch vs bg-primary (6.57:1) | ✅ high |
| `--color-text-secondary` | `#624c2e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#1e3a28` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#041817` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#164731` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#164731` | 18.0% | 0.69 | 59.0 |
| `#041817` | 15.1% | 0.833 | 19.7 |
| `#a19d69` | 12.0% | 0.348 | 154.1 |
| `#312c1e` | 10.4% | 0.388 | 44.1 |
| `#624c2e` | 10.2% | 0.531 | 78.5 |

Median `#1e3a28` · dominant `#164731` · chroma peak `#041817`.

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
  --color-bg-primary: #041817;
  --color-bg-secondary: #312c1e;
  --color-text-primary: #a19d69;
  --color-text-secondary: #624c2e;
  --color-border-primary: #1e3a28;
  --color-primary: #041817;
  --chart-color-1: #164731;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
