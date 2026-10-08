---
title: design-tokens — nasa-dossier-1978-02
description: Pixel-grounded token sheet for nasa-dossier-1978-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `nasa-dossier-1978-02`

Source still: `./nasa-dossier-1978-02.png` · 1232×928 · PNG · polarity **light** (mean luma 135.5).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [nasa-dossier-1978](../nasa-dossier-1978/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#cab99c` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#b7a388` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#623c47` | max-contrast swatch vs bg-primary (4.84:1) | ✅ high |
| `--color-text-secondary` | `#7f6859` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#9e8972` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#623c47` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#9c8168` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#9c8168` | 14.6% | 0.333 | 132.9 |
| `#7f6859` | 14.5% | 0.299 | 107.8 |
| `#b7a388` | 14.5% | 0.257 | 165.3 |
| `#cab99c` | 12.0% | 0.228 | 186.5 |
| `#623c47` | 9.4% | 0.388 | 68.9 |

Median `#9e8972` · dominant `#9c8168` · chroma peak `#623c47`.

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
  --color-bg-primary: #cab99c;
  --color-bg-secondary: #b7a388;
  --color-text-primary: #623c47;
  --color-text-secondary: #7f6859;
  --color-border-primary: #9e8972;
  --color-primary: #623c47;
  --chart-color-1: #9c8168;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
