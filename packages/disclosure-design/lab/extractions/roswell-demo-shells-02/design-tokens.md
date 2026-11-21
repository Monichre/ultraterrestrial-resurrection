---
title: design-tokens — roswell-demo-shells-02
description: Pixel-grounded token sheet for roswell-demo-shells-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `roswell-demo-shells-02`

Source still: `./roswell-demo-shells-02.png` · 1024×1536 · PNG · polarity **light** (mean luma 125.9).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [roswell-demo-shells](../roswell-demo-shells/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#bbae98` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#ab9e86` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#1a1a18` | max-contrast swatch vs bg-primary (7.98:1) | ✅ high |
| `--color-text-secondary` | `#6b5f4f` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#ab9e86` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#6b5f4f` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |
| `--chart-color-1` | `#998d79` | remaining saturated swatch, share order | ⚠️ medium |

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#bbae98` | 20.1% | 0.187 | 175.2 |
| `#332f29` | 15.9% | 0.196 | 47.4 |
| `#6b5f4f` | 11.4% | 0.262 | 96.4 |
| `#998d79` | 10.1% | 0.209 | 142.1 |
| `#1a1a18` | 9.3% | 0.077 | 25.9 |

Median `#ab9e86` · dominant `#bbae98` · chroma peak `#6b5f4f`.

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
  --color-bg-primary: #bbae98;
  --color-bg-secondary: #ab9e86;
  --color-text-primary: #1a1a18;
  --color-text-secondary: #6b5f4f;
  --color-border-primary: #ab9e86;
  --color-primary: #6b5f4f;
  --chart-color-1: #998d79;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
