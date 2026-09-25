---
title: Assembling Components Apply PSUEDOCODE
description: Detailed pseudocode for applying assembling-components to the existing Next.js Ultraterrestrial app (gap-fill, not a greenfield Vite scaffold).
type: Document
tags:
  - assembling-components
  - pseudocode
  - nextjs
author: agent
created: 2026-08-13
---

# Assembling Components Apply — PSUEDOCODE

This file is the implementation plan for **applying** assembling-components to `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection`. It is not executable code. Architecture after the work: `AssemblingComponentsApply.md`.

Vault knowledge (read-only except ENOSPC repair): `/Users/liamellis/Desktop/disclosure-design-references`.

## 0. Confirmed environment

```
VAULT_ROOT := /Users/liamellis/Desktop/disclosure-design-references
APP_ROOT   := /Users/liamellis/Desktop/apps/ultraterrestrial-resurrection
CWD        := VAULT_ROOT (tool session); write target := APP_ROOT
STACK      := Next.js 15 App Router + React 19 + Tailwind 4 + TypeScript
DESIGN_SOT := packages/disclosure-ui ( --du-* OKLCH registers )
ENTRY      := apps/app/src/app/layout.tsx
ALIAS      := @/* → apps/app/src/*  (already in tsconfig)
DO_NOT     := git commit; dump .env; Vite scaffold; rewrite Research Canvas / mindmap
```

## 1. ENOSPC / vault integrity (quick, not re-ingest)

```
procedure CHECK_VAULT:
  READ hub, runbook, research architecture, production checklist
  SIZE all concepts/*.md references/*.md notes/*.md
  IF any file is 0 bytes OR mid-sentence truncated:
    REPAIR from skill + prior architecture doc
  ELSE:
    NOTE "no ENOSPC repair needed"
  DO NOT clone anydesign or MotionWiki-Playbook again
end
```

## 2. Inventory (already observed)

```
procedure INVENTORY:
  FRAMEWORK := nextjs   # SSR, App Router, API routes — not Vite

  TOKENS:
    packages/disclosure-ui/styles/tokens.css
      --du-reading-* , --du-desk-* only
      MISSING assembling 7 categories:
        --color-* --spacing-* --font-size-* --radius-*
        --shadow-* --chart-color-* --z-* --duration-*
    apps/app/src/features/research-platform/shared/tokens.css
      --ut-* (legacy research-platform; leave in place)
    apps/app/src/app/globals.css
      Tailwind @theme + shadcn HSL + hardcoded hex
      NO global prefers-reduced-motion
      DO NOT rewrite this file except add reduced-motion gate

  PROVIDERS:
    ThemeProvider = next-themes pass-through
      attribute='class'  (NOT data-theme)
      forcedTheme='dark' enableSystem={false}  # product is dark-only
    ToastProvider = Radix primitive inside Toaster
      Toaster NOT mounted at root layout
    Storybook preview imports tokens AFTER globals.css

  BARRELS:
    packages/disclosure-ui/src/components/index.ts  EXISTS
    apps/app/src/components/ui/  ~178 files, NO index.ts
      (index.ui.tsx is a partial barrel — do not replace it)
    MISSING skill-chain dirs:
      components/layout/
      components/charts/
      components/feedback/
      components/features/dashboard/

  MOTION:
    Feature-local prefers-reduced-motion exists (document-panel, tours, etc.)
    Global gate missing in globals.css
    MotionViz := composition judgment, NOT new keyframes

  ANYDESIGN:
    No live Figma/URL extract against this app this phase
    Remap existing --du-* / register OKLCH onto assembling names
    Do not invent Palo Alto #FA582D brand colors

  HARDCODE:
    layout.tsx main style={{ backgroundColor: '#000' }}
    xyflow CSS imported BEFORE tokens.css in layout.tsx
end
```

## 3. AnyDesign rename (map diagnoses → assembling names BEFORE component CSS)

```
procedure REMAP_TOKENS:
  # Product primitives stay --du-*. Assembling names are aliases.

  COLOR (techno-analytical default = forced dark product):
    --color-bg-primary      := var(--du-desk-base)
    --color-bg-secondary    := var(--du-desk-panel)
    --color-bg-tertiary     := var(--du-desk-card)
    --color-bg-elevated     := var(--du-desk-card)
    --color-text-primary    := var(--du-desk-ink)
    --color-text-secondary  := var(--du-desk-muted)
    --color-text-tertiary   := var(--du-desk-muted)
    --color-border-primary  := var(--du-desk-line)
    --color-primary         := var(--du-desk-amber)   # MotionViz chroma scarcity: CTA only
    --color-success         := var(--du-desk-green)
    --color-warning         := var(--du-desk-amber)
    --color-error           := var(--du-reading-stamp)
    --color-info            := var(--du-desk-teal)
    --color-border-focus    := var(--color-primary)

  COLOR [data-register='archival-material']:
    remap bg/text/border/primary to --du-reading-*
    primary := --du-reading-bronze  (still one accent)

  COLOR [data-theme='light']:
    DEFINE from reading-room paper/ink for token completeness
    DO NOT enable theme toggle (forcedTheme remains dark)

  SPACING 4px base:
    --space-1..--space-12 + --spacing-xs|sm|md|lg|xl|2xl aliases

  TYPE:
    --font-size-xs..4xl
    --font-sans := var(--font-neue-haas), ui-sans-serif, system-ui, sans-serif
    --font-mono := var(--font-jetbrains-mono), ui-monospace, monospace

  RADIUS / SHADOW / Z / DURATION:
    skill tables; hex/oklch/px only on -- definition lines
    --motion-duration-* (AnyDesign Vercel names) ALSO aliased onto --duration-*

  CHART:
    --chart-color-1..5 from EXISTING desk teal/amber/green/purple + stamp
    DO NOT invent extra hues (MotionViz chroma scarcity)

  WRITE into packages/disclosure-ui/styles/tokens.css (SoT)
  MIRROR names into packages/disclosure-ui/src/tokens/assembling.ts + CSS_TOKEN_MAP
  APP ENTRY apps/app/src/styles/tokens.css := @import package tokens.css
end
```

