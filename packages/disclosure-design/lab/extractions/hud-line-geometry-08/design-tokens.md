---
title: design-tokens — hud-line-geometry-08
description: Pixel-grounded token sheet for hud-line-geometry-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-08`

Source still: `./hud-line-geometry-08.png` · 928×1232 · PNG · polarity **light** (mean luma 128.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cbd1cc` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b5b9b0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0f0c09` | max-contrast swatch vs bg-primary (12.57:1) | ✅ high |
| `--color-text-secondary` | `#3e362a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#969280` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0f0c09` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#908a77` | 15.2% | 0.174 | 137.9 |
| `#0f0c09` | 14.0% | 0.4 | 12.4 |
| `#b5b9b0` | 13.5% | 0.049 | 183.5 |
| `#cbd1cc` | 11.6% | 0.029 | 207.4 |
| `#3e362a` | 10.6% | 0.323 | 54.8 |

Median `#969280` · dominant `#908a77` · chroma peak `#0f0c09`.

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
  --color-bg-primary: #cbd1cc;
  --color-bg-secondary: #b5b9b0;
  --color-text-primary: #0f0c09;
  --color-text-secondary: #3e362a;
  --color-border-primary: #969280;
  --color-primary: #0f0c09;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
