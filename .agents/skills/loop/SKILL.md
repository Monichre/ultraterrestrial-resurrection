---
name: loop
description: Run the closed loop — plan, execute, verify, iterate until the goal is done, then ship a PR for review
---

Run the closed development loop for this app until the goal in `GOAL.md` is met.

## 1. Read

- Read `GOAL.md`. If there is no objective or done condition, stop and tell the user to run `/goal` first.
- Require a clean working tree (`git status --porcelain`). If dirty, stop and report.

## 2. Plan

- Break the objective into the smallest set of changes that can satisfy the done condition.
- Create a branch: `agent/loop-<YYYYMMDD>-<slug>`.

## 3. Execute

- Implement the changes. Follow this app's `AGENTS.md` / `CLAUDE.md` conventions.
- Small, surgical diffs. No rewrites unless the objective demands it.

## 4. Verify

Scope verification to the workspace(s) you touched — this is a Bun monorepo (`apps/*`, `packages/*`) with no root-level build/lint/test aggregate.

If you touched `apps/app` (the Next.js app — most tasks):

```bash
bun run build:app                      # root script → next build (note: ignoreBuildErrors is on)
cd apps/app && bun run lint            # ESLint via next lint
cd apps/app && bunx tsc --noEmit       # type gate — see baseline rule below
```

Typecheck gate: a clean `bunx tsc --noEmit` has a known pre-existing baseline of ~1,900 errors (see DAILY_WORK_PLAN.md, 2026-07-05). The pass condition is ZERO NEW errors and zero newly-broken files, and every file you created must be clean. Do not quote or rely on the stale "48 baseline errors" figure.

If you touched `packages/db`:

```bash
cd packages/db && bun run test:db      # live DB connection smoke (requires DATABASE_URL in packages/db/.env)
```

Do not use the root `test:app` script — `apps/app` has no `test` script and it will fail; it is not part of the gate.

Then answer honestly: does the output actually satisfy the done condition in `GOAL.md`?

## 5. Iterate

- If verification fails: fix, re-verify. Cap at 3 rounds.
- If still failing after 3 rounds: stop, report what is blocked, leave the branch in place.
- Never delete, skip, weaken, or narrow tests or verification to make it pass.

## 6. Ship

- Append a row to `GOAL.md`'s Progress table.
- Commit with a message explaining *why*, not just what.
- If an `origin` remote exists: push the branch and open a PR (`gh pr create`) with the objective, what changed, verification results, and done-condition status.
- If no remote: leave the local branch, report the name and summary.

## Hard rules

- Never commit to the default branch.
- Never force-push or rewrite history.
- Never touch files outside this app's directory.
- If anything irreversible would be required, stop and ask the human.
