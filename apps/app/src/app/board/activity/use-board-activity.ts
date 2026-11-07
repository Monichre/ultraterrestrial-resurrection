'use client'

import {useEffect, useState} from 'react'
import type {ActivitySnapshot} from './types'

export type ActivityState =
  | {status: 'loading'}
  | {status: 'unavailable'}
  | {status: 'error'; message: string; last?: ActivitySnapshot}
  | {status: 'ready'; snapshot: ActivitySnapshot}

/** Polls /api/board/activity; pauses while the tab is hidden. */
export function useBoardActivity(intervalMs = 20_000): ActivityState {
  const [state, setState] = useState<ActivityState>({status: 'loading'})

  useEffect(() => {
    let controller: AbortController | null = null
    let timer: ReturnType<typeof setInterval> | null = null
    let last: ActivitySnapshot | undefined

    async function load() {
      // Skip the tick if a request is still in flight; aborting it would
      // starve the board whenever the route is slower than the interval.
      if (controller) return
      controller = new AbortController()
      try {
        const res = await fetch('/api/board/activity', {signal: controller.signal, cache: 'no-store'})
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const snapshot = (await res.json()) as ActivitySnapshot
        last = snapshot
        setState(snapshot.available ? {status: 'ready', snapshot} : {status: 'unavailable'})
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setState({status: 'error', message: (err as Error).message, last})
      } finally {
        controller = null
      }
    }

    function start() {
      if (timer) return
      void load()
      timer = setInterval(load, intervalMs)
    }
    function stop() {
      if (timer) clearInterval(timer)
      timer = null
      controller?.abort()
    }
    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [intervalMs])

  return state
}
