---
title: design-tokens — dossier-art-covers-02
description: Pixel-grounded token sheet for dossier-art-covers-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dossier-art-covers-02`

Source still: `./dossier-art-covers-02.png` · 1536×1024 · PNG · polarity **dark** (mean luma 59.0).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dossier-art-covers](../dossier-art-covers/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#020201` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#1e1914` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#a39075` | max-contrast swatch vs bg-primary (6.72:1) | ✅ high |
| `--color-text-secondary` | `#705f49` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#3f3225` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#020201` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#847159` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#020201` | 16.8% | 0.5 | 1.9 |
| `#705f49` | 15.9% | 0.348 | 97.0 |
| `#a39075` | 12.3% | 0.282 | 146.1 |
| `#847159` | 12.2% | 0.326 | 115.3 |
| `#1e1914` | 10.4% | 0.333 | 25.7 |

Median `#3f3225` · dominant `#020201` · chroma peak `#020201`.

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
  --color-bg-primary: #020201;
  --color-bg-secondary: #1e1914;
  --color-text-primary: #a39075;
  --color-text-secondary: #705f49;
  --color-border-primary: #3f3225;
  --color-primary: #020201;
  --chart-color-1: #847159;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
