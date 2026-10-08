---
title: design-tokens — astronaut-double-exposure-02
description: Pixel-grounded token sheet for astronaut-double-exposure-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `astronaut-double-exposure-02`

Source still: `./astronaut-double-exposure-02.png` · 1456×816 · PNG · polarity **light** (mean luma 182.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [astronaut-double-exposure](../astronaut-double-exposure/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d5ccb5` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#d1bb92` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#806259` | max-contrast swatch vs bg-primary (3.45:1) | ✅ high |
| `--color-text-secondary` | `#806259` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#d5ccb5` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#806259` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d5ccb5` | 30.9% | 0.15 | 204.3 |
| `#806259` | 19.2% | 0.305 | 103.7 |
| `#d1bb92` | 6.2% | 0.301 | 188.7 |

Median `#d5ccb5` · dominant `#d5ccb5` · chroma peak `#806259`.

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
  --color-bg-primary: #d5ccb5;
  --color-bg-secondary: #d1bb92;
  --color-text-primary: #806259;
  --color-text-secondary: #806259;
  --color-border-primary: #d5ccb5;
  --color-primary: #806259;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
