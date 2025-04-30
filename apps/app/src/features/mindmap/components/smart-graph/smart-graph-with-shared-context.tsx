'use client'

import { ReactNode } from 'react'
import { useSharedAI } from '../../ai-context/shared-ai-context'

/**
 * SmartGraph - A wrapper component that adds AI capabilities to the mindmap graph
 * by using the shared AI context.
 */
export function SmartGraphWithSharedContext({ children }: { children: ReactNode }) {
  // Get the shared AI context
  const { 
    activeNode,
    handleAddNote,
    handleFindConnections,
    handleLoadRelatedEntities,
    handleUpdateNodeLabel,
    handleDeleteNode,
    handleReorganizeLayout
  } = useSharedAI()
  
  // Return the children components (Graph)
  return <>{children}</>
}