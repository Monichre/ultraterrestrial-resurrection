# Scratchpad — shared working doc

**Co-owned by Liam + Claude.** Both of us read and write this freely, async. Liam edits
it in his editor whenever; Claude reads those edits and acts on them, and writes here too.
Neither of us has to *ask* the other to add something — we just write, and the other
consumes it. A whiteboard we both hold markers for, not a request queue.

Keeps clutter off the live conversation/terminal. Not the formal three-tier system
(FEATURES → TODO → DAILY_WORK_PLAN) — this is the napkin. Promote items to
`docs/plans/TODO.md` when they're ready to execute.

_Optional: prefix `[L]` for Liam's lines, `[C]` for Claude's, only when attribution
matters. Otherwise just write._

_Last touched: 2026-05-30 (Claude)_

## 🟢 Active decisions (this session)
- [x] **Documents = immutable evidence**, CRUD only on derived data. (confirmed)
- [x] **Vectorization = Option A**: owned ingestion pipeline → own pgvector, vectors live next to relational data. (confirmed)
- [ ] **DB platform** — Supabase vs Neon+Vercel Blob vs self-host. Pending platform-comparison screen.
- [x] **ufo-ui role** = component/design source (cherry-pick into apps/app, drop the v0 scaffold).

## 🔬 Xata migration audit — distilled (branch `claude/database-z-jet-audit-XHnL6`)
Parallel audit; **not merged** (no code, just findings — doc lives on that remote branch).
Convergent with our architecture: CRUD = easy bulk, `.ask()` RAG = the one real rebuild.
- **Surface by lift:** 🟢 CRUD (read/getAll/create/update/delete/filter/sort, 200+ sites) = mechanical ORM port · 🟡 aggregate/summarize (~24) = SQL GROUP BY · 🟡 search/`search.all` (~17) = Postgres FTS + ranking tuning · 🔴 `.ask()` (4 core + wrappers) = full rebuild (pgvector + embeddings + LLM).
- **Adapter seam (= our plan):** keep chokepoint signatures, swap internals (`askXata*`, table-query, platform-wide-connection-search, `fetchNextMindmapRecords`); preserve `{answer, records}` shape so mindmap/SSE consumers don't change.
- **Reuse:** Xata's per-table column weights (`targetsPerTable`) → our embedding/retrieval config.
- ⚠️ **Stale coordinates:** audit forked from pre-monorepo Apr-2025 main. Paths `src/...` → real `apps/app/src/...`; `search-operations.ts` gone by that name (seam now `askXata` in `packages/db`). Re-map before trusting any file:line.

## ❓ GROUND TRUTH NEEDED (blocks scoping the rebuild)
- **Two AI retrieval paths coexist on dev:** Xata `.ask()` (mindmap via `xata-to-xyflow.ts`) AND OpenAI Assistants/`file_search` (disclosure chat/mindmap routes). **Which is actually wired to the running app?** Determines what "rebuild `.ask()`" means.
- 🔴 **Security re-verify:** audit flagged hardcoded `xau_` key at `app/api/internal/export/route.ts:64` — route/literal NOT on dev now. Confirm rotated (not just moved). Don't assume.

## 📌 Parked tasks (do later, don't derail)
- [ ] **Delta audit**: recompute local knowledge-base sources vs what's actually in the OpenAI Vector Store. Done before; redo. Sources at `packages/knowledge-base/sources/` (+ `apps/disclosure-rag/data/...` new FBI/NASA releases).
- [ ] **`packages/db` adapter rewrite**: Xata → Postgres without changing the ~10 `@db/xata` import sites in `apps/app/src`. (events, contexts, routes, features).
- [ ] **Seed local pgvector**: finish `utf-pg` container seed from Feb-24 CSV export (OrbStack currently OFF). `schema_clean.sql` + `load_clean.sql` at repo root.
- [ ] **Embedding model**: `text-embedding-3-small` (1536) — confirmed matches existing `vector(1536)` schema. Lock it in spec.
- [ ] **Ingestion pipeline compute**: where the chunk+embed worker runs (folds into platform choice).
- [ ] **Retrieval rewrite**: agent retrieval = pgvector similarity + full-text + entity filters in SQL; retire/optionally-keep OpenAI file_search.

## 🛠 Canvas/tooling enhancements (nice-to-have)
- [ ] Make archived canvas screens **standalone-renderable** (inline the frame template + theme CSS so they open without the companion server).
- [ ] settings.local.json has a **forest of duplicate git-commit PostToolUse hooks** + a noisy `*`-matcher osascript notification on every tool. Worth de-duping someday.

## 💡 Ideas / open questions
- Vallée/Pasulka-style methodology framework for evidence ingestion & analysis (from CLAUDE.md note).
- Should the Library be content-addressed (hash-keyed) for dedupe across overlapping releases?
