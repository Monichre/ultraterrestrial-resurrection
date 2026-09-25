---
title: design-tokens — spy-lab-war-room-moodboard-03
description: Pixel-grounded token sheet for spy-lab-war-room-moodboard-03 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `spy-lab-war-room-moodboard-03`

Source still: `./spy-lab-war-room-moodboard-03.png` · 928×1232 · PNG · polarity **dark** (mean luma 105.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [spy-lab-war-room-moodboard](../spy-lab-war-room-moodboard/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#272825` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#695e4b` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#bdb49b` | max-contrast swatch vs bg-primary (7.18:1) | ✅ high |
| `--color-text-secondary` | `#877d66` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#7f7056` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#695e4b` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#ab9e80` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#272825` | 17.9% | 0.075 | 39.6 |
| `#ab9e80` | 14.3% | 0.251 | 158.6 |
| `#877d66` | 13.1% | 0.244 | 125.5 |
| `#bdb49b` | 12.3% | 0.18 | 180.1 |
| `#695e4b` | 11.0% | 0.286 | 95.0 |

Median `#7f7056` · dominant `#272825` · chroma peak `#695e4b`.

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
  --color-bg-primary: #272825;
  --color-bg-secondary: #695e4b;
  --color-text-primary: #bdb49b;
  --color-text-secondary: #877d66;
  --color-border-primary: #7f7056;
  --color-primary: #695e4b;
  --chart-color-1: #ab9e80;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
