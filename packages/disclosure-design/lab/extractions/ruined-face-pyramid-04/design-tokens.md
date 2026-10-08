---
title: design-tokens — ruined-face-pyramid-04
description: Pixel-grounded token sheet for ruined-face-pyramid-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `ruined-face-pyramid-04`

Source still: `./ruined-face-pyramid-04.png` · 1680×720 · PNG · polarity **dark** (mean luma 32.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [ruined-face-pyramid](../ruined-face-pyramid/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0d191b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0b1f1e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#4a6d4e` | max-contrast swatch vs bg-primary (3.06:1) | ✅ high |
| `--color-text-secondary` | `#26342e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0d191b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0b1f1e` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#26342e` | 15.8% | 0.269 | 48.6 |
| `#0b1f1e` | 14.5% | 0.645 | 26.7 |
| `#4a6d4e` | 8.6% | 0.321 | 99.3 |

Median `#0d191b` · dominant `#26342e` · chroma peak `#0b1f1e`.

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
  --color-bg-primary: #0d191b;
  --color-bg-secondary: #0b1f1e;
  --color-text-primary: #4a6d4e;
  --color-text-secondary: #26342e;
  --color-border-primary: #0d191b;
  --color-primary: #0b1f1e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
