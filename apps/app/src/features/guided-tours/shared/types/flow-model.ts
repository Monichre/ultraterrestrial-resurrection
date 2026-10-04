import type { Edge, Node } from '@xyflow/react';
import type { CorpusAnchor, NarrativeEdgeKind, ResolvedAnchor, WaypointId } from './tour-definition';
import type {
  EdgeTraversalStatus,
  WaypointProgress,
  WaypointStatus,
} from './tour-runtime';

/**
 * Node / edge type keys registered in the mindmap's shared registries
 * (`features/mindmap/config/node-types.tsx`, `edge-types.tsx`). Namespaced so
 * they can never collide with an entity node type (T-050 subtask 3).
 */
export const TOUR_WAYPOINT_NODE_TYPE = 'tourWaypointNode' as const;
export const TOUR_NARRATIVE_EDGE_TYPE = 'tourNarrativeEdge' as const;

/** What the reader is told about a waypoint's binding to the live corpus. */
export type WaypointAnchorState = ResolvedAnchor['state'] | 'resolving';

export interface WaypointNodeData extends Record<string, unknown> {
  waypointId: WaypointId;
  ordinal: number;
  title: string;
  subtitle?: string;
  dateDisplay: string;
  visualMode: string;
  status: WaypointStatus;
  progress: WaypointProgress;
  interactionsLocked: boolean;
  /** Definition-time anchor kind — `none` means the archive holds nothing. */
  anchorKind: CorpusAnchor['kind'];
  /** Resolution outcome once subtask 4 has run; `resolving` until then. */
  anchorState: WaypointAnchorState;
  /** Table the record lives in, when resolved. */
  anchorTable?: string;
}

export interface NarrativeEdgeData extends Record<string, unknown> {
  kind: NarrativeEdgeKind;
  status: EdgeTraversalStatus;
  durationMs: number;
  label?: string;
  reducedMotion: boolean;
}

export type NuclearTourNode = Node<WaypointNodeData, typeof TOUR_WAYPOINT_NODE_TYPE>;
export type NuclearTourEdge = Edge<NarrativeEdgeData, typeof TOUR_NARRATIVE_EDGE_TYPE>;
