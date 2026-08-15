# Research Canvas Gen-UI Fit

**Date:** 2026-08-09
**Canvas:** [research-canvas-genui-fit.canvas.tsx](/Users/liamellis/.cursor/projects/Users-liamellis-Desktop-apps-ultraterrestrial-resurrection/canvases/research-canvas-genui-fit.canvas.tsx)
**Parents:** GenerativeUiAgentsFit.md · deep-research-agent-fit.canvas.tsx
**References:**
- https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent
- https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent

## Verdict (research-canvas only)

The live research-canvas shell is already a **Dashboard Canvas**: Graph is the product surface; `ResearchCanvasConsole` is the thin rail; `useMindMapAgent` → `runAgentQueryAndAddNodes` already mutates addressable canvas artifacts.

What is missing is the **Deep Research loop** (explicit plan, inspectable tool cards, mid-run dossier) wired through the existing **`researchSession` (T-027)** slice — not a new CopilotKit Workspace.

## Canonical path

```
(site)/research-canvas/page.tsx
  → MindMap (mind-map.tsx)
    → ViewSwitcher(canvasContent=<Graph />)
      → Graph mounts FloatingToolbar + ResearchCanvasConsole
      → console → useMindMapAgent → /api/disclosure/mindmap SSE
      → tool results → nodes/edges (+ eventually researchSession)
```

## Architecture mapping

| Reference concept | Research-canvas equivalent |
| --- | --- |
| Dashboard main canvas | `Graph` React Flow |
| Thin chat sidebar | `ResearchCanvasConsole` / `EnhancedAnimatedChat` |
| AgentState | Expand `ResearchSessionState` in `mindmap-ui-store` |
| pinnedMetrics | `pinnedCards` + future evidence pins (not KPI tiles) |
| charts | Temporal/network views already in ViewSwitcher — not Recharts agent specs |
| write_todos | `researchSession.plan` → T-050 waypoints |
| research() | Existing mindmap tools: `searchDatabase`, `searchExternalResources`, graph writes |
| write_file report | `researchSession.artifacts` → `SynthesisPanel` |
| ToolCard Gen-UI | Upgrade pills in `EnhancedAnimatedChat` |
| Workspace sidecar | **Reject** — project into Graph + dossier + waypoints |

## Key modules

| Module | Role |
| --- | --- |
| `hooks/use-mindmap-agent.ts` | SSE ingress; mirror tools into session |
| `graph.tsx` `runAgentQueryAndAddNodes` | Canvas writes |
| `store/mindmap-ui-store.ts` `researchSession` | Shared AgentState |
| `research-canvas/EnhancedAnimatedChat.tsx` | ToolCards host |
| `research-canvas/research-canvas-console.tsx` | Deep Research mode entry |
| `components/synthesis-panel.tsx` | Dossier surface |
| `tours/` + T-050 | Plan → waypoints (later) |

## Dead / avoid

- `deepResearchEnabled` currently does not change agent behavior — wire or stop advertising
- `features/research-canvas/*` Storybook case-file islands — not the live shell
- `mindmap-context.tsx` — do not add Gen-UI state here
- Second React Flow for plans — wait for T-050 on-canvas render

## Process

RC-P0 ToolCards → RC-P1 expand researchSession → RC-P2 wire Deep Research mode → RC-P3 dossier bridge → RC-P4 waypoints (with T-050).

## Data flow (target)

1. User submits (optionally Deep Research mode)
2. Agent streams tools; console shows ToolCards
3. Completed tools mutate `researchSession` + Graph
4. Session serialized into next turn context
5. Dossier artifact opens SynthesisPanel; optional `agent_inferences` persist (ADR-0001)
