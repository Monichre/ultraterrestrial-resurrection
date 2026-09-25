---
title: design-tokens — prometheus-geometry-mix
description: Pixel-grounded token sheet for prometheus-geometry-mix (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `prometheus-geometry-mix`

Source still: `./prometheus-geometry-mix.png` · 928×1232 · PNG · polarity **dark** (mean luma 89.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#13171a` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#545551` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c0c1ba` | max-contrast swatch vs bg-primary (9.94:1) | ✅ high |
| `--color-text-secondary` | `#888780` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#545551` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#13171a` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#13171a` | 18.2% | 0.269 | 22.4 |
| `#9d9d95` | 15.8% | 0.051 | 156.4 |
| `#888780` | 13.7% | 0.059 | 134.7 |
| `#6b6b65` | 11.9% | 0.056 | 106.6 |
| `#c0c1ba` | 9.5% | 0.036 | 192.3 |

Median `#545551` · dominant `#13171a` · chroma peak `#13171a`.

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
  --color-bg-primary: #13171a;
  --color-bg-secondary: #545551;
  --color-text-primary: #c0c1ba;
  --color-text-secondary: #888780;
  --color-border-primary: #545551;
  --color-primary: #13171a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
