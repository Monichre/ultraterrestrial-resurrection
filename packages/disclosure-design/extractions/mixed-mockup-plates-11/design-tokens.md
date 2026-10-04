---
title: design-tokens — mixed-mockup-plates-11
description: Pixel-grounded token sheet for mixed-mockup-plates-11 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `mixed-mockup-plates-11`

Source still: `./mixed-mockup-plates-11.png` · 1920×1284 · PNG · polarity **dark** (mean luma 50.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [mixed-mockup-plates](../mixed-mockup-plates/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#08141c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#102626` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#6fb389` | max-contrast swatch vs bg-primary (7.53:1) | ✅ high |
| `--color-text-secondary` | `#326049` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#102626` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#08141c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#1f3f35` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#1f3f35` | 13.9% | 0.508 | 55.5 |
| `#08141c` | 13.6% | 0.714 | 18.0 |
| `#326049` | 12.8% | 0.479 | 84.6 |
| `#6fb389` | 10.8% | 0.38 | 161.5 |

Median `#102626` · dominant `#1f3f35` · chroma peak `#08141c`.

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
  --color-bg-primary: #08141c;
  --color-bg-secondary: #102626;
  --color-text-primary: #6fb389;
  --color-text-secondary: #326049;
  --color-border-primary: #102626;
  --color-primary: #08141c;
  --chart-color-1: #1f3f35;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
