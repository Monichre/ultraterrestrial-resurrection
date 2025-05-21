'use client'

import React, { createContext, useContext, useEffect, useCallback, useState, ReactNode } from 'react'
import { useAssistantRuntime } from '@assistant-ui/react'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { XYPosition } from '@xyflow/react'
import { COMMANDS } from '../components/menus/mindmap-bottom-menu/oracle-command-menu/commands'
import { ENTITY_TYPES } from '../components/menus/mindmap-bottom-menu/entity-types'

// Define the shared context interface
interface SharedAIContextType {
  // State
  activeCommand: string | null
  selectedModel: string | null
  
  // Actions
  setActiveCommand: (command: string | null) => void
  setSelectedModel: (model: string | null) => void
  
  // Graph functions
  handleAddNote: (input: string, position?: XYPosition) => any
  handleFindConnections: (nodeId: string) => any
  handleLoadRelatedEntities: (nodeId: string) => Promise<any>
  handleUpdateNodeLabel: (nodeId: string, newLabel: string) => any
  handleDeleteNode: (nodeId: string) => any
  handleReorganizeLayout: (direction?: 'horizontal' | 'vertical' | 'radial') => any
  
  // Menu functions
  handleExecuteCommand: (commandId: string) => any
  handleSelectEntityType: (entityType: string) => any
  handleCreateSearchNode: (searchTerm: string, entityType?: string) => any
  handleAddInsightToNode: (nodeId: string, insight: string) => any
  
  // Helpers
  getAvailableCommands: () => any[]
  getAvailableEntityTypes: () => any[]
}

// Create the context
const SharedAIContext = createContext<SharedAIContextType | null>(null)

