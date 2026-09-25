---
title: design-tokens — hud-reverse-batch
description: Pixel-grounded token sheet for hud-reverse-batch (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `hud-reverse-batch`

Source still: `./hud-reverse-batch.png` · 1232×928 · PNG · polarity **light** (mean luma 128.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#daccb6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c5b6a0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0c0c0c` | max-contrast swatch vs bg-primary (12.38:1) | ✅ high |
| `--color-text-secondary` | `#3f332c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bbac97` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#3f332c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#a7917b` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0c0c0c` | 16.2% | 0.0 | 12.0 |
| `#daccb6` | 15.6% | 0.165 | 205.4 |
| `#c5b6a0` | 13.2% | 0.188 | 183.6 |
| `#a7917b` | 11.7% | 0.263 | 148.1 |
| `#3f332c` | 6.4% | 0.302 | 53.0 |

Median `#bbac97` · dominant `#0c0c0c` · chroma peak `#a7917b`.

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
  --color-bg-primary: #daccb6;
  --color-bg-secondary: #c5b6a0;
  --color-text-primary: #0c0c0c;
  --color-text-secondary: #3f332c;
  --color-border-primary: #bbac97;
  --color-primary: #3f332c;
  --chart-color-1: #a7917b;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
