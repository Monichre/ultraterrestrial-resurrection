---
title: design-tokens — hand-annotated-journal
description: Pixel-grounded token sheet for hand-annotated-journal (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `hand-annotated-journal`

Source still: `./hand-annotated-journal.png` · 1232×928 · PNG · polarity **light** (mean luma 163.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dad0bf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cec3b2` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#151515` | max-contrast swatch vs bg-primary (11.96:1) | ✅ high |
| `--color-text-secondary` | `#706a60` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cec3b2` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#dad0bf` | 17.3% | 0.124 | 208.9 |
| `#151515` | 13.8% | 0.0 | 21.0 |
| `#afa596` | 13.1% | 0.143 | 166.0 |
| `#c6bcab` | 12.6% | 0.136 | 188.9 |
| `#706a60` | 7.8% | 0.143 | 106.6 |

Median `#cec3b2` · dominant `#dad0bf` · chroma peak `#afa596`.

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
  --color-bg-primary: #dad0bf;
  --color-bg-secondary: #cec3b2;
  --color-text-primary: #151515;
  --color-text-secondary: #706a60;
  --color-border-primary: #cec3b2;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
