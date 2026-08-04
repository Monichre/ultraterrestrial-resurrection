---
status: live
role: ops
spine: exists
updated: 2026-07-19
---

# Documentation

Navigation for Ultraterrestrial Resurrection. Living docs only — everything else is under [`archive/`](./archive/).

## Six-question spine

| # | Question | Go here |
|---|----------|---------|
| 1 | **What exists?** | This file + living-canon list below |
| 2 | **Where is it?** | Paths in the table; root product files stay at repo root |
| 3 | **How does it work?** | [`architecture/`](./architecture/) · [`adr/`](./adr/) · [`vision/IMPLEMENTATION_SPEC.md`](./vision/IMPLEMENTATION_SPEC.md) |
| 4 | **What do we want?** | [`../PRODUCT.md`](../PRODUCT.md) · [`vision/`](./vision/) · [`design/design-lab/`](./design/design-lab/) · [`plans/FEATURES.md`](./plans/FEATURES.md) · [`../DESIGN.md`](../DESIGN.md) (**not canonical** — canvas chrome sketch only) |
| 5 | **How do we do it?** | [`plans/TODO.md`](./plans/TODO.md) · [`../GOAL.md`](../GOAL.md) · [`../DAILY_WORK_PLAN.md`](../DAILY_WORK_PLAN.md) |
| 6 | **Where do I start?** | [`ops/AGENT_ONBOARDING_CHECKLIST.md`](./ops/AGENT_ONBOARDING_CHECKLIST.md) · [`../README.md`](../README.md) · [`../AGENTS.md`](../AGENTS.md) |

## Tree (living)

```
docs/
  README.md                 ← you are here
  adr/                      decisions
  architecture/             API_ROUTES, RUNBOOK
  vision/                   identity canon (flat markdown)
  design/brand-bible/       design text + tokens (no bulk binaries)
  plans/                    FEATURES.md + TODO.md only
  research/methodology/     platform research doctrine
  research/domain/          UFO subject deep-dives (when present)
  ops/                      agent onboarding, triage, contrib
  archive/                  historical, sessions, prototypes, assets
```

## Living canon

### Repo root

- [`README.md`](../README.md) · [`AGENTS.md`](../AGENTS.md) · [`CLAUDE.md`](../CLAUDE.md)
- [`PRODUCT.md`](../PRODUCT.md) · [`GOAL.md`](../GOAL.md) · [`DESIGN.md`](../DESIGN.md) (**not canonical** — limited canvas chrome)
- [`CONTEXT.md`](../CONTEXT.md) · [`CONTEXT-MAP.md`](../CONTEXT-MAP.md) · [`DAILY_WORK_PLAN.md`](../DAILY_WORK_PLAN.md)

### docs/

| File | Role | Spine |
|------|------|-------|
| [architecture/API_ROUTES.md](./architecture/API_ROUTES.md) | eng | how |
| [architecture/RUNBOOK.md](./architecture/RUNBOOK.md) | eng | how / do |
| [adr/0001-agent-inferences-excluded-from-retrieval.md](./adr/0001-agent-inferences-excluded-from-retrieval.md) | eng | how |
| [adr/0002-temporal-observatory-gl4ss-integration.md](./adr/0002-temporal-observatory-gl4ss-integration.md) | eng | how |
| [plans/FEATURES.md](./plans/FEATURES.md) | product | want |
| [plans/TODO.md](./plans/TODO.md) | eng | do |
| [vision/AGENT_ARCHITECTURE_BRIEF.md](./vision/AGENT_ARCHITECTURE_BRIEF.md) | identity | want / how |
| [vision/DESIGN_REGISTERS.md](./vision/DESIGN_REGISTERS.md) | identity | want |
| [vision/IMPLEMENTATION_SPEC.md](./vision/IMPLEMENTATION_SPEC.md) | identity | how |
| [vision/RESEARCH_NARRATIVE_RUBRIC.md](./vision/RESEARCH_NARRATIVE_RUBRIC.md) | identity | want |
| [vision/TEMPORAL_OBSERVATORY.md](./vision/TEMPORAL_OBSERVATORY.md) | product + eng | want |
| [vision/UX_LANGUAGE_GUIDE.md](./vision/UX_LANGUAGE_GUIDE.md) | identity | want |
| [vision/UI_INSPIRATION.md](./vision/UI_INSPIRATION.md) | design | want |
| [vision/2026-07-09-canonicalization-audit.md](./vision/2026-07-09-canonicalization-audit.md) | identity | where |
| [research/methodology/ufo-research-methodology.md](./research/methodology/ufo-research-methodology.md) | research | how |
| [ops/AGENT_ONBOARDING_CHECKLIST.md](./ops/AGENT_ONBOARDING_CHECKLIST.md) | ops | start |
| [ops/CONTRIB.md](./ops/CONTRIB.md) | ops | do |
| [ops/DOC_MAINTENANCE.md](./ops/DOC_MAINTENANCE.md) | ops | do |

Prompts and research personas live in packages, not docs:

- [`packages/ai/prompts/`](../packages/ai/prompts/)
- [`packages/ai/agents/`](../packages/ai/agents/)

## Archive policy

Dated audits, superseded plans, prototype apps, and moodboard binaries live under [`archive/`](./archive/). Do not cite them as current architecture. See [`ops/DOC_MAINTENANCE.md`](./ops/DOC_MAINTENANCE.md) and [`ops/PRUNE_MATRIX.md`](./ops/PRUNE_MATRIX.md).

## Where to start (agents)

1. Root [`AGENTS.md`](../AGENTS.md)
2. [`ops/AGENT_ONBOARDING_CHECKLIST.md`](./ops/AGENT_ONBOARDING_CHECKLIST.md)
3. This spine — pick the question that matches your task
4. [`plans/TODO.md`](./plans/TODO.md) / [`../GOAL.md`](../GOAL.md) for current work
