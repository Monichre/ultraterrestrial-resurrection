---
title: design-tokens — hud-reverse-batch-06
description: Pixel-grounded token sheet for hud-reverse-batch-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-reverse-batch-06`

Source still: `./hud-reverse-batch-06.png` · 928×1232 · PNG · polarity **light** (mean luma 110.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-reverse-batch](../hud-reverse-batch/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d3cfbe` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bcbaac` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#050706` | max-contrast swatch vs bg-primary (12.93:1) | ✅ high |
| `--color-text-secondary` | `#7f7c70` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#a3a398` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#050706` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#050706` | 15.4% | 0.286 | 6.5 |
| `#d3cfbe` | 12.8% | 0.1 | 206.6 |
| `#a3a398` | 12.8% | 0.067 | 162.2 |
| `#bcbaac` | 12.6% | 0.085 | 185.4 |
| `#89897e` | 12.5% | 0.08 | 136.2 |

Median `#7f7c70` · dominant `#050706` · chroma peak `#050706`.

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
  --color-bg-primary: #d3cfbe;
  --color-bg-secondary: #bcbaac;
  --color-text-primary: #050706;
  --color-text-secondary: #7f7c70;
  --color-border-primary: #a3a398;
  --color-primary: #050706;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
