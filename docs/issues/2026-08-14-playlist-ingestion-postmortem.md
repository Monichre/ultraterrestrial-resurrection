---
status: live
role: eng
spine: do
updated: 2026-08-14
lane: A
relates: T-048
---

# Playlist Ingestion Postmortem — American Alchemy run, 2026-08-07

**Investigated:** 2026-08-14
**Subject:** `apps/disclosure-rag/corpus/intake/playlist_ingestion/`
**Method:** four parallel read-only Sonnet subagents (provenance / failure-modes / salvage / coverage), cross-reconciled. No files mutated, no ingestion re-run.

> **Headline:** the run did *not* partially succeed. `status: "ingested"` is not what it sounds like — **zero of the 104 videos produced a single chunk, embedding, or entity row in any reachable store.** What survives is a genuinely valuable transcript corpus (49 files, 1,383,742 words) and nothing downstream of it.

---

## 1. What kicked it off

Not one ingestion — **11 runs across two sittings**, all via the `dy playlist` command (`apps/disclosure-rag/scripts/playlist_ingestion.py`, committed `807cbd55` on 2026-07-23, wired into `main.sh` the same afternoon by `05190432`).

| # | Report (UTC) | Local (CDT) | Target playlist | Outcome |
|---|---|---|---|---|
| 1 | `run-20260723-214411` | Jul 23 16:44 | unknown | `enumeration_failed: 1` — smoke test ~1 min after wiring |
| 2 | `run-20260724-061848` | Jul 24 01:18 | **DEBRIEFED / Area52 w/ Chris Ramsay** (`PLI6QOLLB2jIfwijne4pyLLr7Ug0M6RQbS`) | `ingested: 6`, `no_transcript: 94` |
| 3 | `run-20260807-004559` | Aug 6 19:45 | American Alchemy (`PLpvZy2482-kjlxGoFLPHJFQ1lNRD_49uN`) | `no_transcript: 1` |
| 4 | `run-20260807-004813` | Aug 6 19:48 | same | `no_transcript: 1` |
| 5 | `run-20260807-005438` | Aug 6 19:54 | same | `ingested: 3` (fidelity flat 0.5 — scorer bug) |
| 6 | `run-20260807-005619` | Aug 6 19:56 | same | `dry_run: 2` (fidelity now 0.92x — bug fixed) |
| 7 | `run-20260807-011330` | Aug 6 20:13 | same | `ingested: 1` |
| 8 | `run-20260807-022831` | Aug 6 21:28 | same | `no_transcript: 1` — regression on a previously-ingested video |
| 9 | `run-20260807-023021` | Aug 6 21:30 | same | `no_transcript: 1` — same regression |
| 10 | `run-20260807-023123` | Aug 6 21:31 | same | `ingested: 1` |
| **11** | **`run-20260807-084928`** | **Aug 7 03:49** | same | **`enrichment_failed: 47`, `no_transcript: 55`, `skipped: 2` = 104** |

The command that started the real run is still in `~/.zsh_history` at epoch `1786085170` (Aug 7 01:46 CDT):
`dy "...watch?v=K4gYHs84BIc&list=PLpvZy2482-kjlxGoFLPHJFQ1lNRD_49uN"`

Runs 3-10 were live debugging of a fidelity-scoring bug (flat 0.5 in run 5, correct 0.92x from run 6) before the full playlist was released.

### Two different playlists

The July 24 run targeted a **different podcast entirely** — that's the other ingestion attempt. Its results were overwritten in `state.json` by the August runs (all shared the default state path), but its output survives on disk. The artifact tree corroborates the run reports exactly:

```
packages/knowledge-base/sources/transcripts/2026-07-24/  →   6 dirs   (run 2:  "ingested: 6")
packages/knowledge-base/sources/transcripts/2026-08-06/  →   3 dirs   (run 5:  "ingested: 3")
packages/knowledge-base/sources/transcripts/2026-08-07/  →  47 dirs   (run 11: 47 enrichment_failed)
```

### Directory drift

The tree originally lived at `apps/disclosure-rag/data/playlist_ingestion/` — still the coded `OUTPUT_DIR` default in both commits that ever touched the file. Corroborated by `.scratch/2026-08-07-youtube-content-skill-vs-dy-pipeline.md:88`, written the same day, which cites the report at the `data/` path. Someone moved it to `corpus/intake/` after Aug 7 17:07; no git trace, since none of it was ever committed. `data/` is now an empty dir recreated Aug 13.

