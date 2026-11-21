'use client'

import {cn} from '@/utils/cn'
import {Check, Circle, Loader2} from 'lucide-react'
import {useState} from 'react'
import type {OracleTask, TaskStatus} from './types'

export interface OracleTaskItemProps {
  item: OracleTask
  status: TaskStatus
}

export function OracleTaskItem({item, status}: OracleTaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='flex justify-between gap-2 rounded-lg px-0.5 text-sm font-medium' key={item.id}>
      <div className='flex flex-1 gap-2 overflow-hidden'>
        <div
          className={cn(
            'flex size-fit items-center justify-center rounded p-0.5',
            status === 'done' && 'bg-blue-100 text-blue-500',
            status === 'in_progress' && 'bg-green-100 text-green-500',
            status === 'pending' && 'bg-neutral-100 text-neutral-400'
          )}>
          {status === 'done' && <Check className='size-3.5 text-blue-500' />}
          {status === 'in_progress' && <Loader2 className='size-3.5 animate-spin text-green-500' />}
          {status === 'pending' && <Circle className='size-3.5 text-neutral-400' />}
        </div>
        <p
          id='scrollable'
          className={cn(
            'w-full cursor-default text-neutral-500',
            isExpanded
              ? 'scrollbar-hide max-h-none overflow-y-auto whitespace-normal'
              : 'line-clamp-2 overflow-hidden'
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          onBlur={() => setIsExpanded(false)}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setIsExpanded((prev) => !prev)
            }
          }}>
          {item.task}
        </p>
      </div>
      <p
        className={cn(
          'flex h-5 w-10 select-none items-center justify-center rounded font-mono text-xs',
          status === 'done' && 'bg-blue-100 text-blue-500',
          status === 'in_progress' && 'bg-green-100 text-green-500',
          status === 'pending' && 'bg-neutral-100 text-neutral-400'
        )}>
        {item.percentage || '-'}
      </p>
    </div>
  )
}

OracleTaskItem.displayName = 'OracleTaskItem'
