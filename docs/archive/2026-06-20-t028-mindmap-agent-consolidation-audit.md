# T-028 — Mindmap Agent Consolidation: Baseline Audit

**Status:** Audit complete. Implementation **deferred** (L-sized, behavior-changing).
**Date:** 2026-06-20
**Scope of this doc:** establish the real agent inventory and a grounded
consolidation plan. No code changed.

## TL;DR

The codebase has **three** server-side agent/query paths, not the two the docs
claim. The third (`/api/sse/xata/ask`) still imports the **retired** `@db/xata`
client and is therefore broken at runtime, yet it retains four live client
consumers. Consolidation = collapse onto the one canonical path
(`/api/disclosure/mindmap`), de-duplicate the shared search logic, and retire
the Xata SSE path. Deferred because it touches live render wiring and needs
runtime verification, not just type-checks.

## Inventory (grounded, 2026-06-20)

| Path | Lines | Protocol | DB layer | Status |
|------|-------|----------|----------|--------|
| `src/app/api/disclosure/mindmap/route.ts` | 718 | OpenAI Assistants + custom SSE bridge | `@db/postgres` (`searchDatabase` FTS + pgvector) | ✅ **Canonical / live** |
| `src/app/api/prometheus/chat/route.ts` | 881 | Vercel AI SDK `streamText` | `@db/postgres` (`searchNeonDatabase`) | ✅ Live, separate protocol |
| `src/app/api/sse/xata/ask/route.ts` (+ `/send`, 39 ln) | 202 | hand-rolled SSE + Xata `.ask()` | `@db` / `@xata.io/client` (**RETIRED**) | ❌ **Broken — retired dep** |

### Client consumers

- **mindmap** (canonical): `launchpad.tsx`, `mindmap-ai-chat.tsx`,
  `CanvasMenu.tsx`, `smart-bottom-menu.tsx`, `mindmap-bottom-menu.tsx`,
  `use-mindmap-agent.ts` (358 ln hook), `chat-with-context.tsx`,
  `services/ai/prometheus/lib/tools.ts`.
- **prometheus chat**: `middleware.ts`, `(site)/prometheus/agent.tsx`,
  `services/ai/agents/prometheus.tsx`, `prometheus-file-handler.ts`, `tools.ts`.
- **sse/xata/ask** (broken path, still referenced): `ask-ai.tsx`,
  `useAskXata.ts`, `actions/xata-to-xyflow.ts`, `hooks/useSSE.tsx`.

## Findings

1. **Retired-dependency ghost path.** `sse/xata/ask/route.ts` does
   `import { getXataClient } from '@db'` and types results as
   `@xata.io/client` `AskResult`. Per `CLAUDE.md`, `@db/xata`/`@db` is retired in
   favor of `@db/postgres`. This route cannot function against the live Neon DB.
   Its four consumers are dead-on-arrival UI surfaces.

2. **Duplicated search logic.** Both live routes independently implement the
   "embed query → parallel FTS + pgvector cosine → dedupe by id → rank" pattern
   (mindmap via `searchDatabase`, prometheus via `searchNeonDatabase`). One
   shared, tested search function should back both.

3. **Overlapping tool surfaces.** `mindmap` exposes `file_search`,
   `searchDatabase`, `searchExternalResources`, `addGraphNodes`,
   `addGraphEdges`. `prometheus` exposes `searchUAP`, `searchNeonDatabase`,
   `searchExternalResources`, `researchExternalTopic`, `processDocument`. The
   external-resource and DB-search tools are conceptually the same with divergent
   names/impls.

4. **Two SSE conventions.** mindmap has a bespoke Assistants→SSE bridge; the
   xata path hand-rolls `encodeSSE`. No shared transport helper.

## Consolidation plan (deferred — sequence, do not batch)

**Phase A — retire the broken path (low risk, high value):**
1. Confirm `ask-ai.tsx` / `useAskXata.ts` / `useSSE.tsx` surfaces are reachable
   in the live render tree (canonical path is `research-canvas/page.tsx` →
   `MindMap` → `ViewSwitcher`). If not reachable → delete with the route.
2. If reachable, repoint them at `use-mindmap-agent.ts` (the canonical hook),
   then delete `/api/sse/xata/ask` + `/send` and the Xata-typed
   `xata-to-xyflow.ts` paths.

**Phase B — extract shared search:**
3. Lift the FTS+pgvector routine into a single `@db/postgres` export consumed by
   both `searchDatabase` and `searchNeonDatabase`; delete the divergent copy.

**Phase C — unify tool definitions:**
4. Define one external-resources tool and one DB-search tool, shared by both
   live routes. Keep protocol shells (Assistants vs streamText) separate — they
   serve different UX and should NOT be merged.

## Why deferred

- Phases A/B/C change runtime behavior on the live render path; the project's
  verification gate is type-only (`tsc`). This needs a running app + manual
  smoke of the canvas chat and Prometheus chat, which is out of scope for an
  autonomous type-checked sweep.
- L-sized: ~9 consumer files + 3 routes + a DB-layer extraction.

## Immediate, safe follow-ups (candidates for a future wave)

- Phase A deletion of the retired Xata SSE path is the highest-ROI, lowest-risk
  slice and could be done independently once its consumers' reachability is
  confirmed in a running app.
- Update `CLAUDE.md` "two live AI paths" note to acknowledge the broken third
  path until it is deleted, so future agents don't treat it as load-bearing.
