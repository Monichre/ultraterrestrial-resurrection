---
title: Token-first assembly
description: Assembled UI may only theme through CSS custom properties that follow assembling-components naming.
type: concept
created: 2026-08-13
author: agent
tags: [concept, tokens, assembling-components]
skill_chain_stage: theming
tokens:
  - "--color-*"
  - "--spacing-*"
  - "--font-size-*"
  - "--radius-*"
  - "--shadow-*"
  - "--chart-color-*"
  - "--z-*"
  - "--duration-*"
framework: any
motion: tokenized
source_repo: assembling-components
---

# Token-first assembly

## Definition

Every themeable value in an assembled UI is a CSS custom property. Component CSS, inline styles, and Tailwind arbitrary values must reference `var(--…)`, not literals. Token **definitions** (lines that start with `--` inside `tokens.css`) are the only place hex, rem scales, and shadow recipes may appear.

## Why it matters for assembling-components

Dark mode, brand swaps, and chart palettes all switch through `[data-theme]`. Hardcoded `#FA582D` or `16px` in a component file breaks theme toggle, fails `validate_tokens.py`, and desyncs AnyDesign-extracted systems from the skill chain.

## Constraints

Required prefixes:

| Category | Prefix | Notes |
| --- | --- | --- |
| Color | `--color-*` | Semantic: `primary`, `success`, `bg-primary`, `text-secondary` |
| Spacing | `--spacing-*` | 4px base; `--space-N` aliases allowed |
| Type | `--font-size-*` | Also `--font-weight-*` when used |
| Radius | `--radius-*` | Warning if hardcoded |
| Shadow | `--shadow-*` | Warning if hardcoded |
| Charts | `--chart-color-*` | Required for visualizing-data |
| Stack | `--z-*` | Warning for z-index ≥100 |
| Motion | `--duration-*`, `--transition-*` | Strict-mode info if hardcoded |

`tokens.css` must cover **seven categories**: colors, spacing, typography, borders, shadows, motion, z-index.

Import order is part of the contract: `tokens.css` → `globals.css` → components. See [root providers](./root-providers.md).

Exceptions (always allowed): `currentColor`, `transparent`, `inherit`, `0`/`1px`/`2px`, percentages, container max-widths, media-query breakpoints, `@keyframes` percentages, `outline` / `transform` / `clip-path`. Full table: [token validation rules](../references/token-validation-rules.md).

## Related

- [Skill chain](./skill-chain.md)
- [Validation gates](./validation-gates.md)
- [AnyDesign assembly bridge](./anydesign-assembly-bridge.md)
- [AnyDesign token rename map](../references/anydesign-token-rename-map.md)
