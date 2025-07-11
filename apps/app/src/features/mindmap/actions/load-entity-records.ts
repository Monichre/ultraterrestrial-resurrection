"use server"

import { xataToXYFlow } from "./xata-to-xyflow"
import type { ReactFlowNode } from "./xata-to-xyflow"

export interface LoadEntityRecordsParams {
  type: string
  amount: number
  sourceNode: {
    id: string
    position: { x: number; y: number }
  }
  existingNodes?: ReactFlowNode[]
}

export interface LoadEntityRecordsResult {
  success: boolean
  nodes: ReactFlowNode[]
  edges: any[]
  context?: string
  error?: string
}

export async function loadEntityRecords( {
  type,
  amount,
  sourceNode,
  existingNodes = []
}: LoadEntityRecordsParams ): Promise<LoadEntityRecordsResult> {
  try {
    const question = `Show me ${amount} interesting ${type} records and explain the relationships between them.`

    const flowData = await xataToXYFlow( {
      question,
      table: type,
      rules: `Find the most interesting ${type} records that have clear relationships between them`,
      context: `The user is exploring the ${type} database and wants to see ${amount} records with interesting relationships.`,
      existingNodes,
      sourceNode: {
        id: sourceNode.id,
        type: 'userInputNode',
        position: sourceNode.position,
        data: {}
      }
    } )

    if ( flowData && flowData.nodes.length > 0 ) {
      return {
        success: true,
        nodes: flowData.nodes,
        edges: flowData.edges,
        context: flowData.xataResponse?.answer
      }
    } else {
      return {
        success: false,
        nodes: [],
        edges: [],
        error: `No ${type} data found or there was an error fetching the data.`
      }
    }
  } catch ( error ) {
    console.error( 'Error loading entity records:', error )
    return {
      success: false,
      nodes: [],
      edges: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 