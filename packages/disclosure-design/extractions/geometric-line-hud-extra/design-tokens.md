---
title: design-tokens — geometric-line-hud-extra
description: Pixel-grounded token sheet for geometric-line-hud-extra (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `geometric-line-hud-extra`

Source still: `./geometric-line-hud-extra.png` · 3072×1536 · PNG · polarity **dark** (mean luma 68.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#1e1d1b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#2e2f2e` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#bdbeba` | max-contrast swatch vs bg-primary (9.01:1) | ✅ high |
| `--color-text-secondary` | `#62686b` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2e2f2e` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1e1d1b` | 20.2% | 0.1 | 29.1 |
| `#62686b` | 13.6% | 0.084 | 102.9 |
| `#333433` | 13.5% | 0.019 | 51.7 |
| `#434647` | 12.5% | 0.056 | 69.4 |
| `#bdbeba` | 10.7% | 0.021 | 189.5 |

Median `#2e2f2e` · dominant `#1e1d1b` · chroma peak `#1e1d1b`.

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
  --color-bg-primary: #1e1d1b;
  --color-bg-secondary: #2e2f2e;
  --color-text-primary: #bdbeba;
  --color-text-secondary: #62686b;
  --color-border-primary: #2e2f2e;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
