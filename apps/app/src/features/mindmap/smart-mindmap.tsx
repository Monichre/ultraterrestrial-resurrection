'use client'

import { ReactNode } from 'react'
import { Graph } from './graph'
import { SmartGraph } from './components/smart-graph'
import { SmartBottomMenu } from './components/menus/mindmap-bottom-menu/smart-bottom-menu'

/**
 * SmartMindmap - A comprehensive AI-enabled mindmap component
 * that combines the SmartGraph and SmartBottomMenu components
 * to provide a fully AI-enhanced experience.
 */
export function SmartMindmap() {
  return (
    <>
      <SmartGraph>
        <Graph />
      </SmartGraph>
      <SmartBottomMenu />
    </>
  )
}

/**
 * WrapWithAI - A higher-order component that wraps any component
 * with AI capabilities through the SmartGraph wrapper.
 */
export function WrapWithAI({ children }: { children: ReactNode }) {
  return (
    <SmartGraph>
      {children}
    </SmartGraph>
  )
}