# Story #1 trace — "Ask the board a question" (mindmap agent path)

_Traced firsthand by Claude, 2026-06-08. Every hop cites real `file:line`. RESOURCE hops flagged **real vs aspirational**._
_Method: `UI → fn call → query layer → resource requested → RESOURCE → RESPONSE → (mods) → state → UI → result`._

**One-line verdict:** The path is **half-live**. The OpenAI agent loop + Exa external search + agent-authored graph writes work today; the **Xata `searchDatabase` enrichment hop is DEAD** (service gone) and silently returns nothing; the whole agent runs on the **deprecating OpenAI Assistants API surface** (`beta.threads.*`).

---

## Hop-by-hop

### 1. UI/UX — user submits a question
- `features/mindmap/graph.tsx:406` — input submit → `runAgentQueryAndAddNodes({message: input})`
- `features/mindmap/graph.tsx:328` — alt trigger (timeline) → same fn with `table:'events'`
- `features/mindmap/graph.tsx:152` — `runAgentQueryAndAddNodes` def. Creates a user-input source node (`:154 addUserInputNode`), labels it (`:159`), then calls the hook.

### 2. Function call — the client hook
- `features/mindmap/hooks/use-mindmap-agent.ts:157` — `runAgentQuery({message, contextRules, researchFocus, graphState, threadId})`
- `…/use-mindmap-agent.ts:172` — `fetch('/api/disclosure/mindmap', {method:'POST', body: {threadId, message, contextRules, researchFocus, graphState}})`
- `…/use-mindmap-agent.ts:193` — opens a streaming reader on the response body.

### 3. Query layer — the route
- `app/api/disclosure/mindmap/route.ts:61` — `POST` handler.
- `…/route.ts:70` — `buildAgentContext(...)` → injects contextRules/researchFocus/graphState into `additional_instructions`.
- `…/route.ts:80` — `openai.beta.threads.create({tool_resources:{file_search:{vector_store_ids:[PROMETHEUS_VECTOR_STORE_ID]}}})` (only if no `threadId`).
- `…/route.ts:89` — posts the user message to the thread.
- `…/route.ts:103` — `openai.beta.threads.runs.stream(threadId, {tools:[…], assistant_id: PROMETHEUS_ASSISTANT_ID, additional_instructions})`. Five tools registered: `file_search` (built-in), `searchDatabase`, `searchExternalResources`, `addGraphNodes`, `addGraphEdges` (`:106–235`).
- `…/route.ts:266` — tool loop: while `requires_action` → run each tool → `submitToolOutputsStream` (`:641`) → repeat.

### 4. RESOURCE layer — what each tool actually hits

| Tool | Code | Resource | Reality |
|---|---|---|---|
| **OpenAI agent** | `route.ts:103` `openai.beta.threads.runs.stream`; client `lib/openai/client.ts:4` | OpenAI **Assistants API** (`beta.threads`) + vector store via `file_search` | ⚠️ **REAL today, on a deprecating surface.** The vector store `vs_…` itself persists (Responses API `file_search`), but this code is written against `beta.threads`/`assistant_id` — the Assistants wrapper that is sunsetting. Functionally live, architecturally on borrowed time. IDs are env-driven: `services/ai/openai/config.ts:2` (`OPENAI_ASSISTANT_ID`), `:16` (`OPENAI_VECTOR_STORE_ID`). Empty-string default → `route.ts:259` throws "ASSISTANT_ID environment is not set" if unset. |
| **searchDatabase** | `route.ts:366` → `services/ai/openai/tools/search-database.ts:60` `xata.search.all(...)` | **Xata** (`@db/xata/client`) | 🔴 **DEAD.** Xata service is gone (scratchpad: "Xata is DEAD DEAD"). The `try` (`search-database.ts:52`) throws → `catch` (`:131`) falls back to `searchXata` (`:137`) which is **also Xata** → also throws → returns `records.flat()` of nothing. Net at runtime: **the DB-enrichment hop yields empty/error.** This is the single biggest break in the live path. |
| **searchExternalResources** | `route.ts:398` `exaClient.searchAndContents(...)` | **Exa** (`exa-js`, `EXA_API_KEY`) | ✅ **REAL.** Independent of Xata/OpenAI-store. Returns `{title,url,text,score}` (`:405`). |
| **addGraphNodes** | `route.ts:429–517` | none (server-side normalize only) | ✅ **REAL but not persisted.** Just validates/normalizes the agent's node payload and echoes it back over SSE. No DB write. Default node type `enhancedEntityNodePOC` (`:446`). |
| **addGraphEdges** | `route.ts:518–617` | none | ✅ **REAL but not persisted.** Same: normalize + echo. Default edge type `siblingEdge` (`:555`), synthesizes stable edge id (`:541`). |

