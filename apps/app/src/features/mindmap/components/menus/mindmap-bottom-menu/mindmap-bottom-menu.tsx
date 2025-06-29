import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {initiateDatabaseTableQuery} from '@/features/mindmap/actions/search'
import {DOMAIN_MODEL_COLORS, ICON_GREEN} from '@/utils/constants'
import {type Message as AISdkMessage, useAssistant} from '@ai-sdk/react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

import OracleInput from '@/features/mindmap/components/menus/mindmap-bottom-menu/oracle-input'
import {AlertCircle, Brain, FileSearch, Lightbulb, SearchIcon, XIcon} from 'lucide-react'
import {askAIAction, xataToXYFlow} from '@/features/mindmap/actions/xata-to-xyflow'
import {OracleCommandMenu, type CommandItem} from './oracle-command-menu/OracleCommandMenu'
import {UltraterrestrialModelSelection, type ModelAction} from './UltraterrestrialModelSelection'
import {ENTITY_TYPES} from '@/features/mindmap/components/menus/mindmap-bottom-menu/entity-types'
import {COMMANDS} from '@/features/mindmap/components/menus/mindmap-bottom-menu/oracle-command-menu/commands'
import {MindMapMessages, convertAiSdkMessage, type Message} from './MindMapMessages'
import {SessionNotesProvider, useSessionNotes} from '@/contexts/mindmap/session-notes-context'
import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'
import {
  getGraphContext,
  isRecordRelated,
  generateContextualSearchRules,
} from '@/features/mindmap/utils/contextual-intelligence'
import {
  createEnhancedUserInputNode,
  createEnhancedEntityNode,
  getNodeType,
} from '@/features/mindmap/utils/node-enhancement-utils'

// Define explicit types for our entities and nodes
export interface MindMapNode {
  id: string
  type: string
  position: {x: number; y: number}
  data: Record<string, unknown>
  parentId?: string
}

export interface SearchParams {
  type: string
  searchTerm: string
}

// Unified entity definitions for use across multiple components

// Define interface for ReactFlowNode to use in type casting
interface ReactFlowNode {
  id: string
  type: string
  position: {x: number; y: number}
  data: Record<string, unknown>
  parentId?: string
  // Add any other properties that might be needed
}

// Helper to load chat messages from localStorage
const loadMessagesFromLocalStorage = () => {
  if (typeof window === 'undefined') return []

  try {
    const savedMessages = localStorage.getItem('chatMessages')
    return savedMessages ? JSON.parse(savedMessages) : []
  } catch (error) {
    console.error('Error loading chat messages from localStorage:', error)
    return []
  }
}

// Create a message wrapper component that uses the SessionNotes context
const MessagesWithNotesSaving = ({messages}: {messages: AISdkMessage[]}) => {
  const {addNoteFromMessage} = useSessionNotes()

  // Convert AI SDK messages to our internal format
  const convertedMessages = messages.map((msg) => convertAiSdkMessage(msg))

  return <MindMapMessages messages={convertedMessages} onSaveAsNote={addNoteFromMessage} />
}

export interface MindMapBottomMenuProps {
  onCommandChange?: (command: string | null) => void
  onModelChange?: (model: string | null) => void
}

