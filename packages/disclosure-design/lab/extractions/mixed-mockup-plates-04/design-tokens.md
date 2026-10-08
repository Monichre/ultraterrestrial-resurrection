---
title: design-tokens — mixed-mockup-plates-04
description: Pixel-grounded token sheet for mixed-mockup-plates-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `mixed-mockup-plates-04`

Source still: `./mixed-mockup-plates-04.png` · 1023×1537 · PNG · polarity **dark** (mean luma 55.4).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [mixed-mockup-plates](../mixed-mockup-plates/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#101112` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1a1a18` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c6b4a0` | max-contrast swatch vs bg-primary (9.39:1) | ✅ high |
| `--color-text-secondary` | `#756a5a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#1a1a18` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |
| `--chart-color-1` | `#292520` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#101112` | 18.9% | 0.111 | 16.9 |
| `#c6b4a0` | 15.9% | 0.192 | 182.4 |
| `#292520` | 14.4% | 0.22 | 37.5 |
| `#756a5a` | 6.1% | 0.231 | 107.2 |

Median `#1a1a18` · dominant `#101112` · chroma peak `#292520`.

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
  --color-bg-primary: #101112;
  --color-bg-secondary: #1a1a18;
  --color-text-primary: #c6b4a0;
  --color-text-secondary: #756a5a;
  --color-border-primary: #1a1a18;
  --chart-color-1: #292520;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
