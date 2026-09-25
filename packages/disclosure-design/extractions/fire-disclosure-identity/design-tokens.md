---
title: design-tokens — fire-disclosure-identity
description: Pixel-grounded token sheet for fire-disclosure-identity (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `fire-disclosure-identity`

Source still: `./fire-disclosure-identity.png` · 1024×1024 · PNG · polarity **light** (mean luma 120.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e9e3c3` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b2afa0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#000101` | max-contrast swatch vs bg-primary (16.16:1) | ✅ high |
| `--color-text-secondary` | `#5a5f5e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#868b85` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#000101` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000101` | 15.2% | 1.0 | 0.8 |
| `#e9e3c3` | 14.3% | 0.163 | 226.0 |
| `#1f2123` | 13.0% | 0.114 | 32.7 |
| `#5a5f5e` | 10.4% | 0.053 | 93.9 |
| `#b2afa0` | 9.4% | 0.101 | 174.6 |

Median `#868b85` · dominant `#000101` · chroma peak `#000101`.

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
  --color-bg-primary: #e9e3c3;
  --color-bg-secondary: #b2afa0;
  --color-text-primary: #000101;
  --color-text-secondary: #5a5f5e;
  --color-border-primary: #868b85;
  --color-primary: #000101;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