export const MindMapBottomMenu = ({
  onCommandChange,
  onModelChange,
}: MindMapBottomMenuProps = {}) => {
  // Get session ID for the current user/session
  const sessionId = useRef<string>(
    typeof window !== 'undefined' ? localStorage.getItem('sessionId') || uuidv4() : uuidv4()
  )

  // Store session ID in localStorage if it's new
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', sessionId.current)
    }
  }, [])

  const {
    status: chatStatus,
    messages,
    input,
    setInput,
    submitMessage,
    handleInputChange,
    append,
    error,
  } = useAssistant({
    api: '/api/disclosure/chat',
    headers: {
      'x-session-id': sessionId.current,
    },
  })

  console.log('🚀 ~ MindMapBottomMenu ~ input:', input)

  // Keep inputValue in sync with useAssistant input, but avoid infinite loops
  useEffect(() => {
    setInputValue(input)
  }, [input])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Handle assistant errors
  useEffect(() => {
    if (error) {
      console.error('Assistant error:', error)
      // Display error to user - could use a toast library here
    }
  }, [error])

  const {
    addNextEntitiesToMindMap,
    loadNodesFromTableQuery,
    addConnectionNodesFromSearch,
    addUserInputNode,
    addNodes,
    updateNodeData,
    addEdges,
    screenToFlowPosition,
    retrieveEntitiesFromStore,

    setEdges,
    setNodes,
    getNodes,
    addNode,

    getNode,
  } = useMindMap()

  const idCounter = useRef(0)
  const getNextId = useCallback(() => {
    idCounter.current += 1
    return `userInputNode-${idCounter.current}`
  }, [])

  const calculateCenterOfScreen = useCallback(() => {
    return {x: window.innerWidth / 2, y: window.innerHeight / 2}
  }, [])

  /**
   * Computes the positions for child nodes based on the parent's position.
   * - Retrieves the parent's width and height from the DOM.
   * - Calculates the total width needed for the children (using fixed node width and spacing).
   * - Determines the starting x-coordinate so that the children are centered below the parent.
   */
  const computeChildPositions = useCallback((parentNode: MindMapNode, numberOfChildren: number) => {
    console.log('🚀 ~ computeChildPositions ~ parentNode:', parentNode)

    // NOTE: We dont need to use the DOM position of the parent node as the chld nodes will be positioned relatively to the parent by default (bc of the parentId prop)

    const parentRect = document
      .querySelector(`[data-id="${parentNode.id}"]`)
      ?.getBoundingClientRect()

    console.log('🚀 ~ computeChildPositions ~ parentRect:', parentRect)

    const parentWidth = parentRect?.width || 250
    const parentHeight = parentRect?.height || 100

    const entityWidth = 250 // Default width for each child node
    const entitySpacing = 100 // Space between child nodes
    const totalWidth = numberOfChildren * entityWidth + (numberOfChildren - 1) * entitySpacing

    // Parent's center is its left position plus half its width
    const parentCenterX = parentWidth / 2
    // Start so that the children (as a group) are centered below the parent's center
    const startX = 0 - totalWidth / 2

    const verticalSpacing = 200 // Vertical offset from the bottom of the parent
    const childY = parentHeight + verticalSpacing

    return {startX, childY, entityWidth, entitySpacing}
  }, [])

  // Check if a node with similar content already exists on the graph
  const nodeExists = useCallback(
    (id: string, type: string) => {
      const existingNodes = getNodes()
      return existingNodes.some(
        (node) =>
          // Check by ID
          node.id === id ||
          // Check by type and content similarity
          (node.type === `${type}Node` && node.data?.id === id)
      )
    },
    [getNodes]
  )

  // Enhanced search function with duplicate prevention and contextual filtering
  const runSearch = useCallback(
    async ({type, searchTerm}: SearchParams) => {
      if (!type || !searchTerm.trim()) return // Skip empty searches

      // First check if we already have search results for this term
      const existingNodes = getNodes()
      const searchNodeExists = existingNodes.some(
        (node) => node.type === 'userInputNode' && node.data?.input === searchTerm
      )

      if (searchNodeExists) {
        console.log(`Search for "${searchTerm}" already exists on the graph`)
        return // Skip duplicate searches
      }

      // Get graph context for intelligent filtering
      const graphContext = getGraphContext(existingNodes)

      // Create enhanced user input node with contextual awareness
      const userNode = createEnhancedUserInputNode(
        uuidv4(),
        searchTerm,
        {x: 0, y: 0},
        existingNodes,
        type
      )
      addNodes(userNode)

      const response = await initiateDatabaseTableQuery({
        table: type,
        keyword: searchTerm,
      })

      if (response && 'suggestedSearchResult' in response) {
        const {
          suggestedSearchResult: {record},
          relatedResults,
          totalCount,
        } = response
        console.log('🚀 ~ runSearch ~ response:', response)
        console.log('🚀 ~ runSearch ~ record:', record)
        console.log('🚀 ~ runSearch ~ relatedResults:', relatedResults)
        console.log('🚀 ~ runSearch ~ totalCount:', totalCount)

        // Collect all valid results (main record + related results)
        const allResults = []
        if (record?.id && !nodeExists(record.id, type)) {
          allResults.push(record)
        }
        if (relatedResults && Array.isArray(relatedResults)) {
          const validRelated = relatedResults.filter(
            (result) => result?.id && !nodeExists(result.id, type)
          )
          allResults.push(...validRelated)
        }

        if (allResults.length === 0) {
          updateNodeData(userNode.id, {
            input: `No new results found for "${searchTerm}" in ${type}`,
          })
          return
        }

        // Create entity nodes positioned around the user node
        const radius = 250
        const angleStep = (2 * Math.PI) / allResults.length

        const entityNodes = allResults.map((result, index) => {
          const angle = index * angleStep
          const x = userNode.position.x + radius * Math.cos(angle)
          const y = userNode.position.y + radius * Math.sin(angle)

          // Create enhanced entity node while preserving calculated position
          const enhancedNode = createEnhancedEntityNode(
            result.id,
            {
              type,
              ...result,
            },
            {x, y}, // Use the calculated position from the radius layout
            existingNodes
          )

          return {
            ...enhancedNode,
            position: {x, y}, // Ensure the calculated position is preserved
          }
        })

        // Create edges connecting user node to entity nodes
        const entityEdges = entityNodes.map((entityNode) => {
          const edgeId = `${userNode.id}-${entityNode.id}`
          return {
            id: edgeId,
            source: userNode.id,
            target: entityNode.id,
            animated: true,
            type: 'smoothstep', // Use a valid edge type
            label: `Search result for ${searchTerm}`,
            style: {
              stroke: DOMAIN_MODEL_COLORS[type] || '#fff',
            },
          }
        })

        // Update user node with summary
        updateNodeData(userNode.id, {
          input: `Found ${allResults.length} results for "${searchTerm}" in ${type}`,
        })

        // Add entity nodes and edges to the graph
        addNodes(entityNodes)
        addEdges(entityEdges)
      }
    },
    [addNodes, addEdges, updateNodeData, getNodes, nodeExists]
  )

  // Define proper types for nodes and responses
  type MindMapNodeData = {
    type: string
    id: string
    [key: string]: unknown
  }

  interface XataResponseRecord {
    id: string
    [key: string]: unknown
  }

  // Modified data loading with duplicate prevention
  const handleLoadingRecords = useCallback(
    async ({data: {type}}: {data: {type: string}}) => {
      console.log('🚀 ~ MindMapBottomMenu ~ type:', type)

      const amount = 3
      const center = screenToFlowPosition(calculateCenterOfScreen())

      // Check if we already have a similar query
      const existingNodes = getNodes()

      // Get graph context for intelligent filtering
      const graphContext = getGraphContext(existingNodes)

      // Adjust query based on context
      let query: string
      let contextualRules: string = ''

      if (graphContext) {
        // We have existing context - use contextual filtering
        contextualRules = generateContextualSearchRules(graphContext)
        query = `Find ${amount} ${type} records that are related to the existing graph context. ${contextualRules}`

        // Check if similar contextual query exists
        const similarNodeExists = existingNodes.some(
          (node) =>
            node.type === 'userInputNode' &&
            node.data?.question?.includes('related to the existing graph context')
        )

        if (similarNodeExists) {
          console.log(`Similar contextual ${type} exploration already exists`)
          return
        }
      } else {
        // First record - open exploration
        query = `Give me the top ${amount} of interesting ${type} records`
        const similarNodeExists = existingNodes.some(
          (node) => node.type === 'userInputNode' && node.data?.question === query
        )

        if (similarNodeExists) {
          console.log(`Similar ${type} exploration already exists on the graph`)
          return
        }
      }

      // Create enhanced user input node with contextual awareness
      const potentialUserNode = createEnhancedUserInputNode(
        getNextId(),
        graphContext
          ? `Finding ${amount} related ${type} to expand your knowledge graph`
          : `Beginning your exploration by loading ${amount} ${type}`,
        {...center},
        existingNodes,
        type
      )

      // Add the user node to the graph
      addNode(potentialUserNode)

      try {
        // Choose layout type based on content type
        let layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid' = 'horizontal'

        // Customize layout based on entity type for optimal visualization
        switch (type) {
          case 'events':
            layoutType = 'horizontal'
            break
          case 'personnel':
          case 'organizations':
            layoutType = 'radial'
            break
          case 'testimonies':
            layoutType = 'vertical'
            break
          case 'documents':
          case 'artifacts':
            layoutType = 'grid'
            break
          default:
            layoutType = 'horizontal'
        }

        // Use 'unknown' first before casting to the expected type
        const flowData = await xataToXYFlow({
          question: query,
          table: type,
          rules: graphContext
            ? contextualRules
            : `Find the most interesting ${type} records that have clear relationships between them`,
          context: graphContext
            ? `The user is building a connected graph starting from ${graphContext.seedRecord?.data?.title || graphContext.seedRecord?.data?.name || 'their initial exploration'}. Focus on records that relate to or extend the existing narrative.`
            : `The user is exploring records in the ${type} database`,
          existingNodes: existingNodes as unknown as ReactFlowNode[],
          sourceNode: potentialUserNode,
          layoutType, // Pass the selected layout type
        })

        console.log('🚀 ~ handleLoadingRecords ~ flowData:', flowData)
        console.log('🚀 ~ handleLoadingRecords ~ flowData.nodes:', flowData.nodes)

        // Filter out any nodes that already exist in the graph and exclude the query result node
        if (flowData.nodes && flowData.nodes.length > 0) {
          const entityNodes = flowData.nodes.filter(
            (node) =>
              node.id !== 'query-result-node' && // Exclude query result node
              node.id !== potentialUserNode.id && // Exclude the user input node
              !nodeExists(node.id, node.type) // Exclude already existing nodes
          )

          console.log('🚀 ~ handleLoadingRecords ~ entityNodes after filtering:', entityNodes)
          console.log('🚀 ~ handleLoadingRecords ~ entityNodes.length:', entityNodes.length)

          if (entityNodes.length > 0) {
            // Create proper entity nodes with correct positioning
            const radius = 300
            const angleStep = (2 * Math.PI) / entityNodes.length

            const positionedEntityNodes = entityNodes.map((node, index) => {
              const angle = index * angleStep
              const x = potentialUserNode.position.x + radius * Math.cos(angle)
              const y = potentialUserNode.position.y + radius * Math.sin(angle)

              return {
                ...node,
                type: 'enhancedEntityNodePOC', // Use enhanced node type like search results
                position: {x, y},
                data: {
                  ...node.data,
                  type: type, // Ensure type is set for entity rendering
                },
              }
            })

            // Create edges connecting user input node to entity nodes
            const entityEdges = positionedEntityNodes.map((entityNode) => {
              const edgeId = `${potentialUserNode.id}-${entityNode.id}`
              return {
                id: edgeId,
                source: potentialUserNode.id,
                target: entityNode.id,
                animated: true,
                type: 'smoothstep', // Use a valid edge type
                label: `${type} result`,
                style: {
                  stroke: DOMAIN_MODEL_COLORS[type] || '#fff',
                },
              }
            })

            // Update user input node with summary
            updateNodeData(potentialUserNode.id, {
              input: `Found ${entityNodes.length} ${type} records`,
              answer:
                flowData.xataResponse?.answer ||
                `Successfully loaded ${entityNodes.length} ${type} records`,
            })

            // Add the entity nodes and edges to the graph
            addNodes(positionedEntityNodes)
            addEdges(entityEdges)

            // Also add any additional edges from flowData if they connect our nodes
            if (flowData.edges && flowData.edges.length > 0) {
              const relevantEdges = flowData.edges.filter((edge) =>
                positionedEntityNodes.some(
                  (node) => node.id === edge.source || node.id === edge.target
                )
              )
              if (relevantEdges.length > 0) {
                addEdges(relevantEdges)
              }
            }
          } else {
            // No new nodes to add
            updateNodeData(potentialUserNode.id, {
              input: `No new ${type} data found. All relevant records are already on the graph.`,
            })
          }
        } else if (flowData.xataResponse?.records?.length === 0) {
          // No data found
          updateNodeData(potentialUserNode.id, {
            input: `No ${type} data found.`,
          })
        } else {
          // Error occurred
          updateNodeData(potentialUserNode.id, {
            input: `Error loading ${type} data.`,
          })
        }
      } catch (error) {
        console.error('Error loading data for mind map:', error)
        // Update user node to show error
        updateNodeData(potentialUserNode.id, {
          input: `Error loading ${type} data: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        })
      }
    },
    [
      screenToFlowPosition,
      calculateCenterOfScreen,
      getNextId,
      addNode,
      addNodes,
      addEdges,
      updateNodeData,
      getNodes,
      nodeExists,
    ]
  )

  const modelSearchActions: ModelAction[] = ENTITY_TYPES.map((entity) => ({
    icon: entity.icon(),
    label: `Add ${entity.displayName}`,
    name: entity.displayName,
    type: entity.type,
    description: entity.description,
    searchAction: async (searchTerm: string) => {
      await runSearch({type: entity.type, searchTerm})
    },
  }))

  const addDataToMindMap = useCallback(
    (model: string) => {
      console.log('🚀 ~ addDataToMindMap ~ model:', model)

      handleLoadingRecords({data: {type: model}})
    },
    [handleLoadingRecords]
  )

  const menuRef = useRef<HTMLDivElement>(null)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false)

  const toggleDeepResearch = () => {
    setDeepResearchEnabled(!deepResearchEnabled)
  }

  const updateSelectedModel = (model: string) => {
    setSelectedModel(model)
    // Notify parent component about model change
    if (onModelChange) {
      onModelChange(model)
    }
  }

  const closeModelMenu = () => {
    setModelMenuOpen(false)
  }
  const toggleModelMenu = useCallback(() => {
    setModelMenuOpen(!modelMenuOpen)
  }, [modelMenuOpen])

  // Define a proper type for search results
  interface SearchResult {
    records?: XataResponseRecord[]
    answer?: string
    sessionId?: string
  }

  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)

  const removeActiveCommand = () => {
    setActiveCommand(null)
    setCommandMenuOpen(false)

    // Notify parent component about command change
    if (onCommandChange) {
      onCommandChange(null)
    }
  }

  // Higher-level delegation function to route actions based on active command
  const handleOracleAction = useCallback(() => {
    if (activeCommand === 'chat' || activeCommand === 'deepresearch') {
      // Handle chat submission
      if (inputValue.trim()) {
        // Use submitMessage for proper form submission
        const formData = new FormData()
        formData.append('message', inputValue)
        submitMessage({preventDefault: () => {}} as React.FormEvent<HTMLFormElement>)
        // Clear input immediately after submission
        setInput('')
        setInputValue('')
      }
    } else if (activeCommand === 'search' || (inputValue.trim() && selectedModel)) {
      // Default to search if there's input and model selected, even without explicit search command
      if (inputValue.trim() && selectedModel) {
        // Run search action with the current model and input value
        askAIAction({
          question: inputValue,
          table: selectedModel,
        }).then((results) => {
          setSearchResults(results)
        })

        // Also create a visual representation in the mindmap
        runSearch({
          type: selectedModel,
          searchTerm: inputValue,
        })

        setInputValue('')
        setInput('')
      }
    } else if (selectedModel) {
      console.log('🚀 ~ handleOracleAction ~ selectedModel:', selectedModel)

      // Only if there's no input but a model is selected, add data to mindmap
      addDataToMindMap(selectedModel)
    }
  }, [
    activeCommand,
    inputValue,
    selectedModel,
    submitMessage,
    setInput,
    runSearch,
    addDataToMindMap,
  ])

  // Define our expected search parameters interface
  interface InitiateQueryParams {
    table: string
    keyword: string
  }

  // Define the expected results interface
  interface QueryResults {
    records: XataResponseRecord[]
    searchTerm: string
    type: string
  }
  console.log({activeCommand, inputValue})

  // Modify the handleKeyDown function to dispatch a form submit event for chat
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      console.log('🚀 ~ handleKeyDown ~ key:', e.key)
      console.log('🚀 ~ handleKeyDown ~ activeCommand:', activeCommand)
      console.log('🚀 ~ handleKeyDown ~ inputValue:', inputValue)

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        // Prevent submission if chat is loading
        if (chatStatus === 'in_progress' || chatStatus === 'generating') {
          console.log('Chat is currently processing, skipping submission')
          return
        }

        // If we have an active chat command and input, handle it
        if (
          (activeCommand === 'chat' ||
            activeCommand === 'deep research' ||
            activeCommand === 'scrape') &&
          inputValue.trim() !== ''
        ) {
          console.log('Submitting chat message via Enter key')

          // Handle scrape command with URL prefix
          if (activeCommand === 'scrape') {
            const content = `scrape this url: ${inputValue}`
            setInput(content)
            append({role: 'user', content: content})
          } else {
            // Handle regular chat commands
            setInput(inputValue)
            append({role: 'user', content: inputValue})
          }

          // Submit to assistant
          submitMessage({preventDefault: () => {}} as React.FormEvent<HTMLFormElement>)

          // Clear inputs
          setInputValue('')
          setInput('')
          return
        }

        // Handle specific non-chat commands
        switch (activeCommand?.toLowerCase()) {
          case 'search':
            if (inputValue.trim() && selectedModel) {
              try {
                console.log('Performing search via Enter key')
                const results = await initiateDatabaseTableQuery({
                  table: selectedModel,
                  keyword: inputValue,
                } as InitiateQueryParams)

                if (results) {
                  await loadNodesFromTableQuery({
                    type: selectedModel || 'general',
                    searchResults: Array.isArray(results) ? results : [],
                    searchTerm: inputValue,
                  })
                  setInputValue('')
                }
              } catch (error) {
                console.error('Error performing search:', error)
              }
            }
            break

          default:
            // For any other active command or no command, try the oracle action handler
            if (inputValue.trim()) {
              console.log('Using oracle action handler')
              handleOracleAction()
            }
            break
        }
      }

      // Handle Backspace to clear command when input is empty
      if (e.key === 'Backspace' && (inputValue === '' || inputValue === ' ')) {
        setActiveCommand(null)
        setCommandMenuOpen(false)
      }

      // Open command menu on / key
      if (e.key === '/') {
        setCommandMenuOpen(true)
      }
    },
    [
      inputValue,
      selectedModel,
      submitMessage,
      activeCommand,
      handleOracleAction,
      loadNodesFromTableQuery,
      setInput,
      setInputValue,
      append,
      chatStatus,
    ]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value

      console.log('🚀 ~ handleChange ~ value:', value)
      console.log('🚀 ~ handleChange ~ activeCommand:', activeCommand)

      // Always update the local input value
      setInputValue(value)

      // For chat commands, also update the useAssistant input
      if (activeCommand === 'chat' || activeCommand === 'deep research') {
        setInput(value)
      }
    },
    [activeCommand, setInput]
  )

  // Properly typed interface for command format
  interface CommandFormat {
    id: string
    label: string
    name?: string
    description: string
    icon: () => JSX.Element
    prefix: string
  }

  const handleCommandSelect = (commandId: string) => {
    console.log('🚀 ~ handleCommandSelect ~ commandId:', commandId)

    // We might receive either the display name (like "Search") or the ID (like "search")
    // First, try to find the command by direct ID match
    let foundCommand = COMMANDS.find(
      (cmd) =>
        cmd.id.includes(commandId.toLowerCase()) || cmd.label.includes(commandId.toLowerCase())
    )

    console.log('🚀 ~ handleCommandSelect ~ foundCommand:', foundCommand)

    // If not found by direct match, try case-insensitive comparison
    if (!foundCommand) {
      const normalizedId = commandId.toLowerCase()
      foundCommand = COMMANDS.find(
        (cmd) => cmd.id.toLowerCase() === normalizedId || cmd.label.toLowerCase() === normalizedId
      )
    }

    if (foundCommand) {
      // Set the active command using the display-friendly version
      // This is what will appear in the UI tag
      const displayCommand = foundCommand.label.toLowerCase()

      setActiveCommand(displayCommand)

      // Notify parent component about command change
      if (onCommandChange) {
        onCommandChange(displayCommand)
      }

      setInputValue('')
      setCommandMenuOpen(false)
    } else {
      // If we somehow received a command ID that doesn't match any command,
      // just use it directly (fallback)
      const fallbackCommand = commandId.toLowerCase()
      setActiveCommand(fallbackCommand)

      // Notify parent component about command change
      if (onCommandChange) {
        onCommandChange(fallbackCommand)
      }

      setInputValue('')
      setCommandMenuOpen(false)
    }
  }

  const handleLoadingModelData = () => {
    // Delegate to the handleOracleAction function
    handleOracleAction()
  }

  const isChatActive = activeCommand === 'chat' || activeCommand === 'scrape'
  const isReady = chatStatus === 'awaiting_message'

  // Prepare the commands for the OracleCommandList component
  const commandItems: CommandItem[] = [
    // Map COMMANDS to the CommandItem format
    ...COMMANDS.map((cmd) => ({
      id: cmd.id.toLowerCase(),
      label: cmd.label,
      name: cmd.label,
      description: cmd.description,
      icon: cmd.icon,
      prefix: cmd.prefix,
    })),
  ]

  const isAILoading = chatStatus === 'in_progress'

  // Update the form submission handler to properly submit chat messages
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('🚀 ~ handleFormSubmit ~ activeCommand:', activeCommand)
    console.log('🚀 ~ handleFormSubmit ~ inputValue:', inputValue)
    console.log('🚀 ~ handleFormSubmit ~ chatStatus:', chatStatus)

    // Prevent submission if chat is loading
    if (chatStatus === 'in_progress' || chatStatus === 'generating') {
      console.log('Chat is currently processing, skipping submission')
      return
    }

    // Handle model selection without input (Add to Mindmap)
    if (selectedModel && inputValue.trim() === '') {
      addDataToMindMap(selectedModel)
      return
    }

    // Only proceed if we have input
    if (inputValue.trim() === '') return

    // Handle chat commands
    if (activeCommand === 'chat' || activeCommand === 'deep research') {
      console.log('Submitting chat message via form')

      // Set the message content for useAssistant
      setInput(inputValue)

      // Append user message to conversation
      append({
        role: 'user',
        content: inputValue,
      })

      // Submit the message to the AI endpoint
      submitMessage(e)

      // Clear input fields after submission
      setInputValue('')
      setInput('')
    } else {
      // For other commands, use the oracle action handler
      handleOracleAction()
    }
  }

  return (
    <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[500px]'>
      <div className='p-0 flex flex-col w-full h-auto relative'>
        <UltraterrestrialModelSelection
          modelMenuOpen={modelMenuOpen}
          selectedModel={selectedModel}
          deepResearchEnabled={deepResearchEnabled}
          toggleModelMenu={toggleModelMenu}
          toggleDeepResearch={toggleDeepResearch}
          updateSelectedModel={updateSelectedModel}
          menuRef={menuRef as React.RefObject<HTMLDivElement>}
          activeCommand={activeCommand}
          removeActiveCommand={removeActiveCommand}
          modelSearchActions={modelSearchActions}
          chatStatus={chatStatus}
        />
        <div
          className='p-0 flex flex-col w-full border border-neutral-700/30 text-neutral-500 
            bg-black bg-gradient-to-b from-black relative rounded-xl'>
          <OracleCommandMenu
            commandMenuOpen={commandMenuOpen}
            activeCommand={activeCommand}
            commands={commandItems}
            handleCommandSelect={handleCommandSelect}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleKeyDown={handleKeyDown}
          />

          {/* Display chat messages */}

          <form onSubmit={handleFormSubmit} className={isChatActive ? 'w-full' : ''}>
            <OracleInput
              activeModel={selectedModel}
              activeCommand={activeCommand}
              inputValue={inputValue}
              // activeCommand === 'chat' || activeCommand === 'deep research' ? input :
              setInputValue={handleChange}
              handleKeyDown={handleKeyDown}
              setCommandMenuOpen={setCommandMenuOpen}
              commandMenuOpen={commandMenuOpen}
              loadModelData={handleOracleAction}
              isChatActive={activeCommand === 'chat' || activeCommand === 'deepresearch'}
              chatStatus={chatStatus}
              messages={messages}
              setActiveCommand={setActiveCommand}
            />
          </form>

          {/* Display error message if assistant encounters an error */}
          {error && (
            <div className='mb-2 p-2 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm flex items-center'>
              <AlertCircle size={16} className='mr-2' />
              Error: {error.message || 'An error occurred with the AI assistant'}
            </div>
          )}

          {/* Show loading indicator */}
          {isAILoading && (
            <div className='animate-pulse text-sm text-neutral-400 mb-2 flex items-center justify-center'>
              <div className='h-1.5 w-1.5 rounded-full bg-cyan-500/80 mr-2' />
              AI is thinking...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
