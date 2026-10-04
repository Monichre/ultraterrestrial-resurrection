---
title: design-tokens — geometric-grid-hud-04
description: Pixel-grounded token sheet for geometric-grid-hud-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `geometric-grid-hud-04`

Source still: `./geometric-grid-hud-04.png` · 1536×768 · PNG · polarity **light** (mean luma 212.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [geometric-grid-hud](../geometric-grid-hud/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#feffff` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#f0f0f0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#3a3d41` | max-contrast swatch vs bg-primary (10.9:1) | ✅ high |
| `--color-text-secondary` | `#babbba` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#f0f0f0` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#feffff` | 16.5% | 0.004 | 254.8 |
| `#d7d7d7` | 12.7% | 0.0 | 215.0 |
| `#babbba` | 11.9% | 0.005 | 186.7 |
| `#e9e9e9` | 11.8% | 0.0 | 233.0 |
| `#3a3d41` | 10.7% | 0.108 | 60.7 |

Median `#f0f0f0` · dominant `#feffff` · chroma peak `#3a3d41`.

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
  --color-bg-primary: #feffff;
  --color-bg-secondary: #f0f0f0;
  --color-text-primary: #3a3d41;
  --color-text-secondary: #babbba;
  --color-border-primary: #f0f0f0;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
