---
title: design-tokens — line-batch-dhyc-03
description: Pixel-grounded token sheet for line-batch-dhyc-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-dhyc-03`

Source still: `./line-batch-dhyc-03.png` · 1232×928 · PNG · polarity **light** (mean luma 124.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-dhyc](../line-batch-dhyc/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e6d9c3` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#d2c2ab` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#17181c` | max-contrast swatch vs bg-primary (12.74:1) | ✅ high |
| `--color-text-secondary` | `#9c8773` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#e6d9c3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |
| `--chart-color-1` | `#a69380` | remaining saturated swatch, share order | ⚠️ medium |
| `--chart-color-2` | `#bcaa95` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#17181c` | 14.3% | 0.179 | 24.1 |
| `#a69380` | 13.8% | 0.229 | 149.7 |
| `#d2c2ab` | 13.3% | 0.186 | 195.7 |
| `#bcaa95` | 12.2% | 0.207 | 172.3 |
| `#e6d9c3` | 12.2% | 0.152 | 218.2 |

Median `#9c8773` · dominant `#17181c` · chroma peak `#a69380`.

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
  --color-bg-primary: #e6d9c3;
  --color-bg-secondary: #d2c2ab;
  --color-text-primary: #17181c;
  --color-text-secondary: #9c8773;
  --color-border-primary: #e6d9c3;
  --chart-color-1: #a69380;
  --chart-color-2: #bcaa95;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
