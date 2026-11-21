export type TourId = `ut.tour.${string}`;
export type WaypointId = `${TourId}.wp-${string}`;
export type EvidenceId = `evidence.${string}`;
export type ClaimId = `claim.${string}`;
export type TransitionId = `transition.${string}`;

export type EvidenceThreshold =
  | 'broad-archive'
  | 'corroborated'
  | 'official-record'
  | 'multimodal-only';

export type NarrativeEdgeKind =
  | 'chronological'
  | 'evidentiary'
  | 'hypothesis'
  | 'institutional-inheritance'
  | 'contradiction';

export type TourVisualMode =
  | 'archive'
  | 'field'
  | 'blacksite'
  | 'myth-tech'
  | 'public-release';

export type EvidenceType =
  | 'primary-document'
  | 'official-history'
  | 'contemporaneous-report'
  | 'retrospective-testimony'
  | 'technical-record'
  | 'scholarly-analysis'
  | 'interpretation';

export type EvidenceRole = 'support' | 'challenge' | 'context' | 'contradiction';

export type EvidenceConfidence =
  | 'folkloric'
  | 'anecdotal'
  | 'multi-witness'
  | 'documentary'
  | 'correlated'
  | 'chain-of-custody';

export type GateRule =
  | { kind: 'automatic' }
  | { kind: 'open-any'; minimum: number }
  | { kind: 'open-all-required' }
  | { kind: 'open-specific'; evidenceIds: EvidenceId[] }
  | { kind: 'acknowledge' };

export interface TourDefinition {
  id: TourId;
  slug: string;
  title: string;
  subtitle: string;
  version: string;
  entryWaypointId: WaypointId;
  route: WaypointId[];
  waypoints: TourWaypointDefinition[];
  transitions: TourTransitionDefinition[];
  defaultEvidenceThreshold: EvidenceThreshold;
  viewport: {
    minZoom: number;
    maxZoom: number;
    overviewPadding: number;
  };
}

export interface TourWaypointDefinition {
  id: WaypointId;
  ordinal: number;
  title: string;
  subtitle?: string;
  shortLabel: string;
  dateRange: {
    start: string;
    end?: string;
    display: string;
  };
  narrative: {
    entryClaim: string;
    question: string;
    handoffQuestion: string;
    completionStatement?: string;
  };
  layout: {
    x: number;
    y: number;
    visualMode: TourVisualMode;
    importance: 'primary' | 'secondary';
  };
  camera: {
    zoom: number;
    padding?: number;
    arrivalDurationMs: number;
    departureDurationMs: number;
  };
  claims: WaypointClaimReference[];
  gates: Record<'claim' | 'evidence' | 'challenge' | 'residue', GateRule>;
  evidence: {
    supporting: EvidenceReference[];
    counterpoints: EvidenceReference[];
    contextual: EvidenceReference[];
  };
  epistemic: {
    established: string[];
    notEstablished: string[];
    openQuestions: string[];
  };
  transition?: {
    targetWaypointId: WaypointId;
    edgeKind: NarrativeEdgeKind;
    durationMs: number;
  };
}

export interface WaypointClaimReference {
  id: ClaimId;
  text: string;
  status: 'established' | 'supported' | 'contested' | 'hypothesis';
  confidence: 'low' | 'medium' | 'high';
  evidenceIds: EvidenceId[];
}

export interface EvidenceReference {
  id: EvidenceId;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceUrl?: string;
  claimIds: ClaimId[];
  type: EvidenceType;
  role: EvidenceRole;
  confidence: EvidenceConfidence;
  sourceDate?: string;
  requiredForThresholds: EvidenceThreshold[];
}

export interface TourTransitionDefinition {
  id: TransitionId;
  sourceWaypointId: WaypointId;
  targetWaypointId: WaypointId;
  kind: NarrativeEdgeKind;
  durationMs: number;
  label?: string;
}
