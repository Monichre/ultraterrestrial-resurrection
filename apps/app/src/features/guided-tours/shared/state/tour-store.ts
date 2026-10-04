'use client'

/**
 * The evidence-graph engine's view of the unified tour store (T-050).
 *
 * This is an alias, not a second store: `UnifiedTourState` is a superset of the
 * shape this hook used to own, so every existing `s.definition` / `s.runtime` /
 * `loadDefinition` / `dispatch` selector reads exactly what it always did.
 */
export {
  useUnifiedTourStore as useTourStore,
  type UnifiedTourState,
} from './unified-tour-store'
