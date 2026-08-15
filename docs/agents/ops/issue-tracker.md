---
status: live
role: ops
spine: do
updated: 2026-08-09
---

# Issue tracker: Linear + TODO.md (kept in parity)

Actionable engineering work for this repository lives in the Linear project
**Ultraterrestrial Resurrection** on the **DMG Dev** team (`DMGD`). `docs/plans/TODO.md` is kept
in parity with Linear, not treated as a frozen historical ledger — see the parity rule below.

## Source-of-truth boundary

- Linear owns status, priority, dependencies, and review state — it is authoritative for where a
  ticket currently stands.
- `docs/plans/TODO.md` carries the same active tickets Linear does, in mirrored form, and is
  actively maintained (not just historical `T-*` IDs). **Parity rule:** when you create, update, or
  close a ticket in Linear, make the matching edit in `TODO.md` in the same pass — new tickets get
  a `T-*` entry with the Linear issue linked, status/finding changes get mirrored, closures get
  marked done in both places. If the two ever disagree, Linear's status wins, but treat the
  disagreement as a bug to fix immediately, not a standing state.
- `docs/plans/FEATURES.md` remains the strategic feature and architecture record.
- `DAILY_WORK_PLAN.md` is a session log, not a second ticket board.
- `.scratch/` may hold temporary research maps or specifications, but it is not the issue tracker.

## Agent workflow

1. Find the relevant Linear issue before editing code. Search the Ultraterrestrial Resurrection
   project first to avoid duplicates; check `TODO.md` too since it should mirror Linear.
2. Move claimed work to **In Progress**.
3. Keep implementation details, blockers, and verification evidence on the Linear issue, and
   mirror the status/summary into the matching `TODO.md` entry.
4. Move completed agent work to **In Review**. A human owns final closure unless the user explicitly
   asks the agent to close it. Reflect closure in `TODO.md` at the same time.
5. Create a new issue only when no existing issue covers the work. Use the repository's canonical
   vocabulary and link any governing plan or design document — then add the corresponding `TODO.md`
   entry in the same pass, linking back to the Linear issue.

## Automation

The Linear GraphQL API is available through `LINEAR_API_KEY`. Never print, persist, or commit that
credential. The repository's `/goal` skill can resolve a Linear identifier into `GOAL.md`; `/loop`
then executes the bounded objective on an isolated branch.

## Triage mapping

Use the DMG Dev workflow states directly: **Backlog**, **Todo**, **In Progress**, **In Review**,
**Done**, **Canceled**, and **Duplicate**. Repository-specific label guidance remains in
`docs/ops/triage-labels.md`.
