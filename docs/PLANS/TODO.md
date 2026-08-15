---
status: live
role: eng
spine: do
updated: 2026-08-13
---

# TODO — Ultraterrestrial Resurrection

**Last Updated:** 2026-08-13
**Source:** Roundtable audit (4 specialists) + agent-native remediation audit
**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`
**Branch:** dev

> **🔴 2026-08-13 — READ THIS BEFORE TRUSTING ANY COMMIT HASH IN THIS FILE.** A history rewrite (the `399dd678 lots` / `6d5d10e6 lotgs` / `76b1127a lots and lots` squashes) invalidated most recorded hashes. Spot-check on 2026-08-13: **6 of 7 sampled hashes do not exist in this repo** — `7fe46f0` (T-050), `cd77135` + `b6d1d5a` (T-048 H0), `d5c69fb` (T-045), `aefc21b` (T-044), `ad87c45b`. Only `bbb32339` (T-047) resolved. **The underlying work generally did land** — it is the hashes that are dead, not the commits' content. T-050 and T-048 H0 have been repaired below with verified hashes; **T-044 and T-045 have not been checked and should be verified by artifact before anyone relies on them.** The 2026-08-06 spacetime review flagged this as process item 10; this is the first partial repair. Rule going forward: **verify by artifact, not by hash.**

> **2026-08-13 — handoff grooming pass on T-047 and T-050** (no code changed). T-050 is now pickup-ready: dead hash corrected to `e58eccfe`, test pass bar corrected to the real suite (8 files / 38 tests, measured green), and subtask 3 (Render) specified down to the mount point and the node/edge-registry collision. **T-047 is NOT pickup-ready** — the 2026-08-07 storyboard rebuild that replaced its architecture is entirely uncommitted (10 untracked + 10 modified files), and the ticket predated both the 08-06 review and that rebuild. See the blocker block on T-047.

> **2026-08-12:** Reviewed external n8n YouTube RAG workflows + UAP podcast playlist catalog. Opened **T-057** (playlist bulk-ingest manifest), **T-058** (grouped video retrieval + timestamp citations in live AI paths), **T-059** (playlist-id corpus index). Rejected parallel n8n+Qdrant stack — patterns only; see FEATURES Decision 12. Reference workflows archived under `packages/ai/prompts/*youtube*workflow*.json`.

> **2026-08-10:** Shipped **T-054** — Trace Map provenance graph per processed source (`apps/disclosure-rag/lib/trace_map.py`, deterministic layer). Opened **T-055** (interpretive layer: Readings/Counter-readings/Next Traces + evidence→claim linkage) and **T-056** (web-article path).

> **2026-08-09:** Opened **T-053 / DMGD-219** — Research Canvas Gen-UI upgrade. Spec: `docs/plans/2026-08-09-research-canvas-genui.md`. FEATURES Decision 11.

> **2026-07-10 session note:** Scaffolded Matt Pocock engineering-skills config (`docs/ops/issue-tracker.md`, `triage-labels.md`, `domain.md`; `## Agent skills` block in `CLAUDE.md`). Built first-pass system-wide domain model: `CONTEXT-MAP.md` (4 contexts), `CONTEXT.md` (full glossary — reserved words, adopted vocabulary, 8 evidentiary states, all record types, classification taxonomy, Phase 2 reserved names). First ADR: `docs/adr/0001-agent-inferences-excluded-from-retrieval.md`. New ticket created for follow-up context files (see T-043 below).

> **2026-07-19 docs prune:** Completed spine restructure per FEATURES Decision 8. See `docs/README.md`, `docs/ops/PRUNE_MATRIX.md`. T-039 follow-up closed for filesystem/layout; optional automation → T-046.

---

## How to Use This File

Pick a task. Check its status and dependencies. If status is `OPEN` and dependencies are met, claim it by changing status to `IN PROGRESS — [your agent name] — [date]`. When done, change to `DONE — [date]`. If blocked, change to `BLOCKED — [reason]`.

---

## Worklanes (officiated 2026-08-01)

All work belongs to exactly one lane. Every ticket carries a **Lane:** field. Plans,
roadmaps, and agent assignments are framed per lane; the three-tier system
(FEATURES → TODO → DAILY_WORK_PLAN) still applies *within* each lane.

### Lane A — Corpus & Ingestion

**Owns:** `apps/disclosure-rag/`, `packages/knowledge-base/`, `packages/db/scripts/rebuild/`
**Question it answers:** *is the evidence correct, complete, traceable, and durable?*
**Roadmap:** `docs/plans/2026-08-01-ingestion-hardening.md` (H0 → H5)
**Agents:** `disclosure-rag-agent`, `knowledge-base-agent`, `db-agent`

Lane A is upstream. Its output — a trustworthy, queryable, provenance-bearing corpus —
is the input Lane B renders. A defect here is invisible in the UI and corrupts every
surface downstream, which is why it gets its own lane rather than living as a backlog
tail behind product work.

### Lane B — Platform & Experience

**Owns:** `apps/app/`, `packages/ai/`, the research/spacetime canvases, agent chat paths
**Question it answers:** *can a researcher see, traverse, and reason about the evidence?*
**Roadmap:** `docs/plans/2026-08-01-spacetime-canvas-implementation.md` (M0 → M4) · Research Canvas Gen-UI: `docs/plans/2026-08-09-research-canvas-genui.md` (T-053)
**Agents:** `app-agent`, `research-ui-agent`

### Lane assignment

| Lane | Active | Open / backlog | Done |
| --- | --- | --- | --- |
| **A — Corpus & Ingestion** | T-048 | T-045, **T-055**, **T-056**, **T-057**, **T-059** | T-044, **T-054** |
| **B — Platform & Experience** | T-050, T-052 | T-036, T-037, T-043, T-046, T-049, T-051, **T-053**, **T-058** | T-001 … T-029, T-030, T-031, T-038 … T-042 |

**T-047 is deliberately absent from the Active column as of 2026-08-13.** It is not backlog either — it is **held**: its current surface is uncommitted (10 untracked + 10 modified files), so it cannot be assigned until the repo owner decides how that work lands. See the blocker block on T-047 before moving it back.

**Cross-lane dependency (the one that matters):** Lane B's M1 "Evidence instrument"
milestone — credibility and provenance filtering, source-cited event inspection — cannot
be built before Lane A ships **H4 (provenance backfill)**. There is no provenance on 99%
of archive records today. Lane B M0 does not depend on Lane A and can proceed in parallel.

---

## Phase 0 — Emergency Fixes (Day 1)

### T-001: Remove Edge runtime from Prometheus chat route

- **Status:** DONE — 2026-03-29
- **Size:** XS (30 min)
- **Files:** `apps/app/src/app/api/prometheus/chat/route.ts`
- **What:** Delete `export const runtime = 'edge'`, set `maxDuration = 60`, remove in-memory `Map()` rate limiter

### T-002: Fix 3 broken API routes

- **Status:** DONE — 2026-03-29
- **Size:** S (1-2 hours)
- **What:**
  - `/api/processing/scrape/route.ts` — remove duplicate type imports
  - `/api/processing/file/route.ts` — delete entirely (stub writing to nonexistent table)
  - `/api/disclosure/chat/route.ts` — fix `transformXYFlow` tool output (serialize Response to JSON string)

### T-003: Add Clerk authentication middleware

- **Status:** DONE — 2026-04-05
- **Size:** S (half day)
- **Files:** Create `apps/app/src/middleware.ts`
- **What:** Protect at minimum:
  - `/api/admin/*` — admin only
  - `/api/processing/*` — authenticated users
  - `/api/prometheus/chat`, `/api/disclosure/*` — authenticated users
  - Leave `/api/webhooks/*` and `/api/cron/*` unprotected (use secret verification)
- **Why:** Every API route is currently publicly accessible. Anyone can trigger expensive FireCrawl scraping, inject data, and make unlimited AI API calls.
- **Acceptance:** Unauthenticated requests to protected routes return 401.

---

## Phase 1 — Delete Dead Code (Day 1-2)

### T-004: Delete 4 ghost route wrappers

- **Status:** DONE — 2026-03-29
- **Size:** XS (30 min)
- **Dependencies:** None
- **What:** Delete these directories/files:
  - `apps/app/src/app/(site)/disclosure/page.tsx` — bare re-export of research-canvas
  - `apps/app/src/app/(site)/search-and-discovery-interface/page.tsx` — renders outside provider stack
  - `apps/app/src/app/(site)/content-card-detail-view/page.tsx` — renders outside provider stack
  - `apps/app/src/app/(site)/ufo-sightings/page.tsx` — renders outside provider stack
- **Acceptance:** Directories deleted. No imports break (they have zero consumers).

### T-005: Delete 4 dead shell variants

- **Status:** DONE — 2026-03-29
- **Size:** XS (30 min)
- **Dependencies:** None
- **What:** Delete:
  - `features/mindmap/smart-mindmap.tsx`
  - `features/mindmap/smart-mindmap-with-auto-connections.tsx`
  - `features/mindmap/smart-mindmap-with-shared-context.tsx`
  - `features/mindmap/smart-graph.tsx` (feature root, NOT `components/smart-graph/`)
- **Acceptance:** Files deleted. No imports break (zero production consumers confirmed).

### T-006: Prune index.tsx

- **Status:** DONE — 2026-03-29
- **Size:** XS (10 min)
- **Dependencies:** T-005
- **Files:** `features/mindmap/index.tsx`
- **What:** Reduce to: `export * from './mind-map'`. Current re-exports of `SmartMindmapEnhanced`, `WrapWithSmartConnections`, `AutoConnectionEnabledGraph` have zero call sites.
- **Acceptance:** File is 1-2 lines. No imports break.

### T-007: Consolidate xata-to-xyflow files

- **Status:** DONE — 2026-04-05
- **Size:** S (2-4 hours)
- **Dependencies:** None
- **Files:**
  - `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts` (878 lines)
  - `apps/app/src/features/mindmap/actions/xata-to-xyflow-fixed.ts` (570 lines)
- **What:** Delete `xata-to-xyflow-fixed.ts`. Merge its validation/metadata improvements into `xata-to-xyflow.ts`. Fix the missing `askXataWithAi` import. Two files exporting the same function name with different behavior is a maintenance landmine.
- **Acceptance:** Single file, no duplicate exports. Build passes.

---

## Phase 2 — Core UX & Performance (Days 2-5)

### T-008: Paginate initial graph data load

- **Status:** DONE — 2026-06-20 (per-type LIMIT bounded load ~210 nodes; Map O(1) edge resolution; commit 43b276a)
- **Size:** M (2-3 days)
- **Dependencies:** T-007
- **Files:**
  - `packages/db/src/xata-typescript-sdk/api/xyflow-integration.ts`
  - `apps/app/src/features/mindmap/actions/get-entity-network-graph-data.ts`
- **What:**
  - `getEntityNetworkGraphData()` fetches ALL 230,998 records across 7 tables + 5 join tables sequentially
  - Replace with bounded initial load (200-500 nodes, distributed across entity types)
  - Lazy-load via `/api/mindmap/records/route.ts` as user explores
  - Replace `nodes.find()` edge resolution (O(n*m)) with `Set<string>` lookup
- **Acceptance:** Initial load under 500 nodes. No full-table scans. Edge resolution is O(1) per lookup.

### T-009: Fix EmptyCanvas

- **Status:** DONE — 2026-04-05
- **Size:** XS (30 min)
- **Dependencies:** None
- **Files:** `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`
- **What:**
  - Remove `UFO_RESEARCH_EVENTS` hardcoded dummy array
  - Remove `showTimeline` string-matching branch
  - Replace with `agentStatus`-driven empty/loading/streaming state (props already threaded)
- **Acceptance:** No dummy data. State reflects actual agent status.

### T-010: Wire suggestion chips to agent

- **Status:** DONE — 2026-04-05
- **Size:** XS (30 min)
- **Dependencies:** None
- **Files:** `apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx`
- **What:** The three `enhancedMessages` chips ("Guided Tour", "Deep Research", "Explore Network") only animate — they don't dispatch. Make `handleMessageClick` call `onSubmit(message.title)`.
- **Acceptance:** Clicking a chip submits it as a query to the agent.

### T-011: Replace local sightings dataset with Xata query

- **Status:** DONE — 2026-06-17 (get-sightings.ts action; verified 2026-06-20)
- **Size:** M (1 day)
- **Dependencies:** None
- **Files:** `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts`
- **What:** Has 6 hardcoded sighting records. Create a server action fetching from 130K+ sighting records in Xata, falling back to local data on failure.
- **Acceptance:** Sightings view shows real data from Xata. Fallback works if DB is unreachable.

### T-012: Add Zod validation to remaining API routes

- **Status:** DONE — 2026-06-17 (zod present in prometheus/chat, processing/testimony, mindmap/records, disclosure/mindmap; verified 2026-06-20)
- **Size:** S (1 day)
- **Dependencies:** T-002
- **What:** Routes that already have Zod: `disclosure/chat`, `processing/scrape/batch`. Routes that need it:
  - `prometheus/chat`
  - `processing/testimony`
  - `mindmap/records`
  - `disclosure/mindmap`
- **Acceptance:** All listed routes validate input with Zod. Invalid input returns 422 with error details.

---

## Phase 3 — Agent System Hardening (Days 5-10)

### T-013: Add graph-write tools to disclosure mindmap route

- **Status:** DONE — 2026-04-05
- **Size:** M (3-5 days)
- **Dependencies:** T-015 (ideally)
- **Files:**
  - `apps/app/src/app/api/disclosure/mindmap/route.ts`
  - `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`
  - `apps/app/src/features/mindmap/graph.tsx`
- **What:** Currently the agent can only search — graph mutations happen client-side. Add:
  - `addGraphNodes` tool — accepts `{id, type, label, data}[]`, emits via SSE
  - `addGraphEdges` tool — accepts `{source, target, label, reasoning}[]`
  - Client: `useMindMapAgent` already dispatches on `toolData.tool` (lines 131-179). Add cases for new tools.
- **Why:** Highest-leverage single change. Gives the agent write access to the graph.
- **Acceptance:** Agent can add nodes and edges to the graph via tool calls.

### T-014: Split processDocument into granular tools

- **Status:** DONE — 2026-04-05
- **Size:** M (1-2 days)
- **Dependencies:** None
- **Files:** `apps/app/src/app/api/prometheus/chat/route.ts`
- **What:** The monolithic `processDocument` tool takes an `action` enum. Split into: `summarizeDocument`, `extractTopics`, `analyzeSentiment`, `findConnections`, `findInsights`, `generateTags`. Implementations already exist in `documentActions` object.
- **Acceptance:** Each action is a separate tool. `processDocument` is removed.

### T-015: Standardize context injection

- **Status:** DONE — 2026-04-05
- **Size:** M (2-3 days)
- **Dependencies:** None
- **Files:** Create `apps/app/src/services/ai/context/build-agent-context.ts`, update both route files
- **What:** Create `buildAgentContext(options)` that assembles: current graph state, user's research focus, relevant DB schema hints, NER extraction prompt. Both routes consume this.
- **Acceptance:** Both disclosure/mindmap and prometheus/chat use the same context builder.

### T-016: Unify or clearly separate chat routes

- **Status:** DONE (phase 1 — annotate/audit) — 2026-06-17. Phase 2 deletion tracked as T-030.
- **Size:** M (2-3 days)
- **Dependencies:** T-014, T-015
- **What:** Keep two routes with clear ownership:
  - `/api/disclosure/mindmap` — Assistants API + SSE, for graph canvas (persistent threads, file_search)
  - `/api/prometheus/chat` — AI SDK streamText, for standalone chat
  - Delete `/api/chat/route.ts` (alias) and `/api/disclosure/chat/route.ts` (overlapping). Rewire all consumers.
- **Acceptance:** Only 2 chat-related routes remain. All consumers rewired. Build passes.

### T-017: Wire testimony queue worker as cron

- **Status:** DONE — 2026-06-17 (api/cron/process-testimonies/route.ts; verified 2026-06-20)
- **Size:** S (1 day)
- **Dependencies:** None
- **Files:** `scripts/workers/testimony-queue-worker.ts` → adapt into `/api/cron/process-testimonies/route.ts`
- **Acceptance:** Cron endpoint processes queued testimonies. Worker script is deleted or deprecated.

---

## Phase 4 — State Management & Architecture (Days 10-15)

### T-018: Extract pure factories from mindmap-context

- **Status:** DONE — 2026-06-17 (features/mindmap/utils/node-factories.ts; verified 2026-06-20)
- **Size:** S (half day)
- **Dependencies:** None
- **Files:** `apps/app/src/contexts/mindmap/mindmap-context.tsx` → new `features/mindmap/utils/node-factories.ts`
- **What:** Move `createRootNode`, `createRootNodeChild`, `createSiblingEdge`, `createRootNodeEdge`, `createRootNodeEdges` to a utils file. These are pure transforms with no React state dependency.
- **Acceptance:** Factory functions importable from utils. Context no longer defines them.

### T-019: Move graph init effect out of context

- **Status:** DONE — 2026-06-17 (features/mindmap/hooks/use-graph-init.ts; verified 2026-06-20)
- **Size:** S (half day)
- **Dependencies:** T-018
- **Files:** `mindmap-context.tsx` (line ~408) → `graph.tsx` or new `useGraphInit` hook
- **What:** The `useEffect` reads `graph3d` and calls `setGraph`. Move to `graph.tsx` or a hook.
- **Acceptance:** Context no longer has graph init side effect.

### T-020: Move UI-local state to Zustand

- **Status:** DONE — verified 2026-06-20. All 5 useState (activeNode, conciseViewActive, showLocationVisualization, locationsToVisualize, keepLoadedOnMap) already migrated to the `canvas` slice in mindmap-ui-store.ts and bridged through context via useShallow; no useState backing remains. (Full god-object decomposition to ~200-300 lines is a larger follow-up tracked separately.)
- **Size:** S (1 day)
- **Dependencies:** T-018
- **Files:** `mindmap-context.tsx` → `features/mindmap/store/mindmap-ui-store.ts`
- **What:** Move 5 `useState` calls (`activeNode`, `conciseViewActive`, `showLocationVisualization`, `locationsToVisualize`, `keepLoadedOnMap`) to Zustand as a `canvas` slice.
- **Acceptance:** Context shrinks from ~1,363 lines to ~200-300. Moved state accessible via Zustand selectors.

---

## Documentation Tasks

### T-021: Create .env.example

- **Status:** DONE (.env.example present at repo root; verified 2026-06-20)
- **Size:** XS (2 hours)
- **Dependencies:** None
- **What:** Mirror current `.env` structure (212 vars) with placeholder values. Document each var's purpose and which service it belongs to. Reference: `docs/ops/CONTRIB.md` already lists all vars.
- **Acceptance:** `.env.example` exists at repo root. All 212 vars present with comments.

### T-022: Create docs/archive/ and move obsolete files

- **Status:** DONE — 2026-06-17 (docs/archive/{sessions,scrapped-plans,design-explorations}/ populated; verified 2026-06-20)
- **Size:** XS (2 hours)
- **Dependencies:** None
- **What:** Create `docs/archive/` with subdirectories: `sessions/`, `status-reports/`, `scrapped-plans/`, `design-explorations/`. Move 50+ files from June-September 2025. See `docs/plans/2026-03-29-documentation-roundtable-report.md` for full list.
- **Acceptance:** Active doc directories contain only current files. Archive preserves history.

### T-023: Refresh FEATURES.md for Q1 2026

- **Status:** DONE — 2026-06-20 (stale Triple-RAG/tour/Xata refs reframed as scrapped/retired; commit 2c23a02)
- **Size:** S (3 hours)
- **Dependencies:** None
- **Files:** `docs/plans/FEATURES.md` (last updated Aug 2025 — 7 months stale)
- **What:** Update strategic vision, current focus areas, completed items. Remove references to Triple RAG, multi-agent tours, and other scrapped items.
- **Acceptance:** FEATURES.md reflects current quarter priorities and grounded architecture.

### T-024: Create API_ROUTES.md

- **Status:** DONE — 2026-06-17 (`docs/architecture/API_ROUTES.md`; verified 2026-06-20)
- **Size:** S (3 hours)
- **Dependencies:** None
- **What:** Document all API routes: path, method, auth required, request schema, response schema. Start with working paths: `/api/disclosure/mindmap`, `/api/prometheus/chat`.
- **Acceptance:** Every route in `apps/app/src/app/api/` has at least a one-line description.

---

## Backlog (Not Sequenced)

### T-025: Implement rate limiting

- **Status:** DONE — 2026-06-20 (30 req/60s on prometheus/chat + disclosure/mindmap, Clerk-userId/IP keyed, graceful no-Upstash fallback; commit pending)
- **Size:** S (3-4 hours)
- **What:** Use Upstash Redis (already in deps) to rate-limit AI routes. Default: 30 req/min per user/IP.
- **Dependencies:** T-003 (auth middleware)

### T-027: Create ResearchSession unified state slice

- **Status:** DONE — 2026-06-20 (non-destructive `researchSession` Zustand slice on `mindmap-ui-store.ts` converging research-context + use-research-state; sessionId/pinnedCards/canvasNotes persisted. Consumer migration documented + deferred. `docs/plans/2026-06-20-t027-research-session-slice.md`)
- **Size:** M (2-3 days)
- **What:** Single owner of investigation-session state: `activeSessionId`, `pinnedNodeIds`, `notes`, `evidenceIds`, `citationIds`, `saveStatus`. Converge 4 fragmented providers.
- **Reference:** `docs/plans/2026-03-29-research-canvas-grounding.md`

### T-028: Mindmap Agent Consolidation (ai-sdk-tools)

- **Status:** DONE / IN REVIEW — 2026-07-12 ([DMGD-183](https://linear.app/dmg-dev/issue/DMGD-183))
- **Phase A completed (2026-07-05):** Deleted retired `/api/sse/xata/ask` + `/send` + `/api/sse/test` routes. Deleted dead consumers (`useSSE.tsx`, `useAskXata.ts`, `XataAskComponent.tsx`, `useXataAsk.ts`, `ask-example.ts`, `ask-example-enhanced.ts`, `features/mindmap/debug/`). Rewired `AskAIStreaming` → `useMindMapAgent` (canonical `/api/disclosure/mindmap`). Purged all remaining `@db/xata`/`@db` value imports: `xata-to-xyflow.ts` (fetchRecords → `readById`, fallbacks → `searchTable`), `process-resource.ts` (→ `searchTable`), Clerk webhook route rewritten on `@db/postgres` (URL kept stable). 4 type-only `@db` imports repointed to `@db/postgres`.
- **Phase B completed (2026-07-05):** Shared search core already lived in `@db/postgres` (`searchDatabase`: FTS + pgvector + RRF fusion); remaining duplication removed — shared `embedQuery` extracted to `services/ai/openai/embed-query.ts` (both live routes now import it), one-line `tools/search-database.ts` wrapper + orphan `tools/index.ts` barrel deleted, 4 importers repointed to `@db/postgres` directly.
- **Runtime smoke (2026-07-05):** `/api/disclosure/mindmap` streams SSE end-to-end (thread create + run start OK) — run fails only on **OpenAI quota exhausted** (billing, not code). `/api/prometheus/chat` had TWO real runtime bugs from AI SDK v4→v6 drift, both FIXED: `toDataStreamResponse()` → `toUIMessageStreamResponse()` (5 files) and `tool({ parameters: ... })` → `tool({ inputSchema: ... })` (10 tools) — route now streams the correct v6 UI-message protocol. Neon `searchDatabase` verified live against real data (Roswell FTS top-hit correct). Clerk webhook blocked locally on missing `CLERK_WEBHOOK_SECRET` env (route runs, refuses correctly).
- **Phase C completed (2026-07-12):** shared DB-search and Exa schemas/executors now serve both live routes from `services/ai/tools/research-search.ts`. Re-smoke the OpenAI Assistants path after billing is restored; set `CLERK_WEBHOOK_SECRET` to smoke the webhook.
- **Size:** remaining S-M (1-2 days)
- **Dependencies:** T-013, T-015

### T-029: UFO Research Methodology Framework

- **Status:** DONE — 2026-06-20 (docs/research/ufo-research-methodology.md; commit 2c23a02)
- **Size:** M (2 days)
- **What:** Define structured methodology inspired by Jacques Vallee, Diana Pasulka Walsh. Framework for classification, evidence evaluation, source verification, pattern analysis. Map to ingestion/analysis workflows.

### T-036: LLM Wiki — compounding knowledge layer (Karpathy-style)

- **Status:** DECISION READY — 2026-07-12 ([DMGD-184](https://linear.app/dmg-dev/issue/DMGD-184)); full build NO-GO, explicit 10-source provenance pilot recommended
- **Size:** L (multi-week, phased)
- **What:** Build a persistent, LLM-maintained wiki layer between the ~960 raw knowledge-base sources and Prometheus — interlinked markdown entity/concept/event pages that the LLM compiles once and keeps current (ingest/query/lint ops), instead of re-deriving knowledge per query via RAG. Compounding artifact; cross-refs + contradictions pre-flagged. Natural fit with the mindmap (wiki graph = canvas), the UFO research methodology (T-029), and pgvector retrieval. See analysis doc for project-specific recommendation + phased plan.
- **Source idea:** `docs/research/llm-wiki-pattern.md`
- **Decision:** Raw sources remain immutable and Postgres remains the entity/graph/search system of record. A generated wiki is only a versioned secondary artifact. Promote beyond a pilot only if citation traceability, contradiction preservation, idempotence, and researcher-utility gates pass.
- **Blockers:** The referenced fit-analysis document is missing; source identity/provenance, claims boundaries, the evaluation set, and ingestion/idempotency contracts are not canonical.

### T-037: AI prompt & model audit — frontier-models-only policy + fallback-chain adoption

- **Status:** IMPLEMENTATION DONE / EXTERNAL VERIFICATION BLOCKED — 2026-07-12 (DMGD-152 and DMGD-158 in review)
- **Size:** M (1-2 days)
- **Policy (user-stated, 2026-07-07):** Only current frontier models by top providers are acceptable anywhere in the app — GPT-5.5, Claude Opus 4.8 / Sonnet 5, Gemini 3.5 Flash, GLM-5.2. No legacy tiers (gpt-4-turbo, gpt-4o-mini, etc.), ever.
- **Done in this pass (2026-07-07):** `src/lib/ai/model-fallback.ts` created (6-tier frontier chain, env-key gated); hypothesis enrichment (`enrich-hypothesis.ts`) runs through it; Prometheus `MODEL_NAME` upgraded `gpt-4-turbo` → `gpt-5.5`.
- **Vision Phase 0 done (2026-07-08)** per `docs/plans/2026-07-08-memory-first-vision-review.md`: both live prompts rewritten with UT identity + operating principles (Prometheus `SYSTEM_PROMPTS.main`, mindmap `additional_instructions` with `[Observed]…[Unverified]` evidentiary-state edge labeling); `enrich-hypothesis.ts` upgraded to liturgy schema `{reading, counterReading, whatRemainsWeird, nextTrace}` via new `generateObjectWithFallback`; dock renders four-part reading; voice contract + rubric added to `features/mindmap/CLAUDE.md`. Remaining prompt audit items below still open; Vision Phase 1 (evidentiary-state badges, claims table, Synthesize action) tracked in the review doc.
- **Stale-model sweep DONE — 2026-07-08 (delegated audit):** 8 strings upgraded in 7 live files (claude-3-opus→opus-4-8 in scrape route/firecrawl/process-resource; claude-3-5-sonnet→sonnet-5 in get-claude-response; gpt-4o-mini→gpt-5.5 in agent-patterns + agent-states; gpt-4-turbo-preview→gpt-5.5 in sightings-ai-analysis) + 4 held-back files fixed after agent merge window (ai-actions.ts, smart-connection-analysis.ts, extract-search-terms.ts → gpt-5.5; model-selector.tsx cleaned). ~16 dead/orphaned files with stale models cataloged (deletion candidates, not upgraded — includes orphaned `services/ai/prometheus/` vendored tree). 61 hits in disconnected apps/disclosure-rag report-only. `text-embedding-3-small` confirmed untouched (locked).
- **`generateText`/`generateObject` fallback chain DONE — 2026-07-08 (commit 37d9a6c):** `model-fallback.ts` hardened to survive real-world provider failures — env-alias gating (tiers skipped unless their key is set), z.ai `.chat()` fix, Gemini `thinkingBudget: 0`, per-tier retries, and a `gemini-3-flash-preview` backup tier. New smoke script `apps/app/scripts/smoke-model-fallback.ts`. Chain verified live: with only the Google tier currently funded, the first end-to-end **Synthesize Investigation** dossier was served by Gemini 3 Flash in the UI. The `streamText` + tool-call variant for the two live agent routes remains open (see below).
- **Completed 2026-07-12:** Prometheus main chat and all six document actions use a retry-aware transport-level `streamText`/tool-call fallback before bytes are emitted. Both live routes share DB/Exa tool definitions. `build-agent-context.ts` and all six document prompts received the UT epistemic/voice pass.
- **Remaining external checks:**
  - Verify/upgrade the OpenAI Assistants API assistant's model (set server-side on the assistant object — dashboard or API, needs OpenAI billing live).
  - Add `GOOGLE_GENERATIVE_AI_API_KEY` + `ZHIPU_API_KEY` to `.env` to activate the Gemini 3.5 Flash and GLM-5.2 tiers (chain skips them until set). Note (2026-07-08): `GEMINI_API_KEY` was revoked as leaked — rotate before relying on it.
- **Files:** `apps/app/src/lib/ai/model-fallback.ts`, `apps/app/src/app/api/prometheus/chat/route.ts`, `apps/app/src/app/api/disclosure/mindmap/route.ts`, `apps/app/src/features/mindmap/actions/enrich-hypothesis.ts`
- **Reference:** `docs/plans/2026-07-07-llm-enriched-hypothesis.md`

### T-038: Design language & domain vocabulary canonicalization

- **Status:** IMPLEMENTATION DONE / EXTERNAL FIGMA REVIEW BLOCKED — 2026-07-12 (DMGD-154 and DMGD-155 in review)
- **Size:** remaining S-M
- **Done (2026-07-09):** Extensive review of the Brand Bible package (`docs/design/brand-bible/` — moved into repo from Desktop) + vision docs + shipped Phase 0/1 code. Created: `docs/vision/2026-07-09-canonicalization-audit.md` (overlap audit + placement ruling), `RESEARCH_NARRATIVE_RUBRIC.md` (judging checklist: 2 governing questions, 7 hard gates, 16 scored criteria), `UX_LANGUAGE_GUIDE.md` (reserved words, 8-term adopted vocabulary, badge grammar, interaction copy rules), `AGENT_ARCHITECTURE_BRIEF.md` (5 investigative roles — Archivist/Analyst/Skeptic/Mythographer/Cartographer — mapped honestly to the 2 live AI paths; no orchestrator claimed), `IMPLEMENTATION_SPEC.md` (identity→code map with gap list).
- **Audit finding:** only `RESEARCH_CANVAS_AESTHETIC.md` is byte-identical between the package's Design Canon and `apps/app/src/components/design-system/`; the other four Canon files are NEWER (carry the 04_DESIGN_REVIEW_NOTES corrections) — repo copies are stale.
- **Completed 2026-07-12:** extended `PRODUCT.md` with the exact Core Rule and Final Direction; synced four corrected Design Canon files; added the prototype cannibalization ruling to the existing audit; completed a surgical live UI terminology/failure/empty-state sweep.
- **External blocker:** Four remote Figma files remain inaccessible (Document Library, Visual Archaeology Timeline, UN-DEFECTTAL Poster, Ultraterrestrial Design Lab).
- **Files:** `docs/vision/*`, `docs/plans/2026-07-08-memory-first-vision-*.md`, `docs/design/brand-bible/`
- **Reference:** `docs/vision/2026-07-09-canonicalization-audit.md`

### T-039: Documentation cleanup & simplification (all docs)

- **Status:** DONE / IN REVIEW — 2026-07-12 ([DMGD-185](https://linear.app/dmg-dev/issue/DMGD-185))
- **Size:** M-L
- **What:** Repo-wide pass to simplify and de-duplicate documentation before Linear (T-040) takes over task tracking. Candidates found so far: stale `docs/agents/AGENT_ONBOARDING_CHECKLIST.md` (still references retired Xata-era file paths); confirm `docs/plans/` vs `docs/PLANS/` is a macOS case-insensitive filesystem alias, not a real duplicate (verified 2026-07-09: same inode — no action needed, just don't let an agent copy content between them believing they're distinct); general docs/ sprawl audit.
- **Why:** User wants task tracking to feel "completely invisible" — that only works once the docs it's built on are simplified and non-duplicated.
- **Depends on:** none; blocks T-040 in spirit (do the cleanup before wiring Linear so tickets map to a clean doc set).

### T-040: Linear integration for task tracking

- **Status:** DONE / IN REVIEW — 2026-07-12 ([DMGD-186](https://linear.app/dmg-dev/issue/DMGD-186))
- **Size:** M
- **Cutover:** Linear owns actionable ticket status/priority/review-state. `FEATURES.md` remains strategic, `DAILY_WORK_PLAN.md` is a session log.
- **Parity correction (2026-08-09, user-directed):** this file is **not** a frozen historical ledger — TODO.md and Linear are kept in parity going forward. New/updated/closed tickets get mirrored into both in the same pass. See `docs/agents/ops/issue-tracker.md` for the full rule.
- **Why:** User's own words: "integrate Linear so that task tracking just seems completely fucking invisible to me right now." (original cutover); "Everything should persist to Linear yes but I think we've been using the TODO file rather substantially so they should be in parity with one another" (2026-08-09 correction).
- **Depends on:** T-039 (docs cleanup) should land first so migration maps cleanly.

### T-041: Roundtable UX/UI review

- **Status:** BLOCKED — 2026-07-12 ([DMGD-187](https://linear.app/dmg-dev/issue/DMGD-187)); app ran locally, but no browser backend was available for the required current-run screenshot evidence
- **What:** Multi-perspective review of UX/UI covering (a) the live application itself, (b) the conceptual/identity layer (`docs/vision/*`, `DESIGN.md`, `PRODUCT.md`), and (c) the ingested brainstorm material (`docs/design/brand-bible/`, `docs/design/reference-prototype/`).
- **Why:** User wants a synthesis pass across code, concept, and reference material now that the canonicalization (T-038) and design-registers reframe (`docs/vision/DESIGN_REGISTERS.md`) exist to review against.
- **Depends on:** T-038 remaining items should be resolved or at least visible before this review, since they're inputs to it.

### T-042: Custom agent architecture brainstorm

- **Status:** DECISION READY — 2026-07-12 ([DMGD-188](https://linear.app/dmg-dev/issue/DMGD-188)); local-first scoped specialists, no cloud-persistent agents yet
- **What:** Explore what app-specific custom agents (memory, specialization, shared vs. independent context) would look like for Ultraterrestrial — local (`.claude/agents/*.md`, already has app-agent/db-agent/disclosure-rag-agent/knowledge-base-agent/research-ui-agent) vs. cloud-persistent (Claude Managed Agents / Claude API Managed Agents with a hosted sandbox). No decision made yet — this is a live discussion thread, not a committed direction.
- **Depends on:** none directly; informs future automation of T-039/T-040/T-041 style reflection work.
- **Decision:** Use one coordinator with App/AI, Postgres/Data, Knowledge/Provenance, Research UI/Canon, and Verification/Skeptic specialists. Share versioned canon and typed handoffs, not hidden cross-agent memory. Keep investigative roles as prompt stances rather than separate runtime services.
- **Next gate:** Rewrite the stale local agent definitions around Postgres and the two live AI paths, then validate the pattern on one bounded workflow. Reconsider hosted persistence only after stable contracts, evals, RBAC/auditability, and a recurring unattended workload exist.

### T-043: Write per-context CONTEXT.md files (domain model follow-up)

- **Status:** OPEN — synced to Linear 2026-07-24 ([DMGD-204](https://linear.app/digital-mischief-group/issue/DMGD-204/t-043-write-per-context-contextmd-files-domain-model-follow-up))
- **Size:** S (2-3 hours total)
- **Dependencies:** CONTEXT-MAP.md + root CONTEXT.md (done 2026-07-10)
- **What:** Create the three context-specific glossary files mapped in `CONTEXT-MAP.md`:
  - `apps/app/CONTEXT.md` — Research Canvas context: node types, edge types, panel names, canvas-specific interaction vocabulary
  - `packages/db/CONTEXT.md` — DB context: table names, query patterns, the retrieval model, the `agent_inferences` contract
  - `packages/prompts/CONTEXT.md` — AI/Prompts context: the five investigative roles, liturgy schema, voice contract terms
- **Why:** Completes the multi-context domain model. Skills like `domain-modeling`, `to-tickets`, and `qa` read from these during implementation.
- **Reference:** `CONTEXT-MAP.md`, `CONTEXT.md`, `docs/ops/domain.md`

### T-046: Docs maintenance automation (future)

- **Status:** OPEN (backlog) — synced to Linear 2026-07-24 ([DMGD-206](https://linear.app/digital-mischief-group/issue/DMGD-206/t-046-docs-maintenance-automation-link-check-stale-status-audit-auto))
- **Size:** M
- **What:** Optional CI: markdown link check, stale `status: live` audit, archive dated drafts after 14 days. Not in scope for 2026-07-19 prune pass.
- **Reference:** `docs/ops/DOC_MAINTENANCE.md`, FEATURES Decision 8

### T-047: Temporal Observatory — Foundation milestone (Spacetime Canvas M0)

- **Status:** ⛔ **NOT HANDOFF-READY — the current surface is uncommitted.** Read the two blocks immediately below before doing anything else with this ticket. The M0/M1 narrative further down is **preserved for history but superseded**; it describes an architecture that was replaced on 2026-08-07.
- **Size:** L (Foundation / M0 only; full feature is M0–M4)

#### ⚠️ T-047 handoff blocker (audited 2026-08-13) — resolve before assigning this to anyone

**The 2026-08-07 storyboard rebuild of `/spacetime` exists only in the working tree.** It is not committed. A fresh clone does not have it, and would instead get the two-layer scroll shell that the 08-06 review browser-confirmed as broken.

- **10 untracked files:** `components/{event-inspector,evidence-legend,map-controls,playback-transport,spacetime-rail,spacetime-topbar,viewport-readout,waypoint-narrative}.tsx`, `lib/{map-controller,spacetime-theme}.ts`
- **10 modified, uncommitted files:** `actions/load-spacetime-events.ts`, `components/{evidence-layers-panel,preserve3d-globe-spike,spacetime-canvas-shell,spacetime-canvas,spacetime-globe,temporal-dial}.tsx`, `index.ts`, `lib/{normalize,temporal-stations}.ts`
- **Last commit touching the feature is `bbb32339`** (M1 close, 08-05 era) — i.e. everything after the multi-agent review is uncommitted.

Committing 20 files spanning an architecture change is a call for the repo owner, not a passing cleanup. **Until it is made, this ticket cannot be handed to another team** — they would be reading a ticket, cloning a third state, and seeing a fourth on the local disk.

#### T-047 real current state (audited 2026-08-13) — two events the older ticket text predates

The ticket below was last updated 2026-08-05. Two significant things happened after it, **neither recorded in `TODO.md` nor in `DAILY_WORK_PLAN.md`** (which has no 08-06 or 08-07 session entry at all):

1. **2026-08-06 — multi-agent review returned UNVERIFIED, not done** ([`docs/plans/2026-08-06-spacetime-canvas-multi-agent-review.md`](./2026-08-06-spacetime-canvas-multi-agent-review.md)). It **browser-confirmed** two shipped breaks at `localhost:3010/spacetime`: the globe could not be clicked, panned or zoomed (Break 1), and scroll mapped to the wrong station — **M0's own literal exit criterion** (Break 2). Its verdict: the code was real, clean and honestly labelled, but *"the feature has never been genuinely dogfooded"*; recorded M0 "MET" and M1 "closed at honest scope" both overstated. It also flagged the dead-commit-hash problem across the trackers (item 10) — still unrepaired elsewhere in this file.
2. **2026-08-07 — the architecture was replaced, and both breaks were fixed** ([`docs/plans/2026-08-07-spacetime-canvas-storyboard-realignment.md`](./2026-08-07-spacetime-canvas-storyboard-realignment.md)). Triggered by the product owner on seeing the running canvas — *"The spacetime canvas looks nothing like the provided mock ups I gave you"*. The two-layer scroll shell (globe in a `pointer-events-none .fixed.inset-0` slot under a `z-10` full-viewport `preserve-3d` narrative) was **replaced by the docked observatory layout** from spec §9 and the four storyboards: 72px header / 72px rail / **map as interactive foreground** / docked adaptive temporal instrument, with chrome docked *inside* the map region.

**Do not re-open Breaks 1 and 2 as work items.** Both were defects *of the retired scroll shell* and are fixed in the working tree, with real browser evidence in the 08-07 doc §5 — pin click (`El Indio-Guerrero UFO Crash`, 6 attempts), 12-step pan (`51.98°N,57.02°W → 56.45°N,4.54°E`), wheel zoom (`ALT 15,451 KM → 11,009 KM`), and chapter/cursor/camera agreement at 12/12. The fixes are also self-documented in source: `spacetime-canvas-shell.tsx:19-26` explains the layout change against Break 1, and `waypoint-narrative.tsx:55-95` documents the station-list mismatch that caused Break 2 and the bucketing fix. **The catch is only that none of it is committed** (see blocker above).

**What is genuinely open on T-047, once the commit question is settled:**

- **Nothing in M1's blocked half has moved.** Relationship arcs, credibility ring, source count and claims list still need **Lane A T-048 H4 (provenance)** — re-confirmed by 08-07 §7 items 2–3. This remains a real block, not a deferral.
- **`Analytics` and `Settings` rail slots render visibly inert** — no surface exists behind them (08-07 §7 item 4). Cheapest honest fix is to mark them unavailable rather than ship dead affordances.
- **Temporal precision rendering** — the 08-06 review called this *unblocked, value already computed* (§9 item 5): encode `timePrecision` into the globe paint. This is the most concrete unblocked slice on the ticket.
- **A navigation entry point to `/spacetime` still does not exist** (08-06 §9 item 4) — the route is reachable only by typing the URL.
- **The seam question the review raised is now answered by the rebuild** (08-06 §9 item 7 asked whether the globe should stay behind a scroll layer; 08-07 decided no). But **08-06 §9 item 8 is still open and still matters**: Concept 02's device is a *horizontal waypoint navigator with auto-advance*, not vertical scroll cards — settle this **before M4** builds Guided Investigations on the scroll assumption.
- **M2–M4 have no ticket-level scope.** Only plan §4 sketches them (`M2 Reconstruction`, `M3 Comparative analysis`, `M4 Narrative`), and 08-07 §7 item 1 notes M3/Concept 03 needs reconstructions that do not exist. **Anyone picking up beyond M1 needs a grooming pass first — do not treat plan §4 as an implementable spec.**

**Not verified in this audit:** no build, no dev server, no browser run was performed on 2026-08-13. The break-fix evidence above is quoted from the 08-07 document, not independently re-observed. 08-07 itself records: no production build (dev only), no browser other than automation Chrome, no mobile/touch/keyboard/screen-reader pass.
- **What:** Build the **Spacetime Canvas** — sibling surface to Research Canvas — by dropping the live Mapbox globe into the fixed background slot of the scroll-driven Guided Investigation UI (v0 timeline-explorer pattern: CSS `preserve-3d`, **zero** WebGL in the narrative layer).
  1. **M0.1** ✅ Frame-timing spike at `/spacetime?spike=1`
  2. **M0.2** ✅ Shared types — `TemporalCursor`, `SpacetimeEvent`, `TemporalLayerFeature`
  3. **M0.3** ✅ Zustand store — cursor SoT; `interactionMode: guided | free` (**D1 locked**)
  4. **M0.4** ✅ `buildTemporalStations` from event density
  5. **M0.5** ✅ Bounded load via `loadSpacetimeEvents` server action → Postgres `getSightingsByTimeChunk` (no static geojson; no INTERNAL_API_KEY)
  6. **M0.6** ~~`SpacetimeCanvas` shell — fixed globe + scroll narrative~~ — **SUPERSEDED 2026-08-07.** This describes the retired two-layer scroll shell. The shell is now the docked observatory layout (header / rail / interactive map foreground / docked instrument); see the "real current state" block above.
  7. **M0.7** ✅ Bidirectional `TemporalDial`
  8. **M0.8** ✅ `/spacetime` route (**D3 locked: sit beside** `/sightings`+`/timeline`)
- **M0 exit — recorded MET 2026-08-03, ⚠️ CONTESTED by the 08-06 review, then re-satisfied on a different architecture 08-07:** the original claim was live dogfood against real Neon + real Mapbox (384/387 events geolocated) with R1 frame-timing on the product surface (median 16.7ms, p95 17.5ms, CLS 0.00), cleared per D2. The 08-06 review found the exit criterion **did not hold** (Break 2) and that "dogfooded" meant only that the page loaded and rendered — no globe interaction was ever performed, so the geolocated count and the instrument claims were not backed by that session. Chapter/cursor/camera agreement was demonstrated on 2026-08-07 against the rebuilt layout. **Treat `384/387` as unre-measured** (08-06 §9 item 13 asked for it to be struck or re-measured; that was never done). Full detail in `docs/plans/2026-08-01-spacetime-canvas-implementation.md` §4, `DAILY_WORK_PLAN.md` "Session 2026-08-03", and the 08-06 / 08-07 plan docs.
- **M1 (evidence instrument) — partially landed 2026-08-04, closed at honest scope:**
  - ✅ Layer panel (`evidence-layers-panel.tsx`) + event inspector (`spacetime-canvas.tsx`), credibility/provenance filtering with tier stops (`Any/Thin+/Docmt+/Corrob+`) that derive reachability from the live corpus instead of exposing unreachable tiers.
  - ✅ Root-caused and fixed a real data-honesty bug: `confidence` was hardcoded `'medium'` for every sighting (`get-sightings.ts`) — now derives from real vs. thin/placeholder record content, verified against 508 live DB rows. Score bands narrowed (`0.2/0.4/0.7`) so nothing implies evidentiary weight this corpus can't support.
  - ✅ Word-boundary-safe title truncation, consolidated to one shared `truncateAtWordBoundary` (`src/lib/utils/text.ts`) across all three render call sites (verified by direct unit check of the single-event dial-station label path, the one call site not exercised live).
  - ✅ Event selection now flies the globe camera to a real on-terrain view (Mapbox DEM terrain + sky layer, zoom 15.5/pitch 70); cursor-only movement does a regional descent (zoom 8.5/pitch 45) — closes the "rendered as descent" language in the implementation plan's §1 that the original flat pan wasn't delivering.
  - ⛔ **Blocked, not skipped:** relationship arcs and precision/uncertainty rendering are gated on Lane A's **T-048 H4 (provenance backfill)** — confirmed still unlanded (T-048 is only past H0 as of this check; H1–H4 remain). There is no corroboration/precision signal in the live `sightings`-only corpus to render arcs or uncertainty *from* yet — building them now would reintroduce the same false-precision problem M1 just spent two sessions removing. Re-check T-048's status before resuming this half of M1.
  - Full detail: `DAILY_WORK_PLAN.md` "Session 2026-08-04".
- **Why:** Research Canvas organizes ideas; Spacetime Canvas organizes evidence across space + time. Same verb, orthogonal axis.
- **M0.5 (retire the static geojson path) — RESOLVED BY VERIFICATION 2026-08-05, no code change needed.** Traced every consumer; the premise had already been overtaken:
  - `SightingsGlobe` (`features/sightings/sightings-globe.tsx`, 78KB, holder of `SIGHTINGS_GEOJSON_PATH = '/sightings.geojson'` at :22) has **zero importers anywhere in `src/`** — the only textual hit is `features/sightings/README.md:43`, and it references the *refactored* variant, not this one. The static path is unreachable from the product.
  - Both live surfaces already query the DB: `/sightings` → `getSightingsBatched`; `/spacetime` → `load-spacetime-events.ts` → `getSightingsByTimeChunk`.
  - `getSightingsGeoJSON` (`services/sightings/uap-sighting.ts:84`) is also dead (its only other mention is a commented-out import in `sightings-ai-analysis.ts:3`). **Worth noting before anything ever revives it:** it silently falls back to `mock-sightings.geojson` / `mock-ufo-posts.geojson` / `mock-military-bases.geojson` when the real files are absent, logging only `console.log("Using mock data files…")`. That is precisely the fabricate-on-failure pattern M1 spent two sessions removing. If this function is ever brought back, it must fail loudly instead.
- **Proposed cleanup, NOT executed (needs a call — deletion of 70MB of assets + a 78KB component):** delete `sightings-globe.tsx`, `getSightingsGeoJSON`, and the six `public/*.geojson` files (`sightings.geojson` 46MB + `military-bases.geojson` 27MB dominate; 70MB total shipped in `public/`). Also dead alongside them: `features/sightings/old.tsx`, `chatgpt-version.tsx` (both fully commented out). Verify `sightings-globe-refactored.tsx`'s status before removing the shared `types.ts`.
- **Decisions locked 2026-08-01:** D1 bidirectional · D2 static-plate fallback if jank (not needed, see M0 exit) · D3 sit beside
- **Files:** `apps/app/src/features/spacetime/`, `apps/app/src/app/(site)/spacetime/`, `apps/app/src/services/sightings/get-sightings.ts`, `apps/app/src/services/sightings/get-events.ts`, `apps/app/src/lib/utils/text.ts`
- **Reference (paths corrected 2026-08-13 — the directory is `docs/plans/` lowercase; the old `docs/PLANS/` spelling resolves on macOS but breaks on case-sensitive Linux CI and for any agent running there):**
  - [`docs/plans/2026-08-01-spacetime-canvas-implementation.md`](./2026-08-01-spacetime-canvas-implementation.md) — original plan; §4 is the M0–M4 delivery sequence, §3 the lever rules, §7 the locked decisions
  - [`docs/plans/2026-08-06-spacetime-canvas-multi-agent-review.md`](./2026-08-06-spacetime-canvas-multi-agent-review.md) — **read before resuming**; the UNVERIFIED verdict and the two confirmed breaks
  - [`docs/plans/2026-08-07-spacetime-canvas-storyboard-realignment.md`](./2026-08-07-spacetime-canvas-storyboard-realignment.md) — **the current architecture of record**; §5 is the break-fix evidence, §7 the open list
  - `docs/vision/TEMPORAL_OBSERVATORY.md` (§9 is the primary interaction layout), `docs/adr/0002-temporal-observatory-gl4ss-integration.md`
  - Storyboards `docs/vision/storyboards/` (four concept boards, all tracked) · prototypes `docs/vision/prototypes/` — `03-temporal-geospatial-observatory.html` is spec-marked **Primary** and drove the rebuilt proportions
  - Dogfood screenshots: `docs/dogfood-output/spacetime-canvas-2026-08-07/` (`00-before.png` is the pre-rebuild state)

### T-044: Fix CRITICAL findings from disclosure-rag/main.py contract review

- **Status:** DONE — 2026-07-16 (commit `aefc21b`)
- **What:** Resolved C1 (Upstash import guard didn't cover actual URL ingestion), C2 (`--no-kb` ignored for YouTube/web URLs), C3 (entity processing read a stale second `KnowledgeBaseCRUD` instance), and H1 (web ingestion ran CocoIndex twice).
- **Why:** `docs/PLANS/2026-07-16-disclosure-rag-main-review.md` gave `main.py` a FAIL verdict; these four were the load-bearing correctness bugs blocking merge.
- **Verified:** `tests/test_postgres_client.py` 8/8, `main.py --help` imports cleanly without Upstash, C1 repro case no longer crashes at import time.
- **Reference:** `docs/PLANS/2026-07-16-disclosure-rag-main-review.md` (fix status annotated inline)

### T-045: Remaining HIGH/MEDIUM findings from disclosure-rag/main.py review

- **Status:** OPEN — synced to Linear 2026-07-24 ([DMGD-205](https://linear.app/digital-mischief-group/issue/DMGD-205/t-045-fix-remaining-highmedium-findings-from-disclosure-rag-mainpy))
- **Size:** M (review lists concrete fix directions per item; no design work needed)
- **What:** H2 (queue relocation can overwrite an existing file), H3 (relocation leaves persisted provenance stale), H4 (extracted PDF temp files never deleted), H5 (`--status` overstates CocoIndex readiness), H6 (substring-based YouTube URL detection accepts hostile URLs), H7 (completion output doesn't reflect real per-stage success/failure), M1 (eager heavy imports before arg parsing), M2 (no `main.py` regression tests), M3 (broad exception handling collapses distinct failures to `None`), M4 (no file size/type/resource limits on ingestion).
- **Why:** Review verdict is still FAIL pending these; T-044 only cleared the three CRITICAL blockers plus H1.
- **Depends on:** none blocking; M2 (tests) is worth doing first since it would catch regressions in the rest of this list.
- **Lane:** A — Corpus & Ingestion
- **2026-08-01 re-verification:** all ten items CONFIRMED still present in current `main.py`. Lint is now **26 ruff errors** (was 27) — `json` cleared, 5×F401 + 21×F541 remain. H2/H3/H4/M4 are **absorbed into T-048**; H5, H6, H7, M1, M2, M3 remain here. Note `scripts/playlist_ingestion.py:200` funnels every playlist episode through the same unfixed `process_url()`, so all items apply to bulk ingestion too.
- **2026-08-01 (later same day) — remaining six items closed, pending review:** commit `d5c69fb` (landed after the re-verification above, same day) had already closed H4, H6, H7 (the per-stage truthful reporting half), and M1 as a side effect of unrelated H0 work — that commit's own message explicitly flagged one piece of H7 as still open: `main()`'s top-line banner/exit code used `if result:` truthiness only, so a run with a failed required stage still printed "✅ Processing complete!" and exited 0. This session closed the rest: **H5** (`--status` now reads `cocoindex_processor.cocoindex_available`, the real "did `import cocoindex` succeed" signal, instead of `COCOINDEX_KG_AVAILABLE`, which only means the wrapper module imported); **H7 remainder** (`main()` now computes success from `stage_report` — any `status: "failed"` stage flips the banner to "⚠️ Processing completed with failures" and exits 1); **M3** (`process_file`'s `add_to_knowledge_base()` call and outer catch-all no longer discard already-collected `stage_report` data on failure — traceback preserved via `logger.exception`; `process_url`'s previously-unguarded extraction call now reports a failed stage instead of raising past `process_url` entirely, which also benefits `scripts/playlist_ingestion.py`'s per-episode error records); **M2** (added `tests/test_main.py`, 37 tests, isolated — no live OpenAI/Upstash/QStash/Mem0/Postgres — covering H5/H6/H7/M1/M3 regressions plus credential validation and dry-run planning). `python -m pytest tests/test_postgres_client.py tests/test_main.py` — 48/48 pass. `main.py --help` still ~0.12s (M1 intact). Six pre-existing collection failures in `tests/test_end_to_end_entity_pipeline.py`, `test_entity_creation.py`, `test_entity_creator.py`, `test_entity_extraction.py`, `test_extraction_direct.py`, `test_extraction_isolated.py` (Xata creds / stale hardcoded paths / renamed import) are unrelated to this ticket and were not touched. Not yet re-run: ruff (not installed in `.venv`). Changes are uncommitted, pending review.
- **Reference:** `docs/PLANS/2026-07-16-disclosure-rag-main-review.md`

### T-048: Ingestion hardening — corpus integrity, identity, and provenance

- **Status:** IN PROGRESS — audit + plan landed 2026-08-01; **H0 landed** (real commits **`64edf9b5`** disclosure-rag/db "H0 P0s — restore process_for_rag, dedup guard, chunk search", **`25357789`** knowledge-base "H0 archive hygiene — derived zone, dead module surface"). **H1–H5 remain; H1 (identity) is next.**
- **⚠️ H0 re-verified by artifact 2026-08-13 — two corrections and one regression.** The previously recorded hashes `cd77135` and `b6d1d5a` **do not exist in this repo** (`git cat-file -t` → missing on both); they were invalidated by the same history rewrite that killed T-050's `7fe46f0`. The work did land, under the hashes above. Verify by artifact, never by hash. What the artifacts actually show:
  - ✅ **graphify-out purged** — `find packages/knowledge-base/sources -name "graphify-out*"` returns nothing.
  - ⚠️ **"delete the dead `index.ts`/`package.json` module surface" is inaccurate as written** — both files still exist. `25357789` *neutered* rather than deleted them: `index.ts` is now 18 lines exporting only a `KNOWLEDGE_BASE_PATHS` constant, with a comment stating the package has no runtime data exports. Effect achieved, wording wrong — do not go looking for files to delete.
  - 🔴 **The relative-path fix has REGRESSED, and this is H1's problem.** `metadata/index.json` now holds **568 documents (not the 564 in the audit), 51 of which carry absolute machine-specific paths again** — e.g. `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection/packages/knowledge-base/sources/transcripts/2026-08-06/K4gYHs84BIc`. **Every regressed record sits under a `2026-08-06` or `2026-08-07` ingest directory, while both H0 commits landed 2026-08-01** (`git log -1 --format=%ci 25357789` → `2026-08-01 12:20:10 -0500`; `64edf9b5` → `12:10:03` same day). So these are records written *five and six days after* H0 normalized the archive — a genuine regression, not records H0 missed. H0 normalized the existing data but never fixed the *writer*, so each new ingest reintroduces the defect. Fixing the write path belongs in H1 alongside identity; re-normalizing the data without it just resets a counter.
  - 🔴 **H1 has not started, and it collides with an existing hash choice the plan does not address.** Zero of the 568 records carry any sha/hash field. Meanwhile `lib/knowledge_base_crud.py:180-181` already computes **md5** and labels it "dedup key / integrity check". H1 says persist **sha256**. Decide explicitly — migrate md5→sha256, or run both — before writing the column and the unique constraint; a silent second hash identity is worse than either one. **There is exactly one call site to change: `create_document()` at `knowledge_base_crud.py:235`.**
  - **Not verified:** the "6 YouTube records with dead absolute paths (missing `apps/` segment)", the 47 phantom `index.json` entries, and the 390-vs-139 unindexed-file reconciliation were not re-checked in this pass. Note H4 (provenance) is the hard gate on Lane B's T-047 M1 evidence instrument — do not confuse it with T-045's separate H4 (temp-file leak, closed by `d5c69fb`).
- **Size:** XL (H0–H5; H0 and H1 are independently shippable)
- **Lane:** A — Corpus & Ingestion
- **What:** Close the four load-bearing gaps found by the 2026-08-01 five-agent audit:
  1. **H0 — Stop the bleeding.** Purge `graphify-out/` tool cache from `sources/` (348 of 950 files, 36.6%); drop the 47 phantom `index.json` entries it created; fix the 6 YouTube records whose absolute paths are dead on this machine (missing `apps/` segment); make all 564 `path` fields relative; delete the dead `index.ts`/`package.json` module surface; reconcile the 390-vs-139 unindexed-file discrepancy between audits.
  2. **H1 — Identity.** Persist sha256 on every archive record + add column and unique constraint DB-side; backfill across all 946 files. Add the read-before-write dedup guard to `create_document()` (`knowledge_base_crud.py:133-197`) and make `_save_index()` atomic via temp-file + `os.replace()` (`:75-79`).
  3. **H2 — The bridge.** Wire `lib/db/postgres_client.py` (built, merged, called only by its own test) into the live write path; write chunks + 1536-dim `text-embedding-3-small` vectors to Neon; deprecate Upstash Search.
  4. **H3 — Runs.** `ingestion_run` table; resumable batches; per-run manifest. Model on `scripts/playlist_ingestion.py`'s already-correct atomic state + `write_run_report()` pattern.
  5. **H4 — Provenance.** Backfill source/agency/retrieval/license; enforce on new intake. **Blocks Lane B's M1 evidence instrument.**
  6. **H5 — Remote mirror.** Object-storage mirror of the archive, verified by manifest.
- **Why:** Source material can be ingested today with no guarantee it lands once, lands completely, lands anywhere the platform queries, or can be traced to its origin. Archive and database share **no join key**; web/article content has no reconciliation path at all.
- **Critical bug found (not previously tracked):** re-ingesting identical content on a *different calendar day* produces the same `doc_id` but a new date-stamped directory, and the index entry is unconditionally overwritten — **silently orphaning the previous directory's files forever, with no operator warning** (`knowledge_base_crud.py:117-131,174-183`). Same-day re-ingest overwrites in place, i.e. accidentally idempotent, not by design. No file locking exists anywhere, so concurrent runs lose updates on `index.json`.
- **Also found:** `processing/rag_prompt_pipeline.py` correctly enforces ADR-0001 (chunk bodies Evidence-only, never Inference) and produces curated `embeddable_texts` — but `upload_file_to_openai()` uploads the **raw file** instead, so those chunks are never embedded by anything. Half-finished integration.
- **Absorbs from T-045:** H2 (relocation overwrite), H3 (stale provenance), H4 (temp-file leak), M4 (no ingestion limits).
- **Decisions landed in the plan (override there):** D1 Neon pgvector as single canonical store, OpenAI vector store retained only for Assistants `file_search`; D2 filesystem is truth / Postgres is a rebuildable derived index; D3 content-hash dedup + resumable runs; D4 `sources/` is intake-only and immutable.
- **Traps:** `eisenhower_briefing (1).pdf` is a **genuinely different document** from its base file — filename-pattern dedup would destroy it; only hash-based dedup is safe. Ingestion has no relevance gate (Rick Astley's "Never Gonna Give You Up" sits in the corpus at `sources/transcripts/2025-08-31/dQw4w9WgXcQ/`, fully transcribed and summarized).
- **Corrects:** documented "1,594 entity rows embedded" → actual **1,405** across six tables; `document_entities` exists but is empty with no embedding column. `CLAUDE.md`'s "Database Work" section still says "update Xata schema through dashboard / run `xata codegen`" — stale, Xata is retired.
- **Files:** `apps/disclosure-rag/lib/knowledge_base_crud.py`, `lib/knowledge_base_service.py`, `lib/db/postgres_client.py`, `main.py`, `packages/knowledge-base/{metadata,sources,index.ts,package.json}`, `packages/db/scripts/rebuild/`
- **Reference:** `docs/plans/2026-08-01-ingestion-hardening.md`

### T-049: Board — live agent/session activity view

- **Status:** OPEN — scoped 2026-08-01 (research complete, not yet built)
- **Size:** M (data source exists; needs a polling route + a new board column/row shape)
- **Lane:** B — Platform & Experience
- **What:** Extend `/board` (`apps/app/src/app/board/`, shipped 2026-08-01 as a static ticket-status kanban) with a live view of "who/what is actively working" alongside the existing ticket columns. Today `data.ts`'s `Ticket` type has no owner, agent, or timestamp field — activity is invisible.
- **Data source (found, not built):** `.specstory/history/` — 524 existing per-session transcript files with ISO-timestamped, slugged filenames (e.g. `2026-08-01_21-17-31Z-pull-up-project-to.md`), mtimes updating live as sessions run. This requires **zero new instrumentation** — build a small polling API route that stats the directory and surfaces recent files as activity rows.
- **Dead ends already ruled out (do not re-investigate):**
  - **Liveblocks** — a dependency, but `apps/app/liveblocks.config.ts` is all-commented-out boilerplate; no `RoomProvider`/`useOthers` anywhere in the app. Its only live import is a hashed internal dist path (`@liveblocks/react/dist/suspense-fYGGJ3D9`) in `components/backgrounds/backgrounds.tsx` — likely a bad auto-import, worth its own cleanup ticket, unrelated to this one.
  - **PartySocket** — `apps/app/src/hooks/useBackendChat.ts` is a working `usePartySocket` hook with zero consumers and a required `NEXT_PUBLIC_PARTY_KIT_URL` env var. Viable later if push/real-time is ever needed; polling is sufficient for v1.
  - **`agent_inferences` (`packages/db/src/postgres/agent-inferences.ts`)** — wrong "agent." It stores the in-product mindmap AI's research-domain edge reasoning (`inference_text`, `evidentiary_state`), not coding-session activity. Its own file header bans it from feeding retrieval/derived views — do not repurpose it here.
  - `AdminDashboard.tsx` (static counts only), `agent-execution-pipeline/` (demo UI, local state only), `.claude/hooks/memory-persistence/session-end.sh` (dead — `hooks.json` points at a script path that doesn't exist, never runs).
- **Visual grammar to port (from `docs/design/design-lab/`, verified against actual files):**
  - `docs/vision/prototypes/02-evidence-ledger.html` (the real source behind `ui-mockups/evidence-ledger-claim-detail.png`) — its `.sourcecard` footer meta-row (label left / metric right) is the shape for an owner+last-touched row; its numbered provenance-lineage list is the shape for an activity feed.
  - `ui-mockups/research-desk-nuclear-thread-v2.png` — facepile with `+N` overflow and a `SYNCED ⌄` + identity chip pattern, portable into the board header beside the existing `RoadmapStrip`.
  - Both already use the board's real design-system dependency: `--ut-*` tokens + `.ut-mono`/`.ut-typewriter` defined in `apps/app/src/features/mindmap/research-canvas/canvas-animations.css` — do not introduce a second token set.
- **Hard constraints (design canon, binding):** no left accent side-stripes (the ledger mockup itself violates this — the design brief explicitly corrects it, use badge/color instead); no glow blooms or soft-SaaS radii; use redaction-bar skeletons for any loading state.
- **Open IA tension to resolve before building:** the design brief states "intelligence lives in records, waypoints, and connections — not extra sidebars of insight cards" — this argues against a bolted-on activity panel. Prefer folding activity into the existing ticket-card/column grammar (e.g. an owner+timestamp row per card) over a separate feed sidebar.
- **Why:** User asked directly for visibility into "what everyone is doing and what tasks are on the table" — the tasks half already exists (`/board`); the activity half does not.
- **Files:** `apps/app/src/app/board/page.tsx`, `apps/app/src/app/board/data.ts`, new polling API route (e.g. `apps/app/src/app/api/board/activity/route.ts`)
- **Reference:** research synthesized 2026-08-01 across three parallel passes (board code read, mockup inventory, live-source gap analysis) in the session that authored this ticket.

### T-050: Guided Tours — converge the two tour engines onto the research canvas

- **Status:** IN PROGRESS — scoped 2026-08-05; **subtasks 1 (schema) + 2 (store) landed** in **`e58eccfe`** ("T-050 subtasks 1-2 — one Zod schema, one store, explicit corpus anchors"), with follow-ups `7d12de2c` (anchor resolution) and `409da1d9` (invariant enforcement). Subtasks 3–5 open.
- **Handoff state (re-verified 2026-08-13):** pickup-ready. All subtask 1–2 code is **committed and present in a fresh clone** — no untracked work, no dirty files under `features/guided-tours/` or `features/mindmap/tours/` (`git status --porcelain` on both paths returns empty). The test suite is **green at baseline**: `cd apps/app && bun test src/features/guided-tours` → **38 pass, 0 fail, 94 expect() calls, 8 files, 3.82s**. An inheriting team can trust a red suite means *their* breakage.
  - **Hash correction:** the previously recorded `7fe46f0` **does not exist in this repo** (`git cat-file -t 7fe46f0` → missing). The work did land; the hash was invalidated by a history rewrite (see the `399dd678 lots` / `6d5d10e6 lotgs` squash commits). This is the same dead-hash class the 08-06 spacetime review flagged as process item 10 — **verify by artifact, not by hash**, anywhere in this file.
- **Size:** L (schema + store + render + launch; the "real merge", not a launch-chip alias)
- **Lane:** B — Platform & Experience
- **What:** The repo has **two unrelated things both called "tour"**, verified 2026-08-05:
  1. **Mindmap tours** (`features/mindmap/tours/`) — a thin *chronological spine*. `GuidedTourDef` is `searchQuery` + `narrative`; `resolveTourWaypoints` (`actions/tour-actions.ts`) resolves each waypoint against live Neon via `searchTable` at tour start; `use-guided-tour.ts` places `addRecordNode` nodes on the real mindmap canvas and flies `setCenter` along a fixed spine. Progress is `stepIndex` + `placedNodeIds`. Every edge is hardcoded `'Chronological tour path'`. Launches via `startGuidedTour(FAMOUS_EVENTS_TOUR)` at `graph.tsx:452`. Registry: `GUIDED_TOURS` (`famous-events-tour.ts:79`). Wired into `useMindMapUiStore.startTour/endTour`, session events, and `useActiveTourSeed` → suggestions dock.
  2. **Nuclear Shadow** (`features/guided-tours/`) — a *self-contained evidence-graph runtime* on its own route. Zod-validated `TourDefinition`; epistemic gates (`GateKey = claim | evidence | challenge | residue`); five typed narrative edges (`chronological | evidentiary | hypothesis | institutional-inheritance | contradiction`); private XYFlow (`WaypointNode`/`NarrativeEdge`/`TourFlowCanvas`), HUD + `WaypointInspector` + `EvidenceDrawer`; choreographed arrive/depart; localStorage progress. **Zero `@db/postgres` imports** — static definition + source URLs, no live corpus binding. Launches via `router.push('/tours/nuclear-shadow')` (`graph.tsx:456`/`462`, `research-canvas/typer/constants.ts:10`).
- **Why:** Nuclear Shadow has the epistemics the product identity demands (evidence tiers, challenge-before-residue, falsifiability) but leaves the research canvas entirely. Mindmap tours are on-canvas and bound to live records but say nothing about evidence. Neither alone is the "integrated research narrative engine for anomalous knowledge."
- **Subtasks:**
  1. ✅ **Schema** — DONE `e58eccfe`. `anyTourDefinitionSchema` is a Zod discriminated union on `mode` (`spine` | `evidence-graph`); spine shapes live in `guided-tours/shared/types/tour-definition.ts` and `mindmap/tours/guided-tour-store.ts` re-exports them as aliases. Every evidence-graph waypoint carries a **required** `corpusAnchor` (`query` | `record` | `none` + required `reason`) with no unset member, so "no record exists" can never be read as "not resolved yet".
  2. ✅ **Store** — DONE `e58eccfe`. `useUnifiedTourStore` holds the union of both runtimes; `useTourStore` and `useGuidedTourStore` are exact aliases of it. Field names don't collide, so all existing selectors and `getState()` calls read a superset unchanged.
  3. **Render** — evidence-graph tours mount **on the mindmap canvas**, not a second `ReactFlow`. This is the largest open subtask; the seam is fully located, so it can be picked up cold:
     - **What to delete, precisely.** `TourFlowCanvas` (`shared/components/TourFlowCanvas.tsx`) is the only thing that must not survive the port. It composes: `ReactFlowProvider` → `ReactFlow` (its own `nodeTypes`/`edgeTypes` + `Background`) → `TourChoreographer`, then `TourHUD` / `WaypointInspector` / `EvidenceDrawer` as siblings (`:35-125`). **Only the `ReactFlowProvider` + `ReactFlow` + `Background` shell is the second canvas.** Everything else in that file is portable as-is.
     - **Where it goes.** `graph.tsx:558` currently mounts `<TourOverlay />` (imported at `:35`) inside the existing mindmap `ReactFlow` (`:537-538`). That mount point is the target slot: `TourHUD` / `WaypointInspector` / `EvidenceDrawer` / `TourChoreographer` mount there, reading `useUnifiedTourStore` — which subtask 2 already made a superset of both runtimes, so no new state is needed.
     - **The one real integration cost.** `WaypointNode` and `NarrativeEdge` are registered as node/edge types on the private `ReactFlow`. Porting means registering them in the mindmap's shared registries — `features/mindmap/config/node-types.tsx` and `features/mindmap/config/edge-types.tsx` (consumed at `graph.tsx:7,9`). Namespace the keys (e.g. `tour-waypoint`, `tour-narrative`) so they cannot collide with existing mindmap node types.
     - **Graph compilation stays.** `compileTourGraph` already produces the node/edge arrays; feed its output into the mindmap's existing node/edge state instead of a private `ReactFlow`'s props. Do not reimplement it.
     - **`TourOverlay` disposition.** It is the *spine* runtime's narrative UI (`tours/tour-overlay.tsx`), still driven by `useGuidedTour`, and spine tours still need it. Do not delete it in this subtask — mount the evidence-graph overlays alongside it and let `mode` decide which renders. Deleting it is only correct if/when spine tours are folded into the evidence-graph runtime, which is **not** in T-050's scope.
     - **Acceptance:** launching Nuclear Shadow puts waypoint nodes on the *mindmap* canvas with the HUD/inspector/drawer functioning, `/tours/nuclear-shadow` still resolves (subtask 5 keeps it as a deep-link alias), exactly one `ReactFlow` instance exists in the React tree, and the 8-file suite stays green.
  4. **Resolve** — map Nuclear Shadow anchors to Neon `searchQuery`/`recordId` where real records exist. Waypoints with no corpus anchor (R&D / SAP) stay narrative-only and must be **visibly** marked as such — do not imply a record exists.
     - **Four** anchors now need live verification, not the three originally enumerated: Manhattan Project, Trinity, Roswell (`table: 'events'`) **and Smyth Report** (`table: 'documents'`), added when subtask 1 made `corpusAnchor` required. The Smyth anchor is an unverified assertion — a real published document, but nobody has confirmed the corpus holds a matching record. If it does not resolve, demote it to `kind: 'none'` rather than leaving a query that silently returns nothing.
     - `resolveAnchor()` (`shared/graph/resolve-anchor.ts`, landed with subtask 1) already holds the rule: use it rather than reimplementing resolution, so a failed lookup reports `unresolved` with the attempted query instead of collapsing into narrative-only.
  5. **Launch** — `startTour(NUCLEAR_SHADOW_TOUR)` from the graph chips / typer; `GUIDED_TOURS` becomes the single registry. Keep `/tours/nuclear-shadow` only as a deep-link alias.
- **Related (opened 2026-08-09):** **T-053 / DMGD-219** (Research Canvas Gen-UI) soft-depends on subtask 3 for RC-P4 plan→waypoint projection. T-050 does not block T-053 RC-P0–P3.
- **Pass bar:** `cd apps/app && bun test src/features/guided-tours` green — **measured baseline 2026-08-13: 38 pass / 0 fail across 8 files**, which are `shared/tests/{tour-schema,unified-tour-store,resolve-anchor,validate-any-tour}.test.ts` and `nuclear-shadow/tests/{definition,reducer,graph-compiler,choreography}.test.ts`. (The previous wording — "the 4 files under `guided-tours/tests/`" — named a directory that does not exist; there is no `guided-tours/tests/`.) Plus: `eslint` exit 0 on touched paths; **no new** `tsc` errors in touched files (repo carries a large pre-existing count — do not chase them). Definition of Done applies: the render subtask needs a dogfood visual audit, not just a green suite.
- **TDD seam:** `shared/state/tour-reducer.ts`, `shared/graph/compile-tour-graph.ts`, `shared/graph/derive-node-status.ts`, `shared/schemas/tour-definition.schema.ts` are pure and already covered. Extend those tests first.
- **Do not:** fork a second canvas; add state to `mindmap-context.tsx` (1,363-line god-object); use `router.push()` for canvas navigation (use Zustand `setActiveView()`).
- **Files:** `apps/app/src/features/guided-tours/`, `apps/app/src/features/mindmap/tours/`, `features/mindmap/graph.tsx`, `features/mindmap/actions/tour-actions.ts`, `app/(site)/tours/nuclear-shadow/page.tsx`
- **Reference:** engine-delta analysis 2026-08-05 (this session); `features/guided-tours/NuclearShadowTour.md`

### T-051: OpenAI Vector Store MCP server (`packages/openai-vector-store-mcp`)

- **Status:** BUILT, UNCOMMITTED — code-complete and **verified live over stdio 2026-08-09**; **not reachable from Claude Code** ([DMGD-218](https://linear.app/digital-mischief-group/issue/DMGD-218/lane-b-packagesopenai-vector-store-mcp-mcp-server-exposing-openai), Linear state **Backlog**). `git status` shows `?? packages/openai-vector-store-mcp/` — the whole workspace is untracked, zero commits, absent from a fresh clone. "Finished" means runnable, not landed.
- **Size:** S (register in root `.mcp.json`, pin the FastMCP floor, commit; the server itself is written)
- **Lane:** B — Platform & Experience. It exposes the **retrieval surface external agents traverse** ("can a researcher/agent see and traverse the evidence"), even though Lane A's disclosure-rag ingestion is what populates the underlying store. Same rationale recorded on DMGD-218 — if that call is reversed, reverse it in both places.
- **What:** A FastMCP server (`src/openai_vector_store_mcp/server.py`, console script `openai-vector-store-mcp`) exposing ChatGPT deep-research-compatible `search` and `fetch` tools over the **same OpenAI Vector Store** the app's Prometheus chat and disclosure mindmap agent use for `file_search` — verified, not assumed: `api/prometheus/chat/route.ts:76` reads `process.env.OPENAI_VECTOR_STORE_ID` directly, and `services/ai/openai/config.ts:26` derives `PROMETHEUS_VECTOR_STORE_ID` from the same variable for the mindmap route (`api/disclosure/mindmap/route.ts:178`). The MCP server resolves that same variable (as a fallback behind `VECTOR_STORE_ID`) and even mirrors the app's `cleanOpenAIId` sanitizer as `clean_openai_id`. `search(query)` → `{ results: [{ id, title, url }] }` via `vector_stores.search`; `fetch(id)` → `{ id, title, text, url, metadata? }` via `vector_stores.files.content` + `files.retrieve`. Citation URLs are `https://platform.openai.com/storage/files/{file_id}`. Transports: `stdio` (Cursor/local), `sse` (remote/ChatGPT), `http`, selected by `MCP_TRANSPORT`.
- **Evidence (2026-08-09, this session):**
  - `ls packages/openai-vector-store-mcp/.venv` → `bin include lib pyvenv.cfg`, and `.venv/bin/openai-vector-store-mcp` exists. `bun run setup` **has** been run; this is installed, not just scaffolded.
  - `timeout 15 .venv/bin/openai-vector-store-mcp < /dev/null` → exit 0, `Starting MCP server with transport=stdio`, FastMCP **3.4.6** banner, clean EOF shutdown.
  - In-process tool call through the FastMCP server object: `list_tools()` → `['fetch', 'search']`; `search("Roswell")` → **10 results**, first title `AARO_Historical_Record_Report_Vol_1_2024.pdf`; `fetch(<that id>)` → **168,636 chars** of text, correct citation-URL prefix. **The tools work end-to-end against the live vector store.**
- **Gaps / action items:**
  1. **Not in root `.mcp.json`.** That file registers only `context7`, `chrome-devtools`, `DeepGraph Next.js MCP`, `open-knowledge`. `.cursor/mcp.json` **does** register it as `openai-vector-store` pointing at the absolute `.venv/bin/openai-vector-store-mcp` path — so **Cursor can reach this server and Claude Code sessions in this repo cannot.** Adding it changes the tool surface for every future session here, so it is left as a deliberate action item, not done in passing.
  2. **The workspace is untracked.** Decide whether it gets committed (see open questions).
  3. **`pyproject.toml` floors `fastmcp>=2.0`, but the code is FastMCP-3-only** — `output_schema=` on `@mcp.tool`, and host/port passed as `run()` transport kwargs (the source comment says so in as many words). The installed venv happens to hold 3.4.6, so a fresh `bun run setup` that resolves 2.x is a plausible break. Floor it at `fastmcp>=3`. (Verified the code *requires* 3.x, not that it breaks on 2.x — nobody ran it against 2.x.)
- **Env, useful to know:** there is **no `.env` in the package** and it works anyway — `load_env_files()` walks `__file__`-relative to the package `.env`, then repo-root `.env`, `.env.local`, and `apps/app/.env.local` with `override=False`, and root `.env` already carries `OPENAI_API_KEY` + `OPENAI_VECTOR_STORE_ID`. The README's `cp .env.example .env` step was never run and does not need to be. `.cursor/mcp.json` accordingly sets only `MCP_TRANSPORT` and pastes no secrets.
- **Dependencies:** none blocking. Corpus quality is inherited from whatever Lane A (T-048) has pushed into the OpenAI vector store — this server does not ingest, it only reads.
- **Not verified — do not assume:** only **stdio** was exercised. The `sse` and `http` transports are untested here; the README lists three transports and that should not be read as three verified ones. No test suite exists in the package (`scripts/` is empty, no tests).
- **Files:** `packages/openai-vector-store-mcp/` (`src/openai_vector_store_mcp/server.py`, `pyproject.toml`, `package.json`, `README.md`, `OpenAIVectorStoreMcp.md`, `.env.example`), `.cursor/mcp.json`, root `.mcp.json` (pending)

### T-052: Disclosure Lab — Neon admin/DX explorer (`apps/disclosure-lab`)

- **Status:** IN PROGRESS — 2026-08-09 — claimed against [DMGD-216](https://linear.app/digital-mischief-group/issue/DMGD-216/lane-b-build-appsdisclosure-lab-neon-admin-console-read-only-assistant) (Linear **In Progress**). Canonical spec: [`docs/plans/2026-08-09-disclosure-lab.md`](./2026-08-09-disclosure-lab.md) (copied from grilling plan; domain-docs landed in `CONTEXT-MAP.md` + `packages/db/CONTEXT.md`).
- **Size:** L (new app in `apps/`, write-policy layer, agent tool surface, six routes)
- **Lane:** B — Platform & Experience. Explicitly **not** Research Canvas: it is a database-context admin console, and the Canvas "inference-only write" rule scopes to `apps/app` only.
- **What:** A separate Next.js 15 app (`@disclosure-lab`) giving internal visibility/DX into Neon data fidelity. Home `/` is a **split pane** — record browser left, read-only AI assistant right, with the selected row auto-attached to the assistant as a clearable context chip. Plus `/overview` (counts + embedding coverage), `/sql`, `/charts` (Recharts), `/search` (FTS/vector smoke), `/audit`.
  - **Writes are human-only.** The agent (`/api/agent`, Vercel AI SDK `streamText`) gets read/analyze tools only — `listTables`, `describeSchema`, `searchDatabase`, `runSqlRead` (SELECT/WITH/EXPLAIN), `getRecord`/`listRecords`, `aggregate`. No agent mutation in v1.
  - **INSERT/UPDATE only, on an entity-table allowlist**, with **confirm-every-write** (including single-field saves) → confirm card → execute → JSONL audit trail. `document_chunks`, `agent_inferences`, join tables, and DDL are not writable. UPDATE without `WHERE` is rejected.
  - **No deletes anywhere in v1** — `DELETE`/`TRUNCATE` hard-blocked in both GUI and `/sql`, alongside `DROP|ALTER|GRANT|REVOKE|CREATE`.
  - Stack: Next.js 15 App Router + TypeScript + Tailwind + Recharts + Vercel AI SDK; data access via `@db/postgres` only (never `@db/xata`). No Clerk, no public deploy assumed.
- **Why:** There is no internal surface for inspecting or correcting Neon record fidelity today. Lane A ingestion writes the corpus; nothing lets a human see what actually landed or fix a bad row without hand-writing SQL.
- **Dependencies:** None blocking, but it **reads and writes the same live shared `DATABASE_URL` that Lane A's ingestion work (T-048) populates** — intentional per grilling Q4. Coordinate before either lane assumes exclusive control of schema changes.
- **Open questions resolved:** writable table is `key_figures` (alias `personnel` via `resolveTable`); CONTEXT-MAP now scopes inference-only writes to Research Canvas.
- **Files:** `apps/disclosure-lab/` (in progress), `docs/plans/2026-08-09-disclosure-lab.md`
- **Reference:** Linear DMGD-216; FEATURES Decision 10

### T-053: Research Canvas Gen-UI upgrade — Deep Research loop + agentic session

- **Status:** OPEN / Backlog — 2026-08-09 — opened against [DMGD-219](https://linear.app/digital-mischief-group/issue/DMGD-219/lane-b-research-canvas-gen-ui-upgrade-deep-research-loop-agentic) (Linear **Backlog**, label Feature). Canonical spec: [`docs/plans/2026-08-09-research-canvas-genui.md`](./2026-08-09-research-canvas-genui.md). FEATURES Decision 11.
- **Size:** L (console Gen-UI + session slice + mindmap route mode + dossier bridge; RC-P4 soft-blocked on T-050)
- **Lane:** B — Platform & Experience
- **What:** Feature upgrade for the live `/research-canvas` mindmap shell. Steal interaction models from two Gen-UI reference apps — **not** their stacks:
  1. [ai-deep-research-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent) — plan → multi-hop research → durable report + ToolCards.
  2. [ai-dashboard-canvas-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent) — thin chat; agent mutates shared AgentState onto a primary canvas.
  - **Already true today:** Graph is the product surface; `ResearchCanvasConsole` is the rail; `useMindMapAgent` → `runAgentQueryAndAddNodes` already writes nodes/edges; T-027 `researchSession` exists but is underused; `deepResearchEnabled` + typer “Deep Research” card are dead chrome.
  - **Missing:** inspectable ToolCards; `plan`/`sources`/`artifacts` on `researchSession`; session injected into turn context; Deep Research mode that changes prompt/tool policy; mid-run dossier → `SynthesisPanel`; plan→waypoints (after T-050).
- **Subtasks (RC-P0 → RC-P4):**
  1. **RC-P0 — Tool cards** — `EnhancedAnimatedChat` renders `AgentToolEvent` as expandable cards (no backend change).
  2. **RC-P1 — AgentState** — Extend `ResearchSessionState` with `plan[]`, `sources[]`, `artifacts[]`; mirror tool completes; serialize into `runAgentQuery` turn context.
  3. **RC-P2 — Wire Deep Research mode** — Typer card + `deepResearchEnabled` → `activeMode` + `researchFocus: 'deep-research'` on `/api/disclosure/mindmap` (plan-first prompt).
  4. **RC-P3 — Dossier bridge** — Artifacts → `SynthesisPanelHost`; optional `agent_inferences` persist (ADR-0001 — never retrieval).
  5. **RC-P4 — Plan → waypoints** — Project plan onto on-canvas waypoints after T-050 render (same React Flow; no second canvas).
- **Do not:** CopilotKit / ADK / LangGraph product path; Workspace sidecar; KPI Recharts agent dashboard; Gen-UI in `features/research-canvas/*` Storybook islands; new state in `mindmap-context.tsx`.
- **Dependencies:** Soft-deps **T-050** for RC-P4 only. Related to **T-027** (`researchSession`). Not blocked on T-048 H4.
- **Pass bar:** Dogfood Deep Research mode on `/research-canvas` — plan visible, multi-tool cards, liturgy-tagged dossier, no sidecar Workspace. Definition of Done applies.
- **Files:** `features/mindmap/research-canvas/EnhancedAnimatedChat.tsx`, `research-canvas-console.tsx`, `hooks/use-mindmap-agent.ts`, `graph.tsx`, `store/mindmap-ui-store.ts`, `components/synthesis-panel.tsx`, `app/api/disclosure/mindmap/route.ts`
- **Reference:** Linear DMGD-219; FEATURES Decision 11; fit canvases `research-canvas-genui-fit` / `deep-research-agent-fit`

---

### T-054: Trace Map — provenance graph per processed source

- **Status:** DONE (deterministic layer) — 2026-08-10
- **Lane:** A — Corpus & Ingestion
- **Size:** M
- **What shipped:** `apps/disclosure-rag/lib/trace_map.py` builds a `trace-map.v1` graph
  (`docs/TRACE_MAP_OUTPUT_SPEC.md`) from the RAG pipeline result plus the timed transcript
  sidecar, and writes `<stem>_trace_map.json` + `<stem>_trace_map.md` into the bundle. Wired
  into the YouTube path (`lib/youtube.py:generate_transcript`) and the local-file path
  (`main.py:process_file`), graded as a `Trace map` stage in the run summary.
- **Why it matters:** every extracted claim and entity is now citable to a character span and a
  timestamp. Before this, nothing downstream of the chunker could point back at the moment in
  the source that supported it.
- **Deliberately deterministic:** no LLM call. Node typing is decided by whether the text
  anchors in the source — an assertion that does not locate is an `inference` carrying
  `[Inferred]`, never a Claim. `validate_trace_map()` returns `errors` (artefact is wrong) and
  `gaps` (spec asks for something no stage produces) as separate lists, so a thin map can never
  be made to look complete by fabricating the missing nodes.
- **Tests:** `apps/disclosure-rag/tests/test_trace_map.py` (29).
- **Files:** `lib/trace_map.py`, `lib/youtube.py`, `lib/knowledge_base_service.py`, `main.py`,
  `docs/TRACE_MAP_OUTPUT_SPEC.md`, `tests/test_trace_map.py`

### T-055: Trace Map — interpretive layer (Readings, Counter-readings, Next Traces)

- **Status:** OPEN
- **Lane:** A — Corpus & Ingestion
- **Size:** M
- **Depends on:** T-054
- **Problem:** the spec's frontier requires Readings paired with Counter-readings and Next
  Traces naming concrete records to pull. Nothing in the chain produces them, so every map
  reports them as gaps. `open_question` only appears when `content_assessment.follow_up_needed`
  happens to be populated, which varies run to run.
- **Scope:** one new registry prompt run after `validation`, taking the anchored claim/evidence
  set and returning Readings + required Counter-readings, Open Questions, and Next Traces with
  targets and rationale. Output merges into the existing graph; the deterministic layer stays
  untouched and remains the fallback when the prompt fails.
- **Also in scope:** evidence→claim linkage. Today `supporting_evidence` /
  `contradictory_evidence` arrive as flat lists with no target claim, so evidence carries a
  stance but names no claim it bears on. Guessing the target by lexical overlap was rejected —
  it invents an epistemic relationship. The prompt should emit the linkage explicitly.
- **Pass bar:** a map whose Readings each have a Counter-reading and whose Next Traces each name
  a target and a rationale, with `validate_trace_map` reporting zero errors and the gap list
  shrinking to speaker attribution only.

### T-056: Trace Map on the web-article path

- **Status:** OPEN
- **Lane:** A — Corpus & Ingestion
- **Size:** S
- **Depends on:** T-054
- **Problem:** `processing/web_content_processor.py` produces a `rag_pipeline` result but no
  trace map, because its bundle is assembled downstream in `knowledge_base_service` and the
  output directory is not available where the pipeline result is. A web-article run therefore
  reports `Trace map: skipped — not built on this path`. Deliberate deferral, not an oversight.
- **Scope:** thread the bundle directory to the pipeline result, or build the map at the
  assembly point. Web articles have no timed segments, so the map anchors by character offset
  and reports `coverage.timed: false` — that path already works and is tested.

### T-057: UAP podcast playlist bulk-ingest manifest

- **Status:** OPEN
- **Lane:** A — Corpus & Ingestion
- **Size:** S
- **Depends on:** T-048 **H1** (sha256 + dedup) — do not bulk-run 52 playlists before identity is stable
- **Problem:** Curated catalog of **52** YouTube podcast playlists (21 UAP-relevant channels) exists outside the repo; no prioritized ingest manifest wired to `scripts/playlist_ingestion.py`.
- **Scope:**
  1. Add a versioned manifest under `apps/disclosure-rag/` (e.g. `data/playlist_manifests/uap-podcasts-tiered.txt`) sourced from the user's playlist catalog — tier **P0** (core UAP: That UFO Podcast, Elizondo, Sol Foundation, Disclosure Team, Corbell, Area52, Jesse Michels, Curt Jaimungal, etc.), **P1** (adjacent: Rogan archive, Shawn Ryan, Why Files), **P2** (defer: general news/Tom Bilyeu unless explicitly wanted).
  2. Document run command: `python scripts/playlist_ingestion.py --from-file <manifest> [--upload]` with checkpoint/resume expectations.
  3. Pilot **one P0 playlist** end-to-end (transcript → trace map → KB bundle) before full batch.
- **Do not:** Stand up n8n or Apify as the ingest path — use existing `playlist_ingestion.py` + `lib/youtube.py`.
- **Pass bar:** Manifest in repo; pilot playlist produces valid `trace-map.v1` sidecar + ingested bundle; run report lists per-episode outcomes.

### T-058: Grouped video transcript retrieval + timestamp citations (live AI paths)

- **Status:** OPEN
- **Lane:** B — Platform & Experience
- **Size:** M
- **Depends on:** T-054 (trace maps with timed segments); soft-deps T-057 for corpus volume
- **Problem:** Mindmap and Prometheus retrieval return document/entity hits but not **breadth-across-videos** grouped results or **YouTube deep links with `&t=`** timestamps — patterns demonstrated in `packages/ai/prompts/youtube-rag-search-with-apify-qdrant-and-ai-frontend-workflow.json` (Qdrant search groups + LLM extract + `video_ts`).
- **Scope:** Port the *behavior*, not the stack:
  1. When `searchDatabase` (or a dedicated tool) hits `document_chunks` sourced from YouTube transcripts, group results by `video_id` / source URL (max N chunks per video).
  2. Surface timestamp + excerpt in tool/SSE payload (from trace-map segment metadata or chunk offsets).
  3. Render in Research Canvas / Prometheus as clickable timestamp links (no HTMX/n8n UI).
- **Do not:** Add Qdrant, Redis rate-limit webhooks, or Apify — Neon pgvector + existing FTS/RRF fusion only; locked `text-embedding-3-small` @ 1536.
- **Pass bar:** Dogfood query across ≥2 ingested podcast episodes returns grouped excerpts with working `youtube.com/watch?v=…&t=` links in the running app.

### T-059: Playlist-id corpus index (skip already-ingested)

- **Status:** OPEN
- **Lane:** A — Corpus & Ingestion
- **Size:** S
- **Depends on:** T-048 **H1**; soft-deps T-057
- **Problem:** The n8n playlist analyst workflow checks Qdrant for an existing collection before re-processing; we have per-episode checkpoint state in `playlist_ingestion.py` but no **playlist-level** lookup for agents ("has playlist `PL…` been ingested? how many episodes?").
- **Scope:**
  1. Record `playlist_id` (+ channel, title, episode count) on ingest manifests / run reports.
  2. Expose lookup helper (Python CLI flag or thin `@db/postgres` query if episodes land in `documents` metadata) so Lane B agents can skip re-fetch when corpus is warm.
  3. Pattern reference: `packages/ai/prompts/ai-youtube-playlist-video-analyst-chatbot-workflow.json` intent routing + "already processed?" branch — implement against KB index, not ephemeral Qdrant collections.
- **Do not:** Per-session Redis context or Gemini `text-embedding-004` collections.
- **Pass bar:** Given a playlist URL/ID, operator or agent gets `{ingested, total, last_run}` without re-running transcript fetch.

### T-060: Drop-to-Canvas — drop a file, see it connect to the corpus

- **Status:** IN PROGRESS — opened 2026-08-13, delegated to two parallel agents (server + canvas)
- **Lane:** B — Platform & Experience
- **Size:** M
- **Canonical contract:** `docs/plans/2026-08-13-canvas-drop-ingest-contract.md` — **the fixed interface between the two halves. Read it before touching either side.**
- **Problem:** A researcher holding a document has no way to ask this corpus "what does this connect to?" They must manually guess search terms for something they are already holding. The corpus has 6,540 embedded vectors and an RRF fan-out (`searchDatabase`) that can answer that question directly.
- **Scope:**
  1. `POST /api/processing/drop` — multipart → extract (utf8 / pdf / vision-caption) → `embedQuery` → `searchDatabase({embedding})` fan-out → ranked matches. Raw file to `@vercel/blob`.
  2. Canvas drop target on `graph.tsx`, a namespaced dropped-artifact node type, staged progress, edges to matches, match inspector. Zustand state only.
- **Route placement is load-bearing:** `/api/processing/*` is the **only** Clerk-gated API prefix (`middleware.ts:9-11`). Anywhere else = public unauthenticated file upload calling paid OpenAI embeddings.
- **Do not:**
  - **`INSERT` anything into `documents` / `document_chunks` / entity tables.** `grep -rn "INSERT INTO" packages/db/src` = exactly one hit (`agent-inferences.ts:54`); corpus writing is Python-only and sits on top of the **still-open T-048 H1 md5-vs-sha256 decision**. Dropped vectors are session-scoped. Persisting a dropped artifact into the corpus is a separate gated action and is explicitly **out of scope for T-060** — see open question below.
  - **Use CLIP or any image-native embedding.** `text-embedding-3-small` @ 1536 is locked corpus-wide; foreign vectors compare to nothing and the fan-out would silently return noise. Images → caption/OCR → text → `embedQuery`.
  - **Add a fourth upload component.** Three exist (`UploadZone.tsx` 750L, `services/ai/components/upload-zone.tsx` 803L, `components/file-upload/index.tsx` 177L — first two appear dead or icon-only). Same mistake as the two tour engines (T-050).
  - **Render `_rrfScore` as a percentage or confidence bar.** It is a rank-agreement number, not a similarity. Fake precision violates the evidence-tier identity.
  - Add state to `mindmap-context.tsx` (frozen god-object).
- **Open question (needs a human call, does not block):** should a dropped artifact ever be *persisted* into the corpus? That requires a second TS corpus writer and is gated on T-048 H1 landing a hash column + unique constraint. Read-only is the complete T-060 deliverable.
- **Pass bar:** Drag a real text file, a real PDF, and a real image onto the research canvas in the running app. Each produces an artifact node with edges to corpus records within one interaction, with no page reload. `matches: []` renders as "no connections found" — a legitimate result, not an error toast. Image drops visibly disclose that matching ran against a generated caption. Evidence + dogfood visual audit per `AGENTS.md`, or reported **UNVERIFIED**.

---

## Follow-Up: T-016 Phase 2 (Discovered 2026-06-17)

### T-030: Migrate 6 /api/disclosure/chat consumers to /api/disclosure/mindmap

- **Status:** DONE — 2026-06-20 (6 consumers repointed; chat route deleted; commit 633216d)
- **Size:** M (half day)
- **Dependencies:** T-016 (done)
- **What:** T-016 audit found `/api/disclosure/chat` has 6 active UI consumers blocking deletion. Migrate each to `/api/disclosure/mindmap` (schemas are compatible — both are Assistants + SSE protocol), then delete `apps/app/src/app/api/disclosure/chat/`.
- **Note:** Also verify `disclosure/chat/route.ts` line ~255 calls `anthropic('claude-4-sonnet-20250115')` — confirm this model string is valid.

### T-031: Delete broken historical-query chain

- **Status:** DONE — 2026-06-20 (chain + tour-state agents deleted, consumers stubbed; commit 633216d)
- **Size:** S (2 hours)
- **Dependencies:** None (entire chain is dead — 501 responses, full Xata dependency retired)
- **What:** Delete as a batch:
  - `apps/app/src/app/api/historical-query/route.ts`
  - `historical-query-agent.ts`
  - `historical-query-server-actions.ts`
  - `research-runtime.ts`
  - `tour-state-agent.ts`
  - Fix or remove any mindmap bottom-menu consumers that call this dead chain
- **Why:** Silently fails at runtime — the whole tree calls retired Xata APIs.

---

## Completed

| ID | Task | Completed |
| ---- | ------ | ----------- |
| T-001 | Remove Edge runtime from Prometheus chat route | 2026-03-29 |
| T-002 | Fix 3 broken API routes | 2026-03-29 |
| T-014 | Split processDocument into granular tools | 2026-04-05 |
| T-015 | Standardize context injection | 2026-04-05 |
| T-013 | Add graph-write tools to disclosure mindmap route | 2026-04-05 |
| T-011 | Replace hardcoded sightings with real Postgres query | 2026-06-17 |
| T-012 | Add Zod validation to 4 API routes | 2026-06-17 |
| T-016 | Annotate / audit chat routes (phase 1 — consumers block deletion) | 2026-06-17 |
| T-017 | Wire testimony queue as cron endpoint | 2026-06-17 |
| T-018 | Extract pure node factories from mindmap-context | 2026-06-17 |
| T-019 | Move graph-init effect into use-graph-init hook | 2026-06-17 |
| T-021 | Create .env.example | 2026-06-17 |
| T-022 | Create docs/archive/ and move obsolete files | 2026-06-17 |
| T-024 | Create docs/API_ROUTES.md | 2026-06-17 |
| — | Ground CLAUDE.md, AGENTS.md, CORE_APP_AI_ARCHITECTURE_OVERVIEW.md, AGENT_ONBOARDING_CHECKLIST.md | 2026-03-29 |
| — | Generate docs/CONTRIB.md | 2026-03-29 |
| — | Generate docs/RUNBOOK.md | 2026-03-29 |
| — | Documentation roundtable report | 2026-03-29 |

---

## Dependency Graph

```
Phase 0 (emergency)
  T-001 ✅ done
  T-002 ✅ done
  T-003 (auth middleware) ─────────────────────┐
                                                ▼
Phase 1 (delete dead code)          T-025 (rate limiting)
  T-004 (ghost routes)
  T-005 (dead shells)
  T-006 (prune index) ◄── T-005
  T-007 (consolidate xata-to-xyflow)
                    │
Phase 2 (core UX)   ▼
  T-008 (paginate graph) ◄── T-007
  T-009 (fix EmptyCanvas)
  T-010 (wire chips)
  T-011 (real sightings data)
  T-012 (Zod validation) ◄── T-002

Phase 3 (agent hardening)
  T-013 ✅ done (graph-write tools) ◄── T-015 ideally
  T-014 (split processDocument)
  T-015 ✅ done (standardize context)
  T-016 (unify routes) ◄── T-014, T-015
  T-017 (testimony cron)

Phase 4 (state management)
  T-018 (extract factories)
  T-019 (graph init effect) ◄── T-018
  T-020 (UI state to Zustand) ◄── T-018
```
