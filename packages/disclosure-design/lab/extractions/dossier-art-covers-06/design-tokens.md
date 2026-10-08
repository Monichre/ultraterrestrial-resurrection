---
title: design-tokens — dossier-art-covers-06
description: Pixel-grounded token sheet for dossier-art-covers-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-06`

Source still: `./dossier-art-covers-06.png` · 928×1232 · PNG · polarity **dark** (mean luma 36.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0c0e0f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#171613` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#816f4e` | max-contrast swatch vs bg-primary (3.98:1) | ✅ high |
| `--color-text-secondary` | `#3d3424` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#171613` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#3d3424` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#261f18` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0c0e0f` | 16.1% | 0.2 | 13.6 |
| `#3d3424` | 14.2% | 0.41 | 52.8 |
| `#261f18` | 13.5% | 0.368 | 32.0 |
| `#816f4e` | 10.1% | 0.395 | 112.4 |

Median `#171613` · dominant `#0c0e0f` · chroma peak `#3d3424`.

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
  --color-bg-primary: #0c0e0f;
  --color-bg-secondary: #171613;
  --color-text-primary: #816f4e;
  --color-text-secondary: #3d3424;
  --color-border-primary: #171613;
  --color-primary: #3d3424;
  --chart-color-1: #261f18;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
