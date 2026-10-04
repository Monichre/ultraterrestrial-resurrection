---
status: live
role: eng
spine: do
updated: 2026-08-18
---

# T-061 — the OCR ingest stage and the storage-endpoint decision

**Created:** 2026-08-18
**Ticket:** T-061 ([`docs/plans/TODO.md`](docs/plans/TODO.md)) · storage half feeds T-048 H5
**Lane:** A — Corpus & Ingestion
**Predecessor:** [`docs/plans/2026-08-17-t061-files-taxonomy-and-corpus-storage.md`](docs/plans/2026-08-17-t061-files-taxonomy-and-corpus-storage.md)

Two decisions came out of an operator conversation on 2026-08-18. Both were
recorded here rather than in the predecessor doc, which is a record of executed
work and should stay that way.

---

## 1. What a sidecar is, and why "already in the store" was misleading

`ocrmypdf --sidecar foo.txt in.pdf foo.ocr.pdf` writes two things:

| output | contents | size | tracked in git |
| --- | --- | --- | --- |
| `foo.ocr.pdf` | original scan + an invisible text layer | ~1.3× the original | no — gitignored, regenerable |
| `foo.txt` (the **sidecar**) | just the words tesseract read | ~1000× smaller | **yes** |

That split is why 39 sidecars are committed while 96 MB of `.ocr.pdf`
companions are not — see [`packages/knowledge-base/.gitignore`](packages/knowledge-base/.gitignore).

**The store audit finding restated precisely.** The gap files *do* have records
in `vs_meWOEnUiUxtQWf0W6NBsNpCG`. What they do not have is text. OpenAI's own
failure reason on 26 of 38:

```
"The file could not be parsed because it is empty."
```

Upload succeeded; the PDF carried no text layer; zero bytes were indexed. The
file is a row in the store carrying nothing searchable, and `file_search` can
never return it. Re-uploading is not adding missing files — it is replacing
empty shells with the same documents carrying their text.

| | before OCR | after re-upload |
| --- | --- | --- |
| file record in store | yes | yes |
| extractable text | zero | 406 KB |
| retrievable by the app | **no** | yes |

The 25 are a mix of empty-parse and never-landed; the per-entry split is in
[`packages/knowledge-base/metadata/vector-store-gap-report.json`](packages/knowledge-base/metadata/vector-store-gap-report.json).

---

## 2. The OCR ingest stage — target shape

**Current state, measured:** `grep -rln ocrmypdf` across
[`apps/disclosure-rag`](apps/disclosure-rag) and
[`packages/knowledge-base`](packages/knowledge-base) returns **nothing**. Every
OCR run so far was ad-hoc. What exists is the *data contract*, not the plumbing:
[`packages/knowledge-base/metadata/ocr-manifest.json`](packages/knowledge-base/metadata/ocr-manifest.json)
already carries `preferred_text: "ocr" | "original"` for 14 entries, and nothing
reads that field.

Steps 1–3 exist in some form. Step 4 onward is the gap.

### 1. Identity gate — exists

`already_have(youtube_id=, url=, file_path=)` in
[`apps/disclosure-rag/lib/kb/corpus_manifest.py`](apps/disclosure-rag/lib/kb/corpus_manifest.py).
Checks videoId, then URL, then sha256, before a byte is spent.

### 2. Extract + quality gate — logic exists, not as a stage

Score the extracted text by **ratio of common English words**, never by chars
per page. This is load-bearing, not a refinement: char count rated `ufo3.pdf`
healthy at 3,592 chars/page when its first two pages were scan-stamp noise
(`--. 1~ 92I _`). Deeper pages score 32.4% valid words; the garbage was
localized to cover pages.

### 3. OCR only when the gate fails — ad-hoc today

Never a blanket `--force-ocr`. On 18 of the 31 taxonomy files that would have
discarded a good text layer for a worse one. Output lands in `derived/`; the
original is never overwritten.

### 4. Pick the winner and record why — **gap**

Compare OCR output against the original, write `preferred_text`, `reason`, and
`sha256` into `ocr-manifest.json`. Everything downstream reads *this decision*,
not the PDF.

### 5. Fan out to both indexes from the chosen text — **gap**

| target | payload | serves |
| --- | --- | --- |
| Neon pgvector `document_chunks` | chunks + embeddings via [`apps/app/src/features/ai/pipelines/helpers/vectorize.ts`](apps/app/src/features/ai/pipelines/helpers/vectorize.ts) | hybrid retrieval, graph joins |
| OpenAI vector store | the text-bearing artifact (sidecar or `.ocr.pdf`) | the app's live `file_search` |

Both fed from one source of truth. Today these are separate lineages, which is
exactly how a file ends up in one and not the other.

### 6. Verify **indexed**, not **uploaded** — the whole bug

