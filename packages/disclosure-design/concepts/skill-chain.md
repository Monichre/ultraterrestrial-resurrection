---
title: Skill chain
description: theming to layouts to dashboards to data-viz to feedback to assembling-components, with forms and tables as optional inputs.
type: concept
created: 2026-08-13
author: agent
tags: [concept, skill-chain, assembling-components]
skill_chain_stage: assembly
tokens: []
framework: any
motion: none
source_repo: assembling-components
---

# Skill chain

## Definition

Assembling-components is the capstone of AI Design Components. It does not invent primitives. It wires outputs that earlier skills already produced into a working application.

```
theming-components → designing-layouts → creating-dashboards
        ↓                    ↓                    ↓
   tokens.css            Layout.tsx          Dashboard.tsx
   ThemeProvider         Header/Sidebar      KPICard.tsx
                    ↓
     visualizing-data + providing-feedback (+ forms/tables)
                    ↓
           assembling-components → working system
```

## Why it matters for assembling-components

Placing a DonutChart in `components/ui/` or a Toast without `ToastProvider` is a skill-chain error even if tokens validate. Directory ownership is part of correctness.

## Expected outputs

| Skill | Primary outputs | Token dependencies |
| --- | --- | --- |
| `theming-components` | `tokens.css`, `theme-provider.tsx` | Foundation |
| `designing-layouts` | `Layout.tsx`, `Header.tsx`, `Sidebar.tsx` | `--spacing-*`, `--color-border-*` |
| `creating-dashboards` | `Dashboard.tsx`, `KPICard.tsx` | Layout + chart tokens |
| `visualizing-data` | charts, legends | `--chart-color-*`, `--font-size-*` |
| `building-forms` | inputs, validation | `--spacing-*`, `--radius-*`, `--color-error` |
| `building-tables` | Table, pagination | `--color-*`, `--spacing-*` |
| `providing-feedback` | Toast, Spinner, EmptyState | `--color-success/error/warning` |

After theming: verify seven token categories, `[data-theme="dark"]`, and `prefers-reduced-motion`. After layouts: no raw `px` spacing in layout CSS. After dashboards: charts + Spinner loading. After data-viz: `--chart-color-*` only. After feedback: `ToastProvider` at root.

Target directories: `src/components/ui/`, `layout/`, `charts/`, `feedback/`, `features/dashboard/` — each with a barrel. Cite [library context in the skill](../references/assembling-components-skill.md).

## Related

- [Barrel exports](./barrel-exports.md)
- [Root providers](./root-providers.md)
- [AnyDesign assembly bridge](./anydesign-assembly-bridge.md)
- [Production checklist](../references/assembling-production-checklist.md)
