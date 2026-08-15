# Disclosure Lab

Admin console over Neon Postgres via `@db/postgres`.

**Canonical spec:** [`docs/plans/2026-08-09-disclosure-lab.md`](../../docs/plans/2026-08-09-disclosure-lab.md)  
**Linear:** DMGD-216 / T-052

## Run

```bash
# from repo root
bun install
bun run dev:disclosure-lab
# → http://localhost:3010
```

Loads `DATABASE_URL` from `packages/db/.env` (live Neon by design). Optional overrides in `apps/disclosure-lab/.env.local`.

Requires `OPENAI_API_KEY` for the assistant pane.

## Safety

- Trusted single-operator tool
- Writes hit whatever Neon `DATABASE_URL` points at
- Confirm every INSERT/UPDATE
- DELETE / TRUNCATE / DDL blocked in v1
- Audit log: `.data/audit.jsonl` (gitignored)

## Routes

| Path | Role |
|------|------|
| `/` | Split pane: tables + assistant |
| `/overview` | Counts + embedding coverage |
| `/sql` | Human SQL (no DELETE) |
| `/charts` | Aggregates |
| `/search` | FTS/vector smoke |
| `/audit` | Write trail |
