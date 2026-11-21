---
status: live
role: ops
spine: start
updated: 2026-08-06
---

# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`CONTEXT.md`** for the specific context (package/app) you're about to work in.
- **`docs/adr/`** at the repo root — read ADRs that touch the area you're about to work in (system-wide decisions).
- **`<context>/docs/adr/`** — also check context-scoped ADR directories for decisions local to a package or app.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Multi-context repo (this repo):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
├── apps/
│   └── app/
│       ├── CONTEXT.md
│       └── docs/adr/                  ← app-specific decisions
└── packages/
    ├── db/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← db-specific decisions
    ├── knowledge-base/
    │   ├── CONTEXT.md                 ← optional / create lazily
    │   └── docs/adr/
    └── ai/
        └── prompts/
            └── CONTEXT.md             ← AI / Prompts (canonical; @repo/prompts)
```

`packages/prompts/CONTEXT.md` is a redirect stub only. Vendor research clients live at `packages/ai/services/` (`@repo/ai/services`) — not a separate domain context (see `docs/plans/AiServicesMerge.md`).

`CONTEXT-MAP.md` lists each context and the path to its `CONTEXT.md`, so a skill can find the right glossary without scanning the whole tree.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
