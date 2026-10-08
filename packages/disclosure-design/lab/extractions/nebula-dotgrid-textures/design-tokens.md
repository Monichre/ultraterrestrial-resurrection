---
title: design-tokens — nebula-dotgrid-textures
description: Pixel-grounded token sheet for nebula-dotgrid-textures (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `nebula-dotgrid-textures`

Source still: `./nebula-dotgrid-textures.png` · 1920×1205 · PNG · polarity **dark** (mean luma 44.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#11180b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#212a17` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#717a5c` | max-contrast swatch vs bg-primary (4.0:1) | ✅ high |
| `--color-text-secondary` | `#404c30` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#212a17` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#11180b` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#252d1a` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#252d1a` | 14.3% | 0.422 | 41.9 |
| `#404c30` | 13.9% | 0.368 | 71.4 |
| `#11180b` | 13.8% | 0.542 | 21.6 |
| `#717a5c` | 9.7% | 0.246 | 117.9 |

Median `#212a17` · dominant `#252d1a` · chroma peak `#11180b`.

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
  --color-bg-primary: #11180b;
  --color-bg-secondary: #212a17;
  --color-text-primary: #717a5c;
  --color-text-secondary: #404c30;
  --color-border-primary: #212a17;
  --color-primary: #11180b;
  --chart-color-1: #252d1a;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
