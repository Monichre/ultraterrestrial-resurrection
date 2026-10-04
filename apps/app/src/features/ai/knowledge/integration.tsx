'use client'

import React from 'react'
import { KnowledgeProvider } from './KnowledgeContext'
import { KnowledgeEnabledPipeline } from './components/KnowledgeEnabledPipeline'
import AIPipeline from '../pipelines/unified/AIPipeline'

/**
 * Entry point component that integrates the knowledge layer with the AI pipeline
 * This is the main export that can be used in a page component
 */
export function IntegratedAIPipeline() {
  return (
    <KnowledgeProvider>
      <KnowledgeEnabledPipeline>
        <AIPipeline />
      </KnowledgeEnabledPipeline>
    </KnowledgeProvider>
  )
}

/**
 * Higher-order component that adds knowledge capabilities to any component
 * @param Component The component to wrap with knowledge capabilities
 * @returns A new component with knowledge capabilities
 */
export function withKnowledge<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return (props: P) => {
    return (
      <KnowledgeProvider>
        <KnowledgeEnabledPipeline>
          <Component {...props} />
        </KnowledgeEnabledPipeline>
      </KnowledgeProvider>
    )
  }
}

/**
 * Sample page using the integrated pipeline
 * Can be imported directly in a Next.js page file
 */
export default function AIProcessingPageWithKnowledge() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">AI Processing Hub with Knowledge Layer</h1>
      <IntegratedAIPipeline />
    </div>
  )
}