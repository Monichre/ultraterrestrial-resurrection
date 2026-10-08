---
title: design-tokens — vintage-ultraterrestrial-document-02
description: Pixel-grounded token sheet for vintage-ultraterrestrial-document-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `vintage-ultraterrestrial-document-02`

Source still: `./vintage-ultraterrestrial-document-02.png` · 896×1344 · PNG · polarity **light** (mean luma 159.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [vintage-ultraterrestrial-document](../vintage-ultraterrestrial-document/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dcd4be` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bdb8a8` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#2e3136` | max-contrast swatch vs bg-primary (8.83:1) | ✅ high |
| `--color-text-secondary` | `#8d8b84` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bdb8a8` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#dcd4be` | 14.5% | 0.136 | 212.1 |
| `#2e3136` | 13.0% | 0.148 | 48.7 |
| `#b2ada0` | 12.8% | 0.101 | 173.1 |
| `#8d8b84` | 11.4% | 0.064 | 138.9 |
| `#55595c` | 11.3% | 0.076 | 88.4 |

Median `#bdb8a8` · dominant `#dcd4be` · chroma peak `#2e3136`.

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
  --color-bg-primary: #dcd4be;
  --color-bg-secondary: #bdb8a8;
  --color-text-primary: #2e3136;
  --color-text-secondary: #8d8b84;
  --color-border-primary: #bdb8a8;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
