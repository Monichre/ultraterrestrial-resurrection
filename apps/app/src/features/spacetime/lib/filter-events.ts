import type {
  EpistemicStatus,
  SpacetimeEvent,
  SpacetimeEventType,
  SpacetimeLayerVisibility,
} from '../types/spacetime'

export interface SpacetimeEvidenceFilters {
  /** Inclusive minimum credibility (0–1). Events without a score pass. */
  credibilityMin: number
  /** Epistemic statuses allowed through the instrument. */
  epistemic: Record<EpistemicStatus, boolean>
}

export const DEFAULT_EVIDENCE_FILTERS: SpacetimeEvidenceFilters = {
  credibilityMin: 0,
  epistemic: {
    documented: true,
    inferred: true,
    disputed: true,
  },
}

const TYPE_TO_LAYER: Record<SpacetimeEventType, keyof SpacetimeLayerVisibility> = {
  sighting: 'sightings',
  historical_event: 'historicalEvents',
  nuclear: 'nuclear',
  military: 'military',
  infrastructure: 'infrastructure',
  testimony: 'testimony',
  document: 'documents',
  reconstruction: 'reconstructions',
  // Collapse uncategorized scientific/context types into the historical rail.
  astronomical: 'historicalEvents',
  environmental: 'historicalEvents',
}

export function eventLayerKey(
  type: SpacetimeEventType,
): keyof SpacetimeLayerVisibility {
  return TYPE_TO_LAYER[type]
}

/**
 * Apply layer visibility + credibility + epistemic filters.
 * Pure — safe for selectors and server-side station rebuilds later.
 */
export function filterSpacetimeEvents(
  events: SpacetimeEvent[],
  layers: SpacetimeLayerVisibility,
  filters: SpacetimeEvidenceFilters,
): SpacetimeEvent[] {
  return events.filter((event) => {
    if (!layers[eventLayerKey(event.type)]) return false

    if (
      event.credibilityScore != null &&
      event.credibilityScore < filters.credibilityMin
    ) {
      return false
    }

    const status = event.epistemicStatus ?? 'inferred'
    if (!filters.epistemic[status]) return false

    return true
  })
}
