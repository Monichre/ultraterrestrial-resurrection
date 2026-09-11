# Disclosure Lab

Admin console over Neon Postgres, the local knowledge-base archive, and the OpenAI Vector Store.

**Canonical spec:** [`docs/plans/2026-08-09-disclosure-lab.md`](../../docs/plans/2026-08-09-disclosure-lab.md)  
**Linear:** DMGD-216 / T-052

## Run

```bash
# from repo root
bun install
bun run dev:disclosure-lab
# → http://localhost:3010
```

Loads `DATABASE_URL` from [`packages/db/.env`](packages/db/.env) (live Neon by design). Optional overrides in `apps/disclosure-lab/.env.local`.

Requires `OPENAI_API_KEY` for the assistant pane and vector-store search. Vector store id is `OPENAI_VECTOR_STORE_ID` (same store Prometheus `file_search` uses).

## Retrieval surfaces

| Surface | What it is | Lab path |
|---------|------------|----------|
| Neon | Entity tables via `@db/postgres` | `/`, `/sql`, `/search` (Neon) |
| Knowledge base | Disk archive at [`packages/knowledge-base`](packages/knowledge-base) (`metadata/index.json`) | `/corpus`, `/search` (Knowledge base) |
| Vector store | OpenAI Vector Store search/fetch — same contract as [`packages/openai-vector-store-mcp`](packages/openai-vector-store-mcp) | `/search` (Vector store) |

Compare mode on `/search` runs all three in parallel.

The lab calls the OpenAI Vector Store API directly (search + fetch). It does not spawn the Python MCP process. Same store, same tool shapes.

## Safety

- Trusted single-operator tool
- Writes hit whatever Neon `DATABASE_URL` points at
- Confirm every INSERT/UPDATE
- DELETE / TRUNCATE / DDL blocked in v1
- Knowledge-base and vector-store paths are read-only
- Audit log: `.data/audit.jsonl` (gitignored)

## Routes

| Path | Role |
|------|------|
| `/` | Split pane: tables + assistant |
| `/overview` | Neon counts + KB index + vector-store file counts |
| `/corpus` | Browse/search the local knowledge-base archive |
| `/sql` | Human SQL (no DELETE) |
| `/charts` | Aggregates |
| `/search` | Neon / KB / vector-store / compare |
| `/audit` | Write trail |
