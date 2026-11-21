---
title: AnyDesign assembly bridge
description: How AnyDesign extraction becomes assembling-components tokens, directories, and scaffolding without inventing values.
type: concept
created: 2026-08-13
author: agent
tags: [concept, anydesign, assembling-components]
skill_chain_stage: theming
tokens:
  - "--color-*"
  - "--spacing-*"
framework: any
motion: tokenized
source_repo: mixed
---

# AnyDesign assembly bridge

## Definition

[AnyDesign](https://github.com/uxKero/anydesign) is a **design diagnostics** skill. It turns images, URLs, or Figma into `design.md` (7-section spec) plus optional `design-tokens.json` (W3C DTCG) or `element.md`. Assembling-components is the **implementation** skill. This bridge is the remap: observed system → assembling-components contract.

Honesty rule from AnyDesign: inventing tokens is worse than saying "not enough info". That rule survives assembly. Unmapped values stay in Open Questions; they do not become guessed `--color-*` entries.

## Why it matters for assembling-components

AnyDesign names tokens after the source (`--color-background-100`, `--motion-duration-popover`, `{colors.accent}`). Assembling-components validators look for `--color-bg-primary`, `--duration-normal`, `--chart-color-*`. If you paste AnyDesign CSS into `src/components`, `validate_tokens.py` fails and the skill chain never sees a `ThemeProvider`.

## Constraints

### Full mode → skill-chain outputs

| AnyDesign layer | Assembling landing |
| --- | --- |
| Layer 2 System / DTCG JSON | `src/styles/tokens.css` after [rename](../references/anydesign-token-rename-map.md) |
| Layer 3.1 Generic components (Button, Input, Card, Badge, Modal, Toast) | `src/components/ui/` + `feedback/` for Toast |
| Layer 3.2 Signature components | `src/components/features/` or `layout/` — do not force a signature if AnyDesign said none |
| Layer 4 Layout (grid, nav, sidebar, hero) | `src/components/layout/` (`Layout`, `Header`, `Sidebar`) |
| Metrics / chart-like modules | `src/components/charts/` + `--chart-color-*` |
| Layer 5 Suggested stack | [Framework selection](./framework-selection.md) — evidence-based, not assumed Tailwind |
| Layer 6 Do's/Don'ts | Brand rules in comments and token scarcity (e.g. accent only on CTA) |
| `design-a11y.md` contrast pairs | Keep pairs when mapping to `--color-text-primary` on `--color-bg-primary` |

### Element mode

| Kind | Assembly action |
| --- | --- |
| `code` | Rebuild as a named-export component in the matching directory; tokens still remapped |
| `asset` | Do **not** CSS-validate generated art. Keep the token-grounded prompt out of `tokens.css` except palette hexes you actually use in `:root` |
| `hybrid` | Split: code shell into components; nested asset stays an image |

### Token validity while using AnyDesign

1. Prefer extracted CSS custom properties over vision-inferred hex (AnyDesign: extracted vars are high confidence).
2. Rename into assembling prefixes **before** any component file is written.
3. Put hex only on `--*` definition lines in `tokens.css` / `[data-theme="dark"]`.
4. Spacing: if AnyDesign inferred 4px base, map onto `--spacing-xs` = 4px, `--spacing-sm` = 8px, … If it inferred 8px base, still emit the assembling 4px-named scale (skip unused steps) — do not invent unseen multiples.
5. Run `python scripts/lint_design_md.py` on the spec, then `validate_tokens.py` on the assembled `src`.

CLI companions (no Claude required): `extract_css_vars.py`, `capture_site.py`, `check_contrast.py`, `verify_design.py` (drift vs live URL). Cite [AnyDesign repo](../references/anydesign-repo.md).

## Related

- [Token-first assembly](./token-first-assembly.md)
- [Skill chain](./skill-chain.md)
- [MotionViz assembly bridge](./motionviz-assembly-bridge.md)
- [AnyDesign repo](../references/anydesign-repo.md)
- [AnyDesign artifact](../references/anydesign-artifact.md)
- [Rename map](../references/anydesign-token-rename-map.md)
