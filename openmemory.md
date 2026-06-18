# OpenMemory Guide — ultraterrestrial-resurrection

Living project index. Updated: 2025-01-24.

## Overview

Monorepo: `apps/app` (Next.js 15 + React 19), `apps/disclosure-rag` (Python, disconnected).
Primary database: Neon Postgres 17.10 + pgvector via `@db/postgres`. `@db/xata` is retired (SP3).
Auth: Clerk (middleware not yet implemented — all API routes are public).

## Architecture

### Canonical AI Routes (T-016 — settled)

| Route | Purpose | Protocol | Status |
|---|---|---|---|
| `/api/disclosure/mindmap` | Graph canvas agent | OpenAI Assistants API + custom SSE bridge | **PRIMARY — KEEP** |
| `/api/prometheus/chat` | Standalone chat | Vercel AI SDK `streamText` | **PRIMARY — KEEP** |
| `/api/disclosure/chat` | Legacy mindmap chat panels | OpenAI Assistants API + SSE | **LEGACY — has 6 active consumers, do not delete until migrated** |
| `/api/historical-query` | Historical graph queries | — | **DEAD STUB — returns 501, Xata dependency retired** |

### `/api/disclosure/chat` Active Consumers (must migrate before deleting)
- `features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu.tsx`
- `features/mindmap/components/launchpad/launchpad.tsx`
- `features/mindmap/components/menus/canvas-menu/CanvasMenu.tsx`
- `components/ui/chat/chat-with-context.tsx`
- `features/mindmap/components/menus/mindmap-bottom-menu/smart-bottom-menu.tsx`
- `features/mindmap/components/menus/mindmap-ai-chat.tsx`

### `/api/chat` (does not exist as a route file)
Referenced by `useBackendChat.ts`, `assistant.tsx` (ai-app-assistant), `prometheus-animated-chat.tsx`
— all three files have zero UI consumers themselves, so the broken reference is harmless but dead.

### Dead historical-query chain
`mindmap-bottom-menu.tsx` imports `historicalQueryAgent` →
`historical-query-agent.ts` (imports `@db/xata/client` — retired) →
`historical-query-server-actions.ts` (calls `askXataWithAi` — retired) →
`/api/historical-query` (returns 501)

Full chain to delete when ready: `historical-query-agent.ts`, `historical-query-server-actions.ts`,
`research-runtime.ts`, `tour-state-agent.ts`, `/api/historical-query/route.ts`

## User Defined Namespaces

- **ai-routes** — API route architecture, AI tool definitions, SSE bridges
- **mindmap** — mindmap graph feature, nodes, edges, canvas, ViewSwitcher
- **database** — Postgres layer, migrations, query patterns

## Components

### API Routes (`apps/app/src/app/api/`)

- **`disclosure/mindmap/route.ts`** — PRIMARY graph canvas agent. OpenAI Assistants + SSE. Tools: file_search, searchDatabase (Postgres FTS + pgvector), searchExternalResources (Exa), addGraphNodes, addGraphEdges. Client: `useMindMapAgent`.
- **`prometheus/chat/route.ts`** — PRIMARY standalone chat. Vercel AI SDK streamText. Tools: searchUAP, searchExternalResources (Exa), researchExternalTopic, processDocument (6 actions).
- **`disclosure/chat/route.ts`** — LEGACY chat route. Same protocol as mindmap but older/simpler tool set. Has 6 active UI consumers. TODO T-016: migrate consumers then delete.
- **`historical-query/route.ts`** — DEAD STUB. Returns 501. Was backed by `askXataWithAi` (retired Xata SDK). Delete with full consumer chain.

## Patterns

- **SSE bridge pattern**: `createSSEBridge()` + `forwardStream()` + `sendDataMessage()` + `writeSSE()` + `close()` — used in both `disclosure/mindmap` and `disclosure/chat`. Shared utility: `@/services/ai/openai/sse`.
- **Graph canvas agent tool loop**: `runStream` → `forwardStream` → while `requires_action` → process tools → `submitToolOutputsStream` → repeat.
- **Agent context**: `buildAgentContext()` from `@/services/ai/context/build-agent-context` — shared by both primary routes, constructs prompt from graphState + contextRules + researchFocus.
- **Embedding**: `embedQuery()` (inline in both primary routes) — `text-embedding-3-small` @ 1536 dims. Falls through to FTS-only on error.

## T-016 Completion Notes (2025-01-24)

Files modified (no deletions — `/api/disclosure/chat` has active consumers):
1. `apps/app/src/app/api/disclosure/mindmap/route.ts` — added PRIMARY comment block
2. `apps/app/src/app/api/prometheus/chat/route.ts` — added PRIMARY comment block
3. `apps/app/src/app/api/disclosure/chat/route.ts` — added LEGACY comment block + consumer list + TODO
4. `apps/app/src/app/api/historical-query/route.ts` — added DEAD STUB comment block + full delete checklist
5. `apps/app/src/services/ai/prometheus/lib/tools.ts` — corrected stale `@see` pointer from `disclosure/chat` to both primary routes

No `route-demo.ts` or `demo.ts` files found anywhere in `apps/app/src/app/api/`.
No `apps/app/src/app/api/chat/` directory exists.
