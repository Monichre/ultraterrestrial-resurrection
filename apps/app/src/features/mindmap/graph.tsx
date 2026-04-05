'use client'
import {ReactFlow} from '@xyflow/react'
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
import {useMindMapAgent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import {transformStreamResponse} from '@/features/mindmap/actions/xata-to-xyflow'
import {extractTextFromFile} from '@/utils/file-processing'

import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {ConnectedRecordsPanel} from '@/features/mindmap/components/connected-records-panel'
import ResearchCanvasConsole from '@/features/mindmap/research-canvas/research-canvas-console.tsx'

const LAYOUT_DIRECTION_MAP: Record<string, 'horizontal' | 'vertical' | 'radial' | 'grid'> = {
  chronological: 'horizontal',
  thematic: 'radial',
  geographic: 'grid',
  hierarchical: 'vertical',
  'force-directed': 'radial',
}

const resolveLayoutDirection = (layoutId?: string | null) =>
  LAYOUT_DIRECTION_MAP[layoutId ?? 'chronological'] ?? 'horizontal'

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

  const {
    autoLayout,
    layoutSettings,
    activeLayoutId,
    timeline,
    setTimelineYear,
    setTimelineEra,
    setTimelinePlaying,
    setTimelineSpeed,
    startTour,
    setCommandMenuOpen,
  } = useMindMapUiStore()

  const layoutDirection = useMemo(() => resolveLayoutDirection(activeLayoutId), [activeLayoutId])

  const getCenteredPosition = useCallback(() => {
    if (typeof window === 'undefined') return {x: 0, y: 0}
    if (!screenToFlowPosition) return {x: 0, y: 0}
    return screenToFlowPosition({x: window.innerWidth / 2, y: window.innerHeight / 2})
  }, [screenToFlowPosition])

  const runAgentQueryAndAddNodes = useCallback(
    async ({message, table}: {message: string; table?: string}) => {
      const sourceNode = addUserInputNode({
        input: message,
        user: 'Prometheus',
        position: getCenteredPosition(),
      })
      updateNodeData(sourceNode.id, {label: message})

      try {
        const agentResult = await runAgentQuery({message})
        const searchRecords = agentResult.search?.records ?? []
        const resolvedTable = table ?? agentResult.search?.table ?? 'events'

        updateNodeData(sourceNode.id, {
          answer: agentResult.analysis,
          entities: searchRecords,
          table: resolvedTable,
        })

        if (!searchRecords.length) return

        const existingNodes = getNodes()
        const {nodes: newNodes, edges: newEdges} = await transformStreamResponse(
          agentResult.analysis ?? '',
          searchRecords,
          '',
          sourceNode,
          existingNodes,
          resolvedTable,
          layoutDirection
        )

        const existingNodeIds = new Set(existingNodes.map((node) => node.id))
        const existingEdgeIds = new Set(edges.map((edge) => edge.id))
        const filteredNodes = newNodes.filter((node) => !existingNodeIds.has(node.id))
        const filteredEdges = newEdges.filter((edge) => !existingEdgeIds.has(edge.id))

        if (filteredNodes.length) addNodes(filteredNodes)
        if (filteredEdges.length) addEdges(filteredEdges)

        setTimeout(() => {
          fitView({padding: 0.2})
        }, 200)
      } catch (error) {
        console.error('Mindmap agent query failed:', error)
        updateNodeData(sourceNode.id, {
          answer: 'Unable to fetch results right now. Please try again.',
        })
      }
    },
    [
      addEdges,
      addNodes,
      addUserInputNode,
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
    [addNodesWithLayout, fitView, getCenteredPosition, runAgentQuery]
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
    startTour('default', 'guided')
  }, [startTour])

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
    style: {stroke: 'white'},
  }

  const {ref} = useContextMenu()

  const isEmpty = nodes.length === 0

  return (
    <div className='relative z-0 h-dvh w-full overflow-hidden'>
      <ReactFlow
        ref={ref}
        colorMode='dark'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        nodes={nodes}
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
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),        radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)     `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />

      {isEmpty ? (
        <div className='absolute inset-0 z-10 pointer-events-auto'>
          <EmptyCanvas
            onSubmit={handleEmptyCanvasSubmit}
            agentStatus={agentStatus}
            agentAnalysis={analysis}
            agentToolEvents={toolEvents}
          />
        </div>
      ) : (
        <>
          <FloatingToolbar panels={panels} />

          <div className='absolute top-6 right-6 z-20'>
            <SessionNotes />
          </div>

          <div className='absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-4'>
            {/* Action Chips */}
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
              onSubmit={handleEmptyCanvasSubmit}
              agentStatus={agentStatus}
              agentAnalysis={analysis}
              agentToolEvents={toolEvents}
            />
          </div>

          {nodes.some(
            (node) =>
              node.type &&
              node.type !== 'userInputNode' &&
              node.data &&
              (node.data.name || node.data.title || node.data.label)
          ) && <ConnectedRecordsPanel />}
        </>
      )}
    </div>
  )
}
