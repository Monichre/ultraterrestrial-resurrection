export type {
  EpistemicStatus,
  SpacetimeCoordinates,
  SpacetimeEvent,
  SpacetimeEventType,
  SpacetimeInteractionMode,
  SpacetimeLayerVisibility,
  SpacetimeViewport,
  TemporalCursor,
  TemporalLayerFeature,
  TemporalStation,
  TemporalStationKind,
  TimePrecision,
} from './types/spacetime'

export {useSpacetimeStore} from './state/spacetime-store'
export type {SpacetimeState} from './state/spacetime-store'

export {SpacetimeCanvasShell} from './components/spacetime-canvas-shell'
export {Preserve3dGlobeSpike} from './components/preserve3d-globe-spike'
export {SpacetimeCanvas} from './components/spacetime-canvas'
export {SpacetimeGlobe} from './components/spacetime-globe'
export {SpacetimeRail} from './components/spacetime-rail'
export {SpacetimeTopbar} from './components/spacetime-topbar'
export {TemporalDial} from './components/temporal-dial'
export {EvidenceLayersPanel} from './components/evidence-layers-panel'
export {EvidenceLegend} from './components/evidence-legend'
export {EventInspector} from './components/event-inspector'
export {MapControls} from './components/map-controls'
export {PlaybackTransport} from './components/playback-transport'
export {ViewportReadout} from './components/viewport-readout'
export {WaypointNarrative} from './components/waypoint-narrative'

export {
  DEFAULT_EVIDENCE_FILTERS,
  eventLayerKey,
  filterSpacetimeEvents,
} from './lib/filter-events'
export type {SpacetimeEvidenceFilters} from './lib/filter-events'

export {loadSpacetimeEvents} from './actions/load-spacetime-events'
export type {
  LoadSpacetimeEventsInput,
  LoadSpacetimeEventsResult,
} from './actions/load-spacetime-events'

/**
 * `sightingToSpacetimeEvent` / `sightingsToSpacetimeEvents` are intentionally
 * NOT re-exported. The canvas sources the curated `events` table only, and
 * those helpers derive `credibilityScore` from the length of a comment field —
 * a fabricated signal this surface must not reintroduce. They remain in
 * `lib/normalize.ts` for any future sightings-backed surface that decides to
 * own that tradeoff explicitly.
 */
export {
  eventRecordToSpacetimeEvent,
  eventRecordsToSpacetimeEvents,
} from './lib/normalize'
export {
  buildTemporalStations,
  niceYearStep,
  stationAtProgress,
} from './lib/temporal-stations'
export {getSpacetimeMap, useSpacetimeMap} from './lib/map-controller'
export {STC, STC_EPISTEMIC_COLOR, STC_LAYER_COLOR} from './lib/spacetime-theme'
