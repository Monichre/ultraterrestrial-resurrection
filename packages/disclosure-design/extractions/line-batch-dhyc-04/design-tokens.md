---
title: design-tokens — line-batch-dhyc-04
description: Pixel-grounded token sheet for line-batch-dhyc-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `line-batch-dhyc-04`

Source still: `./line-batch-dhyc-04.png` · 1232×928 · PNG · polarity **light** (mean luma 145.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [line-batch-dhyc](../line-batch-dhyc/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d8d4cd` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bcafa2` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#010101` | max-contrast swatch vs bg-primary (14.13:1) | ✅ high |
| `--color-text-secondary` | `#8f7a6c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b5a496` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |
| `--chart-color-1` | `#aa9888` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#010101` | 14.4% | 0.0 | 1.0 |
| `#aa9888` | 14.2% | 0.2 | 154.7 |
| `#8f7a6c` | 13.1% | 0.245 | 125.5 |
| `#d8d4cd` | 13.0% | 0.051 | 212.3 |
| `#bcafa2` | 12.1% | 0.138 | 176.8 |

Median `#b5a496` · dominant `#010101` · chroma peak `#8f7a6c`.

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
  --color-bg-primary: #d8d4cd;
  --color-bg-secondary: #bcafa2;
  --color-text-primary: #010101;
  --color-text-secondary: #8f7a6c;
  --color-border-primary: #b5a496;
  --chart-color-1: #aa9888;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
