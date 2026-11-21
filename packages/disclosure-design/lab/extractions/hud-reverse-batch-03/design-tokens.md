---
title: design-tokens — hud-reverse-batch-03
description: Pixel-grounded token sheet for hud-reverse-batch-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-reverse-batch-03`

Source still: `./hud-reverse-batch-03.png` · 1232×928 · PNG · polarity **light** (mean luma 152.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-reverse-batch](../hud-reverse-batch/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dfd6c7` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cbbeab` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000101` | max-contrast swatch vs bg-primary (14.51:1) | ✅ high |
| `--color-text-secondary` | `#1b1a17` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cbbeab` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000101` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000101` | 18.4% | 1.0 | 0.8 |
| `#dfd6c7` | 15.1% | 0.108 | 214.8 |
| `#c2b5a3` | 14.1% | 0.16 | 182.5 |
| `#a49a8b` | 11.9% | 0.152 | 155.0 |
| `#1b1a17` | 4.2% | 0.148 | 26.0 |

Median `#cbbeab` · dominant `#000101` · chroma peak `#000101`.

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
  --color-bg-primary: #dfd6c7;
  --color-bg-secondary: #cbbeab;
  --color-text-primary: #000101;
  --color-text-secondary: #1b1a17;
  --color-border-primary: #cbbeab;
  --color-primary: #000101;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
