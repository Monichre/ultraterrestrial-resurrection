'use client'

import {Check, ChevronRight} from 'lucide-react'
import type {LinkedRecord} from '@/components/document-panel/lib/document-panel-data'

type LinkedRecordCardProps = {
  record: LinkedRecord
  selected: boolean
  onSelect: (id: string) => void
}

export function LinkedRecordCard({record, selected, onSelect}: LinkedRecordCardProps) {
  return (
    <button
      type='button'
      className='dp-record'
      data-selected={selected}
      aria-pressed={selected}
      onClick={() => onSelect(record.id)}
    >
      <span className='dp-record-icon' aria-hidden='true'>
        {record.icon}
      </span>

      <span style={{minWidth: 0, flex: '1 1 auto'}}>
        <span className='dp-record-title' style={{display: 'block'}}>
          {record.title}
        </span>
        <span className='dp-record-meta' style={{display: 'block'}}>
          {record.type} &middot; {record.date}
        </span>
      </span>

      {selected ? (
        <Check className='dp-record-check' width={13} height={13} strokeWidth={2.2} aria-hidden />
      ) : null}

      <ChevronRight
        width={13}
        height={13}
        strokeWidth={1.8}
        aria-hidden
        style={{color: 'var(--record-ink-muted)', flex: '0 0 auto'}}
      />
    </button>
  )
}
