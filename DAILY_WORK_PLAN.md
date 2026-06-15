# Daily Work Plan

**Date:** 2026-06-15
**Sprint:** Data-Platform Rebuild — Sub-project #1 (Azure→host-agnostic schema + relational load)
**Branch:** dev
**Reference:** `docs/design/data-platform-rebuild-spec.md`

> NOTE: The pre-2026-06 "Research Canvas Hardening" sprint (T-001…T-029) is
> superseded. Xata died; the live work is the greenfield Postgres+pgvector
> rebuild. See the spec + `docs/SCRATCHPAD.md` for full history.

---

## Sub-project status

| # | Sub-project | Status |
|---|-------------|--------|
| **1** | Schema + relational load | **✅ DONE — loaded + verified on Neon (2026-06-15)** |
| 2 | Library + ingestion pipeline (re-ingest ~960 files, embeddings, edge extraction) | **NEXT — unblocked** |
| 3 | App `@db` data-layer cutover (~25 call sites) | blocked on #1+#2 |
| 4 | ufo-ui cherry-pick (`NetworkTimelineExplorer`) | independent / unblocked |

## SP1 — detailed

### Done
- [x] Schema DDL — `packages/db/migrations/rebuild/0001_init.sql` (29 tables, nodes/edges, vector(1536), FTS, trgm) + 3 fix commits
- [x] **CSV loader** — `packages/db/scripts/rebuild/load_csv.py` (host-agnostic, `--dry-run`/`--load`/`--verify`)
- [x] **Live-DB ops** — `packages/db/scripts/rebuild/db_ops.py` (bulk insert + nodes/edges seed + verification)
- [x] **Dry-run validated** (2026-06-15): all 9 entity tables match audited dedup counts. 8 node-types → 58,819 nodes; 2,029 structural edges.
- [x] Decision reversal: **Azure dropped** (2026-06-15). AGE was Azure's only edge and it's deferred → any managed Postgres+pgvector works. Schema/loader unchanged (DATABASE_URL-driven).
- [x] Finding: `artifacts` real count is **36**, not spec's 259 (verified — clean 7× dup, no corruption).

### Next (blocker → host)
- [ ] **Pick host** (Supabase / Neon / local Postgres). ← only blocker for live load
- [ ] Apply `0001_init.sql` to the chosen DB
- [ ] `pip install "psycopg[binary]"`; `export DATABASE_URL=…`
- [ ] `python load_csv.py --load` then `--verify`
- [ ] Commit SP1 loader

### Notes / known data facts
- `documents` loads **0 rows** in #1 (corrupted embeddings → re-ingest in #2).
- `personnel` sourced from `key-figures.csv` (has photo data); `personnel.csv` discarded.
- App tables sparse in export: users=1, user_notes=0, mindmaps=0, summary_files=1, user_saved_events=25, other user_saved_*=0. `theory` FKs (→user_notes) will be NULL/dangling — expected.
- `sightings.comments` `&#44`→`,` decode handled; Python-repr arrays → text[] handled.

---

## How agents use this file
1. Check "Next" for the unblocked task.
2. Claim by moving to an "In Progress" block with your agent name.
3. On done → "Done" with date. Blocked → note reason.
4. Full task detail lives in `docs/design/data-platform-rebuild-spec.md`.
