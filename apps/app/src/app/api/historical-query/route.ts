// DEAD STUB: This route always returns 501 — the underlying askXataWithAi dependency was removed
// during the Postgres migration (SP3). The entire call chain is broken:
//   historical-query-agent.ts → historical-query-server-actions.ts → askXataWithAi (retired Xata SDK)
// The agent file also imports @db/xata/client which is retired.
// TODO: Delete this route and its consumer chain (historical-query-agent.ts,
//       historical-query-server-actions.ts, research-runtime.ts, tour-state-agent.ts)
//       once the mindmap bottom menu is confirmed to not depend on any live behaviour from it.
//       Check: mindmap-bottom-menu.tsx imports historicalQueryAgent — if that code path is
//       currently reachable in the UI, it will silently fail (501) at runtime.

import { NextRequest, NextResponse } from 'next/server'
import {
  getGraphContext,
  generateTourAwareSearchRules,
  determineHistoricalProgression,
  type GraphContext
} from '@/features/mindmap/utils/contextual-intelligence'

export interface HistoricalQueryRequest {
  type: 'chronological-progression' | 'tour-waypoint' | 'contextual-expansion'
  priority: 'high' | 'medium' | 'low'
  graphContext: GraphContext
  parameters: {
    table: string
    amount?: number
    historicalFilter?: {
      mode: 'chronological' | 'contextual' | 'free-form'
      dateRange?: { startYear?: number; endYear?: number }
      significance?: 'historically_important' | 'all' | 'disclosure_related'
      progression?: 'forward' | 'backward' | 'context-based'
    }
    tourContext?: {
      tourId: string
      waypointId: string
      tourMode: 'guided' | 'free-form'
      narrativeContext: string
    }
  }
}

export interface HistoricalQueryResponse {
  nodes: any[]
  edges: any[]
  analysis: string
  suggestions: string[]
}

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'historical-query: AI ask not yet ported to Postgres layer' },
    { status: 501 }
  )
}

// NOTE: processChronologicalProgression, processTourWaypoint, and processContextualExpansion
// previously called askXataWithAi from @db/src/xata-typescript-sdk/api, which has been removed
// as part of the Postgres migration. This route returns 501 until the AI-ask layer is ported.

// Helper functions (extracted from original agent class)
function buildChronologicalQuery(
  progression: NonNullable<GraphContext['historicalProgression']>,
  parameters: HistoricalQueryRequest['parameters']
): string {
  const direction = progression.nextChronologicalStep.direction
  const targetYear = progression.nextChronologicalStep.suggestedYear
  const currentEra = progression.currentPeriod.era

  if (direction === 'forward') {
    return `Find ${parameters.amount || 3} historically significant ${parameters.table} records that chronologically follow the ${currentEra}, progressing toward ${targetYear}. Focus on events that show historical development and disclosure evolution.`
  } else {
    return `Find ${parameters.amount || 3} historically significant ${parameters.table} records that preceded the ${currentEra}, showing the historical context and antecedents that led to current events.`
  }
}

function buildChronologicalRules(
  progression: NonNullable<GraphContext['historicalProgression']>,
  parameters: HistoricalQueryRequest['parameters']
): string[] {
  const rules = [
    `Current historical period: ${progression.currentPeriod.era} (${progression.currentPeriod.startYear}-${progression.currentPeriod.endYear})`,
    `Next chronological step: ${progression.nextChronologicalStep.rationale}`,
    `Target progression year: ${progression.nextChronologicalStep.suggestedYear}`,
    'Prioritize records with clear chronological significance',
    'Include events that show historical development patterns',
    'Focus on disclosure-related developments and watershed moments'
  ]

  if (progression.significantEvents.length > 0) {
    rules.push(`Consider relationships to significant events: ${progression.significantEvents.join(', ')}`)
  }

  return rules
}

function transformRecordsToNodes(
  records: any[], 
  table: string, 
  nodeContext: 'chronological' | 'tour-guided' | 'contextual'
): any[] {
  return records.map((record, index) => ({
    id: record.id || `${table}-${index}`,
    type: 'enhancedEntityNodePOC',
    position: { x: index * 250, y: 0 },
    data: {
      ...record,
      type: table,
      nodeContext,
      connectable: true,
      selectable: true,
      deletable: true,
      focusable: true,
    },
    connectable: true,
    selectable: true,
    deletable: true,
    focusable: true,
    draggable: true,
  }))
}

function generateChronologicalEdges(
  nodes: any[], 
  progression: NonNullable<GraphContext['historicalProgression']>
): any[] {
  const edges: any[] = []

  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i]
    const targetNode = nodes[i + 1]

    edges.push({
      id: `chronological-${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'smoothstep',
      animated: false,
      label: 'Chronological progression',
      style: { 
        stroke: '#10b981', 
        strokeWidth: 2 
      },
      selectable: true,
      deletable: true,
      focusable: true,
      markerEnd: 'arrow',
    })
  }

  return edges
}

function generateTourEdges(
  nodes: any[], 
  tourContext: NonNullable<HistoricalQueryRequest['parameters']['tourContext']>
): any[] {
  const edges: any[] = []

  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i]
    const targetNode = nodes[i + 1]

    edges.push({
      id: `tour-${tourContext.waypointId}-${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'step',
      animated: true,
      label: `Tour: ${tourContext.waypointId}`,
      style: { 
        stroke: '#3b82f6', 
        strokeWidth: 2,
        strokeDasharray: '5,5'
      },
      selectable: true,
      deletable: false,
      focusable: true,
      markerEnd: 'arrow',
    })
  }

  return edges
}

function generateContextualEdges(nodes: any[], graphContext: GraphContext): any[] {
  // Simplified edge generation - expand as needed
  return []
}