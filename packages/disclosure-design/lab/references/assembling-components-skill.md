---
title: assembling-components skill
description: Capstone AI Design Components skill — token validation, scaffolding, providers, barrels, and the production checklist.
type: reference
created: 2026-08-13
author: agent
tags: [reference, assembling-components]
source_repo: assembling-components
source_url: ""
source_path: skills/assembling-components/SKILL.md
captured_at: 2026-08-13
skill_chain_stage: assembly
framework: any
motion: reduced-motion-required
---

# assembling-components skill

## Summary

Local skill at `~/.cursor/plugins/cache/ai-design-components/ai-ml-skills/76551b7b19ebc667764ec75da14990d0aef8b6e5/skills/assembling-components/`. It assembles outputs from theming, layouts, dashboards, data-viz, forms, tables, and feedback into React/Vite, Next.js, FastAPI/Flask, or Rust Axum/Actix apps with validated tokens.

## Key points

- Token prefixes: `--color-*`, `--spacing-*` (4px base), `--font-size-*`, `--radius-*`, `--shadow-*`, `--chart-color-*`, `--z-*`.
- Scripts (run without loading into context): `validate_tokens.py`, `generate_scaffold.py`, `check_imports.py`, `generate_exports.py`.
- Providers: `ThemeProvider` (`data-theme` + `localStorage`) and `ToastProvider` at root.
- Import order: `tokens.css` → `globals.css` → components.
- Framework chooser encoded in [framework selection](../concepts/framework-selection.md).
- `outputs.yaml` lists `must_contain` files per maturity and framework (including `tokens.css` with `--color-primary`, `--spacing-`, `--font-size-`).

## Citations

- Path: `skills/assembling-components/SKILL.md`
- Path: `skills/assembling-components/outputs.yaml`
- Path: `skills/assembling-components/references/library-context.md`
- Path: `skills/assembling-components/references/token-validation-rules.md`
- Path: `skills/assembling-components/references/react-vite-template.md`
- Path: `skills/assembling-components/references/nextjs-template.md`
- Path: `skills/assembling-components/references/python-fastapi-template.md`
- Path: `skills/assembling-components/references/rust-axum-template.md`
- Path: `skills/assembling-components/examples/README.md`

Plugin cache root (this machine): `/Users/liamellis/.cursor/plugins/cache/ai-design-components/ai-ml-skills/76551b7b19ebc667764ec75da14990d0aef8b6e5/skills/assembling-components/`.

## Mapping to assembling-components

This *is* the assembly contract. Other references in this vault exist so AnyDesign and MotionViz can obey it.

## Where this is used

- [Assembling Components Hub](../concepts/assembling-components-hub.md)
- [Skill chain](../concepts/skill-chain.md)
- [Validation gates](../concepts/validation-gates.md)
- [Production checklist](./assembling-production-checklist.md)
