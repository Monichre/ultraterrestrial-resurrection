# Story #2 trace — "Seed the board from a known record" (relational, no-AI path)

_Traced firsthand by Claude, 2026-06-08. Every hop cites real `file:line`. RESOURCE hops flagged **real vs aspirational**._
_Method: `UI → fn call → query layer → resource requested → RESOURCE → RESPONSE → (mods) → state → UI → result`._

**One-line verdict:** This is **the canonical board-seed**, and it's a **pure relational path with zero AI**. It is currently **fully dead at the RESOURCE hop (Xata)** but fails *gracefully* → the board loads **empty** (no crash). It also carries a live **`maxNodesPerType` wiring bug**: the bounded loader exists in the SDK but the app never calls it, so the page does an **unbounded full-corpus load** on every request.

> Reframing vs the original story sketch: the live "seed from known record" is not primarily an interactive click — it's the **server-component initial load** of `research-canvas/page.tsx`. The interactive "load more records from a table" exists too (`fetchNextMindmapRecords`) and is traced as a sub-path.

---

## Path A — initial board seed (the live one)

### 1. UI/UX — open the research canvas
- `app/(site)/research-canvas/page.tsx:14` — server component `Index()`, `export const dynamic = 'force-dynamic'` (`:12`) → runs on **every** request, no caching.

### 2. Function call — server-side data fetch
- `…/page.tsx:15` — `await getBoundedInitialGraphData({ maxNodesPerType: 30 })`
- `…/page.tsx:19` — result wrapped in `<StateOfDisclosureProvider stateOfDisclosure={data}>` → `<MindMap/>`.

### 3. Query layer — the action wrappers (where the bug lives)
- `features/mindmap/actions/get-entity-network-graph-data.ts:11` — app action `getBoundedInitialGraphData({maxNodesPerType=30})` → calls **`getEntityNetworkGraphData({maxNodesPerType} as any)`** (`:12`).
- `…/get-entity-network-graph-data.ts:5` — that wraps SDK **`getEntityNetworkGraphData`** from `@db/src/xata-typescript-sdk/api`.
- 🐛 **BUG:** SDK `getEntityNetworkGraphData` is `async () => {…}` (`xyflow-integration.ts:344`) — **takes no args**. The `{maxNodesPerType}` is silently dropped. The SDK *does* have a real bounded loader `getBoundedInitialGraphData(options)` (`xyflow-integration.ts:49`, honors `maxNodesPerType` via single `getPaginated({size})`), **but the app never imports it.** ⇒ the page runs the **unbounded** variant.

### 4. RESOURCE — Xata, full-corpus
- `xyflow-integration.ts:346–359` — `getEntityNetworkGraphData` calls `collectAllPaginatedRecords(getEventsWithPagination)` etc. (`collectAllPaginatedRecords` `:323`, `DEFAULT_PAGE_SIZE=100` `:321`, loops until `hasNextPage` false) for events/topics/testimonies, plus `getAllOrganizations/Personnel/Artifacts/Documents` and all **5 junction tables** (`:351–357`).
- All of these resolve to `xata.db.*` via `../client` (`xyflow-integration.ts:39 import { xata } from "../client"`).
- 🔴 **DEAD — Xata service is gone** (scratchpad: "Xata is DEAD DEAD"). Every `xata.db.*` call throws → caught at `:461` → returns the **empty `NetworkGraphPayload`** (`:463–499`).
- ✅ **Graceful failure:** unlike Story #1's `searchDatabase` (silent empty *inside a live agent*), this whole path degrades to an **empty board** with no exception surfaced to the user.
- ⚠️ **Perf cliff when restored:** because the unbounded variant runs (bug above), a working backend would pull ~2.3k entity rows + every junction row, **per request** (`force-dynamic`). The bounded loader the SDK already wrote is the fix.

### 5. RESPONSE — `NetworkGraphPayload`
Shape (`xyflow-integration.ts:298`): `{ records: {topics,events,personnel,testimonies,organizations,documents,artifacts}, connections: {5 junction result sets}, graphData: {nodes: GraphNode[], links: GraphEdge[]} }`.

### 6. Response modifications — record→node/edge transform (NO AI)
- `formatGraphNode({record, type})` (`xyflow-integration.ts:94–114`, `:371–394`) → `GraphNode{id, label, data:{name,label,type,...}}` (`:280`).
- `formatGraphEdge({id, sourceNode, targetNode})` (`:443`) → `GraphEdge{source,target,id}` (`:292`).
- **Junction → edge logic** (`:427–449`): each junction record is `{id, <srcType>:{id}, <dstType>:{id}}`; the **first two entries** (`:432–433`) become source/target. Edge **dropped** unless both endpoints exist in `nodeMap` (O(1), `:407`, `:442`). ⇒ this is exactly the "collapse 5 junctions into uniform edges" the scratchpad's unified `edges` model wants — it already happens here.

