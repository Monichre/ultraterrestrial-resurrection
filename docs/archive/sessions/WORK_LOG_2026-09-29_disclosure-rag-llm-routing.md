# Work Log — disclosure-rag LLM routing, provider parity, per-stage model eval

- **Date/Time:** 2026-09-28 to 2026-09-29, written 2026-09-29 12:12 CDT
- **Session ID:** integration-20260929-121220
- **Focus Area:** integration (LLM providers and routing for disclosure-rag ingestion)
- **Primary Agent:** Claude Code (Opus 5.5), session `4d7c10b6-51c9-4cb5-9564-ef52120c5346`
- **Delegated Agents:** stage-inventory, eval-chunking, eval-longcontext, eval-orchestration, eval-ocr (all read-only research; each wrote one report)
- **Branch:** `dev`
- **Session Commit:** the commit that adds this log (disclosure-rag paths plus [`packages/ai/prompts/llm_routing.yaml`](packages/ai/prompts/llm_routing.yaml) and [`apps/app/src/lib/ai/model-fallback.ts`](apps/app/src/lib/ai/model-fallback.ts))
- **Overall State:** routing works live. The per-stage model assignment is proposed and not wired; it waits on user approval.

## Executive Summary

The session started with entity-resolution work (T-048), then moved to LLM providers.
- Merge Gateway (GLM-5.3 and GLM-5.3 Flash) was added to the routing chain and probed live.
- Dead LLM call sites across disclosure-rag were ported to the router:
  - pre-1.0 `openai.ChatCompletion`;
  - the sunset Assistants API in unified search;
  - a Mem0 setup that failed on every run.
- The user then pointed out there was no parity between [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml), [`packages/ai/prompts/llm_routing.yaml`](packages/ai/prompts/llm_routing.yaml), [`apps/disclosure-rag/lib/llm_router.py`](apps/disclosure-rag/lib/llm_router.py) and [`apps/disclosure-rag/lib/llm_fallback.py`](apps/disclosure-rag/lib/llm_fallback.py). The config was restructured:
  - `platforms.yaml` became the provider registry;
  - the routing YAML now references providers by key and dedupes its chains with anchors;
  - the router validates the join at load time.

The user then set a binding rule: **model selection belongs to the agent or process file that uses it, never to a general default config.** The provider pool exists to spread credit usage across the paid platforms. Five subagents evaluated models per ingestion stage, and the result is [`apps/disclosure-rag/docs/model-eval-2026-09-29/00-synthesis.md`](apps/disclosure-rag/docs/model-eval-2026-09-29/00-synthesis.md). It is not wired yet.

## Accomplishments (with proof)

| Change | Proof |
|---|---|
| Merge tiers `merge/glm-5.3` and `merge/glm-5.3-flash` added | Live probe: both 200; strict schema returned `{"city":"Roswell","ok":true}` |
| Routed call after the rewrite | `task_id=validation served_by= openai/gpt-6-astra text= ok` |
| Router loads both YAML files and validates the join | `Tiers: 21 declared, 14 with credentials`. The default chain starts `openai/gpt-6-astra` and contains no retired models |
| `research_manager` / `research_queue_manager` moved off pre-1.0 `openai.ChatCompletion` onto task `research_assist` | `served_by= openai/gpt-6-astra` |
| Transcript fidelity review routed through `coherence_review` | `served_by= openai/gpt-6-astra` |
| Mem0 moved to hosted `MemoryClient` (it had raised `'dict' object has no attribute 'embedder'` on every run) | Probe add, search and delete worked, and the probe memories were cleaned up |
| Unified search `_search_openai` moved from the Assistants API to `vector_stores.search` | 3 hits, top `UFOsandIntelligence.pdf 0.823` |
| `ContentAnalysisEngine` moved to task `narrative_summary`; 6 dead methods and 4 unused SDK clients removed | Module imports |
| Entity extraction agent now passes `task_id="entity_extraction"` (Codex review P2) | Compiles; chain head `openai/gpt-6-astra` |
| Legacy model ids bumped (claude-3/4, gpt-4o/4.1/5 → `claude-opus-5-5`, `gpt-6-astra`, `gpt-6-luna`); chat scripts moved to `max_completion_tokens` | gpt-6-astra answered `'ok'` |
| Next app chain (user-requested): Merge tiers added to [`apps/app/src/lib/ai/model-fallback.ts`](apps/app/src/lib/ai/model-fallback.ts) | Smoke test served by `merge/glm-5.3`. Prometheus chat in a browser is UNVERIFIED |
| Per-stage model eval: 5 reports plus a synthesis | [`apps/disclosure-rag/docs/model-eval-2026-09-29/`](apps/disclosure-rag/docs/model-eval-2026-09-29/) |