### Other approaches ruled out

- **Global `youtube-content` skill** (`~/skills/media/youtube-content/`) — stateless single-video transcript fetcher. **No playlist capability in code at all.** If tried as a playlist route, it could not have worked.
- **`main.py` directly on a playlist URL** — mis-treated as a single id-less video; the auto-detect routing in `main.sh:363-367` exists specifically to redirect away from this.
- **`scripts/bulk_folder_ingestion.py`** — local multi-format folders, not YouTube. Unrelated.

---

## 2. Nothing reached RAG

- Both "ingested" docs carry `"status": "error"` in their own `*_rag_pipeline.json` on disk, with `chunks: []`, `ner_results: []`, `embeddable_count: 0`.
- Local `ultraterrestrial` DB: `documents` = 0, `document_chunks` = 0.
- Shared Neon `neondb` (189 docs / 4,946 chunks — the real prod DB, matching CLAUDE.md exactly): **neither doc_id present**, by `id` or by URL.
- Entity extraction reported `"status": "completed"` with every category an empty array.

Stage-level evidence, aggregated across all 47 artifacts in `sources/transcripts/2026-08-07/`:

| Stage | Max tokens | Attempted | Succeeded |
|---|---|---|---|
| `document_classification` | 700 | 47 | **47** |
| `disclosure.content_analysis` | 1100 | 47 | **16** |
| `rag_ingestion` | 1400 | 16 | **0** |
| chunks / NER / embeddings | — | — | **0** |

Failure rate tracks output size: the smallest prompt never failed; the largest went 0-for-16. Error kinds in the artifacts match `state.json` exactly (20 delimiter / 12 provider / 9 unterminated / 6 extra-data), so the two records agree.

### Why the run reported success

`lib/enrichment_status.py::enrichment_outcome()` only detects failure when the in-memory result exposes a `rag_pipeline.status` key. For `K4gYHs84BIc` it didn't, so grading fell through to `rag_status: "unknown"` — and the caller treats `"unknown"` as not-a-failure (`if rag_status not in ("ok", "unknown")`). **The file written to disk knew it errored; the grader that wrote `state.json` didn't.**

---

## 3. Three independent failure causes

1. **LLM provider chain — 12 videos.** Anthropic tiers returned HTTP 400; reasoning models consumed the entire `max_tokens=4096` on reasoning tokens and emitted no answer (`BudgetExhausted`). Consistent with the known provider-liveness situation (only DeepSeek + Together live).
2. **Free-text-then-`json.loads` — 29 videos** (20 `Expecting ',' delimiter`, 9 `Unterminated string`). No schema or `response_format` enforcement at the time. The codebase now documents this against itself in `lib/llm_fallback.py:494-500`: *"the pipeline previously pasted the schema into the system prompt as text and called json.loads on whatever came back, so a single malformed comma at char 8455 silently produced zero chunks, zero NER, and zero embeddable texts while the run still reported success."*
3. **Naive brace-slicing — 6 videos** (`Extra data`). `_extract_json_payload()` (`rag_prompt_pipeline.py:86-107`) falls back to first-`{`-to-last-`}`; when the model emits a second object or trailing prose, the slice spans both. **Untouched by the recent commit — still live.**

### Version caveat (important)

The 2026-08-07 run used **uncommitted working-tree code**, not `807cbd55`. Evidence: `state.json` contains `enrichment_failed` and `rag_status` fields that do not exist in that commit (whose only statuses are `no_transcript / quarantined / dry_run / ingested / failed`), and `lib/enrichment_status.py` + `lib/llm_fallback.py` are not in that tree at all. That working-tree code was later **rewritten** before landing as `51e63500` (2026-08-14). The fallback chain recorded in the errors — `anthropic/claude-sonnet-5 → anthropic/claude-opus-4-8 → deepseek/deepseek-v4-pro → together/kimi-k3` — matches nothing in the repo or its history. **That code is unrecoverable.**

Raw LLM responses are also gone: `_raw_text` is `.pop()`'d at `rag_prompt_pipeline.py:284,309,323,357,374` by design. Causes 2 and 3 are therefore strong code-grounded inference — one of them self-documented in the codebase — **not byte-confirmed**.

