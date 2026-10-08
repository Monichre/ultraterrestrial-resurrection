---
status: live
role: eng
spine: do
updated: 2026-09-29
lane: A
relates: T-066, T-048
---

# Upstash "sync to search" reports success, but every Upstash account is dead

**Recorded:** 2026-09-29 15:30 CDT (UTC−05:00)
**Source of the account fact:** Liam, stated 2026-09-29. Both Upstash accounts have been deleted, deprecated, or deactivated for about six months (since roughly 2026-03). Not independently re-checked in this pass.

> **Headline:** Upstash Vector, Upstash Search, and QStash cannot be storing anything. Any doc, banner, or log line that says the Upstash sync worked is wrong. Treat Upstash as **dead** until an account is deliberately revived.

## What is wrong

Several docs and code paths say the Upstash sync is working. None of them ever checked. Nothing in the pipeline reads back from Upstash to confirm a write landed.

| Where | What it claims | Link |
|---|---|---|
| Status report | Layer 3 "Upstash Vector" is `✅ Available`, weight 30%; `UPSTASH_VECTOR_REST_URL=available ✅`; "Vector Databases: FAISS, Upstash, pgvector - ✅ All tested" | [`apps/disclosure-rag/STATUS.md`](apps/disclosure-rag/STATUS.md) |
| Integration report | Upstash Search sync, QStash queue "✅ Working — existing workflow preserved" | [`apps/disclosure-rag/docs/INTEGRATION_STATUS.md`](apps/disclosure-rag/docs/INTEGRATION_STATUS.md) |
| README | Upstash Vector (30%) listed as a live retrieval layer | [`apps/disclosure-rag/README.md`](apps/disclosure-rag/README.md) |
| Queue helper | Builds a result with `"success"` fields for the QStash and vector upload legs | [`apps/disclosure-rag/lib/upstash/queue.py`](apps/disclosure-rag/lib/upstash/queue.py) |
| Search syncer | Returns per-document success from its own HTTP handling | [`apps/disclosure-rag/lib/sync_to_upstash_search_integrated.py`](apps/disclosure-rag/lib/sync_to_upstash_search_integrated.py) |
| Main pipeline | Calls `add_processed_content_to_queue` and logs the outcome | [`apps/disclosure-rag/main.py:97`](apps/disclosure-rag/main.py#L97) |

## Evidence already in the repo

- [`docs/plans/TODO.md`](docs/plans/TODO.md) (2026-09 ingestion re-entry audit): "QStash returned `429 Exceeded daily message limit: Limit: 1`. The Upstash vector `upsert-data` endpoint returned `404`." Consistent with a dead or downgraded account. Recorded as "observed, not chased" and never followed up.
- [`docs/issues/2026-08-14-playlist-ingestion-postmortem.md`](docs/issues/2026-08-14-playlist-ingestion-postmortem.md): "Upstash vector store — not queried." It never established whether any vectors exist there.

## Why the success report is false (cause confirmed 2026-09-29)

Root cause, confirmed by code read and an offline repro: two prints that never check a sync result. The real HTTP layers do detect failure. Full trace: [`docs/issues/2026-09-29-upstash-false-success-root-cause.md`](docs/issues/2026-09-29-upstash-false-success-root-cause.md).

1. [`apps/disclosure-rag/lib/terminal_display.py:167`](apps/disclosure-rag/lib/terminal_display.py#L167) prints "Synced to Upstash Search" whenever a local `doc_id` exists. It never looks at the sync result.
2. [`apps/disclosure-rag/lib/kb/knowledge_base_service.py:1131`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1131) reports `search_sync` as `self.search_syncer is not None`, which is set from env-var presence alone. No network call.

The three earlier hypotheses (helpers swallow HTTP errors, broad `except`, env-var check) were partly wrong: only the env-var-presence one holds, and it feeds `--status`, not the sync itself.

## Impact

- **Retrieval:** The 30% Upstash weight in the five-layer search does not contribute results. Anything documented as "quinuple RAG" is effectively four layers at best.
- **Trust in reports:** A green "Upstash sync" line in `dy` output has no meaning. Same failure class as `status: "ingested"` in T-066.
- **Backup claim:** README calls Upstash "cloud scalability and backup". There is no Upstash backup of any corpus written in the last ~6 months.
- **Neon is the live store.** [`AGENTS.md`](AGENTS.md) already names Neon Postgres + pgvector as primary, and TODO H2 already says "deprecate Upstash Search".

## Retired 2026-09-29 (Liam chose "retire")

- Removed the hardcoded "Synced to Upstash Search" print in [`apps/disclosure-rag/lib/terminal_display.py`](apps/disclosure-rag/lib/terminal_display.py).
- [`apps/disclosure-rag/lib/kb/knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) no longer builds the Upstash Search syncer, and `get_integration_status()` reports `search_sync: False`.
- Removed every Upstash/QStash reference from `apps/disclosure-rag/` code, scripts, tests, packaging and docs (Liam: "remove all upstash references"). Deleted: `lib/upstash/`, `lib/sync_to_upstash*.py` (3 files), `main_fixed.py`, `main_enhanced.py`, `scripts/main_original_backup.py`. Edited: `main.py`, `main.sh` (`sync-rag` command removed), `main_unified.py`, `lib/kb/knowledge_base_service.py`, `lib/adapters/dual_rag_adapter.py`, `lib/unified_rag_orchestrator.py`, `lib/research_queue_manager.py` (now local-file only), UI files, `setup.sh`, `pyproject.toml`, `requirements.txt`, tests.
- Left in place on purpose: the `UPSTASH_*` / `QSTASH_*` lines in the `.env*` files (untracked secrets, not deleted without Liam's say-so), the generated `graft/` index, `corpus/intake/traces/*.log` (historical logs), and `.claude/worktrees/`.
- Also removed two more false-success spots found on the way: `lib/unified_rag_orchestrator.py` marked Upstash "available" whenever the module imported, and the QStash step in `knowledge_base_service.py` printed "✅ Added to processing queue" even when the queue result was a skip.
- Pre-existing breakage, not caused by this change: `scripts/schema_compatibility_analysis.py:168` and `scripts/migrate-to-postgres-xata.py:179` do not parse.

## Not done in this pass

- No code changed. No Upstash credential tested. No run of `dy`.
- The stale banners in the three status docs were annotated, not rewritten. The old claims remain underneath the warning.

## Proposed fix (needs Liam's decision)

**UPDATE 2026-10-07 — Liam confirmed the Upstash provider/account has been revived and is live, but the retire-vs-revive determination is still PENDING.** Revival would likely mean starting from scratch (new index, corpus re-upload, fresh credentials). Do not treat Upstash as either retired or operational: no code has been re-wired to it, no credentials verified, no corpus uploaded. The false-success fixes from 2026-09-29 stand. An investigation of live call sites and from-scratch requirements is in progress (2026-10-07 session).

1. **Retire Upstash** (previous recommendation, now contested by the revival): delete the Upstash calls from the `dy` path, remove the layer from the retrieval weights, drop the env vars. Neon + pgvector already covers the job (T-048 H2). About 1 hour of edits plus a test run.
2. **Revive Upstash:** new account, new tokens, re-upload the corpus. Only worth it if a second vector store has a stated purpose. The provider is available and live as of 2026-10-07; determination pending.
3. **Minimum honesty fix regardless:** make each Upstash helper raise on a non-2xx response and surface it in `stage_report` as `failed`, so the banner cannot say success. About 20 minutes.
