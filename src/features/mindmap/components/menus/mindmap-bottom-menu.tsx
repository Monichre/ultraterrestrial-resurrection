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
import {OracleInput, ToggleButton} from '@/features/ai/components/ai-inputs/oracle-input'
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

  const handleLoadingRecords = useCallback(
    async ({data: {type}}: {data: {type: string}}) => {
      console.log('🚀 ~ MindMapBottomMenu ~ type:', type)

      const amount = 3
      const center = screenToFlowPosition(calculateCenterOfScreen())

      // Create a user input node first
      const potentialUserNode = {
        id: getNextId(),
        type: 'userInputNode',
        position: {...center},
        data: {
          label: 'Your Query',
          input: `Beginning your exploration by loading ${amount} ${type}. Fetching Data...`,
          question: `Give me the top ${amount} of interesting ${type} records and what is interesting about them and explain the connections between them, if any.`,
          type: type,
        },
      }

      // Add the user node to the graph
      addNode(potentialUserNode)

      try {
        const existingNodes = getNodes()

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

        const question = `Give me the top ${amount} of interesting ${type} records and what is interesting about them and explain the connections between them, if any.`

        const flowData = await xataToXYFlow({
          question,
          table: type,
          rules: `Find the most interesting ${type} records that have clear relationships between them`,
          context: `The user is exploring records in the ${type} database `,
          existingNodes: existingNodes,
          sourceNode: potentialUserNode,
          layoutType, // Pass the selected layout type
        })

        console.log('🚀 ~ handleLoadingRecords ~ flowData:', flowData)

        addNodes(flowData.nodes)
        addEdges(flowData.edges)

        if (flowData && flowData?.xataResponse?.records?.length > 0) {
          // Update the user input node with the AI analysis
          if (flowData.xataResponse?.records) {
            updateNodeData(potentialUserNode.id, {
              entities: flowData.xataResponse?.records,
              answer: flowData.xataResponse?.answer,
              sessionId: flowData.xataResponse?.sessionId,
            })
          }
        } else {
          // Update user node to show no results
          updateNodeData(potentialUserNode.id, {
            input: `No ${type} data found or there was an error fetching the data.`,
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
      calculateCenterOfScreen,
      screenToFlowPosition,
      getNextId,
      addNode,
      addNodes,
      addEdges,
      updateNodeData,
    ]
  )

  const runSearch = useCallback(
    async ({type, searchTerm}: SearchParams) => {
      const userNode: any = {
        id: uuidv4(),
        type: 'userInputNode',
        position: {x: 0, y: 0},
        data: {label: 'Your Query', input: searchTerm},
      }
      addNodes(userNode)

      const response: any = await initiateDatabaseTableQuery({
        table: type,
        keyword: searchTerm,
      })

      const {
        suggestedSearchResult: {record},
        relatedResults,
        totalCount,
      } = response

      // For a single child node, position it directly below the userNode
      const userElem = document.getElementById(userNode.id)
      const userRect = userElem ? userElem.getBoundingClientRect() : {width: 200, height: 100}
      const userHeight = userRect.height || 100
      const childY = userNode.position.y + userHeight + 100 // 100px vertical spacing

      const childNode: any = {
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

      const edge: any = {
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
    [addNodes, addEdges, updateNodeData]
  )

  const modelSearchActions = ENTITY_TYPES.map((entity) => ({
    icon: entity.icon(),
    label: `Add ${entity.displayName}`,
    name: entity.displayName,
    type: entity.type,
    description: entity.description,
    searchAction: async (searchTerm: string) => {
      await runSearch({type: entity.type, searchTerm})
    },
  }))

  const addDataToMindMap = (model: string) => {
    console.log('🚀 ~ addDataToMindMap ~ model:', model)

    handleLoadingRecords({data: {type: model}})
  }

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

  const [filteredCommands, setFilteredCommands] = useState(COMMANDS)

  useEffect(() => {
    if (inputValue.startsWith('/')) {
      const searchTerm = inputValue.slice(1).toLowerCase()
      setFilteredCommands(
        COMMANDS.filter(
          (cmd) =>
            cmd.prefix.toLowerCase().includes(searchTerm) ||
            cmd.label.toLowerCase().includes(searchTerm)
        )
      )
    } else {
      setFilteredCommands(COMMANDS)
    }
  }, [inputValue])

  const updateState = useCallback(
    (updates: Partial<typeof state>) => setState((prev) => ({...prev, ...updates})),
    []
  )

  const toggleModelMenu = () => {
    updateState({isModelMenuOpen: !state.isModelMenuOpen})
    // updateState( { isMenuOpen: true } )
  }

  const closeModelMenu = () => {
    updateState({isModelMenuOpen: false})
  }

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        if (activeCommand === 'chat') {
          append({role: 'user', content: inputValue})
          setInputValue('')
        }

        if (
          activeCommand === 'search' &&
          inputValue &&
          inputValue.trim() !== '/' &&
          state?.selectedModel
        ) {
          // loadNodesFromTableQuery(inputValue);
          const xataSearchResults = await askAIAction({
            question: inputValue,
            table: state?.selectedModel,
          })
          console.log('🚀 ~ handleKeyDown ~ xataSearchResults:', xataSearchResults)
          setSearchResults(xataSearchResults)
        }

        // if (activeCommand === 'scrape' && inputValue && inputValue.trim() !== '/') {
        //   // Check if inputValue is a valid URL (simple check for demonstration)
        //   if (inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
        //     // Add a user message to indicate scraping is starting
        //     append({
        //       role: 'user',
        //       content: `Scrape data from: ${inputValue}`,
        //     })

        //     // Add an assistant message to show processing
        //     append({
        //       role: 'assistant',
        //       content: 'Starting data extraction process. This may take a moment...',
        //     })
      }
      // try {
      // Call the scrape API
      // Scrape here

      // if (data.success) {
      // Process the results
      // const summary = data.processedResults?.[0]?.summary || 'No summary available'
      // const entityTypes = Object.keys(data.processedResults?.[0]?.entities || {})
      // const entitiesFound = entityTypes
      //   .map((type) => {
      //     const count = data.processedResults?.[0]?.entities?.[type]?.length || 0
      //     return `${type}: ${count}`
      //   })
      //   .join(', ')

      // Add the results to the chat
      // append({
      //   role: 'assistant',
      //   content: `## Data Extraction Results\n\n${summary}\n\n### Entities Extracted\n\n${entitiesFound}\n\nWould you like me to add any of these entities to your mind map?`,
      // })
      //   } else {
      //     append({
      //       role: 'assistant',
      //       content: `Failed to extract data: ${data.message || 'Unknown error'}`,
      //     })
      //   }
      // } catch (error) {
      //   append({
      //     role: 'assistant',
      //     content: `An error occurred during data extraction: ${
      //       error instanceof Error ? error.message : 'Unknown error'
      //     }`,
      //   })
      // }

      //   setInputValue('')
      // } else {
      //   append({
      //     role: 'assistant',
      //     content: 'Please enter a valid URL starting with http:// or https://',
      //   })
      // }
      // }
      // }

      if (e.key === 'Backspace' && (inputValue === '' || inputValue === ' ')) {
        setActiveCommand(null)
        setIsOpen(false)
      }
      if (e.key === '/') {
        setIsOpen(true)
      }
    },
    [
      activeCommand,
      inputValue,
      submitMessage,
      loadNodesFromTableQuery,
      append,
      state?.selectedModel,
    ]
  )
  const removeActiveCommand = () => {
    setActiveCommand(null)
    setIsOpen(false)
  }
  const handleChange = useCallback(
    (e: any) => {
      setInputValue(e.target.value)
      if (activeCommand === 'chat') {
        // setInput( value )
        handleInputChange(e)
      }
      // Deep research just uses the input value directly, no special handling needed
    },
    [activeCommand, handleInputChange]
  )

  const handleCommandSelect = (commandId: string) => {
    const command = COMMANDS.find((cmd) => cmd.id === commandId)
    if (command) {
      setActiveCommand(commandId)
      setInputValue('')
      setIsOpen(false)
      closeModelMenu()
    }
  }

  const handleLoadingModelData = () => {
    if (state.selectedModel) {
      console.log('🚀 ~ handleLoadingModelData ~ state.selectedModel:', state.selectedModel)

      addDataToMindMap(state.selectedModel)
    }
  }

  const isChatActive = activeCommand === 'chat' || activeCommand === 'scrape'

  return (
    <div className='flex justify-center w-full'>
      <div className='p-4 flex flex-col w-[500px]'>
        <div className='relative w-full h-auto overflow-hidden'>
          {/* <div className="border-b border-black/10 dark:border-white/10"> */}
          <div className='flex flex-col justify-between items-center px-2 py-4 text-sm text-zinc-600 dark:text-zinc-400'>
            <div className='relative w-full z-50' ref={menuRef}>
              <div className='flex w-full justify-between items-center content-center px-2'>
                <div className='flex items-center gap-2'>
                  <motion.button
                    onClick={toggleModelMenu}
                    className='flex justify-start items-center gap-1'>
                    <div className='cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90'>
                      {/* <AiStarIcon
													className="w-3 h-3 mr-2"
													stroke={ICON_GREEN}
												/> */}
                      <OracleIcon
                        className={cn(
                          'w-3 h-3 mr-2',
                          chatStatus === 'in_progress' ? 'animate-spin' : ''
                        )}
                        fill={ICON_GREEN}
                      />
                      <TextShimmer as='span' className='inline-block mr-2'>
                        Oracle {state?.selectedModel && `| ${capitalize(state?.selectedModel)}`}{' '}
                      </TextShimmer>
                    </div>
                  </motion.button>

                  {activeCommand && (
                    <div
                      className='cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90'
                      onClick={removeActiveCommand}>
                      <XIcon className='w-4 h-4 text-black/50 dark:text-white/50' />
                      {/* <span className="text-black/70 dark:text-white/70"> */}
                      <TextShimmer as='span' className='inline-block mr-2'>
                        {activeCommand}
                      </TextShimmer>
                    </div>
                  )}
                </div>
                <ToggleButton
                  icon={<Brain className='w-4 h-4' />}
                  label='Deep Research'
                  onClick={() => updateState({deepResearchEnabled: !state.deepResearchEnabled})}
                  useMemory={state.deepResearchEnabled}
                />
              </div>

              <motion.div
                ref={menuRef}
                className='rounded-xl relative flex gap-2 items-center relative w-full duration-200 text-neutral-500 willChange gpu-transform text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90'
                initial={{
                  height: 0,
                }}
                animate={{
                  height: state.isModelMenuOpen ? 250 : '0',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  // duration: 0.2,
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                }}>
                <AnimatePresence>
                  {state.isModelMenuOpen && (
                    <motion.div
                      key='model-menu'
                      // className="h-full w-full"
                      // className="absolute top-0 left-0 mt-1 w-64 bg-white dark:bg-zinc-800 rounded-md shadow-lg py-1 z-50 border border-black/10 dark:border-white/10"
                      className='pb-0 flex flex-col h-full items-end rounded-xl justify-evenly absolute w-full text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90'
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      // exit={{ opacity: 0, y: 20 }}
                    >
                      {modelSearchActions.map((model, index) => (
                        <motion.div
                          className='w-full shrink-0 px-2'
                          key={model.name}
                          initial={{opacity: 0, y: 20}}
                          animate={{opacity: 1, y: 0}}
                          // exit={{ opacity: 0, y: 20 }}
                        >
                          <button
                            type='button'
                            key={model.name}
                            className='w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-sm transition-colors dark:text-white'
                            onClick={() =>
                              updateState({
                                selectedModel: model.type,
                                isModelMenuOpen: false,
                              })
                            }>
                            <div className='flex items-center justify-start gap-2 flex-1'>
                              {model.icon}
                              <span className='capitalize'>{model.name}</span>
                            </div>
                            <span className='text-xs text-zinc-500 dark:text-zinc-400 capitalize'>
                              {model.label}
                            </span>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

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
            isOpen={isOpen}
            loadModelData={handleLoadingModelData}
            isChatActive={activeCommand === 'chat' || activeCommand === 'deepresearch'}
            chatStatus={chatStatus}
            messages={messages}
          />
        </form>

        <AnimatePresence>
          {isOpen && !activeCommand && (
            <motion.div
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 8}}
              transition={{duration: 0.15}}
              className='absolute bottom-0 left-0 w-full h-auto z-40 flex justify-center items-center'>
              <div className='rounded-lg shadow-lg w-[444px] h-[400px] mt-2 rounded-lg border border-neutral-700/30 text-neutral-500 bg-black bg-gradient-to-b from-black relative rounded-tl-lg rounded-tr-lg '>
                <Command className='w-full'>
                  <Command.List className=''>
                    {filteredCommands.map((command, index) => (
                      <Command.Item
                        key={command.id}
                        onSelect={() => {
                          handleCommandSelect(command.id)
                          // setInputValue( `${command.prefix} ` )
                        }}
                        className='px-3 py-2.5 flex items-center gap-3 text-sm hover:bg-white/10 cursor-pointer group'>
                        {command.icon()}
                        <div className='flex flex-col'>
                          <span className='font-medium text-black/70 dark:text-white/70'>
                            {command.label}
                          </span>
                          <span className='text-xs text-black/50 dark:text-white/50'>
                            {command.description}
                          </span>
                        </div>
                        <span className='ml-auto text-xs text-black/30 dark:text-white/30'>
                          {command.prefix}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.List>
                </Command>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
