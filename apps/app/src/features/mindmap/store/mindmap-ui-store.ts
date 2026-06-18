'use client'

import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {Node} from '@xyflow/react'

export type ActiveView = 'canvas' | 'timeline' | 'globe' | 'search' | 'detail'
export type TourMode = 'guided' | 'free-form' | null

export type TimelineState = {
  year: number
  era: string
  isPlaying: boolean
  speed: string
}

export type LayoutSettings = {
  nodeSpacing: number
  edgeLength: number
  clusterStrength: number
  repulsionForce: number
}

export type AssetsState = {
  query: string
  viewMode: 'grid' | 'list'
  category: string
}

export type FilterState = {
  nodeTypes: string[]
  dateRange: { start: string | null, end: string | null }
  searchQuery: string
  themes: string[]
  locations: string[]
}

export type NavigationState = {
  activeView: ActiveView
  fullScreenMenuOpen: boolean
  commandMenuOpen: boolean
  modelMenuOpen: boolean
  activeCommand: string | null
  selectedModel: string | null
}

export type TourState = {
  tourMode: TourMode
  activeTourSession: string | null
  activeTourId: string | null
  currentWaypointIndex: number
  backgroundProcessing: boolean
  currentProcessingType: string
}

export type SessionEventType = 'query' | 'nodes_added' | 'analysis' | 'tour' | 'save'

export type SessionEvent = {
  id: string
  timestamp: number
  type: SessionEventType
  label: string
  detail?: string
}

export type CanvasState = {
  activeNode: Node | null
  conciseViewActive: boolean
  showLocationVisualization: boolean
  locationsToVisualize: Array<Record<string, unknown>>
  keepLoadedOnMap: boolean
}

export interface MindMapUiState {
  activeTool: string | null
  pinnedPanel: string | null
  autoLayout: boolean
  animateTransitions: boolean
  activeLayoutId: string
  layoutSettings: LayoutSettings
  timeline: TimelineState
  assets: AssetsState
  filters: FilterState
  navigation: NavigationState
  tour: TourState
  aiMode: boolean
  deepResearchEnabled: boolean
  sessionEvents: SessionEvent[]
  hiddenNodeTypes: string[]

  // Canvas node state
  canvas: CanvasState

  // Session history actions
  addSessionEvent: (event: Omit<SessionEvent, 'id' | 'timestamp'>) => void
  clearSessionEvents: () => void

  // Layer visibility actions
  toggleNodeTypeHidden: (nodeType: string) => void
  setNodeTypeHidden: (nodeType: string, hidden: boolean) => void

  // Tool/Panel actions
  setActiveTool: (tool: string | null) => void
  togglePinnedPanel: (tool: string) => void
  setAutoLayout: (value: boolean) => void
  toggleAutoLayout: () => void
  setAnimateTransitions: (value: boolean) => void
  toggleAnimateTransitions: () => void
  setActiveLayoutId: (layoutId: string) => void
  setLayoutSetting: (key: keyof LayoutSettings, value: number) => void

  // Timeline actions
  setTimelineYear: (year: number) => void
  setTimelineEra: (era: string) => void
  setTimelinePlaying: (isPlaying: boolean) => void
  setTimelineSpeed: (speed: string) => void

  // Asset actions
  setAssetQuery: (query: string) => void
  setAssetViewMode: (mode: 'grid' | 'list') => void
  setAssetCategory: (category: string) => void

  // Filter actions
  setFilterNodeTypes: (nodeTypes: string[]) => void
  toggleFilterNodeType: (nodeType: string) => void
  setFilterDateRange: (start: string | null, end: string | null) => void
  setFilterSearchQuery: (query: string) => void
  setFilterThemes: (themes: string[]) => void
  toggleFilterTheme: (theme: string) => void
  setFilterLocations: (locations: string[]) => void
  toggleFilterLocation: (location: string) => void
  clearAllFilters: () => void

  // Navigation actions
  setActiveView: (view: ActiveView) => void
  setFullScreenMenuOpen: (open: boolean) => void
  toggleFullScreenMenu: () => void
  setCommandMenuOpen: (open: boolean) => void
  setModelMenuOpen: (open: boolean) => void
  toggleModelMenu: () => void
  setActiveCommand: (command: string | null) => void
  setSelectedModel: (model: string | null) => void
  clearActiveCommand: () => void

  // Tour actions
  setTourMode: (mode: TourMode) => void
  setActiveTourSession: (sessionId: string | null) => void
  setActiveTourId: (tourId: string | null) => void
  setCurrentWaypointIndex: (index: number) => void
  setBackgroundProcessing: (processing: boolean, type?: string) => void
  startTour: (tourId: string, mode: TourMode) => void
  endTour: () => void

  // AI mode actions
  setAiMode: (enabled: boolean) => void
  toggleAiMode: () => void
  setDeepResearchEnabled: (enabled: boolean) => void
  toggleDeepResearch: () => void

