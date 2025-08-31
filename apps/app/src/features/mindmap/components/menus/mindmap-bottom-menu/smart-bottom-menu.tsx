'use client'

import {useEffect, useCallback, useState} from 'react'
import {useAssistantRuntime} from '@assistant-ui/react'
import {MindMapBottomMenu} from './mindmap-bottom-menu'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {COMMANDS} from './oracle-command-menu/commands'
import {ENTITY_TYPES} from './entity-types'
import {useChat} from '@ai-sdk/react'
import {useAIMindMap} from '@/features/mindmap/components/ai-integration'

/**
 * SmartBottomMenu - A wrapper component that adds AI capabilities to the mindmap bottom menu
 * by providing custom context and function calling to the Assistant UI runtime.
 */
export function SmartBottomMenu() {
  // Get the Assistant UI runtime
  const assistantRuntime = useAssistantRuntime()

  // Access MindMap context
  const {
    nodes,
    edges,
    activeNode,
    addUserInputNode,
    addNextEntitiesToMindMap,
    updateNodeData,
    getNodes,
    getNode,
    setNodes,
  } = useMindMap()

  // Track active command and model selection states to provide as context
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  // Get AI session status
  const sessionState = useChat({
    api: '/api/disclosure/chat',
  })

  // Add AI integration capabilities
  const {loadRecordsWithAI, isAIEnabled} = useAIMindMap()
  const {calculateCenterOfScreen, getNextId} = useMindMap()

  // Helper function to extract all available commands
  const getAvailableCommands = useCallback(() => {
    return COMMANDS.map((cmd) => ({
      id: cmd.id,
      label: cmd.label,
      description: cmd.description,
      prefix: cmd.prefix,
    }))
  }, [])

  // Helper function to extract all available entity types
  const getAvailableEntityTypes = useCallback(() => {
    return ENTITY_TYPES.map((entity) => ({
      type: entity.type,
      displayName: entity.displayName,
      description: entity.description,
    }))
  }, [])

  // Create AI functions for Assistant UI to interact with the menu
  const handleExecuteCommand = useCallback((commandId: string) => {
    const command = COMMANDS.find(
      (cmd) =>
        cmd.id.toLowerCase() === commandId.toLowerCase() ||
        cmd.label.toLowerCase() === commandId.toLowerCase()
    )

    if (command) {
      setActiveCommand(command.label.toLowerCase())
      return {
        success: true,
        message: `Activated ${command.label} command mode`,
      }
    }

    return {
      success: false,
      message: `Command "${commandId}" not found`,
    }
  }, [])

  // Implement AI-enhanced data loading
  const handleLoadDataWithAI = useCallback(
    async (type: string) => {
      // Get position for new node
      const center = calculateCenterOfScreen()

      // Create a user input node that will be the parent
      const userNode = {
        id: getNextId(),
        type: 'userInputNode',
        position: {...center},
        data: {
          label: `Loading ${type}`,
          input: `Finding and analyzing ${type} records...`,
          type: type,
          isLoading: true,
        },
      }

      // Add the new node
      const newNode = nodes.find((n) => n.id === userNode.id) || userNode
      if (!nodes.find((n) => n.id === userNode.id)) {
        setNodes((prevNodes) => [...prevNodes, newNode])
      }

      try {
        // Fetch entities (mock for now)
        const entities = await fetchEntities(type)

        if (entities && entities.length > 0) {
          // Use AI-enhanced loading if enabled
          await loadRecordsWithAI({
            entities,
            type,
            sourceNodeId: newNode.id,
          })
        } else {
          // Handle no entities
          const nodeIndex = nodes.findIndex((n) => n.id === newNode.id)
          if (nodeIndex >= 0) {
            const updatedNodes = [...nodes]
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              data: {
                ...updatedNodes[nodeIndex].data,
                label: `No ${type} Found`,
                input: `No ${type} records available to analyze`,
                isLoading: false,
                isError: true,
              },
            }
            setNodes(updatedNodes)
          }
        }
      } catch (error) {
        console.error(`Error loading ${type}:`, error)
        // Update node with error
        const nodeIndex = nodes.findIndex((n) => n.id === newNode.id)
        if (nodeIndex >= 0) {
          const updatedNodes = [...nodes]
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              label: `Error Loading ${type}`,
              input: error instanceof Error ? error.message : 'Unknown error occurred',
              isLoading: false,
              isError: true,
            },
          }
          setNodes(updatedNodes)
        }
      }
    },
    [calculateCenterOfScreen, getNextId, loadRecordsWithAI, nodes, setNodes]
  )

  // Mock function to fetch entities - replace with actual implementation
  const fetchEntities = async (type: string) => {
    // This would be replaced with a real API call to your database
    console.log(`Fetching ${type} entities...`)

    // Return mock data for now
    return Array.from({length: 5}, (_, i) => ({
      id: `${type}-${i}`,
      type: type,
      data: {
        label: `${type} ${i}`,
        title: `Example ${type} ${i}`,
        description: `This is an example ${type} for AI analysis`,
      },
    }))
  }

  // Enhance the handleSelectEntityType function to use AI loading
  const handleSelectEntityType = useCallback(
    (entityType: string) => {
      setSelectedModel(entityType)

      // If AI is enabled, use AI loading for this entity type
      if (isAIEnabled) {
        handleLoadDataWithAI(entityType)
      }
    },
    [isAIEnabled, handleLoadDataWithAI, setSelectedModel]
  )

  const handleCreateSearchNode = useCallback(
    (searchTerm: string, entityType?: string) => {
      // If entityType is provided, ensure it's valid or use the currently selected model
      const model = entityType
        ? ENTITY_TYPES.find((e) => e.type.toLowerCase() === entityType.toLowerCase())?.type
        : selectedModel

      if (!model) {
        return {
          success: false,
          message: 'No entity type selected. Please select an entity type first.',
        }
      }

      // Create a user input node with the search query
      const userNode = addUserInputNode({
        input: searchTerm,
        user: 'Assistant',
        data: {type: model},
      })

      // Load related entities for this node
      addNextEntitiesToMindMap(userNode)

      return {
        success: true,
        message: `Created search node for "${searchTerm}" with entity type ${model}`,
        nodeId: userNode.id,
      }
    },
    [selectedModel, addUserInputNode, addNextEntitiesToMindMap]
  )

  const handleAddInsightToNode = useCallback(
    (nodeId: string, insight: string) => {
      const node = getNode(nodeId)

      if (!node) {
        return {
          success: false,
          message: `Node with ID ${nodeId} not found`,
        }
      }

      // Add or update the insight property in the node data
      updateNodeData(nodeId, {
        ...node.data,
        aiInsight: insight,
      })

      return {
        success: true,
        message: `Added insight to node ${nodeId}`,
      }
    },
    [getNode, updateNodeData]
  )

  // Register these functions with Assistant UI
  useEffect(() => {
    // Register AI functions
    const unregisterFunctions = assistantRuntime.registerFunctions({
      executeCommand: handleExecuteCommand,
      selectEntityType: handleSelectEntityType,
      createSearchNode: handleCreateSearchNode,
      addInsightToNode: handleAddInsightToNode,
    })

    // Register model context provider
    const unregisterContext = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          # Mindmap Bottom Menu Context
          
          ## Current Interface State
          - Active command: ${activeCommand || 'None'}
          - Selected entity type: ${selectedModel || 'None'}
          - Chat status: ${sessionState.status}
          
          ## Available Commands
          ${getAvailableCommands()
            .map((cmd) => `- ${cmd.label}: ${cmd.description}`)
            .join('\n')}
          
          ## Available Entity Types
          ${getAvailableEntityTypes()
            .map((entity) => `- ${entity.displayName}: ${entity.description}`)
            .join('\n')}
          
          ## Graph Overview
          - Total nodes: ${nodes.length}
          - Total edges: ${edges.length}
          - Active node: ${activeNode ? activeNode.id : 'None'}
          
          ## Available Functions
          - executeCommand(commandId: string): Activates a command mode in the bottom menu
          - selectEntityType(entityType: string): Selects an entity type for exploration
          - createSearchNode(searchTerm: string, entityType?: string): Creates a search node in the graph
          - addInsightToNode(nodeId: string, insight: string): Adds AI insight to a specific node
          
          ## Usage Examples
          - When user asks for UFO sightings: Use selectEntityType("events") then createSearchNode("UFO sightings")
          - When user wants to chat: Use executeCommand("chat")
          - When user wants to analyze connections: Use executeCommand("analyze")
          
          The bottom menu is the primary interface for users to interact with the mindmap graph.
          Commands activate different modes (chat, search, analyze), and entity types determine
          what kind of data is being explored (events, personnel, testimonies, etc).
        `,
      }),
    })

    // Cleanup function to unregister both
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
    sessionState.status,
    getAvailableCommands,
    getAvailableEntityTypes,
    handleExecuteCommand,
    handleSelectEntityType,
    handleCreateSearchNode,
    handleAddInsightToNode,
  ])

  // Track command and model selection changes for context updates
  const handleCommandChange = useCallback((command: string | null) => {
    setActiveCommand(command)
  }, [])

  const handleModelChange = useCallback((model: string | null) => {
    setSelectedModel(model)
  }, [])

  // Return the wrapped component with change handlers to track state
  return (
    <MindMapBottomMenu onCommandChange={handleCommandChange} onModelChange={handleModelChange} />
  )
}
