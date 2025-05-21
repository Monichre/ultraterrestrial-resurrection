'use client'

import { Graph } from './graph'
import { SmartGraphWithSharedContext } from './components/smart-graph/smart-graph-with-shared-context'
import { SmartBottomMenuWithSharedContext } from './components/menus/mindmap-bottom-menu/smart-bottom-menu-with-shared-context'
import { SharedAIProvider } from './ai-context/shared-ai-context'

/**
 * SmartMindmapWithSharedContext - A comprehensive AI-enabled mindmap component
 * that uses a shared context between the graph and bottom menu components
 * to provide a fully integrated AI-enhanced experience.
 */
export function SmartMindmapWithSharedContext() {
  return (
    <SharedAIProvider>
      <SmartGraphWithSharedContext>
        <Graph />
      </SmartGraphWithSharedContext>
      <SmartBottomMenuWithSharedContext />
    </SharedAIProvider>
  )
}