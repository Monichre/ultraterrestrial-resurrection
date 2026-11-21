---
title: design-tokens — mixed-mockup-plates-05
description: Pixel-grounded token sheet for mixed-mockup-plates-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `mixed-mockup-plates-05`

Source still: `./mixed-mockup-plates-05.png` · 1448×1086 · PNG · polarity **dark** (mean luma 73.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [mixed-mockup-plates](../mixed-mockup-plates/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#1f1e1b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#25241f` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b9a791` | max-contrast swatch vs bg-primary (7.14:1) | ✅ high |
| `--color-text-secondary` | `#847360` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#25241f` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#847360` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#a8947e` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1f1e1b` | 17.6% | 0.129 | 30.0 |
| `#a8947e` | 16.1% | 0.25 | 150.7 |
| `#b9a791` | 13.0% | 0.216 | 169.2 |
| `#847360` | 8.1% | 0.273 | 117.2 |

Median `#25241f` · dominant `#1f1e1b` · chroma peak `#a8947e`.

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
  --color-bg-primary: #1f1e1b;
  --color-bg-secondary: #25241f;
  --color-text-primary: #b9a791;
  --color-text-secondary: #847360;
  --color-border-primary: #25241f;
  --color-primary: #847360;
  --chart-color-1: #a8947e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
