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

// --- ResearchSession (T-027) ---
// Unified slice converging the previously fragmented research state:
//   - contexts/research/research-context.tsx  (pinned cards + canvas notes)
//   - components/menus/mindmap-bottom-menu/hooks/use-research-state.ts
//     (sessionId, activeMode, isProcessing, selectedNodes, tourState, analysisResults)
// This is additive/non-destructive — the legacy providers remain until consumers
// migrate. See docs/plans/2026-06-20-t027-research-session-slice.md for the plan.
export type ResearchMode = 'research' | 'tour' | 'analysis' | null

export type ResearchPinnedCard = {
  id: string
  type?: string
  title?: string
  pinnedAt: number
  notes?: string
  position: { x: number, y: number }
  data?: Record<string, unknown>
}

export type ResearchSessionState = {
  sessionId: string | null
  activeMode: ResearchMode
  isProcessing: boolean
  selectedNodeIds: string[]
  analysisResults: Array<Record<string, unknown>>
  pinnedCards: ResearchPinnedCard[]
  canvasNotes: string
}

// --- Drop-to-Canvas (T-060) ---
// Contract: docs/plans/2026-08-13-canvas-drop-ingest-contract.md
//
// Deliberately NOT in `partialize` below: contract §2.1 makes dropped
// artifacts session-scoped and in-memory. Persisting them to localStorage
// would resurrect artifact nodes whose blob URLs and session ids no longer
// mean anything, and would imply a durability the feature does not have.
//
// The status values are ONLY things the client can actually observe. There
// is deliberately no 'extracting' or 'embedding' state: contract §4 is a
// single non-streaming POST, so the client cannot know when one server-side
// phase ends and the next begins. Naming those phases on a timer would be
// invented telemetry on a product whose identity is rigor about evidence.
export type DropStatus =
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'awaiting'
  | 'resolved'
  | 'failed'

export type DropFailure = {
  code: string
  title: string
  detail: string
  filename: string
}

export type DropState = {
  /** True while a file drag is over the canvas — drives the drop affordance. */
  isDragActive: boolean
  /** True when the dragged item is known to be an unacceptable type. */
  dragRejected: boolean
  status: DropStatus
  /** Node id of the artifact currently being resolved, if any. */
  pendingArtifactNodeId: string | null
  pendingFilename: string | null
  /** Epoch ms when the request began — the elapsed counter is derived, not faked. */
  startedAt: number | null
  failure: DropFailure | null
  /**
   * React Flow node id of the match currently open in the inspector. The
   * node itself carries the record payload (title/snippet/table/url), so
   * storing the id avoids duplicating that data into this store where it
   * could drift from the graph.
   */
  inspectedMatchNodeId: string | null
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

  // Unified research session state (T-027)
  researchSession: ResearchSessionState

  // Drop-to-canvas state (T-060)
  drop: DropState

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

  // Research session actions (T-027)
  initResearchSession: (sessionId?: string) => void
  setResearchMode: (mode: ResearchMode) => void
  setResearchProcessing: (processing: boolean) => void
  setResearchSelectedNodes: (nodeIds: string[]) => void
  addResearchAnalysisResult: (result: Record<string, unknown>) => void
  clearResearchAnalysisResults: () => void
  pinResearchCard: (card: Omit<ResearchPinnedCard, 'pinnedAt' | 'position'> & {position?: {x: number, y: number}}) => void
  unpinResearchCard: (cardId: string) => void
  updateResearchCardNotes: (cardId: string, notes: string) => void
  setResearchCanvasNotes: (notes: string) => void
  resetResearchSession: () => void

  // Drop-to-canvas actions (T-060)
  setDropDragActive: (active: boolean, rejected?: boolean) => void
  beginDrop: (payload: {artifactNodeId: string; filename: string}) => void
  setDropStatus: (status: DropStatus) => void
  resolveDrop: () => void
  failDrop: (failure: DropFailure) => void
  clearDropFailure: () => void
  setInspectedMatchNodeId: (nodeId: string | null) => void
}

