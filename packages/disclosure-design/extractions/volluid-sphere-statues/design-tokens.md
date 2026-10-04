---
title: design-tokens — volluid-sphere-statues
description: Pixel-grounded token sheet for volluid-sphere-statues (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `volluid-sphere-statues`

Source still: `./volluid-sphere-statues.png` · 1856×2464 · PNG · polarity **light** (mean luma 130.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#b8bbbd` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#a4a7aa` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0a0d12` | max-contrast swatch vs bg-primary (10.08:1) | ✅ high |
| `--color-text-secondary` | `#707376` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#8b8e91` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0a0d12` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0a0d12` | 14.5% | 0.444 | 12.7 |
| `#838689` | 14.2% | 0.044 | 133.6 |
| `#b8bbbd` | 13.6% | 0.026 | 186.5 |
| `#a4a7aa` | 13.2% | 0.035 | 166.6 |
| `#707376` | 13.2% | 0.051 | 114.6 |

Median `#8b8e91` · dominant `#0a0d12` · chroma peak `#0a0d12`.

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
  --color-bg-primary: #b8bbbd;
  --color-bg-secondary: #a4a7aa;
  --color-text-primary: #0a0d12;
  --color-text-secondary: #707376;
  --color-border-primary: #8b8e91;
  --color-primary: #0a0d12;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
