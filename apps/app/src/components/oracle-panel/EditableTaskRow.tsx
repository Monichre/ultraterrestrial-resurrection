'use client'

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {cn} from '@/utils/cn'
import {Check, GripVertical} from 'lucide-react'
import {useState} from 'react'
import type {EditorStatus, OracleTask} from './types'

export interface EditableTaskRowProps {
  item: OracleTask
  editorStatus: EditorStatus
  checkedTaskIds: string[]
  editTask: (id: string, task: string) => void
  setCheckedTaskIds: (ids: string[]) => void
}

export function EditableTaskRow({
  item,
  checkedTaskIds,
  editTask,
  setCheckedTaskIds,
}: EditableTaskRowProps) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: item.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const [isFocused, setIsFocused] = useState(false)
  const isChecked = checkedTaskIds.includes(item.id)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center justify-between rounded-xl bg-neutral-100 p-0.5 text-sm font-medium'>
      <div className='flex h-full flex-1 items-center'>
        <div
          {...attributes}
          {...listeners}
          className='drag-handle my-1 ml-1 inline-flex aspect-square size-6 cursor-grab items-center justify-center rounded-full bg-neutral-200 text-neutral-500 active:cursor-grabbing'
          aria-label='Drag to reorder'>
          <GripVertical className='size-3 stroke-[2.5px]' />
        </div>
        <textarea
          className={cn(
            'h-full flex-1 resize-none bg-neutral-100 px-1.5 py-[0.2rem] font-sans text-xs text-neutral-500',
            isFocused ? 'scrollbar-hide focus:font-semibold' : 'line-clamp-2 overflow-hidden',
            isChecked && 'line-through opacity-80'
          )}
          value={item.task}
          rows={isFocused ? 3 : 2}
          onMouseMove={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => editTask(item.id, event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={() => setIsFocused(true)}
          readOnly={!isFocused}
        />
      </div>
      <button
        type='button'
        onClick={() => {
          const next = isChecked
            ? checkedTaskIds.filter((id) => id !== item.id)
            : [...checkedTaskIds, item.id]
          setCheckedTaskIds(next)
        }}
        className={cn(
          'mr-1 flex aspect-square size-6 items-center justify-center overflow-hidden rounded-full p-0.5',
          isChecked ? 'bg-neutral-400 text-white' : 'border bg-white text-neutral-400'
        )}
        aria-label={isChecked ? 'Keep task' : 'Mark task for removal'}
        aria-pressed={isChecked}>
        <Check className='size-3 rounded-full stroke-[2.5px]' />
      </button>
    </div>
  )
}

EditableTaskRow.displayName = 'EditableTaskRow'
