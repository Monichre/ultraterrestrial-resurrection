# `disclosure-rag/main.py` Contract and Ingestion Review

**Reviewed:** 2026-07-16 19:58 CDT  
**Repository:** `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection`  
**Branch:** `fix/disclosure-rag-hardening`  
**HEAD:** `3939646`  
**Primary target:** `apps/disclosure-rag/main.py`  
**Relevant hardening commits:** `b9311b3`, `3939646`  
**Verdict:** **FAIL — not ready for merge or batch podcast ingestion**  
**Mutation status:** Review-only. `main.py` had no uncommitted diff and was not modified during this review.

---

## Executive summary

The two hardening commits improve PDF extraction, remove stale absolute paths, and make `--help` and `--status` import successfully without Upstash. Those fixes are real but incomplete.

The entry point still violates its advertised contract in several load-bearing ways:

1. Non-upload YouTube and web processing still fails when Upstash is unavailable because the enhanced service methods re-import the queue outside `main.py`'s guard.
2. `--no-kb` is ignored for URL processing; both enhanced URL workflows write to the local knowledge base unconditionally.
3. Local-file entity extraction reads from a second, stale `KnowledgeBaseCRUD` instance rather than the instance that performed the write.
4. Web knowledge-graph processing runs twice by default.
5. Queue relocation can overwrite an existing source file and leaves persisted provenance pointing to the pre-move path.
6. CLI status and success output overstate what actually succeeded.

The current file should not become the core of the planned playlist harvester without first separating extraction, validation, persistence, vectorization, graph construction, and optional integrations into explicit stages with typed outcomes.

---

## Scope and contract reviewed

The review checked the contract implied by `main.py` and the two hardening commits:

- Process YouTube URLs, web URLs, local text files, and PDFs.
- `--upload` controls OpenAI upload behavior.
- `--no-kb` prevents knowledge-base persistence.
- `--status` and non-upload runs work when optional Upstash/CocoIndex integrations are unavailable.
- PDFs are text-extracted before being handed to UTF-8-only consumers.
- Files under `data/processing_queue` are relocated using repo-relative, containment-safe paths.
- Reported success corresponds to real stage outcomes.
- Source provenance survives ingestion and relocation.

Neighbouring modules were inspected only where needed to trace behavior:

- `apps/disclosure-rag/lib/knowledge_base_service.py`
- `apps/disclosure-rag/lib/knowledge_base_crud.py`
- `apps/disclosure-rag/lib/upstash/queue.py`
- `apps/disclosure-rag/lib/upstash/vector.py`
- `apps/disclosure-rag/lib/cocoindex_integration.py`

This review also cross-checked:

- `docs/plans/2026-07-09-disclosure-rag-ingestion-audit.md`
- `docs/design/disclosure-rag-review.md`
- `docs/design/ingestion-analysis.md`

---

## Severity-ordered findings

### CRITICAL

#### C1. The Upstash import guard does not protect actual URL ingestion

**Locations**

- `apps/disclosure-rag/main.py:69-81`
- `apps/disclosure-rag/main.py:129-138`
- `apps/disclosure-rag/lib/knowledge_base_service.py:282-292`
- `apps/disclosure-rag/lib/knowledge_base_service.py:469-492`

**Problem**

`main.py` catches `ImportError` and `RuntimeError` when importing `lib.upstash.queue`, which is enough for `--help` and `--status`. But `process_youtube_with_enhanced_workflow()` and `process_web_with_enhanced_workflow()` import `.upstash.queue` again inside `knowledge_base_service.py`. Those imports are not optional and occur before extraction.

The hardened comment says non-upload runs should work without Upstash, but both non-upload URL paths still abort.

**Runtime evidence**

```text
python3 main.py https://example.invalid --no-kb
ERROR:lib.knowledge_base_service:Error in enhanced web processing: No module named 'upstash_vector'
exit=1

python3 main.py https://youtu.be/invalid-test-id --no-kb
ERROR:lib.knowledge_base_service:Error processing YouTube URL: No module named 'upstash_vector'
exit=1
```

**Fix direction**

Inject one optional queue adapter into the service, or centralize queue acquisition behind a lazy helper that returns an explicit `skipped` outcome. Do not re-import the concrete Upstash module inside each workflow.

---

#### C2. `--no-kb` is ignored for YouTube and web URLs

**Locations**

