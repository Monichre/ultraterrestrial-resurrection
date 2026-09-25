---
title: Assembling agent runbook
description: Ordered steps for an agent executing assembling-components against this vault.
type: note
created: 2026-08-13
author: agent
tags: [note, assembling-components, runbook]
skill_chain_stage: assembly
framework: any
---

# Assembling agent runbook

## Goal

Produce a token-valid, skill-chain-correct application from existing AI Design Components outputs, optionally grounded in AnyDesign extraction and MotionViz composition.

Start at the [hub](../concepts/assembling-components-hub.md). **Visual SoT:** [image catalog](./midjourney-image-catalog.md). Algorithm: [PSUEDOCODE](../AssemblingComponentsImages_PSUEDOCODE.md).

## Ordered steps

0. **Read the images.** [Catalog](./midjourney-image-catalog.md). Root `.ok/frontmatter.yml` is the Midjourney collection. Do not skip pixels.

1. **Inventory** skill-chain artifacts on disk (`tokens.css`, Layout, Dashboard, charts, Toast). See [skill chain](../concepts/skill-chain.md).
2. **If a visual source exists**, run AnyDesign (full or element). Lint `design.md`. Remap via [rename map](../references/anydesign-token-rename-map.md). Do not invent tokens. Bridge: [AnyDesign assembly bridge](../concepts/anydesign-assembly-bridge.md).
3. **If a composition/identity brief exists**, apply Signal Spine + Pressure Gradient + chroma scarcity. Do not add theatrical motion. Bridge: [MotionViz assembly bridge](../concepts/motionviz-assembly-bridge.md).
4. **Choose framework** ([framework selection](../concepts/framework-selection.md)) and scaffold (`generate_scaffold.py` or the matching template).
5. **Wire** [root providers](../concepts/root-providers.md) and [barrel exports](../concepts/barrel-exports.md). Import order: tokens → globals → components.
6. **Motion gate**: [reduced motion](../concepts/reduced-motion.md) media query + tokenized durations.
7. **Validate** with [production checklist](../references/assembling-production-checklist.md) and `validate_tokens.py`. Errors block delivery.
8. **Build + types**. Document setup in README.

## Gates

- [ ] `validate_tokens.py` errors = 0
- [ ] Theme toggle sets `data-theme`
- [ ] `prefers-reduced-motion` present
- [ ] Barrels exist
- [ ] Build and types pass

## Links

- [Token-first assembly](../concepts/token-first-assembly.md)
- [assembling-components skill](../references/assembling-components-skill.md)
- [AnyDesign repo](../references/anydesign-repo.md)
- [MotionWiki-Playbook](../references/motionwiki-playbook.md)
