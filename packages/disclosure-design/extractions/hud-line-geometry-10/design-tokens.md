---
title: design-tokens — hud-line-geometry-10
description: Pixel-grounded token sheet for hud-line-geometry-10 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-10`

Source still: `./hud-line-geometry-10.png` · 928×1232 · PNG · polarity **dark** (mean luma 92.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0a0c0e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#292726` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#ddd7c8` | max-contrast swatch vs bg-primary (13.65:1) | ✅ high |
| `--color-text-secondary` | `#a29f97` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#413d3e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0a0c0e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0a0c0e` | 28.2% | 0.286 | 11.7 |
| `#a29f97` | 15.4% | 0.068 | 159.1 |
| `#bcb8ad` | 13.8% | 0.08 | 184.1 |
| `#292726` | 12.1% | 0.073 | 39.4 |
| `#ddd7c8` | 11.5% | 0.095 | 215.2 |

Median `#413d3e` · dominant `#0a0c0e` · chroma peak `#0a0c0e`.

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
  --color-bg-primary: #0a0c0e;
  --color-bg-secondary: #292726;
  --color-text-primary: #ddd7c8;
  --color-text-secondary: #a29f97;
  --color-border-primary: #413d3e;
  --color-primary: #0a0c0e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
