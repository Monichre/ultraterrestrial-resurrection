---
title: design-tokens — visual-language-report-02
description: Pixel-grounded token sheet for visual-language-report-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `visual-language-report-02`

Source still: `./visual-language-report-02.png` · 1055×1491 · PNG · polarity **light** (mean luma 145.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [visual-language-report](../visual-language-report/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dcd1c0` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#cabdaa` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1b1e20` | max-contrast swatch vs bg-primary (11.11:1) | ✅ high |
| `--color-text-secondary` | `#817a6e` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#b9ac9a` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#dcd1c0` | 13.9% | 0.127 | 210.1 |
| `#1b1e20` | 13.9% | 0.156 | 29.5 |
| `#ada190` | 12.5% | 0.168 | 162.3 |
| `#cabdaa` | 12.0% | 0.158 | 190.4 |
| `#817a6e` | 11.9% | 0.147 | 122.6 |

Median `#b9ac9a` · dominant `#dcd1c0` · chroma peak `#ada190`.

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
  --color-bg-primary: #dcd1c0;
  --color-bg-secondary: #cabdaa;
  --color-text-primary: #1b1e20;
  --color-text-secondary: #817a6e;
  --color-border-primary: #b9ac9a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
