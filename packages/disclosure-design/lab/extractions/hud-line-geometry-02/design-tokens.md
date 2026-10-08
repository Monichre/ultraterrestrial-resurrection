---
title: design-tokens — hud-line-geometry-02
description: Pixel-grounded token sheet for hud-line-geometry-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `hud-line-geometry-02`

Source still: `./hud-line-geometry-02.png` · 928×1232 · PNG · polarity **light** (mean luma 160.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [hud-line-geometry](../hud-line-geometry/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#d3cfc9` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#bdb7ae` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#242220` | max-contrast swatch vs bg-primary (10.22:1) | ✅ high |
| `--color-text-secondary` | `#6c6760` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#bdb7ae` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#d3cfc9` | 16.9% | 0.047 | 207.4 |
| `#242220` | 14.8% | 0.111 | 34.3 |
| `#b6afa6` | 13.6% | 0.088 | 175.8 |
| `#a19a92` | 13.5% | 0.093 | 154.9 |
| `#6c6760` | 7.3% | 0.111 | 103.6 |

Median `#bdb7ae` · dominant `#d3cfc9` · chroma peak `#242220`.

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
  --color-bg-primary: #d3cfc9;
  --color-bg-secondary: #bdb7ae;
  --color-text-primary: #242220;
  --color-text-secondary: #6c6760;
  --color-border-primary: #bdb7ae;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
