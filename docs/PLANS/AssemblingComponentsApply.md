---
title: Assembling Components Apply
description: Architecture of applying assembling-components to the existing Next.js Ultraterrestrial app — modules, data flow, wired vs open.
type: Document
created: 2026-08-13
author: agent
tags: [assembling-components, architecture, nextjs, disclosure-ui]
---

# Assembling Components Apply

How assembling-components was **applied** to `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection` without replacing the product design system. Planning notes: [AssemblingComponentsApply_PSUEDOCODE.md](./AssemblingComponentsApply_PSUEDOCODE.md). Vault (read-only this phase): `/Users/liamellis/Desktop/disclosure-design-references`.

## What we found

| Fact | Detail |
| --- | --- |
| Stack | Next.js 15 App Router, React 19, Tailwind 4, TypeScript, `@` → `apps/app/src/*` |
| Design SoT | `@repo/disclosure-ui` — `--du-reading-*` / `--du-desk-*` OKLCH, `data-register` |
| Theme | `next-themes`, `attribute='class'`, `forcedTheme='dark'` (product is dark-only) |
| Feedback | Radix `Toaster` + Sonner exist; **not** mounted at root |
| Tokens | Seven assembling categories were **missing**; hex lives in `globals.css` `@theme` and feature CSS |
| Barrels | disclosure-ui has them; `apps/app/src/components/ui` had no `index.ts`; skill-chain dirs were absent |
| Motion | Feature-local `prefers-reduced-motion`; **no** global gate in `globals.css` |
| ENOSPC | Vault concept/reference/note files are intact (1.7–4.7 KB). No re-ingest. |

MotionViz is composition judgment (Signal Spine = Research Canvas records/waypoints; chroma scarcity = one `--color-primary`). It is not a keyframe cookbook. AnyDesign names remap at the `tokens.css` boundary onto assembling prefixes.

## Key modules

| Module | Path | Responsibility |
| --- | --- | --- |
| Token SoT | `packages/disclosure-ui/styles/tokens.css` | `--du-*` primitives + assembling 7 categories as aliases |
| Token TS | `packages/disclosure-ui/src/tokens/assembling.ts` | Named alias maps for app code |
| App token entry | `apps/app/src/styles/tokens.css` | `@import` of the package file; imported first in layout |
| Theme | `apps/app/src/contexts/theme-provider.tsx` | next-themes; always also sets `data-theme` |
| Toasts | `apps/app/src/components/feedback/toast-provider.tsx` | Root Radix Toaster + Sonner |
| Feedback | `apps/app/src/components/feedback/` | `ToastProvider`, `Spinner`, `EmptyState` + token CSS |
| Layout barrel | `apps/app/src/components/layout/` | `Header` ← `ResearchAppChrome`; `Sidebar` ← `LibrarySidebar` |
| Charts barrel | `apps/app/src/components/charts/` | Re-export existing Recharts primitives |
| Dashboard barrel | `apps/app/src/components/features/dashboard/` | `Dashboard` ← `ResearchDeskShell`; token-valid `KPICard` |
| UI barrel | `apps/app/src/components/ui/index.ts` | Curated named exports (not `generate_exports.py` over 178 files) |
| Validator | `packages/disclosure-ui/scripts/validate_tokens.py` | Copied from the skill; scoped runs only |

## Process architecture

```
disclosure-ui --du-* (registers)
        │
        ▼
 tokens.css assembling aliases     MotionViz judgment
 (--color-primary = desk amber)    (spine + chroma scarcity
        │                           + --duration-* only)
        ▼
 apps/app layout.tsx
   import tokens.css
   import globals.css          ← reduced-motion gate appended
   ThemeProvider (class + data-theme, forced dark)
   ToastProvider
        │
        ▼
 barrels: ui / layout / charts / feedback / features/dashboard
        │
        ▼
 validate_tokens.py on NEW css + disclosure-ui/styles
```

## Component architecture

```
apps/app/src/
  styles/tokens.css
  app/layout.tsx
  app/globals.css                 # legacy @theme + NEW reduced-motion
  contexts/theme-provider.tsx
  components/
    ui/index.ts
    layout/index.ts
    charts/index.ts
    feedback/index.ts
    features/dashboard/index.ts
```

Root wrap (Next, not Vite `main.tsx`):

`ClerkProvider` → `html.dark` → `ThemeProvider` → `ToastProvider` → `CommandPaletteProvider` → chrome + `{children}`.

## Data flow

1. Agent reads vault hub/runbook, then this file.
2. Product color still originates in `--du-*` / `READING_ROOM_TOKENS` / `RESEARCH_DESK_TOKENS`.
3. Assembling CSS and new primitives consume `var(--color-*)`, `var(--spacing-*)`, `var(--duration-*)`.
4. `[data-theme='dark']` matches forced dark. `[data-theme='light']` is defined from reading-room paper but **not enabled**.
5. `[data-register='archival-material']` remaps semantic colors onto bronze/paper.
6. `validate:tokens` in `apps/app` and `@repo/disclosure-ui` gates **new** CSS. It does not scan `globals.css`.

## Wired vs still open

**Wired**

- Token file with seven categories and assembling names
- Import order: tokens → globals → xyflow / research-ui
- `data-theme` written with `class` (next-themes attribute merge)
- `ToastProvider` at root
- Global `prefers-reduced-motion`
- Skill-chain barrels (named exports)
- Root background uses `var(--color-bg-primary)` instead of `#000`
- `validate_tokens.py` errors = 0 on `packages/disclosure-ui/styles`, `feedback/`, `features/dashboard/`
- `@repo/disclosure-ui` `tsc --noEmit` passes

**Open (honest remaining gaps)**

- `globals.css` Tailwind `@theme` and shadcn HSL still hardcode hex — thousands of values; not migrated
- `document-panel.css` and other feature CSS fail `validate_tokens.py` (222+ errors if scanned)
- Research desk shells still use Tailwind arbitrary `oklch(...)` (InsightWidgets, ResearchAppChrome)
- Nested `layout.tsx` files do not import tokens/ThemeProvider (they inherit the root — `check_imports.py` still flags them)
- Prometheus/story `Toaster` mounts may duplicate the root Sonner toaster
- Light/system theme toggle is **not** enabled (`forcedTheme='dark'`)
- `next build` and dogfood visual audit **UNVERIFIED** this session
- Full-tree `check_imports.py` missing-barrel list for legacy component folders — will not run `generate_exports.py` across them

## ENOSPC

No truncated vault notes. Hub, runbook, concepts, and references are complete. GitHub clones were not re-ingested.

## Commands

```bash
cd packages/disclosure-ui && bun run validate:tokens && bun run type-check
cd apps/app && bun run validate:tokens
```

## Docs location

| File | Path |
| --- | --- |
| PSUEDOCODE | `docs/plans/AssemblingComponentsApply_PSUEDOCODE.md` |
| Architecture (this file) | `docs/plans/AssemblingComponentsApply.md` |
| Vault hub pointer | `disclosure-design-references/concepts/assembling-components-hub.md` |
