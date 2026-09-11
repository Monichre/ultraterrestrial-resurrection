---
status: live
role: rules
spine: do
updated: 2026-08-15
---

# Documentation Maintenance

Thin rules for keeping [`docs/README.md`](docs/README.md) honest. No CI dashboard in this pass.

## File links (binding)

Any documentation file that names a repo path a reader should open **must be a markdown link whose href is the workspace path from repo root**. No `../` climbs, no `/Users/...` paths, no `@/` / `@db/` / `workspace:*` hrefs. Example: [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md). Full rule: [`AGENTS.md`](AGENTS.md#markdown-file-links-binding).

## Living vs archive

- **Living** (`status: live`): ≤ ~25 files. Listed in [`docs/README.md`](docs/README.md).
- **Draft**: dated session notes (`YYYY-MM-DD-*.md`). Promote within ~14 days or move to `docs/archive/`.
- **Archived**: historical truth, prototypes, superseded plans. Do not cite as current architecture.

## Frontmatter (living docs)

```yaml
status: live | draft | archived
role: product | eng | design | rules | research | identity
spine: exists | where | how | want | do | start
updated: YYYY-MM-DD
```

## Where new docs go

| Kind | Put it in |
| ------ | ----------- |
| Product / identity want | root [`PRODUCT.md`](PRODUCT.md) or [`docs/vision/`](docs/vision/) / [`docs/design/`](docs/design/) (root [`DESIGN.md`](DESIGN.md) is **not canonical** — canvas chrome sketch only) |
| How the system works | [`docs/architecture/`](docs/architecture/) or [`docs/adr/`](docs/adr/) |
| Active plan | [`docs/plans/FEATURES.md`](docs/plans/FEATURES.md) or [`docs/plans/TODO.md`](docs/plans/TODO.md) only |
| Session work log | [`docs/archive/sessions/`](docs/archive/sessions/) |
| Prototype / experiment | [`docs/archive/prototypes/`](docs/archive/prototypes/) (never under `vision/`) |
| Research methodology | [`docs/research/methodology/`](docs/research/methodology/) |
| UFO subject deep-dive | [`docs/research/domain/`](docs/research/domain/) or [`packages/knowledge-base/`](packages/knowledge-base/) |
| Agent onboarding / triage | [`.agents/rules/`](.agents/rules/) |

## Do not

- Put Next/Vite apps under `docs/vision/` or living trees
- Recreate `docs/prompts/` (use `packages/ai/prompts/`)
- Recreate persona catalogs under `docs/rules/` or `docs/agents/` (source lives in [`.agents/ultraterrestrial-agent-definitions-v2/`](.agents/ultraterrestrial-agent-definitions-v2/))
- Treat archive Xata / Triple-RAG narratives as live architecture
- Commit bulk PNG/PDF moodboards into living `docs/design/`

## After structural moves

1. Update [`docs/README.md`](docs/README.md) spine links
2. Update root [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md) if paths changed
3. Note in [`DAILY_WORK_PLAN.md`](DAILY_WORK_PLAN.md)
