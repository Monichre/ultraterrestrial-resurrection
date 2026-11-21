---
title: design-tokens — hud-line-geometry-13
description: Pixel-grounded token sheet for hud-line-geometry-13 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-13`

Source still: `./hud-line-geometry-13.png` · 928×1232 · PNG · polarity **dark** (mean luma 106.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0c0f10` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#414340` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c5beb2` | max-contrast swatch vs bg-primary (10.43:1) | ✅ high |
| `--color-text-secondary` | `#8b887b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#414340` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0c0f10` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0c0f10` | 20.5% | 0.25 | 14.4 |
| `#c5beb2` | 14.0% | 0.096 | 190.6 |
| `#9f9b92` | 13.5% | 0.082 | 155.2 |
| `#414340` | 5.1% | 0.045 | 66.4 |

Median `#8b887b` · dominant `#0c0f10` · chroma peak `#0c0f10`.

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
  --color-bg-primary: #0c0f10;
  --color-bg-secondary: #414340;
  --color-text-primary: #c5beb2;
  --color-text-secondary: #8b887b;
  --color-border-primary: #414340;
  --color-primary: #0c0f10;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
