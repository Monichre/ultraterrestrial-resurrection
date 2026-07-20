'use client'

import {useMemo, useState} from 'react'
import {toast} from 'sonner'
import {CircularProgressBar} from './CircularProgressBar'
import {OraclePanel} from './OraclePanel'
import {SAMPLE_PANEL_DATA, cloneTasks} from './fixtures'
import type {ConfirmRunPayload, DuplicateRunPayload, OraclePanelData, TaskStatus} from './types'

export interface OraclePanelDemoProps {
  /** Start with a partially complete recipe (default) or all pending. */
  scenario?: 'in-progress' | 'fresh' | 'complete'
}

function buildScenario(scenario: OraclePanelDemoProps['scenario']): OraclePanelData {
  const base = {
    ...SAMPLE_PANEL_DATA,
    oracleChain: {
      ...SAMPLE_PANEL_DATA.oracleChain,
      workflow_list: cloneTasks(SAMPLE_PANEL_DATA.oracleChain.workflow_list),
    },
    taskStatusMap: {...SAMPLE_PANEL_DATA.taskStatusMap},
  }

  if (scenario === 'fresh') {
    return {
      ...base,
      taskStatusMap: Object.fromEntries(
        base.oracleChain.workflow_list.map((task) => [task.id, 'pending' as TaskStatus])
      ),
      oracleChain: {
        ...base.oracleChain,
        workflow_list: base.oracleChain.workflow_list.map((task) => ({
          ...task,
          executed: false,
          percentage: undefined,
          response: [],
        })),
      },
    }
  }

  if (scenario === 'complete') {
    return {
      ...base,
      taskStatusMap: Object.fromEntries(
        base.oracleChain.workflow_list.map((task) => [task.id, 'done' as TaskStatus])
      ),
      oracleChain: {
        ...base.oracleChain,
        workflow_list: base.oracleChain.workflow_list.map((task) => ({
          ...task,
          executed: true,
          percentage: '100%',
        })),
      },
    }
  }

  return base
}

export function OraclePanelDemo({scenario = 'in-progress'}: OraclePanelDemoProps) {
  const initial = useMemo(() => buildScenario(scenario), [scenario])
  const [data, setData] = useState(initial)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastEvent, setLastEvent] = useState<string>('Ready')
  const [eventLog, setEventLog] = useState<string[]>([])

  const progress = useMemo(() => {
    const statuses = Object.values(data.taskStatusMap)
    if (statuses.length === 0) return 0
    const done = statuses.filter((status) => status === 'done').length
    const inProgress = statuses.filter((status) => status === 'in_progress').length
    return (done + inProgress * 0.5) / statuses.length
  }, [data.taskStatusMap])

  function pushLog(message: string) {
    setLastEvent(message)
    setEventLog((prev) => [message, ...prev].slice(0, 6))
  }

  async function handleConfirmRun(payload: ConfirmRunPayload) {
    setIsGenerating(true)
    pushLog(
      `Confirm & Run · ${payload.workflow_list.length} tasks · replan=${!payload.no_need_replan}`
    )
    toast.success('Recipe confirmed — running oracle stream')

    await new Promise((resolve) => setTimeout(resolve, 900))

    setData((prev) => ({
      oracleChain: {
        ...prev.oracleChain,
        id: payload.streamId,
        requirement: payload.requirement,
        workflow_list: payload.workflow_list,
      },
      taskStatusMap: Object.fromEntries(
        payload.workflow_list.map((task, index) => [
          task.id,
          index === 0 ? ('in_progress' as TaskStatus) : ('pending' as TaskStatus),
        ])
      ),
    }))
    setIsGenerating(false)
    pushLog('Stream started')
  }

  async function handleDuplicateRun(payload: DuplicateRunPayload) {
    setIsGenerating(true)
    pushLog(`Duplicate & Re-run · "${payload.requirement.slice(0, 48)}…"`)
    toast.success('Duplicated recipe — new stream created')

    await new Promise((resolve) => setTimeout(resolve, 900))

    setData({
      oracleChain: {
        id: payload.streamId,
        requirement: payload.requirement,
        workflow_list: payload.workflow_list,
      },
      taskStatusMap: Object.fromEntries(
        payload.workflow_list.map((task, index) => [
          task.id,
          index === 0 ? ('in_progress' as TaskStatus) : ('pending' as TaskStatus),
        ])
      ),
    })
    setIsGenerating(false)
    pushLog(`New stream ${payload.streamId.slice(0, 8)}…`)
  }

  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-4'>
      <header className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400'>
            Component demo
          </p>
          <h2 className='text-lg font-semibold tracking-tight text-neutral-800'>Oracle Panel</h2>
          <p className='mt-1 text-xs leading-relaxed text-neutral-500'>
            Interactive recipe editor — scroll, edit, duplicate, confirm.
          </p>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <CircularProgressBar value={progress * 100} className='stroke-neutral-700' />
          <span className='font-mono text-[10px] text-neutral-400'>
            {Math.round(progress * 100)}%
          </span>
        </div>
      </header>

      <div className='rounded-[1.5rem] bg-neutral-100/80 p-3 ring-1 ring-neutral-200'>
        <OraclePanel
          data={data}
          isGenerating={isGenerating}
          progress={progress}
          onConfirmRun={handleConfirmRun}
          onDuplicateRun={handleDuplicateRun}
          onShare={(streamId) => {
            pushLog(`Share requested · ${streamId}`)
            toast.message('Share to Community', {description: streamId})
          }}
          onScrollTasks={(direction) =>
            pushLog(`Scroll ${direction === 'ArrowUp' ? 'up' : 'down'}`)
          }
        />
      </div>

      <aside className='rounded-xl border border-neutral-200 bg-white p-3'>
        <p className='font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400'>
          Event log
        </p>
        <p className='mt-1 text-sm font-medium text-neutral-700'>{lastEvent}</p>
        <ul className='mt-2 space-y-1 font-mono text-[11px] text-neutral-400'>
          {eventLog.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

OraclePanelDemo.displayName = 'OraclePanelDemo'