  // Canvas actions
  setActiveNode: (node: Node | null) => void
  setConciseViewActive: (active: boolean) => void
  setShowLocationVisualization: (show: boolean) => void
  setLocationsToVisualize: (locations: Array<Record<string, unknown>>) => void
  setKeepLoadedOnMap: (keep: boolean) => void
}

export const useMindMapUiStore = create<MindMapUiState>()(
  persist(
    (set, get) => ({
      activeTool: 'network',
      pinnedPanel: null,
      autoLayout: true,
      animateTransitions: true,
      activeLayoutId: 'chronological',
      aiMode: false,
      deepResearchEnabled: false,
      layoutSettings: {
        nodeSpacing: 75,
        edgeLength: 100,
        clusterStrength: 60,
        repulsionForce: 80,
      },
      timeline: {
        year: 2004,
        era: 'Contemporary',
        isPlaying: false,
        speed: '1x',
      },
      assets: {
        query: '',
        viewMode: 'grid',
        category: 'my-files',
      },
      filters: {
        nodeTypes: ['people', 'institutions', 'events', 'locations', 'documents', 'sightings'],
        dateRange: { start: null, end: null },
        searchQuery: '',
        themes: [],
        locations: [],
      },
      navigation: {
        activeView: 'canvas',
        fullScreenMenuOpen: false,
        commandMenuOpen: false,
        modelMenuOpen: false,
        activeCommand: null,
        selectedModel: null,
      },
      tour: {
        tourMode: null,
        activeTourSession: null,
        activeTourId: null,
        currentWaypointIndex: 0,
        backgroundProcessing: false,
        currentProcessingType: '',
      },
      sessionEvents: [],
      hiddenNodeTypes: [],

      // Canvas initial state
      canvas: {
        activeNode: null,
        conciseViewActive: true,
        showLocationVisualization: false,
        locationsToVisualize: [],
        keepLoadedOnMap: false,
      },

      // Session history actions
      addSessionEvent: (event) =>
        set({
          sessionEvents: [
            {
              ...event,
              id: `session-event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
            ...get().sessionEvents,
          ].slice(0, 100),
        }),
      clearSessionEvents: () => set({sessionEvents: []}),

      // Layer visibility actions
      toggleNodeTypeHidden: (nodeType) => {
        const current = get().hiddenNodeTypes
        set({
          hiddenNodeTypes: current.includes(nodeType)
            ? current.filter((t) => t !== nodeType)
            : [...current, nodeType],
        })
      },
      setNodeTypeHidden: (nodeType, hidden) => {
        const current = get().hiddenNodeTypes
        set({
          hiddenNodeTypes: hidden
            ? [...new Set([...current, nodeType])]
            : current.filter((t) => t !== nodeType),
        })
      },

      // Tool/Panel actions
      setActiveTool: (tool) => set({activeTool: tool}),
      togglePinnedPanel: (tool) =>
        set({pinnedPanel: get().pinnedPanel === tool ? null : tool}),
      setAutoLayout: (value) => set({autoLayout: value}),
      toggleAutoLayout: () => set({autoLayout: !get().autoLayout}),
      setAnimateTransitions: (value) => set({animateTransitions: value}),
      toggleAnimateTransitions: () =>
        set({animateTransitions: !get().animateTransitions}),
      setActiveLayoutId: (layoutId) => set({activeLayoutId: layoutId}),
      setLayoutSetting: (key, value) =>
        set({
          layoutSettings: {
            ...get().layoutSettings,
            [key]: value,
          },
        }),

      // Timeline actions
      setTimelineYear: (year) =>
        set({
          timeline: {
            ...get().timeline,
            year,
          },
        }),
      setTimelineEra: (era) =>
        set({
          timeline: {
            ...get().timeline,
            era,
          },
        }),
      setTimelinePlaying: (isPlaying) =>
        set({
          timeline: {
            ...get().timeline,
            isPlaying,
          },
        }),
      setTimelineSpeed: (speed) =>
        set({
          timeline: {
            ...get().timeline,
            speed,
          },
        }),

      // Asset actions
      setAssetQuery: (query) =>
        set({
          assets: {
            ...get().assets,
            query,
          },
        }),
      setAssetViewMode: (viewMode) =>
        set({
          assets: {
            ...get().assets,
            viewMode,
          },
        }),
      setAssetCategory: (category) =>
        set({
          assets: {
            ...get().assets,
            category,
          },
        }),

      // Filter actions
      setFilterNodeTypes: (nodeTypes) =>
        set({
          filters: {
            ...get().filters,
            nodeTypes,
          },
        }),
      toggleFilterNodeType: (nodeType) => {
        const current = get().filters.nodeTypes
        const next = current.includes(nodeType)
          ? current.filter((t) => t !== nodeType)
          : [...current, nodeType]
        set({
          filters: {
            ...get().filters,
            nodeTypes: next,
          },
        })
      },
      setFilterDateRange: (start, end) =>
        set({
          filters: {
            ...get().filters,
            dateRange: { start, end },
          },
        }),
      setFilterSearchQuery: (query) =>
        set({
          filters: {
            ...get().filters,
            searchQuery: query,
          },
        }),
      setFilterThemes: (themes) =>
        set({
          filters: {
            ...get().filters,
            themes,
          },
        }),
      toggleFilterTheme: (theme) => {
        const current = get().filters.themes
        const next = current.includes(theme)
          ? current.filter((t) => t !== theme)
          : [...current, theme]
        set({
          filters: {
            ...get().filters,
            themes: next,
          },
        })
      },
      setFilterLocations: (locations) =>
        set({
          filters: {
            ...get().filters,
            locations,
          },
        }),
      toggleFilterLocation: (location) => {
        const current = get().filters.locations
        const next = current.includes(location)
          ? current.filter((l) => l !== location)
          : [...current, location]
        set({
          filters: {
            ...get().filters,
            locations: next,
          },
        })
      },
      clearAllFilters: () =>
        set({
          filters: {
            nodeTypes: ['people', 'institutions', 'events', 'locations', 'documents', 'sightings'],
            dateRange: { start: null, end: null },
            searchQuery: '',
            themes: [],
            locations: [],
          },
        }),

      // Navigation actions
      setActiveView: (view) =>
        set({
          navigation: {
            ...get().navigation,
            activeView: view,
          },
        }),
      setFullScreenMenuOpen: (open) =>
        set({
          navigation: {
            ...get().navigation,
            fullScreenMenuOpen: open,
          },
        }),
      toggleFullScreenMenu: () =>
        set({
          navigation: {
            ...get().navigation,
            fullScreenMenuOpen: !get().navigation.fullScreenMenuOpen,
          },
        }),
      setCommandMenuOpen: (open) =>
        set({
          navigation: {
            ...get().navigation,
            commandMenuOpen: open,
          },
        }),
      setModelMenuOpen: (open) =>
        set({
          navigation: {
            ...get().navigation,
            modelMenuOpen: open,
          },
        }),
      toggleModelMenu: () =>
        set({
          navigation: {
            ...get().navigation,
            modelMenuOpen: !get().navigation.modelMenuOpen,
          },
        }),
      setActiveCommand: (command) =>
        set({
          navigation: {
            ...get().navigation,
            activeCommand: command,
          },
        }),
      setSelectedModel: (model) =>
        set({
          navigation: {
            ...get().navigation,
            selectedModel: model,
          },
        }),
      clearActiveCommand: () =>
        set({
          navigation: {
            ...get().navigation,
            activeCommand: null,
            commandMenuOpen: false,
          },
        }),

      // Tour actions
      setTourMode: (mode) =>
        set({
          tour: {
            ...get().tour,
            tourMode: mode,
          },
        }),
      setActiveTourSession: (sessionId) =>
        set({
          tour: {
            ...get().tour,
            activeTourSession: sessionId,
          },
        }),
      setActiveTourId: (tourId) =>
        set({
          tour: {
            ...get().tour,
            activeTourId: tourId,
          },
        }),
      setCurrentWaypointIndex: (index) =>
        set({
          tour: {
            ...get().tour,
            currentWaypointIndex: index,
          },
        }),
      setBackgroundProcessing: (processing, type = '') =>
        set({
          tour: {
            ...get().tour,
            backgroundProcessing: processing,
            currentProcessingType: type,
          },
        }),
      startTour: (tourId, mode) =>
        set({
          tour: {
            ...get().tour,
            tourMode: mode,
            activeTourId: tourId,
            currentWaypointIndex: 0,
          },
        }),
      endTour: () =>
        set({
          tour: {
            tourMode: null,
            activeTourSession: null,
            activeTourId: null,
            currentWaypointIndex: 0,
            backgroundProcessing: false,
            currentProcessingType: '',
          },
        }),

      // AI mode actions
      setAiMode: (enabled) => set({aiMode: enabled}),
      toggleAiMode: () => set({aiMode: !get().aiMode}),
      setDeepResearchEnabled: (enabled) => set({deepResearchEnabled: enabled}),
      toggleDeepResearch: () => set({deepResearchEnabled: !get().deepResearchEnabled}),

      // Canvas actions
      setActiveNode: (node) =>
        set({canvas: {...get().canvas, activeNode: node}}),
      setConciseViewActive: (active) =>
        set({canvas: {...get().canvas, conciseViewActive: active}}),
      setShowLocationVisualization: (show) =>
        set({canvas: {...get().canvas, showLocationVisualization: show}}),
      setLocationsToVisualize: (locations) =>
        set({canvas: {...get().canvas, locationsToVisualize: locations}}),
      setKeepLoadedOnMap: (keep) =>
        set({canvas: {...get().canvas, keepLoadedOnMap: keep}}),
    }),
    {
      name: 'mindmap-ui-storage',
      partialize: (state) => ({
        activeLayoutId: state.activeLayoutId,
        autoLayout: state.autoLayout,
        aiMode: state.aiMode,
        deepResearchEnabled: state.deepResearchEnabled,
        navigation: {
          activeView: state.navigation.activeView,
        },
      }),
    }
  )
)
