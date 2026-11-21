'use client'
import {ReactFlow, type Edge, type Node, type OnSelectionChangeParams} from '@xyflow/react'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import {useSearchParams} from 'next/navigation'
import {Search, Plus} from 'lucide-react'

import {edgeTypes} from '@/features/mindmap/config/edge-types'

import {nodeTypes} from '@/features/mindmap/config/index.config'

import {FloatingToolbar} from '@/features/mindmap/research-canvas/FloatingToolbar'
import {
  TimelinePanel,
  type TimelineRequestPayload,
} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/TimelinePanel'
import {AssetLibraryPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/AssetLibraryPanel'
import {EmptyCanvas} from '@/features/mindmap/research-canvas/EmptyCanvas'
import {ActionChip} from '@/features/mindmap/research-canvas/ActionChip'

import {useContextMenu} from '@/hooks/useContextMenu'

import {useMindMapStore} from '@/features/mindmap/store'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {
  useMindMapAgent,
  type AgentGraphEdgePayload,
  type AgentGraphStatePayload,
} from '@/features/mindmap/hooks/use-mindmap-agent'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import {transformStreamResponse} from '@/features/mindmap/actions/xata-to-xyflow'
import {placeAgentNodeAboveAnswer} from '@/features/mindmap/layouts/place-agent-node'
import {
  findFreePosition,
  placeNodesAvoiding,
} from '@/features/mindmap/layouts/resolve-placement'
import {waitForStableMeasure} from '@/features/mindmap/layouts/wait-for-stable-measure'
import {extractTextFromFile} from '@/utils/file-processing'

import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {ResearchSuggestionsDock} from '@/features/mindmap/components/research-suggestions-dock'
import {TourOverlay} from '@/features/mindmap/tours/tour-overlay'
import {EvidenceTourOverlay} from '@/features/mindmap/tours/evidence-tour-overlay'
import {TourChips} from '@/features/mindmap/tours/tour-chips'
import {ActiveRecordChip} from '@/features/mindmap/research-canvas/active-record-chip'
import {useGuidedTourStore} from '@/features/mindmap/tours/guided-tour-store'
import {useEvidenceTour} from '@/features/mindmap/tours/use-evidence-tour'
import {useTourGraphProjection} from '@/features/mindmap/tours/use-tour-graph-projection'
import {matchTourFromInput, useTourLauncher} from '@/features/mindmap/tours/use-tour-launcher'
import ResearchCanvasConsole from '@/features/mindmap/research-canvas/research-canvas-console'
import {useCanvasDrop} from '@/features/mindmap/drop/use-canvas-drop'
import {
  CanvasDropAffordance,
  CanvasDropNotice,
} from '@/features/mindmap/drop/canvas-drop-layer'
import {DroppedMatchInspector} from '@/features/mindmap/drop/dropped-match-inspector'
import {isAcceptedMime} from '@/features/mindmap/drop/drop-contract'
import {
  dragCarriesDroppable,
  dragHasUrlType,
  parseDroppedUrl,
} from '@/features/mindmap/drop/parse-dropped-url'
import {parseStandaloneUrl} from '@/services/processing/drop/parse-url'
import '@/features/mindmap/research-canvas/canvas-animations.css'

const LAYOUT_DIRECTION_MAP: Record<string, 'horizontal' | 'vertical' | 'radial' | 'grid'> = {
  chronological: 'horizontal',
  thematic: 'radial',
  geographic: 'grid',
  hierarchical: 'vertical',
  'force-directed': 'radial',
}

const resolveLayoutDirection = (layoutId?: string | null) =>
  LAYOUT_DIRECTION_MAP[layoutId ?? 'chronological'] ?? 'horizontal'

const GRAPH_CONTEXT_NODE_LIMIT = 40
const GRAPH_CONTEXT_EDGE_LIMIT = 60
const AGENT_NODE_DEFAULT_TYPE = 'enhancedEntityNodePOC'
const AGENT_EDGE_DEFAULT_TYPE = 'siblingEdge'
// Streamed answer card at full height; used to pick a clear spot before it renders.
const ANSWER_FOOTPRINT = {width: 384, height: 600}

// Module scope: this object is structurally static, so recreating it every
// render (as an inline literal) defeats ReactFlow's prop-identity checks on
// `defaultEdgeOptions`.
const DEFAULT_EDGE_OPTIONS = {
  // Solid, not animated: a hand-drawn connection is a researcher assertion
  // (provenance rule — dashed is reserved for AI inference and tour paths,
  // which style themselves in SiblingEdge / ai-animated-edge).
  animated: false,
  // Parchment at reduced strength: edges read as pencil lines on the
  // dark table, not wires. Full white fought the nodes for attention.
  style: {stroke: 'oklch(0.93 0.015 90 / 0.45)', strokeWidth: 1.25},
}

const resolveNodeLabel = (node: Node): string => {
  const nodeData = node.data as Record<string, unknown> | undefined
  const labelCandidates = [nodeData?.label, nodeData?.title, nodeData?.name]

  for (const candidate of labelCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return node.id
}

const resolveNodeTable = (node: Node): string | undefined => {
  const nodeData = node.data as Record<string, unknown> | undefined
  if (typeof nodeData?.table === 'string') return nodeData.table
  if (typeof nodeData?.xata_table === 'string') return nodeData.xata_table
  return undefined
}

const createAgentEdgeId = (edge: AgentGraphEdgePayload, index: number): string => {
  const seed = `${edge.source}-${edge.target}-${edge.label || edge.reasoning || index}`
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')

  return `agent-edge-${seed}`
}

export function Graph() {
  // Get basic flow state from the store
  const {nodes, edges, onConnect, onNodesDelete, onNodesChange, onEdgesChange} = useMindMapStore()

  // Get layout function from the context
  const {
    organizeLayout,
    addNodes,
    addEdges,
    addNodesWithLayout,
    addUserInputNode,
    updateNodeData,
    getNodes,
    screenToFlowPosition,
    fitView,
  } = useMindMap()

  const {runAgentQuery, status: agentStatus, analysis, toolEvents} = useMindMapAgent()

  // --- Guided tours (T-050). Both engines render on THIS canvas: the spine
  // engine places resolved records, the evidence-graph engine projects its
  // waypoints/edges into the same node state via useTourGraphProjection.
  const {startTour, startTourById} = useTourLauncher()
  const evidenceTour = useEvidenceTour()
  useTourGraphProjection()

  // Deep link: /research-canvas?tour=nuclear-shadow (the old /tours/* route
  // redirects here). Fires once per mount; `resume=1` restores saved progress.
  const searchParams = useSearchParams()
  const deepLinkHandled = useRef(false)
  useEffect(() => {
    const handle = searchParams?.get('tour')
    if (!handle || deepLinkHandled.current) return
    deepLinkHandled.current = true
    void startTourById(handle, {resume: searchParams?.get('resume') === '1'})
  }, [searchParams, startTourById])

  const {
    autoLayout,
    layoutSettings,
    activeLayoutId,
    timeline,
    setTimelineYear,
    setTimelineEra,
    setTimelinePlaying,
    setTimelineSpeed,
    setCommandMenuOpen,
    addSessionEvent,
    hiddenNodeTypes,
  } = useMindMapUiStore()

  const layoutDirection = useMemo(() => resolveLayoutDirection(activeLayoutId), [activeLayoutId])

  const getCenteredPosition = useCallback(() => {
    if (typeof window === 'undefined') return {x: 0, y: 0}
    if (!screenToFlowPosition) return {x: 0, y: 0}
    // Anchor at 35% height, not dead center: the console cluster owns the
    // bottom of the screen and grows upward while the agent streams — a
    // center-placed node ends up underneath it on short viewports.
    return screenToFlowPosition({x: window.innerWidth / 2, y: window.innerHeight * 0.35})
  }, [screenToFlowPosition])

  const buildAgentGraphState = useCallback((): AgentGraphStatePayload => {
    const currentNodes = getNodes()
    // Read at send time so the agent sees the card selected right now.
    const activeNodeId = useMindMapUiStore.getState().canvas.activeNode?.id ?? null
    const recentNodes = currentNodes
      .filter((node) => node.type !== 'userInputNode')
      .slice(-GRAPH_CONTEXT_NODE_LIMIT)
    // The active card must always be resolvable, even when it is older than the window.
    const activeNode = activeNodeId ? currentNodes.find((node) => node.id === activeNodeId) : undefined
    const contextualNodes = (
      activeNode && !recentNodes.includes(activeNode) ? [activeNode, ...recentNodes] : recentNodes
    ).map((node) => ({
        id: node.id,
        type: node.type,
        label: resolveNodeLabel(node),
        table: resolveNodeTable(node),
      }))

    const contextualEdges = edges.slice(-GRAPH_CONTEXT_EDGE_LIMIT).map((edge) => {
      const edgeData = edge.data as Record<string, unknown> | undefined
      return {
        source: edge.source,
        target: edge.target,
        label: typeof edge.label === 'string' ? edge.label : undefined,
        reasoning: typeof edgeData?.reasoning === 'string' ? edgeData.reasoning : undefined,
      }
    })

    return {
      nodeCount: currentNodes.length,
      edgeCount: edges.length,
      activeNodeId,
      activeView: activeLayoutId,
      nodes: contextualNodes,
      edges: contextualEdges,
    }
  }, [activeLayoutId, edges, getNodes])

  const runAgentQueryAndAddNodes = useCallback(
    async ({message, table}: {message: string; table?: string}) => {
      const sourceNode = addUserInputNode({
        input: message,
        user: 'Prometheus',
        // The answer card grows while streaming; reserve its full footprint so
        // it never lands on a card already on the canvas.
        position: findFreePosition(getCenteredPosition(), ANSWER_FOOTPRINT, getNodes()),
      })
      updateNodeData(sourceNode.id, {label: message})

      addSessionEvent({type: 'query', label: 'Research query', detail: message})

      try {
        const agentResult = await runAgentQuery({
          message,
          contextRules: table
            ? `Prioritize ${table} entities when strong evidence is available.`
            : undefined,
          researchFocus: table ? `Investigate ${table} relationships for: ${message}` : message,
          graphState: buildAgentGraphState(),
        })
        const searchRecords = agentResult.search?.records ?? []
        const resolvedTable = table ?? agentResult.search?.table ?? 'events'
        const graphWrites = agentResult.graphWrites

        updateNodeData(sourceNode.id, {
          answer: agentResult.analysis,
          entities: searchRecords,
          table: resolvedTable,
        })

        const measuredSource = await waitForStableMeasure(getNodes, sourceNode.id)
        const existingNodes = getNodes()
        const knownNodeIds = new Set(existingNodes.map((node) => node.id))
        knownNodeIds.add(sourceNode.id)
        const knownEdgeIds = new Set(edges.map((edge) => edge.id))

        const basePosition =
          measuredSource?.position || sourceNode.position || getCenteredPosition()
        const sourceWidth = measuredSource?.measured?.width ?? 460

        const normalizedGraphNodes = (graphWrites?.nodes || [])
          .map((node, index): Node | null => {
            if (!node.id || knownNodeIds.has(node.id)) {
              return null
            }

            const label = node.label?.trim() || node.id
            const hasExplicitPosition =
              typeof node.position?.x === 'number' && typeof node.position?.y === 'number'
            const resolvedPosition = hasExplicitPosition
              ? {
                  x: node.position?.x as number,
                  y: node.position?.y as number,
                }
              : placeAgentNodeAboveAnswer(index, basePosition, sourceWidth)

            return {
              id: node.id,
              // The agent often sends React Flow's unstyled `default`; only keep
              // a type the canvas actually registers.
              type:
                node.type && node.type !== 'default' && node.type in nodeTypes
                  ? node.type
                  : AGENT_NODE_DEFAULT_TYPE,
              position: resolvedPosition,
              data: {
                ...(node.data || {}),
                // Archive ids are `rec_*`; anything else the agent named itself.
                provenance: node.id.startsWith('rec_') ? 'archive' : 'agent',
                label,
                title:
                  typeof node.data?.title === 'string' && node.data.title ? node.data.title : label,
              },
            }
          })
          .filter((node): node is Node => Boolean(node))

        if (normalizedGraphNodes.length) {
          addNodes(placeNodesAvoiding(normalizedGraphNodes, getNodes()))
          normalizedGraphNodes.forEach((node) => {
            knownNodeIds.add(node.id)
          })
        }

        const normalizedGraphEdges = (graphWrites?.edges || [])
          .map((edge, index): Edge | null => {
            if (!edge.source || !edge.target) {
              return null
            }

            const id = edge.id?.trim() || createAgentEdgeId(edge, index)
            if (knownEdgeIds.has(id)) {
              return null
            }

            if (!knownNodeIds.has(edge.source) || !knownNodeIds.has(edge.target)) {
              return null
            }

            const edgeLabel = edge.label || edge.reasoning
            return {
              id,
              source: edge.source,
              target: edge.target,
              type: edge.type || AGENT_EDGE_DEFAULT_TYPE,
              ...(edgeLabel ? {label: edgeLabel} : {}),
              data: {
                ...(edge.data || {}),
                ...(edge.reasoning ? {reasoning: edge.reasoning} : {}),
                ...(edge.label ? {label: edge.label} : {}),
              },
            }
          })
          .filter((edge): edge is Edge => Boolean(edge))

        if (normalizedGraphEdges.length) {
          addEdges(normalizedGraphEdges)
          normalizedGraphEdges.forEach((edge) => {
            knownEdgeIds.add(edge.id)
          })
        }

        if (!searchRecords.length && !normalizedGraphNodes.length && !normalizedGraphEdges.length) {
          return
        }

        if (searchRecords.length) {
          // `sourceNode` is the pre-render object with no `measured`; use the
          // live node once its size has settled (graph nodes were added above).
          await waitForStableMeasure(getNodes, sourceNode.id)
          const liveNodes = getNodes()
          const liveSourceNode = liveNodes.find((node) => node.id === sourceNode.id) ?? sourceNode
          const {nodes: newNodes, edges: newEdges} = await transformStreamResponse(
            agentResult.analysis ?? '',
            searchRecords,
            '',
            liveSourceNode,
            liveNodes,
            resolvedTable,
            layoutDirection
          )

          const filteredNodes = newNodes.filter((node) => !knownNodeIds.has(node.id))
          const filteredEdges = newEdges.filter((edge) => !knownEdgeIds.has(edge.id))

          if (filteredNodes.length) {
            addNodes(placeNodesAvoiding(filteredNodes, getNodes()))
            filteredNodes.forEach((node) => {
              knownNodeIds.add(node.id)
            })
          }

          if (filteredEdges.length) {
            addEdges(filteredEdges)
          }
        }

        const addedCount = getNodes().length - existingNodes.length
        if (addedCount > 0) {
          addSessionEvent({
            type: 'nodes_added',
            label: `Added ${addedCount} node${addedCount === 1 ? '' : 's'}`,
            detail: message,
          })
        }
        if (agentResult.analysis) {
          addSessionEvent({
            type: 'analysis',
            label: 'Analysis complete',
            detail: agentResult.analysis.slice(0, 140),
          })
        }

        setTimeout(() => {
          fitView({padding: 0.2})
        }, 200)
      } catch (error) {
        console.error('Mindmap agent query failed:', error)
        // Prefer the real reason from the agent stream (e.g. quota/billing,
        // rate limit) over a generic message so the user knows what to fix.
        const reason =
          error instanceof Error && error.message && !/^HTTP error/.test(error.message)
            ? error.message
            : 'Unable to fetch results right now. Please try again.'
        // Set error (not just answer) so the node leaves its loading state
        // and renders the failure explicitly.
        updateNodeData(sourceNode.id, {error: reason, answer: reason})
      }
    },
    [
      addEdges,
      addNodes,
      addSessionEvent,
      addUserInputNode,
      buildAgentGraphState,
      edges,
      fitView,
      getCenteredPosition,
      getNodes,
      layoutDirection,
      runAgentQuery,
      updateNodeData,
    ]
  )

  const handleTimelineRequest = useCallback(
    async ({year, era, dateRange}: TimelineRequestPayload) => {
      const dateLabel = dateRange ? `${dateRange.startYear}-${dateRange.endYear}` : `${year}`
      const eraLabel = era ? ` during the ${era} era` : ''
      const message = `Search the events table for notable UFO/UAP incidents${eraLabel} (${dateLabel}). Include witnesses, organizations, and documents connected to those events.`

      await runAgentQueryAndAddNodes({message, table: 'events'})
    },
    [runAgentQueryAndAddNodes]
  )

  const handleAssetAdded = useCallback(
    async (asset: {id: string; name: string; file?: File}) => {
      if (!asset.file) return
      try {
        const fileText = await extractTextFromFile(asset.file)
        const truncatedText = fileText.slice(0, 4000)
        const summaryResult = await runAgentQuery({
          message: `Summarize this document for a mindmap node. Focus on key entities, dates, and claims.\n\n${truncatedText}`,
          researchFocus: `Summarize uploaded document "${asset.name}" for canvas context`,
          graphState: buildAgentGraphState(),
        })
        const summary = summaryResult.analysis?.trim() || truncatedText.slice(0, 800)

        const newNode = {
          id: `document-${asset.id}`,
          type: 'documentNode',
          position: getCenteredPosition(),
          data: {
            title: asset.name,
            content: summary,
            fileName: asset.name,
          },
        }

        await addNodesWithLayout([newNode], {
          direction: 'grid',
          preserveExistingLayout: true,
          focusOnNewNodes: true,
        })

        setTimeout(() => {
          fitView({padding: 0.2})
        }, 200)
      } catch (error) {
        console.error('Asset summarization failed:', error)
      }
    },
    [addNodesWithLayout, buildAgentGraphState, fitView, getCenteredPosition, runAgentQuery]
  )

  const panels = useMemo(
    () => ({
      timeline: (
        <TimelinePanel
          year={timeline.year}
          era={timeline.era}
          isPlaying={timeline.isPlaying}
          playbackSpeed={timeline.speed}
          onYearChange={(value) => setTimelineYear(value)}
          onEraChange={(value) => setTimelineEra(value)}
          onTogglePlay={() => setTimelinePlaying(!timeline.isPlaying)}
          onPlaybackSpeedChange={(value) => setTimelineSpeed(value)}
          onRequestData={handleTimelineRequest}
        />
      ),
      assets: <AssetLibraryPanel onAssetAdded={handleAssetAdded} />,
    }),
    [
      handleAssetAdded,
      handleTimelineRequest,
      setTimelineEra,
      setTimelinePlaying,
      setTimelineSpeed,
      setTimelineYear,
      timeline.era,
      timeline.isPlaying,
      timeline.speed,
      timeline.year,
    ]
  )

  // --- Drop-to-Canvas (T-060) ---
  // Handlers live on the canvas wrapper div rather than on <ReactFlow>: the
  // wrapper spans the full viewport including the overlays, so a file
  // released over the console or the toolbar still lands on the canvas.
  //
  // These are HTML5 drag-and-drop events (dragenter/dragover/drop), which is
  // a different event stream from the pointer events React Flow uses for
  // panning, node dragging and selection — the two do not contend.
  const {handleFile, handleUrl} = useCanvasDrop()
  const handleFileSelected = useCallback(
    (file: File) => {
      void handleFile(file, {x: window.innerWidth / 2, y: window.innerHeight / 2})
    },
    [handleFile]
  )
  const setDropDragActive = useMindMapUiStore((s) => s.setDropDragActive)
  const setInspectedMatchNodeId = useMindMapUiStore((s) => s.setInspectedMatchNodeId)
  const setActiveNode = useMindMapUiStore((s) => s.setActiveNode)
  const setActiveNeighborIds = useMindMapUiStore((s) => s.setActiveNeighborIds)
  const activeNodeId = useMindMapUiStore((s) => s.canvas.activeNode?.id ?? null)

  // React Flow selection is the single source of truth: one selected card is
  // "active"; a pane click, Escape, box-select or removal clears it.
  const handleSelectionChange = useCallback(
    ({nodes: selectedNodes}: OnSelectionChangeParams) => {
      const next = selectedNodes.length === 1 ? selectedNodes[0] : null
      const currentId = useMindMapUiStore.getState().canvas.activeNode?.id ?? null
      if ((next?.id ?? null) !== currentId) setActiveNode(next)
    },
    [setActiveNode]
  )

  // A card's "Trace connections" lands here: run the agent anchored on that record.
  const recordAction = useMindMapUiStore((s) => s.canvas.recordAction)
  const clearRecordAction = useMindMapUiStore((s) => s.clearRecordAction)
  useEffect(() => {
    if (!recordAction) return
    clearRecordAction()
    const target = getNodes().find((node) => node.id === recordAction.nodeId)
    if (!target) return
    const title = resolveNodeLabel(target)
    void runAgentQueryAndAddNodes({
      message: `Trace what is documented around "${title}": connected people, events, documents, and where the accounts conflict.`,
    })
  }, [recordAction, clearRecordAction, getNodes, runAgentQueryAndAddNodes])

  // Neighbours of the active card, so connected records stay lit and the rest recede.
  useEffect(() => {
    if (!activeNodeId) {
      setActiveNeighborIds([])
      return
    }
    const ids = new Set<string>()
    for (const edge of edges) {
      if (edge.source === activeNodeId) ids.add(edge.target)
      if (edge.target === activeNodeId) ids.add(edge.source)
    }
    setActiveNeighborIds([...ids])
  }, [activeNodeId, edges, setActiveNeighborIds])
  // dragleave fires when the pointer crosses into a CHILD element, which
  // makes a naive show/hide flicker constantly. Counting enter/leave pairs
  // is the standard fix.
  const dragDepth = useRef(0)

  const handleCanvasDragEnter = useCallback(
    (event: React.DragEvent) => {
      const types = Array.from(event.dataTransfer?.types ?? [])
      if (!dragCarriesDroppable(types)) return
      event.preventDefault()
      dragDepth.current += 1
      // `dataTransfer.files` is EMPTY during drag (protected mode) — only
      // `items` exposes the type before release, so the rejection preview
      // has to read from there. A URL drag is never rejected in preview:
      // the payload is not readable until drop.
      const fileItem = Array.from(event.dataTransfer.items ?? []).find((item) => item.kind === 'file')
      const fileRejected = Boolean(fileItem?.type) && !isAcceptedMime(fileItem.type)
      const rejected = fileRejected && !dragHasUrlType(types)
      setDropDragActive(true, rejected)
    },
    [setDropDragActive]
  )

  const handleCanvasDragOver = useCallback((event: React.DragEvent) => {
    const types = Array.from(event.dataTransfer?.types ?? [])
    if (!dragCarriesDroppable(types)) return
    // Must preventDefault on EVERY dragover or the browser navigates away
    // to the dropped URL / file and the canvas is simply gone.
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleCanvasDragLeave = useCallback(
    (event: React.DragEvent) => {
      const types = Array.from(event.dataTransfer?.types ?? [])
      if (!dragCarriesDroppable(types)) return
      dragDepth.current = Math.max(0, dragDepth.current - 1)
      if (dragDepth.current === 0) setDropDragActive(false)
    },
    [setDropDragActive]
  )

  const handleCanvasDrop = useCallback(
    (event: React.DragEvent) => {
      const types = Array.from(event.dataTransfer?.types ?? [])
      if (!dragCarriesDroppable(types)) return
      event.preventDefault()
      dragDepth.current = 0
      setDropDragActive(false)

      const file = event.dataTransfer.files?.[0]
      const url = parseDroppedUrl(event.dataTransfer)
      const acceptedFile =
        file && file.size > 0 && isAcceptedMime(file.type, file.name) ? file : null

      if (acceptedFile) {
        void handleFile(acceptedFile, {x: event.clientX, y: event.clientY})
        return
      }
      if (url) {
        void handleUrl(url, {x: event.clientX, y: event.clientY})
        return
      }
      if (file) {
        void handleFile(file, {x: event.clientX, y: event.clientY})
      }
    },
    [handleFile, handleUrl, setDropDragActive]
  )

  // Clicking a tour waypoint is the tour's business; clicking a fan-out match
  // opens the drop inspector; clicking anything else closes it. Match nodes
  // are the only ones carrying `matchOfArtifact`.
  const {handleWaypointNodeClick} = evidenceTour
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (handleWaypointNodeClick(node)) return
      const isDropMatch = Boolean((node.data as Record<string, unknown>)?.matchOfArtifact)
      setInspectedMatchNodeId(isDropMatch ? node.id : null)
    },
    [handleWaypointNodeClick, setInspectedMatchNodeId]
  )

  const handleEmptyCanvasSubmit = useCallback(
    async (input: string) => {
      const url = parseStandaloneUrl(input)
      if (url) {
        void handleUrl(url, {x: window.innerWidth / 2, y: window.innerHeight / 2})
        return
      }
      const tour = matchTourFromInput(input)
      if (tour) {
        await startTour(tour)
        return
      }
      await runAgentQueryAndAddNodes({message: input})
    },
    [handleUrl, runAgentQueryAndAddNodes, startTour]
  )

  const handleSearchDatabase = useCallback(() => {
    setCommandMenuOpen(true)
  }, [setCommandMenuOpen])

  const handleAddNode = useCallback(() => {
    addUserInputNode({
      input: '',
      user: 'User',
      position: getCenteredPosition(),
    })
  }, [addUserInputNode, getCenteredPosition])

  // Automatically apply layout when nodes change. Never while an evidence
  // tour owns the canvas — its waypoints are laid out by the definition.
  const evidenceTourActive = evidenceTour.isActive
  // A tour owns the canvas; no record stays active underneath it.
  useEffect(() => {
    if (evidenceTourActive) setActiveNode(null)
  }, [evidenceTourActive, setActiveNode])
  useEffect(() => {
    if (!autoLayout || nodes.length === 0 || evidenceTourActive) return

    const timeoutId = setTimeout(() => {
      organizeLayout({
        direction: layoutDirection,
        centerChildren: true,
        parentChildSpacing: layoutSettings.nodeSpacing,
        siblingSpacing: layoutSettings.edgeLength,
        preserveExistingLayout: true,
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [
    autoLayout,
    evidenceTourActive,
    layoutDirection,
    layoutSettings.edgeLength,
    layoutSettings.nodeSpacing,
    nodes.length,
    organizeLayout,
  ])

  const {ref} = useContextMenu()

  const isEmpty = nodes.length === 0

  const tourStatus = useGuidedTourStore((s) => s.status)
  const tourWaypoints = useGuidedTourStore((s) => s.waypoints)
  const tourStepIndex = useGuidedTourStore((s) => s.stepIndex)
  const activeTourNodeId =
    tourStatus === 'running' ? (tourWaypoints[tourStepIndex]?.recordId ?? null) : null

  const visibleNodes = useMemo(() => {
    if (hiddenNodeTypes.length === 0 && !activeTourNodeId) return nodes
    return nodes.map((node) => {
      const nodeType = String((node.data as Record<string, unknown>)?.type ?? '')
      const hidden = hiddenNodeTypes.includes(nodeType)
      const isTourActive = node.id === activeTourNodeId
      if (!hidden && !isTourActive) return node
      return {
        ...node,
        ...(hidden ? {hidden: true} : {}),
        ...(isTourActive ? {className: 'ut-tour-active'} : {}),
      }
    })
  }, [nodes, hiddenNodeTypes, activeTourNodeId])

  // A tour (either engine) owns the bottom of the screen while it runs — the
  // console cluster and the notes drawer step aside for the narrative chrome.
  const spineTourOwnsCanvas = tourStatus !== 'idle' && tourStatus !== 'completed'
  const tourOwnsCanvas = spineTourOwnsCanvas || evidenceTourActive

  return (
    <div
      className={`ut-canvas absolute inset-0 z-0 overflow-hidden${
        evidenceTourActive ? ' ut-evidence-tour' : ''
      }`}
      data-active-record={activeNodeId ? 'true' : undefined}
      onDragEnter={handleCanvasDragEnter}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}>
      <ReactFlow
        ref={ref}
        colorMode='dark'
        className='ut-canvas-floor'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onNodeClick={handleNodeClick}
        onSelectionChange={handleSelectionChange}
        onMoveStart={evidenceTour.handleUserViewportInteraction}
        // While the tour choreographer flies the camera the pane must not
        // fight it; the reducer unlocks on arrival.
        panOnDrag={!evidenceTour.canvasLocked}
        zoomOnScroll={!evidenceTour.canvasLocked}
        zoomOnPinch={!evidenceTour.canvasLocked}
        elementsSelectable={!evidenceTour.canvasLocked}
        minZoom={0.2}
        connectionRadius={36}
        elevateNodesOnSelect={true}
        fitView
        defaultViewport={{
          zoom: 0,
          x: 0,
          y: 0,
        }}
      />

      <div className='ut-grain' aria-hidden />

      <TourOverlay />
      <EvidenceTourOverlay />

      {/* Drop-to-Canvas (T-060). The affordance is pointer-events:none and
          renders above the graph; the inspector and failure notice sit in
          the top-right stack, clear of the bottom console cluster. */}
      <CanvasDropAffordance />

      {/* right-20, not right-6: SessionNotes renders a `fixed right-0` 48px
          pull-tab (session-notes.tsx:166) that this stack would otherwise
          cover. z-30 keeps it under that tab's z-40 drawer. */}
      <div className='pointer-events-none absolute right-20 top-6 z-30 flex flex-col items-end gap-3'>
        <CanvasDropNotice />
        <DroppedMatchInspector />
      </div>

      {isEmpty ? (
        <>
          <div className='absolute inset-0 z-10 pointer-events-auto'>
            <EmptyCanvas
              onSubmit={handleEmptyCanvasSubmit}
              onFileSelected={handleFileSelected}
              chips={<TourChips onStart={(tour) => void startTour(tour)} />}
              agentStatus={agentStatus}
              agentAnalysis={analysis}
              agentToolEvents={toolEvents}
            />
          </div>
          <FloatingToolbar panels={panels} />
        </>
      ) : (
        <>
          <FloatingToolbar panels={panels} />

          {!evidenceTourActive && (
            <div className='absolute top-6 right-6 z-20'>
              <SessionNotes />
            </div>
          )}

          {!tourOwnsCanvas && (
            <div className='absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-4'>
              <ActiveRecordChip />
              <div className='flex items-center gap-2'>
                <TourChips onStart={(tour) => void startTour(tour)} />
                <ActionChip icon={<Search className='size-4' />} onClick={handleSearchDatabase}>
                  Search Database
                </ActionChip>
                <ActionChip icon={<Plus className='size-4' />} onClick={handleAddNode}>
                  Add Node
                </ActionChip>
              </div>

              <ResearchCanvasConsole
                variant='compact'
                onSubmit={handleEmptyCanvasSubmit}
                onFileSelected={handleFileSelected}
                agentStatus={agentStatus}
                agentAnalysis={analysis}
                agentToolEvents={toolEvents}
              />
            </div>
          )}

          {!evidenceTourActive && <ResearchSuggestionsDock />}
        </>
      )}
    </div>
  )
}
