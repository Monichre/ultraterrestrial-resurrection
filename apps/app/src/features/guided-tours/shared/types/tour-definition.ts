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

/**
 * How a waypoint connects (or explicitly does not connect) to the live corpus.
 *
 * This is deliberately a required, non-defaulting field with no "unset" member.
 * A waypoint that has no record in the archive must say so — and say WHY — so
 * the UI can mark it narrative-only. Silence would be read as "not resolved
 * yet", which would let a program with no declassified record render as though
 * one exists. That is precisely the false-precision failure the Spacetime
 * Canvas spent two sessions removing; do not reintroduce it here.
 */
export type CorpusAnchor =
  /** Resolve against Neon FTS at tour start (the spine engine's existing path). */
  | { kind: 'query'; table: CorpusTable; searchQuery: string }
  /** A record already known by id — no resolution round-trip needed. */
  | { kind: 'record'; table: CorpusTable; recordId: string }
  /** No corpus record exists. `reason` is shown to the reader, not swallowed. */
  | { kind: 'none'; reason: string };

/**
 * The tables `searchTable` will actually search — mirrors `FTS_TABLES` in
 * `packages/db/src/postgres/search.ts`. A bare `string` here lets a typo'd
 * table name validate and then resolve to nothing at runtime, which is the same
 * indistinguishable-failure problem `CorpusAnchor` exists to prevent.
 */
export const CORPUS_TABLES = [
  'topics',
  'key_figures',
  'events',
  'organizations',
  'sightings',
  'testimonies',
  'documents',
  'artifacts',
] as const;

export type CorpusTable = (typeof CORPUS_TABLES)[number];

/** True when this waypoint can be bound to a real record. */
export function hasCorpusAnchor(anchor: CorpusAnchor): boolean {
  return anchor.kind !== 'none';
}

/** True when the archive holds nothing for this waypoint and the UI must say so. */
export function isNarrativeOnly(anchor: CorpusAnchor): boolean {
  return anchor.kind === 'none';
}

/**
 * What resolution actually produced. The definition-time guarantee in
 * {@link CorpusAnchor} is only half the job: once a `query` anchor has been run,
 * a bare `recordId: string | null` collapses "the archive holds nothing for this
 * waypoint" back into "the lookup came up empty", which is exactly the
 * distinction the anchor was introduced to keep. Resolution therefore reports
 * which of the three happened, and `unresolved` carries the query it tried so
 * the UI can say what was searched for rather than showing a silent blank.
 */
export type ResolvedAnchor =
  | { state: 'resolved'; table: CorpusTable; recordId: string; record: Record<string, unknown> }
  | { state: 'unresolved'; table: CorpusTable; searchQuery: string }
  | { state: 'narrative-only'; reason: string };

/** True when a real record was found and may be rendered as evidence. */
export function isResolved(
  resolved: ResolvedAnchor,
): resolved is Extract<ResolvedAnchor, { state: 'resolved' }> {
  return resolved.state === 'resolved';
}

/**
 * The evidence-graph tour: claims, evidence, gates, typed edges, choreography.
 * Nuclear Shadow is the reference implementation.
 */
export interface TourDefinition {
  mode: 'evidence-graph';
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

/**
 * The spine tour: a chronological walk whose stops are resolved against live
 * Neon data at tour start. Carries narrative but makes no evidentiary claim —
 * which is exactly why it stays a separate mode rather than a degenerate
 * evidence-graph with empty gates.
 */
export interface SpineTourDefinition {
  mode: 'spine';
  id: string;
  title: string;
  subtitle: string;
  waypoints: SpineWaypointDefinition[];
}

export interface SpineWaypointDefinition {
  /** FTS query used to resolve the real record at tour start */
  searchQuery: string;
  table: string;
  /** Display title (overridden by the resolved record's own title if found) */
  title: string;
  year: string;
  /** Narrative shown on the tour card — the story of this stop */
  narrative: string;
}

/** Either tour shape, discriminated by `mode`. */
export type AnyTourDefinition = TourDefinition | SpineTourDefinition;

export function isEvidenceGraphTour(tour: AnyTourDefinition): tour is TourDefinition {
  return tour.mode === 'evidence-graph';
}

export function isSpineTour(tour: AnyTourDefinition): tour is SpineTourDefinition {
  return tour.mode === 'spine';
}

export interface TourWaypointDefinition {
  id: WaypointId;
  ordinal: number;
  /** Required — see {@link CorpusAnchor}. There is no implicit default. */
  corpusAnchor: CorpusAnchor;
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
