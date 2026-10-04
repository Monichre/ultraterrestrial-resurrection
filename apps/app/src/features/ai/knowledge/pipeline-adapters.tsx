'use client'

import React, { useState } from 'react'
import { KnowledgeProvider, useKnowledge } from './KnowledgeContext'
import { KnowledgePicker, KnowledgeViewer } from './components'
import { KnowledgeItem } from './types'

// Types matching the expected props for different pipeline components
type DocumentPipelineProps = {
  initialDocument?: { id: string; title: string; content: string; metadata?: any }
  onDocumentProcess?: (result: any) => void
}

type WebPipelineProps = {
  initialUrl?: string
  initialContent?: string
  onWebProcess?: (result: any) => void
}

type AgentPipelineProps = {
  initialPrompt?: string
  context?: any
  onAgentExecute?: (result: any) => void
}

/**
 * HOC that adds knowledge capabilities to the Document Processing Pipeline
 * @param DocumentPipeline The original document pipeline component
 * @returns A new component with knowledge picker integration
 */
export function withKnowledgeForDocumentPipeline<P extends DocumentPipelineProps>(
  DocumentPipeline: React.ComponentType<P>
): React.FC<Omit<P, 'initialDocument'>> {
  return (props: Omit<P, 'initialDocument'>) => {
    const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null)
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)

    // Convert knowledge item to document format
    const documentFromKnowledge = selectedKnowledge ? {
      id: selectedKnowledge.id,
      title: selectedKnowledge.title,
      content: selectedKnowledge.content,
      metadata: selectedKnowledge.metadata
    } : undefined

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
            <DocumentPipeline
              {...(props as any)}
              initialDocument={documentFromKnowledge}
            />
          </div>
          
          {/* Knowledge sidebar */}
          <div 
            className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l shadow-lg overflow-y-auto z-10 transition-transform transform ${
              sidebarVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Knowledge for Document Pipeline</h2>
              <p className="text-sm text-gray-500 mt-1">Select a document to load into the pipeline</p>
            </div>
            
            <div className="p-3">
              <KnowledgePicker
                onSelect={setSelectedKnowledge}
                className="mb-4"
              />
            </div>
            
            {selectedKnowledge && (
              <div className="px-3 pb-3">
                <KnowledgeViewer item={selectedKnowledge} />
                
                <div className="mt-3">
                  <button
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      // Reselect to trigger rerender of pipeline
                      const temp = selectedKnowledge;
                      setSelectedKnowledge(null);
                      setTimeout(() => setSelectedKnowledge(temp), 10);
                    }}
                  >
                    Use in Document Pipeline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </KnowledgeProvider>
    )
  }
}

/**
 * HOC that adds knowledge capabilities to the Web Processing Pipeline
 * @param WebPipeline The original web pipeline component
 * @returns A new component with knowledge picker integration
 */
export function withKnowledgeForWebPipeline<P extends WebPipelineProps>(
  WebPipeline: React.ComponentType<P>
): React.FC<Omit<P, 'initialUrl' | 'initialContent'>> {
  return (props: Omit<P, 'initialUrl' | 'initialContent'>) => {
    const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null)
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)

    return (
      <KnowledgeProvider>
        <div className="flex h-full">
          {/* Sidebar toggle button */}
          <button 
            className="fixed top-4 right-4 z-20 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
            onClick={() => setSidebarVisible(!sidebarVisible)}
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
            <WebPipeline
              {...(props as any)}
              initialUrl={selectedKnowledge?.source}
              initialContent={selectedKnowledge?.content}
            />
          </div>
          
          {/* Knowledge sidebar */}
          <div 
            className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l shadow-lg overflow-y-auto z-10 transition-transform transform ${
              sidebarVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Knowledge for Web Pipeline</h2>
              <p className="text-sm text-gray-500 mt-1">Select web content to analyze</p>
            </div>
            
            <div className="p-3">
              <KnowledgePicker
                onSelect={setSelectedKnowledge}
                filter={{ 
                  sources: [KnowledgeSources.R2R, KnowledgeSources.VECTOR] 
                }}
                className="mb-4"
              />
            </div>
            
            {selectedKnowledge && (
              <div className="px-3 pb-3">
                <KnowledgeViewer item={selectedKnowledge} />
                
                <div className="mt-3">
                  <button
                    className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => {
                      // Reselect to trigger rerender of pipeline
                      const temp = selectedKnowledge;
                      setSelectedKnowledge(null);
                      setTimeout(() => setSelectedKnowledge(temp), 10);
                    }}
                  >
                    Use in Web Pipeline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </KnowledgeProvider>
    )
  }
}

