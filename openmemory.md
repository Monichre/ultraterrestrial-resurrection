# OpenMemory Guide — Ultraterrestrial Resurrection

**Last Updated:** 2026-09-13T06:40:00Z

## Overview

Monorepo UAP research platform: Next.js app (`apps/app`), disconnected Python RAG (`apps/disclosure-rag`), Neon Postgres + pgvector (`@db/postgres`), shared AI prompts (`packages/ai/prompts`).

## Architecture

- Live AI paths: disclosure mindmap agent (`/api/disclosure/mindmap`), Prometheus chat (`/api/prometheus/chat`).
- Prompt registry: `packages/ai/prompts/registry.yaml` → `sets/disclosure/*` + `templates/*`.
- Epistemics: Claim (source) ≠ Inference (agent) ≠ Evidence (source-derived). ADR-0001: never retrieve `agent_inferences` as Evidence.

## User Defined Namespaces

- [Leave blank - user populates]

## Components

- **Prompt corpus** — `packages/ai/prompts/`: YAML registry, disclosure NER/content analysis v2, RAG templates (`document_classification`, `rag_ingestion`, `rag_grounded_answer`, `validation`).
- **Methodology** — `packages/ai/prompts/methodology/`: research frameworks + `RAG_DOCUMENT_PROCESSING.md`, `NER_EXTRACTION_PROTOCOL.md`.
- **disclosure-rag pipeline** — `apps/disclosure-rag/processing/rag_prompt_pipeline.py` wired into `ContentAnalysisEngine`, `web_content_processor`, `knowledge_base_service`, `youtube.py`, `main.py`. Prompt loader resolves `packages/ai/prompts` (not legacy `packages/prompts`).
- **Writers Desk notes** — `apps/app/src/components/writers-desk/`: `NoteApp` (cream filing tabs), `NoteLetter` / `NoteWidget` (dark stacked sheets), `PaperSurface` + tiled stocks in `public/textures/paper/`. Routes: `/note`, `/research`. Theme tokens in `globals.css` `@theme` (`note-*`, `canvas*`, `ink*`, `shadow-sheet*`).
- **Vintage dossier docs** — `apps/app/src/components/design-system/research-ui/documents/`: `VintageDocumentCard`, `PersonnelFileCard`, `IncidentReportCard` refined with manila paper textures, clipped corner, bracketed stamps (`vintage-document.css`).
- **Home hero sequence** — Production `/` mounts `HomeAnimated` + `useUltraterrestrialAnimation` per `ANIMATION_SEQUENCE.md` (flashes→orbs→Prometheus/Earth/Moon→title/quote/nav). Do **not** replace with a shortened stars→Earth-only timeline. `CINEMATIC_TIMING` is the timing source of truth.

## Patterns

### T-048 H1 identity + playlist triage — 2026-09-13T06:40:00Z

- **H1 (identity) landed** in `639fe522`. The archive index writers were the defect, not the data: [apps/disclosure-rag/lib/kb/knowledge_base_service.py](apps/disclosure-rag/lib/kb/knowledge_base_service.py) hand-built `kb_crud.index["documents"][doc_id]` and called `_save_index()` directly — no lock, no `content_hash`, absolute `path`. That one block is why 580 of 581 records carried no hash. Both writers now route through `KnowledgeBaseCRUD.put_index_entry()`, partial updates through `patch_index_entry()`. Result: **141 of 581 records hashed, all digests distinct; 0 absolute paths (was 10)**.
- **md5 is the archive's identity of record — do not "upgrade" it to sha256.** `doc_id` *is* `md5(content)[:12]` and `_generate_dir_name` embeds `doc_id[:8]` in every directory on disk, so switching re-keys 581 records and renames the archive, and adding sha256 alongside mints the second hash identity the 2026-08-13 audit banned. The sha256 column in [apps/disclosure-rag/lib/storage/pgvector_library.py](apps/disclosure-rag/lib/storage/pgvector_library.py) has **zero importers** and conflicts with the live `documents` table — dead code, not a precedent. Hash input stays raw content, never normalized text.
- **`UNIQUE(content_hash)` is blocked, not deferred.** **417 of 581 index records point at a directory another record also claims** — 112 shared directories, 276 distinct paths for 581 records; 31 `case_file` records all have `path: "sources/files"`, the tree root. Those were left `null` rather than filled with a neighbour's digest. Two consequences: `delete_document()` on any of the 31 would `shutil.rmtree()` the whole files tree, and relativizing the 10 absolute paths dropped distinct paths 285 → 276, meaning those 10 YouTube records duplicated records already indexed.
- **`doc_id` is not reproducible from disk for historical records** — 82 of 83 checkable records fail `md5(content_file)[:12] == doc_id`. Ingest hashed an in-memory string that is not byte-identical to what landed on disk. **Do not reverse-engineer the historical derivation; there is no payoff.**
- **Playlist triage — 100 of 104 videos are recoverable, and the two failure classes need different fixes.** [apps/disclosure-rag/corpus/intake/playlist_ingestion/state.json](apps/disclosure-rag/corpus/intake/playlist_ingestion/state.json): **51 `deferred_blocked`** are a 2026-08-07 YouTube IP block misrecorded as `no_transcript`, captions confirmed available — these need only a re-run, no LLM. **49 `enrichment_failed`** have transcripts on disk that passed fidelity (e.g. 0.923) but `*_rag_pipeline.json` says `status=error` with 0 chunks / 0 NER / 0 embeddings — these are blocked on a working completions chain, not on retrieval. **4 `unavailable`** are private videos, genuinely dead. Zero succeeded.
- **`AI_GATEWAY_API_KEY` and `VERCEL_AI_GATEWAY_API_KEY` are both present in `.env`, and nothing reads them** — neither [packages/ai/prompts/llm_routing.yaml](packages/ai/prompts/llm_routing.yaml) nor [apps/disclosure-rag/lib/llm_fallback.py](apps/disclosure-rag/lib/llm_fallback.py) references a gateway tier. Liam's standing constraint is gateway-only routing for cost reasons (two Pro subscriptions already paid; no raw first-party API spend), with OpenAI-direct retained only as a reachability floor. Credential liveness was **not** probed this session — no completion calls were spent.
- **Path-case trap:** the tracked file is `docs/PLANS/TODO.md` (uppercase). `docs/plans/TODO.md` resolves on this case-insensitive macOS filesystem but `git` will not match it — `git add docs/plans/TODO.md` fails with "did not match any file(s) known to git". Links in docs that spell it lowercase still open in Cursor; git commands must use `docs/PLANS/`.

