---
status: live
role: eng
spine: do
updated: 2026-08-09
linear: DMGD-219
todo: T-053
---

# Research Canvas Gen-UI Upgrade — Canonical Spec

**Linear:** [DMGD-219](https://linear.app/digital-mischief-group/issue/DMGD-219/lane-b-research-canvas-gen-ui-upgrade-deep-research-loop-agentic)
**Ledger:** T-053 in [`TODO.md`](./TODO.md)
**Architecture decision:** FEATURES Decision 11
**Lane:** B — Platform & Experience
**Surface:** `/research-canvas` → `apps/app/src/features/mindmap` shell

## References (external)

1. [ai-deep-research-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent) — plan → research → files + ToolCards + Workspace sidecar (CopilotKit + LangGraph Deep Agents + Tavily)
2. [ai-dashboard-canvas-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent) — thin chat + agent-written canvas via shared `AgentState` (CopilotKit + Google ADK + AG-UI)

Session fit canvases (non-canon, analysis UI): Cursor `canvases/deep-research-agent-fit.canvas.tsx`, `canvases/research-canvas-genui-fit.canvas.tsx`. Scratch precursor: `.scratch/deep-research-genui-fit/` (superseded by this file for tracking).

## Verdict

Compose both Gen-UI patterns onto the **live research-canvas shell**. Do not port either dual-runtime stack.

| Pattern source | Steal | Host on research-canvas |
| --- | --- | --- |
| Deep Research | plan → multi-hop → dossier; ToolCards; nested-tool noise control | Disclosure mindmap SSE + console |
| Dashboard Canvas | chat as rail; shared mutable AgentState; addressable artifacts across turns | Graph + expand T-027 `researchSession` |

Research canvas is **already** Dashboard-Canvas geometrically:

```
(site)/research-canvas/page.tsx
  → MindMap
    → ViewSwitcher(canvasContent=<Graph />)
      → Graph mounts FloatingToolbar + ResearchCanvasConsole
      → useMindMapAgent → POST /api/disclosure/mindmap (SSE)
      → tool results → nodes/edges
```

What is missing is the Deep Research **loop** and making `researchSession` the AgentState source of truth — not a CopilotKit Workspace sidecar.

## Design constraints (binding)

- Intelligence lands in **records, waypoints, connections**, and the **synthesis dossier** — not insight-card sidebars or a peer Workspace pane.
- AI-authored text is **inference**, never a “claim”; persist via `agent_inferences` only; **ADR-0001** — never into retrieval.
- Orchestration over replacement: enhance the disclosure mindmap path; no third AI protocol.
- Do not add Gen-UI state to `mindmap-context.tsx`.
- Do not host Gen-UI in `features/research-canvas/*` Storybook islands.
- RC-P4 must use the **same React Flow** as Graph (align with T-050); no second canvas for plans.

## Artifact remapping

| Reference | Ultraterrestrial / research-canvas |
| --- | --- |
| `write_todos` | `researchSession.plan` → (later) T-050 waypoints |
| `research()` / Tavily | Existing `searchDatabase`, `searchExternalResources`, graph writes |
| `write_file` report | `researchSession.artifacts` → `SynthesisPanel` |
| `pinnedMetrics` | `pinnedCards` + evidence pins (not SaaS KPI tiles) |
| charts line/bar/pie | Existing ViewSwitcher views — not agent-driven Recharts specs |
| `AgentState` | Expand `ResearchSessionState` in `mindmap-ui-store.ts` |
| ToolCard | Upgrade pills in `EnhancedAnimatedChat` |
| Workspace sidecar | **Reject** — project into Graph + dossier + waypoints |

## Target session shape (extend T-027)

```ts
researchSession = {
  // existing
  sessionId, activeMode, isProcessing, selectedNodeIds,
  analysisResults, pinnedCards, canvasNotes,
  // new
  plan: [{ id, content, status }],
  sources: [{ id, kind: 'neon' | 'exa' | 'vector', title, ref, tier? }],
  artifacts: [{ id, kind: 'dossier', content, createdAt }],
}
```

Persist only what T-027 already persists unless explicitly promoting artifacts to `agent_inferences`.

## Phases

### RC-P0 — Tool cards

Upgrade `EnhancedAnimatedChat` to render `AgentToolEvent` as expandable ToolCards (query, counts, error). No backend changes.

**Proof:** Submit a query; see `searchDatabase` / `searchExternalResources` as cards during stream.

### RC-P1 — AgentState

Extend `ResearchSessionState`; mirror completed tool events from `useMindMapAgent` / `graph.tsx` into `plan` / `sources` / `artifacts`. Inject serialized session into turn context (Dashboard Canvas pattern).

**Proof:** Zustand `researchSession` updates live; next turn sees prior plan/sources.

### RC-P2 — Wire Deep Research mode

Typer “Deep Research” card + `deepResearchEnabled` set `activeMode` and pass `researchFocus: 'deep-research'` into `/api/disclosure/mindmap`. Prompt policy: plan first → corpus → external → dossier.

**Proof:** Card click changes behavior vs free explore; plan steps appear before searches.

### RC-P3 — Dossier bridge

`writeResearchDossier` (or final analysis mapping) → `researchSession.artifacts` + open/update `SynthesisPanelHost`. Epistemic badges required.

**Proof:** Deep research run ends with liturgy dossier on canvas without a separate toolbar click.

### RC-P4 — Plan → waypoints

Project `researchSession.plan` onto on-canvas waypoints after T-050 render lands. Soft-blocked on T-050 subtask 3.

**Proof:** Investigation plan traversable on the same React Flow as records.

## Key modules

| Symbol | Path |
| --- | --- |
| Shell | `features/mindmap/mind-map.tsx` |
| Agent ingress | `features/mindmap/hooks/use-mindmap-agent.ts` |
| Canvas writes | `features/mindmap/graph.tsx` (`runAgentQueryAndAddNodes`) |
| AgentState | `features/mindmap/store/mindmap-ui-store.ts` (`researchSession`) |
| Console / mode entry | `research-canvas/research-canvas-console.tsx` |
| ToolCards host | `research-canvas/EnhancedAnimatedChat.tsx` |
| Dossier | `components/synthesis-panel.tsx` |
| API | `app/api/disclosure/mindmap/route.ts` |
| Waypoints (later) | `features/mindmap/tours/` + `features/guided-tours/` (T-050) |

## Dependencies

- **Soft:** T-050 for RC-P4 only. RC-P0–P3 can ship without tours convergence.
- **Related:** T-027 (`researchSession` slice already exists; underused).
- **Not blocked** on Lane A T-048 H4 (this is investigation UX, not Spacetime provenance instrument).

## Non-goals

- CopilotKit + ADK or LangGraph Python product path
- Tavily / google_search as primary retrieval (Exa + Neon stay)
- Generic KPI dashboard as Gen-UI surface
- Deep Research Workspace pane as long-term home
- Third AI protocol beside mindmap + Prometheus

## Pass bar / Definition of Done

Dogfood on `/research-canvas`: Deep Research mode produces plan visibility, multi-tool cards, and a liturgy-tagged dossier without a sidecar Workspace. Completion requires evidence report + visual audit per [`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md).