Poll until `status == completed`. A 200 on upload is not success. That single
missing check is what produced 26 empty-parse files: the pipeline believed it
was done because the POST returned fine.

### 7. Write back and close the loop — **gap**

Stamp the manifest with `vector_store_file_id`, chunk count, indexed-at. The
identity gate in step 1 can then answer a sharper question than *"do I have this
file?"* — it can answer **"is this retrievable?"** Those are different
questions and only the second matters to the app.

### The architectural point

The manifest stops being a dedupe cache and becomes the **join key across three
stores** — disk, pgvector, OpenAI. "Ingested" gets defined as *indexed and
verified retrievable*. The store audit stops being a forensic exercise and
becomes a re-runnable assertion the pipeline makes about itself.

The 25 gap files are the natural test fixture: once the stage exists, re-running
it against them must be a no-op.

**Placement:** a new `lib/kb/ocr_stage.py` that the ingest calls — not a new
stage inside
[`apps/disclosure-rag/scripts/bulk_folder_ingestion.py`](apps/disclosure-rag/scripts/bulk_folder_ingestion.py),
which is a July 2025 Triple-RAG artifact and Triple RAG no longer exists.

---

## 3. Neon Object Storage — evaluated, deferred

Raised by the operator as a candidate for the 29 GB corpus mirror.
Docs: [neon.com/docs/storage/overview](https://neon.com/docs/storage/overview).

### What it is

Real S3 wire protocol — boto3, AWS CLI, AWS SDK work by pointing at a branch
endpoint with a Neon credential; no separate cloud account. Buckets declared in
`neon.ts`, access set to `private` or `public_read` through Neon rather than S3
ACLs. The distinguishing feature is that **buckets branch copy-on-write with the
database**: one `branch_id` forks Postgres data and objects together, and
deleting the branch takes the files with it.

### Verdict — not the mirror, not yet

| blocker | detail |
| --- | --- |
| **Region** | Beta is `us-east-2` only. Our project is **`us-east-1`** (`ep-red-sky-ah7swer1.c-3.us-east-1.aws.neon.tech`). |
| **Pricing** | Free during beta, **unannounced for GA**. 29 GB into an unpriced service is an open-ended bill. |
| **Durability** | No published durability figure or SLA in the docs or either engineering blog. |

The region block is worse than it looks. A second Neon project in `us-east-2`
would work, but the buckets would then live in a different project from the
database — paying the beta risk for none of the branching benefit.

The durability gap is disqualifying on its own **for this corpus specifically**.
The PDFs are gitignored, so git holds no copy, and
[`packages/knowledge-base/metadata/files-rename-manifest.json`](packages/knowledge-base/metadata/files-rename-manifest.json)
is the only record that the taxonomy renames happened. A beta object store with
no stated durability guarantee cannot be the sole home of bytes that exist
nowhere else.

### Where it earns a second look

The **derived tier**. OCR sidecars and `.ocr.pdf` companions are regenerable —
if the beta lost them, re-run ocrmypdf. That is precisely the risk profile a
beta earns. Branching derived artifacts alongside pgvector rows is a genuine fit
for a pipeline that writes to both.

### Why this is low-stakes

It does not change the plan. T-048 H5 is already "object-storage mirror +
committed manifest." Neon Object Storage, R2, and S3 all speak the same
protocol, so `corpus_mirror.py` written against boto3 keeps the endpoint as a
config value. **Build the mirror tool endpoint-agnostic, point it at R2 now,
revisit Neon after it reaches us-east-1 with published pricing.**

R2 over S3 on the assumption that zero egress fees matter more here than
ecosystem depth — reverse that if there is no Cloudflare account.

---

## 4. Open — operator decisions

1. **R2 vs S3** for the mirror bucket. Blocks `corpus_mirror.py`.
2. **Upload the 25 OCR'd sidecars** to the vector store — the only step that
   converts the recovered 406 KB into retrievability. Deferred by the operator
   on 2026-08-18 ("I'll return to those sidecars later").
3. **The remaining ~750 OCR candidates** (~1.2 h) — run or stop at the 25.
4. **Quarantine `Deprecated - CIA Declassified Documents/`** — 377.6 MiB, 703
   byte-identical duplicate groups. Recommendation: quarantine, do not `rm`.

---

## 5. Corpus survey and re-enrichment — 2026-08-18 session

### 5.1 The provenance layer was gitignored

The root [`.gitignore`](.gitignore)'s blanket `*.json` was excluding 350 files
under `sources/` — `_ingest.json`, `_metadata.json`, `_rag_pipeline.json`,
`_segments.json`, `entity_processing_results.json`. That is the pipeline's own
record of what it did to each transcript. A fresh clone got 431 transcripts and
no provenance at all. 2.5 MB of text, scanned clean for secrets, now tracked via
[`packages/knowledge-base/.gitignore`](packages/knowledge-base/.gitignore).

`metadata/*.json` is now covered wholesale rather than negated file-by-file —
the per-file list in the root ignore had gone stale and six existing audit
artifacts (`phase3-*`, `vector-store-upload-results`) were sitting untracked.

### 5.2 Ingest completeness census

257 videos, **15 distinct completeness profiles**:

| marker | coverage |
| --- | --- |
| transcript | 252/257 (98%) |
| summary | 151/257 (58%) |
| metadata | 75/257 (29%) |
| entities | 68/257 (26%) |
| rag_pipeline | 60/257 (23%) |
| segments | 4/257 (1%) |

The largest single bucket is **106 videos (41%) that are transcript-only**.
Only 67 (26%) are fully processed. `jesse-michels` is split across both eras —
50 full, 29 bare — making it the cleanest re-ingest target.

Per-entry: [`packages/knowledge-base/metadata/transcript-completeness-census.jsonl`](packages/knowledge-base/metadata/transcript-completeness-census.jsonl)

### 5.3 Junk purge — and why keyword scoring alone would have been a disaster

22 entries removed (43 files, 502 KB): a rickroll, the He-Man meme, two movie
trailers, a react-flow **coding tutorial**, an LLM-business podcast, a VEED ad,
an httpbin.org test artifact, and 11 unrelated news segments.

Two method notes worth keeping:

1. **Score the RAW transcript, never the summary.** Including the LLM-written
   `Summary.txt` rated the rickroll as in-domain, because its generated summary
   mentioned UFOs. Excluding summaries dropped it to 0 hits / 500 words.
2. **Zero keyword hits is a prompt to read the file, not a verdict.** Six
   entries scored at or near zero and are core material: Greer's "Cold Fusion
   and Beyond", the Colares case, the Bob Lazar 1989 originals, Phil Schneider's
   testimony, Col. Karl Nell at SALT, Jim Semivan on Hannibal TV. Automated
   pruning would have destroyed all six.

Record: [`packages/knowledge-base/metadata/junk-purge-2026-08-18.json`](packages/knowledge-base/metadata/junk-purge-2026-08-18.json).
Removed with `git rm`, so all of it is recoverable.

### 5.4 The enrichment pipeline had a single point of failure

Re-ingestion was dead on arrival. All 8 tiers of `FRONTIER_FALLBACK_CHAIN` and
all 13 in [`packages/ai/prompts/llm_routing.yaml`](packages/ai/prompts/llm_routing.yaml)
declared exactly one credential: `OPENROUTER_API_KEY`. When that account hit
zero credits, every tier returned 402 within 1.2 s. The fallback module's
docstring promises "one provider being down never takes enrichment down" —
unkeepable when every tier is the same provider.

Probed every credential in `.env` with a real completion, not a `/models` call:

| provider | result |
| --- | --- |
| `openai/gpt-5.6`, `gpt-5.5` | **live** |
| `deepseek-chat` | **live** |
| anthropic | 401 invalid key |
| groq | 401 invalid key |
| google | 400 invalid key |
| openrouter | 402 no credits; presets 404 "not found for this account" |

The three live ones are now direct-provider tiers in both chains and in
`defaults.last_resort_tiers`. The dead three are deliberately not declared —
a key being present says nothing about it working.

Verified end-to-end on a previously transcript-only entry: 1 file to 10,
~2 min/entry, all stages green except CocoIndex.

### 5.5 `unresolved/` was never unresolvable

All 13 entries carry their source URL in their own text. 6 are web articles
(disclosurediaries, howandwhys ×2, sundayworld, twz) and 7 are YouTube — which
also answers the standing "is Reality Check its own source or NewsNation?"
question, since both Reality Check entries resolve to real video IDs. Re-running
ingestion on the URLs files and enriches them in one step.

---

## 6. Still open

1. **`OPENROUTER_API_KEY` in [`apps/disclosure-rag/.env`](apps/disclosure-rag/.env)
   is the old account's.** The presets configured on the new account return 404
   "not found for this account". One env swap revives 13 tiers and the preset
   chain. Enrichment runs without it now, on OpenAI/DeepSeek direct.
2. **`cocoindex` is not installed** — knowledge-graph writes are skipped on
   every run (`cocoindex_not_available`). Needs the package plus Postgres/Neo4j
   config before graph enrichment means anything.
3. **`llm_routing.yaml` was referenced but bypassed.** Two docstrings in
   `llm_fallback.py` describe the yaml router as the thing that *replaces* the
   hardcoded chain, while the hardcoded chain stayed live.
4. **Re-ingest creates a second transcript file** rather than replacing, when
   the video title has changed since the first ingest. Accepted for now —
   duplicates surface in retrieval citations and get pruned there.
5. Decisions carried over from §4: R2 vs S3, uploading the 25 OCR'd sidecars,
   the remaining ~750 OCR candidates, quarantining the 377.6 MiB CIA duplicate
   mirror.
