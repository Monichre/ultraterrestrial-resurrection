---
title: design-tokens — martian-pyramid-interior-04
description: Pixel-grounded token sheet for martian-pyramid-interior-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `martian-pyramid-interior-04`

Source still: `./martian-pyramid-interior-04.png` · 1344×896 · PNG · polarity **dark** (mean luma 36.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [martian-pyramid-interior](../martian-pyramid-interior/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#070505` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#181314` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#818181` | max-contrast swatch vs bg-primary (5.22:1) | ✅ high |
| `--color-text-secondary` | `#463e3d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#181314` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#161b23` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#070505` | 14.6% | 0.286 | 5.4 |
| `#463e3d` | 14.5% | 0.129 | 63.6 |
| `#161b23` | 14.0% | 0.371 | 26.5 |
| `#818181` | 10.4% | 0.0 | 129.0 |

Median `#181314` · dominant `#070505` · chroma peak `#161b23`.

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
  --color-bg-primary: #070505;
  --color-bg-secondary: #181314;
  --color-text-primary: #818181;
  --color-text-secondary: #463e3d;
  --color-border-primary: #181314;
  --color-primary: #161b23;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
