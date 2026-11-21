---
status: live
role: ops
spine: exists
updated: 2026-07-19
---

# Docs Prune Matrix

Execution checklist for the 2026-07-19 docs root-and-prune. Actions are absolute for this pass.

## DELETE

| Path | Reason |
|------|--------|
| `docs/INDEX.md` | Dead index; wrong tree |
| `docs/DOCUMENTATION_ORGANIZATION_PLAN.md` | Never implemented; superseded |
| `docs/plans/PlannedIntegrations.md` | Empty stub |

## ARCHIVE (root historical → `docs/archive/`)

| Path | Destination |
|------|-------------|
| `docs/ARCHITECTURE_REVIEW.md` | `docs/archive/ARCHITECTURE_REVIEW.md` |
| `docs/PRD.md` | `docs/archive/PRD.md` |
| `docs/ROADMAP.md` | `docs/archive/ROADMAP.md` |
| `docs/MINDMAP_IMPROVEMENT_REPORT.md` | `docs/archive/MINDMAP_IMPROVEMENT_REPORT.md` |
| `docs/PROMETHEUS_WEBGL_FIX.md` | `docs/archive/PROMETHEUS_WEBGL_FIX.md` |
| `docs/SCRATCHPAD.md` | `docs/archive/SCRATCHPAD.md` |

## MOVE → architecture / ops

| Path | Destination |
|------|-------------|
| `docs/API_ROUTES.md` | `docs/architecture/API_ROUTES.md` |
| `docs/RUNBOOK.md` | `docs/architecture/RUNBOOK.md` |
| `docs/CONTRIB.md` | `docs/ops/CONTRIB.md` |
| `docs/CONSUMER_DESCRIPTION.md` | `docs/archive/CONSUMER_DESCRIPTION.md` |

## MOVE → archive/prototypes

| Path | Destination |
|------|-------------|
| `docs/vision/ultraterrestrial-nuclear-shadow-xyflow/` | `docs/archive/prototypes/nuclear-shadow-xyflow/` |
| `docs/vision/canvas/` | `docs/archive/prototypes/canvas/` |
| `docs/brainstorms/` (entire) | `docs/archive/prototypes/brainstorms/` |
| `docs/design/ultraterrestrial-ui-concepts/` | `docs/archive/prototypes/ui-concepts/` |

## MOVE → archive/assets

| Path | Destination |
|------|-------------|
| Brand Bible `*.png`, `*.pdf` | `docs/archive/assets/brand-bible/` |

## MOVE → archive/plans

| Path | Destination |
|------|-------------|
| `docs/plans/BRAINSTORM_IDEAS.md` | `docs/archive/plans/` |
| `docs/plans/data-model-inventory.md` | `docs/archive/plans/` |
| `docs/plans/data-platform-rebuild-spec.md` | `docs/archive/plans/` |
| `docs/plans/disclosure-rag-review.md` | `docs/archive/plans/` |
| `docs/plans/ingestion-analysis.md` | `docs/archive/plans/` |
| `docs/plans/xata-migration-audit.md` | `docs/archive/plans/` |

## MOVE → research + archive/research

| Path | Destination |
|------|-------------|
| `docs/research/ufo-research-methodology.md` | `docs/research/methodology/` |
| `docs/research/llm-wiki-pattern.md` | `docs/research/methodology/` |
| `docs/research/2026-07-09-apossible-library-design-audit.md` | `docs/research/methodology/` |
| `docs/research/agentic-research-methodology/` | `docs/archive/research/` |
| `docs/research/ufo-research__military_sites_ufo_events/` | `docs/archive/research/` |

## MOVE → archive/vision (dated audits)

| Path | Destination |
|------|-------------|
| `docs/vision/2026-07-08-hollow-moon-tour-spec.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-08-memory-first-vision-capture.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-08-memory-first-vision-review.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-09-disclosure-rag-ingestion-audit.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-16-disclosure-rag-main-review.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-19-guided-tour-canvas-design-lab.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-19-impeccable-live-research-canvas.md` | `docs/archive/vision/` |
| `docs/vision/2026-07-19-prompt-caching-review.md` | `docs/archive/vision/` |

Keep in `docs/vision/`: register-tagged canon + `2026-07-09-canonicalization-audit.md` (still cited).

## KEEP (living)

- `docs/plans/FEATURES.md`, `docs/plans/TODO.md`
- `docs/adr/`
- Vision canon: AGENT_ARCHITECTURE_BRIEF, DESIGN_REGISTERS, IMPLEMENTATION_SPEC, RESEARCH_NARRATIVE_RUBRIC, UI_INSPIRATION, UX_LANGUAGE_GUIDE, 2026-07-09-canonicalization-audit
- Brand Bible `.md` / Design Canon / `06_DESIGN_TOKENS.ts`
- `docs/archive/sessions/` (existing)

## RESTORE → docs/ops (from git HEAD docs/agents/)

- `AGENT_ONBOARDING_CHECKLIST.md`
- `triage-labels.md`
- `issue-tracker.md`
- `domain.md`
- Thin `README.md` + `DOC_MAINTENANCE.md`
