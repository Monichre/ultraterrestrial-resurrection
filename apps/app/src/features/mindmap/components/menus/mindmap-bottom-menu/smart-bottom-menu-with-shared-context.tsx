'use client'

import { useEffect } from 'react'
import { MindMapBottomMenu } from './mindmap-bottom-menu'
import { useSharedAI } from '../../../ai-context/shared-ai-context'

/**
 * SmartBottomMenu - A wrapper component that adds AI capabilities to the mindmap bottom menu
 * by using the shared AI context.
 */
export function SmartBottomMenuWithSharedContext() {
  // Get the shared AI context
  const { 
    activeCommand,
    selectedModel,
    setActiveCommand,
    setSelectedModel
  } = useSharedAI()
  
  // Return the menu with the change handlers connected to shared context
  return (
    <MindMapBottomMenu 
      onCommandChange={setActiveCommand}
      onModelChange={setSelectedModel}
    />
  )
}