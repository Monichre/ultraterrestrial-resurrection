# Mindmap AI SDK Tools Integration Plan

**Created**: 2026-01-21 22:04:57 CST  
**Last Updated**: 2026-01-21 22:09:25 CST  
**Owner**: Droid  
**Scope**: `apps/app/src/features/mindmap`

---

## 1) Goal

Consolidate the current mindmap agent logic into a single, tool-driven orchestration layer using `ai-sdk-tools` while preserving the existing Contextual Intelligence, Enhanced Nodes, and Prometheus foundations.

---

## 2) Source Review (midday-ai/ai-sdk-tools)

From the repository README (v1.2.0):

- **Agents**: Multi-agent orchestration with routing/handoffs (`@ai-sdk-tools/agents`).
- **Memory**: Persistent memory backends (In-memory, Upstash Redis, Drizzle) (`@ai-sdk-tools/memory`).
- **Store**: AI chat state management for UI integration (`@ai-sdk-tools/store`).
- **Artifacts**: Structured streaming for type-safe outputs (`@ai-sdk-tools/artifacts`).
- **Devtools**: Execution flow inspection (`@ai-sdk-tools/devtools`).

These packages are already installed in `apps/app/package.json`.

---

## 3) Current Mindmap Agent Landscape

**Key files:**

- `src/features/mindmap/hooks/use-mindmap-agent.ts` → client stream handling
- `src/features/mindmap/tools/ultraterrestrial-agent-tools.ts` → tool schemas/types
- `src/features/mindmap/agents/historical-query-agent.ts`
- `src/features/mindmap/agents/tour-state-agent.ts`
- `src/app/api/disclosure/mindmap/route.ts` → streaming API endpoint

**Observed issues:**

- Agent logic is split across multiple files with manual orchestration.
- Tool schema/types are defined, but execution/streaming is bespoke.
- Client hook owns stream parsing and tool event state manually.

---

## 4) Target Architecture (Orchestration over Replacement)

### 4.1 Unified Agent Layer

Create a single **MindmapResearchAgent** using `@ai-sdk-tools/agents` that:

- Hosts existing tools (database search, graph transform, external RAG, historical analysis).
- Delegates specialized tasks to wrapped sub-agents (historical, tour state) where needed.
- Maintains memory via `@ai-sdk-tools/memory` (session + optional persistent store).

### 4.2 Tool Interface Alignment

Adopt ai-sdk-tools tool definitions for compatibility with AI SDK structured calling and streaming, while reusing existing tool contracts in `ultraterrestrial-agent-tools.ts`.

### 4.3 Streaming + Artifacts

Use `@ai-sdk-tools/artifacts` to stream structured outputs (graph transforms, search results) alongside text analysis without manual event parsing.

### 4.4 Client State (Decision)

Keep existing local state for the initial integration to avoid parallel state systems. Re-evaluate `@ai-sdk-tools/store` adoption only after parity and stability are proven.

### 4.5 Contracts & Schemas

Define and test a stable contract between server streaming and the client hook:

- **Streaming payload schema**: event envelope (`type`, `timestamp`, `payload`) with explicit `text`, `tool_event`, `artifact`, and `error` variants.
- **Tool I/O mapping**: explicit schemas for each tool input/output and error shape (timeout, validation, upstream failure).
- **Backward compatibility**: adapter that maps new schema → existing `AgentToolEvent` shape until migration completes.

---

## 5) Implementation Phases

### Phase 0 — Baseline Audit (No Code Changes)

- Map existing agent execution flow in `use-mindmap-agent.ts` and `/api/disclosure/mindmap`.
- Inventory tool definitions and current SSE payload format.
- Confirm where Prometheus and Contextual Intelligence are injected.
- Identify current AI runtime/provider usage (Assistants vs AI SDK) and define migration bridge.
- Confirm API route runtime (Node vs Edge) compatibility with `@ai-sdk-tools/*` and memory backends.

### Phase 1 — Tool Adapter Layer

- Introduce a thin adapter that maps `ULTRATERRESTRIAL_TOOL_DEFINITIONS` into ai-sdk-tools tool format.
- Ensure output schemas align with existing UI expectations.
- Preserve existing tool parameter validation helpers.
- Define tool I/O schemas and error contracts for each tool.
- Define memory schema and scoping (user/session/mindmap) with retention TTLs.

