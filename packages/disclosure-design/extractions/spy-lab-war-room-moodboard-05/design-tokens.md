---
title: design-tokens — spy-lab-war-room-moodboard-05
description: Pixel-grounded token sheet for spy-lab-war-room-moodboard-05 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `spy-lab-war-room-moodboard-05`

Source still: `./spy-lab-war-room-moodboard-05.png` · 928×1232 · PNG · polarity **dark** (mean luma 72.3).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [spy-lab-war-room-moodboard](../spy-lab-war-room-moodboard/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#000000` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#191013` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#eae5dc` | max-contrast swatch vs bg-primary (16.74:1) | ✅ high |
| `--color-text-secondary` | `#8c7866` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#000000` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#8c7866` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#000000` | 19.8% | 0.0 | 0.0 |
| `#eae5dc` | 14.4% | 0.06 | 229.4 |
| `#8c7866` | 13.3% | 0.271 | 123.0 |
| `#b3a99f` | 10.7% | 0.112 | 170.4 |
| `#262525` | 9.9% | 0.026 | 37.2 |

Median `#191013` · dominant `#000000` · chroma peak `#8c7866`.

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
  --color-bg-secondary: #191013;
  --color-text-primary: #eae5dc;
  --color-text-secondary: #8c7866;
  --color-border-primary: #000000;
  --color-primary: #8c7866;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
