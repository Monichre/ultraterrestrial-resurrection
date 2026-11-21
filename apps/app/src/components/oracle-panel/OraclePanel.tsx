'use client'

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {cn} from '@/utils/cn'
import {AnimatePresence, motion} from 'framer-motion'
import {ArrowDown, ArrowUp, Copy, ExternalLink, Plus} from 'lucide-react'
import {useMemo, useRef, useState} from 'react'
import {toast} from 'sonner'
import {OracleTaskList} from './OracleTaskList'
import type {
  ConfirmRunPayload,
  DuplicateRunPayload,
  EditorStatus,
  OraclePanelData,
  OracleTask,
} from './types'

const COPY = {
  yourGoal: 'Goal:',
  goalPlaceholder: 'Write your goal here...',
  recipeLabel: 'Oracle Recipe',
  shareToCommunity: 'Share to Community',
  cancel: 'Cancel',
  duplicateAndReRun: 'Duplicate & Re-run',
  confirmAndRun: 'Confirm & Run',
  generating: 'Generating...',
} as const

export interface OraclePanelProps {
  data: OraclePanelData
  isGenerating?: boolean
  progress?: number
  className?: string
  onConfirmRun?: (payload: ConfirmRunPayload) => void | Promise<void>
  onDuplicateRun?: (payload: DuplicateRunPayload) => void | Promise<void>
  onShare?: (streamId: string) => void
  onScrollTasks?: (direction: 'ArrowUp' | 'ArrowDown') => void
}

