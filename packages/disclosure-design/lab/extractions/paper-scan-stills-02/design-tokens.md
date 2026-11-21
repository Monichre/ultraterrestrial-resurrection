---
title: design-tokens — paper-scan-stills-02
description: Pixel-grounded token sheet for paper-scan-stills-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `paper-scan-stills-02`

Source still: `./paper-scan-stills-02.webp` · 1600×2400 · WEBP · polarity **light** (mean luma 180.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [paper-scan-stills](../paper-scan-stills/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#e0cfa3` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cebc91` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#908366` | max-contrast swatch vs bg-primary (2.42:1) | ✅ high |
| `--color-text-secondary` | `#b3a27a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#e0cfa3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#b3a27a` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#b3a27a` | 14.3% | 0.318 | 162.7 |
| `#e0cfa3` | 13.7% | 0.272 | 207.4 |
| `#cebc91` | 11.6% | 0.296 | 188.7 |
| `#908366` | 9.0% | 0.292 | 131.7 |

Median `#cbb98e` · dominant `#b3a27a` · chroma peak `#b3a27a`.

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
  --color-bg-primary: #e0cfa3;
  --color-bg-secondary: #cebc91;
  --color-text-primary: #908366;
  --color-text-secondary: #b3a27a;
  --color-border-primary: #e0cfa3;
  --color-primary: #b3a27a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
