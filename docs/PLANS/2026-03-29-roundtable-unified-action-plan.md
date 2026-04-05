# Research Canvas Hardening: Unified Action Plan

**Date:** 2026-03-29
**Source:** Roundtable analysis — 4 specialist agents (AI Agent Architecture, Frontend, Backend/Next.js, Database/Vector/RAG)
**Branch:** dev
**Scope:** Quickest path to meaningful feature deployment for `apps/app/`, focused on the research canvas and mindmap feature area

---

## Executive Summary

Four specialists independently audited the codebase and converged on a clear picture:

1. **The research canvas has one functional end-to-end path** (disclosure mindmap: user query -> OpenAI Assistants API -> Xata search -> SSE -> graph nodes). Everything else is broken, dead, or speculative.
2. **The triple RAG system does not exist.** Only OpenAI file_search + Xata full-text search work in the Next.js app. FAISS/Upstash Vector/CocoIndex are Python-only or unimplemented.
3. **The multi-agent tour orchestrator (July 2025 spec) was never started.** 6 agent classes, an orchestrator, and a decision engine — all specced, zero code. Scrap it.
4. **No authentication middleware exists.** Every API route is publicly accessible.
5. **The initial graph load fetches all 230,998 records** with no pagination.
6. **4 dead shell variants and 4 ghost routes** create confusion about what's canonical.
7. **The mindmap context is a 1,363-line god-object** that re-renders everything on any change.

The plan below sequences 21 concrete changes across 4 phases, ordered by impact and dependency. Total estimated effort: ~2.5 weeks of focused work.

---

## What to Scrap (Ice-Cold, Never Revive)

| Item | Origin | Why Scrap |
|------|--------|-----------|
| BaseTourAgent, IntentAnalysisAgent, NavigationAgent, DiscoveryAgent, SpatialIntelligenceAgent, NarrativeBridgeAgent | TODO_AGENT_TASKS.md (July 2025) | Never started. Over-engineered 6-agent architecture for a feature achievable with 3-5 tools on the existing single agent. |
| TourAgentOrchestrator, AgentDecisionEngine | TODO_AGENT_TASKS.md (July 2025) | Same — orchestration between specialized agents adds latency/complexity for no proven UX benefit. |
| useBackendChat hook | hooks/useBackendChat.ts | PartySocket-based, targets different architecture era. No current UI consumer. |
| Triple RAG unification | BRAINSTORM_IDEAS.md | The Python RAG and Next.js app are completely disconnected. OpenAI file_search + Xata search is sufficient. |
| FAISS/OpenAI embedding dimension unification | BRAINSTORM_IDEAS.md | Only matters if you unify vector stores. Since you shouldn't, it's moot. |
| Continuous learning feedback loops | BRAINSTORM_IDEAS.md | Requires a working e2e pipeline first. Nothing to learn from yet. |
| CocoIndex PostgreSQL integration | disclosure-rag config | Config-only, nothing wired. Python-only research project. |

---

## Phase 0 — Emergency Fixes (Day 1, ~4 hours)

These are broken-right-now issues that affect runtime behavior or security.

### 0.1 Remove Edge runtime from Prometheus chat route
**Size: XS (30 min)** | **Specialist: Backend**

Delete `export const runtime = 'edge'` from `/api/prometheus/chat/route.ts` and set `maxDuration = 60`. The route creates OpenAI threads and polls them in a while loop — the 30s Edge limit is a timeout bomb. Also delete the in-memory `Map()` rate limiter/cache (useless on Edge, resets every cold start).

**File:** `apps/app/src/app/api/prometheus/chat/route.ts` (lines 340-341, 24-32)

### 0.2 Fix 3 broken API routes
**Size: S (1-2 hours)** | **Specialist: Backend**

| Route | Fix |
|-------|-----|
| `/api/processing/scrape/route.ts` | Delete duplicate type imports at lines 14-17 (conflicts with lines 3-8) |
| `/api/processing/file/route.ts` | Delete entirely — stub with fake implementation, writes to nonexistent `documentResources` table |
| `/api/disclosure/chat/route.ts` | Fix `transformXYFlow` tool output at line 274 — passes a `Response` object where OpenAI expects a JSON string |

### 0.3 Add Clerk authentication middleware
**Size: S (half day)** | **Specialist: Backend**