export function OraclePanel({
  data,
  isGenerating = false,
  progress = 0,
  className,
  onConfirmRun,
  onDuplicateRun,
  onShare,
  onScrollTasks,
}: OraclePanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const chain = data.oracleChain

  const [editorStatus, setEditorStatus] = useState<EditorStatus>(null)
  const [editingList, setEditingList] = useState<OracleTask[]>([])
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([])
  const [goalDraft, setGoalDraft] = useState(chain.requirement)

  const progressScale = Math.min(1, Math.max(0, progress))

  const primaryLabel = useMemo(() => {
    if (editorStatus === 'duplicate') {
      return COPY.duplicateAndReRun
    }
    if (isGenerating) return COPY.generating
    return COPY.confirmAndRun
  }, [editorStatus, isGenerating])

  function enterEditMode(mode: 'normal' | 'duplicate') {
    setEditingList(chain.workflow_list.map((task) => ({...task, response: [...task.response]})))
    setCheckedTaskIds([])
    setGoalDraft(chain.requirement)
    setEditorStatus(mode)
  }

  function exitEditMode() {
    setEditorStatus(null)
    setEditingList([])
    setCheckedTaskIds([])
  }

  function scrollTasks(direction: 'ArrowUp' | 'ArrowDown') {
    const node = listRef.current
    if (node) {
      node.scrollBy({top: direction === 'ArrowUp' ? -80 : 80, behavior: 'smooth'})
    }
    onScrollTasks?.(direction)
  }

  function insertStep() {
    const maxOrder = Math.max(...editingList.map(({order}) => order), 1)
    setEditingList([
      ...editingList,
      {
        id: crypto.randomUUID(),
        order: maxOrder + 1,
        task: '',
        executed: false,
        response: [],
      },
    ])
  }

  async function handleConfirm(mode: 'normal' | 'duplicate') {
    if (mode === 'normal') {
      await confirmAndRun()
      return
    }
    await duplicateAndReRun()
  }

  async function confirmAndRun() {
    // Editing list is the working recipe; checked rows are marked for removal.
    const finalList = editingList
      .filter(({id}) => !checkedTaskIds.includes(id))
      .map((task, index) => ({...task, order: index + 1}))

    if (finalList.length < 1) {
      toast.error('Please keep at least 1 task in this recipe.')
      return
    }

    const noNeedReplan =
      chain.workflow_list.length !== finalList.length ||
      chain.workflow_list.some((task, index) => task.task !== finalList[index]?.task)

    const payload: ConfirmRunPayload = {
      streamId: chain.id,
      requirement: chain.requirement,
      workflow_list: finalList,
      no_need_replan: noNeedReplan,
      user_confirm: true,
    }

    await onConfirmRun?.(payload)
    exitEditMode()
  }

  async function duplicateAndReRun() {
    const workflowList = editingList
      .filter(({id}) => !checkedTaskIds.includes(id))
      .map((task, index) => ({
        ...task,
        order: index + 1,
        executed: false,
        response: [] as string[],
        percentage: undefined,
      }))

    if (workflowList.length < 1) {
      toast.error('Please keep at least 1 task in this recipe.')
      return
    }
    if (goalDraft.trim().length === 0) {
      toast.error('Please input your goal.')
      return
    }

    const streamId = crypto.randomUUID()
    const payload: DuplicateRunPayload = {
      streamId,
      requirement: goalDraft,
      workflow_list: workflowList,
      no_need_replan: true,
      user_confirm: true,
    }

    await onDuplicateRun?.(payload)
    exitEditMode()
  }

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        className={cn('relative mb-1.5 space-y-1.5', className)}
        initial={{height: 0, opacity: 0, overflowY: 'hidden'}}
        animate={{
          height: 'auto',
          opacity: 1,
          overflow: 'visible',
          transition: {
            height: {type: 'spring', stiffness: 300, damping: 30},
            opacity: {duration: 0.4},
          },
        }}
        exit={{
          height: 0,
          opacity: 0,
          overflowY: 'hidden',
          transition: {
            height: {type: 'spring', stiffness: 300, damping: 30, duration: 0.1},
            opacity: {duration: 0.2},
          },
        }}>
        <p className='flex flex-col rounded-[1.25rem] bg-neutral-200/50 p-3 px-4 text-sm font-medium ring-1 ring-neutral-200'>
          <span className='font-mono text-[0.65rem] font-medium leading-3 text-neutral-400'>
            {COPY.yourGoal}
          </span>
          {editorStatus === 'duplicate' ? (
            <input
              type='text'
              autoFocus
              className='border-b border-neutral-300 bg-transparent text-neutral-500 outline-none'
              defaultValue={goalDraft}
              placeholder={COPY.goalPlaceholder}
              onChange={(event) => setGoalDraft(event.target.value)}
            />
          ) : (
            <span className='scrollbar-hide line-clamp-5 overflow-y-auto border-b border-transparent text-neutral-500'>
              {chain.requirement}
            </span>
          )}
        </p>

        <OracleTaskList
          ref={listRef}
          oraclePanelData={data}
          editorStatus={editorStatus}
          editingList={editingList}
          setEditingList={setEditingList}
          checkedTaskIds={checkedTaskIds}
          setCheckedTaskIds={setCheckedTaskIds}
        />

        <p className='flex select-none justify-between px-1.5 font-mono text-[0.65rem] text-neutral-400 dark:text-neutral-800'>
          <span>{COPY.recipeLabel}</span>
          {chain.id && (
            <button
              type='button'
              className='inline-flex items-center gap-0.5 hover:text-neutral-600'
              onClick={() => onShare?.(chain.id)}>
              {COPY.shareToCommunity}
              <ExternalLink className='inline size-3.5' />
            </button>
          )}
        </p>

        <div className='relative w-full overflow-hidden rounded-[1.25rem] border p-1.5 text-neutral-400'>
          <motion.div
            className='absolute left-0 top-0 -z-10 size-full origin-left rounded-[1.25rem] bg-neutral-200'
            style={{scaleX: progressScale}}
          />

          <AnimatePresence mode='popLayout'>
            {editorStatus ? (
              <motion.div
                key='edit-buttons'
                className='flex w-full items-center justify-between rounded-[1.25rem] text-neutral-400'
                initial={{scale: 0, x: 400}}
                animate={{scale: 1, x: 0}}
                exit={{scale: 0, x: -400}}
                transition={{duration: 0.4}}>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        onClick={insertStep}
                        className='inline-flex items-center justify-center rounded-full border bg-neutral-50 p-1.5 hover:bg-white'
                        aria-label='Insert new step'>
                        <Plus className='inline size-3 stroke-[2.5px]' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Insert new step</TooltipContent>
                  </Tooltip>
                </div>
                <div className='flex items-center gap-1'>
                  <button
                    type='button'
                    onClick={exitEditMode}
                    className='inline-flex items-center justify-center rounded-xl border bg-neutral-50 p-1 px-2 text-[0.65rem] font-medium hover:bg-white'>
                    {COPY.cancel}
                  </button>
                  <button
                    type='button'
                    disabled={isGenerating}
                    onClick={() => handleConfirm(editorStatus)}
                    className='inline-flex items-center justify-center rounded-xl border bg-neutral-700 p-1 px-2 text-[0.65rem] font-medium text-neutral-200 hover:bg-black disabled:bg-neutral-600'>
                    {primaryLabel}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='default-buttons'
                className='flex w-full items-center justify-between rounded-[1.25rem] text-neutral-400'
                initial={{scale: 0, x: 400}}
                animate={{scale: 1, x: 0}}
                exit={{scale: 0, x: -400}}
                transition={{duration: 0.4}}>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        onClick={() => scrollTasks('ArrowUp')}
                        className='inline-flex items-center justify-center rounded-xl border bg-neutral-50 p-1.5 hover:bg-white'
                        aria-label='Scroll up'>
                        <ArrowUp className='inline size-3 stroke-[2.5px]' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Scroll up</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        onClick={() => scrollTasks('ArrowDown')}
                        className='inline-flex items-center justify-center rounded-xl border bg-neutral-50 p-1.5 hover:bg-white'
                        aria-label='Scroll down'>
                        <ArrowDown className='inline size-3 stroke-[2.5px]' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Scroll down</TooltipContent>
                  </Tooltip>
                  <span className='mr-3 text-xs font-medium'>Scroll</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        className='inline-flex items-center justify-center rounded-xl border bg-neutral-50 p-1.5 enabled:hover:bg-white disabled:bg-neutral-300'
                        onClick={() => enterEditMode('duplicate')}
                        aria-label='Duplicate and re-run this recipe'>
                        <Copy className='size-3 stroke-[2.5px]' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Duplicate and re-run this recipe</TooltipContent>
                  </Tooltip>
                  <button
                    type='button'
                    className='mr-3 text-xs font-medium hover:text-neutral-600'
                    onClick={() => enterEditMode('normal')}>
                    Re-run
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

OraclePanel.displayName = 'OraclePanel'
