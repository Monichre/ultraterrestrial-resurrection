---
title: design-tokens — dossier-art-covers-10
description: Pixel-grounded token sheet for dossier-art-covers-10 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-10`

Source still: `./dossier-art-covers-10.png` · 1024×1536 · PNG · polarity **dark** (mean luma 105.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#2a2921` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#7b6235` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#bba366` | max-contrast swatch vs bg-primary (5.94:1) | ✅ high |
| `--color-text-secondary` | `#91763f` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#2a2921` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#7b6235` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#9c8047` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#2a2921` | 16.0% | 0.214 | 40.6 |
| `#bba366` | 13.9% | 0.455 | 163.7 |
| `#9c8047` | 13.8% | 0.545 | 129.8 |
| `#7b6235` | 10.1% | 0.569 | 100.1 |

Median `#91763f` · dominant `#2a2921` · chroma peak `#9c8047`.

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
  --color-bg-primary: #2a2921;
  --color-bg-secondary: #7b6235;
  --color-text-primary: #bba366;
  --color-text-secondary: #91763f;
  --color-border-primary: #2a2921;
  --color-primary: #7b6235;
  --chart-color-1: #9c8047;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
