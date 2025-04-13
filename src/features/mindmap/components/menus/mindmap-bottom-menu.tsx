import {
  ArtifactsIcon,
  EventsIcon,
  KeyFiguresIcon,
  OracleIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons/entity-icons'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {initiateDatabaseTableQuery} from '@/features/mindmap/actions/search'
import {DOMAIN_MODEL_COLORS, ICON_GREEN} from '@/utils/constants'
import {useAssistant} from '@ai-sdk/react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

import {Command} from 'cmdk'
import {AnimatePresence, motion} from 'framer-motion'

import {AddIcon, ThinTwinklyStar} from '@/components/icons'
import {
  OracleInput,
  ToggleButton,
  DEFAULT_COMMAND_OPTIONS,
} from '@/features/ai/components/ai-inputs/oracle-input'
import {LightningBoltIcon} from '@radix-ui/react-icons'

import {TextShimmer} from '@/components/animated/text-effect'
import {MagicWandIcon} from '@/components/icons'
import {searchXataConnections} from '@/features/mindmap/actions/actions'
// import {useAILoading} from '@/features/mindmap/hooks/use-ai-loading'
import {capitalize, cn} from '@/utils'
import {Brain, FileSearch, Lightbulb, SearchIcon, XIcon} from 'lucide-react'
import {
  askAIAction,
  xataToXYFlow,
  type XataToXYFlowResponse,
} from '@/features/mindmap/actions/xata-to-xyflow'
import {OracleCommandList, CommandItem} from './oracle-command-menu/OracleCommandList'
import {UltraterrestrialModelSelection, type ModelAction} from './UltraterrestrialModelSelection'

// Define explicit types for our entities and nodes
export interface MindMapNode {
  id: string
  type: string
  position: {x: number; y: number}
  data: Record<string, any>
  parentId?: string
}

export interface EntityType {
  type: string
  label: string
  displayName: string
  icon: (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
  description: string
}

export interface SearchParams {
  type: string
  searchTerm: string
}

// Unified entity definitions for use across multiple components
export const ENTITY_TYPES: EntityType[] = [
  {
    type: 'events',
    label: 'Events',
    displayName: 'Events',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <EventsIcon {...props} stroke={ICON_GREEN} />,
    description: 'Add historical events to the mind map',
  },
  {
    type: 'topics',
    label: 'Topics',
    displayName: 'Topics',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <TopicsIcon {...props} stroke={ICON_GREEN} />,
    description: 'Add topics to the mind map',
  },
  {
    type: 'personnel',
    label: 'personnel',
    displayName: 'Key Figures',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <KeyFiguresIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add key figures to the mind map',
  },
  {
    type: 'testimonies',
    label: 'testimonies',
    displayName: 'Testimonies',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <TestimoniesIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add testimonies to the mind map',
  },
  {
    type: 'organizations',
    label: 'organizations',
    displayName: 'Organizations',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <OrganizationsIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add organizations to the mind map',
  },
  {
    type: 'documents',
    label: 'documents',
    displayName: 'Documents',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <FileSearch {...props} stroke={ICON_GREEN} />,
    description: 'Add case files to the mind map',
  },
  {
    type: 'case-files',
    label: 'case-files',
    displayName: 'Case Files',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <FileSearch {...props} stroke={ICON_GREEN} />,
    description: 'Add case files to the mind map',
  },

  {
    type: 'artifacts',
    label: 'artifacts',
    displayName: 'Artifacts',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <ArtifactsIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add historical artifacts to the mind map',
  },
]

// Move COMMANDS outside component
const COMMANDS = [
  {
    id: 'chat',
    label: 'Chat',
    description: 'Start a conversation with our Disclosure Agent',
    icon: () => <LightningBoltIcon stroke={ICON_GREEN} />,
    prefix: '/chat',
  },
  {
    id: 'Search',
    label: 'Search',
    description:
      'Search existing records across our database, curated and validated web resources and our own AI knowledge base',
    icon: () => <SearchIcon stroke={ICON_GREEN} />,
    prefix: '/search',
  },
  {
    id: 'Add',
    label: 'Add',
    description: 'Add a new item to the mind map',
    icon: () => <AddIcon stroke={ICON_GREEN} />,
    prefix: '/add',
  },
  {
    id: 'Connect',
    label: 'Connect',
    description: 'Connect to a database',
    icon: () => <ThinTwinklyStar stroke={ICON_GREEN} />,
    prefix: '/connect',
  },
  {
    id: 'analyze',
    label: 'Analyze',
    description: 'Analyze the existing records on your mind map and generate new insights',
    icon: () => <MagicWandIcon stroke={ICON_GREEN} />,
    prefix: '/analyze',
  },
  {
    id: 'scrape',
    label: 'Scrape',
    description: 'Extract data from a URL with entity recognition and analysis',
    icon: () => <Brain stroke={ICON_GREEN} />,
    prefix: '/scrape',
  },
] as const

export const MindMapBottomMenu = () => {
  const {
    status: chatStatus,
    messages,
    input,
    setInput,
    submitMessage,
    handleInputChange,
    append,
    isLoading,
  } = useAssistant({api: '/api/disclosure/chat'})

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

  // Enhanced search function with duplicate prevention
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

      const userNode = {
        id: uuidv4(),
        type: 'userInputNode',
        position: {x: 0, y: 0},
        data: {label: 'Your Query', input: searchTerm},
      }
      addNodes(userNode)

      const response = await initiateDatabaseTableQuery({
        table: type,
        keyword: searchTerm,
      })

      const {
        suggestedSearchResult: {record},
        relatedResults,
        totalCount,
      } = response
      console.log('🚀 ~ runSearch ~ response:', response)
      console.log('🚀 ~ runSearch ~ record:', record)
      console.log('🚀 ~ runSearch ~ relatedResults:', relatedResults)
      console.log('🚀 ~ runSearch ~ totalCount:', totalCount)

      // Skip adding the result if the record doesn't exist or already on the graph
      if (!record?.id || nodeExists(record.id, type)) {
        updateNodeData(userNode.id, {
          input: `No new results found for "${searchTerm}" in ${type}`,
        })
        return
      }

      // For a single child node, position it directly below the userNode
      const userElem = document.getElementById(userNode.id)
      const userRect = userElem ? userElem.getBoundingClientRect() : {width: 200, height: 100}
      const userHeight = userRect.height || 100
      const childY = userNode.position.y + userHeight + 100 // 100px vertical spacing

      const childNode = {
        id: record?.id,
        type: `${type}Node`,
        data: {
          type,
          ...record,
        },
        position: {
          x: userNode.position.x, // For a single node, we align with the parent's x
          y: childY,
        },
        parentId: userNode.id,
      }
      const edgeId = `${userNode.id}-${childNode.id}`
      const sourceHandle = `handle:${edgeId}`

      const edge = {
        id: edgeId,
        source: userNode.id,
        target: childNode.id,
        sourceHandle: sourceHandle,
        animated: true,
        type: 'sequential',
        label: `You searched for ${searchTerm} within ${type}`,
        style: {
          stroke: DOMAIN_MODEL_COLORS[type],
        },
      }
      updateNodeData(userNode.id, {handles: [sourceHandle]})

      addNodes(childNode)
      addEdges(edge)
    },
    [addNodes, addEdges, updateNodeData, getNodes, nodeExists]
  )

  // Modified data loading with duplicate prevention
  const handleLoadingRecords = useCallback(
    async ({data: {type}}: {data: {type: string}}) => {
      console.log('🚀 ~ MindMapBottomMenu ~ type:', type)

      const amount = 3
      const center = screenToFlowPosition(calculateCenterOfScreen())

      // Check if we already have a similar query
      const existingNodes = getNodes()
      const query = `Give me the top ${amount} of interesting ${type} records`
      const similarNodeExists = existingNodes.some(
        (node) => node.type === 'userInputNode' && node.data?.question === query
      )

      if (similarNodeExists) {
        console.log(`Similar ${type} exploration already exists on the graph`)
        return // Skip duplicate data loading
      }

      // Create a user input node first
      const potentialUserNode = {
        id: getNextId(),
        type: 'userInputNode',
        position: {...center},
        data: {
          label: 'Your Query',
          input: `Beginning your exploration by loading ${amount} ${type}. Fetching Data...`,
          question: query,
          type: type,
        },
      }

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

        const flowData = await xataToXYFlow({
          question: query,
          table: type,
          rules: `Find the most interesting ${type} records that have clear relationships between them`,
          context: `The user is exploring records in the ${type} database`,
          existingNodes,
          sourceNode: potentialUserNode,
          layoutType, // Pass the selected layout type
        })

        // Filter out any nodes that already exist in the graph
        if (flowData.nodes && flowData.nodes.length > 0) {
          const filteredNodes = flowData.nodes.filter((node) => !nodeExists(node.id, node.type))

          if (filteredNodes.length > 0) {
            addNodes(filteredNodes)
            addEdges(flowData.edges)

            // Update the user input node with the AI analysis
            if (flowData.xataResponse?.records) {
              updateNodeData(potentialUserNode.id, {
                entities: flowData.xataResponse.records,
                answer: flowData.xataResponse.answer,
                sessionId: flowData.xataResponse.sessionId,
              })
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
  const [isOpen, setIsOpen] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [state, setState] = useState<{
    selectedModel: string | null
    isModelMenuOpen: boolean
    deepResearchEnabled: boolean
  }>({
    selectedModel: null,
    isModelMenuOpen: false,
    deepResearchEnabled: false,
  })
  const [searchResults, setSearchResults] = useState<any>(null)

  const updateState = useCallback(
    (updates: Partial<typeof state>) => setState((prev) => ({...prev, ...updates})),
    []
  )

  const removeActiveCommand = () => {
    setActiveCommand(null)
    setIsOpen(false)
  }

  // Higher-level delegation function to route actions based on active command
  const handleOracleAction = useCallback(() => {
    if (activeCommand === 'chat' || activeCommand === 'deepresearch') {
      // Handle chat submission
      if (inputValue.trim()) {
        append({role: 'user', content: inputValue})
        setInputValue('')
      }
    } else if (activeCommand === 'search' || (inputValue.trim() && state.selectedModel)) {
      // Default to search if there's input and model selected, even without explicit search command
      if (inputValue.trim() && state?.selectedModel) {
        // Run search action with the current model and input value
        askAIAction({
          question: inputValue,
          table: state.selectedModel,
        }).then((results) => {
          setSearchResults(results)
        })

        // Also create a visual representation in the mindmap
        runSearch({
          type: state.selectedModel,
          searchTerm: inputValue,
        })

        setInputValue('')
      }
    } else if (state.selectedModel) {
      // Only if there's no input but a model is selected, add data to mindmap
      addDataToMindMap(state.selectedModel)
    }
  }, [
    activeCommand,
    inputValue,
    state.selectedModel,
    append,
    askAIAction,
    setSearchResults,
    runSearch,
    addDataToMindMap,
  ])

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        // Only process if there's text in the input
        if (inputValue.trim()) {
          // Default behavior: If we have model selected and input but no specific command,
          // treat as search
          if (state.selectedModel && !activeCommand) {
            runSearch({
              type: state.selectedModel,
              searchTerm: inputValue,
            })
            setInputValue('')
            return
          }

          // Handle specific commands
          switch (activeCommand?.toLowerCase()) {
            case 'chat':
            case 'deepresearch':
              // For chat and deepresearch, send message to AI assistant
              append({role: 'user', content: inputValue})
              setInputValue('')
              break

            case 'search':
              // For search, ensure we have a model selected
              if (state?.selectedModel) {
                const xataSearchResults = await askAIAction({
                  question: inputValue,
                  table: state.selectedModel,
                })
                setSearchResults(xataSearchResults)

                // Also visualize the search in the graph
                runSearch({
                  type: state.selectedModel,
                  searchTerm: inputValue,
                })
                setInputValue('')
              } else {
                console.warn('Search requires a model to be selected')
              }
              break

            case 'scrape':
              // Handle the scrape command - send URL to be scraped
              if (inputValue.trim().startsWith('http')) {
                append({
                  role: 'user',
                  content: `Please scrape and analyze the following URL: ${inputValue}`,
                })
                setInputValue('')
              }
              break

            case 'analyze':
              // Handle analyze command
              append({
                role: 'user',
                content: `Please analyze the following: ${inputValue}`,
              })
              setInputValue('')
              break

            case 'add':
            case 'connect':
              // For other commands that require a model, ensure one is selected
              if (state?.selectedModel) {
                // Call the Oracle action handler which routes based on active command
                handleOracleAction()
              } else {
                console.warn(`${activeCommand} requires selecting a model first`)
              }
              break

            default:
              // For any other active command, try the oracle action handler
              if (activeCommand) {
                handleOracleAction()
              }
              break
          }
        }
      }

      // Handle Backspace to clear command when empty
      if (e.key === 'Backspace' && (inputValue === '' || inputValue === ' ')) {
        setActiveCommand(null)
        setIsOpen(false)
      }

      // Open command menu on / key
      if (e.key === '/') {
        setIsOpen(true)
      }
    },
    [
      activeCommand,
      inputValue,
      append,
      state?.selectedModel,
      askAIAction,
      setSearchResults,
      runSearch,
      setInputValue,
      handleOracleAction,
    ]
  )

  const handleChange = useCallback(
    (e: any) => {
      // Handle both string values and event objects
      if (typeof e === 'string') {
        setInputValue(e)
      } else if (e && e.target && e.target.value !== undefined) {
        setInputValue(e.target.value)
        if (activeCommand === 'chat') {
          handleInputChange(e)
        }
      } else {
        console.warn('Invalid input provided to handleChange')
      }
      // Deep research just uses the input value directly, no special handling needed
    },
    [activeCommand, handleInputChange]
  )

  const handleCommandSelect = (commandId: string) => {
    // We might receive either the display name (like "Search") or the ID (like "search")
    // First, try to find the command by direct ID match
    let foundCommand = COMMANDS.find((cmd) => cmd.id === commandId || cmd.label === commandId)

    // If not found by direct match, try case-insensitive comparison
    if (!foundCommand) {
      const normalizedId = commandId.toLowerCase()
      foundCommand = COMMANDS.find(
        (cmd) => cmd.id.toLowerCase() === normalizedId || cmd.label.toLowerCase() === normalizedId
      )
    }

    // Check in DEFAULT_COMMAND_OPTIONS if not found in COMMANDS
    let foundDefaultCommand
    if (!foundCommand) {
      foundDefaultCommand = DEFAULT_COMMAND_OPTIONS.find(
        (opt) =>
          opt.id.toLowerCase() === commandId.toLowerCase() ||
          opt.name.toLowerCase() === commandId.toLowerCase()
      )
    }

    if (foundCommand || foundDefaultCommand) {
      // Set the active command using the display-friendly version
      // This is what will appear in the UI tag
      const displayCommand = foundCommand
        ? foundCommand.label || foundCommand.id
        : foundDefaultCommand?.name || foundDefaultCommand?.id || commandId

      setActiveCommand(displayCommand)
      setInputValue('')
      setIsOpen(false)
    } else {
      // If we somehow received a command ID that doesn't match any command,
      // just use it directly (fallback)
      setActiveCommand(commandId)
      setInputValue('')
      setIsOpen(false)
    }
  }

  const handleLoadingModelData = () => {
    // Delegate to the handleOracleAction function
    handleOracleAction()
  }

  const isChatActive = activeCommand === 'chat' || activeCommand === 'scrape'

  return (
    <div className='flex justify-center w-full'>
      <div className='p-4 flex flex-col w-[500px]'>
        <UltraterrestrialModelSelection
          state={state}
          updateState={updateState}
          menuRef={menuRef}
          activeCommand={activeCommand}
          removeActiveCommand={removeActiveCommand}
          modelSearchActions={modelSearchActions}
          chatStatus={chatStatus}
        />

        <form
          onSubmit={submitMessage}
          className={isChatActive ? ' bg-neutral-950 bg-gradient-to-b from-black/90' : ''}>
          <OracleInput
            activeModel={state.selectedModel}
            activeCommand={activeCommand}
            inputValue={inputValue}
            setInputValue={handleChange}
            handleKeyDown={handleKeyDown}
            setIsOpen={setIsOpen}
            isLoading={isLoading}
            isOpen={isOpen}
            loadModelData={handleOracleAction}
            isChatActive={activeCommand === 'chat' || activeCommand === 'deepresearch'}
            chatStatus={chatStatus}
            messages={messages}
          />
        </form>

        {/* Single source of truth for commands display */}
        <OracleCommandList
          isOpen={isOpen}
          activeCommand={activeCommand}
          commands={[
            // Combine all commands from both sources
            ...COMMANDS.map((cmd) => ({
              id: cmd.id.toLowerCase(),
              label: cmd.label,
              name: cmd.label,
              description: cmd.description,
              icon: cmd.icon,
              prefix: cmd.prefix,
            })),
            // Add any additional commands from DEFAULT_COMMAND_OPTIONS if needed
            ...DEFAULT_COMMAND_OPTIONS.filter(
              (opt) => !COMMANDS.some((cmd) => cmd.id.toLowerCase() === opt.id.toLowerCase())
            ).map((opt) => ({
              id: opt.id.toLowerCase(),
              name: opt.name,
              label: opt.name,
              description: opt.description,
              // Create a stub icon if not provided
              icon: () => null,
              prefix: `/${opt.id.toLowerCase()}`,
            })),
          ]}
          handleCommandSelect={handleCommandSelect}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
