---
title: design-tokens — hand-annotated-journal-07
description: Pixel-grounded token sheet for hand-annotated-journal-07 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hand-annotated-journal-07`

Source still: `./hand-annotated-journal-07.png` · 1232×928 · PNG · polarity **light** (mean luma 152.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hand-annotated-journal](../hand-annotated-journal/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cec0a6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bbad97` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#232220` | max-contrast swatch vs bg-primary (8.87:1) | ✅ high |
| `--color-text-secondary` | `#5f584d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bbad97` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#232220` | 15.2% | 0.086 | 34.1 |
| `#cec0a6` | 14.1% | 0.194 | 193.1 |
| `#9a8f7c` | 13.7% | 0.195 | 144.0 |
| `#b1a58f` | 13.6% | 0.192 | 166.0 |
| `#5f584d` | 6.9% | 0.189 | 88.7 |

Median `#bbad97` · dominant `#232220` · chroma peak `#cec0a6`.

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
  --color-bg-primary: #cec0a6;
  --color-bg-secondary: #bbad97;
  --color-text-primary: #232220;
  --color-text-secondary: #5f584d;
  --color-border-primary: #bbad97;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