- `apps/disclosure-rag/main.py:124-138`
- `apps/disclosure-rag/main.py:155-156`
- `apps/disclosure-rag/main.py:567-578`
- `apps/disclosure-rag/lib/knowledge_base_service.py:421-437`
- `apps/disclosure-rag/lib/knowledge_base_service.py:673-690`
- `apps/disclosure-rag/lib/knowledge_base_service.py:1091-1098`

**Problem**

`main()` calculates `add_to_kb = not args.no_kb` and passes it to `process_url()`. `process_url()` uses it only to decide whether to run the extra CocoIndex step. It calls `process_youtube_url_enhanced(url, upload)` or `process_web_url_enhanced(url, upload)` without forwarding `add_to_kb`.

Both enhanced service workflows then write to the local knowledge base unconditionally.

The public wrapper signatures accept only `url` and `upload`, so this is not a missed call-site argument; the option is absent from the URL-processing API.

**Impact**

A user explicitly requesting extraction without persistence still mutates the corpus, metadata index, entity state, and potentially search/vector backends.

**Fix direction**

Add an explicit options object or keyword-only stage controls to both enhanced workflows. `--no-kb` must disable KB writes, entity writes that depend on a KB document, graph writes, and any search sync derived from the KB record. Add a regression test proving no persistent files or index changes occur.

---

#### C3. Local-file entity processing reads a stale CRUD index

**Locations**

- `apps/disclosure-rag/main.py:17-21`
- `apps/disclosure-rag/main.py:83-85`
- `apps/disclosure-rag/main.py:292-321`
- `apps/disclosure-rag/lib/knowledge_base_service.py:1080-1088`

**Problem**

`kb_service` owns one `KnowledgeBaseCRUD` instance. `main.py` then creates a second global `kb_crud = KnowledgeBaseCRUD()`.

Local-file persistence goes through the convenience function `add_to_knowledge_base()`, which writes using `kb_service.kb_crud`. Immediately afterward, entity setup calls `main.py`'s separate `kb_crud.get_document(doc_id)`. Its in-memory index was loaded before the write and is not refreshed.

**Runtime evidence**

```text
same_crud_instance= False
main_index_object_same= False
```

For a newly created document, `doc_info` can therefore be `None`, causing entity processing to be skipped with "Could not find document info" despite the KB write succeeding.

**Fix direction**

Use one service-owned repository instance throughout. Prefer having the write operation return the persisted `Document` and canonical paths so callers do not immediately re-read mutable global state.

---

### HIGH

#### H1. Web knowledge-graph processing runs twice

**Locations**

- `apps/disclosure-rag/main.py:155-194`
- `apps/disclosure-rag/lib/knowledge_base_service.py:730-783`

**Problem**

The enhanced web workflow already runs CocoIndex after KB/entity processing. `process_url()` then triggers CocoIndex again whenever the returned result contains `doc_id` and `add_to_kb=True`.

**Impact**

Each web ingestion can run a global `cocoindex update` twice. `lib/cocoindex_integration.py:121-134` documents that the CLI version cannot filter by document and therefore processes all documents. This duplicates cost, latency, graph writes, and failure opportunities.

**Fix direction**

Assign graph construction to one orchestration layer. Return a stage result from the service and never infer that another layer still needs to run it.

---

#### H2. Processing-queue relocation is not collision-safe

**Locations**

- `apps/disclosure-rag/main.py:428-463`
- specifically `apps/disclosure-rag/main.py:446-449`

**Problem**

The resolved containment check is an improvement, but the destination uses only `resolved_source.name`. On macOS/Unix, moving a file onto an existing file path can replace the existing file.

Two queued documents with the same basename can therefore destroy one source artifact.

**Fix direction**

Use a content hash/document ID directory, reject collisions, or generate an atomic unique destination. Never overwrite without an explicit deduplication decision.

---

#### H3. Relocation leaves persisted provenance stale

**Locations**

- `apps/disclosure-rag/main.py:256-267`
- `apps/disclosure-rag/main.py:292-297`
- `apps/disclosure-rag/main.py:428-456`
- `apps/disclosure-rag/lib/knowledge_base_service.py:226-276`

**Problem**

The KB document is persisted before relocation with the original `source` and `file_path`. After moving the source, `main.py` updates only the returned in-memory `data['source']` and `data['metadata']['source']`.

It does not update:

- the already-persisted KB document,
- `data['file_path']`,
- `data['metadata']['file_path']`, or
- a relocation/provenance event recording old path → new path.

**Impact**

The corpus can report a source path that no longer exists, undermining reproducibility and source traceability.

**Fix direction**