Create `apps/app/src/middleware.ts` (or `proxy.ts` for Next.js 16). Protect at minimum:
- `/api/admin/*` — admin only
- `/api/processing/*` — authenticated users
- `/api/prometheus/chat`, `/api/disclosure/*` — authenticated users
- Leave `/api/webhooks/*` and `/api/cron/*` unprotected (use secret verification instead)

Without this, anyone can trigger expensive FireCrawl scraping, inject testimony data, and make unlimited AI API calls.

---

## Phase 1 — Delete Dead Code (Day 1-2, ~3 hours)

Zero-risk deletions that immediately clarify the canonical architecture.

### 1.1 Delete 4 ghost route wrappers
**Size: XS (30 min)** | **Specialist: Frontend**

| Delete | Reason |
|--------|--------|
| `apps/app/src/app/(site)/disclosure/page.tsx` | Bare re-export of research-canvas |
| `apps/app/src/app/(site)/search-and-discovery-interface/page.tsx` | Renders view outside provider stack (broken) |
| `apps/app/src/app/(site)/content-card-detail-view/page.tsx` | Renders view outside provider stack (broken) |
| `apps/app/src/app/(site)/ufo-sightings/page.tsx` | Renders view outside provider stack (broken) |

### 1.2 Delete 4 dead shell variants
**Size: XS (30 min)** | **Specialist: Frontend**

| Delete | Confirmed by |
|--------|-------------|
| `features/mindmap/smart-mindmap.tsx` | Zero production imports |
| `features/mindmap/smart-mindmap-with-auto-connections.tsx` | Zero production imports |
| `features/mindmap/smart-mindmap-with-shared-context.tsx` | Zero production imports |
| `features/mindmap/smart-graph.tsx` (feature root, NOT `components/smart-graph/`) | Zero production imports |

### 1.3 Prune index.tsx
**Size: XS (10 min)** | **Specialist: Frontend**

Reduce `features/mindmap/index.tsx` to: `export * from './mind-map'`

The current re-exports of `SmartMindmapEnhanced`, `WrapWithSmartConnections`, `AutoConnectionEnabledGraph` have zero call sites.

### 1.4 Consolidate xata-to-xyflow files
**Size: S (2-4 hours)** | **Specialist: Database**

Delete `xata-to-xyflow-fixed.ts`. Merge its validation/metadata improvements into `xata-to-xyflow.ts`. Fix the missing `askXataWithAi` import. Two files exporting the same function name with different behavior is a maintenance landmine.

**Files:** `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`, `apps/app/src/features/mindmap/actions/xata-to-xyflow-fixed.ts`

---

## Phase 2 — Core UX & Performance (Days 2-5, ~5-7 days)

Changes that directly improve what users see and feel.

### 2.1 Paginate initial graph data load
**Size: M (2-3 days)** | **Specialist: Database + Backend**

`getEntityNetworkGraphData()` in `xyflow-integration.ts` fetches ALL 230,998 records across 7 tables + 5 join tables sequentially. Replace with:
- Bounded initial load (200-500 nodes, distributed across entity types)
- Lazy-load via existing `/api/mindmap/records/route.ts` as user explores
- Replace `nodes.find()` edge resolution (O(n*m)) with `Set<string>` lookup (5-line fix)

**Files:** `packages/db/src/xata-typescript-sdk/api/xyflow-integration.ts`, `apps/app/src/features/mindmap/actions/get-entity-network-graph-data.ts`

### 2.2 Fix EmptyCanvas
**Size: XS (30 min)** | **Specialist: Frontend**

- Remove `UFO_RESEARCH_EVENTS` hardcoded dummy array
- Remove `showTimeline` string-matching branch
- Replace with `agentStatus`-driven empty/loading/streaming state (props already threaded)

**File:** `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`

### 2.3 Wire suggestion chips to agent
**Size: XS (30 min)** | **Specialist: Frontend**

The three `enhancedMessages` chips ("Guided Tour", "Deep Research", "Explore Network") in `ResearchCanvasConsole.tsx` only animate — they don't dispatch. Make `handleMessageClick` call `onSubmit(message.title)`.

**File:** `apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx`

### 2.4 Replace local sightings dataset with Xata query
**Size: M (1 day)** | **Specialist: Database**

