# Consolidated system map + rebuild seams

_Synthesis across all 3 firsthand story traces + the ingestion-reality-map. Claude, 2026-06-08._
_This is the comprehension payoff the pinned method was building toward ("decisions wait until all traces done" — now satisfied). It lists **seams and facts**, not decisions. Decisions resume after Liam reviews._

---

## The whole system in one table

| Path | Entry | Protocol | Corpus/data resource | Xata-coupled? | Status today |
|---|---|---|---|---|---|
| **#1 Mindmap agent** | `use-mindmap-agent.ts` → `/api/disclosure/mindmap` | OpenAI **Assistants** `runs.stream` + **custom SSE bridge** → React Flow graph | OpenAI vector store (`file_search`) + **Xata `searchDatabase`** + Exa | 🔴 yes (searchDatabase) | **half-live** — agent+Exa+graph-writes work; DB enrichment silently empty |
| **#2 Board seed** | `research-canvas/page.tsx` (server) | direct `@db` server action → provider → context → Zustand | **Xata** `getPaginated` (all entity + junction tables) | 🔴 yes (entire path) | **dead, fails gracefully** → empty board |
| **#3 Prometheus chat** | many chat surfaces → `/api/prometheus/chat` | Vercel **AI SDK `streamText`** + `toDataStreamResponse` → chat state | OpenAI vector store (`searchUAP`) + Exa + uploaded-file LLM tools | 🟢 **no** | **live** (only corpus hop = OpenAI store) |
| **Ingestion** (reality-map) | `disclosure-rag/main.py` (manual, per-URL) | Python CLI → OpenAI `vector_stores.files.create` | OpenAI vector store (server-side chunk/embed) | n/a | live but manual; "Triple/Quinuple RAG" = dead/myth |

---

## The three resource pillars (what actually backs the app)

1. **OpenAI vector store** `vs_meWOEnUiUxtQWf0W6NBsNpCG` — backs #1 (`file_search`), #3 (`searchUAP`), and is what ingestion feeds. **Persists** (Responses API), but **every consumer calls it through the deprecating Assistants API** (`openai.beta.threads.*` + `assistant_id`). Env: `OPENAI_ASSISTANT_ID`, `OPENAI_VECTOR_STORE_ID` (same in both AI routes).
2. **Xata (relational + full-text)** — backed #1's `searchDatabase` and **all** of #2. 🔴 **DEAD service.** #2 degrades to empty board; #1's DB enrichment degrades to empty results.
3. **Exa** — external enrichment in all 3 AI surfaces (#1 `searchExternalResources`, #3 `searchExternalResources` + `researchExternalTopic`). ✅ Live, env `EXA_API_KEY`. Not our data — never the rebuild target.

---

## Myths killed by the traces (confirms scratchpad, now with file:line)

- ❌ **Triple/Quinuple RAG** — every live path uses at most: OpenAI vector store + Xata(dead) + Exa. No FAISS/Upstash/CocoIndex anywhere on the live Next.js paths (#1/#2/#3). Matches ingestion-reality-map.
- ❌ **"The board is GraphRAG over our corpus"** — currently the board (#1) is drawn from the **LLM's own `addGraphNodes/addGraphEdges` calls + Exa**, because `searchDatabase` (the corpus hop) returns empty. The data-grounded graph is **aspirational right now**.
- ❌ **Graph writes persist** — #1's `addGraphNodes/addGraphEdges` are normalize-and-echo only; nothing is stored. Extracted edges do not accumulate.

---

## Rebuild seams — the integration contracts to preserve

The repeated lesson across all three traces: **transforms are resource-agnostic; only the query primitive is Xata-specific.** Swap the primitive, keep the shape, and the consumers don't move.

1. **`searchDatabase` contract** (Story #1) — return `{records:[…]}`, each record carrying `xataReasoning{score, relevancyLevel, explanation}` (`search-database.ts:112`). Rebuild = TS server fn hitting pgvector+FTS+entity filters, same output shape. The hook (`use-mindmap-agent.ts:258`) + `transformStreamResponse` are already Xata-free and survive untouched.
2. **`NetworkGraphPayload` contract** (Story #2) — `{records, connections, graphData:{nodes,links}}` (`xyflow-integration.ts:298`). The provider, `use3DGraph`, and the context "FIRST STEP" effect all consume this shape. Rebuild a bounded loader returning it. (And **call a bounded loader** — fix the `maxNodesPerType` wiring bug.)
3. **`/api/mindmap/records` contract** (Story #2 Path B) — `{nodes, meta:{cursor,more}}`, cursor/offset pagination. Rebuild = PG paginated reader keyed by table name (reuse `TABLE_NAME_MAP`, `search-database.ts:5`).
4. **`searchUAP` contract** (Story #3) — `{query, results[], totalResults}`. The natural insertion point for an **owned-pgvector** retrieval tool; keep the shape so chat clients don't change.
5. **Unified edges already implemented** (Story #2) — `formatGraphEdge` + the junction-collapse loop (`xyflow-integration.ts:427-449`) flatten the 5 junction tables into one uniform edge list. This **is** the scratchpad's `edges` model in working code; port it.
6. **`buildAgentContext`** — the ONE seam shared by both AI paths (#1 route + #3 route). Any future protocol consolidation pivots on it.

---

## Two migrations, independent — do not conflate

- **Migration A — data layer (the scratchpad's main thread):** Xata → owned Postgres+pgvector. Touches #1's `searchDatabase`, **all** of #2. Restores contracts 1–3 + 5 above. This is the greenfield-from-CSV rebuild.
- **Migration B — OpenAI Assistants → Responses API:** cross-cutting, touches #1's route (`runs.stream`) and #3's `searchUAP`. Independent of the data rebuild; the vector store itself survives either way. Track separately.

> Sequencing implication: **Migration A unblocks the board's data-grounding** (the visible win — board fills from our corpus again). Migration B is hardening (de-risk the deprecating surface). They can proceed in parallel; A is higher user-visible value.

---

## Defects surfaced (flag for AI/frontend-hardening thread, not the data rebuild)
- `maxNodesPerType` ignored → unbounded full-corpus load per request on `force-dynamic` page (Story #2).
- Dual-store split: reads from Zustand `useMindMapStore`, writes via `useMindMap` god-object context (Stories #1 & #2).
- `searchUAP` blocking 1s poll loop (Story #3, `:505`).
- `researchExternalTopic` polls up to 300s under `maxDuration=60` → can't complete (Story #3, `:676` vs `:434`).

---

## Suggested next decisions (now unblocked)
1. Confirm `OPENAI_VECTOR_STORE_ID` still points at the live store (delta-audit parked task).
2. Lock the rebuilt-`searchDatabase` design against contract #1 (pgvector+FTS, keep `{records, xataReasoning}`).
3. Re-examine the suspect locked spec (commit `a0b948b`) against these traces — especially id-normalization/crosswalk vs the `formatGraphEdge` junction model, which already works on `rec_*` ids.
