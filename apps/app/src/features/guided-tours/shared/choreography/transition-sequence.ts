import type { ReactFlowInstance } from '@xyflow/react';
import type { TourDefinition, WaypointId } from '../types/tour-definition';
import type { NuclearTourEdge, NuclearTourNode } from '../types/flow-model';
import type { TourEvent } from '../state/tour-events';

export interface ChoreographyContext {
  definition: TourDefinition;
  flow: ReactFlowInstance<NuclearTourNode, NuclearTourEdge>;
  dispatch: (event: TourEvent) => void;
  signal: AbortSignal;
  reducedMotion: boolean;
}

export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw new DOMException('Tour transition aborted', 'AbortError');
}

export function wait(durationMs: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Tour transition aborted', 'AbortError'));
      return;
    }

    // Global timers, not `window.*` — this module is pure enough to unit-test
    // outside a DOM, and `window` is undefined in the test runtime.
    const timeoutId = setTimeout(resolve, durationMs);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Tour transition aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

/** Slack added to a camera move's duration before we stop waiting on xyflow. */
const CAMERA_SETTLE_SLACK_MS = 120;

/**
 * xyflow resolves `fitView` / `setCenter` only on the d3 transition's `end`
 * event. An interrupted transition (a re-bound zoom handler when the pane's
 * `panOnDrag` flips, a wheel tick, another programmatic move) never fires
 * `end`, so the promise hangs and the tour would sit in `departing` forever.
 * Race the camera against its own duration so the semantic transition always
 * commits; the camera still lands wherever the last transform put it.
 */
export function settleCamera(
  camera: Promise<unknown>,
  durationMs: number,
  signal: AbortSignal,
): Promise<void> {
  const settled = camera.then(() => undefined);
  if (durationMs <= 0) return settled;
  return Promise.race([settled, wait(durationMs + CAMERA_SETTLE_SLACK_MS, signal)]);
}

/** A frame normally lands in ~16ms; a throttled/background tab may never paint one. */
const FRAME_FALLBACK_MS = 64;

export function nextAnimationFrame(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Tour transition aborted', 'AbortError'));
      return;
    }
    const fallback = setTimeout(resolve, FRAME_FALLBACK_MS);
    requestAnimationFrame(() => {
      clearTimeout(fallback);
      resolve();
    });
  });
}

export async function focusWaypoint({
  flow,
  definition,
  waypointId,
  duration,
}: {
  flow: ReactFlowInstance<NuclearTourNode, NuclearTourEdge>;
  definition: TourDefinition;
  waypointId: WaypointId;
  duration: number;
}): Promise<boolean> {
  const waypoint = definition.waypoints.find((item) => item.id === waypointId);
  const node = flow.getNode(waypointId);
  if (!waypoint || !node) return false;

  const width = node.measured?.width ?? node.width ?? 320;
  const height = node.measured?.height ?? node.height ?? 180;

  return flow.setCenter(node.position.x + width / 2, node.position.y + height / 2, {
    zoom: waypoint.camera.zoom,
    duration,
    interpolate: 'smooth',
  });
}

export async function runOpeningSequence({
  definition,
  flow,
  dispatch,
  signal,
  reducedMotion,
}: ChoreographyContext): Promise<void> {
  throwIfAborted(signal);
  dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' });

  const overviewMs = reducedMotion ? 0 : 900;
  await settleCamera(
    flow.fitView({
      nodes: definition.waypoints.slice(0, 3).map(({ id }) => ({ id })),
      padding: definition.viewport.overviewPadding,
      duration: overviewMs,
      interpolate: 'smooth',
    }),
    overviewMs,
    signal,
  );

  throwIfAborted(signal);
  await wait(reducedMotion ? 0 : 500, signal);
  await nextAnimationFrame(signal);
  const entryMs = reducedMotion ? 0 : 850;
  await settleCamera(
    focusWaypoint({
      flow,
      definition,
      waypointId: definition.entryWaypointId,
      duration: entryMs,
    }),
    entryMs,
    signal,
  );

  throwIfAborted(signal);
  // Both semantic state changes occur after camera work so the effect cannot
  // cancel its own in-flight sequence when the phase changes.
  dispatch({ type: 'OVERVIEW_COMPLETED' });
  dispatch({
    type: 'WAYPOINT_ARRIVAL_COMPLETED',
    waypointId: definition.entryWaypointId,
  });
}

export async function runWaypointTransition({
  definition,
  flow,
  fromId,
  toId,
  transitionToken,
  dispatch,
  signal,
  reducedMotion,
}: ChoreographyContext & {
  fromId: WaypointId;
  toId: WaypointId;
  transitionToken: string;
}): Promise<void> {
  const target = definition.waypoints.find((waypoint) => waypoint.id === toId);
  if (!target) {
    dispatch({
      type: 'TOUR_FAILED',
      code: 'TARGET_WAYPOINT_NOT_FOUND',
      message: `No waypoint exists for ${toId}`,
    });
    return;
  }

  dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' });
  await nextAnimationFrame(signal);
  await nextAnimationFrame(signal);

  const duration = reducedMotion ? 0 : target.camera.departureDurationMs;

  const pairMs = Math.round(duration * 0.55);
  await settleCamera(
    flow.fitView({
      nodes: [{ id: fromId }, { id: toId }],
      padding: 0.28,
      duration: pairMs,
      interpolate: 'smooth',
    }),
    pairMs,
    signal,
  );

  throwIfAborted(signal);
  await wait(reducedMotion ? 0 : Math.round(duration * 0.32), signal);

  const focusMs = reducedMotion ? 0 : Math.round(duration * 0.65);
  await settleCamera(
    focusWaypoint({
      flow,
      definition,
      waypointId: toId,
      duration: focusMs,
    }),
    focusMs,
    signal,
  );

  throwIfAborted(signal);
  await wait(reducedMotion ? 0 : target.camera.arrivalDurationMs, signal);
  throwIfAborted(signal);
  // Commit the semantic transition only after the complete camera sequence.
  dispatch({
    type: 'DEPARTURE_COMPLETED',
    from: fromId,
    to: toId,
    transitionToken,
  });
  dispatch({ type: 'WAYPOINT_ARRIVAL_COMPLETED', waypointId: toId });
}
