---
status: live
role: eng
spine: do
updated: 2026-08-01
supersedes: partial — absorbs T-045 items H2, H3, H4, M4
depends-on:
  - CONTEXT.md
  - docs/adr/0001-agent-inferences-excluded-from-retrieval.md
  - docs/plans/2026-07-16-disclosure-rag-main-review.md
---

# Ingestion Hardening — Source Material → Canonical Archive → Vectorized Platform

**Ticket:** T-048
**Scope:** `apps/disclosure-rag/` (pipeline) + `packages/knowledge-base/` (archive) + `packages/db/` (destination)
**Method:** five parallel read-only audits, 2026-08-01. Every number below was measured, not quoted.

---

## 0. The problem in one paragraph

Source material can be dumped into this system today and be processed, but nothing
guarantees it lands **once**, lands **completely**, lands **somewhere the platform can
query**, or can be **traced back to where it came from**. The archive and the database
share no join key. The Python pipeline's vectors are produced by an unspecified
embedding model and are not stored where the app reads. The archive has no hash at
rest, so no document in it can be proven unmodified. This plan closes those four gaps
in that order, because each one is load-bearing for the next.

---

## 1. What is actually true (measured 2026-08-01)

### 1.1 Verified against the live Neon database

| Claim in repo docs | Verdict |
|---|---|
| 30 tables / 126,483 records | ✅ exact |
| 4,946 document chunks | ✅ exact |
| 6,540 total vectors, 1536-dim | ✅ exact; dimension confirmed via `vector_dims()` per table |
| 0 orphaned chunks | ✅ every chunk's parent FK resolves |
| **"1,594 entity rows embedded"** | ❌ **wrong — 1,405**, across six tables (key_figures 465, organizations 40, topics 91, events 595, testimonies 178, artifacts 36) |
| `document_entities` table | Exists, **0 rows, no embedding column** — the name implies a role it does not fill |

`documents` = 189 rows. Undocumented: `summary_files` (1 row, embedding NULL) and
`mindmaps` (0 rows) also carry embedding columns.

### 1.2 The archive

946–950 real files under `sources/` (files 48 · transcripts 833 · web 68);
564 records in `metadata/index.json` (case_file 31 · transcript 496 · article 37).

- **348 of 950 files (36.6%) are `graphify-out/` tool cache** — `.graphify_ast.json`,
  `.graphify_chunks.json` etc. — regenerable skill output sitting inside the immutable
  intake tree. **47 of them were ingested into `index.json` as if they were documents.**
- **100% of index records bake absolute machine paths** (`/Users/liamellis/…`) into `path`,
  which points at a *directory*; the real relative path hides in `metadata.original_path`.
- **6 YouTube records have paths that are dead right now** — they omit the `apps/` segment
  (`/Users/liamellis/Desktop/ultraterrestrial-resurrection/…`), predating the monorepo layout.
- **81/564 records (14.4%) have `created_at` after `updated_at`** — a backfill artifact.
  Neither field tracks real document lifecycle.
- **94 byte-identical duplicate groups** = 190 redundant files, 3.0 MB.
- **8 zero-byte files.**
- **No hash is persisted anywhere**, though ingestion computes one (§1.4).
- **No provenance on 99% of records** — no agency, FOIA id, source URL, retrieval date,
  or license. Only the 6 YouTube records carry a `source`.
- No relevance gate: `sources/transcripts/2025-08-31/dQw4w9WgXcQ/` is Rick Astley's
  "Never Gonna Give You Up," fully transcribed and summarized alongside UAP research.

**Rename damage is minor and contained** — contrary to first impression, exactly one file
(`case_filesCrop Circles- "Signs"…pdf`) and one `original_path` were mangled. Filename
encoding hazards are confined to that same document. This is *not* where the risk is.

### 1.3 Three abandoned migrations, frozen at step one

