# Xata Migration Audit

> Scope of the database-layer overhaul required to replace Xata.
> Goal: isolate the **AI / vector "sugar"** surface (the hard lift) from the
> **plain CRUD / query** surface (the easy lift), so the replacement platform
> can be chosen on the basis of what actually has to be re-implemented.

_Branch: `claude/database-z-jet-audit-XHnL6` · Generated 2026-05-30_

---

## TL;DR

- **~107 files** reference Xata across the repo.
- **The lion's share is trivial CRUD** (`read`, `getAll`, `getPaginated`,
  `create`, `update`, `delete`, `filter`, `select`, `sort`) — these port 1:1 to
  any Postgres client (Drizzle, Prisma, Kysely, raw SQL).
- **The real lift is the AI sugar built on `table.ask(...)`** — Xata's
  auto-vectorization + RAG layer. This is **not** a feature of vanilla Postgres
  and must be **rebuilt** (pgvector + embeddings + an LLM call), not just
  re-wired. It's small in line count but high in design effort.
- A **second-tier lift** is full-text search (`table.search(...)`,
  `xata.search.all(...)`) and aggregations (`aggregate`, `summarize`) — these
  have direct SQL/extension equivalents but need real query rewrites.
- 🔴 **Security:** a live Xata API key is hardcoded in
  `src/app/api/internal/export/route.ts:64`. Rotate it regardless of migration.

---

## Xata API surface, ranked by migration difficulty

| Tier | Xata API | Approx. call sites | Replacement strategy | Effort |
|------|----------|-------------------|----------------------|--------|
| 🟢 Easy | `read`, `getAll`, `getPaginated`, `getFirst`, `create`, `update`, `delete`, `filter`, `select`, `sort` | 200+ | Direct ORM/SQL equivalents | Mechanical |
| 🟡 Medium | `aggregate`, `summarize` | ~24 | SQL `GROUP BY` / window funcs | Per-query rewrite |
| 🟡 Medium | `search` (per-table FTS), `xata.search.all` (platform-wide) | ~17 | Postgres FTS (`tsvector`) or a search service | Rewrite + ranking tuning |
| 🔴 Hard | `ask` (RAG over auto-vectorized records) | 4 core + wrappers | pgvector + embeddings pipeline + LLM call | **Rebuild** |
| 🟡 Medium | `transformImage` (Xata image proxy) | 1 | `next/image` / Cloudinary / imgproxy | Isolated swap |

> Note: raw `.filter()`/`.create()` counts are inflated by JS `Array.prototype`
> calls of the same name; the directional point — CRUD dominates and is easy —
> holds.

---

## 🔴 The hard part: `table.ask()` and everything built on it

Xata's `.ask()` is a managed RAG endpoint: it semantically searches the
auto-vectorized table, feeds matched rows to an LLM, and returns
`{ answer, sessionId, records }`. **No drop-in equivalent exists** in plain
Postgres — replacing it means standing up our own retrieval+generation stack.

### Central wrapper
- **`src/db/xata/db/search-operations.ts:254` — `askXataWithAi()`**
  The single chokepoint. Calls `xata.db[table].ask(question, { searchType, rules, search })`,
  then re-reads the returned record IDs. **Everything below funnels through here.**

### Consumers (this is the blast radius)
- **Agent chat → mind map (highest concern):**
  - `src/features/mindmap/actions/xata-to-xyflow.ts:23,193` — `askAIAction()` /
    `xataToXYFlow()`: takes the `.ask()` answer + records and transforms them
    into React Flow nodes/edges dropped onto the map. **This is the feature you
    flagged.**
  - `src/features/mindmap/actions/actions.ts:41` — `askDatabase()` server action.
  - `src/app/api/sse/xata/ask/route.ts:117` — SSE streaming endpoint that streams
    `.ask()` results to the client (`text/event-stream`).
  - `src/app/api/disclosure/chat/route.ts` — chat route wiring `searchDatabase` +
    `xataToXYFlow` into the agent loop.
- **Workflows / knowledge layer:**
  - `src/services/ai/workflows/prompt-to-multistep.workflow.ts:110-124` — multiple
    `askXataWithAi()` calls per step.
  - `src/services/knowledge-layer/process-resource.ts:148` — dedup/"does it exist"
    check via `.ask()`.
- **Misc / scaffold:**
  - `src/app/api/disclosure/data-layer/ask/route.ts`, `src/app/api/test-xata/route.ts`
    (template/test endpoints).

### What a replacement requires
1. **Embeddings pipeline** — embed the same columns Xata vectorized
   (per-table column weights already encoded in
   `search-operations.ts:186` `targetsPerTable`), stored in a `pgvector` column.
2. **Retrieval** — vector similarity (`<=>`) + optional keyword hybrid.
3. **Generation** — feed retrieved rows to an LLM with the existing `rules`
   prompts, return `{ answer, records }` in the **same shape** so
   `transformForReactflow` and the SSE route don't have to change.
