# CLAUDE.md

How to work in this repo. Not an explanation of Ultraterrestrial.

## Execution contract

The user's current explicit task is the active scope.

Execute that task as narrowly as possible. Do not expand it based on
roadmaps, TODOs, architecture documents, adjacent problems, or ideas
discovered during implementation.

Repository documentation provides constraints and context. It does not
create additional work unless the user explicitly asks for that work.

### Default execution loop

For ordinary implementation tasks:

1. Identify the narrow requested outcome.
2. Inspect only the relevant edit path.
3. Make the smallest coherent change.
4. Run the narrowest relevant verification.
5. Report the result briefly.
6. Stop.

### Context discipline

Do not perform repository onboarding before ordinary tasks.

Before opening a file, it should be:

- named by the user;
- on the active import/dependency path;
- necessary to understand an interface being changed;
- needed for targeted verification; or
- necessary because implementation is otherwise blocked.

Do not browse files for general understanding.

README files, AGENTS.md, FEATURES.md, TODO.md, DAILY_WORK_PLAN.md,
product documents, vision documents, research notes, and historical plans
are on-demand references only.

Do not proactively explore directories to discover additional instructions.
Nested CLAUDE.md files encountered on the active edit path may provide
local constraints but do not expand task scope.

### Documentation is passive

The existence of documentation, TODOs, plans, or architectural proposals
is NOT an instruction to:

- implement them;
- reconcile them;
- update them;
- audit against them;
- summarize them;
- create tickets from them; or
- suggest additional work derived from them.

Only the user's task activates work.

### Scope lock

Unless explicitly requested, do not:

- perform adjacent refactors;
- create tickets or worklogs;
- create markdown documentation;
- update project-management files;
- perform architecture audits;
- conduct repository-wide searches for improvement opportunities;
- spawn subagents, agents, teams, or parallel explorers;
- turn discoveries into new workstreams.

Delegation is opt-in. Do not spawn subagents unless the user explicitly
requests delegation or the task clearly requires independent parallel work.

If an unrelated issue is important enough to mention, include one short
note after completing the requested task. Do not act on it.

### Course correction

A new user instruction immediately supersedes the current implementation
plan.

If the user says stop, no, not that, too much, or otherwise redirects the
task, stop the abandoned approach immediately. Do not finish pending
exploration first.

### Clarification

Ask a question only when ambiguity would materially change the
implementation and cannot be resolved from the active code path.

Otherwise make the narrowest reasonable assumption and proceed.

### Response discipline

Default completion response:

1. What changed.
2. Verification performed.
3. Any blocker or directly relevant discovery.

Do not include repository tours, architecture recaps, unsolicited
recommendations, lengthy rationale, or summaries of files merely inspected.

Straightforward task responses should usually fit within 3-8 lines.

## Commands

From repo root (`bun`):

| Command | Description |
| --------- | ------------- |
| `bun run dev:app` | Next.js app (`apps/app`) |
| `bun run build:app` | Production build |
| `bun run test:app` | App tests (Vitest/bun in `apps/app`) |
| `bun run storybook` | Storybook on port 6006 |
| `bun run dev:disclosure-lab` | Disclosure Lab on port 3010 |
| `bun run db:test:db` | `@db/postgres` tests |
| `cd apps/disclosure-rag && python -m pytest tests/` | Python RAG tests (use that app's `.venv`) |

Frontend lint: `cd apps/app && bun run lint`. Token check: `cd apps/app && bun run validate:tokens`.

## Project-specific gotchas

- **`@db/xata` / `@db` / `xata.db.*` are dead.** All live DB work is `@db/postgres` (`getSql()`, typed helpers). `personnel` aliases to `key_figures`.
- **`DATABASE_URL` lives in `packages/db/.env`.** Never commit it.
- **Never `git stash` on this working tree.** Concurrent agent sessions share disk; stash is destructive to other sessions' uncommitted work. Stage your paths only.
- **Do not add state to `mindmap-context.tsx`.** Use Zustand `mindmap-ui-store`. Canvas navigation is `setActiveView()`, not `router.push()`.
- **Prometheus lives at `@/services/ai/prometheus`.** There is no `@/features/agents/`.
- **Python RAG (`apps/disclosure-rag/`) does not share data or vectors with the Next.js app.** Do not wire them together unless asked.
- **OpenAI Vector Store MCP (`packages/openai-vector-store-mcp/`)** exposes the app's shared vector store as read-only `search`/`fetch` tools — the fidelity-check surface for the corpus. Usage, workflows, and known defects: `packages/openai-vector-store-mcp/USAGE.md`. Not yet registered in root `.mcp.json` (T-051).
- **Do not invent Triple RAG, FAISS-in-Next, Neo4j, or a multi-agent tour orchestrator.** Those are myths. Live Next.js AI: disclosure mindmap (`/api/disclosure/mindmap`) and Prometheus chat (`/api/prometheus/chat`).
- **Do not call a feature done on green tests alone.** If you claim complete: evidence (command + output) and a visual pass in the running app, or say **UNVERIFIED**. Protocol: `docs/agents/ops/DEFINITION_OF_DONE.md` — open only when claiming done.
- Prettier in the app: no semicolons, single quotes, 100 char width, 2 spaces. Imports: `@/` app, `@db/` database, `workspace:*` packages.

## References — open only when required

- `AGENTS.md` — full development guidelines (stack, DoD short form, lanes)
- `docs/agents/ops/AGENT_ONBOARDING_CHECKLIST.md` — onboarding only
- `docs/README.md` — docs spine
- `docs/plans/FEATURES.md` / `TODO.md` / `DAILY_WORK_PLAN.md` — planning files; passive unless the task is planning
- `docs/vision/` — identity/UX; open only for brand/UX work
- `apps/app/CLAUDE.md` — Next.js app local constraints (loaded when working in that tree)
- `apps/app/src/features/mindmap/CLAUDE.md` — mindmap/canvas local constraints
- `apps/disclosure-rag/CLAUDE.md` — Python RAG local constraints
- Personal overrides: `CLAUDE.local.md` (project) or `~/.claude/CLAUDE.md` (global)
