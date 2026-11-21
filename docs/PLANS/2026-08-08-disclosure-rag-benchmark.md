---
status: live
role: eng
lane: A
spine: do
updated: 2026-08-08
---

# DY-BENCH — Functional & Output Benchmark for the `disclosure-rag` Pipeline and the `dy` CLI

**Created:** 2026-08-08 18:19 CDT
**Branch:** `dev` · **Baseline commit:** `e163a293`
**Owner lane:** A — Corpus & Ingestion
**Relates to:** T-048 (`docs/plans/2026-08-01-ingestion-hardening.md`), T-045
**Subject under test:** `apps/disclosure-rag/main.sh` (aliased `dy`), `main.py`,
`scripts/playlist_ingestion.py`, and the archive/index they write.

---

## 0. Why this benchmark exists, and the one rule that shapes it

The 2026-08-01 live trace (`ingestion-hardening.md` §8.1) recorded a run in which
**three stages printed ✅ while erroring**, and the process exited reporting success.
A benchmark that greps `dy`'s stdout for success markers would therefore have scored
that run green.

> **Rule 1 — Assert on side effects, never on the tool's self-report.**
> Every check compares observable state (filesystem tree, `index.json`, exit code,
> network egress) *before* and *after*. The only assertions made against stdout are
> **negative** ones: given a broken dependency, the run must *say so* and exit non-zero.

That inversion is the whole point. A pipeline that cannot be trusted to report its own
failures cannot be benchmarked by reading what it says about itself.

