---
title: design-tokens — crumpled-dotgrid-journal-04
description: Pixel-grounded token sheet for crumpled-dotgrid-journal-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `crumpled-dotgrid-journal-04`

Source still: `./crumpled-dotgrid-journal-04.png` · 1232×928 · PNG · polarity **dark** (mean luma 81.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [crumpled-dotgrid-journal](../crumpled-dotgrid-journal/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#14120e` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#2c2822` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#dfd2b9` | max-contrast swatch vs bg-primary (12.52:1) | ✅ high |
| `--color-text-secondary` | `#7d7467` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2c2822` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#14120e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#14120e` | 16.9% | 0.3 | 18.1 |
| `#c2b49c` | 14.2% | 0.196 | 181.2 |
| `#dfd2b9` | 13.1% | 0.17 | 211.0 |
| `#38332d` | 13.0% | 0.196 | 51.6 |
| `#7d7467` | 8.6% | 0.176 | 117.0 |

Median `#2c2822` · dominant `#14120e` · chroma peak `#14120e`.

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
  --color-bg-primary: #14120e;
  --color-bg-secondary: #2c2822;
  --color-text-primary: #dfd2b9;
  --color-text-secondary: #7d7467;
  --color-border-primary: #2c2822;
  --color-primary: #14120e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
