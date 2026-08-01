'use client'

import {create} from 'zustand'
import {
  DEFAULT_EVIDENCE_FILTERS,
  type SpacetimeEvidenceFilters,
} from '../lib/filter-events'
import type {
  EpistemicStatus,
  SpacetimeEvent,
  SpacetimeInteractionMode,
  SpacetimeLayerVisibility,
  SpacetimeViewport,
  TemporalCursor,
  TemporalStation,
} from '../types/spacetime'

/**
 * Spacetime Canvas Zustand store.
 *
 * Contract (D1 recommendation — confirm before M0.3 locks):
 *   temporalCursor  ← THE single source of truth
 *      ↑ scroll (guided mode writes cursor; camera follows)
 *      ↑ dial   (free mode writes cursor; scroll position follows)
 *
 * Scroll and dial are two inputs to one cursor. `interactionMode` decides
 * which input is authoritative so they can never fight.
 *
 * Plan: docs/PLANS/2026-08-01-spacetime-canvas-implementation.md §2/R2
 */

const DEFAULT_VIEWPORT: SpacetimeViewport = {
  longitude: -98.5,
  latitude: 39.8,
  zoom: 3.2,
  bearing: 0,
  pitch: 0,
}

const DEFAULT_LAYERS: SpacetimeLayerVisibility = {
  sightings: true,
  // Other rails stay off until their data paths land (M1+).
  historicalEvents: false,
  nuclear: false,
  military: false,
  infrastructure: false,
  testimony: false,
  documents: false,
  reconstructions: false,
}

const DEFAULT_CURSOR: TemporalCursor = {
  mode: 'exact',
  timestamp: '1947-07-08T00:00:00.000Z',
  precision: 'day',
}

export interface SpacetimeState {
  interactionMode: SpacetimeInteractionMode
  temporalCursor: TemporalCursor
  viewport: SpacetimeViewport
  selectedEventId: string | null
  events: SpacetimeEvent[]
  stations: TemporalStation[]
  layers: SpacetimeLayerVisibility
  filters: SpacetimeEvidenceFilters
  /** Scroll progress 0–1 in guided mode; derived UI only — cursor stays SoT */
  scrollProgress: number
  /** Spike / perf: last measured frame ms under preserve-3d (M0.1) */
  lastFrameMs: number | null

  setInteractionMode: (mode: SpacetimeInteractionMode) => void
  setTemporalCursor: (cursor: TemporalCursor) => void
  setViewport: (viewport: Partial<SpacetimeViewport>) => void
  selectEvent: (eventId: string | null) => void
  setEvents: (events: SpacetimeEvent[]) => void
  setStations: (stations: TemporalStation[]) => void
  setLayerVisibility: (patch: Partial<SpacetimeLayerVisibility>) => void
  setCredibilityMin: (min: number) => void
  setEpistemicFilter: (status: EpistemicStatus, enabled: boolean) => void
  setScrollProgress: (progress: number) => void
  setLastFrameMs: (ms: number | null) => void
  reset: () => void
}

const initialState = {
  interactionMode: 'guided' as SpacetimeInteractionMode,
  temporalCursor: DEFAULT_CURSOR,
  viewport: DEFAULT_VIEWPORT,
  selectedEventId: null as string | null,
  events: [] as SpacetimeEvent[],
  stations: [] as TemporalStation[],
  layers: DEFAULT_LAYERS,
  filters: DEFAULT_EVIDENCE_FILTERS,
  scrollProgress: 0,
  lastFrameMs: null as number | null,
}

export const useSpacetimeStore = create<SpacetimeState>((set) => ({
  ...initialState,

  setInteractionMode: (interactionMode) => set({interactionMode}),

  setTemporalCursor: (temporalCursor) => set({temporalCursor}),

  setViewport: (patch) =>
    set((state) => ({
      viewport: {...state.viewport, ...patch},
    })),

  selectEvent: (selectedEventId) => set({selectedEventId}),

  setEvents: (events) => set({events}),

  setStations: (stations) => set({stations}),

  setLayerVisibility: (patch) =>
    set((state) => ({
      layers: {...state.layers, ...patch},
    })),

  setCredibilityMin: (min) =>
    set((state) => ({
      filters: {
        ...state.filters,
        credibilityMin: Math.min(1, Math.max(0, min)),
      },
    })),

  setEpistemicFilter: (status, enabled) =>
    set((state) => ({
      filters: {
        ...state.filters,
        epistemic: {...state.filters.epistemic, [status]: enabled},
      },
    })),

  setScrollProgress: (scrollProgress) =>
    set({
      scrollProgress: Math.min(1, Math.max(0, scrollProgress)),
    }),

  setLastFrameMs: (lastFrameMs) => set({lastFrameMs}),

  reset: () => set({...initialState}),
}))
