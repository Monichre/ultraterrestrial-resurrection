# Canvas — System Trace session (2026-05-31)

Reverse-engineering the live app end-to-end. We trace 2–3 user stories down the full stack,
citing real `file:line` at every hop, to build a trustworthy system map BEFORE any more decisions.

_Updated: 2026-05-31_

| # | Screen | What it shows |
|---|--------|---------------|
| 1 | legacy-flow-diagram.html | Imported July-2025 "Agent Hub → Xata" flow SVG (historical/unverified) + the pinned trace method + the 3 candidate stories |
| 2 | ingestion-reality-map.html | **Firsthand** disclosure-rag ingestion audit (2026-06-01): reality-ranked tiers (live / disconnected / ghost / myth), the hardcoded-Upstash-token security flag, and the chunking correction. RESOURCE-layer truth for the rebuild. |
| 3 | story-1-ask-the-board.md | **DONE (2026-06-08)** — full firsthand trace of Story #1 (mindmap agent path), every hop `file:line`. Verdict: **half-live** — OpenAI agent + Exa + agent-authored graph writes work; **Xata `searchDatabase` is DEAD** (silently returns empty); whole path runs on the **deprecating Assistants API** (`beta.threads.*`). Names the `searchDatabase` `{records, xataReasoning}` output shape as the rebuild integration contract. |
| 4 | story-2-seed-from-record.md | **DONE (2026-06-08)** — full firsthand trace of Story #2 (canonical board seed, **pure relational, no AI**). Verdict: **fully dead at Xata but fails gracefully → empty board**. Two contracts to rebuild: `NetworkGraphPayload` (initial network-graph load) + `{nodes, meta:{cursor,more}}` (`/api/mindmap/records` pagination). Found live **`maxNodesPerType` wiring bug** (unbounded full-corpus load per request). Confirms junction-tables→unified-edges is already implemented (`formatGraphEdge`). |
| 5 | story-3-prometheus-chat.md | **DONE (2026-06-08)** — full firsthand trace of Story #3 (Prometheus chat, Vercel AI SDK `streamText` + tools → **chat state, not the board**). Verdict: **least coupled — ZERO Xata/@db, fully survives Xata's death**. Only corpus grounding = `searchUAP` → same OpenAI vector store on the deprecating Assistants API as #1. Confirms the Assistants→Responses migration is **cross-cutting (both AI paths)**, unified only by shared `buildAgentContext`. Defects: `searchUAP` blocking poll; `researchExternalTopic` 300s poll under 60s maxDuration. |

**Viewer:** `viewer.html` — self-contained themed wrapper that renders the fragments over HTTP (`python3 -m http.server` in this dir, then open `/viewer.html`). Companion-server-free way to "take a look."

## Pinned trace method
```
UI/UX → function call → query layer → resource requested → RESOURCE → RESPONSE
   → (response modifications) → state layer → UI/UX → result
```
Cite real `file:line` per hop; flag **real vs aspirational** at RESOURCE. Decisions wait until all traces done.

## Candidate stories (confirmed-pending)
1. **Ask the board a question** — `use-mindmap-agent.ts` → `/api/disclosure/mindmap/route.ts` → OpenAI Assistants + `searchDatabase`(Xata) + `searchExternalResources`(Exa) → SSE → `transformStreamResponse` → nodes/edges → Zustand → React Flow. *(vector RAG + DB + external + streaming + graph transform + state)*
2. **Seed the board from a known record** — timeline/sighting / `?type=events` → canvas-entry bridge → `use-mindmap.ts` + data helpers → `@db` read/filter → record→node → board. *(plain relational CRUD/filter, no AI)*
3. **Prometheus chat** — `/api/prometheus/chat` (Vercel AI SDK `streamText`) → tools (`searchUAP`, `searchExternalResources`, `researchExternalTopic`, `processDocument`) → streamed answer → chat state. *(tool-calling RAG)*

**Status:** ✅ **ALL 3 STORIES TRACED + SYNTHESIZED (2026-06-08).** Comprehension phase complete. → **`SYNTHESIS-system-map.md`** = the whole-system table, the 3 resource pillars, myths-killed-with-file:line, the 6 rebuild-seam contracts, and the two-independent-migrations framing (data layer vs Assistants→Responses). **Next:** Liam reviews synthesis → resume spec decisions (revisit suspect locked spec `a0b948b`).

## Assets
- `xata-integration-flow-diagram.svg` — copied from `docs/agents/sessions/logs/` (original July-2025 location).
