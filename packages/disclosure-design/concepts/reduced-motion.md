---
title: Reduced motion
description: prefers-reduced-motion is an assembly delivery gate; motion is tokenized duration and easing, never theatrical keyframes.
type: concept
created: 2026-08-13
author: agent
tags: [concept, motion, a11y, assembling-components]
skill_chain_stage: cross-cutting
tokens:
  - "--duration-fast"
  - "--duration-normal"
  - "--duration-slow"
  - "--transition-fast"
  - "--transition-normal"
framework: any
motion: reduced-motion-required
source_repo: mixed
---

# Reduced motion

## Definition

Assembled UIs must honor `@media (prefers-reduced-motion: reduce)` and must not invent untokenized animation. MotionViz "engineered, not theatrical" maps onto this gate: scarce motion, tokenized timing, no neon/cyberpunk motion language.

Canonical globals snippet (from the Next.js template):

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Token scale (assembling-components):

| Token | Value |
| --- | --- |
| `--duration-fast` | 150ms |
| `--duration-normal` | 200ms |
| `--duration-slow` | 300ms |
| `--transition-fast` | all 150ms ease-out |
| `--transition-normal` | all 200ms ease-out |

AnyDesign's Vercel extract uses `--motion-duration-fast|popover|overlay` and `--motion-ease-*`. Remap those into the assembling names before component CSS is written. See [rename map](../references/anydesign-token-rename-map.md).

## Why it matters for assembling-components

The integration checklist lists reduced motion as a required check. `validate_tokens.py --strict` flags hardcoded `150ms` as info. MotionWiki-Playbook does **not** ship this CSS — if you copy Design-MV "glow" or 3D cluster language into CSS animations, you violate both token-first assembly and MotionViz's own anti-theatrical rule.

## Constraints

- No hardcoded `transition: all 150ms ease` in component CSS.
- Glow, mesh, and 3D motion stay scarce (MotionViz: key objects only) and never bypass reduced-motion.
- `@keyframes` bodies are exception-listed for validation, but they must still disable under reduced motion via the global media query.
- Interaction states (hover, focus-visible) may use `--transition-fast`; they must not introduce new duration literals.

## Related

- [Token-first assembly](./token-first-assembly.md)
- [MotionViz assembly bridge](./motionviz-assembly-bridge.md)
- [Validation gates](./validation-gates.md)
- [Production checklist](../references/assembling-production-checklist.md)
