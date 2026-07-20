import type { ReactNode } from 'react'

export type HudMetric = {
  label: string
  value: string
}

export type HudHotspotRow = {
  name: string
  value: string
  lat?: number
  lon?: number
}

export type HudPositionLogRow = {
  time: string
  x: string
  y: string
  z: string
}

export type HudHotspotFocus = {
  lat: number
  lon: number
  name: string
}

export type RocketHudProps = {
  className?: string
  /** When set, replaces the default SolarMap center stage (e.g. Three.js globe). */
  center?: ReactNode
  identityLabel?: string
  metrics?: ReadonlyArray<HudMetric>
  hotspots?: ReadonlyArray<HudHotspotRow>
  positionLog?: ReadonlyArray<HudPositionLogRow>
  /** Focus a hotspot on the globe (telemetry mode). */
  onHotspotFocus?: ( hotspot: HudHotspotFocus | null ) => void
  /** Active hotspot name for rail highlight. */
  activeHotspotName?: string | null
  /** Optional toolbar slotted over the center stage (year controls, etc.). */
  centerOverlay?: ReactNode
  /** Show decorative Saturn focus card (default true for reference HUD). */
  showSaturnFocus?: boolean
  /** Show bottom numeric axis (default true). */
  showBottomAxis?: boolean
  /** Fill viewport (h-screen) vs parent (h-full). Default: screen. */
  fill?: 'screen' | 'parent'
}
