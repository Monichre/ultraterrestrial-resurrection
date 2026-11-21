---
title: design-tokens — ruined-face-pyramid-03
description: Pixel-grounded token sheet for ruined-face-pyramid-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `ruined-face-pyramid-03`

Source still: `./ruined-face-pyramid-03.png` · 1680×720 · PNG · polarity **dark** (mean luma 48.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [ruined-face-pyramid](../ruined-face-pyramid/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#19120b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#282918` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#58822d` | max-contrast swatch vs bg-primary (4.1:1) | ✅ high |
| `--color-text-secondary` | `#4e4c27` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#282918` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#58822d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#26341e` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#26341e` | 16.8% | 0.423 | 47.4 |
| `#19120b` | 13.9% | 0.56 | 19.0 |
| `#4e4c27` | 13.5% | 0.5 | 73.8 |
| `#58822d` | 9.2% | 0.654 | 114.9 |

Median `#282918` · dominant `#26341e` · chroma peak `#58822d`.

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
  --color-bg-primary: #19120b;
  --color-bg-secondary: #282918;
  --color-text-primary: #58822d;
  --color-text-secondary: #4e4c27;
  --color-border-primary: #282918;
  --color-primary: #58822d;
  --chart-color-1: #26341e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
