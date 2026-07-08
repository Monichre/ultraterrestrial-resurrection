'use client'
import {ReactFlow, type Edge, type Node} from '@xyflow/react'
import {useCallback, useEffect, useMemo} from 'react'
import {Sparkles, Search, Plus} from 'lucide-react'

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
import {extractTextFromFile} from '@/utils/file-processing'

import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {ResearchSuggestionsDock} from '@/features/mindmap/components/research-suggestions-dock'
import {TourOverlay} from '@/features/mindmap/tours/tour-overlay'
import {useGuidedTour} from '@/features/mindmap/tours/use-guided-tour'
import {useGuidedTourStore} from '@/features/mindmap/tours/guided-tour-store'
import {FAMOUS_EVENTS_TOUR} from '@/features/mindmap/tours/famous-events-tour'
import ResearchCanvasConsole from '@/features/mindmap/research-canvas/research-canvas-console'
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
  const {startTour: startGuidedTour} = useGuidedTour()

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
    return screenToFlowPosition({x: window.innerWidth / 2, y: window.innerHeight / 2})
  }, [screenToFlowPosition])

  const buildAgentGraphState = useCallback((): AgentGraphStatePayload => {
    const currentNodes = getNodes()
    const contextualNodes = currentNodes
      .filter((node) => node.type !== 'userInputNode')
      .slice(-GRAPH_CONTEXT_NODE_LIMIT)
      .map((node) => ({
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
        position: getCenteredPosition(),
      })
      updateNodeData(sourceNode.id, {label: message})

      addSessionEvent({type: 'query', label: 'Research query', detail: message})

      try {
        const agentResult = await runAgentQuery({
          message,
          contextRules: table ? `Prioritize ${table} entities when strong evidence is available.` : undefined,
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

        const existingNodes = getNodes()
        const knownNodeIds = new Set(existingNodes.map((node) => node.id))
        knownNodeIds.add(sourceNode.id)
        const knownEdgeIds = new Set(edges.map((edge) => edge.id))

        const basePosition = sourceNode.position || getCenteredPosition()

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
              : {
                  x: basePosition.x + ((index % 4) - 1.5) * 260,
                  y: basePosition.y + (Math.floor(index / 4) + 1) * 180,
                }

            return {
              id: node.id,
              type: node.type || AGENT_NODE_DEFAULT_TYPE,
              position: resolvedPosition,
              data: {
                ...(node.data || {}),
                label,
                title:
                  typeof node.data?.title === 'string' && node.data.title
                    ? node.data.title
                    : label,
              },
            }
          })
          .filter((node): node is Node => Boolean(node))

        if (normalizedGraphNodes.length) {
          addNodes(normalizedGraphNodes)
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
          const {nodes: newNodes, edges: newEdges} = await transformStreamResponse(
            agentResult.analysis ?? '',
            searchRecords,
            '',
            sourceNode,
            existingNodes,
            resolvedTable,
            layoutDirection
          )

          const filteredNodes = newNodes.filter((node) => !knownNodeIds.has(node.id))
          const filteredEdges = newEdges.filter((edge) => !knownEdgeIds.has(edge.id))

          if (filteredNodes.length) {
            addNodes(filteredNodes)
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
        updateNodeData(sourceNode.id, {answer: reason})
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
      const dateLabel = dateRange
        ? `${dateRange.startYear}-${dateRange.endYear}`
        : `${year}`
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

  const handleEmptyCanvasSubmit = useCallback(
    async (input: string) => {
      await runAgentQueryAndAddNodes({message: input})
    },
    [runAgentQueryAndAddNodes]
  )

  const handleStartTour = useCallback(() => {
    void startGuidedTour(FAMOUS_EVENTS_TOUR)
  }, [startGuidedTour])

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

  // Automatically apply layout when nodes change
  useEffect(() => {
    if (!autoLayout || nodes.length === 0) return

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
  }, [autoLayout, layoutDirection, layoutSettings.edgeLength, layoutSettings.nodeSpacing, nodes.length, organizeLayout])

  const edgeOptions = {
    animated: true,
    // Parchment at reduced strength: edges read as pencil lines on the
    // dark table, not wires. Full white fought the nodes for attention.
    style: {stroke: 'oklch(0.93 0.015 90 / 0.45)', strokeWidth: 1.25},
  }

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

  return (
    <div className='ut-canvas relative z-0 h-dvh w-full overflow-hidden'>
      <ReactFlow
        ref={ref}
        colorMode='dark'
        className='ut-canvas-floor'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
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

      {isEmpty ? (
        <>
          <div className='absolute inset-0 z-10 pointer-events-auto'>
            <EmptyCanvas
              onSubmit={handleEmptyCanvasSubmit}
              agentStatus={agentStatus}
              agentAnalysis={analysis}
              agentToolEvents={toolEvents}
            />
          </div>
          <div className='absolute inset-x-0 bottom-6 z-20 flex justify-center'>
            <ActionChip icon={<Sparkles className='size-4' />} onClick={handleStartTour}>
              Take the guided tour
            </ActionChip>
          </div>
          <FloatingToolbar panels={panels} />
        </>
      ) : (
        <>
          <FloatingToolbar panels={panels} />

          <div className='absolute top-6 right-6 z-20'>
            <SessionNotes />
          </div>

          {/* Tour mode owns the bottom of the screen — hide the console
              cluster while a tour is resolving/running to keep focus on
              the narrative and the suggestion dock. */}
          {(tourStatus === 'idle' || tourStatus === 'completed') && (
            <div className='absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-4'>
              <div className='flex items-center gap-2'>
                <ActionChip icon={<Sparkles className='size-4' />} onClick={handleStartTour}>
                  Start Tour
                </ActionChip>
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
                agentStatus={agentStatus}
                agentAnalysis={analysis}
                agentToolEvents={toolEvents}
              />
            </div>
          )}

          <ResearchSuggestionsDock />
        </>
      )}
    </div>
  )
}
