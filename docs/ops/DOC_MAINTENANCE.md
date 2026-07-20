---
status: live
role: ops
spine: do
updated: 2026-07-19
---

# Documentation Maintenance

Thin rules for keeping `docs/` honest. No CI dashboard in this pass.

## Living vs archive

- **Living** (`status: live`): ≤ ~25 files. Listed in [docs/README.md](../README.md).
- **Draft**: dated session notes (`YYYY-MM-DD-*.md`). Promote within ~14 days or move to `docs/archive/`.
- **Archived**: historical truth, prototypes, superseded plans. Do not cite as current architecture.

## Frontmatter (living docs)

```yaml
status: live | draft | archived
role: product | eng | design | ops | research | identity
spine: exists | where | how | want | do | start
updated: YYYY-MM-DD
```

## Where new docs go

| Kind | Put it in |
|------|-----------|
| Product / identity want | root `PRODUCT.md` / `DESIGN.md` or `docs/vision/` |
| How the system works | `docs/architecture/` or `docs/adr/` |
| Active plan | `docs/plans/FEATURES.md` or `TODO.md` only |
| Session work log | `docs/archive/sessions/YYYY-MM/` |
| Prototype / experiment | `docs/archive/prototypes/` (never under `vision/`) |
| Research methodology | `docs/research/methodology/` |
| UFO subject deep-dive | `docs/research/domain/` or `packages/knowledge-base/` |
| Agent onboarding / triage | `docs/ops/` |

## Do not

- Put Next/Vite apps under `docs/vision/` or living trees
- Recreate `docs/prompts/` (use `packages/ai/prompts/`)
- Recreate persona catalogs under `docs/ops/` or `docs/agents/`
- Treat archive Xata / Triple-RAG narratives as live architecture
- Commit bulk PNG/PDF moodboards into living `docs/design/`

## After structural moves

1. Update [docs/README.md](../README.md) spine links
2. Update root `CLAUDE.md` / `AGENTS.md` if paths changed
3. Note in `DAILY_WORK_PLAN.md`
