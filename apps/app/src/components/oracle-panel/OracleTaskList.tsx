'use client'

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {forwardRef, memo, useMemo} from 'react'
import {EditableTaskRow} from './EditableTaskRow'
import {OracleTaskItem} from './OracleTaskItem'
import type {EditorStatus, OraclePanelData, OracleTask} from './types'

export interface OracleTaskListProps {
  oraclePanelData: OraclePanelData
  editorStatus: EditorStatus
  editingList: OracleTask[]
  checkedTaskIds: string[]
  setCheckedTaskIds: (ids: string[]) => void
  setEditingList: (list: OracleTask[]) => void
  clearRecipe?: () => void
}

export const OracleTaskList = memo(
  forwardRef<HTMLDivElement, OracleTaskListProps>(function OracleTaskList(
    {oraclePanelData, editorStatus, editingList, checkedTaskIds, setCheckedTaskIds, setEditingList},
    ref
  ) {
    const viewItems = useMemo(() => {
      if (editorStatus === 'duplicate') return null
      const {oracleChain, taskStatusMap} = oraclePanelData
      if (!oracleChain || !taskStatusMap) return null

      return oracleChain.workflow_list.map((item) => {
        const status = taskStatusMap[item.id]
        if (editorStatus && status === 'pending') return null
        return <OracleTaskItem key={item.id} item={item} status={status ?? 'pending'} />
      })
    }, [editorStatus, oraclePanelData])

    function editTask(id: string, task: string) {
      setEditingList(editingList.map((item) => (item.id === id ? {...item, task} : item)))
    }

    const sensors = useSensors(
      useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
      useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )

    function handleDragEnd(event: DragEndEvent) {
      const {active, over} = event
      if (!over || active.id === over.id) return

      const oldIndex = editingList.findIndex((item) => item.id === active.id)
      const newIndex = editingList.findIndex((item) => item.id === over.id)
      const reordered = arrayMove(editingList, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index + 1,
      }))
      setEditingList(reordered)
    }

    if (editorStatus) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
          autoScroll>
          <div
            ref={ref}
            className='scrollbar-hide flex h-48 max-h-48 flex-col items-stretch gap-2 overflow-y-auto rounded-[1.25rem] bg-white p-3 py-4 shadow outline-none'>
            <SortableContext
              items={editingList.map((item) => item.id)}
              strategy={verticalListSortingStrategy}>
              {editingList.map((item) => (
                <EditableTaskRow
                  key={item.id}
                  item={item}
                  editorStatus={editorStatus}
                  checkedTaskIds={checkedTaskIds}
                  editTask={editTask}
                  setCheckedTaskIds={setCheckedTaskIds}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )
    }

    return (
      <div
        ref={ref}
        className='scrollbar-hide flex h-48 flex-col items-stretch gap-2 overflow-y-auto scroll-smooth rounded-[1.25rem] bg-white p-3 py-4 shadow outline-none'>
        {viewItems}
      </div>
    )
  })
)

OracleTaskList.displayName = 'OracleTaskList'
