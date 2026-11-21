# Work Log — Prometheus Refactor and SSE Bridge Migration

Date: 2025-09-08
Author: AI coding agent (Codex CLI)

## Summary

Refactored all disclosure/mindmap API routes and related services to align with the Prometheus system and AI SDK v5. Replaced deprecated `experimental_AssistantResponse` with a shared Server‑Sent Events (SSE) bridge, fixed OpenAI Assistants API signatures, and ensured the “three pillars” of Prometheus are present: (1) OpenAI vector store (file_search), (2) Xata database tools, and (3) external agentic RAG (Exa).

## Key Outcomes

- Unified streaming via a lightweight SSE helper (`createSSEBridge`) used by affected routes.
- Renamed internal “disclosure” assistant references to Prometheus and centralized assistant/vector store config.
- Mindmap endpoint now invokes all 3 pillars (vector store, Xata, external RAG) through tool calls.
- Fixed `submitToolOutputsStream` usage to correct OpenAI SDK signature (runId only).

## Changes At A Glance

New/updated files:

- Added: `apps/app/src/services/ai/openai/sse.ts` — SSE bridge utilities
- Added: `apps/app/src/services/ai/openai/prometheus-agent.ts` — Prometheus agent SSE endpoint
- Updated: `apps/app/src/app/api/disclosure/mindmap/route.ts` — SSE + 3 pillars
- Updated: `apps/app/src/app/api/disclosure/chat/route.ts` — SSE, Prometheus IDs
- Updated: `apps/app/src/app/api/disclosure/chat/route-demo.ts` — SSE, Prometheus IDs
- Updated: `apps/app/src/app/api/disclosure/chat/demo.ts` — SSE, Prometheus IDs
- Updated: `apps/app/src/services/ai/workflows/prompt-to-multistep.workflow.ts` — SSE, Prometheus IDs
- Updated: `apps/app/src/services/ai/openai/functions/functions.ts` — Remove deprecated AssistantResponse, use `createAndPoll`
- Updated: `apps/app/src/services/ai/openai/config.ts` — Introduced `PROMETHEUS_ASSISTANT_ID`/`PROMETHEUS_VECTOR_STORE_ID` (with aliases)
- Updated: `apps/app/src/services/knowledge-layer/memory.ts` — Prometheus assistant ID
- Updated: `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/oracle-command-menu/commands.tsx` — UI copy (“Prometheus”)
- Deleted: `apps/app/src/services/ai/openai/disclosure-agent.ts`

Docs updated:

- Added: `docs/WORK_LOGS/WORK_LOG_2025-09-08_Prometheus_Refactor_SSE_Bridge.md` (this file)
- Updated: `docs/INDEX.md` to include this work log

## Context and Motivation

- App runs `ai@5.x`, which removed `experimental_AssistantResponse`. Endpoints using this API were failing at runtime.
- Product direction: consolidate on Prometheus as the primary agent and surface all 3 pillars in relevant routes.
- Provide consistent server streaming without changing existing client parsing: chose SSE with `{ content: ... }` and `{ data: ... }` payloads, compatible with current frontend readers.

## Implementation Details

1) Shared SSE bridge

- `apps/app/src/services/ai/openai/sse.ts`
  - `createSSEBridge()` returns a `ReadableStream` and helpers:
    - `forwardStream(runStream)`: forwards OpenAI AssistantStream `textDelta` as `data: { content }`
    - `sendDataMessage(msg)`: sends `data: { ... }` payloads for tool results/progress
    - `writeSSE(payload)` and `close()` for lifecycle control
  - `sseHeaders()` returns standard SSE headers

2) Prometheus config and naming

- `apps/app/src/services/ai/openai/config.ts`
  - Introduced `PROMETHEUS_ASSISTANT_ID` (env: `OPENAI_ASSISTANT_ID`) and `PROMETHEUS_VECTOR_STORE_ID` (env: `OPENAI_VECTOR_STORE_ID`)
  - `metadata.assistant_id` now points to `PROMETHEUS_ASSISTANT_ID`
  - Backwards compatibility aliases exported: `DISCLOSURE_ASSISTANT_ID`, `UFO_VECTOR_DATA_STORE_ID`