### Phase 2 — MindmapResearchAgent

- Create a unified agent that registers:
  - `searchDatabase`
  - `transformToGraph`
  - `searchExternalResources`
  - `analyzeHistoricalContext`
  - `analyzeNarrativeContext`
- Extract pure functions from `historical-query-agent` queue/callback logic before wrapping as tools.
- Integrate `tour-state-agent` via explicit tool calls or agent handoffs with documented context handoff.
- Attach memory layer (session + optional Upstash Redis).

### Phase 3 — API Route Integration

- Add `src/app/api/disclosure/mindmap/v2/route.ts` for the unified agent.
- Keep the existing route intact and switch via a feature flag in the client hook.
- Replace manual stream event construction with ai-sdk-tools streaming utilities.

### Phase 4 — Client Hook Integration

- Update `use-mindmap-agent.ts` to consume the new streaming output format.
- Keep existing local state; do not introduce `@ai-sdk-tools/store` in this phase.
- Maintain compatibility with existing UI components.

### Phase 5 — Observability + Debugging

- Enable `@ai-sdk-tools/devtools` in development builds to inspect tool calls.
- Track tool latencies and failures in a lightweight internal log.

### Phase 6 — Rollout & Hardening

- Feature-flag the new route/hook.
- Run side-by-side comparisons for latency and tool correctness.
- Remove old manual stream parsing once validated.

---

## 6) Files to Add / Update (Planned)

**Add:**

- `src/features/mindmap/agents/mindmap-research-agent.ts`
- `src/features/mindmap/agents/tools/index.ts`
- `src/features/mindmap/agents/memory/mindmap-memory-provider.ts`

**Update:**

- `src/features/mindmap/tools/ultraterrestrial-agent-tools.ts`
- `src/features/mindmap/hooks/use-mindmap-agent.ts`
- `src/app/api/disclosure/mindmap/route.ts`
- `src/features/mindmap/agents/historical-query-agent.ts`
- `src/features/mindmap/agents/tour-state-agent.ts`

---

## 7) Dependencies & Configuration

- Already installed: `@ai-sdk-tools/{agents,memory,store,artifacts,devtools}`, `ai-sdk-tools`.
- Optional: Upstash Redis credentials for persistent memory (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
- Confirm route runtime is Node if any package lacks Edge compatibility.

---

## 8) Risks & Mitigations

- **Streaming compatibility** → Provide a `v2` route with feature flag and preserve old SSE format until validated.
- **Memory persistence failures** → Fallback to session-only memory.
- **Tool schema mismatch** → Keep adapter layer and validated schemas from existing tools.
- **Latency regressions** → Use devtools to profile tool call durations; add caching later if needed.
- **Assistants API migration** → Add explicit provider migration bridge in Phase 0; keep old path for rollback.
- **Historical agent architecture mismatch** → Extract pure functions before tool wrapping.

## 9) Acceptance Criteria

- Tool calls emit consistent, validated events that map to current UI expectations.
- Mindmap expansion flow produces identical node/edge outputs pre/post migration.
- Error handling and timeouts are surfaced to UI with consistent shape.
- Latency increase ≤ 10% compared to baseline for core flows.

## 10) Rollout & Rollback Criteria

- Rollout when: tool error rate ≤ 2%, latency delta ≤ 10%, and streaming schema parity confirmed.
- Rollback when: tool error rate > 5%, latency delta > 20%, or missing/invalid tool events in UI.

---

## 11) Validation Plan

**Unit:**

- Tool adapter schema validation.
- Memory provider persistence + fallback.

**Integration:**

- `/api/disclosure/mindmap` streaming output compatibility.
- Graph transform artifacts build correct nodes/edges.
- Parity tests comparing v1 vs v2 outputs for key flows.

**E2E:**

- Mindmap tool invocation from UI (search → expand → graph update).
- Tour state continuity using the new agent.

---

## 12) Open Questions

- Which memory backend should be default in development vs production?
- Should we promote `@ai-sdk-tools/store` after v2 parity, or keep local state long-term?

---

## 13) Required Methodology Note

Add a follow-up task to develop a structured research framework based on famous UFO researchers’ methodologies (e.g., Jacques Vallée, Diana Pasulka Walsh) to guide analysis, investigation, and ingestion.