### 7. State layer — provider → context → Zustand store
- `contexts/state-of-disclosure-provider.tsx:45` — destructures `{records, connections, graphData: mindMapIntialGraphState}`; exposes via context (`:48`). `useStateOfDisclosure` (`:54`).
- `contexts/mindmap/mindmap-context.tsx:137` — `const {mindMapIntialGraphState} = useStateOfDisclosure()`.
- `…/mindmap-context.tsx:138` — `use3DGraph({mindMapIntialGraphState})` reshapes `graphData` into a per-model `graph3d` structure (`hooks/use3dGraph.tsx:47`).
- `…/mindmap-context.tsx:408` — **"FIRST STEP" effect**: for each model in `graph3d`, `nodes.map(createRootNodeChild)` + flatten `links.connectedTo` (`:414–422`) → `setGraph(formattedGraphNodesObject)` (`:430`). Only runs if `graph` empty (`:410`).
- Rendered nodes/edges live in the **Zustand `useMindMapStore`** (read in `graph.tsx:83`); `store.setNodes/ setEdges` are the write sink (`mindmap-context.tsx:91`). _(Same dual-store split flagged in Story #1: god-object context computes, Zustand store renders.)_
- Separate path: `restore()` (`:321`) rehydrates nodes/edges from `localStorage` — independent of the server seed.

### 8. UI/UX result
Empty today (Xata dead). With a live backend: the full entity network renders in React Flow from the Zustand store; root nodes per model + junction-derived edges.

---

## Path B — interactive "load more records from a table" (also dead)

### Flow
- Client (`mindmap-context.tsx:816`) → `fetch('/api/mindmap/records?...')`
- `app/api/mindmap/records/route.ts:4` `GET` — reads `table/size/offset/cursor/cache` searchParams (`:8–12`), sets Cache-Control (`:18`: `public,max-age=60,SWR=300`, or no-cache if `cache=no-cache|reload`), requires `table` (`:22`).
- `route.ts:29` → `fetchNextMindmapRecords({table,size,offset,cursor})`.
- `xyflow-integration.ts:206` `fetchNextMindmapRecords` → `xata.db[table].getPaginated({pagination:{size}})` (`:243`) → 🔴 **Xata, DEAD** → throws → route returns 500 (`route.ts:43`).
- Transform: `convertDatabaseRecordToMindMapNode(record)` + `type:"entityNode"`, `data.type = table` (`:253–262`). Returns `{nodes, meta:{cursor,more}}` — **cursor pagination contract** worth preserving.

---

## What this trace proves for the rebuild

1. **This is the cleanest rebuild target — pure relational, zero AI, zero vectors.** Restore two capabilities:
   - **Bounded initial network-graph load** → must return the exact `NetworkGraphPayload` shape (`xyflow-integration.ts:298`) the provider expects.
   - **Paginated per-table fetch** → must return `{nodes, meta:{cursor,more}}` (the `/api/mindmap/records` contract).
2. **The unified `edges` model is already validated here.** `formatGraphEdge` + the junction-collapse loop (`:427–449`) prove that flattening the 5 junction tables into one uniform edge list is natural and already implemented — port this logic to the new layer.
3. **Fix the `maxNodesPerType` wiring as part of the rebuild** — call a bounded loader (the SDK already wrote one at `:49`); don't ship the unbounded full-corpus-per-request behavior onto a fresh backend.
4. **Graceful-empty is the right failure mode** — preserve the `catch → empty payload` pattern (`:461`) so a backend outage yields an empty board, not a crash.
5. **The transform layer is `@db`-internal, not Xata-API-specific** — `formatGraphNode/Edge`, `convertDatabaseRecordToMindMapNode`, `collectAllPaginatedRecords` only need *records in*; swapping `xata.db.*.getPaginated` → pgvector/PG queries underneath leaves the transforms intact (same lesson as Story #1's `transformStreamResponse`).

## Open follow-ups (observations, not decisions)
- [ ] Decide the rebuilt query primitive: replace `xata.db[table].getPaginated` with a PG paginated reader keyed by table name (the `TABLE_NAME_MAP` singular/plural handling lives in `search-database.ts:5`, reuse it).
- [ ] `force-dynamic` + unbounded load = the page is uncacheable AND heavy. Rebuild should bound + allow caching.
- [ ] `key-figures` vs `personnel` sourcing (per scratchpad ID-normalization) affects `getAllPersonnel` here — confirm the rebuilt personnel reader pulls the photo-bearing rows.
