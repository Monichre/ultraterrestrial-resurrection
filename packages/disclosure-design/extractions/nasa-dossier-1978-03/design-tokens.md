---
title: design-tokens — nasa-dossier-1978-03
description: Pixel-grounded token sheet for nasa-dossier-1978-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `nasa-dossier-1978-03`

Source still: `./nasa-dossier-1978-03.png` · 1232×928 · PNG · polarity **light** (mean luma 162.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [nasa-dossier-1978](../nasa-dossier-1978/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d2cab9` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c6b192` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#854260` | max-contrast swatch vs bg-primary (4.38:1) | ✅ high |
| `--color-text-secondary` | `#98897a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bdab8f` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#854260` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c6b192` | 17.6% | 0.263 | 179.2 |
| `#aa9f8b` | 11.9% | 0.182 | 159.9 |
| `#98897a` | 11.3% | 0.197 | 139.1 |
| `#854260` | 11.1% | 0.504 | 82.4 |
| `#d2cab9` | 11.0% | 0.119 | 202.5 |

Median `#bdab8f` · dominant `#c6b192` · chroma peak `#854260`.

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
  --color-bg-primary: #d2cab9;
  --color-bg-secondary: #c6b192;
  --color-text-primary: #854260;
  --color-text-secondary: #98897a;
  --color-border-primary: #bdab8f;
  --color-primary: #854260;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
