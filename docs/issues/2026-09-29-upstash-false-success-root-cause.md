---
status: live
role: eng
spine: do
updated: 2026-09-29
lane: A
relates: T-066, T-048
---

# Root cause: why Upstash sync reports success with dead accounts

**Recorded:** 2026-09-29 (CDT, UTC−05:00)
**Follows up:** [`docs/issues/2026-09-29-upstash-sync-reports-success-but-accounts-are-dead.md`](2026-09-29-upstash-sync-reports-success-but-accounts-are-dead.md), which left the cause unconfirmed.
**Scope:** read-only investigation, no code changed, no live Upstash/QStash call made.

## Cause

Two independent bugs, not one. Neither is "a helper swallows an HTTP error" (the hypothesis that was leading) — the deeper-wired HTTP helpers (`lib/upstash/vector.py`, `lib/sync_to_upstash_search_integrated.py`, the QStash SDK itself) actually do inspect the response and do raise/return failure correctly. The false-success banners come from **two print sites that were never wired to those results at all**:

1. **`lib/terminal_display.py:167-170`** (`print_completion_summary`) prints `"🔗 Synced to Upstash Search"` in green as the last thing on screen whenever `data.get('doc_id')` is truthy — i.e., whenever the **local** KB write succeeded. It does not read `self.search_syncer`, does not read any sync result, and runs even when Upstash was never configured at all. Confirmed by offline repro below: passing only `{title, source, doc_id}` — no search_syncer, no network — still prints the false success line.
2. **`lib/kb/knowledge_base_service.py:1127-1134`** (`get_integration_status`, backing `main.py --status`) reports `search_sync: self.search_syncer is not None`. `self.search_syncer` is set the moment `UPSTASH_SEARCH_URL`/`UPSTASH_SEARCH_TOKEN` are non-empty strings (`_init_search_syncer`, lines 58-70) — constructing `IntegratedUpstashSyncer` does zero I/O (just sets headers and reads a local JSON state file). So `--status` prints `Search Sync: ✅` for stale, six-months-dead credentials with no network call made at all. Confirmed by offline repro below.

Everything upstream of these two prints is comparatively honest: the actual sync attempt (`sync_document_to_search`, called a few lines *before* the completion banner in the same functions) does check `response.status_code == 200` and does print an accurate `⚠️ Cloud search sync failed` / `❌ Cloud search sync failed` when it fails. The bug is that the **very next block of code** — the end-of-run summary — throws that result away and prints a hardcoded success line regardless, so a real run's tail output literally contradicts itself: an honest warning followed by a fabricated all-clear that the user reads last.

## Code path table

