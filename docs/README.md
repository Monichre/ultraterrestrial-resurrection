---
status: live
role: ops
spine: exists
updated: 2026-08-15
---

# Documentation

Navigation for Ultraterrestrial Resurrection. Living docs only — everything else is under [`archive/`](./archive/).

## Six-question spine

| # | Question | Go here |
| --- | ---------- | --------- |
| 1 | **What exists?** | This file + living-canon list below |
| 2 | **Where is it?** | Paths in the table; root product files stay at repo root |
| 3 | **How does it work?** | [`architecture/`](./architecture/) · [`adr/`](./adr/) · [`vision/IMPLEMENTATION_SPEC.md`](./vision/IMPLEMENTATION_SPEC.md) |
| 4 | **What do we want?** | [`PRODUCT.md`](PRODUCT.md) · [`docs/vision/`](docs/vision/) · [`docs/design/design-lab/`](docs/design/design-lab/) · [`docs/plans/FEATURES.md`](docs/plans/FEATURES.md) · [`DESIGN.md`](DESIGN.md) (**not canonical** — canvas chrome sketch only) |
| 5 | **How do we do it?** | [`docs/plans/TODO.md`](docs/plans/TODO.md) · [`GOAL.md`](GOAL.md) · [`DAILY_WORK_PLAN.md`](DAILY_WORK_PLAN.md) |
| 6 | **Where do I start?** | [`.agents/rules/AGENT_ONBOARDING_CHECKLIST.md`](.agents/rules/AGENT_ONBOARDING_CHECKLIST.md) · [`README.md`](README.md) · [`AGENTS.md`](AGENTS.md) |

## Tree (living)

```
docs/
  README.md                 ← you are here
  adr/                      decisions
  architecture/             API_ROUTES, RUNBOOK
  vision/                   identity canon (flat markdown)
  design/brand-bible/       design text + tokens (no bulk binaries)
  plans/                    FEATURES.md + TODO.md + dated canonical specs
  research/methodology/     platform research doctrine
  research/domain/          UFO subject deep-dives (when present)
  archive/                  historical, sessions, prototypes, assets

.agents/
  rules/**                  shared agent rules (DoD, onboarding, triage)
  skills/                   cross-harness skills
  ultraterrestrial-agent-definitions-v2/  research-suite source
```

## Living canon

### Repo root

- [`README.md`](README.md) · [`AGENTS.md`](AGENTS.md) · [`CLAUDE.md`](CLAUDE.md)
- [`PRODUCT.md`](PRODUCT.md) · [`GOAL.md`](GOAL.md) · [`DESIGN.md`](DESIGN.md) (**not canonical** — limited canvas chrome)
- [`CONTEXT.md`](CONTEXT.md) · [`CONTEXT-MAP.md`](CONTEXT-MAP.md) · [`DAILY_WORK_PLAN.md`](DAILY_WORK_PLAN.md)

### docs/

| File | Role | Spine |
| ------ | ------ | ------- |
| [architecture/API_ROUTES.md](./architecture/API_ROUTES.md) | eng | how |
| [architecture/RUNBOOK.md](./architecture/RUNBOOK.md) | eng | how / do |
| [adr/0001-agent-inferences-excluded-from-retrieval.md](./adr/0001-agent-inferences-excluded-from-retrieval.md) | eng | how |
| [adr/0002-temporal-observatory-gl4ss-integration.md](./adr/0002-temporal-observatory-gl4ss-integration.md) | eng | how |
| [plans/FEATURES.md](./plans/FEATURES.md) | product | want |
| [plans/TODO.md](./plans/TODO.md) | eng | do |
| [plans/2026-08-09-disclosure-lab.md](./plans/2026-08-09-disclosure-lab.md) | eng | do |
| [plans/2026-08-09-research-canvas-genui.md](./plans/2026-08-09-research-canvas-genui.md) | eng | do |
| [vision/AGENT_ARCHITECTURE_BRIEF.md](./vision/AGENT_ARCHITECTURE_BRIEF.md) | identity | want / how |
| [vision/DESIGN_REGISTERS.md](./vision/DESIGN_REGISTERS.md) | identity | want |
| [vision/IMPLEMENTATION_SPEC.md](./vision/IMPLEMENTATION_SPEC.md) | identity | how |
| [vision/RESEARCH_NARRATIVE_RUBRIC.md](./vision/RESEARCH_NARRATIVE_RUBRIC.md) | identity | want |
| [vision/TEMPORAL_OBSERVATORY.md](./vision/TEMPORAL_OBSERVATORY.md) | product + eng | want |
| [vision/UX_LANGUAGE_GUIDE.md](./vision/UX_LANGUAGE_GUIDE.md) | identity | want |
| [vision/UI_INSPIRATION.md](./vision/UI_INSPIRATION.md) | design | want |
| [vision/2026-07-09-canonicalization-audit.md](./vision/2026-07-09-canonicalization-audit.md) | identity | where |
| [research/methodology/ufo-research-methodology.md](./research/methodology/ufo-research-methodology.md) | research | how |

### Agent config (not under `docs/`)

| File | Role | Spine |
| ------ | ------ | ------- |
| [`.agents/rules/AGENT_ONBOARDING_CHECKLIST.md`](.agents/rules/AGENT_ONBOARDING_CHECKLIST.md) | ops | start |
| [`.agents/rules/CONTRIB.md`](.agents/rules/CONTRIB.md) | ops | do |
| [`.agents/rules/DOC_MAINTENANCE.md`](.agents/rules/DOC_MAINTENANCE.md) | ops | do |
| [`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md) | ops | do |

Prompts and research personas live in packages, not docs:

- [`packages/ai/prompts/`](packages/ai/prompts/)
- [`packages/ai/agents/`](packages/ai/agents/)

### App-local (not under `docs/`)

- [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md) — `dy` hop index (Cmd-clickable `file:line`)
- [`apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md`](apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md) — `dy` router / playlist nesting
- [`apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md`](apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md) — service vs CRUD vs vector `KnowledgeBase`

## Markdown file links

Every documentation file that names a repo path a reader should open must use a markdown link whose href is the workspace path from repo root. No `../` climbs and no `@/` hrefs. Binding rule: [`AGENTS.md`](AGENTS.md#markdown-file-links-binding). Maintenance: [`.agents/rules/DOC_MAINTENANCE.md`](.agents/rules/DOC_MAINTENANCE.md).

## Archive policy

Dated audits, superseded plans, prototype apps, and moodboard binaries live under [`archive/`](./archive/). Do not cite them as current architecture. See [`.agents/rules/DOC_MAINTENANCE.md`](.agents/rules/DOC_MAINTENANCE.md) and [`.agents/rules/PRUNE_MATRIX.md`](.agents/rules/PRUNE_MATRIX.md).

## Where to start (agents)

1. Root [`AGENTS.md`](AGENTS.md)
2. [`.agents/rules/AGENT_ONBOARDING_CHECKLIST.md`](.agents/rules/AGENT_ONBOARDING_CHECKLIST.md)
3. This spine — pick the question that matches your task
4. [`docs/plans/TODO.md`](docs/plans/TODO.md) / [`GOAL.md`](GOAL.md) for current work
