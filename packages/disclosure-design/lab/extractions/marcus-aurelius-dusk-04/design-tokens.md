---
title: design-tokens — marcus-aurelius-dusk-04
description: Pixel-grounded token sheet for marcus-aurelius-dusk-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `marcus-aurelius-dusk-04`

Source still: `./marcus-aurelius-dusk-04.png` · 1232×928 · PNG · polarity **dark** (mean luma 42.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [marcus-aurelius-dusk](../marcus-aurelius-dusk/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#110a0c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#391a11` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#a67552` | max-contrast swatch vs bg-primary (4.93:1) | ✅ high |
| `--color-text-secondary` | `#6b3f28` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#391a11` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#342313` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#342313` | 16.3% | 0.635 | 37.5 |
| `#110a0c` | 13.7% | 0.412 | 11.6 |
| `#6b3f28` | 12.5% | 0.626 | 70.7 |
| `#a67552` | 10.8% | 0.506 | 124.9 |

Median `#391a11` · dominant `#342313` · chroma peak `#342313`.

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
  --color-bg-primary: #110a0c;
  --color-bg-secondary: #391a11;
  --color-text-primary: #a67552;
  --color-text-secondary: #6b3f28;
  --color-border-primary: #391a11;
  --color-primary: #342313;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
