import type { AIContextState } from "@/contexts/ai/ai-context"
import type { Edge } from "@xyflow/react"

type AIAction =
  | { type: 'UPDATE_MINDMAP'; payload: { nodes: Node[]; edges: Edge[] } }
  | { type: 'ADD_NODE'; payload: Node }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'UPDATE_INSIGHTS'; payload: { insights: any[]; nodes: Node[]; edges: Edge[] } }

export function aiReducer( state: AIContextState, action: AIAction ): AIContextState {
  switch ( action.type ) {
    case 'UPDATE_MINDMAP':
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
      }
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      }
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      }
    case 'UPDATE_INSIGHTS':
      return {
        ...state,
        insights: [...state.insights, ...action.payload.insights],
        nodes: [...state.nodes, ...action.payload.nodes],
        edges: [...state.edges, ...action.payload.edges],
      }
    default:
      return state
  }
}