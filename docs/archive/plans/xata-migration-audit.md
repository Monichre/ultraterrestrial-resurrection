# Xata Migration Audit

> **Provenance / reconciliation note (Claude, 2026-05-30):** captured from branch
> `claude/database-z-jet-audit-XHnL6` (commit `8ebb980`). That branch is **not merged** —
> its only artifact was this doc; the knowledge was lifted here to live with the rest of the
> data-architecture design, and the branch is left untouched on origin.
>
> **⚠️ Coordinates are stale.** The audit forked from pre-monorepo April-2025 `main`. Verified
> against current `dev`:
> - Paths shown as `src/...` are really `apps/app/src/...`.
> - `search-operations.ts` no longer exists by that name — the seam is now `askXata` in `packages/db`.
> - The flagged hardcoded key and `app/api/internal/export/route.ts` are **not present on dev** —
>   re-verify it was actually rotated, don't assume.
> - **Two AI retrieval paths coexist on dev** (Xata `.ask()` via `xata-to-xyflow.ts` AND OpenAI
>   `file_search` in the disclosure routes); this audit only saw the `.ask()` path. Ground-truth
>   which one is live before scoping the rebuild.
>
> Findings are directionally correct; remap coordinates before trusting any file:line.

---

> Scope of the database-layer overhaul required to replace Xata.
> Goal: isolate the **AI / vector "sugar"** surface (the hard lift) from the
> **plain CRUD / query** surface (the easy lift), so the replacement platform
> can be chosen on the basis of what actually has to be re-implemented.

## TL;DR

- **~107 files** reference Xata across the repo.
- **The lion's share is trivial CRUD** (`read`, `getAll`, `getPaginated`, `create`,
  `update`, `delete`, `filter`, `select`, `sort`) — these port 1:1 to any Postgres
  client (Drizzle, Prisma, Kysely, raw SQL).
- **The real lift is the AI sugar built on `table.ask(...)`** — Xata's auto-vectorization
  + RAG layer. This is **not** a feature of vanilla Postgres and must be **rebuilt**
  (pgvector + embeddings + an LLM call), not just re-wired. Small in line count, high in
  design effort.
- A **second-tier lift** is full-text search (`table.search(...)`, `xata.search.all(...)`)
  and aggregations (`aggregate`, `summarize`) — direct SQL/extension equivalents but real
  query rewrites.
- 🔴 **Security:** a live Xata API key was hardcoded in `internal/export/route.ts`. Rotate
  regardless of migration. (Re-verify on dev — see reconciliation note.)

## Xata API surface, ranked by migration difficulty

| Tier | Xata API | Approx. call sites | Replacement strategy | Effort |
|------|----------|-------------------|----------------------|--------|
| 🟢 Easy | `read`, `getAll`, `getPaginated`, `getFirst`, `create`, `update`, `delete`, `filter`, `select`, `sort` | 200+ | Direct ORM/SQL equivalents | Mechanical |
| 🟡 Medium | `aggregate`, `summarize` | ~24 | SQL `GROUP BY` / window funcs | Per-query rewrite |
| 🟡 Medium | `search` (per-table FTS), `xata.search.all` (platform-wide) | ~17 | Postgres FTS (`tsvector`) or a search service | Rewrite + ranking tuning |
| 🔴 Hard | `ask` (RAG over auto-vectorized records) | 4 core + wrappers | pgvector + embeddings pipeline + LLM call | **Rebuild** |
| 🟡 Medium | `transformImage` (Xata image proxy) | 1 | `next/image` / Cloudinary / imgproxy | Isolated swap |

> Note: raw `.filter()`/`.create()` counts are inflated by JS `Array.prototype` calls of the
> same name; the directional point — CRUD dominates and is easy — holds.

## 🔴 The hard part: `table.ask()` and everything built on it

Xata's `.ask()` is a managed RAG endpoint: it semantically searches the auto-vectorized
table, feeds matched rows to an LLM, and returns `{ answer, sessionId, records }`. **No
drop-in equivalent exists** in plain Postgres — replacing it means standing up our own
retrieval+generation stack.

### Central wrapper
- **`askXataWithAi()`** (was `src/db/xata/db/search-operations.ts:254`; remap on dev) — the
  single chokepoint. Calls `xata.db[table].ask(question, { searchType, rules, search })`, then
  re-reads the returned record IDs. **Everything below funnels through here.**

### Consumers (the blast radius)
- **Agent chat → mind map (highest concern):**
  - `mindmap/actions/xata-to-xyflow.ts` — `askAIAction()` / `xataToXYFlow()`: turns the `.ask()`
    answer + records into React Flow nodes/edges on the map. **The flagged feature.**
  - `mindmap/actions/actions.ts` — `askDatabase()` server action.
  - `app/api/sse/xata/ask/route.ts` — SSE endpoint streaming `.ask()` results (`text/event-stream`).
  - `app/api/disclosure/chat/route.ts` — chat route wiring `searchDatabase` + `xataToXYFlow`.
