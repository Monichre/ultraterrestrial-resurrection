---
title: design-tokens — dystopian-cosmic-dread-02
description: Pixel-grounded token sheet for dystopian-cosmic-dread-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `dystopian-cosmic-dread-02`

Source still: `./dystopian-cosmic-dread-02.png` · 928×1232 · PNG · polarity **dark** (mean luma 57.7).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [dystopian-cosmic-dread](../dystopian-cosmic-dread/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#27211c` | darkest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#382e24` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#8b7d5a` | max-contrast swatch vs bg-primary (3.92:1) | ✅ high |
| `--color-text-secondary` | `#62563d` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#382e24` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | `#4e412f` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#62563d` | 13.7% | 0.378 | 86.7 |
| `#4e412f` | 13.6% | 0.397 | 66.5 |
| `#27211c` | 13.4% | 0.282 | 33.9 |
| `#8b7d5a` | 11.0% | 0.353 | 125.4 |

Median `#382e24` · dominant `#62563d` · chroma peak `#4e412f`.

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
  --color-bg-primary: #27211c;
  --color-bg-secondary: #382e24;
  --color-text-primary: #8b7d5a;
  --color-text-secondary: #62563d;
  --color-border-primary: #382e24;
  --color-primary: #4e412f;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