**Rule 2 — Scope honesty.** Each check declares what it measures and what it does not.
A check that cannot run today is reported `BLOCKED` with the exact error, never silently
skipped and never counted as a pass. This follows
[`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md).

---

## 1. Measured starting conditions (2026-08-08, commit `e163a293`)

All numbers below were produced by running the commands shown, not read from prior docs.

| Fact | Command | Result |
| --- | --- | --- |
| Test suite baseline | `.venv/bin/python -m pytest tests/ --continue-on-collection-errors` | `6 failed, 54 passed, 6 errors in 9.94s` |
| `dy --help` latency | `time ./main.sh --help` | `0.019s total` |
| `dy --help` rendering | `./main.sh --help` | Emits **literal** `\033[0;34m` escape text, not color |
| `dy ui` | `./main.sh ui; echo $?` | `main.py: error: unrecognized arguments: --ui` → exit 2 |
| `dy sync-rag` | `./main.sh sync-rag; echo $?` | `main.py: error: unrecognized arguments: --sync-rag` → exit 2 |
| `dy stats` | `./main.sh stats` | Works: 499 transcript / 37 article / 31 case_file |
| `dy <url> --dry-run` | `./main.sh "https://…HFLBDi87888" --dry-run` | Prints a 6-line plan, no writes, `7.4s` wall |
| OpenAI key | `POST /v1/chat/completions` | **HTTP 401** `Incorrect API key provided` |
| OpenAI embeddings | `POST /v1/embeddings` | **HTTP 401** |
| Anthropic key | `POST /v1/messages` | **HTTP 400** `credit balance is too low` |
| DeepSeek key | `POST /chat/completions` | **HTTP 200 OK** — live |
| Groq key | `POST /openai/v1/chat/completions` | HTTP 403 (`error code: 1010`) |

### 1.1 Two defects these conditions expose immediately

**D-A — The summary path is hard-wired to the one dead provider.**
`processing/content_analysis.py:199-232` `analyze_content()` calls **only**
`get_claude_analysis()`; the OpenAI and DeepSeek branches are commented out at lines
203-204 and 209-219. Anthropic is out of credit, so `analyze_content` returns the
header plus an empty `=== ORIGINAL CONTENT ===` marker — **this is the mechanism that
produces the 195-byte `Summary.txt` stubs** catalogued in `ingestion-hardening.md` §8.5.
DeepSeek is live and unused. Entity extraction reads the summary file, so it has been
reading empty stubs (§8.6).

**D-B — Two advertised `dy` subcommands are inoperative.**
`main.sh` `launch_ui()` and `sync_rag()` invoke `main.py --ui` / `--sync-rag`, flags
`main.py`'s argparse (`main.py:960-974`) does not define. Both die on argument parsing.
They do propagate exit 2, so this is a functionality gap rather than a truthfulness one —
`dy ui` prints `Access the UI at: http://localhost:8501` and then never starts a server.
Two of ten advertised subcommands do not work.

---

## 2. The benchmark

Eight dimensions, 24 checks. Each check has an ID, a stated assertion, the observable it
measures, and a tier.

**Tiers**

- **v1** — the bar to clear today. Correctness, honesty, and safety properties that need
  no live paid credentials.
- **v2** — requires live OpenAI/Anthropic credentials or a real ingest run. Measured
  today only where a live provider (DeepSeek) or a sandbox archive makes it possible.
- **H1–H5** — explicitly deferred to the milestones in `ingestion-hardening.md`. Listed
  here so the benchmark's coverage gaps are visible rather than implied.

### B1 — Surface coverage

*Every advertised subcommand has a defined, correct verdict.*

| ID | Assertion | Tier |
| --- | --- | --- |
| B1.1 | `dy --help` exits 0 and renders ANSI color, not literal `\033[` sequences | v1 |
| B1.2 | `dy --help` lists exactly the subcommands `main.sh`'s `case` actually dispatches — no advertised command is missing, no dispatched command undocumented | v1 |
| B1.3 | Every advertised subcommand either performs its function or **exits non-zero with a diagnostic**. No subcommand exits 0 after failing. (`ui`, `sync-rag` — see D-B) | v1 |
| B1.4 | `dy` with an unknown command exits non-zero and prints help | v1 |
| B1.5 | `dy stats` returns document counts from `index.json` without traceback | v1 |
| B1.6 | `dy search "<query>"` returns results or an explicit "no results", without a `KeyError` on the heredoc's hardcoded `result['score']` / `stats['popular_tags']` keys | v1 |
| B1.7 | `dy ui` / `dy chat` are smoke-checked only (interactive, long-lived): the launcher must reach its target process, not die on an argument error | v1 |

### B2 — Truthfulness of reporting

*The headline defect. A failed stage must never read as success.*

| ID | Assertion | Tier |
| --- | --- | --- |
| B2.1 | Run with a deliberately invalid `OPENAI_API_KEY`: the stage report marks the affected stages ❌, not ✅ | v1 |
| B2.2 | Same run: the process exits **non-zero** when a required stage failed | v1 |
| B2.3 | The count of ✅ stages in the report equals the count of stages that actually returned success (no stage reports ✅ on an exception path) | v1 |
| B2.4 | No two consecutive log lines make contradictory availability claims about the same subsystem (the CocoIndex case: `Enhanced CocoIndex available` / `CocoIndex not available` / `CocoIndex knowledge graph integration available` in three consecutive lines on the ingest path) | v1 |
| B2.5 | `--status` reports a subsystem ✅ only when it is *operationally* available, not merely importable (already hardened at `main.py:1004-1010`; guard against regression) | v1 |

### B3 — Dry-run purity

*A dry run must be inert. §8.7 records a local run POSTing to production.*

| ID | Assertion | Tier |
| --- | --- | --- |
| B3.1 | `--dry-run` leaves the archive tree byte-identical (recursive sha256 manifest before/after) | v1 |
| B3.2 | `--dry-run` leaves `metadata/index.json` byte-identical | v1 |
| B3.3 | `--dry-run` performs **zero** outbound writes — no QStash enqueue to `ultraterrestrial.app`, no OpenAI upload, no vector upsert | v1 |
| B3.4 | `playlist_ingestion.py --dry-run` is dry **before** the network, not after. Today the flag is checked at `:280`, *after* transcript fetch and fidelity review — a "dry" playlist run still hits YouTube | v1 |
| B3.5 | `--dry-run` prints a plan whose stage list matches the stages a real run would attempt for that input class | v1 |

### B4 — Write location and archive integrity

| ID | Assertion | Tier |
| --- | --- | --- |
| B4.1 | A real ingest lands under `packages/knowledge-base/sources/{transcripts,web,files}/`, never a parallel tree (§8.3) | v2 |
| B4.2 | Every path persisted into `index.json` is **relative** to the knowledge-base root | v2 |
| B4.3 | Every `index.json` entry resolves to a file that exists on disk (no phantom entries) | v1 |
| B4.4 | The archive root is overridable for testing, so B4/B5 can run without mutating the production archive | v1 |

### B5 — Non-destruction on re-ingest

*§8.4 reproduced cross-day orphaning on the first attempt.*

| ID | Assertion | Tier |
| --- | --- | --- |
| B5.1 | Re-ingesting an already-ingested item does not reset its `created_at` | v2 |
| B5.2 | Re-ingesting does not leave the prior directory unreferenced by any index | v2 |
| B5.3 | Re-ingest is recorded as a repeat sighting of a known document, not a silent overwrite | H1 |

### B6 — Output quality

*What the pipeline produces, not whether it ran.*

| ID | Assertion | Tier |
| --- | --- | --- |
| B6.1 | A generated summary is **not** the empty 195-byte stub — the `=== ORIGINAL CONTENT ===` section is non-empty (see D-A) | v1 (plumbing) / v2 (live quality) |
| B6.2 | The analysis path degrades across providers: with ≥1 live LLM provider configured, a summary is produced even when the primary provider is dead | v1 |
| B6.3 | With every provider dead, the summary stage reports ❌ and writes no stub file | v1 |
| B6.4 | Entity extraction over a fixture with known entities returns > 0 entities | v2 |
| B6.5 | `process_for_rag` emits Evidence-tier chunks and `embeddable_texts`, enforcing ADR-0001's Inference-exclusion rule | v1 |
| B6.6 | Chunks carry page/offset provenance so a claim is citable to a source page | H3 |

### B7 — Startup and performance

| ID | Assertion | Tier |
| --- | --- | --- |
| B7.1 | `dy --help` completes in < 1.0s (no heavy imports before argparse) | v1 |
| B7.2 | `dy --status` completes in < 20s | v1 |
| B7.3 | `--dry-run` on a YouTube URL completes in < 30s | v1 |

### B8 — Determinism

| ID | Assertion | Tier |
| --- | --- | --- |
| B8.1 | Two consecutive `--dry-run`s on the same input produce identical plans | v1 |
| B8.2 | Content-hash identity is stable across runs for byte-identical input | v1 |
| B8.3 | sha256 identity written to all three sinks (archive record, `documents.content_hash`, vector-store attributes) | H1 |

---

## 3. Pass bar

**v1 tier: 100% of v1 checks must pass.** These are correctness and honesty properties;
a partial pass on "does the tool lie about failure" is not a meaningful score.

**v2 tier:** measured and reported, not gated — several depend on credentials outside this
repo's control. A v2 check that cannot run is `BLOCKED` with its error text.

**H1–H5:** out of scope for this benchmark run by design. Listed above so the gap is
explicit. Do not treat a green v1 as "ingestion is hardened" — it is not; it means the
tool tells the truth about what it did.

---

## 4. What this benchmark deliberately does not do

- **It does not run bulk live ingests.** A live `dy` run enqueues to production
  (`https://www.ultraterrestrial.app/api/workflow/processing`, §8.7) and, per §8.4,
  *destroys* the prior `created_at` on re-ingest. Live ingest is a mutating, partly
  destructive operation, not a test fixture. Any live-tier check runs against a sandbox
  archive root (B4.4) on a synthetic fixture.
- **It does not measure retrieval quality.** No recall@k, no answer grading. That is a
  separate benchmark for the retrieval layer, not the ingestion pipeline.
- **It does not benchmark the Next.js app.** `apps/disclosure-rag/` is disconnected from
  it (`CLAUDE.md`); nothing here asserts anything about `/api/disclosure/*`.
- **It does not cover the dead entrypoints** — `main_unified.py`, `main_enhanced.py`,
  `main_fixed.py`, `run.sh`, `quick_resume.sh` (§6). Benchmarking them would imply they
  are supported.

---

## 5. Harness

`apps/disclosure-rag/scripts/benchmark_pipeline.py`

```bash
# full v1 tier
.venv/bin/python scripts/benchmark_pipeline.py

# include v2 checks that need a sandbox archive / live provider
.venv/bin/python scripts/benchmark_pipeline.py --tier v2

# machine-readable
.venv/bin/python scripts/benchmark_pipeline.py --json results.json
```

Exit code is 0 only when every check in the selected tier passes. `BLOCKED` checks do
not fail the run but are always printed, with their error.

---

## 6. Results

See `docs/work_logs/` for dated run reports. The baseline and post-fix results for
2026-08-08 are recorded in §7 of this document.

## 7. Run log

*(appended by each benchmark run)*
