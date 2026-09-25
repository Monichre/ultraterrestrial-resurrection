---
title: design-tokens — spy-lab-war-room-moodboard-06
description: Pixel-grounded token sheet for spy-lab-war-room-moodboard-06 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `spy-lab-war-room-moodboard-06`

Source still: `./spy-lab-war-room-moodboard-06.png` · 928×1232 · PNG · polarity **dark** (mean luma 55.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [spy-lab-war-room-moodboard](../spy-lab-war-room-moodboard/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#000000` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1f1c18` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#c8b38d` | max-contrast swatch vs bg-primary (10.29:1) | ✅ high |
| `--color-text-secondary` | `#ba8f5f` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#000000` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#ba8f5f` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#4b3b30` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000000` | 20.3% | 0.0 | 0.0 |
| `#23221d` | 18.6% | 0.171 | 33.9 |
| `#ba8f5f` | 14.0% | 0.489 | 148.7 |
| `#c8b38d` | 12.4% | 0.295 | 180.7 |
| `#4b3b30` | 7.3% | 0.36 | 61.6 |

Median `#1f1c18` · dominant `#000000` · chroma peak `#ba8f5f`.

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
  --color-bg-primary: #000000;
  --color-bg-secondary: #1f1c18;
  --color-text-primary: #c8b38d;
  --color-text-secondary: #ba8f5f;
  --color-border-primary: #000000;
  --color-primary: #ba8f5f;
  --chart-color-1: #4b3b30;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
