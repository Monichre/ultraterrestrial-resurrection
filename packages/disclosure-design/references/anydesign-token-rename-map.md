---
title: AnyDesign token rename map
description: Map AnyDesign/DTCG and Vercel-export CSS variables onto assembling-components token names.
type: reference
created: 2026-08-13
author: agent
tags: [reference, anydesign, tokens, assembling-components]
source_repo: mixed
source_url: https://github.com/uxKero/anydesign
source_path: examples/vercel-landing/claude-design-bundle/tokens.css
captured_at: 2026-08-13
skill_chain_stage: theming
framework: any
motion: tokenized
---

# AnyDesign token rename map

## Summary

AnyDesign emits source-faithful names. assembling-components validators expect semantic `--color-*` / `--spacing-*` / `--font-size-*` / `--radius-*` / `--shadow-*` / `--duration-*`. Rename at the `tokens.css` boundary. Do not keep both names in component CSS.

## Key points

### Color (AnyDesign / Vercel export → assembling)

| Observed | Assembling |
| --- | --- |
| `--color-background-100`, `colors.surface`, `#FFFFFF` | `--color-bg-primary` |
| `--color-background-200`, `--color-gray-100` | `--color-bg-secondary` |
| `--color-gray-1000`, `colors.text-primary` | `--color-text-primary` |
| `--color-gray-900` / `--color-gray-700` | `--color-text-secondary` |
| `--color-gray-200` / `--color-gray-400` | `--color-border-primary` |
| `--color-blue-700` (`#0070F7`) or `{colors.primary}` | `--color-primary` (only if it is the CTA role) |
| `--color-green-700` / `success` | `--color-success` |
| `--color-amber-700` / `warning` | `--color-warning` |
| `--color-red-700` / `error`/`danger` | `--color-error` |
| `--color-blue-600` / `info` | `--color-info` |
| Remaining scale steps | Keep as extra `--color-*` aliases in `:root`; components still use semantic names |
| Chart series | Assign `--chart-color-1` … in order of observed data hues — do not invent extra hues |

Lumen Notes example (`examples/landing-example/design.md`): `colors.bg` `#0F172A` → dark `--color-bg-primary`; `colors.accent` `#10B981` → `--color-primary` with MotionViz-style scarcity (CTA + wordmark only).

### Spacing (4px base)

| Observed | Assembling |
| --- | --- |
| `--spacing-base` / `spacing.base: 4px` / `space-1` | `--spacing-xs` (`--space-1`) |
| `--spacing-2x` / 8px | `--spacing-sm` |
| `--spacing-3x` / 12px | `--space-3` (no xs/sm/md alias required) |
| `--spacing-4x` / 16px | `--spacing-md` |
| `--spacing-6x` / 24px | `--spacing-lg` |
| `--spacing-8x` / 32px | `--spacing-xl` |
| `--spacing-16x` / 64px | `--spacing-2xl` / `--space-16` |

Container widths (`--container-geist-page-width: 1200px`) stay hardcoded — validation exceptions.

### Type

| Observed | Assembling |
| --- | --- |
| `--typography-font-size-xs` … `--typography-font-size-3xl` | `--font-size-xs` … `--font-size-3xl` |
| `--typography-font-family-sans` | `--font-sans` |
| `--typography-letter-spacing-tight` | `--letter-spacing-tight` (definition only; components use `var()`) |

### Radius, shadow, motion, z-index, focus

| Observed | Assembling |
| --- | --- |
| `--radius-default` 6px / `--radius-marketing` 8px | `--radius-sm` (4px) or `--radius-md` (8px) — pick nearest observed, do not invent 4px if unseen |
| `--radius-modal` 12px | `--radius-lg` |
| `--shadow-small` / `--shadow-medium` | `--shadow-sm` / `--shadow-md` |
| `--shadow-xl` / `--shadow-2xl` | `--shadow-xl` / `--shadow-2xl` |
| `--motion-duration-fast` 150ms | `--duration-fast` |
| `--motion-duration-popover` 200ms | `--duration-normal` |
| `--motion-duration-overlay` 300ms | `--duration-slow` |
| `--motion-ease-out` | bake into `--transition-fast` / `--transition-normal` |
| `--focus-ring` with hex | `--shadow-focus` using `var(--color-primary)` — no hex in component CSS |
| Overlay/dropdown z | `--z-dropdown` … `--z-toast` |

### DTCG JSON

`color.primary.$value` → `--color-primary`. `spacing.4.$value` `16px` → `--spacing-md`. Confidence in `$extensions.anydesign.confidence` does not become a CSS token. Skip tokens with low confidence unless the user confirms.

## Citations

- URL: [https://github.com/uxKero/anydesign](https://github.com/uxKero/anydesign)
- Path: `examples/vercel-landing/claude-design-bundle/tokens.css`
- Path: `examples/landing-example/design.md`
- Path: `references/token-extraction.md`
- Path: assembling-components `references/token-validation-rules.md` and `SKILL.md` naming tables

## Mapping to assembling-components

This table *is* the mapping. After rename, [token-first assembly](../concepts/token-first-assembly.md) applies unchanged.

## Where this is used

- [AnyDesign assembly bridge](../concepts/anydesign-assembly-bridge.md)
- [Reduced motion](../concepts/reduced-motion.md)
- [Agent runbook](../notes/assembling-agent-runbook.md)
