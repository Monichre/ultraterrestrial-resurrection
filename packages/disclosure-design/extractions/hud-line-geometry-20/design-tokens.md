---
title: design-tokens — hud-line-geometry-20
description: Pixel-grounded token sheet for hud-line-geometry-20 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-20`

Source still: `./hud-line-geometry-20.png` · 928×1232 · PNG · polarity **light** (mean luma 133.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e0d9d0` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c4bbb0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#121313` | max-contrast swatch vs bg-primary (13.3:1) | ✅ high |
| `--color-text-secondary` | `#3f3f3b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bbb3a8` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#121313` | 21.1% | 0.053 | 18.8 |
| `#c4bbb0` | 14.5% | 0.102 | 188.1 |
| `#e0d9d0` | 13.6% | 0.071 | 217.8 |
| `#a49a8f` | 10.0% | 0.128 | 155.3 |
| `#3f3f3b` | 8.1% | 0.063 | 62.7 |

Median `#bbb3a8` · dominant `#121313` · chroma peak `#a49a8f`.

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
  --color-bg-primary: #e0d9d0;
  --color-bg-secondary: #c4bbb0;
  --color-text-primary: #121313;
  --color-text-secondary: #3f3f3b;
  --color-border-primary: #bbb3a8;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
