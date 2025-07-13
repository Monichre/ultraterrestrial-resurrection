import { NextRequest, NextResponse } from 'next/server'
import { askXataWithAi } from '@db/xata/api'
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

export async function POST(request: NextRequest) {
  try {
    const body: HistoricalQueryRequest = await request.json()
    const { type, graphContext, parameters } = body

    let result: HistoricalQueryResponse

    switch (type) {
      case 'chronological-progression':
        result = await processChronologicalProgression(graphContext, parameters)
        break
      
      case 'tour-waypoint':
        result = await processTourWaypoint(graphContext, parameters)
        break
      
      case 'contextual-expansion':
        result = await processContextualExpansion(graphContext, parameters)
        break
      
      default:
        return NextResponse.json(
          { error: `Unknown task type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Historical query error:', error)
    return NextResponse.json(
      { error: 'Historical query failed' },
      { status: 500 }
    )
  }
}

async function processChronologicalProgression(
  graphContext: GraphContext, 
  parameters: HistoricalQueryRequest['parameters']
): Promise<HistoricalQueryResponse> {
  
  const progression = graphContext.historicalProgression || determineHistoricalProgression(graphContext)
  
  if (!progression) {
    throw new Error('No historical progression context available')
  }

  const query = buildChronologicalQuery(progression, parameters)
  const rules = buildChronologicalRules(progression, parameters)

  const response = await askXataWithAi({
    question: query,
    table: parameters.table,
    rules
  })

  const nodes = transformRecordsToNodes(response.records, parameters.table, 'chronological')
  const edges = generateChronologicalEdges(nodes, progression)

  return {
    nodes,
    edges,
    analysis: `Found ${nodes.length} records in ${progression.currentPeriod.era}. Next suggested period: ${progression.nextChronologicalStep.suggestedYear} (${progression.nextChronologicalStep.rationale}).`,
    suggestions: [
      `Explore ${progression.nextChronologicalStep.suggestedYear} events`,
      `Investigate connections to ${progression.significantEvents.slice(0, 2).join(' and ')}`,
      `Expand research into ${progression.currentPeriod.era}`
    ]
  }
}

async function processTourWaypoint(
  graphContext: GraphContext, 
  parameters: HistoricalQueryRequest['parameters']
): Promise<HistoricalQueryResponse> {
  
  if (!parameters.tourContext) {
    throw new Error('Tour context required for tour waypoint processing')
  }

  const tourRules = generateTourAwareSearchRules(graphContext)
  const query = `Following guided tour ${parameters.tourContext.tourId}, waypoint ${parameters.tourContext.waypointId}: ${parameters.tourContext.narrativeContext}`

  const response = await askXataWithAi({
    question: query,
    table: parameters.table,
    rules: [tourRules]
  })

  const nodes = transformRecordsToNodes(response.records, parameters.table, 'tour-guided')
  const edges = generateTourEdges(nodes, parameters.tourContext)

  return {
    nodes,
    edges,
    analysis: `Tour waypoint ${parameters.tourContext.waypointId} yielded ${nodes.length} relevant records.`,
    suggestions: [
      `Continue to next waypoint in ${parameters.tourContext.tourId}`,
      `Explore connections discovered in this waypoint`,
      `Deep dive into specific entities from this waypoint`
    ]
  }
}

async function processContextualExpansion(
  graphContext: GraphContext, 
  parameters: HistoricalQueryRequest['parameters']
): Promise<HistoricalQueryResponse> {
  
  const contextualRules = generateTourAwareSearchRules(graphContext)
  const query = `Expand the knowledge graph with ${parameters.amount || 3} related ${parameters.table} records`

  const response = await askXataWithAi({
    question: query,
    table: parameters.table,
    rules: [contextualRules]
  })

  const nodes = transformRecordsToNodes(response.records, parameters.table, 'contextual')
  const edges = generateContextualEdges(nodes, graphContext)

  return {
    nodes,
    edges,
    analysis: `Contextual expansion added ${nodes.length} records with ${edges.length} new connections.`,
    suggestions: [
      `Investigate key personnel connections`,
      `Explore organizational relationships`,
      `Follow temporal progression threads`
    ]
  }
}

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