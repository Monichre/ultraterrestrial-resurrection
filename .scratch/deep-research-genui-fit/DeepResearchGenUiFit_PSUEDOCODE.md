# Generative UI Agents Fit — Pseudocode (Deep Research + Dashboard Canvas)

**Date:** 2026-08-09
**Status:** analysis only — not implementing yet
**References:**
- https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent
- https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent

## Goal

Compose both Gen-UI patterns onto Ultraterrestrial without new agent runtimes:

1. **Deep Research** → investigative loop + tool cards + durable dossier
2. **Dashboard Canvas** → thin chat + shared `canvasSession` the agent mutates

## Shared session shape (Dashboard Canvas remapped)

```
canvasSession = {
  title,
  plan: [{ id, content, status }],          // from write_todos
  sources: [{ url|recordId, title, tier }], // from research tools
  artifacts: [{ path, content, kind }],     // from writeResearchDossier
  pins: [{ id, title, value, hint }],       // remapped pinnedMetrics
  layers: [{ id, visible, summary }],       // spacetime / canvas layers
  graphWrites: [{ nodes, edges }],          // mindmap projections
}
```

## Pseudocode

```
ON user submits investigative query Q on research-canvas | prometheus:

  session = canvasSessionStore.getOrCreate({ query: Q })

  agent = streamText({
    model: prometheusFallbackChain,
    messages: assembleCachedPrompt({
      system: UT_LITURGY_SYSTEM,
      messages,
      turnContext: serialize(session),   // Dashboard Canvas: state in prompt
    }),
    tools: {
      planInvestigation,          // Deep Research write_todos
      searchNeonDatabase,         // existing
      searchExternalResources,    // existing Exa
      researchExternalTopic,      // existing Exa Research Pro
      searchUAP,                  // existing
      upsertPins,                 // Dashboard Canvas pinnedMetrics remap
      upsertCanvasArtifacts,      // place/update addressable canvas objects
      writeResearchDossier,       // Deep Research write_file
    },
    stopWhen: stepCountIs(10),
  })

  FOR EACH stream part:
    IF tool-call:
      render ToolStatusCard(part)                 // Deep Research ToolCard
      ON complete:
        mutate canvasSession from args/result     // Dashboard AgentState write
        projectOntoSurface(session):
          plan      → waypoints
          sources   → entity/source nodes
          pins      → HUD pins / credibility chips
          artifacts → synthesis dossier / file stack
          layers    → spacetime layer panel

  ASSERT chat remains a thin rail; canvas is the durable surface
  ASSERT dossiers never enter retrieval (ADR-0001)
  ASSERT no CopilotKit / ADK / LangGraph product runtime started
```

## Explicit non-goals

- No CopilotKit + Google ADK dual stack
- No CopilotKit + LangGraph Deep Agents dual stack
- No generic SaaS KPI dashboard as the Gen-UI surface
- No Tavily / google_search as primary retrieval (Exa + Neon stay)
- No cloning Deep Research Workspace as the long-term UX
