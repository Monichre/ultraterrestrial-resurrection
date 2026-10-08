---
title: design-tokens — volleks-sphere-forest
description: Pixel-grounded token sheet for volleks-sphere-forest (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `volleks-sphere-forest`

Source still: `./volleks-sphere-forest.png` · 1456×816 · PNG · polarity **dark** (mean luma 19.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#020206` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#0a0c10` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#374a4f` | max-contrast swatch vs bg-primary (2.22:1) | ✅ high |
| `--color-text-secondary` | `#1a1f24` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0a0c10` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#020206` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#020206` | 22.6% | 0.667 | 2.3 |
| `#1a1f24` | 15.9% | 0.278 | 30.3 |
| `#374a4f` | 8.4% | 0.304 | 70.3 |

Median `#0a0c10` · dominant `#020206` · chroma peak `#020206`.

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
  --color-bg-primary: #020206;
  --color-bg-secondary: #0a0c10;
  --color-text-primary: #374a4f;
  --color-text-secondary: #1a1f24;
  --color-border-primary: #0a0c10;
  --color-primary: #020206;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
