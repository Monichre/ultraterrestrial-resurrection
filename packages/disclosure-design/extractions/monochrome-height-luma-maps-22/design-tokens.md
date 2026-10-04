---
title: design-tokens — monochrome-height-luma-maps-22
description: Pixel-grounded token sheet for monochrome-height-luma-maps-22 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `monochrome-height-luma-maps-22`

Source still: `./monochrome-height-luma-maps-22.webp` · 1024×512 · WEBP · polarity **dark** (mean luma 14.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [monochrome-height-luma-maps](../monochrome-height-luma-maps/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#030303` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0c0c0c` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#191918` | max-contrast swatch vs bg-primary (1.17:1) | ✅ high |
| `--color-text-secondary` | `#0c0c0c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#030303` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#191918` | 14.8% | 0.04 | 24.9 |
| `#030303` | 14.1% | 0.0 | 3.0 |

Median `#0c0c0c` · dominant `#191918` · chroma peak `#191918`.

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
  --color-bg-primary: #030303;
  --color-bg-secondary: #0c0c0c;
  --color-text-primary: #191918;
  --color-text-secondary: #0c0c0c;
  --color-border-primary: #030303;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
