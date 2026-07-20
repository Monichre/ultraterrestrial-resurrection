# /drive — Self-driving work loop

Autonomously execute tasks using the three-tier project management system.

## Before Starting

Read all three tiers:
1. `docs/plans/FEATURES.md` — strategic context (understand the why)
2. `docs/plans/TODO.md` — pick the first actionable `[ ]` ticket
3. `DAILY_WORK_PLAN.md` — current session priorities (overrides backlog if populated)

## Loop

1. Pick next task from DAILY_WORK_PLAN.md Active section (or promote from TODO.md)
2. Mark `[~]` in_progress
3. Read the relevant FEATURE entry for architectural context
4. Implement
   - Frontend: `apps/app/src/` (Next.js App Router, Server Components by default)
   - DB: `packages/db/src/postgres/` only — @db/xata is retired
   - AI: `packages/ai/` for shared AI logic, Vercel AI SDK for routes
5. Run checks: `cd apps/app && bun run lint` + `bun run build`
6. Mark `[x]` done with date
7. Update DAILY_WORK_PLAN.md
8. Repeat

## Architecture Non-Negotiables

- `@db/postgres` is the ONLY live database layer — never use `@db/xata`
- App Router only — no `getServerSideProps`/`getStaticProps` patterns
- Server Components by default — add `'use client'` only for interactivity
- Embeddings: `text-embedding-3-small` @ 1536 dims
- Clerk auth: middleware NOT YET implemented — skip auth checks until instructed

## Stop Conditions

- Build fails after 2 fix cycles → note blocker in TODO.md, stop
- Task requires Clerk middleware (not yet implemented) → note dependency, move on
- Task touches the three-tier system structure itself → pause, ask user
- 3+ tasks done in session → summarize and check in

## After Each Task

Update all three tiers as needed:
- Cross off in TODO.md
- Note completion in DAILY_WORK_PLAN.md
- Update FEATURES.md if architectural decisions were made
