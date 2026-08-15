# Generative UI Agents Fit

**Date:** 2026-08-09
**Canvas:** [deep-research-agent-fit.canvas.tsx](/Users/liamellis/.cursor/projects/Users-liamellis-Desktop-apps-ultraterrestrial-resurrection/canvases/deep-research-agent-fit.canvas.tsx)

## References

1. [ai-deep-research-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent) — plan/research/files + tool cards + workspace sidecar (CopilotKit + LangGraph Deep Agents + Tavily)
2. [ai-dashboard-canvas-agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent) — thin chat + agent-written canvas via shared `AgentState` (CopilotKit + Google ADK + AG-UI)

## Verdict

Compose both patterns onto live Ultraterrestrial paths. Do not port either dual-runtime stack.

| Pattern source | Steal | Host |
| --- | --- | --- |
| Deep Research | plan → multi-hop → dossier; tool-rendered cards; nested-tool noise control | Prometheus AI SDK (`/api/prometheus/chat`) |
| Dashboard Canvas | chat as rail; shared mutable canvas state; addressable artifacts across turns | Research canvas + spacetime |

## Architecture map

```
User query
  → thin chat / command rail
  → AI SDK streamText (Prometheus) OR mindmap Assistants SSE
  → tools mutate canvasSession (Zustand)
  → surfaces project session:
       plan → waypoints
       sources → graph nodes
       dossier → synthesis panel
       pins/layers → spacetime HUD
```

## Key modules (existing)

- `apps/app/src/app/api/prometheus/chat/route.ts` — tools including `researchExternalTopic`
- `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts` — tool events → graph writes
- `apps/app/src/features/mindmap/components/synthesis-panel.tsx` — dossier surface
- `apps/app/src/features/spacetime/` — layer/inspector targets for pins
- `packages/ai/agents/*.md` — persona prompt grammar only (not services)

## Data flow

1. Tool completes → normalize into `canvasSession`
2. Session injected into next turn context (like today’s `graphState`)
3. Optional persist: `agent_inferences` only; never retrieval (ADR-0001)

## Process

P0 tool cards → P1 canvasSession → P2 plan/dossier tools + maxSteps → P3 canvas projection → P4 optional persona packs.

## Research-canvas deep dive

Surface-specific application of this analysis:

- Canvas: [research-canvas-genui-fit.canvas.tsx](/Users/liamellis/.cursor/projects/Users-liamellis-Desktop-apps-ultraterrestrial-resurrection/canvases/research-canvas-genui-fit.canvas.tsx)
- Notes: `ResearchCanvasGenUiFit.md` + `ResearchCanvasGenUiFit_PSUEDOCODE.md`

## Non-goals

No CopilotKit/ADK/LangGraph product path; no generic KPI dashboard; no Deep Research sidecar as final UX; no Tavily/google_search as primary retrieval.
