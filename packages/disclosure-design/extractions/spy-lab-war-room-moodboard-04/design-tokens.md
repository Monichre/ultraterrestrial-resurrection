---
title: design-tokens — spy-lab-war-room-moodboard-04
description: Pixel-grounded token sheet for spy-lab-war-room-moodboard-04 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `spy-lab-war-room-moodboard-04`

Source still: `./spy-lab-war-room-moodboard-04.png` · 928×1232 · PNG · polarity **dark** (mean luma 92.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [spy-lab-war-room-moodboard](../spy-lab-war-room-moodboard/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#020303` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#222120` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#d7d3c7` | max-contrast swatch vs bg-primary (13.8:1) | ✅ high |
| `--color-text-secondary` | `#a5896c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#5d4f42` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#a5896c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#222120` | 14.4% | 0.059 | 33.1 |
| `#020303` | 14.1% | 0.333 | 2.8 |
| `#a5896c` | 13.4% | 0.345 | 140.9 |
| `#b6a993` | 13.2% | 0.192 | 170.2 |
| `#d7d3c7` | 12.0% | 0.074 | 211.0 |

Median `#5d4f42` · dominant `#222120` · chroma peak `#a5896c`.

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
  --color-bg-primary: #020303;
  --color-bg-secondary: #222120;
  --color-text-primary: #d7d3c7;
  --color-text-secondary: #a5896c;
  --color-border-primary: #5d4f42;
  --color-primary: #a5896c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
