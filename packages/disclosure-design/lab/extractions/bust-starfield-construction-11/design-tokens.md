---
title: design-tokens — bust-starfield-construction-11
description: Pixel-grounded token sheet for bust-starfield-construction-11 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `bust-starfield-construction-11`

Source still: `./bust-starfield-construction-11.png` · 928×1232 · PNG · polarity **dark** (mean luma 35.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [bust-starfield-construction](../bust-starfield-construction/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#131414` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#161616` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#6d6b68` | max-contrast swatch vs bg-primary (3.47:1) | ✅ high |
| `--color-text-secondary` | `#2a2a2a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#161616` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#2a2a2a` | 14.8% | 0.0 | 42.0 |
| `#131414` | 13.7% | 0.05 | 19.8 |
| `#6d6b68` | 9.8% | 0.046 | 107.2 |

Median `#161616` · dominant `#2a2a2a` · chroma peak `#131414`.

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
  --color-bg-primary: #131414;
  --color-bg-secondary: #161616;
  --color-text-primary: #6d6b68;
  --color-text-secondary: #2a2a2a;
  --color-border-primary: #161616;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
