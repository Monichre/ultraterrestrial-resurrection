---
title: design-tokens — dotgrid-journal-page-02
description: Pixel-grounded token sheet for dotgrid-journal-page-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dotgrid-journal-page-02`

Source still: `./dotgrid-journal-page-02.png` · 928×1232 · PNG · polarity **dark** (mean luma 99.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dotgrid-journal-page](../dotgrid-journal-page/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#0a0707` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#39251d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c3a796` | max-contrast swatch vs bg-primary (8.88:1) | ✅ high |
| `--color-text-secondary` | `#7b5b4a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#0a0707` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#39251d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#a0806d` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#c3a796` | 14.4% | 0.231 | 171.7 |
| `#0a0707` | 13.9% | 0.3 | 7.6 |
| `#a0806d` | 12.4% | 0.319 | 133.4 |
| `#7b5b4a` | 12.0% | 0.398 | 96.6 |
| `#39251d` | 9.3% | 0.491 | 40.7 |

Median `#91715f` · dominant `#c3a796` · chroma peak `#39251d`.

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
  --color-bg-primary: #0a0707;
  --color-bg-secondary: #39251d;
  --color-text-primary: #c3a796;
  --color-text-secondary: #7b5b4a;
  --color-border-primary: #0a0707;
  --color-primary: #39251d;
  --chart-color-1: #a0806d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
