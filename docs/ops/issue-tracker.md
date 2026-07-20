---
status: live
role: ops
spine: do
updated: 2026-07-19
---

# Issue tracker: Linear

Actionable engineering work for this repository lives in the Linear project
**Ultraterrestrial Resurrection** on the **DMG Dev** team (`DMGD`).

## Source-of-truth boundary

- Linear owns implementation tickets, status, priority, dependencies, and review state.
- `docs/plans/FEATURES.md` remains the strategic feature and architecture record.
- `DAILY_WORK_PLAN.md` is a session log, not a second ticket board.
- `docs/plans/TODO.md` is a migration ledger for historical `T-*` identifiers. Do not add new
  implementation tickets there after the Linear cutover.
- `.scratch/` may hold temporary research maps or specifications, but it is not the issue tracker.

## Agent workflow

1. Find the relevant Linear issue before editing code. Search the Ultraterrestrial Resurrection
   project first to avoid duplicates.
2. Move claimed work to **In Progress**.
3. Keep implementation details, blockers, and verification evidence on the Linear issue.
4. Move completed agent work to **In Review**. A human owns final closure unless the user explicitly
   asks the agent to close it.
5. Create a new issue only when no existing issue covers the work. Use the repository's canonical
   vocabulary and link any governing plan or design document.

## Automation

The Linear GraphQL API is available through `LINEAR_API_KEY`. Never print, persist, or commit that
credential. The repository's `/goal` skill can resolve a Linear identifier into `GOAL.md`; `/loop`
then executes the bounded objective on an isolated branch.

## Triage mapping

Use the DMG Dev workflow states directly: **Backlog**, **Todo**, **In Progress**, **In Review**,
**Done**, **Canceled**, and **Duplicate**. Repository-specific label guidance remains in
`docs/ops/triage-labels.md`.
