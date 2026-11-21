# disclosure-rag

Python RAG app. Disconnected from the Next.js app — no shared DB, vectors, or routes.

File references in this tree's docs must be markdown links whose href is the workspace path from repo root (see [`AGENTS.md`](AGENTS.md#markdown-file-links-binding)).

## Commands

Use this app's `.venv` and Python 3.

```bash
cd apps/disclosure-rag
python -m pytest tests/
```

## Gotchas

- Do not treat this tree as wired to [`apps/app`](apps/app).
- Do not implement Agno (or other framework) integrations unless the user asked.
- Env is local ([`.env`](.env)); never commit secrets.

## Knowledge base modules

[`knowledge_base.py`](apps/disclosure-rag/lib/kb/knowledge_base.py), [`knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py), and [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) are three different layers — do not conflate them. Canonical map: [`apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md`](apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md).

## `dy` call chain

Hop-by-hop index of the CLI, with Cmd-clickable `file:line` links: [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md). Router / playlist nesting: [`apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md`](apps/disclosure-rag/docs/DY_COMMAND_CALL_CHAIN.md). Processor skill: [`apps/disclosure-rag/disclosure-rag-processor/SKILL.md`](apps/disclosure-rag/disclosure-rag-processor/SKILL.md).