Choose the canonical destination before persistence, or perform relocation and metadata update transactionally. Preserve both `original_path` and `canonical_path`, plus source hash and relocation timestamp.

---

#### H4. Extracted PDF temporary files are never deleted

**Locations**

- `apps/disclosure-rag/main.py:276-290`

**Problem**

For `PDF + --upload`, extracted text is written with `NamedTemporaryFile(delete=False)` and passed to the queue. There is no cleanup after success or failure.

**Impact**

Every uploaded PDF leaves a plaintext copy in the system temp directory. That creates disk leakage and an avoidable privacy/provenance problem for sensitive research material.

**Fix direction**

Use a scoped temporary directory and delete in `finally`, unless asynchronous consumers genuinely require a durable file. If durability is required, copy to a managed staging directory with lifecycle metadata rather than `/tmp`.

---

#### H5. `--status` reports CocoIndex as available when it is not operational

**Locations**

- `apps/disclosure-rag/main.py:60-67`
- `apps/disclosure-rag/main.py:507-538`
- `apps/disclosure-rag/lib/cocoindex_integration.py:21-49`

**Problem**

`COCOINDEX_KG_AVAILABLE` means only that `lib.cocoindex_integration` imported. That module itself can import successfully while `cocoindex_processor.cocoindex_available` is `False`.

**Runtime evidence**

The same `--status` run logged:

```text
WARNING:lib.cocoindex_integration:CocoIndex not available - install with: pip install cocoindex
```

and printed:

```text
CocoIndex KG: ✅
```

**Fix direction**

Report operational readiness from `cocoindex_processor.cocoindex_available` plus configuration/connectivity checks. Distinguish `module_present`, `package_present`, `configured`, and `reachable`.

---

#### H6. YouTube detection accepts unrelated or hostile-looking URLs

**Locations**

- `apps/disclosure-rag/main.py:88-90`

**Problem**

Detection is substring-based instead of hostname-based.

**Verified false positives**

```text
https://example.com/?next=youtube.com/watch?v=abc => True
https://notyoutube.com/watch?v=abc               => True
```

**Fix direction**

Use the already-imported `urlparse`. Normalize the hostname and accept an explicit set such as `youtube.com`, `www.youtube.com`, `m.youtube.com`, and `youtu.be`; validate supported path/query shapes separately.

---

#### H7. Completion output does not reflect stage outcomes

**Locations**

- `apps/disclosure-rag/main.py:270-297`
- `apps/disclosure-rag/main.py:580-618`
- `apps/disclosure-rag/lib/knowledge_base_service.py:399-437`
- `apps/disclosure-rag/lib/knowledge_base_service.py:648-690`

**Problems**

- OpenAI upload is printed as successful whenever `upload_results` exists, even if the returned object represents failure.
- File queue results are discarded, so a skipped/failed queue cannot be reported accurately.
- QStash is printed as successful whenever `queue_result` exists, without inspecting success/skipped/error state.
- Overall "Processing complete" requires only a truthy result, not successful required stages.
- Mem0 success output checks whether the integration is enabled at reporting time, not whether memory writes for this item succeeded.
- URL workflows can return data with `doc_id=None`; the CLI still prints overall success.

**Fix direction**

Return a typed per-stage result containing `status`, `required`, `attempted`, `error`, and artifact IDs. Compute process success from required-stage outcomes and print partial success honestly.

---

### MEDIUM

#### M1. Importing the CLI eagerly initializes heavy, unrelated systems

**Locations**

- `apps/disclosure-rag/main.py:13-36`
- `apps/disclosure-rag/main.py:52-85`

**Problem**

Before argument parsing, the module imports and initializes the KB service, web processor, FAISS/CocoIndex-related modules, and global clients. Even `--help` loads FAISS, NumExpr, datasets, PyTorch, Polars, DuckDB, and TensorFlow in the current environment.

**Impact**

Slow startup, noisy logs, optional dependency coupling, and more ways for `--help`/`--status` to fail.

**Fix direction**

Parse arguments first. Lazily construct only the adapters required by the selected command.

---

#### M2. The hardening changes have no direct `main.py` regression tests

**Evidence**

- The repository contains no tests targeting `process_file`, `process_url`, `is_youtube_url`, `--no-kb`, PDF queue handoff, or relocation behavior.
- Commit `3939646` added/updated `tests/test_postgres_client.py`, but no test file for the `main.py` changes.
- `python3 -m pytest tests/test_postgres_client.py -q` passed **8 tests**, none exercising `main.py`.

