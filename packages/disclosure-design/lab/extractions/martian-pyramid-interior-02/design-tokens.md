---
title: design-tokens — martian-pyramid-interior-02
description: Pixel-grounded token sheet for martian-pyramid-interior-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `martian-pyramid-interior-02`

Source still: `./martian-pyramid-interior-02.png` · 1344×896 · PNG · polarity **dark** (mean luma 51.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [martian-pyramid-interior](../martian-pyramid-interior/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#21110f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#321a16` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#bba8a4` | max-contrast swatch vs bg-primary (8.03:1) | ✅ high |
| `--color-text-secondary` | `#6c4c47` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#321a16` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#4c2620` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#21110f` | 14.0% | 0.545 | 20.3 |
| `#4c2620` | 13.4% | 0.579 | 45.6 |
| `#6c4c47` | 13.2% | 0.343 | 82.4 |
| `#bba8a4` | 10.5% | 0.123 | 171.8 |

Median `#321a16` · dominant `#21110f` · chroma peak `#4c2620`.

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
  --color-bg-primary: #21110f;
  --color-bg-secondary: #321a16;
  --color-text-primary: #bba8a4;
  --color-text-secondary: #6c4c47;
  --color-border-primary: #321a16;
  --color-primary: #4c2620;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
