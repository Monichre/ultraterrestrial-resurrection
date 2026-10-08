---
title: design-tokens — hud-reverse-batch-07
description: Pixel-grounded token sheet for hud-reverse-batch-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-reverse-batch-07`

Source still: `./hud-reverse-batch-07.png` · 928×1232 · PNG · polarity **light** (mean luma 125.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-reverse-batch](../hud-reverse-batch/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#c8c8c0` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a8a79f` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#010303` | max-contrast swatch vs bg-primary (12.29:1) | ✅ high |
| `--color-text-secondary` | `#494c4a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#a09e97` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#010303` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#010303` | 16.3% | 0.667 | 2.6 |
| `#c8c8c0` | 15.0% | 0.04 | 199.4 |
| `#a8a79f` | 13.7% | 0.054 | 166.6 |
| `#918e87` | 12.0% | 0.069 | 142.1 |
| `#494c4a` | 9.5% | 0.039 | 75.2 |

Median `#a09e97` · dominant `#010303` · chroma peak `#010303`.

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
  --color-bg-primary: #c8c8c0;
  --color-bg-secondary: #a8a79f;
  --color-text-primary: #010303;
  --color-text-secondary: #494c4a;
  --color-border-primary: #a09e97;
  --color-primary: #010303;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