/**
 * HOC that adds knowledge capabilities to the Agent Execution Pipeline
 * @param AgentPipeline The original agent pipeline component
 * @returns A new component with knowledge picker integration
 */
export function withKnowledgeForAgentPipeline<P extends AgentPipelineProps>(
  AgentPipeline: React.ComponentType<P>
): React.FC<Omit<P, 'initialPrompt' | 'context'>> {
  return (props: Omit<P, 'initialPrompt' | 'context'>) => {
    const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null)
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
    const [customPrompt, setCustomPrompt] = useState<string>("")

    // Generate a prompt based on selected knowledge
    const prompt = selectedKnowledge ? 
      customPrompt || `Analyze the following content: ${selectedKnowledge.title}` : 
      undefined

    // Create context object from knowledge item
    const context = selectedKnowledge ? {
      content: selectedKnowledge.content,
      metadata: selectedKnowledge.metadata,
      source: selectedKnowledge.source,
      sourceType: selectedKnowledge.sourceType
    } : undefined

    return (
      <KnowledgeProvider>
        <div className="flex h-full">
          {/* Sidebar toggle button */}
          <button 
            className="fixed top-4 right-4 z-20 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
            onClick={() => setSidebarVisible(!sidebarVisible)}
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
            <AgentPipeline
              {...(props as any)}
              initialPrompt={prompt}
              context={context}
            />
          </div>
          
          {/* Knowledge sidebar */}
          <div 
            className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l shadow-lg overflow-y-auto z-10 transition-transform transform ${
              sidebarVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Knowledge for Agent Pipeline</h2>
              <p className="text-sm text-gray-500 mt-1">Select content for agent analysis</p>
            </div>
            
            <div className="p-3">
              <KnowledgePicker
                onSelect={setSelectedKnowledge}
                className="mb-4"
              />
            </div>
            
            {selectedKnowledge && (
              <div className="px-3 pb-3">
                <KnowledgeViewer item={selectedKnowledge} />
                
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Prompt (optional)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={`Analyze the following content: ${selectedKnowledge.title}`}
                      className="w-full h-20 p-2 border rounded text-sm"
                    />
                  </div>
                  
                  <button
                    className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600"
                    onClick={() => {
                      // Reselect to trigger rerender of pipeline
                      const temp = selectedKnowledge;
                      setSelectedKnowledge(null);
                      setTimeout(() => setSelectedKnowledge(temp), 10);
                    }}
                  >
                    Use in Agent Pipeline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </KnowledgeProvider>
    )
  }
}

/**
 * Example usage demonstrating how to use the pipeline adapters
 */
export function PipelineAdapterDemo() {
  // Mock stand-alone pipeline components
  const MockDocumentPipeline = ({ initialDocument }: DocumentPipelineProps) => (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Document Processing Pipeline</h2>
      {initialDocument ? (
        <div>
          <h3 className="font-medium">Processing Document:</h3>
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <div><strong>Title:</strong> {initialDocument.title}</div>
            <div className="mt-1"><strong>ID:</strong> {initialDocument.id}</div>
            <div className="mt-1"><strong>Content:</strong> 
              <div className="max-h-40 overflow-y-auto mt-1 p-2 bg-white rounded border">
                {initialDocument.content.substring(0, 200)}
                {initialDocument.content.length > 200 && '...'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          No document selected. Use the knowledge sidebar to select a document.
        </div>
      )}
    </div>
  )
  
  // Create enhanced components
  const EnhancedDocumentPipeline = withKnowledgeForDocumentPipeline(MockDocumentPipeline)
  
  // Return the enhanced component
  return <EnhancedDocumentPipeline />
}