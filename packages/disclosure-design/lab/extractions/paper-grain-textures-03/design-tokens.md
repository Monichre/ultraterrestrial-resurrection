---
title: design-tokens — paper-grain-textures-03
description: Pixel-grounded token sheet for paper-grain-textures-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `paper-grain-textures-03`

Source still: `./paper-grain-textures-03.png` · 410×410 · PNG · polarity **light** (mean luma 183.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [paper-grain-textures](../paper-grain-textures/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d6d6d6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b6b6b6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#9f9f9f` | max-contrast swatch vs bg-primary (1.82:1) | ✅ high |
| `--color-text-secondary` | `#b6b6b6` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d6d6d6` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#b3b3b3` | 16.3% | 0.0 | 179.0 |
| `#d6d6d6` | 11.9% | 0.0 | 214.0 |
| `#9f9f9f` | 9.3% | 0.0 | 159.0 |

Median `#b6b6b6` · dominant `#b3b3b3` · chroma peak `#b3b3b3`.

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
  --color-bg-primary: #d6d6d6;
  --color-bg-secondary: #b6b6b6;
  --color-text-primary: #9f9f9f;
  --color-text-secondary: #b6b6b6;
  --color-border-primary: #d6d6d6;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
