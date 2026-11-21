---
title: design-tokens — hud-reverse-batch-04
description: Pixel-grounded token sheet for hud-reverse-batch-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-reverse-batch-04`

Source still: `./hud-reverse-batch-04.png` · 1232×928 · PNG · polarity **light** (mean luma 150.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-reverse-batch](../hud-reverse-batch/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d4ccbd` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#ccc2b0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0a0a09` | max-contrast swatch vs bg-primary (12.42:1) | ✅ high |
| `--color-text-secondary` | `#332b25` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#ccc2b0` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#332b25` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d4ccbd` | 18.4% | 0.108 | 204.6 |
| `#0a0a09` | 16.5% | 0.1 | 9.9 |
| `#998c7d` | 9.6% | 0.183 | 141.7 |
| `#332b25` | 8.1% | 0.275 | 44.3 |

Median `#ccc2b0` · dominant `#d4ccbd` · chroma peak `#332b25`.

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
  --color-bg-primary: #d4ccbd;
  --color-bg-secondary: #ccc2b0;
  --color-text-primary: #0a0a09;
  --color-text-secondary: #332b25;
  --color-border-primary: #ccc2b0;
  --color-primary: #332b25;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
