---
title: Welcome
description: Start here — this knowledge base is purpose-built for assembling-components, with AnyDesign and MotionViz as sourced inputs.
type: Document
tags: [welcome, assembling-components]
---

# Welcome

This Open Knowledge vault (OKF starter pack) is customized so an agent running **assembling-components** can assemble production UIs without leaving the skill-chain or token contract.

**Images first:** every still lives folderized in [`extractions/<slug>/`](./extractions/) — image + `source.md` + `design-tokens.md` (+ `design.md` / `image-to-prompt.md` / `component.tsx` for gold cluster reps). **The contract is [AGENTS.md](./AGENTS.md): `prompts/` is mandatory reading before any extraction; `references/` are tools; flat catalogs in `notes/` are intermediate.** Query hub: [midjourney-image-catalog](./notes/midjourney-image-catalog.md) · manifest: [`notes/folderize-manifest.json`](./notes/folderize-manifest.json).

## What to load first

1. [Assembling Components Hub](./concepts/assembling-components-hub.md)
2. [Agent runbook](./notes/assembling-agent-runbook.md)
3. [Production checklist](./references/assembling-production-checklist.md)

## How the sources are used

- **assembling-components** — scaffolding, `ThemeProvider` + `ToastProvider`, barrel exports, `validate_tokens.py`, framework chooser.
- **AnyDesign** ([uxKero/anydesign](https://github.com/uxKero/anydesign)) — diagnose a visual system; remap DTCG/CSS vars into `--color-*` / `--spacing-*` names. See [AnyDesign assembly bridge](./concepts/anydesign-assembly-bridge.md).
- **MotionWiki-Playbook** ([MotionViz](https://github.com/adi0900/MotionWiki-Playbook)) — Signal Spine and Pressure Gradient for layout; not a CSS animation cookbook. See [MotionViz assembly bridge](./concepts/motionviz-assembly-bridge.md).

## How it is organized

- [index](./index.md) — reserved OKF navigation hub (no frontmatter).
- [log](./log.md) — reserved OKF change history (no frontmatter).
- [concepts](./concepts/assembling-components-hub.md), [references](./references/assembling-components-skill.md), [notes](./notes/assembling-agent-runbook.md) — content. New notes should use the assembling-shaped templates (`skill_chain_stage`, `tokens`, `framework`, `motion`, `source_repo`).

## The one OKF rule

Every non-reserved document has a non-empty `type`. Reserved files `index.md` and `log.md` stay lowercase and frontmatter-free.