- `CORPUS.md`/`PLAN.md` propose `sources/` + `derived/` + `cases/` + `metadata/{registry.jsonl,redirects.json}`.
  Only the `sources/` rename happened. **`derived/` and `cases/` were never created**;
  `registry.jsonl` and `redirect.json` exist at **0 bytes** and no code reads or writes them.
- `docs/SYNC_STRATEGY.md` proposes a 3-week local↔remote bridge ending in a Next.js
  `api/knowledge/search` route. **None of it exists.** No `api/knowledge/*` route anywhere.
- `packages/knowledge-base/index.ts` imports `./external_resources.json`, **which does not
  exist**; `package.json` lists `cases/`, `python/`, and that same file in `"files"`. Zero
  consumers repo-wide. The module surface is dead and would fail a build.

### 1.4 The pipeline's storage reality

The live write path — `main.py` → `lib/kb/knowledge_base_service.py` → `lib/kb/knowledge_base_crud.py`
— writes to **the filesystem, `index.json`, and Upstash Search**. It does **not** write to Neon.

- `lib/db/postgres_client.py` is a correct, already-merged bridge to the shared Neon
  endpoint whose **only caller is its own test**. A ~60%-finished PR, not new architecture.
- **Upstash Search auto-embeds server-side with a model never specified in code.** No
  Python-side vector is verifiably compatible with the locked 1536-dim standard.
- Two orphaned modules hardcode **384-dim `all-MiniLM-L6-v2`**, and
  `scripts/analyze_csv_structure.py:161` records a past attempt to convert 1536D → 384D.
- `doc_id = md5(content)[:12]` at `knowledge_base_crud.py:83` **is a real content hash** —
  computed at ingest, used as the key, then **discarded, never persisted to the record.**
