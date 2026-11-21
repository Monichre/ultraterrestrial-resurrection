---
title: design-tokens — bust-nebula-hud-le
description: Pixel-grounded token sheet for bust-nebula-hud-le (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `bust-nebula-hud-le`

Source still: `./bust-nebula-hud-le.png` · 1856×2464 · PNG · polarity **dark** (mean luma 55.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#100e0c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#20201f` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#aca699` | max-contrast swatch vs bg-primary (7.95:1) | ✅ high |
| `--color-text-secondary` | `#706e6a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#20201f` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#100e0c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#100e0c` | 15.3% | 0.25 | 14.3 |
| `#242423` | 14.5% | 0.028 | 35.9 |
| `#aca699` | 13.5% | 0.11 | 166.3 |
| `#373938` | 12.1% | 0.035 | 56.5 |
| `#706e6a` | 10.9% | 0.054 | 110.1 |

Median `#20201f` · dominant `#100e0c` · chroma peak `#100e0c`.

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
  --color-bg-primary: #100e0c;
  --color-bg-secondary: #20201f;
  --color-text-primary: #aca699;
  --color-text-secondary: #706e6a;
  --color-border-primary: #20201f;
  --color-primary: #100e0c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