`research-canvas/data/ufo-sightings.ts` has 6 hardcoded sighting records. Create a server action fetching from the 130K+ sighting records in Xata, falling back to local data on failure.

**File:** `apps/app/src/features/mindmap/research-canvas/data/ufo-sightings.ts`

### 2.5 Add Zod validation to remaining API routes
**Size: S (1 day)** | **Specialist: Backend**

Routes that already have Zod: `disclosure/chat`, `processing/scrape/batch`. Routes that need it: `prometheus/chat`, `processing/testimony`, `mindmap/records`, `disclosure/mindmap`.

---

## Phase 3 — Agent System Hardening (Days 5-10, ~6-8 days)

Get the AI agent from "search only" to "search + write + navigate."

### 3.1 Add graph-write tools to disclosure mindmap route
**Size: M (3-5 days)** | **Specialist: AI Agent**

**Highest-leverage single change.** Currently the agent can only search — graph mutations happen client-side via `transformStreamResponse`. Add:
- `addGraphNodes` tool — accepts `{id, type, label, data}[]`, emits via SSE
- `addGraphEdges` tool — accepts `{source, target, label, reasoning}[]`

Client-side: `useMindMapAgent` already dispatches on `toolData.tool` (lines 131-179). Add cases for the new tools.

**Files:** `apps/app/src/app/api/disclosure/mindmap/route.ts`, `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`, `apps/app/src/features/mindmap/graph.tsx`

### 3.2 Split processDocument into granular tools
**Size: M (1-2 days)** | **Specialist: AI Agent**

The monolithic `processDocument` tool on the Prometheus chat route takes an `action` enum parameter. Split into: `summarizeDocument`, `extractTopics`, `analyzeSentiment`, `findConnections`, `findInsights`, `generateTags`. The implementations already exist in the `documentActions` object — this is mostly a tool registration refactor.

**File:** `apps/app/src/app/api/prometheus/chat/route.ts`

### 3.3 Standardize context injection
**Size: M (2-3 days)** | **Specialist: AI Agent**

Create `buildAgentContext(options)` that assembles: current graph state, user's research focus, relevant DB schema hints, NER extraction prompt. Both the Assistants API route (disclosure/mindmap) and the AI SDK route (prometheus/chat) consume this.

**File:** New `apps/app/src/services/ai/context/build-agent-context.ts`, then update both route files.

### 3.4 Unify or clearly separate chat routes
**Size: M (2-3 days)** | **Specialist: Backend**

**Architecture decision:** Keep two routes with clear ownership:
- `/api/disclosure/mindmap` — Assistants API + SSE, for graph canvas interactions (persistent threads, file_search, multi-step tool calling)
- `/api/prometheus/chat` — AI SDK streamText, for standalone conversational chat

Delete `/api/chat/route.ts` (alias) and `/api/disclosure/chat/route.ts` (overlapping). Rewire all consumers.

### 3.5 Wire testimony queue worker as cron
**Size: S (1 day)** | **Specialist: Backend**

The worker logic exists in `scripts/workers/testimony-queue-worker.ts`. Adapt into `/api/cron/process-testimonies/route.ts`.

---

## Phase 4 — State Management & Architecture (Days 10-15, ~4-5 days)

Reduce accidental complexity without full rewrite.

### 4.1 Extract pure factories from mindmap-context
**Size: S (half day)** | **Specialist: Frontend**

Move `createRootNode`, `createRootNodeChild`, `createSiblingEdge`, `createRootNodeEdge`, `createRootNodeEdges` to `features/mindmap/utils/node-factories.ts`. These are pure transforms with no React state dependency.

### 4.2 Move graph init effect out of context
**Size: S (half day)** | **Specialist: Frontend**

The `useEffect` at line 408 of `mindmap-context.tsx` reads `graph3d` and calls `setGraph`. Move to `graph.tsx` or a `useGraphInit` hook.

### 4.3 Move UI-local state to Zustand
**Size: S (1 day)** | **Specialist: Frontend**

Move 5 `useState` calls (`activeNode`, `conciseViewActive`, `showLocationVisualization`, `locationsToVisualize`, `keepLoadedOnMap`) from context to `mindmap-ui-store.ts` as a `canvas` slice.

After these three extractions: context shrinks from ~1,363 lines to ~200-300 lines.

