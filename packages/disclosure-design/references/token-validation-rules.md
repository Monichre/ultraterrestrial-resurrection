---
title: Token validation rules
description: Severity table and exceptions for validate_tokens.py — errors block delivery.
type: reference
created: 2026-08-13
author: agent
tags: [reference, tokens, validation, assembling-components]
source_repo: assembling-components
source_url: ""
source_path: skills/assembling-components/references/token-validation-rules.md
captured_at: 2026-08-13
skill_chain_stage: theming
framework: any
motion: tokenized
---

# Token validation rules

## Summary

`validate_tokens.py` scans CSS for hardcoded values that should be design tokens. Errors fail CI; warnings should be fixed; info appears only with `--strict`.

## Key points

**Errors:** hex/rgb/hsl/rgba colors; spacing ≥4px on padding/margin/gap/inset; hardcoded `font-size`.

**Warnings:** `border-radius`, `box-shadow`, `z-index` ≥100.

**Info (strict):** transition timing (`150ms` → `--duration-fast` / `--transition-fast`).

**Always allowed:** CSS keywords (`currentColor`, `transparent`, `inherit`, …); `0`/`1px`/`2px`; percentages; container widths (`1400px`, `1200px`, `1024px`); breakpoints (`768px`, `640px`, `480px`); grid functions; lines starting with `--`; comments; `@media` query lines; `@keyframes`; properties `outline`, `transform`, `animation`, `content`, `clip-path`, `mask`.

Common color maps (library): `#FA582D` → `--color-primary` / `--color-cyber-orange`; `#00C0E8` → `--color-info`; `#00CC66` → `--color-success`; `#FFCB06` → `--color-warning`; `#C84727` → `--color-error`.

Spacing (4px base): `4px` `--spacing-xs`, `8px` `--spacing-sm`, `16px` `--spacing-md`, `24px` `--spacing-lg`, `32px` `--spacing-xl`.

Z-index: `--z-dropdown` 1000 through `--z-toast` 1080.

```bash
python scripts/validate_tokens.py src/styles
python scripts/validate_tokens.py src --strict --fix-suggestions
python scripts/validate_tokens.py src --json
```

## Citations

- Path: `skills/assembling-components/references/token-validation-rules.md`
- Path: `skills/assembling-components/scripts/validate_tokens.py` (`TOKEN_MAPS`, `VALIDATION_RULES`)
- Path: `skills/assembling-components/SKILL.md` (Token Validation section)

## Mapping to assembling-components

Run this **before** wiring components and again as the last CSS gate. AnyDesign hex belongs only on `--*` definition lines so the scanner skips them.

## Where this is used

- [Token-first assembly](../concepts/token-first-assembly.md)
- [Validation gates](../concepts/validation-gates.md)
- [AnyDesign assembly bridge](../concepts/anydesign-assembly-bridge.md)
- [Production checklist](./assembling-production-checklist.md)
