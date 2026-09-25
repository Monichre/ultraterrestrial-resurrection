'use client'

import React, {createContext, useContext, useCallback} from 'react'
import {useAILoading} from '@/features/mindmap/hooks/use-ai-loading'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapStore} from '@/features/mindmap/store'

// Create a context for AI integration
interface AIMindMapContextProps {
  loadRecordsWithAI: (params: {
    entities: any[]
    type: string
    sourceNodeId: string
    amount?: number
  }) => Promise<void>
  isAIEnabled: boolean
}

const AIMindMapContext = createContext<AIMindMapContextProps>({
  loadRecordsWithAI: async () => {},
  isAIEnabled: false,
})

export const useAIMindMap = () => useContext(AIMindMapContext)

export function AIMindMapProvider({children}: {children: React.ReactNode}) {
  // Get mind map utilities from context and store
  const {getCenter, updateNodeData} = useMindMap()
  const {addNodes: storeAddNodes, addEdges: storeAddEdges} = useMindMapStore()

  // Create a simple wrapper for the add nodes function
  const addNodes = useCallback(
    (nodes: any[]) => {
      storeAddNodes(nodes)
    },
    [storeAddNodes]
  )

  // Create a simple wrapper for the add edges function
  const addEdges = useCallback(
    (edges: any[]) => {
      storeAddEdges(edges)
    },
    [storeAddEdges]
  )

  // Initialize AI loading hook
  const {loadRecordsWithAI} = useAILoading({
    addNodes,
    addEdges,
    getCenter,
    updateNodeData,
  })

  // Check if AI is enabled (has API key)
  const isAIEnabled = process.env.NEXT_PUBLIC_HAS_OPENAI_API === 'true'

  const contextValue = {
    loadRecordsWithAI,
    isAIEnabled,
  }

  return <AIMindMapContext.Provider value={contextValue}>{children}</AIMindMapContext.Provider>
}