const INITIAL_DROP_STATE: DropState = {
  isDragActive: false,
  dragRejected: false,
  status: 'idle',
  pendingArtifactNodeId: null,
  pendingFilename: null,
  startedAt: null,
  failure: null,
  inspectedMatchNodeId: null,
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
      drop: INITIAL_DROP_STATE,
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

      // Research session initial state (T-027)
      researchSession: {
        sessionId: null,
        activeMode: null,
        isProcessing: false,
        selectedNodeIds: [],
        analysisResults: [],
        pinnedCards: [],
        canvasNotes: '',
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

      // Research session actions (T-027)
      initResearchSession: (sessionId) =>
        set({
          researchSession: {
            ...get().researchSession,
            sessionId:
              sessionId ??
              get().researchSession.sessionId ??
              `research-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          },
        }),
      setResearchMode: (mode) =>
        set({researchSession: {...get().researchSession, activeMode: mode}}),
      setResearchProcessing: (processing) =>
        set({researchSession: {...get().researchSession, isProcessing: processing}}),
      setResearchSelectedNodes: (nodeIds) =>
        set({researchSession: {...get().researchSession, selectedNodeIds: nodeIds}}),
      addResearchAnalysisResult: (result) =>
        set({
          researchSession: {
            ...get().researchSession,
            analysisResults: [...get().researchSession.analysisResults, result],
          },
        }),
      clearResearchAnalysisResults: () =>
        set({researchSession: {...get().researchSession, analysisResults: []}}),
      pinResearchCard: (card) => {
        const current = get().researchSession.pinnedCards
        const existingIndex = current.findIndex((c) => c.id === card.id)
        if (existingIndex >= 0) {
          set({
            researchSession: {
              ...get().researchSession,
              pinnedCards: current.map((c, i) =>
                i === existingIndex ? {...c, ...card, pinnedAt: c.pinnedAt, position: card.position ?? c.position} : c,
              ),
            },
          })
          return
        }
        const position = card.position ?? {
          x: (current.length % 3) * 320 + 20,
          y: Math.floor(current.length / 3) * 200 + 20,
        }
        set({
          researchSession: {
            ...get().researchSession,
            pinnedCards: [...current, {...card, pinnedAt: Date.now(), position}],
          },
        })
      },
      unpinResearchCard: (cardId) =>
        set({
          researchSession: {
            ...get().researchSession,
            pinnedCards: get().researchSession.pinnedCards.filter((c) => c.id !== cardId),
          },
        }),
      updateResearchCardNotes: (cardId, notes) =>
        set({
          researchSession: {
            ...get().researchSession,
            pinnedCards: get().researchSession.pinnedCards.map((c) =>
              c.id === cardId ? {...c, notes} : c,
            ),
          },
        }),
      setResearchCanvasNotes: (notes) =>
        set({researchSession: {...get().researchSession, canvasNotes: notes}}),
      resetResearchSession: () =>
        set({
          researchSession: {
            ...get().researchSession,
            activeMode: null,
            isProcessing: false,
            selectedNodeIds: [],
            analysisResults: [],
            pinnedCards: [],
            canvasNotes: '',
          },
        }),

      // --- Drop-to-canvas actions (T-060) ---
      setDropDragActive: (active, rejected = false) =>
        set({
          drop: {
            ...get().drop,
            isDragActive: active,
            dragRejected: active ? rejected : false,
          },
        }),
      beginDrop: ({artifactNodeId, filename}) =>
        set({
          drop: {
            ...get().drop,
            isDragActive: false,
            dragRejected: false,
            status: 'uploading',
            pendingArtifactNodeId: artifactNodeId,
            pendingFilename: filename,
            // Real wall-clock anchor. The elapsed readout is computed from
            // this, so it reports actual time, never a scripted progression.
            startedAt: Date.now(),
            failure: null,
          },
        }),
      setDropStatus: (status) => set({drop: {...get().drop, status}}),
      resolveDrop: () =>
        set({
          drop: {
            ...get().drop,
            status: 'resolved',
            pendingArtifactNodeId: null,
            pendingFilename: null,
            startedAt: null,
          },
        }),
      failDrop: (failure) =>
        set({
          drop: {
            ...get().drop,
            status: 'failed',
            pendingArtifactNodeId: null,
            pendingFilename: null,
            startedAt: null,
            failure,
          },
        }),
      clearDropFailure: () =>
        set({drop: {...get().drop, failure: null, status: 'idle'}}),
      setInspectedMatchNodeId: (nodeId) =>
        set({drop: {...get().drop, inspectedMatchNodeId: nodeId}}),
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
        researchSession: {
          sessionId: state.researchSession.sessionId,
          pinnedCards: state.researchSession.pinnedCards,
          canvasNotes: state.researchSession.canvasNotes,
        },
      }),
    }
  )
)
