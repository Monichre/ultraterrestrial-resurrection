# Canvas — System Trace session (2026-05-31)

Reverse-engineering the live app end-to-end. We trace 2–3 user stories down the full stack,
citing real `file:line` at every hop, to build a trustworthy system map BEFORE any more decisions.

_Updated: 2026-05-31_

| # | Screen | What it shows |
|---|--------|---------------|
| 1 | legacy-flow-diagram.html | Imported July-2025 "Agent Hub → Xata" flow SVG (historical/unverified) + the pinned trace method + the 3 candidate stories |

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

**Next:** trace #1 first (pending Liam's pick / story swaps).

## Assets
- `xata-integration-flow-diagram.svg` — copied from `docs/agents/sessions/logs/` (original July-2025 location).
