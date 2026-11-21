import type {EvidentiaryState} from '@/features/mindmap/utils/evidentiary-state'

/**
 * Connections-canvas data model — fixture-shaped to mirror what the Neon
 * junction tables (testimonies, organization_members, *_subject_matter_experts,
 * documents.author, document_entities.resolved_*) would emit, so a fixture can
 * later be swapped for live rows without touching the components.
 */

export type EntityKind =
  | 'key_figure'
  | 'event'
  | 'organization'
  | 'document'
  | 'testimony'
  | 'topic'
  | 'location'
  | 'artifact'

export type CanvasEntity = {
  id: string
  kind: EntityKind
  label: string
  sublabel?: string
}

/** Mirrors the junction / FK relations that actually exist in Neon. */
export type RelationKind =
  | 'witnessed'
  | 'authored'
  | 'member_of'
  | 'sme_on'
  | 'testified_in'
  | 'mentioned_in'
  | 'recorded_by'
  | 'operated'
  | 'occurred_at'
  | 'pertains_to'
  | 'supports'
  | 'contradicts'
  | 'claims'

export type SourceRef = {
  kind: 'document' | 'testimony' | 'sighting' | 'inference'
  id: string
  label: string
}

/**
 * One relationship claim between two entities. `tier` is the epistemic tier
 * (Voice Contract): every edge must carry one. `counterReading` is the paired
 * counter-reading — required by contract on interpretive edges, optional on
 * factual ones.
 */
export type EvidenceRelation = {
  id: string
  from: CanvasEntity['id']
  to: CanvasEntity['id']
  relation: RelationKind
  tier: EvidentiaryState
  via: SourceRef[]
  /** The paired counter-reading — "is consistent with", never "proves". */
  counterReading?: string
  note?: string
}

export type ConnectionsCanvasProps = {
  entities: CanvasEntity[]
  relations: EvidenceRelation[]
  /** Authored node positions keyed by entity id; missing ids ring around their reveal parent. */
  positions?: Record<string, {x: number; y: number}>
  /** Node id to pre-focus (ego-network mode), e.g. an EgoNet story variant. */
  focusEntityId?: string
  /** Progressive-disclosure seed: starts visible+expanded, everything else hides behind +N chips. */
  seedId?: string
  /** Tiers visible on first paint; the rest collapse into legend toggles. Defaults to strong tiers. */
  initialVisibleTiers?: EvidentiaryState[]
}