| Log line | File:line | Condition that prints it |
|---|---|---|
| `⚠️ Cloud search sync failed` / `✅ Synced to cloud search` (mid-run, YouTube path) | [`apps/disclosure-rag/lib/kb/knowledge_base_service.py:551-559`](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L551-L559) | Genuinely checks `sync_document_to_search()`'s boolean return, which checks `response.status_code == 200` in [`lib/sync_to_upstash_search_integrated.py:91-109`](../../apps/disclosure-rag/lib/sync_to_upstash_search_integrated.py#L91-L109). **Correct.** |
| `⚠️ Cloud search sync failed` / `✅ Synced to cloud search` (mid-run, web-article path) | [`apps/disclosure-rag/lib/kb/knowledge_base_service.py:849-857`](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L849-L857) | Same mechanism as above. **Correct.** |
| `🔗 Synced to Upstash Search` (end-of-run banner, both paths) | [`apps/disclosure-rag/lib/terminal_display.py:167-170`](../../apps/disclosure-rag/lib/terminal_display.py#L167-L170), called from [`knowledge_base_service.py:565`](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L565) and [`:862`](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L862) | Only `if doc_id:` — the local-KB write's id. **No connection to `search_syncer` or its result at all. This is the false-success line.** |
| `Search Sync: ✅` (`main.py --status`) | [`apps/disclosure-rag/main.py:1102`](../../apps/disclosure-rag/main.py#L1102), reading [`knowledge_base_service.py:1131`](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1131) | `self.search_syncer is not None`, set in [`_init_search_syncer`, lines 58-70](../../apps/disclosure-rag/lib/kb/knowledge_base_service.py#L58-L70) purely from `os.getenv("UPSTASH_SEARCH_URL")`/`_TOKEN` being non-empty. **No network call at init or at status-check time. This is the second false-success line.** |
| `QStash queue enqueue ✅/❌` (`process_file`, `--upload` path) | [`apps/disclosure-rag/main.py:709-717`](../../apps/disclosure-rag/main.py#L709-L717) → [`_summarize_queue_result`, lines 224-247](../../apps/disclosure-rag/main.py#L224-L247) | Correct today: `add_processed_content_to_queue()` (`lib/upstash/queue.py:70-86`) calls the QStash SDK, which raises on any non-2xx including 429 (verified in SDK source, see below); the raise is caught at the call site and reported `failed`. Vector-upload failure is also checked explicitly (`vector_upload.get("success") is False`). |

## Hypothesis verdicts

1. **"Helpers count accepted/queued as success without checking HTTP status/body."** — **Refuted** for the code that's actually wired up. `lib/sync_to_upstash_search_integrated.py:97` checks `response.status_code == 200`. The QStash SDK (`qstash/http.py:64-77`) raises `QStashError`/`DailyMessageLimitExceededError` on any non-2xx, including 429. `upstash_vector`'s HTTP layer (`upstash_vector/http.py:59-63`) raises `UpstashError` if the JSON body contains an `"error"` key, and `upload_to_vector_db` (`lib/upstash/vector.py:53-94`) wraps the whole call in `try/except Exception`, returning `success: False` on any exception. These layers behave correctly today.
2. **"Broad except logs a warning and the caller continues, stage report still says success."** — **Partially true, but not the mechanism.** The mid-run spinners do correctly show `⚠️`/`❌` on failure (see table). The actual defect is downstream of that: a *separate*, unconditional print statement (`print_completion_summary`) re-declares success at the end of the same run, ignoring the result the spinner just computed. Not "catch-and-continue" so much as "compute the real answer, then print a different, hardcoded one right after."
3. **"'Configured' check only tests env vars present."** — **Confirmed**, and it's the whole story for `main.py --status`. `_init_search_syncer` and `get_integration_status` never make a network call; `search_sync: True` is produced from `os.getenv(...)` truthiness alone. Reproduced offline below with fabricated, never-valid credentials.

**Actual cause, in one line for each of the two banners:** the end-of-run "Synced to Upstash Search" line is a hardcoded print gated only on the *local* doc_id existing (not on any Upstash result), and the `--status` "Search Sync ✅" line is a presence-of-env-vars check with zero liveness verification — both were true before any Upstash account existed and remain true six months after the accounts died.

## Offline repro (no network, no real credentials)

**Repro 1 — end-of-run banner lies even with zero Upstash config:**

```
.venv/bin/python /tmp/.../repro_terminal_display.py
```
```python
from lib.terminal_display import display
display.print_completion_summary({
    "title": "Test Doc",
    "source": "https://example.com/dead-account-test",
    "doc_id": "doc_123",
})
```
Output (trimmed):
```
🔍 Search Integration:
   🔗 Synced to Upstash Search
```
No `search_syncer` object exists in this call at all — the dict passed in has no such key, and the environment had no `UPSTASH_SEARCH_*` vars set. The line prints anyway.

**Repro 2 — `--status`'s `search_sync: True` with fabricated, never-valid credentials:**

```python
import os
os.environ["UPSTASH_SEARCH_URL"] = "https://definitely-deleted-account.upstash.io"
os.environ["UPSTASH_SEARCH_TOKEN"] = "totally-revoked-token-not-real"
from lib.kb.knowledge_base_service import KnowledgeBaseService
svc = KnowledgeBaseService()
print(svc.get_integration_status())
```
Output:
```
INFO:lib.kb.knowledge_base_service:Upstash Search integration enabled
{'local_kb': True, 'search_sync': True, 'search_url': True, 'search_token': True}
```
Note the log line itself: `"Upstash Search integration enabled"` is printed at construction time, before any request is ever made — another spot that asserts health it hasn't checked.

**QStash SDK behavior (read, not executed against real network):** `.venv/lib/python3.14/site-packages/qstash/http.py:64-77` (`raise_for_non_ok_status`) raises `DailyMessageLimitExceededError` on 429 with a `RateLimit-Limit` header, `RateLimitExceededError` on burst 429, and generic `QStashError` on any other non-2xx. This confirms the 429 seen in `docs/plans/TODO.md:1229` ("QStash returned `429 Exceeded daily message limit`") would raise, not silently succeed — consistent with `main.py:709-717` catching it and reporting `failed`.

## Recommended minimal fix

1. **`lib/terminal_display.py:167-170`** — stop hardcoding the line. Either delete it (the mid-run spinner already reports the real per-document outcome) or thread the actual boolean through `data` (e.g. `data['search_sync_ok']`, set by the caller from `search_result`) and gate the print on it, printing `⚠️ Not synced` when false or skipped. ~10 minutes.
2. **`lib/kb/knowledge_base_service.py:1127-1134` / `_init_search_syncer`** — `search_sync` in `get_integration_status()` should not just be "syncer object exists." Cheapest honest fix: change the label from `search_sync` to something like `search_configured` (env vars present) and add a real `search_reachable` field that does one lightweight authenticated GET/HEAD against the Upstash Search endpoint, wrapped in try/except, only when `--status` is invoked (status is already an explicit, opt-in, low-frequency command, so one extra network round trip is cheap). Update `main.py:1098-1119`'s prints to show both. ~30-45 minutes including a quick manual check against the known-dead creds.
3. Optional, larger: fold this into T-066's gate work already noted in `docs/plans/TODO.md:19` ("no Upstash success line counts as proof") — the two fixes above are the concrete code changes that ticket line is gesturing at.

Total: well under an hour for both minimal fixes; matches the "Minimum honesty fix" estimate already logged in the prior issue doc's Proposed Fix §3, just now pointing at the two actual lines instead of a guess.

## What was NOT verified

- No real HTTP call was made to Upstash Vector, Upstash Search, or QStash — all findings for those three come from reading their SDK/HTTP-wrapper source and this repo's call sites, not from observing a live 404/429/timeout in this session.
- Did not re-check whether `UPSTASH_*`/`QSTASH_*` values are literally still present in `.env` right now (read-only investigation; env var *values* were intentionally not printed). The repro used fabricated env vars, not the repo's real `.env` contents.
- Did not check `scripts/playlist_ingestion.py`'s own reporting path in detail — `main.py`'s comments (around line 298) note it calls `process_url()` directly and previously only saw `str(e)` with no stage_report (tracked separately as T-045 M3, said to be closed per `docs/plans/TODO.md:575`); not re-verified against current source in this pass.
- Did not check `STATUS.md`, `INTEGRATION_STATUS.md`, or `README.md` claims (already flagged as stale in the prior issue doc) — this pass focused on the live code path, not the documentation drift.
- Did not test what `IntegratedUpstashSyncer.sync_document_to_search` does on a connection-level failure (DNS/refused) rather than an HTTP error status, though its `except Exception` at [`lib/sync_to_upstash_search_integrated.py:111-113`](../../apps/disclosure-rag/lib/sync_to_upstash_search_integrated.py#L111-L113) should catch that class of failure too — not empirically confirmed.
