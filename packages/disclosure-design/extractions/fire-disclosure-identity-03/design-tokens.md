---
title: design-tokens — fire-disclosure-identity-03
description: Pixel-grounded token sheet for fire-disclosure-identity-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `fire-disclosure-identity-03`

Source still: `./fire-disclosure-identity-03.png` · 1024×1024 · PNG · polarity **light** (mean luma 113.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [fire-disclosure-identity](../fire-disclosure-identity/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dddccf` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#beb8a6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#343236` | max-contrast swatch vs bg-primary (9.19:1) | ✅ high |
| `--color-text-secondary` | `#756e64` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#dddccf` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#beb8a6` | 15.7% | 0.126 | 184.0 |
| `#343236` | 14.0% | 0.074 | 50.7 |
| `#756e64` | 13.7% | 0.145 | 110.8 |
| `#585450` | 11.7% | 0.091 | 84.6 |
| `#dddccf` | 11.5% | 0.063 | 219.3 |

Median `#67625b` · dominant `#beb8a6` · chroma peak `#756e64`.

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
  --color-bg-primary: #dddccf;
  --color-bg-secondary: #beb8a6;
  --color-text-primary: #343236;
  --color-text-secondary: #756e64;
  --color-border-primary: #dddccf;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