## 4. MotionViz composition (judgment, not CSS dumps)

```
procedure APPLY_MOTIONVIZ:
  SIGNAL_SPINE := Research Canvas / records / waypoints / visual connections
                 (already product canon — do not add a second dashboard route)
  PRESSURE_GRADIENT := keep existing density; new assembling primitives stay quiet
  CHROMA := --color-primary on KPI/CTA language only
  MOTION := --duration-* / --transition-* + global prefers-reduced-motion
  REJECT := theatrical loops, neon glow keyframes, untokenized 150ms
  DO NOT restyle InsightWidgets / ResearchDeskShell this pass
end
```

## 5. Wire Next.js assembly (gap-fill)

```
procedure WIRE_NEXT:
  # 5.1 Import order in apps/app/src/app/layout.tsx
  FIRST  import '@/styles/tokens.css'
  SECOND import './globals.css'
  THEN   xyflow + research-ui.css  # vendor/feature CSS after tokens+globals

  # 5.2 ThemeProvider
  KEEP next-themes wrapper (do not replace with skill's from-scratch provider)
  DEFAULT attribute merge: always include 'data-theme' alongside 'class'
  KEEP forcedTheme='dark' enableSystem={false}
  KEEP suppressHydrationWarning on <html>
  STORYBOOK preview: tokens import first; ThemeProvider inherits data-theme merge

  # 5.3 ToastProvider at root
  CREATE apps/app/src/components/feedback/toast-provider.tsx
    render children
    mount Radix Toaster (@/components/ui/toaster)
    mount Sonner Toaster (@/components/ui/sonner)
  WRAP inside ThemeProvider in root layout
  NOTE: prometheus page-level <Toaster /> may duplicate — document, do not rip out

  # 5.4 Hardcoded root background
  REPLACE style={{ backgroundColor: '#000' }}
     WITH style={{ backgroundColor: 'var(--color-bg-primary)' }}

  # 5.5 Reduced motion in globals.css (append, do not rewrite @theme)
  @media (prefers-reduced-motion: reduce) { * animation/transition 0.01ms }

  # 5.6 Barrels (named exports only)
  ui/index.ts                    curated primitives (Button, Card, Input, …)
                                 DO NOT generate_exports.py over 178 files
  layout/index.ts                Header := ResearchAppChrome
                                 Sidebar := LibrarySidebar
  charts/index.ts                re-export ChartContainer + legend/tooltip
  feedback/index.ts              ToastProvider, Spinner, EmptyState
  features/dashboard/index.ts    Dashboard := ResearchDeskShell
                                 KPICard := new token-valid primitive

  # 5.7 New token-valid CSS only in:
    feedback/spinner.css
    feedback/empty-state.css
    features/dashboard/kpi-card.css
  All values := var(--…) except 0/1px/2px/keywords

  # 5.8 Scripts
  COPY skill validate_tokens.py → packages/disclosure-ui/scripts/
  COPY skill check_imports.py   → packages/disclosure-ui/scripts/
  ADD package.json scripts:
    disclosure-ui: validate:tokens
    apps/app:      validate:tokens  (scoped to assembling CSS dirs, NOT globals.css)
  DO NOT copy generate_scaffold.py
  DO NOT run generate_exports.py on src/components
end
```

## 6. Validate

```
procedure VALIDATE:
  RUN python3 packages/disclosure-ui/scripts/validate_tokens.py \
        packages/disclosure-ui/styles \
        --fix-suggestions
  RUN python3 …/validate_tokens.py \
        apps/app/src/styles \
        apps/app/src/components/feedback \
        apps/app/src/components/layout \
        apps/app/src/components/charts \
        apps/app/src/components/features/dashboard
  ASSERT errors == 0 on those trees

  RUN check_imports.py on apps/app/src/app  (layout tokens-first + ThemeProvider)
  NOTE: full-src barrel scan will still flag legacy dirs — document as open

  TYPECHECK disclosure-ui (tsc --noEmit)
  DO NOT claim apps/app `next build` done unless run; report UNVERIFIED if skipped
  DO NOT call the whole app token-clean — globals.css / Tailwind arbitrary / feature CSS remain open
end
```

## 7. Docs (after code)

```
procedure DOCUMENT:
  WRITE docs/plans/AssemblingComponentsApply.md
    modules, architecture, data flow, wired vs open, ENOSPC result
  PATCH DAILY_WORK_PLAN.md session note (2026-08-13)
  OPTIONAL Decision 13 in FEATURES.md (assemble into existing DS, no Vite scaffold)
  PATCH vault log.md with a one-line pointer that apply phase lives in the app repo
  DO NOT commit
end
```

## 8. Explicit non-goals

```
- Greenfield Vite/FastAPI/Axum scaffold
- Replacing next-themes with a custom ThemeContext
- Enabling light/system theme toggle
- Migrating globals.css @theme hex → tokens (thousands of values)
- Restyling ResearchDeskShell / InsightWidgets hardcoded oklch
- New product routes or dashboards
- Re-ingesting GitHub clones
```
