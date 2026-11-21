---
title: design-tokens — dystopian-2052-scene-02
description: Pixel-grounded token sheet for dystopian-2052-scene-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dystopian-2052-scene-02`

Source still: `./dystopian-2052-scene-02.png` · 928×1232 · PNG · polarity **dark** (mean luma 55.2).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dystopian-2052-scene](../dystopian-2052-scene/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#111316` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#232a28` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8f7c59` | max-contrast swatch vs bg-primary (4.6:1) | ✅ high |
| `--color-text-secondary` | `#5a5341` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#282f2b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#8f7c59` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#5a5341` | 14.5% | 0.278 | 83.2 |
| `#232a28` | 13.2% | 0.167 | 40.4 |
| `#3f3f35` | 12.3% | 0.159 | 62.3 |
| `#111316` | 11.2% | 0.227 | 18.8 |
| `#8f7c59` | 10.2% | 0.378 | 125.5 |

Median `#282f2b` · dominant `#5a5341` · chroma peak `#8f7c59`.

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
  --color-bg-primary: #111316;
  --color-bg-secondary: #232a28;
  --color-text-primary: #8f7c59;
  --color-text-secondary: #5a5341;
  --color-border-primary: #282f2b;
  --color-primary: #8f7c59;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
