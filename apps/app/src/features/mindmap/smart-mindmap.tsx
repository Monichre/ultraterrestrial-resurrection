'use client'

import {ReactNode} from 'react'
import {Graph} from './graph'
import {SmartGraph} from './smart-graph'
import {SmartBottomMenu} from './components/menus/mindmap-bottom-menu/smart-bottom-menu'
import {AIMindMapProvider} from './components/ai-integration'

/**
 * SmartMindmap - A comprehensive AI-enabled mindmap component
 * that combines the SmartGraph and SmartBottomMenu components
 * to provide a fully AI-enhanced experience.
 */
export function SmartMindmap() {
  return (
    <AIMindMapProvider>
      <SmartGraph>
        <Graph />
      </SmartGraph>
      <SmartBottomMenu />
    </AIMindMapProvider>
  )
}

/**
 * WrapWithAI - A higher-order component that wraps any component
 * with AI capabilities through the SmartGraph wrapper.
 */
export function WrapWithAI({children}: {children: ReactNode}) {
  return <SmartGraph>{children}</SmartGraph>
}
