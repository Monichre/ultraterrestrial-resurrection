---
title: design-tokens — ethereal-quote-landing-02
description: Pixel-grounded token sheet for ethereal-quote-landing-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `ethereal-quote-landing-02`

Source still: `./ethereal-quote-landing-02.png` · 1024×1024 · PNG · polarity **light** (mean luma 143.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [ethereal-quote-landing](../ethereal-quote-landing/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d7d9d2` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bfc0b7` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#11191f` | max-contrast swatch vs bg-primary (12.47:1) | ✅ high |
| `--color-text-secondary` | `#4d4f4b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bfc0b7` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#11191f` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#11191f` | 27.5% | 0.452 | 23.7 |
| `#d7d9d2` | 16.0% | 0.032 | 216.1 |
| `#a7a79e` | 11.0% | 0.054 | 166.4 |
| `#4d4f4b` | 9.2% | 0.051 | 78.3 |

Median `#bfc0b7` · dominant `#11191f` · chroma peak `#11191f`.

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
  --color-bg-primary: #d7d9d2;
  --color-bg-secondary: #bfc0b7;
  --color-text-primary: #11191f;
  --color-text-secondary: #4d4f4b;
  --color-border-primary: #bfc0b7;
  --color-primary: #11191f;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
