---
title: design-tokens — hud-line-geometry-14
description: Pixel-grounded token sheet for hud-line-geometry-14 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-14`

Source still: `./hud-line-geometry-14.png` · 928×1232 · PNG · polarity **light** (mean luma 162.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#eaddc2` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#dcc7a8` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1d2124` | max-contrast swatch vs bg-primary (12.06:1) | ✅ high |
| `--color-text-secondary` | `#6b6052` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d0ba9b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#b69e81` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1d2124` | 14.8% | 0.194 | 32.4 |
| `#dcc7a8` | 13.9% | 0.236 | 201.2 |
| `#b69e81` | 13.4% | 0.291 | 161.0 |
| `#eaddc2` | 12.2% | 0.171 | 221.8 |
| `#6b6052` | 6.6% | 0.234 | 97.3 |

Median `#d0ba9b` · dominant `#1d2124` · chroma peak `#b69e81`.

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
  --color-bg-primary: #eaddc2;
  --color-bg-secondary: #dcc7a8;
  --color-text-primary: #1d2124;
  --color-text-secondary: #6b6052;
  --color-border-primary: #d0ba9b;
  --color-primary: #b69e81;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
