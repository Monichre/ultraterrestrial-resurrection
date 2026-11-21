/* Temporal–Geospatial Observatory — data model types */

/** Color token for map points / markers, mirroring the mockup palette. */
export type PointColor = 'amber' | 'cyan' | 'red'

/** Visual variant for a map point (drives the glow shadow color). */
export type PointVariant = 'default' | 'amber' | 'red'

/** A single event point positioned on the map. */
export interface MapPointData {
  id: string
  /** Left offset in px (relative to the map wrapper). */
  x: number
  /** Top offset in px (relative to the map wrapper). */
  y: number
  /** Fill color hex. */
  color: string
  /** Glow variant — controls the box-shadow color ring. */
  variant: PointVariant
}

/** An info bubble popup anchored on the map. */
export interface EventBubbleData {
  id: string
  /** Left offset in px. */
  x: number
  /** Top offset in px. */
  y: number
  /** Smallcaps era label, e.g. "Event · 1947". */
  era: string
  /** Bubble title. */
  title: string
  /** Description body. */
  description: string
  /** Source count text for the footer row. */
  sourceCount: string
  /** Status text for the footer row. */
  status: string
}

/** A curved connection arc between two map points. */
export interface ConnectionArcData {
  id: string
  /** Left offset in px. */
  left: number
  /** Top offset in px. */
  top: number
  /** Width in px. */
  width: number
  /** Height in px (controls arc curvature). */
  height: number
  /** Rotation in degrees. */
  rotation: number
  /** Border color override (defaults to cyan). */
  color?: string
}

/** A single legend item. */
export interface LegendItem {
  id: string
  label: string
  /** Dot fill color hex. */
  color: string
}

/** A year tick on the timeline axis. */
export interface TimelineTick {
  /** Position as a percentage string, e.g. "2%". */
  position: string
  label: string
}

/** A single event marker on the timeline. */
export interface TimelineMarkerData {
  id: string
  label: string
  /** Position as a percentage string, e.g. "3%". */
  position: string
  /** Marker fill color hex (defaults to amber). */
  color?: string
}

/** A brush selection range on the timeline. */
export interface BrushRange {
  /** Left edge as a percentage string. */
  left: string
  /** Right edge as a percentage string. */
  right: string
}
