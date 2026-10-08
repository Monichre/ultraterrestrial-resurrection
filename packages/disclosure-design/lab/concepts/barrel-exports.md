---
title: Barrel exports
description: Each component directory exposes named exports from index.ts so assembly imports stay stable.
type: concept
created: 2026-08-13
author: agent
tags: [concept, barrel-exports, assembling-components]
skill_chain_stage: assembly
tokens: []
framework: react-vite
motion: none
source_repo: assembling-components
---

# Barrel exports

## Definition

A barrel is `index.ts` in a component directory that re-exports named symbols from sibling modules. Consumers import from the directory, not from leaf files.

```ts
export { Button } from './button'
export { Card } from './card'
```

Prefer **named exports** (project convention). `generate_exports.py` scans `.tsx` files and writes barrels; run it per tree under `src/components` rather than hand-maintaining long lists.

## Why it matters for assembling-components

The skill's wiring examples all import from barrels (`@/components/features/dashboard`, `@/components/feedback`). Missing barrels fail `check_imports.py` and the integration checklist even when the components exist.

## Constraints

Required barrels:

- `src/components/ui/index.ts`
- `src/components/layout/index.ts`
- `src/components/charts/index.ts`
- `src/components/feedback/index.ts`
- `src/components/features/dashboard/index.ts`

No circular barrels. Export TypeScript types alongside components. React files stay PascalCase (`KPICard.tsx`); barrels stay `index.ts`.

```bash
python scripts/generate_exports.py src/components
python scripts/check_imports.py src
```

## Related

- [Skill chain](./skill-chain.md)
- [Framework selection](./framework-selection.md)
- [assembling-components skill](../references/assembling-components-skill.md)