## Files

**Created**
- [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml): provider registry (base_url + key env var only).
- [`apps/disclosure-rag/docs/model-eval-2026-09-29/`](apps/disclosure-rag/docs/model-eval-2026-09-29/): `00-synthesis.md` plus reports 01–05.
- [`apps/disclosure-rag/scripts/merge_entities.py`](apps/disclosure-rag/scripts/merge_entities.py): entity-resolution merge script (T-048).

**Modified**
- Routing core: [`packages/ai/prompts/llm_routing.yaml`](packages/ai/prompts/llm_routing.yaml), [`apps/disclosure-rag/lib/llm_router.py`](apps/disclosure-rag/lib/llm_router.py), [`apps/disclosure-rag/lib/llm_fallback.py`](apps/disclosure-rag/lib/llm_fallback.py).
- Call sites:
  - `lib/`: `research_manager.py`, `research_queue_manager.py`, `transcript_fidelity.py`, `mem0_integration.py`, `unified_rag_orchestrator.py`, `onenode_integration.py`.
  - `processing/`: `content_analysis.py`, `enhanced_content_analysis.py`.
  - top level: `activate_agno.py`, `disclosure_chat.py`, `disclosure_chat_with_memory.py`.
  - `agents/`: `*.py`, model-id bumps plus the `entity_extraction` task_id.
- Entity resolution (T-048):
  - `lib/entity_resolution/store.py` and `mentions.py`
  - `lib/connectors/ultraterrestrial_db.py`: embeddings pinned to text-embedding-3-small @1536
  - `scripts/backfill_location_embeddings.py`
  - `tests/test_entity_resolution.py`
  - `docs/ENTITY_RESOLUTION_STATUS_2026-09-27.md`
- Docs: [`apps/disclosure-rag/docs/CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md), provider line for YT-CHAIN-10.
- Next app: [`apps/app/src/lib/ai/model-fallback.ts`](apps/app/src/lib/ai/model-fallback.ts).
- Env files: `MERGE_GATEWAY_API_KEY` appended to both. They are gitignored and not committed.

**Excluded from the commit (not this session's):** the deletions of `apps/disclosure-rag/AGNO_INTEGRATION_ROADMAP.md`, `AGNO_NEXT_ACTIONS.md` and `AGNO_ROADMAP.md`, plus everything outside the paths above.

## Decisions and user rules recorded

1. **Model selection is scoped to the agent/process.** No global default chain picks models; `platforms.yaml` is the shared provider pool. Saved to memory as `model-selection-scoped-to-agent`.
2. **God's Eye View and Temporal Observatory are parts donors** being cannibalized into apps/app. They are not runnable apps; the Codex P1 asking for a manifest was dismissed. Saved to memory.
3. Jev/Laya for entity matching stays pinned and not started.
4. disclosure-rag is this session's area. apps/app work goes to the peer session "Review spacetime canvas feature progress".

## Known open issues

- `llm_routing.yaml` still has a global `defaults.chain`, and all tasks share one chain. That breaks rule 1, and it is what the approved per-stage wiring removes.
- `FRONTIER_FALLBACK_CHAIN` still exists in `llm_fallback.py` and serves calls that pass no task_id. `scripts/benchmark_pipeline.py` imports it.
- `RAG_PIPELINE_PROVIDER` / `prefer_provider` are not yet passed through to the routed chain.
- Per-tier `reasoning_headroom_tokens` and task `max_tokens`/`temperature` are loaded but not applied; `llm_fallback` still uses the 4096 constant.
- **Pre-existing:** `agents/__init__.py` fails to import because `agno.storage.sqlite` is missing (the import is also in HEAD), so the whole `agents` package is unimportable.
- **Found by the inventory:**
  - NER and validation only cover the first 8 chunks.
  - Scanned PDFs yield empty text (no OCR).
  - Web image analysis never sends the image.
  - The CALL_CHAIN web-path entry is wrong.
- `agents/disclosure_assistant.py` and `agents/content_analysis_agent.py` still use the sunset Assistants API.
- The disclosure-rag pytest suite has 3 collection errors (FileNotFoundError). They predate this session.

## Next action

The user approves or edits [`00-synthesis.md`](apps/disclosure-rag/docs/model-eval-2026-09-29/00-synthesis.md). Then:
1. Fix the `agents/` import.
2. Move each stage's model picks into that stage's own file.
3. Delete `defaults.chain` and `FRONTIER_FALLBACK_CHAIN`.

About 45–60 minutes.
