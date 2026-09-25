---
title: design-tokens — dotgrid-journal-page-06
description: Pixel-grounded token sheet for dotgrid-journal-page-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dotgrid-journal-page-06`

Source still: `./dotgrid-journal-page-06.png` · 928×1232 · PNG · polarity **light** (mean luma 191.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dotgrid-journal-page](../dotgrid-journal-page/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cfd1ce` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c4c5c2` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#979691` | max-contrast swatch vs bg-primary (1.93:1) | ✅ high |
| `--color-text-secondary` | `#b5b6b2` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c4c5c2` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#cfd1ce` | 14.9% | 0.014 | 208.4 |
| `#b5b6b2` | 13.6% | 0.022 | 181.5 |
| `#979691` | 7.4% | 0.04 | 149.9 |

Median `#c4c5c2` · dominant `#cfd1ce` · chroma peak `#979691`.

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
  --color-bg-primary: #cfd1ce;
  --color-bg-secondary: #c4c5c2;
  --color-text-primary: #979691;
  --color-text-secondary: #b5b6b2;
  --color-border-primary: #c4c5c2;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
