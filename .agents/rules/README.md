---
status: live
role: ops
spine: start
updated: 2026-07-19
---

# Agent Rules

Shared rules for Cursor, Claude, Codex, and anything else that reads [`.agents/rules/**`](.agents/rules/). Platform-specific extras stay in [`.cursor/rules/`](.cursor/rules/) and [`.claude/`](.claude/).

## Start here

1. [AGENT_ONBOARDING_CHECKLIST.md](./AGENT_ONBOARDING_CHECKLIST.md) — mandatory agent intake
2. [domain.md](./domain.md) — how to consume CONTEXT / CONTEXT-MAP
3. [issue-tracker.md](./issue-tracker.md) — local markdown issues under `.scratch/`
4. [triage-labels.md](./triage-labels.md) — five canonical triage labels
5. [CONTRIB.md](./CONTRIB.md) — contribution / DB conventions
6. [DOC_MAINTENANCE.md](./DOC_MAINTENANCE.md) — how to add or archive a doc
7. [PRUNE_MATRIX.md](./PRUNE_MATRIX.md) — 2026-07-19 prune decisions

## Not here

- Research **personas** → [`packages/ai/agents/`](packages/ai/agents/)
- Prompt **registry** → [`packages/ai/prompts/`](packages/ai/prompts/)
- Suite source → [`.agents/ultraterrestrial-agent-definitions-v2/`](.agents/ultraterrestrial-agent-definitions-v2/)
- IDE subagents → [`.cursor/agents/`](.cursor/agents/), [`.claude/agents/`](.claude/agents/)
- Work logs → [`docs/archive/sessions/`](docs/archive/sessions/) only
