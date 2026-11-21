---
title: design-tokens — volluid-sphere-statues-02
description: Pixel-grounded token sheet for volluid-sphere-statues-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `volluid-sphere-statues-02`

Source still: `./volluid-sphere-statues-02.png` · 1856×2464 · PNG · polarity **light** (mean luma 124.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [volluid-sphere-statues](../volluid-sphere-statues/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cecfd1` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b2b4b6` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0a0d11` | max-contrast swatch vs bg-primary (12.49:1) | ✅ high |
| `--color-text-secondary` | `#7c8083` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#cecfd1` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#0a0d11` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#0a0d11` | 15.4% | 0.412 | 12.7 |
| `#7c8083` | 14.5% | 0.053 | 127.4 |
| `#9ea1a3` | 14.0% | 0.031 | 160.5 |
| `#b2b4b6` | 12.9% | 0.022 | 179.7 |
| `#cecfd1` | 11.8% | 0.014 | 206.9 |

Median `#85888b` · dominant `#0a0d11` · chroma peak `#0a0d11`.

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
  --color-bg-primary: #cecfd1;
  --color-bg-secondary: #b2b4b6;
  --color-text-primary: #0a0d11;
  --color-text-secondary: #7c8083;
  --color-border-primary: #cecfd1;
  --color-primary: #0a0d11;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
