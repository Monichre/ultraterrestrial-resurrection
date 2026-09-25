---
title: Validation gates
description: Token errors block delivery; theme, reduced motion, barrels, build, and types are the rest of the production gate set.
type: concept
created: 2026-08-13
author: agent
tags: [concept, validation, assembling-components]
skill_chain_stage: assembly
tokens:
  - "--color-*"
  - "--spacing-*"
  - "--font-size-*"
framework: any
motion: reduced-motion-required
source_repo: assembling-components
---

# Validation gates

## Definition

An assembled app is not done when it renders. It is done when the skill's integration checklist and `validate_tokens.py` both pass.

```bash
python scripts/validate_tokens.py src --strict --fix-suggestions
python scripts/validate_tokens.py src --json
python scripts/check_imports.py src
```

## Why it matters for assembling-components

AnyDesign will happily emit real hex in `design.md`. MotionViz will happily describe glow and flow. Neither is allowed to leak into component CSS. The validator is the mechanical backstop.

## Constraints

Severity (from [token validation rules](../references/token-validation-rules.md)):

| Level | Categories | CI |
| --- | --- | --- |
| Error | colors (hex/rgb/hsl), spacing ≥4px, font-size | Build fails |
| Warning | radius, box-shadow, z-index ≥100 | Should fix |
| Info (strict) | transition timing | Nice to have |

Delivery checklist (skill):

- [ ] `tokens.css` exists with all 7 categories
- [ ] Import order: tokens.css → globals.css → components
- [ ] No hardcoded values (`validate_tokens.py` errors = 0)
- [ ] Theme toggle sets `data-theme`
- [ ] Reduced motion supported
- [ ] Build completes
- [ ] Types pass
- [ ] Imports resolve
- [ ] Barrel exports exist per component directory

Advanced maturity (from `outputs.yaml`): `.github/workflows/validate.yml` runs `validate_tokens.py`.

Navigable copy: [production checklist](../references/assembling-production-checklist.md).

## Related

- [Token-first assembly](./token-first-assembly.md)
- [Root providers](./root-providers.md)
- [Reduced motion](./reduced-motion.md)
- [assembling-components skill](../references/assembling-components-skill.md)
