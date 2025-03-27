'use client'
import {Panel, ReactFlow} from '@xyflow/react'

import {edgeTypes} from '@/features/mindmap/config/edge-types'

import {nodeTypes} from '@/features/mindmap/config/index.config'

import {MindMapAnimatedClickMenu, MindMapSideMenu} from '@/features/mindmap/components/menus'
import {MindMapBottomMenu} from '@/features/mindmap/components/menus/mindmap-bottom-menu'

import {useContextMenu} from '@/hooks/useContextMenu'
// import { useElkLayout } from '@/features/mindmap/layouts/algorithms/elk-layout'

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
// const {nodes: layoutNodes, edges: layoutEdges} = layoutElementsTreeFlex({}, 'root', 'TB')
import {CaseFilesAndEvidenceBoard} from '@/features/mindmap/components/status-ui/case-files-and-evidence-board'
import {GraphStatusLog} from '@/features/mindmap/components/status-ui/graph-status-log'
import {useMindMapStore} from '@/features/mindmap/store'

import {useRef} from 'react'
import {ThreadBoard} from '@/features/mindmap/components/status-ui/thread-board'

export function Graph(props: any) {
  // const { reactFlowInstance } = useMindMap();

  const {nodes, edges, setNodes, addEdge, onConnect, onNodesDelete, onNodesChange, onEdgesChange} =
    useMindMapStore()
  // React Flow instance for viewport controls (e.g., fitView)

  // Ref to keep track of the currently dragged node
  const draggingNode = useRef<any>(null)

  // Create a persistent simulation instance
  // const simulation = useMemo(() => {
  // 	return (
  // 		forceSimulation()
  // 			.force("charge", forceManyBody().strength(-1000))
  // 			.force("x", forceX().strength(0.05))
  // 			.force("y", forceY().strength(0.05))
  // 			// Note: The link force synchronizes node pairs based on edges.
  // 			.force(
  // 				"link",
  // 				forceLink(edges).id((d: any) => d.id),
  // 			)
  // 			// Custom collision detection force for non-circular nodes.
  // 			.force("collide", collide())
  // 			// Lower alphaTarget for smooth convergence.
  // 			.alphaTarget(0.05)
  // 			.stop()
  // 	);
  // }, [edges]);

  // Tick function: runs on every simulation step.
  // It updates node positions in the global state and adjusts the viewport.
  // const tick = () => {
  // 	// Update the nodes in the Zustand store with new positions.
  // 	setNodes(
  // 		simulation.nodes().map((node: any) => ({
  // 			...node,
  // 			position: { x: node.x, y: node.y },
  // 		})),
  // 	);
  // 	// Adjust viewport to fit updated node positions.
  // 	reactFlowInstance.fitView();
  // };

  // Initialize the simulation when nodes or edges update.
  // useEffect(() => {
  // 	simulation.nodes(nodes);
  // 	// Update the link force with the latest edges.
  // 	simulation.force(
  // 		"link",
  // 		forceLink(edges).id((d: any) => d.id),
  // 	);
  // 	// Set the tick listener.
  // 	simulation.on("tick", tick);
  // 	// Restart the simulation.
  // 	simulation.alpha(1).restart();

  // 	// Cleanup on unmount.
  // 	return () => {
  // 		simulation.stop();
  // 	};
  // }, [nodes, edges, simulation]);

  // const animateLayoutTransition = (newNodes: any) => {
  // 	// Freeze current positions
  // 	nodes.forEach((node) => {
  // 		node.fx = node.x;
  // 		node.fy = node.y;
  // 	});

  // 	// Start transition animation
  // 	simulation.current.alphaTarget(0.3).restart();

  // 	// Schedule final layout update
  // 	setTimeout(() => {
  // 		simulation.current.nodes(newNodes);
  // 		simulation.current.alphaTarget(0);
  // 		setNodes(newNodes);
  // 	}, 1000);
  // };

  const edgeOptions = {
    animated: true,
    style: {stroke: 'white'},
  }

  const {ref, clickPosition, isOpen, closeMenu} = useContextMenu()

  return (
    <div
      className='relative h-[100vh] w-[100vw] bg-black bg-repeat pointer-events-none'
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%3E%3Ccircle%20cx=%221%22%20cy=%221%22%20r=%221%22%20fill=%22%23ccc%22%20fill-opacity=%220.3%22/%3E%3C/svg%3E')",
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
        defaultViewport={{
          zoom: 0,
          x: 0,
          y: 0,
        }}
        style={{backgroundColor: 'transparent'}}>
        <Panel position='top-left'>
          <div className='ml-2 mt-2'>
            <MindMapSideMenu />
          </div>
        </Panel>

        <Panel position='top-right'>
          <ThreadBoard />
          <CaseFilesAndEvidenceBoard />
        </Panel>
        {/* <Panel position='bottom-left'>
          
        </Panel> */}

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
    </div>
  )
}
