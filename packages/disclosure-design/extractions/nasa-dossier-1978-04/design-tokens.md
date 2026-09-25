---
title: design-tokens — nasa-dossier-1978-04
description: Pixel-grounded token sheet for nasa-dossier-1978-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `nasa-dossier-1978-04`

Source still: `./nasa-dossier-1978-04.png` · 1232×928 · PNG · polarity **light** (mean luma 180.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [nasa-dossier-1978](../nasa-dossier-1978/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d8d0be` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cbbfad` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#885e70` | max-contrast swatch vs bg-primary (3.53:1) | ✅ high |
| `--color-text-secondary` | `#a29289` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cbbfad` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#885e70` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d8d0be` | 15.1% | 0.12 | 208.4 |
| `#c6b8a5` | 13.9% | 0.167 | 185.6 |
| `#a29289` | 11.8% | 0.154 | 148.8 |
| `#885e70` | 10.5% | 0.309 | 104.2 |

Median `#cbbfad` · dominant `#d8d0be` · chroma peak `#885e70`.

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
  --color-bg-primary: #d8d0be;
  --color-bg-secondary: #cbbfad;
  --color-text-primary: #885e70;
  --color-text-secondary: #a29289;
  --color-border-primary: #cbbfad;
  --color-primary: #885e70;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