---

## 4. The 55 `no_transcript` are mostly false

Live `yt-dlp --list-subs` probes: **all 3 sampled `no_transcript` videos have English captions available right now** (`en-orig` + `en`). Only the 4 entries whose title is the video ID are genuine — those are confirmed **private videos** (`2gsXjwtIXI0`, `pFVHnLJPiIs`, `8CjwxVE1Vtw`, `ePdH01pphbk`), where metadata fetch failed too.

**Root cause — two layers of exception conflation:**
- `lib/youtube_transcript_enhanced.py:201-206` catches genuine-absence exceptions (`NoTranscriptFound`, `TranscriptsDisabled`, `VideoUnavailable`) **and** a bare `except Exception` (rate-limit, block, timeout) — both `return None`, identical signal.
- `scripts/playlist_ingestion.py:145-155` wraps that in *another* bare `except Exception`, also returning `None`.
- `scripts/playlist_ingestion.py:166-169` then writes `status="no_transcript"` for any falsy result, persisting **no error string or exception type**.

**Timing confirms it.** Successes averaged ~58-60s apart (real fetch + fidelity work). The 08:46:30 → 08:49:28 stretch ran at a uniform **~3.4s** = the fixed 2.0s `--delay` plus ~1.4s of fast-failing HTTP. That is not consistent with real caption-fetch work.

There is no backoff, no retry, no proxy/cookie rotation anywhere in the fetch path — only a single fixed `--delay` (default 2.0s) at `playlist_ingestion.py:259,311-312`.

The script's own comment (lines 68-71) now describes this exact incident — *"the previous behaviour marched through 104 videos and recorded 55 of them as `no_transcript`"* — as the motivation for the `BLOCKED_ABORT_THRESHOLD` logic that postdates this run.

**Playlist enumeration was NOT truncated:** live playlist is 104, state has 104. The 4-ID delta since Aug 7 (2 added, 2 removed) is normal drift.

---

## 5. What actually survives

**The transcript corpus is the real asset.**

| Metric | Value |
|---|---|
| Files | 49 `.txt` |
| Total bytes | 7,393,554 (~7.05 MiB) |
| Total words | **1,383,742** |
| Words/file | min 8,834 · median 27,549 · max 54,485 |
| Fidelity | 0.90-0.925 across 48 of 49 |
| Degenerate/truncated files | none |
| Artifact / repetition outliers | none |

The single 0.5 score (`uVVqFg2v7ro`) is **not** a content signal — the fidelity reviewer *crashed* (`'FetchedTranscriptSnippet' object has no attribute 'get'`, `subscores: {}`, `covered_seconds: 0.0`) and fell back to a default. That transcript is 25,691 clean words.

**What the fidelity gate measures:** a heuristic transcript-completeness/cleanliness check — coverage, speaking pace, gap size, caption-artifact ratio, repetition ratio. **Not** a content-truth or relevance check. The uniform 0.92x scores reflect clean YouTube auto-captions, not editorial judgment. Gate is `verdict == "fail" OR score < --min-fidelity` (default 0.45); `"review"` is informational and proceeds by design.

**Recoverable: ~100 of 104** — 49 already past transcript fetch, ~51 refetchable, 4 permanently private.

### Why a naive re-run won't work

- **No resume path.** `enrichment_failed` and `no_transcript` are not in `DONE_STATUSES` (line 57), so they retry automatically — but `process_episode()` (lines 228-307) unconditionally re-calls `fetch_transcript()` with **no skip-if-exists check** for `transcripts/{vid}.txt` or `reports/{vid}.fidelity.json`. No such flag exists in the argparse surface (`--from-file`, `--upload`, `--no-kb`, `--limit`, `--force`, `--dry-run`, `--min-fidelity`, `--llm-review`, `--delay`, `--state-file` is the complete set). It would re-download all 47 transcripts and re-run a fidelity gate that already passed, before reaching the step that actually broke.
- **Same block, probably.** `YT_WEBSHARE_PROXY_USERNAME` / `YT_PROXY_URL` are unset today.
- **Schema enforcement is one-of-five.** `SCHEMA_ENABLED_PROMPTS = {"rag_ingestion"}`; the other four stages remain unconstrained free-text with only a repair-retry as backstop.

---

## 6. UNVERIFIED

