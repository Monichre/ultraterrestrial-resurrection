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
- [x] **Xata is DEAD DEAD** — service gone. This is a **greenfield rebuild from the Feb-24 CSV export** (the only surviving source of truth), NOT an SDK port. Don't preserve Xata semantics/return-shapes. We own all consumers and refactor them freely. Any Xata-SDK detail = moot.
- [x] **Documents = immutable evidence**, CRUD only on derived data. (confirmed)
- [x] **Vectorization = Option A**: owned ingestion pipeline → own pgvector, vectors live next to relational data. (confirmed)
- [ ] **DB platform** — Supabase vs Neon+Vercel Blob vs self-host. Pending platform-comparison screen.
- [x] **ufo-ui role** = component/design source (cherry-pick into apps/app, drop the v0 scaffold).

## 🔬 Xata migration audit — distilled (branch `claude/database-z-jet-audit-XHnL6`)
Use it ONLY as a **capabilities inventory** (what the app does with data). Xata-SDK
specifics below are moot now that Xata's dead — kept just to enumerate features to rebuild.
- **Capabilities to provide (not port):** plain CRUD (read/list/create/update/delete/filter/sort) · aggregations (counts/sums/time-series) · full-text search w/ ranking · the RAG feature that feeds the mindmap (answer + matched records → React Flow nodes/edges).
- ~~Adapter seam / preserve `{answer,records}` shape / reuse `targetsPerTable`~~ **MOOT** — no live system to stay compatible with. Rebuild consumers to fit the new layer.
- ⚠️ Audit file:line coordinates are stale (pre-monorepo) AND now largely irrelevant — treat the doc as a feature checklist, not a code map.

## ❓ What actually needs grounding now (requirements, not forensics)
- Xata-backed CRUD/search/`.ask()` are **all dead by definition** — none of those code paths run today. "Which AI path is live" is answered: not the Xata ones. Surviving functional AI = OpenAI `file_search`, *if* still wired.
- Real question: **what capabilities must the rebuilt layer provide**, mapped against the **CSV export schema** as source of truth. That's the spec input.
- 🔴 Leaked `xau_` key is inert (service dead) but scrub from history if still present — hygiene, not urgency.

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
