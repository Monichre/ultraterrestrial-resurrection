'use client'

/**
 * Evidence-graph tour chrome mounted ON the research canvas (T-050 subtask 3).
 * Renders nothing while no evidence-graph definition is loaded. The waypoint
 * nodes and narrative edges themselves are projected into the mindmap's own
 * ReactFlow by `useTourGraphProjection`; this component owns only the HUD,
 * inspector, drawer, choreography and keyboard contract around them.
 */
import { useEffect } from 'react'

import { TourChoreographer } from '@/features/guided-tours/shared/choreography/TourChoreographer'
import { EvidenceDrawer } from '@/features/guided-tours/shared/components/EvidenceDrawer'
import { TourHUD } from '@/features/guided-tours/shared/components/TourHUD'
import { WaypointInspector } from '@/features/guided-tours/shared/components/WaypointInspector'
import { tourProgressRepository } from '@/features/guided-tours/shared/persistence/tour-progress.repository'
import { serializeProgress } from '@/features/guided-tours/shared/persistence/tour-progress.serializer'
import { useUnifiedTourStore } from '@/features/guided-tours/shared/state/unified-tour-store'
import '@/features/guided-tours/shared/components/evidence-tour.css'

import { useEvidenceTour } from './use-evidence-tour'

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.matches('input, select, textarea, button, a, [contenteditable]')

export function EvidenceTourOverlay() {
  const { definition, runtime, leaveEvidenceTour, restartEvidenceTour, placeRecord } = useEvidenceTour()
  const dispatch = useUnifiedTourStore((s) => s.dispatch)

  // Keyboard contract: → next, ← previous visited, R recenter, Esc closes the
  // drawer first and, when nothing is open, leaves the tour.
  useEffect(() => {
    if (!definition || !runtime) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      const current = useUnifiedTourStore.getState().runtime
      if (!current) return

      if (event.key === 'ArrowRight') {
        dispatch({ type: 'NEXT_REQUESTED' })
      } else if (event.key === 'ArrowLeft' && current.previousWaypointId) {
        dispatch({ type: 'VISITED_WAYPOINT_REQUESTED', waypointId: current.previousWaypointId })
      } else if (event.key.toLowerCase() === 'r') {
        dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' })
      } else if (event.key === 'Escape') {
        if (current.evidenceDrawer.open) dispatch({ type: 'EVIDENCE_DRAWER_CLOSED' })
        else leaveEvidenceTour()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [definition, dispatch, leaveEvidenceTour, runtime])

  // Persist progress on every hydrated runtime change (resume via ?resume=1).
  useEffect(() => {
    if (!runtime?.hydrated) return
    const progress = serializeProgress(runtime)
    if (progress) tourProgressRepository.save(progress)
  }, [runtime])

  // Keep focus on the active waypoint so arrow keys read as "move along the spine".
  useEffect(() => {
    if (!runtime?.activeWaypointId) return
    if (runtime.phase !== 'investigating' && runtime.phase !== 'ready-to-depart') return
    document.getElementById(`waypoint-${runtime.activeWaypointId}`)?.focus({ preventScroll: true })
  }, [runtime?.activeWaypointId, runtime?.phase])

  if (!definition || !runtime) return null

  return (
    <>
      <TourChoreographer definition={definition} />
      <TourHUD definition={definition} />
      <WaypointInspector definition={definition} onPlaceRecord={placeRecord} />
      <EvidenceDrawer definition={definition} />

      <div className='ut-tour-back nodrag nopan'>
        <button type='button' className='ut-button ut-button--quiet' onClick={leaveEvidenceTour}>
          ← Leave tour
        </button>
        <button type='button' className='ut-button ut-button--quiet' onClick={restartEvidenceTour}>
          Restart
        </button>
      </div>

      {runtime.phase === 'error' ? (
        <div className='ut-error nodrag nopan' role='alert'>
          <strong>{runtime.error?.code}</strong>
          <p>{runtime.error?.message}</p>
        </div>
      ) : null}

      {runtime.phase === 'complete' ? (
        <div className='ut-completion-modal nodrag nopan'>
          <span className='ut-kicker'>ACT I COMPLETE</span>
          <h2>{definition.subtitle}</h2>
          <p>
            You traced the machinery from Manhattan to Roswell without treating the machinery as
            proof of what it may conceal.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type='button' className='ut-button' onClick={restartEvidenceTour}>
              Restart tour
            </button>
            <button type='button' className='ut-button ut-button--quiet' onClick={leaveEvidenceTour}>
              Back to the canvas
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