- **disclosure-rag's own `NEON_DATABASE_URL`** (a third, separate Neon project) — connection failed, "no route to host". Could not check for the two doc_ids there.
- **Upstash vector store** — not queried. Local evidence shows `embeddable_count: 0`, so nothing was ever produced to upload, but not directly confirmed.
- **Current `OPENAI_API_KEY` liveness** — the observed `401 - Incorrect API key` is from 2026-08-06; not retested.
- **Bucket 2 / 3 exact mechanisms** — raw LLM responses were never persisted; inference from code + error strings only.
- **Who moved `data/` → `corpus/intake/`**, and what triggered runs 5 and the 4h15m gap before run 11 — no git trace, no history entry.
- **16 `.cursor/worktrees/ultraterrestrial-resurrection/*` dirs** (detached HEAD `a303da4b`) were not inspected.

---

## 7. Next steps

### Gate 0 — Cheap verifications (do first; they change scope)

- [ ] Resolve the third Neon project (`NEON_DATABASE_URL`) — live target or dead config?
- [ ] Decide the canonical write target. `postgres_client.py`'s docstring claims shared Neon "the same database apps/app reads," but local `.env` overrides to `postgresql://liamellis@localhost:5432/ultraterrestrial`, which is empty. **Lane A is writing somewhere nobody reads.**
- [ ] Test current OpenAI key liveness.
- [ ] Settle the output directory — update `OUTPUT_DIR` or move the tree back. A re-run currently writes somewhere other than where the evidence lives.

### Gate 1 — Fix the three defects (blockers; do not re-run before these)

- [ ] **Transcript-fetch conflation** — split genuine absence from fetch failure across both layers; **persist exception type + message into the state entry**. The absence of that field is why 55 videos were untriageable.
- [ ] **Enrichment status mis-grading** — make `"unknown"` fail closed; reconcile against the `*_rag_pipeline.json` actually written to disk.
- [ ] **No resume path** — add `--reuse-transcripts` so retrying the 47 skips download + fidelity.

### Gate 2 — Throttling posture (blocks the 51-video refetch)

- [ ] Set `YT_WEBSHARE_PROXY_USERNAME` / `YT_PROXY_URL`, or implement exponential backoff.
- [ ] Verify `BLOCKED_ABORT_THRESHOLD` / `consecutive_blocked` actually fires — it's the guard that would have stopped run 11 at ~video 50 instead of writing 55 false negatives.

### Gate 3 — JSON robustness (blocks enrichment succeeding at all)

- [ ] Extend `SCHEMA_ENABLED_PROMPTS` beyond `{"rag_ingestion"}`.
- [ ] Fix `_extract_json_payload()` brace-slicing.
- [ ] **Persist raw LLM responses on failure** — highest-leverage debuggability fix; its absence is why 35 failures can't be diagnosed.
- [ ] Confirm `REASONING_HEADROOM_TOKENS` (additive) actually resolves `BudgetExhausted` for reasoning tiers.

### Gate 4 — Re-run, staged

- [ ] Dry-run 3 videos; confirm chunks/NER/embeddings are **non-empty** before scaling.
- [ ] Enrichment-only retry on the 47.
- [ ] Refetch + full pipeline on the 51 recoverable.
- [ ] Mark the 4 private videos `unavailable`, not `no_transcript`.
- [ ] **Verify by query, not by status field** — `SELECT count(*) FROM document_chunks WHERE ...`. Per the Definition of Done, the status field has already lied once.

### Gate 5 — Loose ends

- [ ] **July 24 run** (DEBRIEFED / Area52): 6 ingested, 94 `no_transcript` — almost certainly the same block bug. Decide whether to redo, and **give each playlist its own `--state-file`**.
- [ ] `state.json` is gitignored (`.gitignore:197 *.json`) — that's why none of this has history. Decide whether run state should be tracked.
- [ ] Fidelity reviewer crash emits a plausible-looking default score instead of failing loudly.
- [ ] Process note: the Aug 7 run used uncommitted code later rewritten and lost. Long unstaged runs make their own failures undiagnosable — belongs alongside the never-stash rule in `AGENTS.md`.

**Sequencing that matters:** Gates 1 and 3 are both hard blockers. Fixing the transcript bug alone yields 51 more transcripts and still **zero RAG rows**, because enrichment is what actually failed for everything.
