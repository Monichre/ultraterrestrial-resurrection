# GOAL — Ultraterrestrial Resurrection

## Objective

Complete the actionable remainder of tickets T-028 and T-037 through T-042, and bring T-036 to a decision-ready research state.

## Source

inline — user request on 2026-07-12

## Done when

- T-028 and T-037 through T-042 have implemented, verified outcomes or explicit external blockers recorded with evidence.
- T-036 has a current, decision-ready recommendation without expanding into an unapproved multi-week implementation.
- The three planning tiers agree on ticket status and next actions.
- Touched application files introduce zero new TypeScript errors; relevant builds, lint checks, database tests, and runtime checks pass where credentials permit.
- Changes are committed on an isolated branch and a PR is opened for human review when `origin` is available.

## Constraints

- Preserve the user's checkpoint commit and unrelated existing work.
- Follow the identity and UX canon in `docs/vision/`, `DESIGN.md`, and `PRODUCT.md`.
- Use `@db/postgres`; do not revive Xata or dead agent paths.
- Do not claim externally blocked verification as complete.
- Do not implement the multi-week T-036 platform without a separate explicit decision.
- Keep parallel agent file ownership non-overlapping and integrate in dependency order.

## Progress

| Date | Run | Result |
|------|-----|--------|
