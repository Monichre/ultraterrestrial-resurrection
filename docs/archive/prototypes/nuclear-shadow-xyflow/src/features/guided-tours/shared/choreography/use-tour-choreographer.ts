'use client';

import { useEffect, useRef } from 'react';
import { useNodesInitialized, useReactFlow } from '@xyflow/react';
import type { TourDefinition } from '../types/tour-definition';
import type { NuclearTourEdge, NuclearTourNode } from '../types/flow-model';
import { useTourStore } from '../state/tour-store';
import {
  focusWaypoint,
  runOpeningSequence,
  runWaypointTransition,
} from './transition-sequence';

export function useTourChoreographer(definition: TourDefinition): void {
  const flow = useReactFlow<NuclearTourNode, NuclearTourEdge>();
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: true });
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);
  const activeExecution = useRef<AbortController | null>(null);

  const hydrated = runtime?.hydrated ?? false;
  const phase = runtime?.phase;
  const reducedMotion = runtime?.reducedMotion ?? false;
  const activeWaypointId = runtime?.activeWaypointId ?? null;
  const pendingWaypointId = runtime?.pendingWaypointId ?? null;
  const transitionToken = runtime?.transitionToken ?? null;
  const viewportOwnership = runtime?.viewportOwnership;

  useEffect(() => {
    if (!hydrated || !nodesInitialized || phase !== 'overview') return;

    activeExecution.current?.abort();
    const controller = new AbortController();
    activeExecution.current = controller;

    void runOpeningSequence({
      definition,
      flow,
      dispatch,
      signal: controller.signal,
      reducedMotion,
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      dispatch({
        type: 'TOUR_FAILED',
        code: 'OPENING_SEQUENCE_FAILED',
        message: error instanceof Error ? error.message : 'Opening sequence failed.',
      });
    });

    return () => controller.abort();
  }, [definition, dispatch, flow, hydrated, nodesInitialized, phase, reducedMotion]);

  useEffect(() => {
    if (
      phase !== 'departing' ||
      !activeWaypointId ||
      !pendingWaypointId ||
      !transitionToken
    ) {
      return;
    }

    activeExecution.current?.abort();
    const controller = new AbortController();
    activeExecution.current = controller;

    void runWaypointTransition({
      definition,
      flow,
      fromId: activeWaypointId,
      toId: pendingWaypointId,
      transitionToken,
      dispatch,
      signal: controller.signal,
      reducedMotion,
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      dispatch({
        type: 'TOUR_FAILED',
        code: 'WAYPOINT_TRANSITION_FAILED',
        message: error instanceof Error ? error.message : 'Waypoint transition failed.',
      });
    });

    return () => controller.abort();
  }, [
    activeWaypointId,
    definition,
    dispatch,
    flow,
    pendingWaypointId,
    phase,
    reducedMotion,
    transitionToken,
  ]);

  useEffect(() => {
    if (!activeWaypointId || viewportOwnership !== 'system') return;
    if (phase === 'departing' || phase === 'overview' || phase === 'arriving') return;

    void focusWaypoint({
      flow,
      definition,
      waypointId: activeWaypointId,
      duration: reducedMotion ? 0 : 500,
    });
  }, [activeWaypointId, definition, flow, phase, reducedMotion, viewportOwnership]);
}
