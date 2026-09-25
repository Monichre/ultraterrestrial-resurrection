---
title: design-tokens — hud-reverse-batch-02
description: Pixel-grounded token sheet for hud-reverse-batch-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-reverse-batch-02`

Source still: `./hud-reverse-batch-02.png` · 1232×928 · PNG · polarity **light** (mean luma 119.8).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-reverse-batch](../hud-reverse-batch/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#dcd2c3` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#c6baa9` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#060606` | max-contrast swatch vs bg-primary (13.56:1) | ✅ high |
| `--color-text-secondary` | `#a6876a` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#dcd2c3` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#a6876a` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#c2a383` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#060606` | 16.0% | 0.0 | 6.0 |
| `#dcd2c3` | 14.5% | 0.114 | 211.0 |
| `#c2a383` | 14.3% | 0.325 | 167.3 |
| `#c6baa9` | 12.6% | 0.146 | 187.3 |
| `#a6876a` | 10.9% | 0.361 | 139.5 |

Median `#bc9a77` · dominant `#060606` · chroma peak `#a6876a`.

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
  --color-bg-primary: #dcd2c3;
  --color-bg-secondary: #c6baa9;
  --color-text-primary: #060606;
  --color-text-secondary: #a6876a;
  --color-border-primary: #dcd2c3;
  --color-primary: #a6876a;
  --chart-color-1: #c2a383;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