4. Keeping the return contract identical lets us swap the **inside** of
   `askXataWithAi()` and leave the map/chat consumers untouched.

---

## 🟡 Full-text search layer

- `executeDatabaseTableQuery()` — `search-operations.ts:241` — per-table
  `.search()` with weighted targets + highlight/score post-processing
  (`processResults`).
- `executePlatformWideConnectionSearch()` — `search-operations.ts:58` —
  `xata.search.all()` across linked tables to discover connections; powers
  `/api/disclosure/data-layer/search/connections` and `.../enrich`.
- `searchXataConnections()` — `mindmap/actions/actions.ts:54`.
- `sightings-time-chunk.ts` — multiple `xata.db.sightings.search("*", …)` calls
  for geo/time windowing.
- **Migration:** Postgres FTS (`to_tsvector`/`ts_rank`) covers most of this; the
  highlight + weighted-target + cross-table ranking behavior needs deliberate
  re-implementation to preserve result quality.

## 🟡 Aggregations

- `src/services/ranking/personnel-ranking.service.ts:167-203` — 5× `aggregate`
  (the personnel ranking feature).
- `src/services/sightings/get-sightings.ts`, `get-events.ts`,
  `actions/events-time-chunk.ts`, `actions/sightings-time-chunk.ts`,
  `data-viz/.../useTimeSeriesVisualization.tsx` (`summarize`).
- `src/app/api/admin/test-ranking-system/route.ts` — `summarize` + `aggregate`.
- `src/app/api/disclosure/data-layer/aggregate/route.ts` — generic passthrough.
- **Migration:** straight `GROUP BY` / `count`/`sum` SQL. Mechanical but per-call.

## 🟢 CRUD / query (the easy bulk)

Spread across `src/app/(site)/**` pages (timeline, history, explore, gallery),
`src/services/**`, `src/features/mindmap/actions/fetch-next-mindmap-records.ts`
(`getPaginated`), processing/import scripts, and the `cli/` app. All of it is
`read`/`getAll`/`create`/`update`/`delete`/`filter` — direct ORM equivalents.

## 🟡 Image transform (isolated)

- `src/app/(site)/history/gallery/page.tsx:84` — `transformImage()` from
  `@xata.io/client`. Swap for `next/image` or an image CDN.

---

## Infra, client & config to retire

- **Generated client / schema:** `src/db/xata/xata.ts`, `.xatarc`,
  `src/db/xata/client.ts`, barrel `src/db/xata/index.ts`, types in
  `src/types/xata-extensions.d.ts`.
- **Dependency:** `@xata.io/client@^0.30.1` (`package.json:88`); `xata` in
  `cli/package.json`.
- **Cloudflare worker:** `src/services/cloudflare/worker.ts` instantiates
  `new XataClient(...)` from env (`XATA_API_KEY/BRANCH/DATABASE_URL`).
- **CLI:** `cli/src/lib/xata-client.ts`, `cli/src/config.ts` (note the hardcoded
  default `databaseURL`).
- **Import/seed scripts:** `scripts/data-import/**` (`import-events-to-xata.ts`,
  `import-*-to-xata.ts`, etc.) and the `import:events` / `import:sightings`
  package scripts — rewrite against the new store as part of data migration.
- **Backup/export routes:** `src/app/api/disclosure/data-layer/backup/route.ts`,
  `src/app/api/internal/export/route.ts` shell out to the Xata CLI.

---

## 🔴 Security finding (act now, independent of migration)

- `src/app/api/internal/export/route.ts:64` — **hardcoded live API key**
  (`xau_…`). Rotate immediately and move to env. (PR #44 addresses hardcoded
  auth tokens but verify it covers this exact line.)
- `cli/src/config.ts:80` — hardcoded default database URL (workspace slug
  leak — lower severity, still scrub).

---

## Recommended sequencing

1. **Rotate the leaked key** (decouple from everything else).
2. **Abstract behind the existing chokepoints** — keep `askXataWithAi`,
   `executeDatabaseTableQuery`, `executePlatformWideConnectionSearch`,
   `fetchNextMindmapRecords` as the seams. Migrate their internals; leave
   consumers' call signatures intact.
3. **Port CRUD** to the chosen ORM (largest volume, lowest risk).
4. **Rebuild FTS + aggregations** against the new store.
5. **Rebuild `.ask()` RAG last** — the only net-new system — reusing the
   `targetsPerTable` column weights as the embedding/retrieval config.

### Platform-choice implication
Because `.ask()` must be rebuilt regardless, the decision hinges on **how much
of the RAG stack the candidate gives back for free**: a plain Postgres + manual
pgvector path means we own embeddings/retrieval/generation; a platform with
built-in vector + AI search recovers some of Xata's original ergonomics. That
trade-off — not the CRUD port — is what should drive the selection.
