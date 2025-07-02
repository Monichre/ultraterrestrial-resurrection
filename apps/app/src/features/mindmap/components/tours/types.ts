// Type definitions for historical tour UI components

export interface HistoricalTourControlsProps {
  className?: string
  onTourSelect?: (tourId: string) => void
  onWaypointSelect?: (waypointIndex: number) => void
  showTimeline?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export interface HistoricalContextOverlayProps {
  className?: string
  showNarrative?: boolean
  showTimePeriod?: boolean
  showSignificance?: boolean
  autoHide?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
}

export interface TourModeIntegrationProps {
  className?: string
  showWaypoints?: boolean
  showConnections?: boolean
  autoPosition?: boolean
  onModeChange?: (mode: 'guided' | 'free-form' | null) => void
}

// Historical period definition
export interface HistoricalPeriod {
  name: string
  years: string
  color: string
  icon: string
}

// Time period context structure
export interface TimePeriodContext {
  name: string
  description: string
  keyEvents: string[]
  worldContext: string
  significance: string
}

// Significance level definition
export interface SignificanceLevel {
  label: string
  color: string
  icon: string
}

// Entity type icon mapping
export interface EntityTypeIcon {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
}

// Waypoint position for visual indicators
export interface WaypointPosition {
  waypoint: any // TourWaypoint from tour types
  index: number
  position: { x: number; y: number }
  nodeId: string | null
  state: 'completed' | 'current' | 'upcoming' | 'locked'
}

// Tour quick action definition
export interface TourQuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  action: string
}

// Tour mode style definition
export interface TourModeStyle {
  primary: string
  secondary: string
  accent: string
  glow: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}