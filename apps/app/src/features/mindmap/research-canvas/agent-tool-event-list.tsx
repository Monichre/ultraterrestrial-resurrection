'use client'

import {useMemo, useState} from 'react'

import type {AgentToolEvent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {ToolCard} from './tool-card'
import {collapseToolEvents} from './tool-event-summary'

export type AgentToolEventListProps = {
  events: AgentToolEvent[]
  className?: string
  /** Cap the visible stack; the list scrolls inside. Defaults to 168px. */
  maxHeight?: number
}

/**
 * Chronological stack of ToolCards for one agent run. Cards persist after the
 * stream completes so the researcher can audit what the agent actually did.
 */
export const AgentToolEventList = ({events, className = '', maxHeight = 168}: AgentToolEventListProps) => {
  const cards = useMemo(() => collapseToolEvents(events), [events])
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  if (!cards.length) return null

  const toggle = (key: string) => setExpandedKey((current) => (current === key ? null : key))

  return (
    <ol
      className={`ut-tool-list ${className}`.trim()}
      style={{maxHeight}}
      aria-label='Agent tool calls'
    >
      {cards.map((card) => (
        <li key={card.key}>
          <ToolCard card={card} expanded={expandedKey === card.key} onToggle={toggle} />
        </li>
      ))}
    </ol>
  )
}
