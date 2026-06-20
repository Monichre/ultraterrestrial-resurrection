# Daily Work Plan

**Date:** 2026-06-20
**Sprint:** Phase 2/3/4 — autonomous board-clear (multi-agent dev session)
**Branch:** dev
**Reference:** `docs/plans/TODO.md`, `AGENTS.md`

> RECONCILED 2026-06-20: T-011, T-012, T-016(ph1), T-017, T-018, T-019, T-021,
> T-022, T-024 verified DONE in code (commit 3edff59) — board was stale. Remaining
> open set below is being cleared by a supervised multi-agent session.

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

## Next — open board (cleared in supervised waves)

| Ticket | Description | Priority | Wave |
|--------|-------------|----------|------|
| **T-030+T-031** | Migrate 6 `disclosure/chat` consumers → `disclosure/mindmap`, delete legacy chat route + dead historical-query chain | High | 1 |
| **T-008** | Paginate graph — bound initial load to 200-500 nodes, O(1) edge resolution | High | 1 |
| **T-023+T-029** | Docs — clean stale refs from FEATURES.md; author UFO research methodology framework | Medium | 1 |
| **T-025** | Wire rate limiting into canonical AI routes (prometheus/chat, disclosure/mindmap) | Medium | 2 |
| **T-020** | Finish Zustand canvas-slice migration — move remaining useState out of mindmap-context | Medium | 2 |
| **T-027** | ResearchSession unified state slice (converge fragmented providers) | Medium | 3 |
| **T-026** | Monitoring (Sentry) — scaffold, BLOCKED on DSN credential | Low | 3 |
| **T-028** | Mindmap Agent Consolidation (L) — baseline audit + design, impl deferred | Low | 3 |

---

## How agents use this file
1. Check "Next" table for unblocked tasks.
2. Claim by adding an "In Progress" note with your agent name and date.
3. On done → update ticket status and date. Blocked → note reason.
4. Full task detail lives in `docs/plans/TODO.md`.
