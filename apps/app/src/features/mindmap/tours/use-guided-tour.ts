'use client'

/**
 * Guided Tour engine — resolves a tour's waypoints against live Neon data,
 * lays them out as a chronological spine across the canvas, and flies the
 * camera stop-to-stop while the narrative overlay tells the story.
 */
import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'

import { useMindMapUiStore } from '@/features/mindmap/store/mindmap-ui-store'
import { resolveTourWaypoints } from '@/features/mindmap/actions/tour-actions'
import { useAddRecordNode } from '@/features/mindmap/hooks/use-add-record-node'
import {
  useGuidedTourStore,
  type GuidedTourDef,
  type GuidedTourWaypoint,
} from './guided-tour-store'

/** Horizontal spacing of the chronological spine */
const SPINE_STEP_X = 560
/** Alternating vertical offset keeps the spine from reading as a flat line */
const SPINE_WAVE_Y = 90
/** Approximate node center offset for camera targeting */
const NODE_CENTER = { x: 150, y: 70 }

const spinePosition = (index: number) => ({
  x: index * SPINE_STEP_X,
  y: index % 2 === 0 ? 0 : SPINE_WAVE_Y,
})

export function useGuidedTour() {
  const { setCenter } = useReactFlow()
  const { addRecordNode } = useAddRecordNode()
  const uiStartTour = useMindMapUiStore((s) => s.startTour)
  const uiEndTour = useMindMapUiStore((s) => s.endTour)
  const addSessionEvent = useMindMapUiStore((s) => s.addSessionEvent)

  const status = useGuidedTourStore((s) => s.status)
  const stepIndex = useGuidedTourStore((s) => s.stepIndex)
  const waypoints = useGuidedTourStore((s) => s.waypoints)
  const tourTitle = useGuidedTourStore((s) => s.tourTitle)
  const tourSubtitle = useGuidedTourStore((s) => s.tourSubtitle)

  const flyTo = useCallback(
    (index: number) => {
      const pos = spinePosition(index)
      setCenter(pos.x + NODE_CENTER.x, pos.y + NODE_CENTER.y, {
        zoom: 1.05,
        duration: 900,
      })
    },
    [setCenter],
  )

  const placeWaypoint = useCallback(
    (wps: GuidedTourWaypoint[], index: number) => {
      const wp = wps[index]
      if (!wp) return
      if (wp.recordId && wp.record) {
        addRecordNode({
          id: wp.recordId,
          table: wp.table,
          title: wp.title,
          record: wp.record,
          position: spinePosition(index),
          extraData: { tourYear: wp.year, tourStep: index + 1 },
        })
        useGuidedTourStore.getState().markPlaced(wp.recordId)

        // Chronological path edge from the previous resolved waypoint.
        const prev = [...wps.slice(0, index)].reverse().find((w) => w.recordId)
        if (prev?.recordId) {
          addRecordNode({
            id: wp.recordId,
            table: wp.table,
            title: wp.title,
            record: wp.record,
            sourceNodeId: prev.recordId,
            edgeLabel: `${prev.year} → ${wp.year}`,
            edgeReasoning: 'Chronological tour path',
            position: spinePosition(index),
          })
        }
      }
      flyTo(index)
    },
    [addRecordNode, flyTo],
  )

  const startTour = useCallback(
    async (def: GuidedTourDef) => {
      const store = useGuidedTourStore.getState()
      store.beginResolving(def)
      uiStartTour(def.id, 'guided')
      addSessionEvent({ type: 'tour', label: `Started tour: ${def.title}` })

      const resolved = await resolveTourWaypoints(def.waypoints)
      useGuidedTourStore.getState().beginRunning(resolved)
      placeWaypoint(resolved, 0)
    },
    [addSessionEvent, placeWaypoint, uiStartTour],
  )

  const goToStep = useCallback(
    (index: number) => {
      const { waypoints: wps } = useGuidedTourStore.getState()
      if (index < 0 || index >= wps.length) return
      useGuidedTourStore.getState().goTo(index)
      placeWaypoint(wps, index)
    },
    [placeWaypoint],
  )

  const nextStep = useCallback(() => {
    const { stepIndex: i, waypoints: wps } = useGuidedTourStore.getState()
    if (i >= wps.length - 1) {
      useGuidedTourStore.getState().complete()
      addSessionEvent({ type: 'tour', label: 'Tour completed' })
      return
    }
    goToStep(i + 1)
  }, [addSessionEvent, goToStep])

  const prevStep = useCallback(() => {
    goToStep(useGuidedTourStore.getState().stepIndex - 1)
  }, [goToStep])

  const endTour = useCallback(() => {
    useGuidedTourStore.getState().reset()
    uiEndTour()
    addSessionEvent({ type: 'tour', label: 'Tour ended' })
  }, [addSessionEvent, uiEndTour])

  return {
    status,
    stepIndex,
    waypoints,
    tourTitle,
    tourSubtitle,
    startTour,
    nextStep,
    prevStep,
    goToStep,
    endTour,
  }
}