3) Mindmap route (3 pillars)

- `apps/app/src/app/api/disclosure/mindmap/route.ts`
  - Uses `PROMETHEUS_ASSISTANT_ID` and `PROMETHEUS_VECTOR_STORE_ID` for `file_search`
  - Tools:
    - `file_search` (OpenAI vector store)
    - `searchDatabase` (Xata search with relevancy/metadata)
    - `searchExternalResources` (Exa neural search to trusted sources; returns content snippets)
    - `transformXYFlow` (as defined previously)
  - Endpoint streams via SSE bridge; emits `{ content }` and `{ data: ... }` messages
  - Fixed tool output submission: `runs.submitToolOutputsStream(runId, { tool_outputs })`

4) Disclosure chat routes → Prometheus + SSE

- `apps/app/src/app/api/disclosure/chat/route.ts`
- `apps/app/src/app/api/disclosure/chat/route-demo.ts`
- `apps/app/src/app/api/disclosure/chat/demo.ts`
  - Replaced AssistantResponse with SSE bridge
  - Switched to Prometheus IDs and vector store
  - Corrected `submitToolOutputsStream` signature

5) Workflow and helpers

- `apps/app/src/services/ai/workflows/prompt-to-multistep.workflow.ts`
  - SSE streaming adoption
  - Prometheus IDs/vector store

- `apps/app/src/services/ai/openai/functions/functions.ts`
  - Removed deprecated streaming wrapper
  - Now uses `runs.createAndPoll()` to keep functionality intact

- `apps/app/src/services/knowledge-layer/memory.ts`
  - Now references `PROMETHEUS_ASSISTANT_ID`

- Deleted `apps/app/src/services/ai/openai/disclosure-agent.ts`, added `prometheus-agent.ts` (SSE parity)

6) UI copy and naming polish

- `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/oracle-command-menu/commands.tsx`
  - “Start a conversation with our Disclosure Agent” → “Start a conversation with Prometheus”

## Environment Variables

- `OPENAI_ASSISTANT_ID` → Prometheus Assistant ID
- `OPENAI_VECTOR_STORE_ID` → Vector store attached to Prometheus (file_search)
- `EXA_API_KEY` → External RAG search (Exa) integration

## Backwards Compatibility

- Still export `DISCLOSURE_ASSISTANT_ID` and `UFO_VECTOR_DATA_STORE_ID` as aliases in config to prevent breaking imports. Code paths now prefer Prometheus names.
- Kept existing `/api/disclosure/*` route paths to avoid client breakage; internal logic uses Prometheus.

## Follow‑Ups / Next Steps

- Consider standardizing all streaming endpoints on AI SDK `toDataStreamResponse()` format and update frontend consumers accordingly (optional; SSE works now and is compatible with existing UI readers).
- Add a `searchXata` tool to the Prometheus chat route (`app/api/prometheus/chat/route.ts`) to surface the Xata pillar there as well (mindmap route already includes it).
- Rename legacy “disclosure” prompt constants/files if you want full terminology alignment (e.g., `DISCLOSURE_ASSISTANT_SYSTEM_PROMPT` → `PROMETHEUS_SYSTEM_PROMPT`).
- Add integration tests for tool sequencing (file_search → DB → external → transform) and SSE payload validation.

## Quick Validation Checklist

1. Set env vars: `OPENAI_ASSISTANT_ID`, `OPENAI_VECTOR_STORE_ID`, `EXA_API_KEY`.
2. Start app: `cd apps/app && bun run dev`.
3. Exercise endpoints:
   - Mindmap contextual fetch: `/api/disclosure/mindmap` (SSE stream, watch `{ data: tool, status }` messages)
   - Disclosure chat: `/api/disclosure/chat` (SSE stream)
   - Prometheus chat: `/api/prometheus/chat` (already AI SDK v5 tools)
4. Verify tool outputs are submitted and run completes; check logs for any signature errors.

## Rationale Notes

- SSE chosen to minimize UI changes while removing deprecated AI SDK APIs.
- Prometheus naming centralization clarifies agent identity and makes the “three pillars” explicit in code.