- **Workflows / knowledge layer:**
  - `services/ai/workflows/prompt-to-multistep.workflow.ts` — multiple `askXataWithAi()` per step.
  - `services/knowledge-layer/process-resource.ts` — dedup/"does it exist" check via `.ask()`.
- **Misc / scaffold:** `app/api/disclosure/data-layer/ask/route.ts`, `app/api/test-xata/route.ts`.

### What a replacement requires
1. **Embeddings pipeline** — embed the same columns Xata vectorized (per-table column weights
   already encoded as `targetsPerTable`), stored in a `pgvector` column.
2. **Retrieval** — vector similarity (`<=>`) + optional keyword hybrid.
3. **Generation** — feed retrieved rows to an LLM with the existing `rules` prompts, return
   `{ answer, records }` in the **same shape** so `transformForReactflow` and the SSE route don't change.
4. Keeping the return contract identical lets us swap the **inside** of `askXataWithAi()` and
   leave the map/chat consumers untouched.

## 🟡 Full-text search layer

- `executeDatabaseTableQuery()` — per-table `.search()` with weighted targets + highlight/score
  post-processing (`processResults`).
- `executePlatformWideConnectionSearch()` — `xata.search.all()` across linked tables to discover
  connections; powers `/api/disclosure/data-layer/search/connections` and `.../enrich`.
- `searchXataConnections()` — `mindmap/actions/actions.ts`.
- `sightings-time-chunk.ts` — multiple `xata.db.sightings.search("*", …)` for geo/time windowing.
- **Migration:** Postgres FTS (`to_tsvector`/`ts_rank`) covers most; the highlight + weighted-target
  + cross-table ranking needs deliberate re-implementation to preserve result quality.

## 🟡 Aggregations

- `services/ranking/personnel-ranking.service.ts` — 5× `aggregate` (personnel ranking).
- `services/sightings/get-sightings.ts`, `get-events.ts`, `actions/events-time-chunk.ts`,
  `actions/sightings-time-chunk.ts`, `data-viz/.../useTimeSeriesVisualization.tsx` (`summarize`).
- `app/api/admin/test-ranking-system/route.ts` — `summarize` + `aggregate`.
- `app/api/disclosure/data-layer/aggregate/route.ts` — generic passthrough.
- **Migration:** straight `GROUP BY` / `count`/`sum` SQL. Mechanical but per-call.

## 🟢 CRUD / query (the easy bulk)

Spread across `(site)/**` pages (timeline, history, explore, gallery), `services/**`,
`mindmap/actions/fetch-next-mindmap-records.ts` (`getPaginated`), processing/import scripts, and
the `cli/` app. All `read`/`getAll`/`create`/`update`/`delete`/`filter` — direct ORM equivalents.

## 🟡 Image transform (isolated)

- `(site)/history/gallery/page.tsx` — `transformImage()` from `@xata.io/client`. Swap for
  `next/image` or an image CDN.

## Infra, client & config to retire

- **Generated client / schema:** `xata.ts`, `.xatarc`, `client.ts`, the barrel `index.ts`, types
  in `xata-extensions.d.ts`.
- **Dependency:** `@xata.io/client@^0.30.1`; `xata` in `cli/package.json`.
- **Cloudflare worker:** `services/cloudflare/worker.ts` instantiates `new XataClient(...)`.
- **CLI:** `cli/src/lib/xata-client.ts`, `cli/src/config.ts` (hardcoded default `databaseURL`).
- **Import/seed scripts:** `scripts/data-import/**` (`import-*-to-xata.ts`) and `import:events` /
  `import:sightings` package scripts — rewrite against the new store as part of data migration.
- **Backup/export routes:** `disclosure/data-layer/backup/route.ts`, `internal/export/route.ts`
  shell out to the Xata CLI.

## 🔴 Security finding (act now, independent of migration)

- Hardcoded live API key (`xau_…`) in `internal/export/route.ts`. Rotate immediately, move to env.
  (Re-verify against dev — the route appears absent now; confirm rotated, not just relocated.)
- `cli/src/config.ts` — hardcoded default database URL (workspace slug leak — lower severity, scrub).

## Recommended sequencing

1. **Rotate the leaked key** (decouple from everything else).
2. **Abstract behind the existing chokepoints** — keep `askXataWithAi`, `executeDatabaseTableQuery`,
   `executePlatformWideConnectionSearch`, `fetchNextMindmapRecords` as the seams. Migrate internals;
   leave consumers' call signatures intact.
3. **Port CRUD** to the chosen ORM (largest volume, lowest risk).
4. **Rebuild FTS + aggregations** against the new store.
5. **Rebuild `.ask()` RAG last** — the only net-new system — reusing the `targetsPerTable` column
   weights as the embedding/retrieval config.

### Platform-choice implication
Because `.ask()` must be rebuilt regardless, the decision hinges on **how much of the RAG stack the
candidate gives back for free**: plain Postgres + manual pgvector means we own
embeddings/retrieval/generation; a platform with built-in vector + AI search recovers some of Xata's
original ergonomics. That trade-off — not the CRUD port — should drive the selection.
