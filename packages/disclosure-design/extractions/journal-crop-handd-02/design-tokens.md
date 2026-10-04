---
title: design-tokens — journal-crop-handd-02
description: Pixel-grounded token sheet for journal-crop-handd-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `journal-crop-handd-02`

Source still: `./journal-crop-handd-02.png` · 2464×1856 · PNG · polarity **light** (mean luma 145.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [journal-crop-handd](../journal-crop-handd/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d0c1a5` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b5a890` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#161515` | max-contrast swatch vs bg-primary (10.29:1) | ✅ high |
| `--color-text-secondary` | `#5d564b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b5a890` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |
| `--chart-color-1` | `#ada08a` | remaining saturated swatch, share order | ⚠️ medium |
| `--chart-color-2` | `#958a77` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#161515` | 14.1% | 0.045 | 21.2 |
| `#d0c1a5` | 14.1% | 0.207 | 194.2 |
| `#ada08a` | 14.0% | 0.202 | 161.2 |
| `#958a77` | 13.1% | 0.201 | 139.0 |
| `#5d564b` | 8.7% | 0.194 | 86.7 |

Median `#b5a890` · dominant `#161515` · chroma peak `#d0c1a5`.

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
  --color-bg-primary: #d0c1a5;
  --color-bg-secondary: #b5a890;
  --color-text-primary: #161515;
  --color-text-secondary: #5d564b;
  --color-border-primary: #b5a890;
  --chart-color-1: #ada08a;
  --chart-color-2: #958a77;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
