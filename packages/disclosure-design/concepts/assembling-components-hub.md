---
title: Assembling Components Hub
description: Navigation hub for this vault — token-first assembly, skill chain, providers, frameworks, motion, validation, AnyDesign, and MotionViz.
type: concept
created: 2026-08-13
author: agent
tags: [concept, assembling-components, hub]
skill_chain_stage: assembly
tokens: []
framework: any
motion: tokenized
source_repo: mixed
---

# Assembling Components Hub

This vault is a working knowledge base for an agent running **assembling-components**. The visual source of truth is the **image catalog**, not markdown essays or unused `--color-*` aliases.

## Visual SoT (do this first)

Open [Midjourney / design-lab image catalog](../notes/midjourney-image-catalog.md). Root collection metadata: [`.ok/frontmatter.yml`](../.ok/frontmatter.yml). Architecture: [AssemblingComponentsImages](../AssemblingComponentsImages.md).

![Prometheus dark grid sketch](../u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_3.png)

![Prometheus construction drawing](../u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_2.png)

![Research desk](../design/design-lab/ui-mockups/research-desk-nuclear-thread-v2.png)

![Plate 047](../design/brand-bible/09_CANVAS_STUDIES/plate_047.png)

![[u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_3.png]]

Pixel-sampled brass `#b49c60` on desk `#0f181c` is `--color-primary`. Paper bone `#e2dbc7` is the archival register. Live CSS: `packages/disclosure-ui/styles/tokens.css` + `apps/app/src/app/globals.css`.

## How the three sources fit together

1. **AnyDesign** diagnoses a visual system (`design.md` + DTCG JSON, or `element.md`). It does not scaffold an app.
2. **MotionWiki-Playbook (MotionViz)** supplies composition and identity instruction layers (Signal Spine, Pressure Gradient, chroma scarcity). It does not emit CSS keyframes or code.
3. **assembling-components** implements: remap tokens, scaffold the framework, wrap providers, barrel-export components, validate, ship.

Hex and raw `px` from AnyDesign live only in `tokens.css` definitions after rename. MotionViz theatrical motion is rejected; duration and easing use `--duration-*` / `--transition-*`, and `prefers-reduced-motion` is a delivery gate.

Full algorithm: [research PSUEDOCODE](../AssemblingComponentsResearch_PSUEDOCODE.md). Architecture: [AssemblingComponentsResearch](../AssemblingComponentsResearch.md).

**Apply phase (app repo):** the assembly target is `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection`. Pseudocode: `docs/plans/AssemblingComponentsApply_PSUEDOCODE.md`. Architecture: `docs/plans/AssemblingComponentsApply.md`. Do not generate a Vite scaffold.

## Agent path (short)

1. Inventory skill-chain outputs — [skill chain](./skill-chain.md).
2. If a visual source exists, extract then remap — [AnyDesign bridge](./anydesign-assembly-bridge.md), [rename map](../references/anydesign-token-rename-map.md).
3. If a composition brief exists, apply MotionViz constraints — [MotionViz bridge](./motionviz-assembly-bridge.md).
4. Choose framework and scaffold — [framework selection](./framework-selection.md).
5. Wire [root providers](./root-providers.md) and [barrel exports](./barrel-exports.md).
6. Enforce [token-first assembly](./token-first-assembly.md) and [reduced motion](./reduced-motion.md).
7. Pass [validation gates](./validation-gates.md) using the [production checklist](../references/assembling-production-checklist.md).

Runbook: [assembling-agent-runbook](../notes/assembling-agent-runbook.md).

## Concepts

- [Token-first assembly](./token-first-assembly.md)
- [Skill chain](./skill-chain.md)
- [Barrel exports](./barrel-exports.md)
- [Root providers](./root-providers.md)
- [Framework selection](./framework-selection.md)
- [Reduced motion](./reduced-motion.md)
- [Validation gates](./validation-gates.md)
- [AnyDesign assembly bridge](./anydesign-assembly-bridge.md)
- [MotionViz assembly bridge](./motionviz-assembly-bridge.md)

## References

- [assembling-components skill](../references/assembling-components-skill.md)
- [Token validation rules](../references/token-validation-rules.md)
- [AnyDesign repo](../references/anydesign-repo.md)
- [AnyDesign uploaded artifact](../references/anydesign-artifact.md)
- [AnyDesign token rename map](../references/anydesign-token-rename-map.md)
- [MotionWiki-Playbook](../references/motionwiki-playbook.md)
- [Production checklist](../references/assembling-production-checklist.md)
