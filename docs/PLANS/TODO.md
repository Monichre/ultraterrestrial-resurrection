---
status: live
role: eng
spine: do
updated: 2026-07-19
---

# TODO — Ultraterrestrial Resurrection

**Last Updated:** 2026-07-19
**Source:** Roundtable audit (4 specialists) + agent-native remediation audit
**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`
**Branch:** dev

> **2026-07-10 session note:** Scaffolded Matt Pocock engineering-skills config (`docs/ops/issue-tracker.md`, `triage-labels.md`, `domain.md`; `## Agent skills` block in `CLAUDE.md`). Built first-pass system-wide domain model: `CONTEXT-MAP.md` (4 contexts), `CONTEXT.md` (full glossary — reserved words, adopted vocabulary, 8 evidentiary states, all record types, classification taxonomy, Phase 2 reserved names). First ADR: `docs/adr/0001-agent-inferences-excluded-from-retrieval.md`. New ticket created for follow-up context files (see T-043 below).

> **2026-07-19 docs prune:** Completed spine restructure per FEATURES Decision 8. See `docs/README.md`, `docs/ops/PRUNE_MATRIX.md`. T-039 follow-up closed for filesystem/layout; optional automation → T-046.

---

## How to Use This File

Pick a task. Check its status and dependencies. If status is `OPEN` and dependencies are met, claim it by changing status to `IN PROGRESS — [your agent name] — [date]`. When done, change to `DONE — [date]`. If blocked, change to `BLOCKED — [reason]`.

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
- **Cutover:** Linear owns actionable tickets and status. `FEATURES.md` remains strategic, `DAILY_WORK_PLAN.md` is a session log, and this file is the historical `T-*` migration ledger. New implementation tickets go to Linear; do not extend this ledger.
- **Why:** User's own words: "integrate Linear so that task tracking just seems completely fucking invisible to me right now."
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

- **Status:** IN PROGRESS — plan landed 2026-08-01 (`3b00dae`); scaffold next
- **Size:** L (Foundation / M0 only; full feature is M0–M4)
- **What:** Build the **Spacetime Canvas** — sibling surface to Research Canvas — by dropping the live Mapbox/deck.gl globe into the fixed background slot of the scroll-driven Guided Investigation UI (v0 timeline-explorer pattern: Next + GSAP + Lenis, CSS `preserve-3d`, **zero** WebGL in the narrative layer).
  1. **M0.1** Frame-timing spike: globe under `preserve-3d` sibling (risk R1).
  2. **M0.2** Shared types — `TemporalCursor`, `SpacetimeEvent`, `TemporalLayerFeature`.
  3. **M0.3** Zustand store — cursor as single source of truth; `mode: 'guided' | 'free'` (pending D1 confirm).
  4. **M0.4** Adaptive temporal stations from event density.
  5. **M0.5** Repoint `sightings-globe.tsx:22` off static `/sightings.geojson` onto `/api/disclosure/uap-sightings` (already bounded).
  6. **M0.6** `SpacetimeCanvas` shell — fixed globe + scroll narrative layers.
  7. **M0.7** Bidirectional `TemporalDial`.
  8. **M0.8** `/spacetime` route (pending D3: replace vs sit beside `/sightings`+`/timeline`).
- **Why:** Research Canvas organizes ideas; Spacetime Canvas organizes evidence across space + time. Same verb, orthogonal axis. No shared temporal cursor exists today — every later milestone depends on it.
- **Open decisions (block specific tasks):**
  - **D1** Cursor authority — bidirectional recommended (blocks M0.3)
  - **D2** R1 fallback — static plates per waypoint if globe janks (blocks M0.6)
  - **D3** Does `/spacetime` replace `/sightings`+`/timeline`, or sit beside? (blocks M0.8)
- **Files:** `apps/app/src/features/spacetime/` (greenfield), `apps/app/src/features/sightings/sightings-globe.tsx`, `apps/app/src/app/(site)/spacetime/`
- **Reuse:** GSAP + Lenis already in `apps/app/package.json`; `useTimeSeriesAnimation.tsx`; `animated-arc-layer.tsx`; bounded uap-sightings API
- **Blocked-by (for any GL4SS source reuse only):** AGPL-3.0 licensing determination — see ADR 0002. Concept-level porting is unblocked.
- **Reference:** `docs/PLANS/2026-08-01-spacetime-canvas-implementation.md`, `docs/vision/TEMPORAL_OBSERVATORY.md`, `docs/adr/0002-temporal-observatory-gl4ss-integration.md`, storyboards in `docs/design/design-lab/storyboards/`

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
- **Reference:** `docs/PLANS/2026-07-16-disclosure-rag-main-review.md`

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
|----|------|-----------|
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
