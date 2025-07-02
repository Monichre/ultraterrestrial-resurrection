/**
 * Mindmap Tours Feature
 * 
 * Provides comprehensive tour system for guided exploration of UFO/UAP disclosure history.
 * Includes both legacy core narrative tours and new enhanced tour system with mindmap integration.
 * 
 * Updated: 2025-07-02 - Added enhanced tour system with contextual intelligence integration
 */

// =================== LEGACY CORE NARRATIVE SYSTEM ===================
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

// =================== ENHANCED TOUR SYSTEM ===================

// Enhanced Tour Context and Providers
export { 
  TourProvider, 
  useTourContext, 
  useTourAwareMindMap, 
  checkTourAvailability 
} from './contexts/tour-context'

// Enhanced Tour Hook with Mindmap Integration
export { useTour } from './hooks/use-tour'

// Tour Validation System
export { 
  validateTourFlow, 
  validateHistoricalAccuracy, 
  quickValidate, 
  getValidationSummary 
} from './utils/tour-validation'

// Tour Components
export { HistoricalTourNavigation } from './components/historical-tour-navigation'

// Tour Types (comprehensive)
export type {
  TourDefinition,
  TourProgress,
  TourSession,
  TourEvent,
  TourConfig,
  TourNote,
  TourWaypoint,
  TourValidationResult,
  ValidationError,
  ValidationWarning
} from './types/tour'

// Tour Utilities
export { TourLoader } from './utils/tour-loader'