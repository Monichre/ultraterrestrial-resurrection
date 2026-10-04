---
title: design-tokens — visual-language-report-03
description: Pixel-grounded token sheet for visual-language-report-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `visual-language-report-03`

Source still: `./visual-language-report-03.png` · 1122×1402 · PNG · polarity **light** (mean luma 169.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [visual-language-report](../visual-language-report/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dcd0bf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c9bdab` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#393733` | max-contrast swatch vs bg-primary (7.81:1) | ✅ high |
| `--color-text-secondary` | `#8c8173` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c9bdab` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#dcd0bf` | 14.1% | 0.132 | 209.3 |
| `#c4b7a5` | 13.2% | 0.158 | 184.5 |
| `#393733` | 11.9% | 0.105 | 55.1 |
| `#8c8173` | 10.0% | 0.179 | 130.3 |

Median `#c9bdab` · dominant `#dcd0bf` · chroma peak `#8c8173`.

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
  --color-bg-primary: #dcd0bf;
  --color-bg-secondary: #c9bdab;
  --color-text-primary: #393733;
  --color-text-secondary: #8c8173;
  --color-border-primary: #c9bdab;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
