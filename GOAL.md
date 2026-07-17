# GOAL — Ultraterrestrial Resurrection

## Objective

Debug, correctly configure, and run Storybook for `apps/app` so the component workspace is usable for local development.

## Source

inline — user request on 2026-07-16; context: Codex task `019eab4d-6bc7-7830-bd0d-cb7eee84dabf`

## Done when

- Storybook starts from the repository's documented command and remains available on its configured local port.
- The Storybook static build completes successfully.
- Blocking configuration, dependency, compilation, and runtime errors discovered during startup are fixed.
- Representative stories render in the browser without blocking console or preview errors.
- Any story-specific failures left outside the setup/debugging scope are identified with reproducible evidence.

## Constraints

- Scope implementation to Storybook setup, configuration, dependencies, and fixes required for stories to load in `apps/app`.
- Preserve all unrelated changes in the shared dirty worktree; never stash or rewrite them.
- Follow existing `apps/app` package-manager, formatting, and Storybook conventions.
- Do not redesign components or change production behavior unless a minimal compatibility fix is required and verified.
- Do not claim success from startup output alone; verify both the static build and rendered browser behavior.

## Progress

| Date | Run | Result |
|------|-----|--------|
| 2026-07-16 20:10:44 CDT | goal-set | Replaced the prior ticket-swarm objective with the Storybook setup and debugging objective. |
