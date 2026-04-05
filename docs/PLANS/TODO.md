# TODO — Ultraterrestrial Resurrection

**Last Updated:** 2026-03-29
**Source:** Roundtable audit (4 specialists) + agent-native remediation audit
**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`
**Branch:** dev

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
- **Status:** OPEN
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
- **Status:** OPEN
- **Size:** M (1 day)
- **Dependencies:** None
- **Files:** `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts`
- **What:** Has 6 hardcoded sighting records. Create a server action fetching from 130K+ sighting records in Xata, falling back to local data on failure.
- **Acceptance:** Sightings view shows real data from Xata. Fallback works if DB is unreachable.

### T-012: Add Zod validation to remaining API routes
- **Status:** OPEN
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
- **Status:** OPEN
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
- **Status:** OPEN
- **Size:** M (2-3 days)
- **Dependencies:** T-014, T-015
- **What:** Keep two routes with clear ownership:
  - `/api/disclosure/mindmap` — Assistants API + SSE, for graph canvas (persistent threads, file_search)
  - `/api/prometheus/chat` — AI SDK streamText, for standalone chat
  - Delete `/api/chat/route.ts` (alias) and `/api/disclosure/chat/route.ts` (overlapping). Rewire all consumers.
- **Acceptance:** Only 2 chat-related routes remain. All consumers rewired. Build passes.

### T-017: Wire testimony queue worker as cron
- **Status:** OPEN
- **Size:** S (1 day)
- **Dependencies:** None
- **Files:** `scripts/workers/testimony-queue-worker.ts` → adapt into `/api/cron/process-testimonies/route.ts`
- **Acceptance:** Cron endpoint processes queued testimonies. Worker script is deleted or deprecated.

---

## Phase 4 — State Management & Architecture (Days 10-15)

### T-018: Extract pure factories from mindmap-context
- **Status:** OPEN
- **Size:** S (half day)
- **Dependencies:** None
- **Files:** `apps/app/src/contexts/mindmap/mindmap-context.tsx` → new `features/mindmap/utils/node-factories.ts`
- **What:** Move `createRootNode`, `createRootNodeChild`, `createSiblingEdge`, `createRootNodeEdge`, `createRootNodeEdges` to a utils file. These are pure transforms with no React state dependency.
- **Acceptance:** Factory functions importable from utils. Context no longer defines them.

### T-019: Move graph init effect out of context
- **Status:** OPEN
- **Size:** S (half day)
- **Dependencies:** T-018
- **Files:** `mindmap-context.tsx` (line ~408) → `graph.tsx` or new `useGraphInit` hook
- **What:** The `useEffect` reads `graph3d` and calls `setGraph`. Move to `graph.tsx` or a hook.
- **Acceptance:** Context no longer has graph init side effect.

### T-020: Move UI-local state to Zustand
- **Status:** OPEN
- **Size:** S (1 day)
- **Dependencies:** T-018
- **Files:** `mindmap-context.tsx` → `features/mindmap/store/mindmap-ui-store.ts`
- **What:** Move 5 `useState` calls (`activeNode`, `conciseViewActive`, `showLocationVisualization`, `locationsToVisualize`, `keepLoadedOnMap`) to Zustand as a `canvas` slice.
- **Acceptance:** Context shrinks from ~1,363 lines to ~200-300. Moved state accessible via Zustand selectors.

---

## Documentation Tasks

### T-021: Create .env.example
- **Status:** OPEN
- **Size:** XS (2 hours)
- **Dependencies:** None
- **What:** Mirror current `.env` structure (212 vars) with placeholder values. Document each var's purpose and which service it belongs to. Reference: `docs/CONTRIB.md` already lists all vars.
- **Acceptance:** `.env.example` exists at repo root. All 212 vars present with comments.

### T-022: Create docs/archive/ and move obsolete files
- **Status:** OPEN
- **Size:** XS (2 hours)
- **Dependencies:** None
- **What:** Create `docs/archive/` with subdirectories: `sessions/`, `status-reports/`, `scrapped-plans/`, `design-explorations/`. Move 50+ files from June-September 2025. See `docs/plans/2026-03-29-documentation-roundtable-report.md` for full list.
- **Acceptance:** Active doc directories contain only current files. Archive preserves history.

### T-023: Refresh FEATURES.md for Q1 2026
- **Status:** OPEN
- **Size:** S (3 hours)
- **Dependencies:** None
- **Files:** `docs/plans/FEATURES.md` (last updated Aug 2025 — 7 months stale)
- **What:** Update strategic vision, current focus areas, completed items. Remove references to Triple RAG, multi-agent tours, and other scrapped items.
- **Acceptance:** FEATURES.md reflects current quarter priorities and grounded architecture.

### T-024: Create API_ROUTES.md
- **Status:** OPEN
- **Size:** S (3 hours)
- **Dependencies:** None
- **What:** Document all API routes: path, method, auth required, request schema, response schema. Start with working paths: `/api/disclosure/mindmap`, `/api/prometheus/chat`.
- **Acceptance:** Every route in `apps/app/src/app/api/` has at least a one-line description.

---

## Backlog (Not Sequenced)

### T-025: Implement rate limiting
- **Status:** OPEN
- **Size:** S (3-4 hours)
- **What:** Use Upstash Redis (already in deps) to rate-limit AI routes. Default: 30 req/min per user/IP.
- **Dependencies:** T-003 (auth middleware)

### T-026: Add monitoring (Sentry + Vercel Analytics)
- **Status:** OPEN
- **Size:** M (1-2 days)
- **What:** Wire Sentry for error tracking, Vercel Analytics for performance. Set up OpenAI cost tracking.

### T-027: Create ResearchSession unified state slice
- **Status:** OPEN
- **Size:** M (2-3 days)
- **What:** Single owner of investigation-session state: `activeSessionId`, `pinnedNodeIds`, `notes`, `evidenceIds`, `citationIds`, `saveStatus`. Converge 4 fragmented providers.
- **Reference:** `docs/plans/2026-03-29-research-canvas-grounding.md`

### T-028: Mindmap Agent Consolidation (ai-sdk-tools)
- **Status:** OPEN
- **Size:** L (5-7 days)
- **What:** Tasks 26-31 from original TODO. Baseline audit, tool adapter schemas, MindmapResearchAgent, API route v2, client hook integration, validation.
- **Dependencies:** T-013, T-015

### T-029: UFO Research Methodology Framework
- **Status:** OPEN
- **Size:** M (2 days)
- **What:** Define structured methodology inspired by Jacques Vallee, Diana Pasulka Walsh. Framework for classification, evidence evaluation, source verification, pattern analysis. Map to ingestion/analysis workflows.

---

## Completed

| ID | Task | Completed |
|----|------|-----------|
| T-001 | Remove Edge runtime from Prometheus chat route | 2026-03-29 |
| T-002 | Fix 3 broken API routes | 2026-03-29 |
| T-015 | Standardize context injection | 2026-04-05 |
| T-013 | Add graph-write tools to disclosure mindmap route | 2026-04-05 |
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
