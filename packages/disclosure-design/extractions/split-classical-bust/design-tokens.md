---
title: design-tokens — split-classical-bust
description: Pixel-grounded token sheet for split-classical-bust (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `split-classical-bust`

Source still: `./split-classical-bust.png` · 1024×1024 · PNG · polarity **dark** (mean luma 109.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#20282a` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#46504f` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#b6b7ad` | max-contrast swatch vs bg-primary (7.41:1) | ✅ high |
| `--color-text-secondary` | `#838781` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#46504f` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#b6b7ad` | 15.0% | 0.055 | 182.1 |
| `#20282a` | 14.7% | 0.238 | 38.4 |
| `#46504f` | 13.2% | 0.125 | 77.8 |
| `#838781` | 6.8% | 0.044 | 133.7 |

Median `#626862` · dominant `#b6b7ad` · chroma peak `#20282a`.

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
  --color-bg-primary: #20282a;
  --color-bg-secondary: #46504f;
  --color-text-primary: #b6b7ad;
  --color-text-secondary: #838781;
  --color-border-primary: #46504f;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