- **No ingestion-run ID exists anywhere.**
- `processing/rag_prompt_pipeline.py:9` genuinely enforces ADR-0001 ("chunk bodies remain
  Evidence-only; never embed agent Inference") — **and is wired to nothing.**
- `lib/entity_extraction/core/entity_creator.py:249` still writes to **retired Xata**.
- Dead-but-documented: `QUINUPLE_RAG_ARCHITECTURE_DOCUMENTATION.md` (11 months stale)
  describes a 5-layer system whose flagship class `QuinupleRAGUnifiedSearch` has zero callers.
  `rag_index/` and `corpus/` do not exist on disk.

### 1.4b The database side — duplication is already real

**54 of 189 documents (28.6%) share a duplicate `url`.** This is not a hypothetical risk;
it has already happened. `documents.id` is `"doc_" + sha1(path_key)[:16]` where `path_key`
is a **path**, not content (`ingest.py:97-99`) — so the same video scraped into a different
date folder yields a different id and `ON CONFLICT (id) DO NOTHING` never fires. Verified:
`youtube.com/watch?v=DHgG8el5n5M` exists as both `doc_82116f84ef86133f` (2025-04-10) and
`doc_84b6c3d68008bfa7` (2025-01-31).

There is **no content-hash column anywhere in the schema**, and no unique constraint on `url`.

**No ANN index exists on any of the 10 `vector(1536)` columns.** Every similarity query is
a sequential scan. This is not an oversight the schema is unaware of —
`migrations/rebuild/0001_init.sql:22-26` explicitly says ANN indexes "must be created in
migration 0002 AFTER the embedding backfill," and **migration 0002 was never written.**
`related.ts:232-239` runs `ORDER BY embedding <=> $1::vector` across 7 tables on every
Research Canvas suggestion call. Cheap today at 40–595 rows per table; a hard scaling cliff.

**`document_chunks` is write-only.** Neither `search.ts`'s `VECTOR_TABLES`/`FTS_TABLES` nor
`related.ts`'s include it — **all 4,946 embedded chunks are invisible to `searchDatabase`,
`searchAll`, `vectorSearchAll`, and `getRelatedRecords`.** Its only consumer repo-wide is
`ingest.py`'s write path. It also has no `search_vector` column, so chunk text has no FTS
path at all. An entire embedding investment is currently unreachable by the product.

Good news, verified: `search_vector` is a real `GENERATED ALWAYS AS … STORED` column on six
tables — Postgres recomputes it synchronously, so it **structurally cannot drift**. And
`searchDatabase`'s FTS+vector fusion is sound Reciprocal Rank Fusion (k=60), correctly
reasoned given the two score scales aren't comparable raw.

Also found: all 40 FK constraints are `NOT VALID` (new writes enforced, historical rows never
checked). `documents.source_tier` is **100% NULL** — the T1–T6 vocabulary in `CONTEXT.md:162`
has zero live data. `agent_inferences` exists with 0 rows and its 8-value `evidentiary_state`
matches `CONTEXT.md:69-80` exactly — no drift. But **Strangeness (S1–S5), Credibility (C1–C5),
Corroboration Score, Close Encounter Classification, Event Type Hierarchy** — all defined in
`CONTEXT.md:138-163` — have **no columns anywhere**.

Two rogue chunking pipelines in the app: `services/ai/prometheus/lib/vectorize.ts:32,150`
comments *"until document_chunks table is created"* — unaware it exists with 4,946 rows — and
stuffs chunks into `documents.metadata` instead; `features/ai/pipelines/helpers/vectorize.ts`
targets a **Supabase** schema that does not exist in Neon at all.

`docs/adr/0001-agent-inferences-excluded-from-retrieval.md` has **unresolved git merge-conflict
markers committed into it**, corrupting its frontmatter. Isolated to that one file.
`packages/db/CLAUDE.md` is referenced by root CLAUDE.md and **does not exist**.

### 1.5 The join-key gap — the most important finding

`index.json` is keyed by 12-hex content hashes tied to disk paths. Postgres
`documents.metadata` carries `{path, date, yt_id, filename, slug}` and **references neither.**

Two indirect joins work at 100% where they apply: `yt_id` (82/82) and `filename` (20/20).
**Web/article content has no reconciliation path at all** — 32 web documents in Postgres,
only 6 extractable URLs on disk.

**Measured ingestion coverage:** 65% of PDFs (20/31), 91% of transcript folders (82/90),
web unmeasurable. Overall ≈52% of real content — *an estimate*, because transcript
matching is folder-granular.

One stale `case_filesCrop Circles…` filename survives in Postgres `documents.metadata`,
matching nothing on disk.

### 1.6 Open discrepancy — do not paper over

Two agents measured "files with no index entry" differently: **390** (of which 298 called
graphify noise) versus **139** real gaps after pre-filtering graphify and dotfiles. The
methodologies differ at the boundary. **Reconcile before acting on either.** The
qualitative finding is agreed: per-video sidecars (`Summary.md`, `_metadata.json`,
`entity_processing_results.json`) are largely unindexed while the primary `.txt` is indexed.

---

## 2. Decisions

D1 and D2 are **settled by the owner's 2026-08-01 topology sketch** (§2.0). D3 and D4
remain recommendations.

### 2.0 Canonical topology (owner-specified)

```
                      Data Source
                           │
                           ▼
                 Ingestion + Processing
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   Canonical Source          Vectorization + AI Data Layer
   Material Archive            ├── OpenAI Vector Store
   (immutable files)           └── Neon Postgres + pgvector
```

Three things this fixes that a linear reading would get wrong:

1. **The archive and the AI layer are peer outputs, not sequential stages.** The archive
   write must not depend on embedding succeeding. A failed OpenAI call must still leave a
   complete, canonical archive record — the source material is preserved regardless.
2. **Identity is established at the fork.** The sha256 is computed once, on the raw bytes,
   *before* the branch — and both branches carry it. This is precisely the missing join key
   from §1.5: the archive and the database agree because they were handed the same hash by
   the same stage, not because a later reconciliation matched them up.
3. **Both vector stores are retained, under one layer.** OpenAI Vector Store (Assistants
   `file_search`) and Neon pgvector are siblings serving different retrieval modes. Neon is
   the system of record for structured/queryable retrieval; OpenAI serves file_search for
   the disclosure mindmap agent.

**Upstash Search does not appear in the target topology — it is deprecated.**

The diagram is titled *(Local)*. Remote is a mirror of the archive branch (H5), not a
second pipeline.

### D1 — Canonical vector store: **Neon pgvector as system of record, OpenAI retained for file_search** ✅ *settled*

Upstash's embeddings are produced by an unnamed server-side model and can never
participate in the app's FTS+pgvector ranking. Neon already holds all 6,540 vectors the
platform queries, and the bridge is already built and merged. Finishing
`lib/db/postgres_client.py` into the write path is cheaper than any alternative.

*Cost:* re-embed the 564 already-ingested documents with `text-embedding-3-small` — none
of their current vectors are reusable. *Discard cost is near zero*: pgvector_library,
FAISS backends, `ultraterrestrial_db.py`, and the Xata entity path are already unused or
already broken.

Keep the OpenAI vector store **only** for Assistants `file_search`, which the disclosure
mindmap agent genuinely uses. Two stores, one system of record, each with a defined job.

### D2 — Archive authority: **filesystem is canonical, both vector stores are rebuildable** ✅ *settled*

Source bytes plus a hash manifest are canonical. **Both** sinks in the AI layer — Neon and
the OpenAI vector store — must be reconstructible from the archive alone by replaying
ingestion. This makes tamper detection possible and means no research material lives only
inside a database or a vendor's index.

Note the consequence for the fork: because the branches are peers, the archive branch is
the one that must never fail silently. Vectorization can be retried; lost source bytes
cannot. Intake ordering is therefore **hash → archive → enqueue vectorization**, so a crash
in the AI layer never costs source material.

Remote (H5) mirrors the archive branch, not the DB.

### D5 — The pre-intake liminal zone *(owner-raised 2026-08-01)*

Between "material arrives" and "material is canonical" there is a real curation stage:
vetting, cleaning, renaming, organizing, classifying, rejecting. The plan originally went
straight from intake to archive, which was wrong. **`sources/` is immutable by policy — so
the liminal zone is the only place where anything can still be fixed.** That makes it
load-bearing, not a convenience.

It is also where the expensive decisions get made *cheaply*: relevance rejection before
embedding spend, dedup before storage, naming fixed before anything references the path.

**Four zones, split by lifecycle — not by which package created the file:**

| Zone | Path | Mutable? | Durable? |
|---|---|---|---|
| **Inbound** — as received, untouched | `knowledge-base/intake/inbound/` | no (write-once) | yes |
| **Staging** — the liminal zone; curate, rename, classify, reject | `knowledge-base/intake/staging/` | **yes** | yes |
| **Canonical** — blessed source material | `knowledge-base/sources/` | no | yes |
| **Derived** — regenerable outputs, summaries, chunk sidecars, tool cache | `knowledge-base/derived/` | yes | no |
| **Ephemeral** — temp files, run state, scratch | `disclosure-rag/.work/` (gitignored) | yes | no |

This resolves the owner's A-vs-B question: **all durable data lives in `knowledge-base`,
disclosure-rag holds only logic plus throwaway scratch** — Option A — but it only works
*because* the liminal zone exists to hold not-yet-canonical material. Zones encode status,
so "everything in knowledge-base is data" stays true without implying "everything in it is
blessed."

**Invariant:** delete `disclosure-rag` entirely → lose zero data. Delete `derived/` →
regenerate it. Anything that fails those tests is in the wrong zone.

**Two hashes, not one.** Curation that changes only metadata (rename, tag, move) leaves
bytes untouched, so the hash carries through. Curation that changes bytes (OCR, splitting a
combined PDF, re-encoding) produces a *new derived artifact*: keep the as-received master
with its `acquisition_hash`, record the transform, and give the promoted artifact its own
`content_hash`. This is standard archival practice — preservation master plus access copy —
and it is why Inbound must be write-once rather than merely a staging folder.

### D6 — Dedup key differs by source type *(corrected empirically, §8)*

The live trace disproved a assumption in D3. Re-scraping the same YouTube video 8 days
later produced **different bytes** — 95,001 → 95,839 (+838). ASR and auto-caption revisions
mean a transcript is *regenerated*, not *retrieved*.

So content-hash dedup is correct for **byte-stable** sources (PDFs, downloaded files) and
**wrong** for **regenerated** ones (YouTube transcripts, live web scrapes), where it would
create a fresh record on every run forever.

| Source class | Dedup key | Content hash's role |
|---|---|---|
| Byte-stable (PDF, file) | `content_hash` | identity |
| Regenerated (YouTube, scrape) | source identity — `video_id`, canonical URL | **version marker** on that source |

This retroactively vindicates the existing YouTube path's use of `video_id` as `doc_id`
(`knowledge_base_service.py:94`), which had looked like an inconsistency. It isn't — it is
the right key for that source class. What's missing is that a *changed* transcript should
create a new **version** of the same document, not silently overwrite it (§8).

### D3 — Ingest semantics: **content-hash dedup + resumable runs**

The hash already exists at `knowledge_base_crud.py:83` and is thrown away. Persist it,
add an `ingestion_run` table, and both dedup and resume fall out. A batch that dies at
file 147 resumes at 147; identical content is skipped rather than re-embedded.

**`eisenhower_briefing (1).pdf` is a genuinely different document from its base file.**
Any dedup that keys on filename pattern rather than content hash will destroy it. This is
exactly why the rule is hash-based.

### D4 — `sources/` is intake-only and immutable

Tool output does not belong in it. `graphify-out/` moves to `derived/` (or out of the
package), and the 47 phantom index entries it produced are removed.

---

## 3. Target design

### 3.1 Intake — "dumping source material"

A drop directory (`intake/`) is the only entry point. Per item, on arrival:

1. **Hash first** (sha256, full file) — before any parsing. Identity precedes processing.
2. **Dedup check** against the manifest. Identical bytes → recorded as a duplicate
   sighting of a known document, not re-ingested.
3. **Guard** — size ceiling, allowed MIME types, count cap per run *(closes T-045 M4)*.
4. **Relevance gate** — reject or quarantine off-corpus material *(the Rick Astley case)*.
5. **Move, never overwrite** — collision-safe relocation *(closes T-045 H2)*, with the
   persisted provenance updated in the same transaction *(closes T-045 H3)*.
6. Emit an `ingestion_run` row before any work begins.

### 3.2 Process

Convert → analyze → chunk → embed, with a temp-file lifecycle that actually cleans up
*(closes T-045 H4)*. Chunking must carry page/offset so a claim can be cited back to a
page of a source PDF. `rag_prompt_pipeline.py` gets **wired**, so ADR-0001's
Evidence-only rule is enforced on the live path rather than in an orphan module.

### 3.3 Index

Single embedding contract: `text-embedding-3-small` @ 1536, asserted at write time —
a dimension mismatch must fail loudly, not silently store an incompatible vector.

### 3.4 Metadata & record-keeping

Required per document: `sha256`, stable id, `source_uri`, `retrieved_at`, `agency`/`origin`,
license where known, `ingestion_run_id`, and the evidentiary state from `CONTEXT.md`.
`created_at`/`updated_at` must track real lifecycle. Paths stored **relative**, always.

### 3.5 Structured output

The archive↔DB join key is no longer something to reconstruct — it is a **property of the
fork**. One sha256, computed at the branch point, written into the archive record, into
`documents.content_hash`, and into the OpenAI vector-store file attributes. Three sinks,
one identity, surviving file moves and renames because it is derived from bytes rather
than paths.

This is what makes the §1.5 web/article gap closeable: today those records have no join
path in either direction because nothing common was ever recorded. Post-fork, every item
carries the same key regardless of source type.

Each branch also reports its outcome to the same `ingestion_run` row, so a run's manifest
answers "archived yes / embedded no / file_search yes" per item — the retry surface.

---

## 4. Milestones

- **H0 — Stop the bleeding.** *P0 first, from the live trace (§8):* restore
  `ContentAnalysisEngine.process_for_rag` (4 call sites + a failing test assert it exists);
  repoint the writer at `sources/` (new ingests currently land outside the archive);
  stop reporting ✅ for failed stages; validate credentials at startup; add `--dry-run`.
  Then: purge `graphify-out/` from `sources/`, drop the 47 phantom
  index entries, fix the 6 dead YouTube paths, relative-ize all 564 `path` fields, remove
  the dead `index.ts`/`package.json` surface, resolve the §1.6 count discrepancy. Repair the
  committed merge-conflict markers in ADR-0001. Add the read-before-write dedup guard to
  `create_document()` and make `_save_index()` atomic — these two stop new orphaning today.
  *Stopgap DDL:* `CREATE UNIQUE INDEX … ON documents(url) WHERE url IS NOT NULL` — would have
  caught all 54 live duplicates.
- **H0.5 — Make the chunks reachable (cheap, high payoff).** Add `document_chunks` to
  `search.ts`'s `VECTOR_TABLES`, and write migration `0002` creating HNSW indexes
  (`USING hnsw (embedding vector_cosine_ops)`) on all 10 vector columns. This is the
  schema's own unexecuted plan, and it turns 4,946 already-paid-for embeddings from
  invisible into queryable. Add `UNIQUE(document, chunk_index)` on `document_chunks`.
- **H1 — Identity.** `documents.content_hash` (sha256 of normalized extracted text) +
  `UNIQUE`; re-key ingestion to upsert on hash rather than path. Persist the hash on every
  archive record and backfill across all 946 files. Dedupe the 54 existing duplicate URLs.
  This is what makes everything else possible.
- **H2 — The bridge.** Wire `lib/db/postgres_client.py` into the live write path; write
  chunks + 1536-dim embeddings to Neon; deprecate Upstash. Retire the two rogue
  `vectorize.ts` pipelines. Wire `embeddable_texts` to a real embedding sink.
- **H3 — Runs.** `ingestion_runs(id, started_at, completed_at, script, git_sha, doc_count,
  chunk_count, status)` + `documents.ingestion_run_id`. Resumable batches, per-run manifest.
  Add page/offset provenance (`document_chunks.page_number`, `char_offset_start/end`) —
  PyMuPDF already exposes per-page text and `ingest.py:212-220` discards it.
- **H4 — Provenance.** Populate `source_tier` (currently 100% NULL); backfill
  source/agency/retrieval/license; enforce on new intake. Add soft-delete/versioning
  (`superseded_by`, `status`). **Blocks Lane B M1.**
- **H5 — Remote mirror.** Object-storage mirror of the archive, verified by manifest.
  Validate all 40 `NOT VALID` FK constraints.

---

## 5. Supersession

Absorbs T-045 **H2** (relocation overwrite), **H3** (stale provenance), **H4** (temp file
leak), **M4** (no ingestion limits). Remaining T-045 items (H5, H6, H7, M1, M2, M3) stay
on that ticket.

Corrects `CLAUDE.md`'s "Database Work" section, which still instructs "update Xata schema
through dashboard / run `xata codegen`" — Xata is retired; `@db/postgres` is the only live layer.

Marks stale: `QUINUPLE_RAG_ARCHITECTURE_DOCUMENTATION.md`,
`COMPREHENSIVE_RAG_DOCUMENTATION.md`, `docs/SYNC_STRATEGY.md`, and the 2025-06-20 report
set in `packages/knowledge-base/docs/`. Only that package's `README.md` describes reality.

---

## 6. Pipeline shape (live path)

**Live:** `main.sh` → `main.py` (single item) and `main.sh` → `scripts/playlist_ingestion.py`
(bulk). The playlist script is not a parallel pipeline — `:200` calls `main.py`'s
`process_url()` directly, so **every main.py defect is inherited by every playlist episode**.

**Dead:** `main_unified.py`, `main_enhanced.py`, `main_fixed.py`, `run.sh` (13 months stale),
`quick_resume.sh`, `index_knowledge_base.py`, `fix_disclosure_rag.py`.

**Notable:** `scripts/bulk_folder_ingestion.py` already implements real SHA-256 file hashing —
a stronger idempotency primitive than anything on the live path — but is reachable only via
`cli.py`/Streamlit, not `main.sh`, and is ~13 months stale. Worth harvesting, not rebuilding.

**Two ID schemes, not one.** The generic path (files/PDFs/web) uses `md5(content)[:12]`.
YouTube uses a **completely separate method** (`knowledge_base_service.py:71-220`) keyed on
`video_id`, bypassing `create_document()` entirely — deliberately more stable, since
transcript text jitters between runs while the video id doesn't. *Unverified:* whether the
transcript directory is also date-stamped per run, which would reproduce the cross-day
orphaning risk. Read `lib/youtube.py:generate_transcript()` before relying on it.

**Correct patterns already in the repo — copy these, don't invent:**
`playlist_ingestion.py:116-129` does atomic state writes via `tmp.replace()` and
`:222-244` writes a per-run markdown report. That is the H3 pattern, already working.

**Missing everywhere else:** no file locking anywhere in the tree (`flock`/`filelock` →
zero hits), so concurrent runs lose updates on `index.json`; `main.sh process-urls` is a bare
bash `while read` loop with no state file, so a batch dying at item 147/200 leaves no record.

---

## 8. Live trace — `dy <youtube-url>`, 2026-08-01 09:33

The five audits were static. This is one real run, instrumented before/after.
Command: `dy https://www.youtube.com/watch?v=HFLBDi87888` (already ingested 2026-07-24 —
chosen deliberately to test re-ingestion). Runtime **20.1s**. Exit reported success.

### 8.1 It reported success while 4 of 5 enrichment stages failed

Terminal output ended with `🎉 PROCESSING COMPLETE!` and a ✅ summary. What actually happened:

| Stage | Reality | Reported as |
|---|---|---|
| Transcript fetch | ✅ genuinely worked (95,839 B) | ✅ |
| Claude analysis | ❌ HTTP 400 — *"credit balance is too low"* | *(silent)* |
| RAG pipeline | ❌ `'ContentAnalysisEngine' object has no attribute 'process_for_rag'` | ⚠️ one line, then continued |
| Entity extraction | ❌ HTTP 401 — **invalid OpenAI API key**; 0 entities | ✅ *"Entity extraction complete"* + *"All entities already exist in database"* |
| Upstash vector | ❌ HTTP 404 on `/upsert-data` | ✅ *"Synced to Upstash Search"* |
| mem0 | ❌ failed to init (twice) | ✅ *"Contextual memories added"* |
| QStash enqueue | ✅ HTTP 201 | ✅ |

**Three stages reported ✅ while failing.** This is T-045's H7 in the wild, and far worse
than the static read suggested: the tool is not merely imprecise, it actively asserts
success for stages that errored. Any bulk run would look clean while producing hollow records.

### 8.2 P0 — the RAG pipeline is dead on every path

`ContentAnalysisEngine` (`processing/content_analysis.py:39`) defines
`get_claude_analysis`, `get_openai_analysis`, `get_deepseek_groq_analysis`,
`stream_openai_response`, `analyze_content` — **but not `process_for_rag`.**

Four call sites invoke it: `main.py:279`, `processing/web_content_processor.py:502`,
`lib/youtube.py:227`. Two docs document it. And
`tests/test_rag_prompt_pipeline_wiring.py:49` **asserts `hasattr(ContentAnalysisEngine,
"process_for_rag")`** — a test that must be failing and is evidently not being run.

Consequence: ADR-0001's Evidence-only chunking never executes on *any* path. This is the
concrete mechanism behind §1.4's "wired to nothing." Fix belongs in **H0**, not H2.

### 8.3 P0 — new ingestion writes OUTSIDE the archive

Files landed in `packages/knowledge-base/transcripts/2026-08-01/HFLBDi87888/` —
**not** `packages/knowledge-base/sources/transcripts/`. The write path still uses the
**pre-reorg location**. The `sources/` migration renamed what existed but never repointed
the writer.

So the archive is fragmenting *right now*: every new ingest lands in a second, parallel tree
that no audit, inventory script, or reconciliation counts. This is why H0 must fix the write
path before anything else — and it means the 946-file figure is already a floor, not a total.

### 8.4 Cross-day orphaning — confirmed, not theoretical

Both directories now exist:

```
sources/transcripts/2026-07-24/HFLBDi87888/   ← orphaned; nothing references it
transcripts/2026-08-01/HFLBDi87888/           ← index.json now points here
```

`index.json` record count stayed at **564** — the entry was overwritten in place and
repointed. `created_at` was reset to today, **destroying the original 2026-07-24
acquisition date**. The prior directory's six files are now unreachable through any index.

Exactly the failure predicted in §1.4, reproduced on the first attempt.

### 8.5 Bytes drift between runs — the D6 correction

| File | 2026-07-24 | 2026-08-01 | |
|---|---|---|---|
| transcript `.txt` | 95,001 B | 95,839 B | **DIFFERENT** |
| `Summary.txt` | 195 B | 195 B | identical *(both empty stubs)* |

Same video, same URL, +838 bytes. Content-hash dedup would treat this as a new document
forever — hence **D6**. The identical summaries are not reassurance: both are 195-byte
templates with an empty `=== ORIGINAL CONTENT ===` section, because Claude analysis has been
failing since at least 2026-07-24.

### 8.6 The 2026-07-24 batch is hollow

The old `_rag_pipeline.json` records `All LLM providers failed: 401 … Incorrect API key`.
**The OpenAI key has been invalid for 8+ days.** That entire 6-video batch was ingested with
zero entities, zero embeddable texts, and empty summaries — which explains why those 6 have
no `original_path` and never reached Postgres. They are shells that look ingested.

Entity extraction reads the *summary* file, so it has been running against empty stubs.

### 8.7 Side effects worth knowing

- **A local `dy` run posts to production**: QStash enqueued to
  `https://www.ultraterrestrial.app/api/workflow/processing` (HTTP 201, `deduplicated=False`).
  There is no dry-run on this path.
- **Retired Xata is still initialized** in the live path:
  `Xata client initialized for database: ultraterrestrial:main`.
- **A fourth undocumented index exists**: `lib/entity_extraction/entity_index.json`
  (43 files, 404 entities, 593 matches) — a state store outside both `index.json` and Postgres.
- `.venv` bootstrap, `faiss` load, and CocoIndex probing all run before argument parsing (M1).

### 8.8 What this changes in the plan

1. `process_for_rag` and the write-path fix move into **H0** — both are P0.
2. **D6** splits the dedup key by source class.
3. Failure reporting must be fixed *before* any bulk run, or failures are invisible at scale.
4. Credentials must be validated at startup — the pipeline currently runs 20 seconds and
   declares success on an invalid key.
5. Add a `--dry-run` that performs no writes and no production enqueue.

---

## 7. Audit provenance

Five parallel read-only audits, 2026-08-01: pipeline trace, data architecture, archive
structure, cross-population reconciliation, DB schema/ingestion. All numbers measured
against the live Neon database or the filesystem, not quoted from docs.

One methodology discrepancy left open on purpose (§1.6): unindexed-file counts of 390 vs 139
differ at the graphify/dotfile filtering boundary. Reconcile in H0 before acting on either.
Total-row counts differ by 1 (126,483 exact `count(*)` vs 126,484 from `pg_stat_user_tables`
estimates) — trust the exact count.
