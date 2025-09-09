'use client'
import {Panel, ReactFlow} from '@xyflow/react'
import {GitGraph} from 'lucide-react'

import {edgeTypes} from '@/features/mindmap/config/edge-types'

import {nodeTypes} from '@/features/mindmap/config/index.config'

import {MindMapAnimatedClickMenu, MindMapSideMenu} from '@/features/mindmap/components/menus'
import {MindMapBottomMenu} from '@/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu'

import {useContextMenu} from '@/hooks/useContextMenu'
// import { useElkLayout } from '@/features/mindmap/layouts/algorithms/elk-layout'

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
// const {nodes: layoutNodes, edges: layoutEdges} = layoutElementsTreeFlex({}, 'root', 'TB')
import {CaseFilesAndEvidenceBoard} from '@/features/mindmap/components/status-ui/case-files-and-evidence-board'
import {GraphStatusLog} from '@/features/mindmap/components/status-ui/graph-status-log'
import {useMindMapStore} from '@/features/mindmap/store'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'

import {useRef, useEffect} from 'react'
import {ThreadBoard} from '@/features/mindmap/components/status-ui/thread-board'
import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {ConnectedRecordsPanel} from '@/features/mindmap/components/connected-records-panel'

export function Graph(props: any) {
  // Get basic flow state from the store
  const {nodes, edges, setNodes, addEdge, onConnect, onNodesDelete, onNodesChange, onEdgesChange} =
    useMindMapStore()

  // Get layout function from the context
  const {organizeLayout} = useMindMap()

  // Ref to keep track of the currently dragged node
  const draggingNode = useRef<any>(null)

  // Automatically apply layout when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      // Apply layout with a small delay to ensure all node dimensions are available
      const timeoutId = setTimeout(() => {
        organizeLayout({
          direction: 'horizontal',
          centerChildren: true,
          parentChildSpacing: 120,
          siblingSpacing: 80,
          preserveExistingLayout: true,
        })
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [nodes.length, organizeLayout])

  const edgeOptions = {
    animated: true,
    style: {stroke: 'white'},
  }

  const {ref, clickPosition, isOpen, closeMenu} = useContextMenu()

  return (
    <div
      className='relative h-[100vh] w-[100vw] bg-black bg-repeat z-0'
      style={{
        backgroundImage:
          'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"%3E%3Cdefs%3E%3CradialGradient id="g" cx="14" cy="14" r="16" gradientUnits="userSpaceOnUse"%3E%3Cstop offset="0%25" stop-color="%23000000" stop-opacity="0.0"/%3E%3Cstop offset="100%25" stop-color="%23000000" stop-opacity="0.0"/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg fill="none" stroke="%23ffffff" stroke-opacity="0.08"%3E%3Cpath d="M0 14h28M14 0v28"/%3E%3C/g%3E%3C/svg%3E\')',
      }}>
      <ReactFlow
        ref={ref}
        colorMode='dark'
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // snapToGrid={true}
        defaultEdgeOptions={edgeOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        // connectionLineComponent={FloatingConnectionLine}
        elevateNodesOnSelect={true}
        fitView
        defaultViewport={{
          zoom: 0,
          x: 0,
          y: 0,
        }}
        style={{backgroundColor: 'transparent'}}>
        <Panel position='center-left'>
          <div className='ml-2 mt-2'>
            <MindMapSideMenu />
          </div>
        </Panel>

        <Panel position='top-right'>
          {/* <ThreadBoard /> */}
          {/* <CaseFilesAndEvidenceBoard /> */}
          <SessionNotes />
        </Panel>

        <MindMapAnimatedClickMenu
          isOpen={isOpen}
          clickPosition={clickPosition}
          closeMenu={closeMenu}
        />

        <Panel position='bottom-center'>
          <MindMapBottomMenu />
        </Panel>

        {/* bg-gradient-to-r from-black/50 to-transparent  */}
      </ReactFlow>

      {/* Connected Records Panel - Outside ReactFlow */}
      {nodes.some(
        (node) =>
          node.type &&
          node.type !== 'userInputNode' &&
          node.data &&
          (node.data.name || node.data.title || node.data.label)
      ) && <ConnectedRecordsPanel />}
    </div>
  )
}
