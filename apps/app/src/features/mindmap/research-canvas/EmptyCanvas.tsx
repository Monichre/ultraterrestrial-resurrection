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
  const hasError = agentStatus === 'error'

  return (
    <div className="text-white flex flex-col justify-between items-center h-full w-full pt-10 overflow-y-auto">
      {/* Hero section */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4">
        {isLoading ? (
          <div className="text-center max-w-2xl">
            <div className="inline-block animate-pulse mb-4">
              <div className="text-lg text-zinc-300 font-mono tracking-widest uppercase">
                Researching...
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              Analyzing your query and searching sources
            </p>
          </div>
        ) : hasError ? (
          <div className="text-center max-w-2xl">
            <div className="text-lg text-red-400 mb-4 font-mono tracking-widest uppercase">
              Research Interrupted
            </div>
            <p className="text-sm text-zinc-500">
              Something went wrong. Try a different query.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-2xl space-y-4">
            <h1 className="text-4xl font-light tracking-tight text-white">
              Research Canvas
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Begin an investigation below. Select a topic card to start a guided tour,
              or type your own research question.
            </p>
            <p className="text-xs text-zinc-600 font-mono">
              Try: &ldquo;show timeline&rdquo; or &ldquo;research progress&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Console — topic cards + input */}
      <div className="w-full max-w-4xl pb-10 px-4">
        <ResearchCanvasConsole
          onSubmit={onSubmit ?? (() => {})}
          agentStatus={agentStatus}
          agentAnalysis={agentAnalysis}
          agentToolEvents={agentToolEvents}
        />
      </div>
    </div>
  )
}