> **Key insight:** the graph the user sees is authored **by the LLM** (addGraphNodes/addGraphEdges) + (when Xata lived) DB records. With Xata dead, the board is now drawn *almost entirely from the model's own tool calls + Exa*, not from the relational corpus. The "GraphRAG from our data" story is currently **agent-imagined, not data-grounded** on this path.

### 5. RESPONSE — SSE bridge
- `services/ai/openai/sse.ts:12` `createSSEBridge` (TransformStream).
- `sse.ts:26` `forwardStream` → model text deltas emitted as `data: {content}`.
- `sse.ts:21` `sendDataMessage` → tool lifecycle as `data: {data:{tool,status,result|parameters}}` (statuses: processing/complete/error throughout `route.ts`).
- `route.ts:650` `writeSSE({done:true})` ends the stream.

### 6. Response modifications — client parse
- `use-mindmap-agent.ts:210–318` — read loop, split on `\n`, parse `data: …` JSON.
- `:234` accumulate `parsed.content` → `analysis`.
- `:258` searchDatabase `complete` → `searchResult.records`.
- `:285` searchExternalResources `complete` → `externalResult.results`.
- `:303` addGraphNodes `complete` → `toGraphNodes` (`:98`).
- `:307` addGraphEdges `complete` → `toGraphEdges` (`:125`).
- `:322–332` dedupe nodes (by id) + edges (by id/source:target:label).
- Returns `AgentRunResult{analysis, toolEvents, search, external, graphWrites}` (`:334`).

### 7. State layer — merge into the graph
Back in `graph.tsx:168`, **two node sources** merge:
- **(a) agent graphWrites** (`graph.tsx:185–256`) → normalized → `addNodes` (`:221`) / `addEdges` (`:259`). Edges dropped if endpoints unknown (`:238`).
- **(b) searchRecords** (`graph.tsx:269`) → `transformStreamResponse` (`actions/xata-to-xyflow.ts:759` → `transformForReactflow:183`): one `enhancedEntityNode` per record + `smoothstep` edge to source (`:301–321`), then `organizeNodeLayout` (`:398`). **Currently produces nothing** — searchRecords is empty (Xata dead).
- Writes go through the **`useMindMap` context** `addNodes`/`addEdges` (`graph.tsx:88–96`), while the rendered `nodes/edges` are **read from Zustand `useMindMapStore()`** (`graph.tsx:83`). ⚠️ **Dual-store split worth flagging** — read path and write path are different stores.

> Note: `transformStreamResponse` (the live transform) is **Xata-free** — it only shapes records already in hand. The Xata-coupled exports in the same file (`fetchRecords:20`, `askAIAction:77`, `xataToXYFlow:522`) are **dead** and not on this path. Good news for the rebuild: the client transform survives Xata's death untouched.

### 8. UI/UX result
- `graph.tsx:172` source node updated with `{answer, entities, table}`.
- `graph.tsx:295` `fitView({padding:0.2})` after 200ms.
- `graph.tsx:487,516` `agentAnalysis={analysis}` surfaced to toolbar/panels.
- React Flow re-renders from Zustand store.

---

## What this trace proves for the rebuild

1. **The "Quinuple/Triple RAG" myth is confirmed dead here too.** This path has exactly: OpenAI vector `file_search` + Xata full-text (now dead) + Exa. Nothing else.
2. **Xata removal already silently degrades the live agent** — `searchDatabase` returns empty, so the board loses all relational grounding. The rebuilt pgvector + relational layer must **restore `searchDatabase`'s contract** (`{records:[…]}` with relevance reasoning) — that's the seam.
3. **`searchDatabase`'s output shape is the integration contract** to preserve: array of records, each enriched with `xataReasoning{score, relevancyLevel, explanation}` (`search-database.ts:112–124`). The rebuild can drop Xata internals but should keep this *shape* so the hook (`use-mindmap-agent.ts:258`) and `transformStreamResponse` keep working.
4. **The Assistants-API dependency is a second, independent migration** from the data layer — the route must eventually move `beta.threads.*` → Responses API. Track separately from the pgvector rebuild.
5. **Graph writes are ephemeral** (never persisted). If the rebuild wants the extracted GraphRAG edges to *accumulate*, that persistence does not exist yet on this path.

## Open follow-ups (not decisions — observations)
- [ ] Confirm `OPENAI_VECTOR_STORE_ID` env still points at the live `vs_meWOEnUiUxtQWf0W6NBsNpCG`.
- [ ] Decide whether rebuilt `searchDatabase` is a TS server fn hitting pgvector+FTS, keeping the `{records, xataReasoning}` shape.
- [ ] Dual-store split (`useMindMapStore` read vs `useMindMap` context write) — is this intentional or a latent bug? (out of scope for the data rebuild; flag for the frontend-hardening thread.)
