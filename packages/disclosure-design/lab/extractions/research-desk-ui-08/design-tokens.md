---
title: design-tokens — research-desk-ui-08
description: Pixel-grounded token sheet for research-desk-ui-08 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `research-desk-ui-08`

Source still: `./research-desk-ui-08.webp` · 1586×992 · WEBP · polarity **dark** (mean luma 26.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [research-desk-ui](../research-desk-ui/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#10181b` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#10181c` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#434a45` | max-contrast swatch vs bg-primary (1.97:1) | ✅ high |
| `--color-text-secondary` | `#434a45` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#10181b` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#10181c` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#10181c` | 20.8% | 0.429 | 22.6 |
| `#434a45` | 4.0% | 0.095 | 72.2 |

Median `#10181b` · dominant `#10181c` · chroma peak `#10181c`.

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
  --color-bg-primary: #10181b;
  --color-bg-secondary: #10181c;
  --color-text-primary: #434a45;
  --color-text-secondary: #434a45;
  --color-border-primary: #10181b;
  --color-primary: #10181c;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
