import type { Edge, Node } from '@xyflow/react';
import type { NarrativeEdgeKind, WaypointId } from './tour-definition';
import type {
  EdgeTraversalStatus,
  WaypointProgress,
  WaypointStatus,
} from './tour-runtime';

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
}

export interface NarrativeEdgeData extends Record<string, unknown> {
  kind: NarrativeEdgeKind;
  status: EdgeTraversalStatus;
  durationMs: number;
  label?: string;
  reducedMotion: boolean;
}

export type NuclearTourNode = Node<WaypointNodeData, 'nuclear-shadow-waypoint'>;
export type NuclearTourEdge = Edge<NarrativeEdgeData, 'narrative-edge'>;
