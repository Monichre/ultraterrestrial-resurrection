'use client'

import React from 'react'

import ResearchCanvasConsole from './research-canvas-console'
import type {AgentToolEvent} from '@/features/mindmap/hooks/use-mindmap-agent'

interface EmptyCanvasProps {
  onSubmit?: (input: string) => void
  onFileSelected?: (file: File) => void
  /** Forwarded to the console, which renders it directly above the input. */
  chips?: React.ReactNode
  agentStatus?: 'idle' | 'streaming' | 'complete' | 'error'
  agentAnalysis?: string
  agentToolEvents?: AgentToolEvent[]
}

export function EmptyCanvas({
  onSubmit,
  onFileSelected,
  chips,
  agentStatus = 'idle',
  agentAnalysis,
  agentToolEvents,
}: EmptyCanvasProps) {
  const isLoading = agentStatus === 'streaming'
  const hasError = agentStatus === 'error'

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto px-8 py-16 pl-28'>
      <div className='m-auto w-full max-w-xl'>
        {isLoading ? (
          <div className='mb-6 max-w-md'>
            <p className='ut-mono m-0 text-[11px] text-[var(--ut-stamp)]'>Researching...</p>
            <div className='mt-4 flex max-w-[16rem] flex-col gap-2' aria-hidden>
              <div className='ut-redaction w-full' />
              <div className='ut-redaction w-2/3' />
            </div>
            <p className='m-0 mt-4 text-sm leading-relaxed text-[var(--ut-paper)]'>
              Analyzing your query and searching sources
            </p>
          </div>
        ) : hasError ? (
          <div className='mb-6 max-w-md'>
            <p className='ut-mono m-0 text-[11px] text-[var(--ut-stamp)]'>Research Interrupted</p>
            <p className='m-0 mt-3 text-sm leading-relaxed text-[var(--ut-paper)]'>
              The investigation could not continue. Reframe the research question and try again.
            </p>
          </div>
        ) : (
          <div className='mb-6'>
            <p className='ut-mono m-0 text-[11px] text-[var(--ut-ink-dim)]'>UT · RC</p>
            <h1 className='m-0 mt-5 text-[1.75rem] font-normal leading-tight text-[var(--ut-paper)]'>
              Research Canvas
            </h1>
            <p className='m-0 mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--ut-ink-dim)]'>
              Assemble records to begin an investigation. Select a topic card to follow a guided
              trace, or enter your own research question.
            </p>
            <p className='m-0 mt-4 font-[family-name:var(--font-martian-mono),var(--font-jetbrains-mono),monospace] text-[12px] leading-relaxed text-[var(--ut-paper)]'>
              Try: &ldquo;show timeline&rdquo; or &ldquo;research progress&rdquo;
            </p>
          </div>
        )}

        <ResearchCanvasConsole
          onSubmit={onSubmit ?? (() => {})}
          onFileSelected={onFileSelected}
          chips={chips}
          agentStatus={agentStatus}
          agentAnalysis={agentAnalysis}
          agentToolEvents={agentToolEvents}
        />
      </div>
    </div>
  )
}
