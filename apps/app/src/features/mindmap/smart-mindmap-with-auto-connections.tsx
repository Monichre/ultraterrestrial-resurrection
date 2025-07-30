'use client'

import { ReactNode } from 'react'
import { Graph } from './graph'
import { SmartGraph } from './components/smart-graph'
import { SmartBottomMenu } from './components/menus/mindmap-bottom-menu/smart-bottom-menu'
import { AIMindMapProvider } from './components/ai-integration'
import { SmartAutoConnectionPanel } from './components/smart-auto-connection-panel'

/**
 * SmartMindmapWithAutoConnections - An enhanced AI-enabled mindmap component
 * that includes the Smart Contextual Node Auto-Connection System
 * 
 * This component builds on the existing SmartMindmap by adding:
 * - Contextual intelligence-driven auto-connections
 * - Real-time connection suggestions
 * - Spatial and temporal proximity analysis
 * - User-controlled auto-connection settings
 * 
 * Integration with existing systems:
 * - Uses existing Contextual Intelligence foundation
 * - Leverages Enhanced Nodes for UI consistency
 * - Builds on Spatial Intelligence infrastructure
 * - Maintains all existing functionality
 */
export function SmartMindmapWithAutoConnections() {
  return (
    <AIMindMapProvider>
      <SmartGraph>
        <Graph />
      </SmartGraph>
      <SmartBottomMenu />
      <SmartAutoConnectionPanel />
    </AIMindMapProvider>
  )
}

/**
 * WrapWithSmartConnections - A higher-order component that wraps any component
 * with AI capabilities AND smart auto-connection features.
 */
export function WrapWithSmartConnections({ children }: { children: ReactNode }) {
  return (
    <SmartGraph>
      {children}
      <SmartAutoConnectionPanel />
    </SmartGraph>
  )
}

/**
 * AutoConnectionEnabledGraph - A graph component specifically enhanced with
 * auto-connection capabilities while maintaining existing functionality
 */
export function AutoConnectionEnabledGraph() {
  return (
    <div className="relative w-full h-full">
      <Graph />
      <SmartAutoConnectionPanel />
    </div>
  )
}