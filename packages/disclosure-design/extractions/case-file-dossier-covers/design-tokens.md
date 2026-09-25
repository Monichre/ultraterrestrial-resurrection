---
title: design-tokens — case-file-dossier-covers
description: Pixel-grounded token sheet for case-file-dossier-covers (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `case-file-dossier-covers`

Source still: `./case-file-dossier-covers.png` · 928×1232 · PNG · polarity **light** (mean luma 136.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d7ceba` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c6b9a3` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0b0b0a` | max-contrast swatch vs bg-primary (12.59:1) | ✅ high |
| `--color-text-secondary` | `#74695a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#a39582` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#938776` | 13.6% | 0.197 | 136.3 |
| `#d7ceba` | 13.5% | 0.135 | 206.5 |
| `#0b0b0a` | 13.4% | 0.091 | 10.9 |
| `#c6b9a3` | 12.8% | 0.177 | 186.2 |
| `#74695a` | 12.1% | 0.224 | 106.3 |

Median `#a39582` · dominant `#938776` · chroma peak `#74695a`.

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
  --color-bg-primary: #d7ceba;
  --color-bg-secondary: #c6b9a3;
  --color-text-primary: #0b0b0a;
  --color-text-secondary: #74695a;
  --color-border-primary: #a39582;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
