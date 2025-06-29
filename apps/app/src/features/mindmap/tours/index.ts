/**
 * Mindmap Tours Feature
 * 
 * Provides the core UFO disclosure narrative tour - a sequential journey
 * through major historical events starting from Roswell 1947 and moving
 * chronologically through the fundamental UFO disclosure story.
 */

// Core Narrative types
export type {
  CoreNarrativeTour,
  NarrativeEvent,
  CoreNarrativeProgress
} from './types/core-narrative'

// Core Narrative hook
export { useCoreNarrative } from './hooks/use-core-narrative'

// The main tour data
export { CORE_UFO_NARRATIVE } from './types/core-narrative'