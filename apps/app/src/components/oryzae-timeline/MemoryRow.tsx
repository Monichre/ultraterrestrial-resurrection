'use client'

import {useState} from 'react'
import {FloatCard} from './FloatCard'
import {HoverLabel} from './HoverLabel'
import {ORYZAE_COLORS, type MemoryNode} from './types'

export interface MemoryRowProps {
  memory: MemoryNode
  index: number
  total: number
}

export function MemoryRow({memory, index, total}: MemoryRowProps) {
  const [hovered, setHovered] = useState(false)
  const isLeft = memory.side === 'left'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: index < total - 1 ? 128 : 0,
        opacity: memory.dimmed && !hovered ? 0.6 : 1,
        transition: 'opacity 0.3s',
      }}>
      <div
        style={{
          width: '50%',
          paddingRight: 48,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        {isLeft ? (
          <FloatCard spec={memory.card} hovered={hovered} />
        ) : memory.dayLabel ? (
          <HoverLabel label={memory.dayLabel} />
        ) : null}
      </div>

      <div style={{position: 'relative', zIndex: 10, flexShrink: 0}}>
        <div
          style={{
            width: 7,
            height: 7,
            background: ORYZAE_COLORS.accent,
            borderRadius: '50%',
            border: `2px solid ${ORYZAE_COLORS.void}`,
            boxShadow: '0 0 0 1px rgba(74,158,142,0.2)',
          }}
        />
      </div>

      <div style={{width: '50%', paddingLeft: 48}}>
        {!isLeft ? (
          <FloatCard spec={memory.card} hovered={hovered} />
        ) : memory.date ? (
          <HoverLabel label={memory.date} />
        ) : null}
      </div>
    </div>
  )
}

MemoryRow.displayName = 'MemoryRow'
