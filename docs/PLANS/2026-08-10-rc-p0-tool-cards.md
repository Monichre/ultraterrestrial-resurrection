---
status: live
role: eng
spine: do
updated: 2026-08-10
linear: DMGD-219
todo: T-053
phase: RC-P0
---

# RC-P0 MVP — Expandable ToolCards on Research Canvas

**Parent epic:** [`2026-08-09-research-canvas-genui.md`](./2026-08-09-research-canvas-genui.md) · T-053 / [DMGD-219](https://linear.app/digital-mischief-group/issue/DMGD-219/lane-b-research-canvas-gen-ui-upgrade-deep-research-loop-agentic) · FEATURES Decision 11  
**This doc:** approval-sized implementation plan for **RC-P0 only**. Does not restate RC-P1–P4.

**Pseudocode:** [`.scratch/RcP0ToolCards_PSUEDOCODE.md`](../../.scratch/RcP0ToolCards_PSUEDOCODE.md)  
**Architecture note:** [`.scratch/RcP0ToolCards.md`](../../.scratch/RcP0ToolCards.md)

---

## Verdict

**Ship RC-P0 as the MVP.** It is already the smallest slice that yields **user-visible** value on `/research-canvas`: the SSE → `AgentToolEvent[]` pipe exists; the console only renders ephemeral “Searching…” pills for `processing` events. Replacing those with inspectable ToolCards is a front-end-only change with no new protocol, no CopilotKit, and no Workspace sidecar.

Nothing smaller still dogfoods: docs-only or hook-only work is invisible; skipping cards and jumping to RC-P1 (session mirror) ships state without a visible Gen-UI affordance.

---

## Goal

On `/research-canvas`, while (and after) a disclosure mindmap agent run streams, the user can **see and expand** each tool call as a ToolCard showing:

- tool name (human label)
- status: processing | complete | error
- query / key parameters
- result summary (hit counts or short message)
- error message when `status === 'error'`

**Success = visual dogfood**, not green tests alone ([DEFINITION_OF_DONE](.agents/rules/DEFINITION_OF_DONE.md)).

---

## Non-goals (this MVP)

- No backend / `/api/disclosure/mindmap` changes
- No `researchSession.plan|sources|artifacts` (RC-P1)
- No Deep Research mode / `researchFocus` wiring (RC-P2)
- No dossier → `SynthesisPanel` (RC-P3)
- No plan → waypoints (RC-P4)
- No CopilotKit, LangGraph, Tavily, Workspace sidecar, Prometheus chat
- No new state in `mindmap-context.tsx`
- No Gen-UI in `features/research-canvas/*` Storybook islands
- No nested-tool noise collapse beyond simple collapse/expand of cards (defer fancy nesting to later if needed)

---

## Current wiring (confirmed 2026-08-10)

```
/research-canvas → MindMap → ViewSwitcher → Graph
  useMindMapAgent().toolEvents  (AgentToolEvent from SSE `parsed.data`)
    → EmptyCanvas | ResearchCanvasConsole
      → EnhancedAnimatedChat (agentToolEvents)
        TODAY: processing-only pills for searchDatabase / “web”
        MVP:   expandable ToolCards for all events
```

| Symbol | Path | Role in RC-P0 |
| --- | --- | --- |
| `AgentToolEvent` | `hooks/use-mindmap-agent.ts` | **Read-only contract** — already typed & streamed |
| Graph pass-through | `graph.tsx` | Already passes `toolEvents` → console |
| Console | `research-canvas/research-canvas-console.tsx` | Pass-through; likely **no change** |
| Empty canvas | `research-canvas/EmptyCanvas.tsx` | Pass-through; likely **no change** |
| Host UI | `research-canvas/EnhancedAnimatedChat.tsx` | **Primary edit** — replace pills |

Known tools on the live stream (for card labels): `searchDatabase`, `searchExternalResources`, `addGraphNodes`, `addGraphEdges` (plus any unknown tool → generic label).

---

## Implementation plan

1. **Extract `ToolCard` (+ thin list)** under `features/mindmap/research-canvas/` (e.g. `tool-card.tsx`, `agent-tool-event-list.tsx`) — keep `EnhancedAnimatedChat` from growing further.
2. **Summarize events** with pure helpers (same file or `tool-event-summary.ts`):
   - query: `parameters.search_terms` / `parameters.query` / `parameters.table` / fallback `message`
   - counts: reuse the same result-shape tolerance as `use-mindmap-agent` (`results` | `records` | array; node/edge array lengths)
   - error: `message` or stringified short error
3. **Render** a vertical stack of cards (newest last or chronological as streamed). Collapsed row = label + status chip; expanded = params + summary. Show **complete** and **error** cards, not only `processing`.
4. **Collapse processing→complete** for the same tool step when consecutive events share tool + intent (optional polish): prefer appending distinct events over inventing IDs if the stream has no stable id — index+tool+status is fine for MVP.
5. **Preserve** existing chat animation / analysis / follow-up; ToolCards slot where pills live today (expanded chat body), scrollable if many.
6. **Visual language:** Microfilm / research-canvas chrome already in the chat — archival HUD, not SaaS KPI tiles; avoid purple glow / pill-cluster noise. Status via quiet mono labels + muted accents.

### Files to touch

| Path | Change |
| --- | --- |
| `apps/app/src/features/mindmap/research-canvas/EnhancedAnimatedChat.tsx` | Swap pills → `<AgentToolEventList events={…} />` |
| `apps/app/src/features/mindmap/research-canvas/tool-card.tsx` | **New** — expandable card |
| `apps/app/src/features/mindmap/research-canvas/agent-tool-event-list.tsx` | **New** — map events → cards |
| `apps/app/src/features/mindmap/research-canvas/tool-event-summary.ts` | **New** — pure summarize helpers |
| Optional: Vitest for `tool-event-summary.ts` only | Unit-test count/query extraction |

**Likely untouched:** `use-mindmap-agent.ts`, `graph.tsx`, `research-canvas-console.tsx`, API route, Zustand store.

---

## Acceptance criteria / dogfood

Run on **`/research-canvas`** with a live mindmap agent (OpenAI + Neon/Exa as configured):

1. Empty canvas → submit a corpus-heavy query (e.g. a known entity that triggers `searchDatabase`).
2. **During stream:** at least one ToolCard appears for `searchDatabase` (or external) with **processing** then **complete**.
3. **Expand** a complete card → see query/params and a **hit count** (or “0 results”).
4. If the agent also calls `searchExternalResources` / graph writes, those appear as separate cards (not swallowed).
5. Force or wait for a tool **error** if feasible → card shows error state + message (else document as unverified in completion report).
6. After stream completes, cards remain visible in the chat chrome (not only while `processing`).
7. Graph still receives nodes/edges as today — ToolCards must not break `runAgentQueryAndAddNodes`.

**UNVERIFIED** if no credentials / no stream — say so; do not claim done.

---

## Out of scope (RC-P1+)

| Phase | What waits |
| --- | --- |
| RC-P1 | Mirror tools into `researchSession.sources` / inject session into next turn |
| RC-P2 | Wire typer “Deep Research” + `researchFocus: 'deep-research'` |
| RC-P3 | Dossier artifact → SynthesisPanel |
| RC-P4 | Plan → on-canvas waypoints (T-050) |

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Result shapes vary (`results` vs `records` vs bare array) | Centralize summary helpers; mirror hook logic |
| Chat height / animation layout fights long card stacks | Max-height + scroll inside card list; don’t expand chat height unbounded |
| Duplicate processing+complete rows feel noisy | Accept for MVP; optional collapse later |
| Agent doesn’t call tools for some prompts | Dogfood with a prompt known to hit Neon; note in report if tool-less |

---

## Estimate

| Item | Size |
| --- | --- |
| ToolCard + list + summary helpers + chat wire-in | **S** (~2–4 focused hours) |
| Dogfood visual audit + completion report | +0.5–1 h |
| **Total MVP** | **≤ 0.5 day** |

---

## Approve / reject

- **Approve** → implement RC-P0 only per this plan; leave epic phases untouched.
- **Reject / reshape** → say whether to fold a thin RC-P1 sources mirror into the same PR (not recommended: doubles DoD surface without being required for first visible Gen-UI win).
