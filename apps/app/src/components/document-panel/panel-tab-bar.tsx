'use client'

import * as React from 'react'
import {X} from 'lucide-react'
import type {PanelTab} from '@/components/document-panel/lib/document-panel-data'

type PanelTabBarProps = {
  tabs: PanelTab[]
  activeTabId: string
  onSelect: (id: string) => void
  onClose: () => void
}

export function PanelTabBar({tabs, activeTabId, onSelect, onClose}: PanelTabBarProps) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return

    event.preventDefault()
    onSelect(tabs[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className='dp-tabbar'>
      <div
        role='tablist'
        aria-label='Document panel views'
        style={{display: 'flex', gap: '2px'}}
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node
              }}
              type='button'
              role='tab'
              id={`dp-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`dp-tabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className='dp-tab'
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <button
        type='button'
        className='dp-iconbtn dp-iconbtn--ghost dp-iconbtn--dim dp-tabclose'
        aria-label='Close document panel'
        onClick={onClose}
      >
        <X width={14} height={14} strokeWidth={1.8} aria-hidden />
      </button>
    </div>
  )
}
