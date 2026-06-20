'use client'

import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {initiateDatabaseTableQuery} from '@/features/mindmap/actions/search'
import {DOMAIN_MODEL_COLORS} from '@/utils/constants'
import {useChat} from '@ai-sdk/react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

import OracleInput from '@/features/mindmap/components/menus/mindmap-bottom-menu/oracle-input'
import {AlertCircle} from 'lucide-react'
import {askAIAction} from '@/features/mindmap/actions/xata-to-xyflow'
import {OracleCommandMenu, type CommandItem} from './oracle-command-menu/OracleCommandMenu'
import {UltraterrestrialModelSelection, type ModelAction} from './UltraterrestrialModelSelection'
import {ENTITY_TYPES} from '@/features/mindmap/components/menus/mindmap-bottom-menu/entity-types'
import {COMMANDS} from '@/features/mindmap/components/menus/mindmap-bottom-menu/oracle-command-menu/commands'
import {
  getGraphContext,
  type GraphContext,
} from '@/features/mindmap/utils/contextual-intelligence'
import {
  createEnhancedUserInputNode,
  createEnhancedEntityNode,
} from '@/features/mindmap/utils/node-enhancement-utils'

interface XataResponseRecord {
  id: string
  [key: string]: unknown
}

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

  const menuRef = useRef<HTMLDivElement>(null)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false)
  // New: UI toggles for AI-mode and quick layout fix
  const [aiMode, setAiMode] = useState(false)
  const [layoutBusy, setLayoutBusy] = useState(false)

  const {
    loadNodesFromTableQuery,
    addNodesWithLayout,
    updateNodeData,
    addEdges,
    organizeLayout,
    setEdges,
    setNodes,
    getNodes,
    getEdges,
  } = useMindMap()

  // Derived: Context awareness indicator
  const hasContext = (() => {
    try {
      const ctx = getGraphContext(getNodes())
      return !!ctx
    } catch {
      return false
    }
  })()

  const {messages, input, setInput, append, isLoading, error} = useChat({
    api: '/api/disclosure/mindmap',
    headers: {
      'x-session-id': sessionId.current,
    },
  })
  const chatStatus = isLoading ? 'in_progress' : 'awaiting_message'
  // Store session ID in localStorage if it's new
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', sessionId.current)
    }
  }, [])

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

  // Check if a node with similar content already exists on the graph
  const nodeExists = useCallback(
    (id: string, type: string) => {
      const existingNodes = getNodes()
      return existingNodes.some(
        (node) =>
          // Check by ID (primary check)
          node.id === id ||
          // Check by data ID for enhanced nodes
          (node.data?.id === id && node.data?.type === type)
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
      await addNodesWithLayout(userNode, {
        direction: 'horizontal',
        preserveExistingLayout: true,
      })

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
        await addNodesWithLayout(entityNodes, {
          direction: 'grid',
          parentChildSpacing: 100,
          siblingSpacing: 60,
        })
        addEdges(entityEdges)
      }
    },
    [addNodesWithLayout, addEdges, updateNodeData, getNodes, nodeExists]
  )

  // Define proper types for nodes and responses

  // (integrateAgentResults and handleLoadingRecords removed — they backed the retired
  // historical-query-agent chain which called the 501 /api/historical-query route)

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

  // addDataToMindMap previously called handleLoadingRecords which hit the retired
  // historical-query-agent chain; stubbed to no-op until a Postgres replacement is wired.
  const addDataToMindMap = useCallback(
    (_model: string) => {
      console.warn('[MindMapBottomMenu] addDataToMindMap: historical-query-agent chain removed — use search instead')
    },
    []
  )


  const toggleDeepResearch = () => {
    setDeepResearchEnabled(!deepResearchEnabled)
  }

  // New: Toggle AI edge animations for agent-generated edges
  const toggleAiMode = useCallback(() => {
    setAiMode((prev) => !prev)
    const currentEdges = getEdges()
    const updated = currentEdges.map((e: any) => {
      const isAgentEdge = typeof e.className === 'string' && (
        e.className.includes('agent-generated-edge') || e.className.includes('user-to-entity-edge')
      )
      if (!isAgentEdge) return e
      // Preserve original type to allow reverting
      const origType = (e.data && e.data._origType) || e.type || 'smoothstep'
      if (!prev) {
        // turning ON: switch to AI animated edge
        return {
          ...e,
          type: 'aiAnimatedEdge',
          animated: true,
          data: { ...(e.data || {}), _origType: origType },
          style: {
            ...(e.style || {}),
            stroke: '#22d3ee',
            strokeWidth: Math.max(2, (e.style?.strokeWidth as number) || 2),
            filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.65))',
          },
        }
      }
      // turning OFF: revert
      return {
        ...e,
        type: origType,
        data: { ...(e.data || {}), _origType: origType },
        animated: e.animated && origType !== 'aiAnimatedEdge',
        style: { ...(e.style || {}), filter: undefined },
      }
    })
    setEdges(updated)
  }, [getEdges, setEdges])

  // New: Quick overlap fix using organizeLayout (non-destructive)
  const fixOverlaps = useCallback(async () => {
    try {
      setLayoutBusy(true)
      await organizeLayout({
        preserveExistingLayout: true,
        direction: 'horizontal',
        parentChildSpacing: 150,
        siblingSpacing: 90,
        centerChildren: true,
        focusOnNewNodes: false,
      })
    } finally {
      setLayoutBusy(false)
    }
  }, [organizeLayout])

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
        // Send message via useChat
        append({role: 'user', content: inputValue})
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
  }, [activeCommand, inputValue, selectedModel, append, setInput, runSearch, addDataToMindMap])

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
        if (isLoading) {
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
      activeCommand,
      handleOracleAction,
      loadNodesFromTableQuery,
      setInput,
      setInputValue,
      append,
      isLoading,
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

    // Prevent submission if chat is loading
    if (isLoading) {
      console.log('Chat is currently processing, skipping submission')
      return
    }

    // Safely normalize inputValue in case an external caller set it to undefined/null
    const normalizedInput = typeof inputValue === 'string' ? inputValue : ''

    // Handle model selection without input (Add to Mindmap)
    if (selectedModel && normalizedInput.trim() === '') {
      addDataToMindMap(selectedModel)
      return
    }

    // Only proceed if we have input
    if (normalizedInput.trim() === '') return

    // Handle chat commands
    if (activeCommand === 'chat' || activeCommand === 'deep research') {
      console.log('Submitting chat message via form')

      // Set the message content for useAssistant
      setInput(normalizedInput)

      // Append user message to conversation
      append({
        role: 'user',
        content: normalizedInput,
      })

      // Clear input fields after submission
      setInputValue('')
      setInput('')
    } else {
      // For other commands, use the oracle action handler
      handleOracleAction()
    }
  }

  return (
    <>
      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] z-50 pointer-events-auto'>
        <div className='p-0 flex flex-col w-full h-auto relative'>
          {/* Quick controls bar */}
          <div className='flex items-center justify-between mb-1 px-1 text-xs text-neutral-300'>
            <div className='flex items-center gap-2'>
              <span className={hasContext ? 'text-emerald-400' : 'text-neutral-400'}>
                Contextual: {hasContext ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={fixOverlaps}
                disabled={layoutBusy}
                className='px-2 py-1 rounded-md bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-600/40 disabled:opacity-60'
                title='Resolve node overlaps'
              >
                {layoutBusy ? 'Layout…' : 'Fix Overlaps'}
              </button>
              <button
                type='button'
                onClick={toggleAiMode}
                className={`px-2 py-1 rounded-md border ${aiMode ? 'bg-cyan-600/30 border-cyan-400/60 text-cyan-200' : 'bg-neutral-800/70 hover:bg-neutral-700/80 border-neutral-600/40 text-neutral-200'}`}
                title='Toggle AI animated connections for agent-generated edges'
              >
                AI Mode
              </button>
            </div>
          </div>
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
            bg-black/90 backdrop-blur-sm bg-gradient-to-b from-black relative rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.35)]'>
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
    </>
  )
}
