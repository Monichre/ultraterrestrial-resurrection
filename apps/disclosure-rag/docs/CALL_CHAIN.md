# `dy` call chain — annotated

Every juncture the `dy` CLI passes through, transcribed from the `═══ …-CHAIN-NN ═══` comment blocks that live in the source. The code is the source of truth; this file is a readable index of it.

Generated 2026-08-15 08:21 from the working tree.

Hrefs are workspace paths from repo root (`apps/disclosure-rag/...`). Line anchors use `#L`.

**KB module roles** (service vs CRUD vs vector `KnowledgeBase`): [`apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md`](apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md).

## How to read this

Each juncture is one hop: a file and function, what happens there, and its `PREV`/`NEXT` links. Markers are stable identifiers — grep any `YT-CHAIN-07` and you land on the block in the code.

Three chains share a prefix and then diverge:

```
main.sh  →  main()  →  process_url()  ─┬─ YouTube  → YT-CHAIN-04 …
                                       └─ web      → WEB-CHAIN-01 …
main.sh  →  main()  →  process_file() ─── local file → FILE-CHAIN-03 …
```

Prefix: [`main.sh`](apps/disclosure-rag/main.sh) → [`main.py`](apps/disclosure-rag/main.py) `main()` → [`process_url()`](apps/disclosure-rag/main.py#L354) or [`process_file()`](apps/disclosure-rag/main.py#L574).

**Tracing a live run:** [`scripts/dy-trace.sh`](apps/disclosure-rag/scripts/dy-trace.sh) runs the same pipeline under [`scripts/trace_dy.py`](apps/disclosure-rag/scripts/trace_dy.py), printing an indented call trace to stderr and writing the full trace to `data/traces/<timestamp>.log`. Playlist URLs (`list=` or `/playlist`) are routed by [`main.sh`](apps/disclosure-rag/main.sh) to [`scripts/playlist_ingestion.py`](apps/disclosure-rag/scripts/playlist_ingestion.py) and are **not** traceable through that wrapper.

## Index

| Marker | Location | Source |
| --- | --- | --- |
| `YT-CHAIN-01` | [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm | [`main.sh:357`](apps/disclosure-rag/main.sh#L357) |
| `YT-CHAIN-02` | [`main.py`](apps/disclosure-rag/main.py) :: main() | [`main.py:1234`](apps/disclosure-rag/main.py#L1234) |
| `YT-CHAIN-03` | [`main.py`](apps/disclosure-rag/main.py) :: process_url() | [`main.py:354`](apps/disclosure-rag/main.py#L354) |
| `YT-CHAIN-04` | [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_youtube_url_enhanced() | [`lib/kb/knowledge_base_service.py:1169`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1169) |
| `YT-CHAIN-05` | KnowledgeBaseService :: process_youtube_with_enhanced_workflow() | [`lib/kb/knowledge_base_service.py:308`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L308) |
| `YT-CHAIN-06` | [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: generate_transcript() | [`lib/youtube.py:269`](apps/disclosure-rag/lib/youtube.py#L269) |
| `YT-CHAIN-07` | [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: get_video_info_and_transcript() | [`lib/youtube.py:135`](apps/disclosure-rag/lib/youtube.py#L135) |
| `YT-CHAIN-08` | [`youtube_transcript_enhanced.py`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py) :: get_video_info_and_transcript_enhanced() | [`lib/youtube_transcript_enhanced.py:536`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py#L536) |
| `YT-CHAIN-09` | [`youtube_transcript_enhanced.py`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py) :: get_metadata_and_transcript_api_first() | [`lib/youtube_transcript_enhanced.py:444`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py#L444) |
| `YT-CHAIN-10` | [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: analyze_content() | [`processing/content_analysis.py:269`](apps/disclosure-rag/processing/content_analysis.py#L269) |
| `YT-CHAIN-11` | [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: process_for_rag() | [`processing/content_analysis.py:319`](apps/disclosure-rag/processing/content_analysis.py#L319) |
| `YT-CHAIN-12` | [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: Phase 5, artifact writes | [`lib/youtube.py:348`](apps/disclosure-rag/lib/youtube.py#L348) |
| `YT-CHAIN-13` | [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) :: build_and_write_trace_map() | [`lib/youtube.py:394`](apps/disclosure-rag/lib/youtube.py#L394) |
| `YT-CHAIN-14` | KnowledgeBaseService :: Phase 6, the sinks | [`lib/kb/knowledge_base_service.py:420`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L420) |
| `YT-CHAIN-15` | [`upload.py`](apps/disclosure-rag/lib/openai_client/upload.py) :: upload_file_to_openai() | [`lib/openai_client/upload.py:54`](apps/disclosure-rag/lib/openai_client/upload.py#L54) |
| `YT-CHAIN-16` | [`main.py`](apps/disclosure-rag/main.py) :: trigger_cocoindex_processing() | [`main.py:485`](apps/disclosure-rag/main.py#L485) |
| `FILE-CHAIN-01` | [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm, file branch | [`main.sh:371`](apps/disclosure-rag/main.sh#L371) |
| `FILE-CHAIN-02` | [`main.py`](apps/disclosure-rag/main.py) :: main(), file arm | [`main.py:1370`](apps/disclosure-rag/main.py#L1370) |
| `FILE-CHAIN-03` | [`main.py`](apps/disclosure-rag/main.py) :: process_file() | [`main.py:574`](apps/disclosure-rag/main.py#L574) |
| `FILE-CHAIN-04` | [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: process_for_rag() | [`main.py:649`](apps/disclosure-rag/main.py#L649) |
| `FILE-CHAIN-05` | [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) :: build_and_write_trace_map() | [`main.py:693`](apps/disclosure-rag/main.py#L693) |
| `FILE-CHAIN-06` | [`main.py`](apps/disclosure-rag/main.py) :: process_file, the sinks | [`main.py:755`](apps/disclosure-rag/main.py#L755) |
| `WEB-CHAIN-01` | [`main.py`](apps/disclosure-rag/main.py) :: process_url(), web arm | [`main.py:382`](apps/disclosure-rag/main.py#L382) |
| `WEB-CHAIN-02` | [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_web_url_enhanced() | [`lib/kb/knowledge_base_service.py:1182`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1182) |

---

## YouTube chain

The full path a YouTube URL travels, from the shell dispatch to the final CocoIndex hop. Sixteen junctures; the longest of the three chains and the only one that ends in a knowledge-graph write.

### `YT-CHAIN-01` · [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm

**[`main.sh:357`](apps/disclosure-rag/main.sh#L357)**

Entry point for `dy <youtube-url>`. Matches http*, no `list=`, so it is a single video and routes straight to [`main.py`](apps/disclosure-rag/main.py).

NEXT → `YT-CHAIN-02`  [`main.py`](apps/disclosure-rag/main.py) :: main()

### `YT-CHAIN-02` · [`main.py`](apps/disclosure-rag/main.py) :: main()

**[`main.py:1234`](apps/disclosure-rag/main.py#L1234)**

CLI entry. Order matters here:

1. `parse_args()` — runs BEFORE any heavy import
2. `_import_heavy_dependencies()` — first OpenAI contact point (§A)
3. `_validate_credentials()` — hard-exits if `OPENAI_API_KEY` absent
4. `is_youtube_url()` — hostname parse, routes the input

PREV ← `YT-CHAIN-01`  [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm
NEXT → `YT-CHAIN-03`  [`main.py`](apps/disclosure-rag/main.py) :: process_url()

### `YT-CHAIN-03` · [`main.py`](apps/disclosure-rag/main.py) :: process_url()

**[`main.py:354`](apps/disclosure-rag/main.py#L354)**

Branch point. `is_youtube_url()` decides which extractor runs; everything below this is stage grading on whatever that extractor returned. Also owns the LAST hop of the chain — see `YT-CHAIN-16` (CocoIndex), which runs on the YouTube path only.

PREV ← `YT-CHAIN-02`  [`main.py`](apps/disclosure-rag/main.py) :: main()
NEXT → `YT-CHAIN-04`  [`lib/kb/knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_youtube_url_enhanced()

### `YT-CHAIN-04` · [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_youtube_url_enhanced()

**[`lib/kb/knowledge_base_service.py:1169`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1169)**

A one-line passthrough onto the module-level `kb_service` singleton. This is the name [`main.py`](apps/disclosure-rag/main.py) imports; the work is one hop down.

PREV ← `YT-CHAIN-03`  [`main.py`](apps/disclosure-rag/main.py) :: process_url()
NEXT → `YT-CHAIN-05`  KnowledgeBaseService :: process_youtube_with_enhanced_workflow()

### `YT-CHAIN-05` · KnowledgeBaseService :: process_youtube_with_enhanced_workflow()

**[`lib/kb/knowledge_base_service.py:308`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L308)**

The orchestrator. Two halves:

- Phase 3-5 (download → analysis → artifacts) is delegated wholesale to `generate_transcript()` and comes back as a file_paths dict.
- Phase 6 (the sinks) happens inline below: OpenAI upload, QStash queue, local KB write, Upstash search sync.

Its imports a few lines down pull in `generate_transcript`, the queue adapter, `upload_file_to_openai` (§A2 — constructs an OpenAI client at import time, unconditionally), and display.

PREV ← `YT-CHAIN-04`  process_youtube_url_enhanced()
NEXT → `YT-CHAIN-06`  [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: generate_transcript()
THEN → `YT-CHAIN-14`  (Phase 6 sinks, further down this same function)

### `YT-CHAIN-06` · [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: generate_transcript()

**[`lib/youtube.py:269`](apps/disclosure-rag/lib/youtube.py#L269)**

Does Phases 3, 4 and 5 of the chain in one function:

- Phase 3 (download) → `YT-CHAIN-07`  get_video_info_and_transcript()
- Phase 4 (analysis) → `YT-CHAIN-10`  analyze_content() [OpenRouter] → `YT-CHAIN-11`  process_for_rag() [OpenRouter]
- Phase 5 (artifacts) → `YT-CHAIN-12`  write_transcript_to_file() et al

NO LLM has been called until Phase 4. Returns a file_paths dict.

PREV ← `YT-CHAIN-05`  KnowledgeBaseService :: process_youtube_with_enhanced_workflow()
NEXT → `YT-CHAIN-07`  [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: get_video_info_and_transcript()

### `YT-CHAIN-07` · [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: get_video_info_and_transcript()

**[`lib/youtube.py:135`](apps/disclosure-rag/lib/youtube.py#L135)**

A thin wrapper. The yt-dlp path is gone — this is transcript-api only, so an ImportError here means no transcript at all, not a slower route.

PREV ← `YT-CHAIN-06`  generate_transcript()
NEXT → `YT-CHAIN-08`  [`lib/youtube_transcript_enhanced.py`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py) :: get_video_info_and_transcript_enhanced()

### `YT-CHAIN-08` · [`youtube_transcript_enhanced.py`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py) :: get_video_info_and_transcript_enhanced()

**[`lib/youtube_transcript_enhanced.py:536`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py#L536)**

Shape adapter. Reshapes the api-first result into the key names the older workflow expects (`id`/`title`/`transcript`/...).

PREV ← `YT-CHAIN-07`  [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: get_video_info_and_transcript()
NEXT → `YT-CHAIN-09`  get_metadata_and_transcript_api_first()

### `YT-CHAIN-09` · [`youtube_transcript_enhanced.py`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py) :: get_metadata_and_transcript_api_first()

**[`lib/youtube_transcript_enhanced.py:444`](apps/disclosure-rag/lib/youtube_transcript_enhanced.py#L444)**

THE DOWNLOAD. The only two network hops in Phase 3:

- hop 1 → `fetch_transcript_with_reason()` → `_fetch_once()` → YouTubeTranscriptApi
- hop 2 → `fetch_oembed_metadata()` → YouTube oEmbed endpoint

Transcript first, metadata second, deliberately: for a private or deleted video the oEmbed call is a guaranteed 403, and fetching it first buried the real explanation under a scary HTTP error.

PREV ← `YT-CHAIN-08`  get_video_info_and_transcript_enhanced()
NEXT → returns up the stack to `YT-CHAIN-06`, which now holds the raw transcript and proceeds to Phase 4 (`YT-CHAIN-10`)

### `YT-CHAIN-10` · [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: analyze_content()

**[`processing/content_analysis.py:269`](apps/disclosure-rag/processing/content_analysis.py#L269)**

LLM CALL #1 of 2. Produces the narrative analysis that becomes the body of Summary.txt back at `YT-CHAIN-12`.

Provider: [`lib/llm_fallback.py`](apps/disclosure-rag/lib/llm_fallback.py) `FRONTIER_FALLBACK_CHAIN`, tier 1 `openrouter/glm-5.2`. OpenRouter — correct, no OpenAI on this path.

PREV ← `YT-CHAIN-06`  [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: generate_transcript()
NEXT → `YT-CHAIN-11`  process_for_rag() (same caller, next statement)

### `YT-CHAIN-11` · [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: process_for_rag()

**[`processing/content_analysis.py:319`](apps/disclosure-rag/processing/content_analysis.py#L319)**

LLM CALL #2 of 2. classification → Evidence chunks → NER → embeddable_texts. Its output is what `YT-CHAIN-13`'s trace map anchors against, and what would be vectorized if anything vectorized it.

Provider: [`processing/rag_prompt_pipeline.py`](apps/disclosure-rag/processing/rag_prompt_pipeline.py) builds its own `self._llm = get_fallback(...)` — same [`lib/llm_fallback.py`](apps/disclosure-rag/lib/llm_fallback.py) chain. OpenRouter — correct, no OpenAI on this path.

PREV ← `YT-CHAIN-10`  analyze_content()
NEXT → `YT-CHAIN-12`  [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) Phase 5 artifact writes

### `YT-CHAIN-12` · [`lib/youtube.py`](apps/disclosure-rag/lib/youtube.py) :: Phase 5, artifact writes

**[`lib/youtube.py:348`](apps/disclosure-rag/lib/youtube.py#L348)**

All local file I/O, no network. In order:

- `write_transcript_to_file()` → the transcript
- `write_transcript_segments_to_file()` → timed sidecar (best-effort)
- `write_transcript_to_file()` again → Summary.txt, body = `analysis` from `YT-CHAIN-10`
- `json.dump()` → `*_rag_pipeline.json`

PREV ← `YT-CHAIN-11`  process_for_rag()
NEXT → `YT-CHAIN-13`  [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) :: build_and_write_trace_map()

### `YT-CHAIN-13` · [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) :: build_and_write_trace_map()

**[`lib/youtube.py:394`](apps/disclosure-rag/lib/youtube.py#L394)**

Needs the `YT-CHAIN-11` pipeline result AND the `YT-CHAIN-12` timed sidecar together — this function is the only place in the chain where both exist. That alignment is what turns an extracted claim back into a citable moment in the source. Definition: [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) (no chain marker at the definition).

PREV ← `YT-CHAIN-12`  Phase 5 artifact writes
NEXT → `YT-CHAIN-14`  [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) Phase 6 sinks (via return to `YT-CHAIN-06` → `YT-CHAIN-05`)

### `YT-CHAIN-14` · KnowledgeBaseService :: Phase 6, the sinks

**[`lib/kb/knowledge_base_service.py:420`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L420)**

Everything below is where the processed artifacts land. In order:

1. `upload_file_to_openai()` → `YT-CHAIN-15` (`--upload` only)
2. `add_processed_content_to_queue()` → [`lib/upstash/queue.py`](apps/disclosure-rag/lib/upstash/queue.py), QStash
3. `add_youtube_to_knowledge_base()` → [`lib/kb/knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) → index.json
4. `search_syncer.sync_document_to_search()` → Upstash Search

PREV ← `YT-CHAIN-13`  [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py)
NEXT → `YT-CHAIN-15`  [`lib/openai_client/upload.py`](apps/disclosure-rag/lib/openai_client/upload.py)
THEN → `YT-CHAIN-16`  [`main.py`](apps/disclosure-rag/main.py) :: trigger_cocoindex_processing()

### `YT-CHAIN-15` · [`upload.py`](apps/disclosure-rag/lib/openai_client/upload.py) :: upload_file_to_openai()

**[`lib/openai_client/upload.py:54`](apps/disclosure-rag/lib/openai_client/upload.py#L54)**

THE ONE LEGITIMATE OpenAI CALL ON THIS CHAIN. `files.create` + `vector_stores.files.create` — vector STORAGE only. It contains no embeddings call; OpenAI embeds server-side inside the vector store. Runs only under `--upload` (`YT-CHAIN-14` step 1). Contrast with YT-CHAIN-A4 immediately below, which is the embeddings call people expect to find here — and which is dead.

PREV ← `YT-CHAIN-14`  [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) Phase 6 sinks
NEXT → back to `YT-CHAIN-14` step 2 (QStash queue)

### `YT-CHAIN-16` · [`main.py`](apps/disclosure-rag/main.py) :: trigger_cocoindex_processing()

**[`main.py:485`](apps/disclosure-rag/main.py#L485)**

LAST hop of the chain. Runs on the YouTube path ONLY — the web path already ran CocoIndex internally inside its own workflow, and calling it again here fired a second global `cocoindex update` per web ingest.

PREV ← `YT-CHAIN-15` / `YT-CHAIN-14` (returned up through `YT-CHAIN-05`→`04`→`03`)
NEXT → end of chain; stage_report is assembled and `main()` sets the exit code from it.

---

## Local-file chain

What a local file does instead. Shares two nodes with the YouTube chain (`process_for_rag`, the trace map) and skips prose summarisation entirely.

### `FILE-CHAIN-01` · [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm, file branch

**[`main.sh:371`](apps/disclosure-rag/main.sh#L371)**

Entry point for `dy <path>`. Sibling of `YT-CHAIN-01` in the same case arm: that branch matches http*, this one matches an existing file on disk. Note the ordering — the http* tests run FIRST, so a local file whose name looks like a URL can never reach here.

NEXT → `FILE-CHAIN-02`  [`main.py`](apps/disclosure-rag/main.py) :: main(), file arm

### `FILE-CHAIN-02` · [`main.py`](apps/disclosure-rag/main.py) :: main(), file arm

**[`main.py:1370`](apps/disclosure-rag/main.py#L1370)**

The other half of this dispatch. Same function as `YT-CHAIN-02` — the split is this if/else, and it is the ONLY thing that decides which of the two chains a run follows. Everything upstream is shared.

PREV ← `FILE-CHAIN-01`  [`main.sh`](apps/disclosure-rag/main.sh) :: case fallback arm, file branch
NEXT → `FILE-CHAIN-03`  [`main.py`](apps/disclosure-rag/main.py) :: process_file()

### `FILE-CHAIN-03` · [`main.py`](apps/disclosure-rag/main.py) :: process_file()

**[`main.py:574`](apps/disclosure-rag/main.py#L574)**

The whole local-file ingest, in one function. Unlike the YouTube path — which fans out across [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) → [`youtube.py`](apps/disclosure-rag/lib/youtube.py) → transcript enhancers before it reaches analysis — this path has no extractor stack: it reads bytes, then goes straight to the shared analysis nodes.

That is why the chain is short. It is not a thinner pipeline; it is the same pipeline with nothing in front of it.

- Phase 1 (read) → PyPDF2 or utf-8 open(), inline below
- Phase 2 (RAG) → `FILE-CHAIN-04`  process_for_rag() [shared node]
- Phase 3 (provenance) → `FILE-CHAIN-05`  trace map [shared node]
- Phase 4 (sinks) → `FILE-CHAIN-06`  upload / queue / KB / mem0

PREV ← `FILE-CHAIN-02`  [`main.py`](apps/disclosure-rag/main.py) :: main()
NEXT → `FILE-CHAIN-04`  ContentAnalysisEngine :: process_for_rag()

### `FILE-CHAIN-04` · [`content_analysis.py`](apps/disclosure-rag/processing/content_analysis.py) :: process_for_rag()

**Call site [`main.py:649`](apps/disclosure-rag/main.py#L649)** · definition [`processing/content_analysis.py:319`](apps/disclosure-rag/processing/content_analysis.py#L319)

SHARED NODE — this is `YT-CHAIN-11`. Same function, same contract; documented there, not duplicated here.

The one difference that matters is the argument: `provenance` is the file path, where the YouTube path passes the watch URL. That string is what `FILE-CHAIN-05` anchors every claim back to, so it is the identity of the source for the whole rest of the chain.

Note what is NOT called here: `analyze_content()` / `YT-CHAIN-10`. The local-file path goes straight to the RAG pipeline. A file therefore gets chunks and NER but no prose summary — deliberate, since the summary exists to condense a transcript nobody will read in full.

PREV ← `FILE-CHAIN-03`  process_file()
NEXT → `FILE-CHAIN-05`  trace map, ~25 lines below

### `FILE-CHAIN-05` · [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) :: build_and_write_trace_map()

**Call site [`main.py:693`](apps/disclosure-rag/main.py#L693)** · definition [`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py)

SHARED NODE — this is `YT-CHAIN-13`. Same builder, one structural difference, and it is the reason this node is worth marking separately at all:

- YouTube passes `segments_path` — a timed sidecar — so its map anchors a claim to a MOMENT, and a citation can be played back.
- A file has no timing. This call omits `segments_path` entirely, so the builder anchors by character offset into the document and reports `timed: false`.

Both are citable. Only one is seekable. Anything downstream that assumes a timestamp exists must read that flag rather than the presence of the map.

PREV ← `FILE-CHAIN-04`  process_for_rag()
NEXT → `FILE-CHAIN-06`  the sinks, below

### `FILE-CHAIN-06` · [`main.py`](apps/disclosure-rag/main.py) :: process_file, the sinks

**[`main.py:755`](apps/disclosure-rag/main.py#L755)**

Where the processed artifacts land. Mirrors `YT-CHAIN-14`, with one asymmetry worth knowing before you compare the two paths:

1. `upload_file_to_openai()` → `YT-CHAIN-15` (`--upload` only). NOTE: uploads `file_path`, the ORIGINAL file. The YouTube path uploads a generated summary artifact instead, because there is no original document to send. Same sink, different payload.
2. `add_processed_content_to_queue()` → [`lib/upstash/queue.py`](apps/disclosure-rag/lib/upstash/queue.py), QStash
3. `add_to_knowledge_base()` → [`lib/kb/knowledge_base_crud.py`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py) → index.json
4. `add_file_content_memory()` → [`lib/mem0_integration.py`](apps/disclosure-rag/lib/mem0_integration.py)

No CocoIndex hop. `YT-CHAIN-16` runs on the YouTube path only; a local file never reaches it, so this chain ENDS here rather than returning up for one more stage.

PREV ← `FILE-CHAIN-05`  trace map
NEXT → end of chain; stage_report is assembled and `main()` sets the exit code from it.

---

## Web-article chain

A web article. Shares the first three junctures with the YouTube chain and diverges at the `is_youtube_url()` else-branch.

### `WEB-CHAIN-01` · [`main.py`](apps/disclosure-rag/main.py) :: process_url(), web arm

**[`main.py:382`](apps/disclosure-rag/main.py#L382)**

Third ingest path. Shares its whole prefix with the YouTube chain — [`main.sh`](apps/disclosure-rag/main.sh) (`YT-CHAIN-01`) → `main()` (`YT-CHAIN-02`) → `process_url()` (`YT-CHAIN-03`) — and diverges only at this else.

It is the THINNEST of the three paths, and the difference is not cosmetic. Compared against FILE-CHAIN and YT-CHAIN:

- `analyze_content()` YES — [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L642), ~line 642 (the shared node, `YT-CHAIN-10`)
- `process_for_rag()` NO — so a web article produces NO Evidence chunks, NO NER, NO embeddable_texts
- trace map NO — so a web article has NO provenance graph; nothing it asserts can be anchored back to a location in the source

Both absences are reported honestly downstream rather than papered over: the enrichment gate below grades the missing RAG pipeline, and `_trace_map_stage()` returns a `_skipped` for the missing map (see its docstring). A web ingest is therefore a SUMMARISED source, not a citable one — treat its output accordingly, and do not assume parity with the other two paths because the run printed green.

Closing this gap is T-056 (Trace Map on the web-article path).

PREV ← `YT-CHAIN-03`  [`main.py`](apps/disclosure-rag/main.py) :: process_url() (shared prefix)
NEXT → `WEB-CHAIN-02`  [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_web_url_enhanced()

### `WEB-CHAIN-02` · [`knowledge_base_service.py`](apps/disclosure-rag/lib/kb/knowledge_base_service.py) :: process_web_url_enhanced()

**[`lib/kb/knowledge_base_service.py:1182`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1182)**

A one-line passthrough onto the module-level `kb_service` singleton — the web mirror of `YT-CHAIN-04`. This is the name [`main.py`](apps/disclosure-rag/main.py) imports; the work is one hop down.

FIXED 2026-08-13 (found while tracing WEB-CHAIN): this call was `process_web_with_enhanced_workflow(url, upload)` — it accepted `add_to_kb` and then silently dropped it. The callee's parameter defaults to True and it really does gate its knowledge-base write on that flag, so `dy <web-url> --no-kb` wrote to the knowledge base anyway. The YouTube passthrough at `YT-CHAIN-04` forwards all three arguments correctly; only this path lost one.

PREV ← `WEB-CHAIN-01`  [`main.py`](apps/disclosure-rag/main.py) :: process_url(), web arm
NEXT → `WEB-CHAIN-03`  KnowledgeBaseService :: process_web_with_enhanced_workflow() — **dangling; see gaps**

---

## Gaps found while transcribing

- **`WEB-CHAIN-03` is a dangling reference.** [`lib/kb/knowledge_base_service.py:1196`](apps/disclosure-rag/lib/kb/knowledge_base_service.py#L1196) points `NEXT → WEB-CHAIN-03  KnowledgeBaseService :: process_web_with_enhanced_workflow()`, but no such block exists anywhere in the tree. The web chain's annotation stops at `WEB-CHAIN-02`; the hop it names was never marked up.

- **[`lib/trace_map.py`](apps/disclosure-rag/lib/trace_map.py) carries no markers of its own.** It is annotated twice from the call sites (`YT-CHAIN-13`, `FILE-CHAIN-05`) rather than at the definition.
