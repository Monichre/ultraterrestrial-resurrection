---
title: design-tokens — roswell-demo-shells
description: Pixel-grounded token sheet for roswell-demo-shells (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `roswell-demo-shells`

Source still: `./roswell-demo-shells.png` · 1024×1024 · PNG · polarity **dark** (mean luma 87.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#161617` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#323131` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#e5dfd5` | max-contrast swatch vs bg-primary (13.65:1) | ✅ high |
| `--color-text-secondary` | `#75716d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#323131` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#161617` | 19.2% | 0.043 | 22.1 |
| `#e5dfd5` | 16.6% | 0.07 | 223.6 |
| `#41403f` | 12.6% | 0.031 | 64.1 |
| `#75716d` | 11.5% | 0.068 | 113.6 |
| `#c4bdb3` | 8.4% | 0.087 | 189.8 |

Median `#323131` · dominant `#161617` · chroma peak `#e5dfd5`.

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
  --color-bg-primary: #161617;
  --color-bg-secondary: #323131;
  --color-text-primary: #e5dfd5;
  --color-text-secondary: #75716d;
  --color-border-primary: #323131;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
