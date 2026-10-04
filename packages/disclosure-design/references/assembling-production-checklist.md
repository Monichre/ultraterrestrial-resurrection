---
title: Assembling production checklist
description: Navigable delivery checklist combining assembling-components gates, AnyDesign honesty, and MotionViz ship test.
type: reference
created: 2026-08-13
author: agent
tags: [reference, checklist, assembling-components]
source_repo: mixed
source_url: ""
source_path: skills/assembling-components/SKILL.md
captured_at: 2026-08-13
skill_chain_stage: assembly
framework: any
motion: reduced-motion-required
---

# Assembling production checklist

## Summary

Use this list before calling an assembled UI done. It merges the skill Integration Checklist, library-context validation, AnyDesign lint/honesty, and MotionViz's "engineered not theatrical" ship test.

Hub: [assembling-components hub](../concepts/assembling-components-hub.md). Runbook: [assembling-agent-runbook](../notes/assembling-agent-runbook.md).

## Tokens and theme

- [ ] `tokens.css` exists with seven categories: colors, spacing, typography, borders, shadows, motion, z-index
- [ ] Naming: `--color-*`, `--spacing-*` (4px base), `--font-size-*`, `--radius-*`, `--shadow-*`, `--chart-color-*`, `--z-*`, `--duration-*` / `--transition-*`
- [ ] Import order: `tokens.css` → `globals.css` → components
- [ ] `python scripts/validate_tokens.py src --strict --fix-suggestions` — errors = 0
- [ ] Hex / raw spacing / font-size appear only on `--*` definition lines
- [ ] AnyDesign names remapped via [rename map](./anydesign-token-rename-map.md)
- [ ] AnyDesign Open Questions were not filled with invented tokens
- [ ] `ThemeProvider` sets `data-theme` on `<html>`; `index.html` does not hardcode it
- [ ] Theme persists in `localStorage`; system preference works
- [ ] Dark theme overrides the full color set

## Skill chain and structure

- [ ] Theming outputs present before layouts
- [ ] `Layout` / `Header` / `Sidebar` live in `components/layout/`
- [ ] `Dashboard` / `KPICard` live in `components/features/dashboard/`
- [ ] Charts use `--chart-color-*` and live in `components/charts/`
- [ ] Toast / Spinner / EmptyState live in `components/feedback/` with `ToastProvider` at root
- [ ] Barrel `index.ts` in each of those directories (`generate_exports.py`)
- [ ] Named exports only
- [ ] `check_imports.py` passes

## Motion and accessibility

- [ ] `@media (prefers-reduced-motion: reduce)` in globals
- [ ] Transitions use `var(--transition-*)` or `var(--duration-*)`
- [ ] No theatrical loops, neon motion, or untokenized glow (MotionViz failure modes)
- [ ] Signal Spine still readable in the layout; unused sections removed
- [ ] Pressure Gradient: not every band equally loud
- [ ] `--color-primary` scarce (CTA / ONE brand thing)
- [ ] Focus-visible uses a token
- [ ] Contrast pairs from AnyDesign `design-a11y.md` still pass AA where claimed

## Framework and production

- [ ] Framework chosen via [framework selection](../concepts/framework-selection.md)
- [ ] Vite: `main.tsx` + `@` alias. Next: `app/layout.tsx` imports tokens first. Python/Rust: `static/css/tokens.css` in base template
- [ ] Build completes; TypeScript compiles
- [ ] README with install / `dev` / `validate:tokens`
- [ ] Optional CI: `validate_tokens.py src --json` in GitHub Actions

## Citations

- assembling-components `SKILL.md` Integration Checklist + Application Assembly Workflow
- assembling-components `references/library-context.md` Validation Checklist
- assembling-components `outputs.yaml` validation.checks
- AnyDesign `SKILL.md` honesty rules + `lint_design_md.py`
- MotionViz `website-design/skills/Design-MV.md` Ship Test + Failure Modes

## Mapping to assembling-components

This checklist *is* the skill's delivery gate, extended so AnyDesign and MotionViz cannot skip it.

## Where this is used

- [Validation gates](../concepts/validation-gates.md)
- [Agent runbook](../notes/assembling-agent-runbook.md)
- [Assembling Components Hub](../concepts/assembling-components-hub.md)
