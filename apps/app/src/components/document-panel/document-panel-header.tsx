'use client'

import {ChevronDown, MoreVertical, Plus} from 'lucide-react'

export type SaveState = 'idle' | 'saving' | 'saved'

type DocumentPanelHeaderProps = {
  title: string
  saveState: SaveState
  onToggleTitleMenu: () => void
  onAdd: () => void
  onOverflow: () => void
}

export function DocumentPanelHeader({
  title,
  saveState,
  onToggleTitleMenu,
  onAdd,
  onOverflow,
}: DocumentPanelHeaderProps) {
  return (
    <div className='dp-header'>
      <button
        type='button'
        className='dp-titlebtn'
        aria-haspopup='menu'
        aria-label={`${title} — document options`}
        onClick={onToggleTitleMenu}
      >
        <h2 className='dp-doc-title'>{title}</h2>
        <ChevronDown width={14} height={14} strokeWidth={1.9} aria-hidden />
      </button>

      {saveState !== 'idle' ? (
        <span className='dp-savestate' role='status' aria-live='polite'>
          {saveState === 'saving' ? 'Saving…' : 'Saved'}
        </span>
      ) : null}

      <div style={{marginLeft: 'auto', display: 'flex', gap: '6px'}}>
        <button type='button' className='dp-iconbtn' aria-label='Add to notebook' onClick={onAdd}>
          <Plus width={13} height={13} strokeWidth={2} aria-hidden />
        </button>
        <button
          type='button'
          className='dp-iconbtn'
          aria-label='More notebook actions'
          aria-haspopup='menu'
          onClick={onOverflow}
        >
          <MoreVertical width={13} height={13} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  )
}
