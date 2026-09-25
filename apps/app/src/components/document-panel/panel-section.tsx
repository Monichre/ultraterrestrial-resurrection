'use client'

import * as React from 'react'
import {ChevronDown} from 'lucide-react'
import {CalloutBadge} from '@/components/document-panel/callout-badge'

type PanelSectionProps = {
  id: string
  label: string
  calloutNumber: number
  open: boolean
  onToggle: () => void
  action?: React.ReactNode
  children: React.ReactNode
}

export function PanelSection({
  id,
  label,
  calloutNumber,
  open,
  onToggle,
  action,
  children,
}: PanelSectionProps) {
  return (
    <section className='dp-section' aria-labelledby={`${id}-label`}>
      <CalloutBadge number={calloutNumber} top={-2} />
      <div className='dp-section-head'>
        <button
          type='button'
          className='dp-section-toggle'
          aria-expanded={open}
          aria-controls={`${id}-region`}
          onClick={onToggle}
          id={`${id}-label`}
        >
          <ChevronDown width={12} height={12} strokeWidth={2} aria-hidden />
          {label}
        </button>
        <span className='dp-section-rule' aria-hidden='true' />
        {action}
      </div>

      <div className='dp-collapse' data-open={open} id={`${id}-region`} role='group'>
        <div>{children}</div>
      </div>
    </section>
  )
}
