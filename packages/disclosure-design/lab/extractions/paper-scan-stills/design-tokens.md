---
title: design-tokens — paper-scan-stills
description: Pixel-grounded token sheet for paper-scan-stills (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `paper-scan-stills`

Source still: `./paper-scan-stills.webp` · 1600×2400 · WEBP · polarity **light** (mean luma 178.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#f6f6f6` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cecac0` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#383532` | max-contrast swatch vs bg-primary (11.27:1) | ✅ high |
| `--color-text-secondary` | `#857f75` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#f6f6f6` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#f6f6f6` | 14.9% | 0.0 | 246.0 |
| `#a9a69d` | 13.3% | 0.071 | 166.0 |
| `#cecac0` | 13.2% | 0.068 | 202.1 |
| `#857f75` | 11.8% | 0.12 | 127.6 |
| `#383532` | 11.7% | 0.107 | 53.4 |

Median `#c9c3b9` · dominant `#f6f6f6` · chroma peak `#857f75`.

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
  --color-bg-primary: #f6f6f6;
  --color-bg-secondary: #cecac0;
  --color-text-primary: #383532;
  --color-text-secondary: #857f75;
  --color-border-primary: #f6f6f6;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
