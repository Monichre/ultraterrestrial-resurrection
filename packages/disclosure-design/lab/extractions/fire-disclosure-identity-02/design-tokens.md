---
title: design-tokens — fire-disclosure-identity-02
description: Pixel-grounded token sheet for fire-disclosure-identity-02 (Pillow median-cut sample + assembling-components canon).
type: note
created: 2026-08-13
author: agent
tags: [folderize, design-tokens, batch]
---

# Design tokens — `fire-disclosure-identity-02`

Source still: `./fire-disclosure-identity-02.png` · 1024×1024 · PNG · polarity **light** (mean luma 123.6).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **batch** (cluster rep: [fire-disclosure-identity](../fire-disclosure-identity/)).

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#bdb6a7` | lightest of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `#9fa096` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `#0c0e0e` | max-contrast swatch vs bg-primary (9.6:1) | ✅ high |
| `--color-text-secondary` | `#454b4c` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `#9fa096` | lowest-sat swatch near bg luma | ⚠️ medium |
| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |


Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
| `#bdb6a7` | 17.3% | 0.116 | 182.4 |
| `#212325` | 15.0% | 0.108 | 34.7 |
| `#0c0e0e` | 11.5% | 0.143 | 13.6 |
| `#454b4c` | 10.6% | 0.092 | 73.8 |
| `#878a83` | 9.8% | 0.051 | 136.9 |

Median `#9fa096` · dominant `#bdb6a7` · chroma peak `#0c0e0e`.

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
  --color-bg-primary: #bdb6a7;
  --color-bg-secondary: #9fa096;
  --color-text-primary: #0c0e0e;
  --color-text-secondary: #454b4c;
  --color-border-primary: #9fa096;
  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
}
```
