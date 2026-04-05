"use client"

import React from "react"

import ResearchCanvasConsole from "./research-canvas-console"
import type { AgentToolEvent } from '@/features/mindmap/hooks/use-mindmap-agent'

interface EmptyCanvasProps {
  onSubmit?: (input: string) => void
  agentStatus?: 'idle' | 'streaming' | 'complete' | 'error'
  agentAnalysis?: string
  agentToolEvents?: AgentToolEvent[]
}

export function EmptyCanvas({
  onSubmit,
  agentStatus = 'idle',
  agentAnalysis,
  agentToolEvents,
}: EmptyCanvasProps) {
  const isLoading = agentStatus === 'streaming'
  const isComplete = agentStatus === 'complete'
  const hasError = agentStatus === 'error'

  return (
    <div className="text-white flex flex-col justify-between items-center h-full w-full pt-6 overflow-y-auto">
      {/* Main content area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4">
        {isLoading ? (
          <div className="text-center max-w-2xl">
            <div className="inline-block animate-pulse mb-4">
              <div className="text-lg text-zinc-300">Researching...</div>
            </div>
            <p className="text-sm text-zinc-500">
              Analyzing your query and searching sources
            </p>
          </div>
        ) : isComplete ? (
          <div className="text-center max-w-2xl">
            <div className="text-lg text-zinc-300 mb-4">Research Complete</div>
            {agentAnalysis && (
              <p className="text-sm text-zinc-500 mb-4">{agentAnalysis.slice(0, 200)}...</p>
            )}
          </div>
        ) : hasError ? (
          <div className="text-center max-w-2xl">
            <div className="text-lg text-red-400 mb-4">Research Interrupted</div>
            <p className="text-sm text-zinc-500">
              Something went wrong. Try a different query.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-2xl">
            <h1 className="text-2xl font-light text-zinc-300 mb-2">Research Canvas</h1>
            <p className="text-sm text-zinc-500">
              Start with a research question below. Once the canvas is active, use Start Tour,
              Search Database, or Add Node to expand the investigation.
            </p>
          </div>
        )}
      </div>

      {/* Console at the bottom */}
      <div className="w-full max-w-4xl pb-10 px-4">
        <ResearchCanvasConsole
          onSubmit={onSubmit}
          agentStatus={agentStatus}
          agentAnalysis={agentAnalysis}
          agentToolEvents={agentToolEvents}
        />
      </div>
    </div>
  )
}