### 4.4 Wire 3 tour tools as AI SDK tools (optional, if time permits)
**Size: L (5-8 days)** | **Specialist: AI Agent**

Expose `navigateTour`, `discoverEntities`, `analyzeTemporalContext` on `/api/disclosure/tour/route.ts`. Skip `create_narrative_bridge` and `spatial_intelligence_query` — they add complexity without clear UX payoff.

---

## Dependency Graph

```
Phase 0 (emergency fixes)
  ├── 0.1 Remove Edge runtime ──────────────┐
  ├── 0.2 Fix broken routes ────────────────┤
  └── 0.3 Add auth middleware ──────────────┤
                                             ▼
Phase 1 (delete dead code) ◄─── can start in parallel with Phase 0
  ├── 1.1 Ghost routes ────────────────────┐
  ├── 1.2 Dead shells ─────────────────────┤
  ├── 1.3 Prune index ─────────────────────┤
  └── 1.4 Consolidate xata-to-xyflow ─────┤
                                            ▼
Phase 2 (core UX)
  ├── 2.1 Paginate graph load ◄──── depends on 1.4
  ├── 2.2 Fix EmptyCanvas ◄──────── no dependencies
  ├── 2.3 Wire suggestion chips ◄── no dependencies
  ├── 2.4 Replace local sightings ◄── no dependencies
  └── 2.5 Zod validation ◄────────── depends on 0.2
                                            ▼
Phase 3 (agent hardening)
  ├── 3.1 Graph-write tools ◄─────── depends on 3.3 ideally
  ├── 3.2 Split processDocument ◄─── no dependencies
  ├── 3.3 Standardize context ◄──── no dependencies
  ├── 3.4 Unify chat routes ◄─────── depends on 3.2, 3.3
  └── 3.5 Wire testimony cron ◄──── no dependencies
                                            ▼
Phase 4 (state management)
  ├── 4.1 Extract factories ◄──────── no dependencies
  ├── 4.2 Move graph init ◄──────── depends on 4.1
  ├── 4.3 Move UI state to Zustand ◄── depends on 4.1
  └── 4.4 Tour tools (optional) ◄──── depends on 3.1, 3.3
```

---

## Effort Summary

| Phase | Items | Total Effort | Calendar Time |
|-------|-------|-------------|---------------|
| Phase 0 | 3 emergency fixes | ~4 hours | Day 1 |
| Phase 1 | 4 deletion tasks | ~3 hours | Day 1-2 |
| Phase 2 | 5 UX/performance tasks | ~5-7 days | Days 2-5 |
| Phase 3 | 5 agent hardening tasks | ~6-8 days | Days 5-10 |
| Phase 4 | 4 state management tasks | ~4-5 days | Days 10-15 |

**Phases 0 and 1 can happen in parallel.** Phases 2 and 3 have some parallelism (2.2-2.4 are independent of 3.2-3.3). Phase 4 is the least urgent and can be deferred.

---

## Myths Corrected

| Myth | Reality |
|------|---------|
| "85% AI connectivity" | One end-to-end agent path works (disclosure/mindmap). The rest are broken or dead. |
| "Triple RAG with 40/40/20 weighting" | Does not exist. Only OpenAI file_search + Xata full-text search are functional in the Next.js app. |
| "85% schema compatibility" | The Python RAG and Next.js app are completely disconnected at the data layer. |
| "Enhanced Nodes serve as common UI layer across ALL features" | `enhanced-node-poc.tsx` is one node type in React Flow. The "common UI layer" characterization is aspirational. |
| "Agentic Tours in planning phase" | The July 2025 spec was never started and should be scrapped. The concept is valid but the architecture was over-engineered. |

---

## Task Tracking Recommendations

Based on this roundtable, the three-tier tracking system needs:

1. **Pull this plan's tasks into TODO.md** as properly numbered tickets
2. **Archive the July 2025 TODO_AGENT_TASKS.md** — it's all dead spec
3. **Update FEATURES.md** to reflect the myths corrected above
4. **Add a "Completed" section to TODO.md** so done work is visible
5. **Kill BRAINSTORM_IDEAS.md** and fold still-relevant ideas into FEATURES.md
6. **Enforce: a task isn't "started" until it's in TODO.md, isn't "active" until it's in DAILY_WORK_PLAN.md**
