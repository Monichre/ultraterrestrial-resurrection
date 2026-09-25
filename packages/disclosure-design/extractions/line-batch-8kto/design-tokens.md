---
title: design-tokens — line-batch-8kto
description: Pixel-grounded token sheet for line-batch-8kto (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, gold]
---

# Design tokens — `line-batch-8kto`

Source still: `./line-batch-8kto.png` · 928×1232 · PNG · polarity **light** (mean luma 167.1).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **gold**.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dad1c4` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c8beb3` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0e0e0e` | max-contrast swatch vs bg-primary (12.78:1) | ✅ high |
| `--color-text-secondary` | `#907e6c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#c8beb3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#907e6c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#dad1c4` | 17.9% | 0.101 | 210.0 |
| `#b5aba0` | 14.0% | 0.116 | 172.3 |
| `#0e0e0e` | 12.4% | 0.0 | 14.0 |
| `#907e6c` | 8.4% | 0.25 | 128.5 |

Median `#c8beb3` · dominant `#dad1c4` · chroma peak `#907e6c`.

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
  --color-bg-primary: #dad1c4;
  --color-bg-secondary: #c8beb3;
  --color-text-primary: #0e0e0e;
  --color-text-secondary: #907e6c;
  --color-border-primary: #c8beb3;
  --color-primary: #907e6c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