// Create the provider component
export function SharedAIProvider({ children }: { children: ReactNode }) {
  // Get the mind map context
  const mindMapContext = useMindMap()
  
  // Get necessary functions and state from mindMap context
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
    deleteNode,
    getNode,
    getNodes
  } = mindMapContext
  
  // Get the Assistant UI runtime
  const assistantRuntime = useAssistantRuntime()
  
  // Local state for active command and selected model
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  
  // Helper function to extract all available commands
  const getAvailableCommands = useCallback(() => {
    return COMMANDS.map(cmd => ({
      id: cmd.id,
      label: cmd.label,
      description: cmd.description,
      prefix: cmd.prefix
    }))
  }, [])
  
  // Helper function to extract all available entity types
  const getAvailableEntityTypes = useCallback(() => {
    return ENTITY_TYPES.map(entity => ({
      type: entity.type,
      displayName: entity.displayName,
      description: entity.description
    }))
  }, [])
  
  // Graph functions
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
  
  // Menu functions
  const handleExecuteCommand = useCallback((commandId: string) => {
    const command = COMMANDS.find(cmd => 
      cmd.id.toLowerCase() === commandId.toLowerCase() || 
      cmd.label.toLowerCase() === commandId.toLowerCase()
    )
    
    if (command) {
      setActiveCommand(command.label.toLowerCase())
      return { 
        success: true, 
        message: `Activated ${command.label} command mode` 
      }
    }
    
    return { 
      success: false, 
      message: `Command "${commandId}" not found` 
    }
  }, [])
  
  const handleSelectEntityType = useCallback((entityType: string) => {
    const entity = ENTITY_TYPES.find(e => 
      e.type.toLowerCase() === entityType.toLowerCase() || 
      e.displayName.toLowerCase() === entityType.toLowerCase()
    )
    
    if (entity) {
      setSelectedModel(entity.type)
      return { 
        success: true, 
        message: `Selected ${entity.displayName} entity type` 
      }
    }
    
    return { 
      success: false, 
      message: `Entity type "${entityType}" not found` 
    }
  }, [])
  
  const handleCreateSearchNode = useCallback((searchTerm: string, entityType?: string) => {
    // If entityType is provided, ensure it's valid or use the currently selected model
    const model = entityType ? 
      ENTITY_TYPES.find(e => e.type.toLowerCase() === entityType.toLowerCase())?.type :
      selectedModel
    
    if (!model) {
      return {
        success: false,
        message: 'No entity type selected. Please select an entity type first.'
      }
    }
    
    // Create a user input node with the search query
    const userNode = addUserInputNode({
      input: searchTerm,
      user: 'Assistant',
      data: { type: model }
    })
    
    // Load related entities for this node
    addNextEntitiesToMindMap(userNode)
    
    return {
      success: true,
      message: `Created search node for "${searchTerm}" with entity type ${model}`,
      nodeId: userNode.id
    }
  }, [selectedModel, addUserInputNode, addNextEntitiesToMindMap])
  
  const handleAddInsightToNode = useCallback((nodeId: string, insight: string) => {
    const node = getNode(nodeId)
    
    if (!node) {
      return {
        success: false,
        message: `Node with ID ${nodeId} not found`
      }
    }
    
    // Add or update the insight property in the node data
    updateNodeData(nodeId, {
      ...node.data,
      aiInsight: insight
    })
    
    return {
      success: true,
      message: `Added insight to node ${nodeId}`
    }
  }, [getNode, updateNodeData])
  
  // Register functions and context with Assistant UI
  useEffect(() => {
    // Register AI functions
    const unregisterFunctions = assistantRuntime.registerFunctions({
      // Graph functions
      addNote: handleAddNote,
      findConnections: handleFindConnections,
      loadRelatedEntities: handleLoadRelatedEntities,
      updateNodeLabel: handleUpdateNodeLabel,
      deleteNode: handleDeleteNode,
      reorganizeLayout: handleReorganizeLayout,
      
      // Menu functions
      executeCommand: handleExecuteCommand,
      selectEntityType: handleSelectEntityType,
      createSearchNode: handleCreateSearchNode,
      addInsightToNode: handleAddInsightToNode
    })
    
    // Register unified model context provider
    const unregisterContext = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          # Mindmap AI Assistant Context
          
          ## Current Interface State
          - Active command: ${activeCommand || 'None'}
          - Selected entity type: ${selectedModel || 'None'}
          
          ## Graph Overview
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
          
          ## Available Commands
          ${getAvailableCommands().map(cmd => `- ${cmd.label}: ${cmd.description}`).join('\n')}
          
          ## Available Entity Types
          ${getAvailableEntityTypes().map(entity => `- ${entity.displayName}: ${entity.description}`).join('\n')}
          
          ## Available Functions
          
          ### Graph Functions:
          - addNote(input: string, position?: {x: number, y: number}): Creates a new user input node
          - findConnections(nodeId: string): Finds and visualizes connections for a specific node
          - loadRelatedEntities(nodeId: string): Loads additional related entities for a node
          - updateNodeLabel(nodeId: string, newLabel: string): Updates the label of a node
          - deleteNode(nodeId: string): Removes a node from the graph
          - reorganizeLayout(direction: "horizontal" | "vertical" | "radial"): Rearranges the graph layout
          
          ### Menu Functions:
          - executeCommand(commandId: string): Activates a command mode in the bottom menu
          - selectEntityType(entityType: string): Selects an entity type for exploration
          - createSearchNode(searchTerm: string, entityType?: string): Creates a search node in the graph
          - addInsightToNode(nodeId: string, insight: string): Adds AI insight to a specific node
          
          ## Usage Examples
          - When user asks for UFO sightings: Use selectEntityType("events") then createSearchNode("UFO sightings")
          - When user wants to chat: Use executeCommand("chat")
          - When user wants to analyze connections: Use executeCommand("analyze")
          - When user wants to reorganize the graph: Use reorganizeLayout("horizontal")
          
          The mindmap is an interactive visualization of interconnected entities including:
          events, personnel, testimonies, topics, organizations, and documents.
          
          Important: When suggesting actions, be specific. For example, if recommending to find connections,
          specify the node ID. If suggesting to reorganize the layout, specify the direction.
        `,
      }),
    })
    
    // Cleanup function
    return () => {
      unregisterFunctions()
      unregisterContext()
    }
  }, [
    assistantRuntime,
    activeCommand,
    selectedModel,
    nodes,
    edges,
    activeNode,
    getAvailableCommands,
    getAvailableEntityTypes,
    handleAddNote,
    handleFindConnections,
    handleLoadRelatedEntities,
    handleUpdateNodeLabel,
    handleDeleteNode,
    handleReorganizeLayout,
    handleExecuteCommand,
    handleSelectEntityType,
    handleCreateSearchNode,
    handleAddInsightToNode
  ])
  
  // Create the context value
  const contextValue: SharedAIContextType = {
    // State
    activeCommand,
    selectedModel,
    
    // Actions
    setActiveCommand,
    setSelectedModel,
    
    // Graph functions
    handleAddNote,
    handleFindConnections,
    handleLoadRelatedEntities,
    handleUpdateNodeLabel,
    handleDeleteNode,
    handleReorganizeLayout,
    
    // Menu functions
    handleExecuteCommand,
    handleSelectEntityType,
    handleCreateSearchNode,
    handleAddInsightToNode,
    
    // Helpers
    getAvailableCommands,
    getAvailableEntityTypes
  }
  
  return (
    <SharedAIContext.Provider value={contextValue}>
      {children}
    </SharedAIContext.Provider>
  )
}

// Custom hook to access the context
export const useSharedAI = () => {
  const context = useContext(SharedAIContext)
  
  if (!context) {
    throw new Error('useSharedAI must be used within a SharedAIProvider')
  }
  
  return context
}