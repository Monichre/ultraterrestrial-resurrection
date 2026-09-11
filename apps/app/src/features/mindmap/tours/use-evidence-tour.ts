'use client'

/**
 * Evidence-graph tour lifecycle on the research canvas (T-050 s3 + s4 + s5).
 *
 * Owns: validate → load definition → resolve anchors against Neon → persist
 * progress → leave. The reducer owns the gated state machine; this hook only
 * feeds it and exposes the canvas-facing bits (interaction lock, waypoint
 * click, viewport ownership) that `graph.tsx` wires onto its ReactFlow.
 */
import { useCallback, useMemo } from 'react'
import type { Node } from '@xyflow/react'

import { useMindMapUiStore } from '@/features/mindmap/store/mindmap-ui-store'
import { resolveEvidenceAnchors } from '@/features/mindmap/actions/tour-actions'
import { useAddRecordNode } from '@/features/mindmap/hooks/use-add-record-node'
import { validateTourDefinition } from '@/features/guided-tours/shared/graph/validate-tour-definition'
import { tourProgressRepository } from '@/features/guided-tours/shared/persistence/tour-progress.repository'
import { useUnifiedTourStore } from '@/features/guided-tours/shared/state/unified-tour-store'
import { TOUR_WAYPOINT_NODE_TYPE } from '@/features/guided-tours/shared/types/flow-model'
import type { TourDefinition, WaypointId } from '@/features/guided-tours/shared/types/tour-definition'
import type { PlaceRecordHandler } from '@/features/guided-tours/shared/components/WaypointInspector'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useEvidenceTour() {
  const definition = useUnifiedTourStore((s) => s.definition)
  const runtime = useUnifiedTourStore((s) => s.runtime)
  const loadDefinition = useUnifiedTourStore((s) => s.loadDefinition)
  const unloadDefinition = useUnifiedTourStore((s) => s.unloadDefinition)
  const setResolvedAnchors = useUnifiedTourStore((s) => s.setResolvedAnchors)
  const dispatch = useUnifiedTourStore((s) => s.dispatch)

  const uiStartTour = useMindMapUiStore((s) => s.startTour)
  const uiEndTour = useMindMapUiStore((s) => s.endTour)
  const addSessionEvent = useMindMapUiStore((s) => s.addSessionEvent)
  const { addRecordNode } = useAddRecordNode()

  const isActive = definition !== null && runtime !== null

  const startEvidenceTour = useCallback(
    async (def: TourDefinition, { resume = false }: { resume?: boolean } = {}) => {
      const validation = validateTourDefinition(def)
      if (!validation.valid) {
        console.error(`Refusing to start malformed tour "${def.id}":`, validation.errors)
        return
      }

      // Fresh session unless explicitly resuming — a stale overview phase in
      // localStorage used to leave the canvas blank.
      const persisted = resume ? tourProgressRepository.load(def.id) : undefined
      if (!resume) tourProgressRepository.clear(def.id)

      loadDefinition(def, persisted, prefersReducedMotion())
      uiStartTour(def.id, 'guided')
      addSessionEvent({ type: 'tour', label: `Started tour: ${def.title}` })

      // Resolution runs after the canvas has something to show; the nodes
      // carry a "Resolving record…" stamp until this lands.
      const anchors = await resolveEvidenceAnchors(def)
      // The reader may have left the tour while Neon was answering.
      if (useUnifiedTourStore.getState().definition?.id === def.id) setResolvedAnchors(anchors)
    },
    [addSessionEvent, loadDefinition, setResolvedAnchors, uiStartTour],
  )

  const leaveEvidenceTour = useCallback(() => {
    const current = useUnifiedTourStore.getState().definition
    unloadDefinition()
    uiEndTour()
    if (current) addSessionEvent({ type: 'tour', label: `Left tour: ${current.title}` })
  }, [addSessionEvent, uiEndTour, unloadDefinition])

  const restartEvidenceTour = useCallback(() => {
    const current = useUnifiedTourStore.getState().definition
    if (!current) return
    tourProgressRepository.clear(current.id)
    dispatch({ type: 'TOUR_RESET' })
    loadDefinition(current, undefined, prefersReducedMotion())
    void resolveEvidenceAnchors(current).then((anchors) => {
      if (useUnifiedTourStore.getState().definition?.id === current.id) setResolvedAnchors(anchors)
    })
  }, [dispatch, loadDefinition, setResolvedAnchors])

  /** Camera is system-owned while arriving/departing; the pane must not fight it. */
  const canvasLocked =
    runtime?.phase === 'arriving' ||
    runtime?.phase === 'departing' ||
    runtime?.interactionsLocked === true

  /** Returns true when the click was a waypoint and has been handled. */
  const handleWaypointNodeClick = useCallback(
    (node: Node): boolean => {
      if (node.type !== TOUR_WAYPOINT_NODE_TYPE) return false
      const current = useUnifiedTourStore.getState().runtime
      if (!current || current.interactionsLocked) return true
      const waypointId = node.id as WaypointId
      if (waypointId === current.activeWaypointId) {
        dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' })
      } else if (current.visitedWaypointIds.includes(waypointId)) {
        dispatch({ type: 'VISITED_WAYPOINT_REQUESTED', waypointId })
      }
      return true
    },
    [dispatch],
  )

  const handleUserViewportInteraction = useCallback(() => {
    if (!useUnifiedTourStore.getState().runtime) return
    dispatch({ type: 'USER_VIEWPORT_INTERACTION_STARTED' })
  }, [dispatch])

  /** Place the resolved archive record beside its waypoint, with a justified edge. */
  const placeRecord = useCallback<PlaceRecordHandler>(
    (resolved, waypointTitle) => {
      const waypoint = useUnifiedTourStore
        .getState()
        .definition?.waypoints.find((item) => item.title === waypointTitle)
      const title =
        (['name', 'title', 'label'] as const)
          .map((key) => resolved.record[key])
          .find((value): value is string => typeof value === 'string' && value.trim().length > 0)
          ?.replace(/\s+/g, ' ')
          .trim() ?? resolved.recordId
      addRecordNode({
        id: resolved.recordId,
        table: resolved.table,
        title,
        record: resolved.record,
        sourceNodeId: waypoint?.id,
        edgeLabel: 'Archive record',
        edgeReasoning: `Corpus record the "${waypointTitle}" waypoint is anchored to`,
        position: waypoint ? { x: waypoint.layout.x, y: waypoint.layout.y + 260 } : undefined,
        extraData: { tourAnchor: true },
      })
      addSessionEvent({ type: 'tour', label: `Placed record: ${title}` })
    },
    [addRecordNode, addSessionEvent],
  )

  return useMemo(
    () => ({
      definition,
      runtime,
      isActive,
      canvasLocked,
      startEvidenceTour,
      leaveEvidenceTour,
      restartEvidenceTour,
      handleWaypointNodeClick,
      handleUserViewportInteraction,
      placeRecord,
    }),
    [
      canvasLocked,
      definition,
      handleUserViewportInteraction,
      handleWaypointNodeClick,
      isActive,
      leaveEvidenceTour,
      placeRecord,
      restartEvidenceTour,
      runtime,
      startEvidenceTour,
    ],
  )
}