### Corpus inventory — 2026-09-13T02:42:07Z

- Liam highlighted the 28.9 GiB ingestion backlog in [apps/disclosure-rag/corpus/](apps/disclosure-rag/corpus/). Read-only filesystem inventory: 15,247 regular files, 30,984,934,161 logical bytes; 14,367 PDFs (12.119 decimal GB), 108 MP4s (9.906 GB), five ZIPs (8.276 GB). ZIP/extracted duplication and already-ingested overlap were not checked.
- [apps/disclosure-rag/corpus/intake/index.json](apps/disclosure-rag/corpus/intake/index.json) is zero bytes. [apps/disclosure-rag/corpus/intake/playlist_ingestion/state.json](apps/disclosure-rag/corpus/intake/playlist_ingestion/state.json) has 104 videos: 49 enrichment_failed, four unavailable, 51 deferred_blocked.
- September 10 notes in [docs/plans/TODO.md](docs/plans/TODO.md) identify the existing separate Neon promotion writer at [packages/db/scripts/rebuild/ingest.py](packages/db/scripts/rebuild/ingest.py). Do not repeat the claim that a new writer must be built. This session did not run ingestion, hash deduplication, database checks, or app retrieval tests. `graft` was unavailable on PATH.

### Research follow-up — 2026-09-12T17:22:06Z

- Liam asked to prioritize an existing simple, popular agent messaging solution before designing a custom relay. Quick research favors [hcom](https://github.com/aannoo/hcom) for terminal simplicity: one Rust binary, hooks, local SQLite, messaging and idle wakeups; launched as `hcom claude` / `hcom codex`. README lists Cursor CLI but no native Devin adapter; generic participation exists, automatic Devin receipt remains unverified.
- GitHub pages observed: hcom 487 stars; [Agent Relay](https://github.com/AgentWorkforce/relay) 822; [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail) about 2,100. These measure repository interest, not installed usage. Recommendation revised to evaluate hcom first; no install or messaging test performed.

### Session highlight — 2026-09-12T17:16:01Z

- Liam uses Warp and Cursor and wants nimble real-time messaging between Codex, Claude, and Devin in this repo. Local executables for all three are installed; `codex queue --help` exposes addressed session messages and `devin acp --help` exposes an ACP stdio server.
- Recommendation under discussion: one local mailbox shared through MCP, with native session notification adapters where supported. MCP Agent Mail is an existing candidate with inboxes, threads, acknowledgements, and advisory file reservations. Mailbox delivery does not itself wake an idle agent; local Devin session injection remains unverified. No relay installed or messages sent.

- Span-grounded NER with optional `span_quote` / `evidentiary_state`; KeyFigure maps to wire `PERSONNEL`.
- RAG chunk bodies are Evidence-only; grounded answers require passage citations and labeled Counter-readings.
- Ingestion writes `*_rag_pipeline.json` and exposes `embeddable_texts` for vector backends.
- Embeddings locked: `text-embedding-3-small` @ 1536 dims.
