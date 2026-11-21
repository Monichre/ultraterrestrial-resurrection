---
title: design-tokens — spy-lab-war-room-moodboard-08
description: Pixel-grounded token sheet for spy-lab-war-room-moodboard-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `spy-lab-war-room-moodboard-08`

Source still: `./spy-lab-war-room-moodboard-08.png` · 928×1232 · PNG · polarity **dark** (mean luma 101.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [spy-lab-war-room-moodboard](../spy-lab-war-room-moodboard/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#040000` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#5f423c` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#dfd5c3` | max-contrast swatch vs bg-primary (14.37:1) | ✅ high |
| `--color-text-secondary` | `#696050` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#696050` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#040000` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#b89f78` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#b89f78` | 14.8% | 0.348 | 161.5 |
| `#040000` | 14.4% | 1.0 | 0.9 |
| `#5f423c` | 13.5% | 0.368 | 71.7 |
| `#bdc1b3` | 13.2% | 0.073 | 191.1 |
| `#dfd5c3` | 11.6% | 0.126 | 213.8 |

Median `#696050` · dominant `#b89f78` · chroma peak `#040000`.

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
  --color-bg-primary: #040000;
  --color-bg-secondary: #5f423c;
  --color-text-primary: #dfd5c3;
  --color-text-secondary: #696050;
  --color-border-primary: #696050;
  --color-primary: #040000;
  --chart-color-1: #b89f78;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
