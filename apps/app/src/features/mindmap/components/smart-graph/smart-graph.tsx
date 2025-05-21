'use client'

import { ReactNode, useEffect, useCallback } from 'react'
import { useAssistantRuntime } from '@assistant-ui/react'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { XYPosition } from '@xyflow/react'

/**
 * SmartGraph - A wrapper component that adds AI capabilities to the mindmap graph
 * by providing custom context to the Assistant UI runtime.
 */
export function SmartGraph({ children }: { children: ReactNode }) {
  // Get the mind map context
  const mindMapContext = useMindMap()
  
  // Get the nodes and edges from the mind map context
  const { 
    nodes, 
    edges, 
    activeNode, 
    addUserInputNode, 
    findConnections, 
    addNextEntitiesToMindMap,
    organizeLayout,
    updateNodeData,
    fitView,
    deleteNode
  } = mindMapContext
  
  // Get the Assistant UI runtime
  const assistantRuntime = useAssistantRuntime()

  // Define functions that can be called by the assistant
  const handleAddNote = useCallback((input: string, position?: XYPosition) => {
    // Default position to center of viewport if not provided
    const centerPosition = position || { x: 0, y: 0 }
    
    // Create a new user input node
    const newNode = addUserInputNode({
      input,
      user: 'Assistant',
      position: centerPosition
    })
    
    // Focus the view on the new node
    setTimeout(() => {
      fitView({ padding: 0.2, includeHiddenNodes: false })
    }, 100)
    
    return newNode
  }, [addUserInputNode, fitView])
  
  const handleFindConnections = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { success: false, message: 'Node not found' }
    
    const connections = findConnections(node)
    return { 
      success: true, 
      connections,
      message: `Found ${connections.length} connections for node ${nodeId}`
    }
  }, [nodes, findConnections])
  
  const handleLoadRelatedEntities = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { success: false, message: 'Node not found' }
    
    const result = await addNextEntitiesToMindMap(node)
    return { 
      success: !!result,
      message: result ? 'Successfully loaded related entities' : 'Failed to load related entities'
    }
  }, [nodes, addNextEntitiesToMindMap])
  
  const handleUpdateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { success: false, message: 'Node not found' }
    
    updateNodeData(nodeId, {
      ...node.data,
      label: newLabel
    })
    
    return { success: true, message: `Updated label for node ${nodeId}` }
  }, [nodes, updateNodeData])
  
  const handleDeleteNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { success: false, message: 'Node not found' }
    
    deleteNode(nodeId)
    return { success: true, message: `Deleted node ${nodeId}` }
  }, [nodes, deleteNode])
  
  const handleReorganizeLayout = useCallback((direction: 'horizontal' | 'vertical' | 'radial' = 'horizontal') => {
    organizeLayout({ 
      direction, 
      parentChildSpacing: 100,
      siblingSpacing: 50,
      centerChildren: true
    })
    
    return { success: true, message: `Applied ${direction} layout to the graph` }
  }, [organizeLayout])

  useEffect(() => {
    // Register AI functions
    const unregisterFunctions = assistantRuntime.registerFunctions({
      addNote: handleAddNote,
      findConnections: handleFindConnections,
      loadRelatedEntities: handleLoadRelatedEntities,
      updateNodeLabel: handleUpdateNodeLabel,
      deleteNode: handleDeleteNode,
      reorganizeLayout: handleReorganizeLayout
    })
    
    // Register a model context provider with the assistant runtime
    const unregisterContext = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          # Mindmap Graph Context
          
          ## Current Graph State
          - Total nodes: ${nodes.length}
          - Total edges: ${edges.length}
          - Active node: ${activeNode ? JSON.stringify({
              id: activeNode.id,
              type: activeNode.type,
              data: activeNode.data,
            }, null, 2) : 'None'}
          
          ## Visible Nodes
          ${nodes.slice(0, 5).map(node => `- ${node.id}: ${node.data.label || 'Unlabeled'} (${node.type})`).join('\n')}
          ${nodes.length > 5 ? `...and ${nodes.length - 5} more nodes` : ''}
          
          ## Available Node Types
          - entityNode: Regular entity node
          - rootNode: Root category node
          - entityGroupNode: Group of related entities
          - userInputNode: Node created from user input
          
          ## Available Functions
          - addNote(input: string, position?: {x: number, y: number}): Creates a new user input node
          - findConnections(nodeId: string): Finds and visualizes connections for a specific node
          - loadRelatedEntities(nodeId: string): Loads additional related entities for a node
          - updateNodeLabel(nodeId: string, newLabel: string): Updates the label of a node
          - deleteNode(nodeId: string): Removes a node from the graph
          - reorganizeLayout(direction: "horizontal" | "vertical" | "radial"): Rearranges the graph layout
          
          ## Current User Context
          The user is interacting with a mind map visualization of interconnected entities including:
          events, personnel, testimonies, topics, organizations, and documents.
          
          When the user asks about the graph, provide helpful information about the visible nodes and
          their connections. You can suggest operations like adding new connections, reorganizing the layout,
          or exploring related entities.
          
          Important: When suggesting actions, be specific. For example, if recommending to find connections,
          specify the node ID. If suggesting to reorganize the layout, specify the direction.
        `,
      }),
    })
    
    // Cleanup
    return () => {
      unregisterFunctions()
      unregisterContext()
    }
  }, [
    assistantRuntime, 
    nodes, 
    edges, 
    activeNode, 
    handleAddNote,
    handleFindConnections,
    handleLoadRelatedEntities,
    handleUpdateNodeLabel,
    handleDeleteNode,
    handleReorganizeLayout
  ])

  // Return the children components (Graph)
  return <>{children}</>
}