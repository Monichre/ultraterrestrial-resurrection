'use client'

import {useId} from 'react'
import {ChevronRight} from 'lucide-react'

import type {ToolCardModel} from './tool-event-summary'

export type ToolCardProps = {
  card: ToolCardModel
  expanded: boolean
  onToggle: (key: string) => void
}

const STATUS_COPY: Record<ToolCardModel['status'], string> = {
  processing: 'Running',
  complete: 'Complete',
  error: 'Failed',
}

/**
 * One agent tool call rendered as an inspectable archival card. Collapsed row
 * = tool label + quiet status + outcome; expanded = query, parameters, error.
 * Solid hairline (a tool call is a sourced fact about what ran), never a KPI
 * tile. Status shown with mono labels, not colour alone.
 */
export const ToolCard = ({card, expanded, onToggle}: ToolCardProps) => {
  const detailsId = useId()
  const hasDetails = Boolean(card.query || card.params.length || card.error)

  return (
    <article
      className='ut-tool-card'
      data-status={card.status}
      data-expanded={expanded ? 'true' : 'false'}
    >
      <button
        type='button'
        className='ut-tool-card__row'
        aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? detailsId : undefined}
        onClick={() => hasDetails && onToggle(card.key)}
        disabled={!hasDetails}
      >
        <span className='ut-tool-card__status ut-mono' aria-label={`Status: ${STATUS_COPY[card.status]}`}>
          <span className='ut-tool-card__dot' aria-hidden />
          {STATUS_COPY[card.status]}
        </span>
        <span className='ut-tool-card__label'>{card.label}</span>
        <span className='ut-tool-card__summary'>
          {card.status === 'processing' ? (
            <span className='ut-redaction ut-tool-card__redaction' aria-label='Working' />
          ) : (
            card.summary
          )}
        </span>
        {hasDetails && (
          <ChevronRight className='ut-tool-card__chevron' aria-hidden />
        )}
      </button>

      {hasDetails && expanded && (
        <dl id={detailsId} className='ut-tool-card__details'>
          {card.query && (
            <>
              <dt className='ut-mono'>Query</dt>
              <dd>{card.query}</dd>
            </>
          )}
          {card.params.map(([key, value]) => (
            <ToolParam key={key} name={key} value={value} />
          ))}
          {card.error && (
            <>
              <dt className='ut-mono ut-tool-card__error-term'>Error</dt>
              <dd className='ut-tool-card__error'>{card.error}</dd>
            </>
          )}
        </dl>
      )}
    </article>
  )
}

const ToolParam = ({name, value}: {name: string; value: string}) => (
  <>
    <dt className='ut-mono'>{name.replace(/_/g, ' ')}</dt>
    <dd>{value}</dd>
  </>
)
