'use client'

import React, { useState } from 'react'
import { KnowledgeItem } from '../types'
import { KnowledgeProvider } from '../KnowledgeContext'
import { KnowledgePicker } from './KnowledgePicker'
import { KnowledgeViewer } from './KnowledgeViewer'
import { useUnifiedPipeline } from '../../pipelines/unified/AIPipeline'

interface KnowledgeEnabledPipelineProps {
  children: React.ReactNode
}

/**
 * A wrapper component that provides knowledge context to any pipeline component
 * Displays a knowledge picker and viewer alongside the pipeline UI
 */
export function KnowledgeEnabledPipeline({ children }: KnowledgeEnabledPipelineProps) {
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null)
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
  
  // Get unified pipeline context (if available)
  let pipelineContext: any
  try {
    pipelineContext = useUnifiedPipeline()
  } catch (error) {
    // Pipeline context not available, that's okay
    pipelineContext = null
  }
  
  const handleAddToPipeline = (item: KnowledgeItem, pipelineType: 'document' | 'web' | 'agent') => {
    if (!pipelineContext) return
    
    // Format the item for the appropriate pipeline and add it
    switch (pipelineType) {
      case 'document':
        pipelineContext.addDocumentData({
          id: item.id,
          title: item.title,
          content: item.content,
          analysis: { 
            source: item.source,
            sourceType: item.sourceType,
            metadata: item.metadata
          }
        })
        break
      case 'web':
        pipelineContext.addWebData({
          url: item.source,
          title: item.title,
          content: item.content,
          summary: item.summary || `Source: ${item.sourceType}`
        })
        break
      case 'agent':
        pipelineContext.addAgentData({
          prompt: `Analyze the following content: ${item.title}`,
          result: {
            content: item.content,
            metadata: item.metadata,
            source: item.source,
            type: item.contentType
          }
        })
        break
    }
    
    // Switch to the appropriate tab if in unified pipeline
    if (pipelineContext.setActiveTab) {
      pipelineContext.setActiveTab(pipelineType)
    }
  }
  
  return (
    <KnowledgeProvider>
      <div className="flex h-full">
        {/* Sidebar toggle button */}
        <button 
          className="fixed top-4 right-4 z-20 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          aria-label={sidebarVisible ? "Hide knowledge sidebar" : "Show knowledge sidebar"}
        >
          {sidebarVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* Main content area */}
        <div className={`flex-grow transition-all ${sidebarVisible ? 'mr-[320px]' : 'mr-0'}`}>
          {children}
        </div>
        
        {/* Knowledge sidebar */}
        <div 
          className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l shadow-lg overflow-y-auto z-10 transition-transform transform ${
            sidebarVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Knowledge Base</h2>
          </div>
          
          <div className="p-3">
            <KnowledgePicker
              onSelect={setSelectedKnowledge}
              className="mb-4"
            />
          </div>
          
          {selectedKnowledge && (
            <div className="px-3 pb-3">
              <KnowledgeViewer 
                item={selectedKnowledge} 
                showActions={!!pipelineContext}
                onAddToPipeline={handleAddToPipeline}
              />
            </div>
          )}
        </div>
      </div>
    </KnowledgeProvider>
  )
}