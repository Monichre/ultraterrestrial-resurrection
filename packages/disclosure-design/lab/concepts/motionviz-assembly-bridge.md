---
title: MotionViz assembly bridge
description: MotionWiki-Playbook (MotionViz) informs composition rhythm and chroma scarcity; it is not a CSS animation playbook.
type: concept
created: 2026-08-13
author: agent
tags: [concept, motionwiki-playbook, motionviz, assembling-components]
skill_chain_stage: layouts
tokens:
  - "--color-primary"
  - "--duration-*"
  - "--transition-*"
framework: any
motion: composition-rhythm
source_repo: motionwiki-playbook
---

# MotionViz assembly bridge

## Definition

[MotionWiki-Playbook](https://github.com/adi0900/MotionWiki-Playbook) is published as **MotionViz**: a small instruction library for identity (`Brand-MV.skill`) and product-site composition (`Design-MV.md`). It does **not** document `@keyframes`, spring physics, or `prefers-reduced-motion`. Treat it as a **judgment layer** that runs *before* assembling-components writes layout and motion tokens.

Two Design-MV concepts do the useful work:

- **Signal Spine** — one structural idea (routing, pipeline, audit trail) that carries Layout → Dashboard → footer. If a section cannot attach to the spine, delete it.
- **Pressure Gradient** — deliberate rise and fall of visual density. Calm hero, denser metrics, refined CTA. This is **layout density**, not animation intensity.

## Why it matters for assembling-components

If an agent reads "motion playbook" and starts adding untokenized transitions, glow everywhere, or cyberpunk motion, it violates both MotionViz failure modes ("loud cyberpunk tropes", "engineered rather than theatrical") and [token-first assembly](./token-first-assembly.md). The correct mapping is: MotionViz rhythm → `Layout`/`Dashboard` structure; MotionViz chroma → `--color-primary` scarcity; MotionViz "how typography, color, layout, and motion connect" → `--duration-*` / `--transition-*` plus [reduced motion](./reduced-motion.md).

Design-MV explicitly does **not** generate code. Brand-MV generates identity boards, not `tokens.css`. CRO-MV (`cro-website\skill`) is a conversion audit layer — optional after assembly, not a motion source.

## Constraints

| MotionViz instruction | Assembly behavior |
| --- | --- |
| Engineered, not theatrical | No decorative animation loops; tokenized hover/focus only |
| Chroma control (one accent) | `--color-primary` on CTAs; do not rainbow chart tokens unless the product needs it |
| Page rhythm / default sequence | Map nav → hero → feature grid → flow → metrics → terminal CTA → footer onto `layout/` + `features/dashboard/` |
| Modular bento | CSS Grid using `--spacing-*` gutters; panel borders use `--color-border-*` |
| Instrument-grade micro-tension | Fine borders, HUD labels — still tokenized; no extra z-index literals |
| Minimal glow on key objects | If glow exists, it is a token (e.g. `--shadow-md`) and disables under reduced motion |
| Dark-mode infrastructure territory | `[data-theme="dark"]` color set; still requires light/system if the product is not dark-only |
| "Does this generate code? No." | Hand off to assembling-components scaffolding |

Ship test from Design-MV (adapted): the assembled UI should feel systematic, minimal, technically credible, and quieter than generic AI dashboards — **and** `validate_tokens.py` errors must be 0.

## Related

- [Reduced motion](./reduced-motion.md)
- [AnyDesign assembly bridge](./anydesign-assembly-bridge.md)
- [Skill chain](./skill-chain.md)
- [MotionWiki-Playbook reference](../references/motionwiki-playbook.md)
- [Production checklist](../references/assembling-production-checklist.md)
