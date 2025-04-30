'use client'

import { Graph } from './graph'
import { SmartGraph } from './components/smart-graph'

/**
 * AI-enhanced version of the graph component that provides
 * contextual awareness to the assistant through the SmartGraph wrapper.
 */
export function AIEnabledGraph(props: any) {
  return (
    <SmartGraph>
      <Graph {...props} />
    </SmartGraph>
  )
}