**Fix direction**

Add isolated tests with dependency injection and temporary directories. The test suite must not touch live OpenAI, Upstash, QStash, Mem0, Postgres, or the canonical knowledge base.

---

#### M3. Broad exception handling converts distinct failures into `None`

**Locations**

- `apps/disclosure-rag/main.py:99-121`
- `apps/disclosure-rag/main.py:191-194`
- `apps/disclosure-rag/main.py:225-245`
- `apps/disclosure-rag/main.py:373-425`
- `apps/disclosure-rag/main.py:482-484`

**Problem**

Many stages catch `Exception`, log a string, and continue or return `None`. Callers cannot distinguish extraction failure, credential failure, graph failure, malformed content, persistence failure, or programming error.

**Fix direction**

Use stage-specific exceptions and structured outcomes. Preserve tracebacks in debug logs while returning safe user-facing errors.

---

#### M4. File ingestion has no explicit size/type/resource limits

**Locations**

- `apps/disclosure-rag/main.py:214-268`

**Problem**

The file path is checked only for existence. Non-PDF files are read entirely into memory, and PDFs are fully extracted and joined into one string. There is no maximum file size, page limit, supported-extension policy, or streaming/chunking strategy.

**Impact**

A large file can exhaust memory or create oversized downstream requests.

**Fix direction**

Validate regular files, allowed types, maximum bytes/pages, and process content incrementally into bounded chunks.

---

#### M5. `main.py` currently fails lint

**Command**

```text
ruff check main.py
```

**Result**

`27 errors`:

- six unused imports (`json`, `datetime`, `requests`, `urlparse`, and two CocoIndex symbols),
- numerous f-strings without placeholders.

`UPSTASH_QUEUE_AVAILABLE` and `ENHANCED_COCOINDEX_AVAILABLE` are also assigned but not used to drive behavior.

**Fix direction**

Clean this after the contract fixes. Do not let lint cleanup obscure the behavioral patch.

---

## Positive findings

The review confirmed several hardening improvements are correct:

1. `python3 -m py_compile apps/disclosure-rag/main.py` passes.
2. `python3 apps/disclosure-rag/main.py --help` runs without configured Upstash.
3. `python3 apps/disclosure-rag/main.py --status` runs, although CocoIndex status is inaccurate.
4. Plain UTF-8 text processing with `add_to_kb=False` returns data without a `doc_id`.
5. Blank/image-only PDFs are rejected when `PyPDF2` extracts no text.
6. PDF detection is now case-insensitive through one `is_pdf` flag.
7. Binary PDFs are no longer passed directly to the UTF-8 queue path.
8. Processing-queue containment uses resolved paths and no longer depends on the obsolete absolute Desktop path.
9. Relocation failures are surfaced in returned metadata rather than silently swallowed.

These fixes should be retained while correcting the orchestration defects above.

---

## Readiness gaps for the planned playlist-to-knowledge workflow

These are not regressions against the current single-input CLI contract, but they prevent this file from serving as the reusable podcast harvester without redesign.

### Missing acquisition and provenance controls

- No playlist enumeration or pagination.
- No source manifest recording playlist, channel, video ID, canonical URL, publish date, retrieval time, or extractor version.
- No caption-source record distinguishing creator captions, auto-captions, API text, or Whisper fallback.
- No audio/transcript checksum for reproducibility.
- No idempotency key, resume checkpoint, or per-episode state machine.

### Missing transcript fidelity gate

- No language detection.
- No caption coverage/duration check.
- No timestamp continuity check.
- No repeated-caption/hallucination detection.
- No comparison between caption and ASR fallback samples.
- No confidence score or human-review queue.

### Missing corpus/vector guarantees

- No explicit chunking contract in `main.py`.
- No chunk IDs stable across reruns.
- No chunk-level timestamp/source provenance.
- No embedding model/version/dimension recorded with each vector.
- No validation for empty chunks, duplicate IDs, or partial vector writes.

### Missing graph separation

- Generic entity/claim extraction and Ultraterrestrial-specific topology are coupled through legacy service behavior.
- No explicit claim/evidence model with transcript-span provenance.
- No adapter boundary that permits a generic graph for other podcast domains.
- CocoIndex status does not prove graph availability or successful graph writes.

### Batch-safety risk

The file relies on mutable JSON-index state and global service objects. It is not safe to parallelize playlist episodes until persistence is transactional, idempotent, and concurrency-safe.

---

