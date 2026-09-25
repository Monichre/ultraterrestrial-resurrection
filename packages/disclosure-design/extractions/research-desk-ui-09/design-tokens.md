---
title: design-tokens — research-desk-ui-09
description: Pixel-grounded token sheet for research-desk-ui-09 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `research-desk-ui-09`

Source still: `./research-desk-ui-09.png` · 1586×992 · PNG · polarity **dark** (mean luma 26.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [research-desk-ui](../research-desk-ui/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#10181c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#10191d` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#444b45` | max-contrast swatch vs bg-primary (2.0:1) | ✅ high |
| `--color-text-secondary` | `#444b45` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#10181c` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#10191d` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#10191d` | 18.5% | 0.448 | 23.4 |
| `#444b45` | 3.9% | 0.093 | 73.1 |

Median `#10181c` · dominant `#10191d` · chroma peak `#10191d`.

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
  --color-bg-primary: #10181c;
  --color-bg-secondary: #10191d;
  --color-text-primary: #444b45;
  --color-text-secondary: #444b45;
  --color-border-primary: #10181c;
  --color-primary: #10191d;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
