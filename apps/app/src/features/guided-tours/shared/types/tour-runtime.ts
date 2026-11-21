import type {
  EvidenceId,
  EvidenceThreshold,
  TourId,
  WaypointId,
} from './tour-definition';

export type TourPhase =
  | 'booting'
  | 'overview'
  | 'arriving'
  | 'investigating'
  | 'ready-to-depart'
  | 'departing'
  | 'paused'
  | 'complete'
  | 'error';

export type WaypointStatus =
  | 'hidden'
  | 'locked'
  | 'ghost'
  | 'available'
  | 'active'
  | 'visited'
  | 'complete';

export type EdgeTraversalStatus = 'hidden' | 'ghost' | 'active' | 'traversed';
export type GateKey = 'claim' | 'evidence' | 'challenge' | 'residue';

export interface WaypointProgress {
  waypointId: WaypointId;
  narrationCompleted: boolean;
  openedEvidenceIds: EvidenceId[];
  openedCounterpointIds: EvidenceId[];
  acknowledgedResidue: boolean;
  gates: Record<GateKey, boolean>;
  firstEnteredAt?: string;
  completedAt?: string;
}

export interface TourRuntimeState {
  tourId: TourId;
  tourVersion: string;
  phase: TourPhase;
  activeWaypointId: WaypointId | null;
  previousWaypointId: WaypointId | null;
  pendingWaypointId: WaypointId | null;
  visitedWaypointIds: WaypointId[];
  completedWaypointIds: WaypointId[];
  progressByWaypoint: Record<WaypointId, WaypointProgress>;
  evidenceThreshold: EvidenceThreshold;
  hypothesisLens: string | null;
  evidenceDrawer: {
    open: boolean;
    evidenceId: EvidenceId | null;
    tab: 'source' | 'provenance' | 'challenge' | 'residue';
  };
  viewportOwnership: 'system' | 'user';
  transitionToken: string | null;
  interactionsLocked: boolean;
  reducedMotion: boolean;
  hydrated: boolean;
  error: { code: string; message: string } | null;
}

export interface PersistedTourProgress {
  schemaVersion: '1.0';
  tourId: TourId;
  tourVersion: string;
  activeWaypointId: WaypointId;
  visitedWaypointIds: WaypointId[];
  completedWaypointIds: WaypointId[];
  progressByWaypoint: Record<WaypointId, WaypointProgress>;
  evidenceThreshold: EvidenceThreshold;
  hypothesisLens: string | null;
  savedViewport?: { x: number; y: number; zoom: number };
  updatedAt: string;
}
