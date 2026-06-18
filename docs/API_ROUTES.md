# API Routes

Last updated: 2026-06-17

> **Active AI paths:** Only two end-to-end AI paths exist in the Next.js app:
> 1. `/api/disclosure/mindmap` — Assistants API + SSE (graph canvas)
> 2. `/api/prometheus/chat` — Vercel AI SDK streamText (standalone chat)

---

## Route Reference

| Path | Method(s) | Auth Required | Purpose |
|------|-----------|---------------|---------|
| `/api/disclosure/mindmap` | POST | No (gap — no middleware) | **PRIMARY AI agent** — OpenAI Assistants API + custom SSE bridge. Graph canvas agent. Tools: `file_search`, `searchDatabase` (Postgres FTS/trgm), `searchExternalResources` (Exa), `addGraphNodes`, `addGraphEdges`. Client: `useMindMapAgent` hook. |
| `/api/prometheus/chat` | POST | No (gap — no middleware) | **PRIMARY chat** — Vercel AI SDK `streamText`. Standalone conversational chat. Tools: `searchUAP`, `searchExternalResources` (Exa), `researchExternalTopic`, `processDocument`. Model: gpt-4-turbo. |
| `/api/disclosure/chat` | POST | No (gap — no middleware) | **LEGACY** — OpenAI Assistants API + SSE bridge for standalone chat panels (mindmap-bottom-menu, launchpad, CanvasMenu, smart-bottom-menu). TODO T-016: evaluate migrating consumers to `/api/disclosure/mindmap` or `/api/prometheus/chat`. Do NOT delete until consumers are migrated. |
| `/api/disclosure/uap-sightings` | GET | Yes (`x-api-key` header — `INTERNAL_API_KEY`) | UAP sightings data by year range. Params: `startYear`, `endYear`, `limit`, `stats`. Batches automatically for ranges > 10 years. |
| `/api/mindmap/records` | GET | No | Paginated Postgres record fetch via `@db/postgres`. Params: `table` (required), `size` (default 10), `offset` (default 0), `cache`. Zod-validated. |
| `/api/historical-query` | POST | No | **STUB — returns 501.** Historical graph query (chronological, tour-waypoint, contextual-expansion). Not yet ported to Postgres. |
| `/api/admin/rag-settings` | GET, POST | No (TODO — auth missing) | In-memory RAG mode settings (local/remote URL, API key). GET omits API key from response. POST validates mode. |
| `/api/admin/test-ranking-system` | GET, POST | No | **STUB — returns 501.** Ranking system not yet ported to Postgres. |
| `/api/admin/trigger-ranking-update` | POST | Yes (Bearer token — `dev_admin_token`) | Manually trigger personnel ranking calculation via `calculatePersonnelRanking()`. Basic Bearer auth (dev only). |
| `/api/cron/update-rankings` | GET | No (CRON_SECRET check commented out) | Vercel cron job — runs `calculatePersonnelRanking()` and updates database. Auth check is present but commented out. |
| `/api/documents` | GET | No | Full-text search over Upstash Search index. Params: `q` (required), `limit`, `type`, `tags`. |
| `/api/documents/browse` | GET | No | Browse/paginate all documents in Upstash Search index. Params: `page`, `limit`, `type`, `sort`, `order`. |
| `/api/documents/[id]` | GET | No | Fetch single document by ID from Upstash Search index. Returns 404 if not found. |
| `/api/processing/scrape` | POST | No | Single-URL scrape via FireCrawl, or deep research request. Zod-validated. Supports `BasicScrapeSchema` and `DeepResearchSchema`. |
| `/api/processing/scrape/batch` | POST | No | Batch URL processing via FireCrawl against `EXTERNAL_RESOURCES` list. Params: `resourceCount` (max 50), `useDeepResearch`, `researchDepth`, `categories`, `customUrls`, etc. |
| `/api/processing/status` | GET | No | Upstash Redis queue status — returns queue size and timestamp. |
| `/api/processing/testimony` | POST | No | Queue a testimony for async processing via Upstash Redis. Zod-validated with title, claims, personnel, events, organizations. |
| `/api/sightings/realtime` | POST | No | Batched sightings data by time ranges. Body: `{ timeRanges, limit, includeCoordinates, sortBy, sortOrder }`. |
| `/api/client-logs` | POST | No | Browser error logging via `@browser-echo/next`. Re-exports from the package's route handler. |
| `/api/sse/test` | GET | No | SSE test endpoint — streams `{ time }` events every 1 second. Development/debug only. |
| `/api/sse/xata/ask` | GET | No | **LEGACY** — SSE connection endpoint using `@db/xata` (retired). Establishes SSE stream from Xata ask API. Do not use — `@db/xata` is retired. |
| `/api/sse/xata/ask/send` | POST | No | **LEGACY** — Broadcasts messages to all SSE clients connected via `/api/sse/xata/ask`. Uses shared `clients` store. |
| `/api/webhooks/xata` | POST | Yes (Svix signature — `CLERK_WEBHOOK_SECRET`) | **LEGACY** — Clerk webhook handler that syncs user events (`user.created`, `user.updated`, `user.deleted`, etc.) to Xata. `@db/xata` is retired; this route still imports `@db/xata/client`. |

---

## Notes

### Auth Status
No Clerk middleware is implemented. All routes are currently publicly accessible unless they perform their own auth checks (noted in the table above). See AGENTS.md: "No auth middleware exists — all API routes are publicly accessible (critical security gap)."

### Active vs Legacy
- **Active / working**: `disclosure/mindmap`, `prometheus/chat`, `mindmap/records`, `disclosure/uap-sightings`, `sightings/realtime`, `processing/*`, `documents/*`, `client-logs`, `admin/trigger-ranking-update`, `cron/update-rankings`
- **Legacy (do not extend)**: `disclosure/chat` (awaiting T-016 migration), `sse/xata/ask`, `sse/xata/ask/send`, `webhooks/xata` (all import `@db/xata` which is retired)
- **Stubs (501)**: `historical-query`, `admin/test-ranking-system`
- **Debug only**: `sse/test`

### Database layer
All active routes use `@db/postgres` (`packages/db/src/postgres/`). Routes referencing `@db/xata` or `getXataClient` are legacy and should not be extended.
