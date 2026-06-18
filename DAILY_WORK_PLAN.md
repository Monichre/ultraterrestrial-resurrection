# Daily Work Plan

**Date:** 2026-06-17
**Sprint:** Phase 2 & 4 — UX Hardening + State Management
**Branch:** dev
**Reference:** `docs/plans/TODO.md`, `AGENTS.md`

> NOTE: Data-Platform Rebuild (SP1-SP4) is **fully complete** as of 2026-06-15/16.
> Neon Postgres 17.10 + pgvector 0.8.0 is live. `@db/xata` is retired. The active
> sprint is now UX Hardening and State Management.

---

## Sub-project status

| # | Sub-project | Status |
|---|-------------|--------|
| **SP1** | Schema + relational load | ✅ DONE — 29 tables loaded + verified on Neon (2026-06-15) |
| **SP2** | Library + ingestion pipeline (re-ingest ~960 files, embeddings, edge extraction) | ✅ DONE — 189 docs / 4,946 chunks / 1,405 entity embeddings live (2026-06-15) |
| **SP3** | App `@db` data-layer cutover (~25 call sites) | ✅ DONE — all call sites migrated to `@db/postgres`, `@db/xata` retired |
| **SP4** | ufo-ui cherry-pick (`NetworkTimelineExplorer`) | ✅ DONE |

---

## Next — Phase 2 & 4 (UX Hardening + State Management)

| Ticket | Description | Priority |
|--------|-------------|----------|
| **T-008** | Paginate graph — graph currently fetches all 230,998 records (known perf issue) | High |
| **T-011** | Sightings data — wire up globe/sightings view with real Postgres data | High |
| **T-012** | Zod validation — audit and complete Zod schemas across API routes | Medium |
| **T-016** | Route cleanup — evaluate migrating `disclosure/chat` consumers to `disclosure/mindmap` or `prometheus/chat`; retire legacy SSE/Xata routes | Medium |
| **T-017** | Cron — secure `cron/update-rankings` with `CRON_SECRET` env var check | Medium |
| **T-018** | Zustand migration (part 1) — identify all React Context state that should move to Zustand | Medium |
| **T-019** | Zustand migration (part 2) — migrate mindmap-context god-object slices | Medium |
| **T-020** | Zustand migration (part 3) — validate state consistency across ViewSwitcher views | Medium |

---

## How agents use this file
1. Check "Next" table for unblocked tasks.
2. Claim by adding an "In Progress" note with your agent name and date.
3. On done → update ticket status and date. Blocked → note reason.
4. Full task detail lives in `docs/plans/TODO.md`.
