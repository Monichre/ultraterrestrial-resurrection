import {NER_EXTRACTION_PROMPT} from '@/services/ai/prompts/ner-extraction-prompt'

export type AgentContextGraphNode = {
  id: string
  type?: string
  label?: string
  table?: string
}

export type AgentContextGraphEdge = {
  source: string
  target: string
  label?: string
  reasoning?: string
}

export type AgentContextGraphState = {
  nodeCount?: number
  edgeCount?: number
  activeNodeId?: string | null
  activeView?: string | null
  nodes?: AgentContextGraphNode[]
  edges?: AgentContextGraphEdge[]
}

export type BuildAgentContextOptions = {
  userMessage: string
  researchFocus?: string | null
  contextRules?: string | null
  graphState?: AgentContextGraphState | null
  includeSchemaHints?: boolean
  includeNerPrompt?: boolean
}

const DB_SCHEMA_HINTS = `
Use these table-level hints when selecting search targets:
- events: incident details, chronology, location, event metadata
- personnel: individuals, witnesses, ranks, roles, credibility
- organizations: agencies, groups, memberships, organizational relationships
- testimonies: claims, witness statements, source context, linked events
- documents: reports, memos, source URLs, publication metadata
- topics: thematic concepts, cross-links to experts and testimonies
- sightings: geotemporal sighting records and observational attributes
- artifacts: physical evidence, provenance, media references
`.trim()

const EPISTEMIC_GUIDANCE = `
Keep source material and analysis distinct. Label analytical statements as observed, corroborated,
contested, inferred, speculative, resonant, unverified, or disconfirmed. A claim is a discrete
assertion from a source; never call model-generated analysis a claim. Pair a reading with a
counter-reading, name contradictions, and end synthesis with a falsifiable next trace rather than
premature closure.
`.trim()

const formatGraphState = (graphState?: AgentContextGraphState | null): string => {
  if (!graphState) {
    return 'No current graph state was provided.'
  }

  const nodes = Array.isArray(graphState.nodes) ? graphState.nodes : []
  const edges = Array.isArray(graphState.edges) ? graphState.edges : []
  const nodeCount = graphState.nodeCount ?? nodes.length
  const edgeCount = graphState.edgeCount ?? edges.length

  const summarizedNodes = nodes
    .slice(0, 40)
    .map((node) => `- ${node.id} (${node.type || 'entity'}): ${node.label || node.id}`)
    .join('\n')

  const summarizedEdges = edges
    .slice(0, 60)
    .map((edge) => {
      const annotation = edge.label || edge.reasoning
      return annotation
        ? `- ${edge.source} -> ${edge.target} (${annotation})`
        : `- ${edge.source} -> ${edge.target}`
    })
    .join('\n')

  return [
    `Node count: ${nodeCount}`,
    `Edge count: ${edgeCount}`,
    graphState.activeView ? `Active view: ${graphState.activeView}` : null,
    graphState.activeNodeId ? `Active node ID: ${graphState.activeNodeId}` : null,
    summarizedNodes ? `Known nodes:\n${summarizedNodes}` : null,
    summarizedEdges ? `Known edges:\n${summarizedEdges}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildAgentContext({
  userMessage,
  researchFocus,
  contextRules,
  graphState,
  includeSchemaHints = true,
  includeNerPrompt = true,
}: BuildAgentContextOptions): string {
  return [
    '# Shared Agent Context',
    `## User Query\n${userMessage}`,
    researchFocus ? `## User Research Focus\n${researchFocus}` : null,
    contextRules ? `## Context Rules\n${contextRules}` : null,
    `## Current Graph State\n${formatGraphState(graphState)}`,
    `## Epistemic Guidance\n${EPISTEMIC_GUIDANCE}`,
    includeSchemaHints ? `## Database Schema Hints\n${DB_SCHEMA_HINTS}` : null,
    includeNerPrompt
      ? `## Named Entity Extraction Guidance\n${NER_EXTRACTION_PROMPT.trim()}`
      : null,
  ]
    .filter(Boolean)
    .join('\n\n')
}