## Recommended fix order

### Gate 0 — contract repair

1. Centralize optional queue acquisition and remove service-level concrete re-imports.
2. Add a shared `ProcessingOptions`/stage-options object; make `--no-kb` enforce zero KB-derived writes.
3. Remove the duplicate `KnowledgeBaseCRUD` instance and return persisted document/path data from the write.
4. Make web graph construction single-owner.
5. Replace boolean/truthy success with typed stage outcomes.

### Gate 1 — data integrity

6. Choose the final canonical source path before persistence.
7. Make relocation collision-safe and atomic.
8. Persist `original_path`, `canonical_path`, source hash, and relocation event.
9. Clean temporary extracted text in `finally` or move it into managed staging with lifecycle controls.

### Gate 2 — validation and tests

10. Parse and validate YouTube host/path correctly.
11. Report operational integration status rather than import status.
12. Add isolated tests for every finding above.
13. Run lint after behavioral tests pass.

### Gate 3 — reusable harvester

14. Extract a generic source → canonical document pipeline.
15. Add playlist manifests, resumability, idempotency, and transcript-fidelity gates.
16. Add chunk-level provenance and embedding metadata.
17. Put Ultraterrestrial ontology/claim extraction behind a separate adapter.

---

## Required regression tests

At minimum:

1. `--help` with no optional integration packages/credentials.
2. `--status` reports module present but processor unavailable correctly.
3. Web non-upload succeeds with queue unavailable and records queue as skipped.
4. YouTube non-upload succeeds with queue unavailable and records queue as skipped.
5. `--no-kb` causes zero KB/index/entity/graph/search writes for web and YouTube.
6. Local-file write and entity lookup use the same repository instance.
7. Web ingestion invokes graph construction exactly once.
8. Uppercase `.PDF` is extracted and classified as research.
9. PDF queue receives text, never binary PDF bytes.
10. Temporary PDF extraction artifacts are removed on success and exception.
11. Processing-queue symlink escaping the queue is not moved.
12. Duplicate destination filename cannot overwrite an existing source.
13. Persisted provenance points to the canonical post-move path and retains the original path.
14. Failed OpenAI upload does not print success.
15. Skipped/failed queue does not print success.
16. `notyoutube.com` and query-parameter mentions are classified as web, not YouTube.

---

## Verification receipts

### Commands executed

```text
git status --short --branch
git log -5 --oneline -- apps/disclosure-rag/main.py
git diff a303da4..HEAD -- apps/disclosure-rag/main.py
python3 -m py_compile apps/disclosure-rag/main.py
python3 apps/disclosure-rag/main.py --help
python3 apps/disclosure-rag/main.py --status
python3 main.py https://example.invalid --no-kb
python3 main.py https://youtu.be/invalid-test-id --no-kb
python3 -m pytest tests/test_postgres_client.py -q
ruff check main.py
```

### Observed results

- Compile: pass.
- Help smoke: pass.
- Status smoke: command runs; CocoIndex status is contradictory.
- Web non-upload/no-KB smoke without Upstash: fail, exit 1.
- YouTube non-upload/no-KB smoke without Upstash: fail, exit 1.
- Text `process_file(..., add_to_kb=False)`: pass.
- Blank PDF rejection: pass.
- YouTube hostname adversarial cases: two verified false positives.
- Postgres tests: 8 passed.
- Ruff: 27 findings.
- CRUD identity probe: `main.kb_crud is kb_service.kb_crud` is `False`; index objects are distinct.

---

## Independent-review status

The requested subagent-driven review did not produce an independent verdict:

1. `delegate_task` spec reviewer was rejected before execution with HTTP 402 because the provider requested a 65,536-token maximum while only 8,385 tokens were affordable.
2. A read-only local Codex fallback started but consumed its run reading large project-management tiers and was interrupted before returning a finding set.

Neither failure was treated as approval. The findings in this document are controller-verified through direct code tracing and targeted runtime probes. Because the spec gate is **FAIL**, the second-stage quality approval gate was not entered; under the invoked workflow, quality review must not begin until blocking contract gaps are fixed and the spec gate passes.

---

## Final call

`apps/disclosure-rag/main.py` is improved but still not contract-correct. It should not be approved on `fix/disclosure-rag-hardening`, and it should not be expanded into the playlist harvester in its current orchestration shape.

The right move is a bounded contract-repair pass first, followed by isolated regression tests and a fresh spec review. Only after that passes should code-quality review and reusable playlist pipeline extraction begin.
