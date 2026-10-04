---
title: design-tokens — bust-geometry-reverse-03
description: Pixel-grounded token sheet for bust-geometry-reverse-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-geometry-reverse-03`

Source still: `./bust-geometry-reverse-03.png` · 928×1232 · PNG · polarity **dark** (mean luma 53.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-geometry-reverse](../bust-geometry-reverse/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0d1114` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#191c1d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c6b89a` | max-contrast swatch vs bg-primary (9.68:1) | ✅ high |
| `--color-text-secondary` | `#5a564e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#191c1d` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0d1114` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0d1114` | 16.4% | 0.35 | 16.4 |
| `#2a2b2a` | 14.8% | 0.023 | 42.7 |
| `#c6b89a` | 13.0% | 0.222 | 184.8 |
| `#5a564e` | 9.6% | 0.133 | 86.3 |

Median `#191c1d` · dominant `#0d1114` · chroma peak `#0d1114`.

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
  --color-bg-primary: #0d1114;
  --color-bg-secondary: #191c1d;
  --color-text-primary: #c6b89a;
  --color-text-secondary: #5a564e;
  --color-border-primary: #191c1d;
  --color-primary: #0d1114;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
