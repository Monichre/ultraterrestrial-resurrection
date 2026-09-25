---
title: design-tokens — prometheus-line-studies-03
description: Pixel-grounded token sheet for prometheus-line-studies-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `prometheus-line-studies-03`

Source still: `./prometheus-line-studies-03.png` · 928×1232 · PNG · polarity **dark** (mean luma 77.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [prometheus-line-studies](../prometheus-line-studies/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0e0e0f` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#262626` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#bcbdbd` | max-contrast swatch vs bg-primary (10.25:1) | ✅ high |
| `--color-text-secondary` | `#7c7c7c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#262626` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#262626` | 16.4% | 0.0 | 38.0 |
| `#9a9b9b` | 14.3% | 0.006 | 154.8 |
| `#0e0e0f` | 13.3% | 0.067 | 14.1 |
| `#7c7c7c` | 13.2% | 0.0 | 124.0 |
| `#bcbdbd` | 11.7% | 0.005 | 188.8 |

Median `#2e2e2e` · dominant `#262626` · chroma peak `#0e0e0f`.

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
  --color-bg-primary: #0e0e0f;
  --color-bg-secondary: #262626;
  --color-text-primary: #bcbdbd;
  --color-text-secondary: #7c7c7c;
  --color-border-primary: #262626;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
