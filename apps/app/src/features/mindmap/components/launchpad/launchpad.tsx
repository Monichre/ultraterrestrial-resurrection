'use client'

import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/chat/scroll-area'
import {Input} from '@/components/ui/input'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {AnimatePresence, motion} from 'framer-motion'
import {ChevronLeft, Search, X, Grid, Brain, AlertCircle} from 'lucide-react'
import Image from 'next/image'
import {useEffect, useState, useCallback, useRef, Suspense} from 'react'
import {cn} from '@/utils'
// AI Command System Imports
import {
  OracleCommandMenu,
  type CommandItem,
} from '../menus/mindmap-bottom-menu/oracle-command-menu/OracleCommandMenu'
import {COMMANDS} from '../menus/mindmap-bottom-menu/oracle-command-menu/commands'
import OracleInput from '../menus/mindmap-bottom-menu/oracle-input'
import {
  UltraterrestrialModelSelection,
  type ModelAction,
} from '../menus/mindmap-bottom-menu/UltraterrestrialModelSelection'
import {ENTITY_TYPES} from '../menus/mindmap-bottom-menu/entity-types'
import {initiateDatabaseTableQuery} from '../../actions/search'
import {useAssistant, type Message as AISdkMessage} from '@ai-sdk/react'
import {v4 as uuidv4} from 'uuid'
import {useSession} from '@/contexts/SessionContext'
import {SessionProgressIndicator, SessionProgressBadge} from '@/components/SessionProgressIndicator'
import {useSessionPersistence} from '@/hooks/useSessionPersistence'
import {
  SkeletonLoader,
  ApplicationSkeleton,
  CommandSkeleton,
  ModelSelectionSkeleton,
} from '@/components/SkeletonLoader'
import {ProgressIndicator, LoadingSpinner} from '@/components/ProgressIndicator'

// Local Message interface for AI components
interface LocalMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  parts?: any[]
}

// Design tokens for consistent styling
const DESIGN_TOKENS = {
  colors: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-400 dark:text-gray-500',
    surface: 'bg-white dark:bg-gray-800',
    overlay: 'bg-gray-100 dark:bg-gray-800',
    backdrop: 'backdrop-blur-lg bg-white/80 dark:bg-black/80',
  },
  spacing: {
    container: 'max-w-2xl mx-auto px-4',
    section: 'mb-6',
    item: 'p-4',
    icon: 'w-20 h-20',
    iconLarge: 'w-24 h-24',
  },
  layout: {
    grid: 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6',
    center: 'flex items-center justify-center',
    overlay: 'fixed inset-0 flex flex-col items-center pt-20',
  },
  animation: {
    default: 'transition-all duration-300 ease-in-out',
    hover: 'hover:scale-110 transition-transform duration-200',
    tap: 'active:scale-95',
  },
} as const

// Enhanced animation configurations following 2025 patterns
const ANIMATION_CONFIG = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  smoothSpring: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
  overlay: {
    initial: {opacity: 0, scale: 0.95},
    animate: {opacity: 1, scale: 1},
    exit: {opacity: 0, scale: 0.95},
    transition: {type: 'spring', stiffness: 300, damping: 30},
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  staggerItem: {
    initial: {opacity: 0, y: 20, scale: 0.8},
    animate: {opacity: 1, y: 0, scale: 1},
    exit: {opacity: 0, y: -20, scale: 0.8},
  },
  // New AI-specific animations
  tabSwitch: {
    initial: {opacity: 0, x: -20},
    animate: {opacity: 1, x: 0},
    exit: {opacity: 0, x: 20},
    transition: {type: 'spring', stiffness: 300, damping: 30},
  },
  aiInterface: {
    initial: {opacity: 0, y: 10},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: -10},
  },
  // Enhanced UI/UX animations
  microInteraction: {
    scale: {
      initial: {scale: 1},
      hover: {scale: 1.02},
      tap: {scale: 0.98},
      transition: {type: 'spring', stiffness: 400, damping: 25},
    },
    fade: {
      initial: {opacity: 0},
      animate: {opacity: 1},
      exit: {opacity: 0},
      transition: {duration: 0.2},
    },
    slide: {
      initial: {opacity: 0, y: 10},
      animate: {opacity: 1, y: 0},
      exit: {opacity: 0, y: -10},
      transition: {type: 'spring', stiffness: 300, damping: 30},
    },
  },
  loading: {
    pulse: {
      animate: {
        opacity: [0.4, 0.8, 0.4],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    shimmer: {
      initial: {x: '-100%'},
      animate: {x: '100%'},
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  feedback: {
    success: {
      initial: {scale: 0.8, opacity: 0},
      animate: {scale: 1, opacity: 1},
      exit: {scale: 0.8, opacity: 0},
      transition: {type: 'spring', stiffness: 300, damping: 20},
    },
    error: {
      initial: {x: -20, opacity: 0},
      animate: {x: 0, opacity: 1},
      exit: {x: 20, opacity: 0},
      transition: {type: 'spring', stiffness: 300, damping: 30},
    },
  },
} as const

interface Application {
  id: number
  name: string
  icon: string
  category: string
}

export interface LaunchPadProps {
  applications: Application[]
  // AI Enhancement Props
  aiEnabled?: boolean
  defaultTab?: 'applications' | 'ai'
  onCommandChange?: (command: string | null) => void
  onModelChange?: (model: string | null) => void
}

export function LaunchPad({
  applications,
  aiEnabled = true,
  defaultTab = 'applications',
  onCommandChange,
  onModelChange,
}: LaunchPadProps): JSX.Element {
  // Existing application launcher state
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  // New AI interface state
  const [activeTab, setActiveTab] = useState<'applications' | 'ai'>(defaultTab)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  // Model selection state
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false)

  // UI references
  const menuRef = useRef<HTMLDivElement>(null)

  // Session management with persistence
  const {
    state: sessionState,
    addMessage,
    setActiveCommand: setSessionActiveCommand,
    setSelectedModel: setSessionSelectedModel,
    setDeepResearch: setSessionDeepResearch,
    addBackgroundTask,
    removeBackgroundTask,
    getActiveTasks,
  } = useSession()

  const {save: saveSession, needsSaving} = useSessionPersistence({
    autoSave: true,
    saveInterval: 30000, // 30 seconds
    onSaveError: (error) => console.error('Session save failed:', error),
  })

  // Session ID for AI assistant
  const sessionId = useRef<string>(sessionState.sessionId || uuidv4())

  // AI SDK integration
  const {
    status: chatStatus,
    messages,
    input,
    setInput,
    submitMessage,
    append,
    error,
  } = useAssistant({
    api: '/api/disclosure/chat',
    headers: {
      'x-session-id': sessionId.current,
    },
  })

  const categories = Array.from(new Set([...applications.map((app) => app.category), 'All']))

  // Store session ID in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('launchpadSessionId')) {
      localStorage.setItem('launchpadSessionId', sessionId.current)
    }
  }, [])

  // Filter applications based on search and category
  useEffect(() => {
    const filtered = applications.filter(
      (app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'All' || app.category === selectedCategory)
    )
    setFilteredApps(filtered)
  }, [searchTerm, selectedCategory, applications])

  // Keep AI input value in sync
  useEffect(() => {
    setInputValue(input)
  }, [input])

  // Sync session state with local state
  useEffect(() => {
    if (sessionState.activeCommand !== activeCommand) {
      setActiveCommand(sessionState.activeCommand)
    }
    if (sessionState.selectedModel !== selectedModel) {
      setSelectedModel(sessionState.selectedModel)
    }
    if (sessionState.deepResearchEnabled !== deepResearchEnabled) {
      setDeepResearchEnabled(sessionState.deepResearchEnabled)
    }
  }, [sessionState.activeCommand, sessionState.selectedModel, sessionState.deepResearchEnabled])

  // Create model search actions based on ENTITY_TYPES
  const modelSearchActions: ModelAction[] = ENTITY_TYPES.map((entity) => ({
    icon: entity.icon({className: 'w-4 h-4'}),
    label: `Add ${entity.displayName}`,
    name: entity.displayName,
    type: entity.type,
    description: entity.description,
    searchAction: async (searchTerm: string) => {
      try {
        console.log(`🔍 Searching ${entity.type} for: ${searchTerm}`)
        const response = await initiateDatabaseTableQuery({
          table: entity.type,
          keyword: searchTerm,
        })

        if (response) {
          console.log(`✅ Search completed for ${entity.type}:`, response)
          // TODO: Integrate with mindmap for node creation when mindmap context is available
        } else {
          console.warn(`❌ No results found for ${searchTerm} in ${entity.type}`)
        }
      } catch (error) {
        console.error(`❌ Search failed for ${entity.type}:`, error)
      }
    },
  }))

  const toggleLaunchpad = (): void => {
    setIsLaunchpadOpen((prev) => !prev)
  }

  const handleAppClick = (app: Application): void => {
    setSelectedApp(app)
  }

  const handleBackClick = (): void => {
    setSelectedApp(null)
    setSearchTerm('')
    setSelectedCategory('All')
  }

  // AI Command System handlers
  const handleCommandSelect = useCallback(
    (commandId: string) => {
      const foundCommand = COMMANDS.find(
        (cmd) =>
          cmd.id.includes(commandId.toLowerCase()) || cmd.label.includes(commandId.toLowerCase())
      )

      if (foundCommand) {
        const displayCommand = foundCommand.label.toLowerCase()
        setActiveCommand(displayCommand)
        setSessionActiveCommand(displayCommand)
        setInputValue('')
        setCommandMenuOpen(false)

        if (onCommandChange) {
          onCommandChange(displayCommand)
        }
      }
    },
    [onCommandChange]
  )

  const handleAIInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value
      setInputValue(value)

      // For chat commands, also update the useAssistant input
      if (activeCommand === 'chat' || activeCommand === 'deep research') {
        setInput(value)
      }
    },
    [activeCommand, setInput]
  )

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        // Prevent submission if chat is loading
        if (chatStatus === 'in_progress') {
          return
        }

        // Handle chat commands
        if (
          (activeCommand === 'chat' || activeCommand === 'deep research') &&
          inputValue.trim() !== ''
        ) {
          setInput(inputValue)
          append({role: 'user', content: inputValue})
          submitMessage({preventDefault: () => {}} as React.FormEvent<HTMLFormElement>)

          // Add message to session
          addMessage({
            role: 'user',
            content: inputValue,
            metadata: {command: activeCommand, deepResearch: deepResearchEnabled},
          })

          // Add background task for AI processing if deep research enabled
          if (deepResearchEnabled) {
            addBackgroundTask({
              type: 'analysis',
              status: 'pending',
              progress: 0,
              title: 'Deep Research Analysis',
              description: `Enhanced analysis for: ${inputValue.slice(0, 50)}...`,
            })
          }

          setInputValue('')
          setInput('')
          return
        }

        // Handle search commands with model selection
        if (activeCommand === 'search' && inputValue.trim() !== '' && selectedModel) {
          try {
            console.log(`🔍 Performing search: ${inputValue} in ${selectedModel}`)

            // Add background task for search
            const taskId = addBackgroundTask({
              type: 'search',
              status: 'pending',
              progress: 0,
              title: `Searching ${selectedModel} for "${inputValue}"`,
              description: `Database search in ${selectedModel} table`,
            })

            const modelAction = modelSearchActions.find((action) => action.type === selectedModel)
            if (modelAction) {
              await modelAction.searchAction(inputValue)
              setInputValue('')
              setInput('')

              // Add message to session
              addMessage({
                role: 'user',
                content: `Search ${selectedModel}: ${inputValue}`,
                metadata: {command: 'search', model: selectedModel, taskId},
              })
            } else {
              console.warn(`❌ No search action found for model: ${selectedModel}`)
            }
          } catch (error) {
            console.error(`❌ Search failed:`, error)
          }
          return
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
      activeCommand,
      chatStatus,
      setInput,
      append,
      submitMessage,
      selectedModel,
      modelSearchActions,
    ]
  )

  const removeActiveCommand = useCallback(() => {
    setActiveCommand(null)
    setSessionActiveCommand(null)
    setCommandMenuOpen(false)

    if (onCommandChange) {
      onCommandChange(null)
    }
  }, [onCommandChange, setSessionActiveCommand])

  // Enhanced oracle action handler with model selection support
  const handleOracleAction = useCallback(() => {
    if (activeCommand === 'chat' || activeCommand === 'deep research') {
      // Handle chat submission
      if (inputValue.trim()) {
        const formData = new FormData()
        formData.append('message', inputValue)
        submitMessage({preventDefault: () => {}} as React.FormEvent<HTMLFormElement>)
        setInput('')
        setInputValue('')
      }
    } else if (activeCommand === 'search' && selectedModel) {
      // Handle search with selected model
      if (inputValue.trim()) {
        const modelAction = modelSearchActions.find((action) => action.type === selectedModel)
        if (modelAction) {
          modelAction.searchAction(inputValue).then(() => {
            setInputValue('')
            setInput('')
          })
        }
      }
    } else if (selectedModel && !activeCommand && !inputValue.trim()) {
      // Handle "Add to mindmap" action when model is selected but no input
      console.log(`🎨 Adding ${selectedModel} data to mindmap`)
      const modelAction = modelSearchActions.find((action) => action.type === selectedModel)
      if (modelAction) {
        // For "add to mindmap" without search term, we could load sample data
        // or show a message prompting for search term
        console.log(`📝 Select a search term to add ${selectedModel} data`)
      }
    }
  }, [activeCommand, inputValue, selectedModel, submitMessage, setInput, modelSearchActions])

  // Model selection handlers
  const toggleModelMenu = useCallback(() => {
    setModelMenuOpen((prev) => !prev)
  }, [])

  const toggleDeepResearch = useCallback(() => {
    const newValue = !deepResearchEnabled
    setDeepResearchEnabled(newValue)
    setSessionDeepResearch(newValue)
  }, [deepResearchEnabled, setSessionDeepResearch])

  const updateSelectedModel = useCallback(
    (model: string) => {
      setSelectedModel(model)
      setSessionSelectedModel(model)
      if (onModelChange) {
        onModelChange(model)
      }
    },
    [onModelChange, setSessionSelectedModel]
  )

  // Prepare command items for the OracleCommandMenu
  const commandItems: CommandItem[] = COMMANDS.map((cmd) => ({
    id: cmd.id.toLowerCase(),
    label: cmd.label,
    name: cmd.label,
    description: cmd.description,
    icon: cmd.icon,
    prefix: cmd.prefix,
  }))

  // Tab configuration
  const tabs = [
    {id: 'applications' as const, label: 'Applications', icon: <Grid className='w-4 h-4' />},
    ...(aiEnabled
      ? [{id: 'ai' as const, label: 'AI Assistant', icon: <Brain className='w-4 h-4' />}]
      : []),
  ]

  return (
    <div className={cn('h-screen overflow-hidden absolute', DESIGN_TOKENS.colors.surface)}>
      <motion.div
        className='fixed bottom-20 left-1/2 -translate-x-1/2 z-50'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{...ANIMATION_CONFIG.spring, delay: 0.5}}>
        <Button
          onClick={toggleLaunchpad}
          variant='ghost'
          size='icon'
          className={cn(
            'rounded-xl shadow-lg backdrop-blur-lg',
            DESIGN_TOKENS.colors.surface,
            DESIGN_TOKENS.colors.primary,
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'touch-target',
            'transition-all duration-200'
          )}
          aria-label={isLaunchpadOpen ? 'Close LaunchPad' : 'Open LaunchPad'}
          aria-expanded={isLaunchpadOpen}
          aria-controls='launchpad-content'>
          <motion.div
            animate={isLaunchpadOpen ? {rotate: 180} : {rotate: 0}}
            transition={{duration: 0.3, ease: 'easeInOut'}}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width={30}
              height={30}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-panel-top-close'
              aria-hidden='true'>
              <rect width={18} height={18} x={3} y={3} rx={2} />
              <path d='M3 9h18' />
              <path d='m9 16 3-3 3 3' />
            </svg>
          </motion.div>
        </Button>
      </motion.div>
      <AnimatePresence>
        {isLaunchpadOpen && (
          <motion.div
            {...ANIMATION_CONFIG.overlay}
            className={cn(
              DESIGN_TOKENS.layout.overlay,
              DESIGN_TOKENS.colors.backdrop,
              'launchpad-overlay'
            )}
            onClick={toggleLaunchpad}
            role='dialog'
            aria-modal='true'
            aria-labelledby='launchpad-title'
            aria-describedby='launchpad-description'>
            <motion.div
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{...ANIMATION_CONFIG.smoothSpring, delay: 0.1}}
              className={DESIGN_TOKENS.spacing.container}
              onClick={(e) => e.stopPropagation()}>
              {/* Accessibility elements */}
              <h1 id='launchpad-title' className='sr-only'>
                LaunchPad - AI Assistant and Application Launcher
              </h1>
              <p id='launchpad-description' className='sr-only'>
                Access AI commands, search applications, and manage your workspace
              </p>

              {/* Header with Tab System */}
              <motion.div
                className={cn('relative flex flex-col', DESIGN_TOKENS.spacing.section)}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{...ANIMATION_CONFIG.spring, delay: 0.2}}>
                {/* Tab Navigation */}
                <div className='flex items-center justify-between mb-4'>
                  <Button
                    onClick={handleBackClick}
                    variant='ghost'
                    size='icon'
                    className={cn(
                      'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      DESIGN_TOKENS.animation.default,
                      'hover:bg-gray-200 dark:hover:bg-gray-700',
                      'active:scale-95'
                    )}>
                    <ChevronLeft className={cn('h-6 w-6', DESIGN_TOKENS.colors.muted)} />
                  </Button>
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as 'applications' | 'ai')}
                    className='mx-4'>
                    <TabsList className='grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800'>
                      {tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={cn(
                            'flex items-center gap-2 text-sm font-medium',
                            DESIGN_TOKENS.animation.default
                          )}>
                          {tab.icon}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <div className='w-10' /> {/* Spacer for visual balance */}
                </div>

                {/* Search Input (visible for both tabs) */}
                <div className='relative'>
                  <Input
                    type='text'
                    placeholder={
                      activeTab === 'applications'
                        ? 'Search applications...'
                        : 'Type / for commands...'
                    }
                    value={activeTab === 'applications' ? searchTerm : inputValue}
                    onChange={(e) => {
                      if (activeTab === 'applications') {
                        setSearchTerm(e.target.value)
                      } else {
                        handleAIInputChange(e)
                      }
                    }}
                    onKeyDown={activeTab === 'ai' ? handleKeyDown : undefined}
                    className={cn(
                      'w-full border-none transition-all duration-200',
                      DESIGN_TOKENS.colors.overlay,
                      DESIGN_TOKENS.colors.primary,
                      'backdrop-blur-lg',
                      'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      'hover:bg-gray-200 dark:hover:bg-gray-700',
                      'accessible-form'
                    )}
                    aria-label={
                      activeTab === 'applications'
                        ? 'Search applications'
                        : 'AI command input - type / for commands'
                    }
                    aria-describedby={activeTab === 'ai' ? 'ai-input-help' : undefined}
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2'>
                    {activeTab === 'ai' && chatStatus === 'in_progress' && (
                      <LoadingSpinner size='sm' />
                    )}
                    <Search
                      className='text-muted-foreground pointer-events-none'
                      aria-hidden='true'
                    />
                  </div>
                  {activeTab === 'ai' && (
                    <div id='ai-input-help' className='sr-only'>
                      Type / to open command menu, or start typing to search
                    </div>
                  )}
                </div>
              </motion.div>
              {/* AI Command Menu - only show when AI tab is active */}
              {activeTab === 'ai' && aiEnabled && (
                <motion.div {...ANIMATION_CONFIG.aiInterface} className='mb-4'>
                  <OracleCommandMenu
                    commandMenuOpen={commandMenuOpen}
                    activeCommand={activeCommand}
                    commands={commandItems}
                    handleCommandSelect={handleCommandSelect}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleKeyDown={handleKeyDown}
                  />
                </motion.div>
              )}

              {/* Category tabs - only show for applications tab when no app is selected */}
              {activeTab === 'applications' && !selectedApp && (
                <Tabs
                  defaultValue='All'
                  className={cn(
                    'w-full rounded-lg border-none bg-transparent',
                    DESIGN_TOKENS.spacing.section,
                    DESIGN_TOKENS.colors.primary
                  )}>
                  <TabsList className='flex justify-start overflow-x-auto gap-2 rounded-full bg-transparent'>
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          'leading-7 tracking-tight w-auto text-sm',
                          DESIGN_TOKENS.animation.default,
                          category === selectedCategory
                            ? 'bg-gray-200 dark:bg-gray-700'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </motion.div>
            <ScrollArea
              className={cn('w-full h-[calc(100vh-200px)]', DESIGN_TOKENS.spacing.container)}>
              <AnimatePresence mode='wait'>
                {activeTab === 'applications' ? (
                  // Applications View
                  <motion.div
                    key='applications'
                    {...ANIMATION_CONFIG.tabSwitch}
                    className={cn(DESIGN_TOKENS.layout.grid, DESIGN_TOKENS.spacing.item)}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    {...ANIMATION_CONFIG.staggerContainer}
                    onClick={(e) => e.stopPropagation()}>
                    <AnimatePresence>
                      {selectedApp ? (
                        <motion.div
                          key='app-details'
                          initial={{opacity: 0}}
                          animate={{opacity: 1}}
                          exit={{opacity: 0}}
                          className={cn(
                            'col-span-full flex flex-col items-center',
                            DESIGN_TOKENS.colors.primary
                          )}>
                          <div
                            className={cn(
                              DESIGN_TOKENS.layout.center,
                              DESIGN_TOKENS.spacing.iconLarge,
                              'rounded-3xl mb-4'
                            )}>
                            <Image
                              src={selectedApp.icon}
                              alt={selectedApp.name}
                              width={96}
                              height={96}
                              className='rounded-lg'
                              loading='lazy'
                            />
                          </div>
                          <h2
                            className={cn(
                              'text-2xl font-bold mb-2 tracking-tight text-center',
                              DESIGN_TOKENS.colors.primary
                            )}>
                            {selectedApp.name}
                          </h2>
                          <p
                            className={cn(
                              'text-lg mb-4 tracking-tight text-center',
                              DESIGN_TOKENS.colors.secondary
                            )}>
                            {selectedApp.category}
                          </p>
                          <Button
                            className={cn(
                              'bg-blue-500 text-white text-sm font-semibold',
                              DESIGN_TOKENS.animation.default
                            )}
                            size='sm'
                            onClick={() => alert(`Launching ${selectedApp.name}`)}>
                            Open {selectedApp.name}
                          </Button>
                        </motion.div>
                      ) : (
                        filteredApps.map((app, index) => (
                          <motion.div
                            key={app.id}
                            layout
                            variants={ANIMATION_CONFIG.staggerItem}
                            transition={{...ANIMATION_CONFIG.spring, delay: index * 0.02}}
                            className={cn(
                              'flex flex-col items-center cursor-pointer group',
                              'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-lg',
                              'hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 -m-2',
                              DESIGN_TOKENS.colors.primary,
                              DESIGN_TOKENS.animation.default,
                              'touch-target'
                            )}
                            onClick={() => handleAppClick(app)}
                            role='button'
                            tabIndex={0}
                            aria-label={`Open ${app.name} in ${app.category} category`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleAppClick(app)
                              }
                            }}
                            whileHover={ANIMATION_CONFIG.microInteraction.scale.hover}
                            whileTap={ANIMATION_CONFIG.microInteraction.scale.tap}>
                            <motion.div
                              className={cn(
                                DESIGN_TOKENS.layout.center,
                                DESIGN_TOKENS.spacing.icon,
                                'rounded-lg bg-transparent relative overflow-hidden'
                              )}
                              whileHover={{
                                scale: 1.05,
                                transition: ANIMATION_CONFIG.spring,
                              }}
                              whileTap={{
                                scale: 0.95,
                                transition: {...ANIMATION_CONFIG.spring, duration: 0.1},
                              }}>
                              <Image
                                src={app.icon}
                                alt=''
                                width={80}
                                height={80}
                                className={cn(
                                  'rounded-lg transition-all duration-200',
                                  'group-hover:brightness-110 group-focus-within:brightness-110'
                                )}
                                loading='lazy'
                              />
                              {/* Subtle hover overlay */}
                              <motion.div
                                className='absolute inset-0 bg-blue-500/10 rounded-lg'
                                initial={{opacity: 0}}
                                whileHover={{opacity: 1}}
                                transition={{duration: 0.2}}
                              />
                            </motion.div>
                            <motion.p
                              className={cn(
                                'mt-2 text-xs text-center tracking-tight font-semibold max-w-full truncate',
                                DESIGN_TOKENS.colors.primary,
                                'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                              )}
                              initial={{opacity: 0.8}}
                              whileHover={{opacity: 1}}>
                              {app.name}
                            </motion.p>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : activeTab === 'ai' && aiEnabled ? (
                  // AI Interface View
                  <motion.div
                    key='ai-interface'
                    {...ANIMATION_CONFIG.tabSwitch}
                    className='p-4 h-full'
                    onClick={(e) => e.stopPropagation()}>
                    {/* AI Interface Container */}
                    <div className='flex flex-col h-full max-h-[70vh]'>
                      {/* Model Selection Interface */}
                      <Suspense fallback={<ModelSelectionSkeleton />}>
                        <UltraterrestrialModelSelection
                          modelMenuOpen={modelMenuOpen}
                          selectedModel={selectedModel}
                          deepResearchEnabled={deepResearchEnabled}
                          toggleModelMenu={toggleModelMenu}
                          toggleDeepResearch={toggleDeepResearch}
                          updateSelectedModel={updateSelectedModel}
                          menuRef={menuRef}
                          activeCommand={activeCommand}
                          removeActiveCommand={removeActiveCommand}
                          modelSearchActions={modelSearchActions}
                          chatStatus={chatStatus}
                        />
                      </Suspense>

                      {/* AI Input Interface */}
                      <Suspense fallback={<CommandSkeleton />}>
                        <OracleInput
                          activeCommand={activeCommand}
                          inputValue={inputValue}
                          setInputValue={handleAIInputChange}
                          handleKeyDown={handleKeyDown}
                          setCommandMenuOpen={setCommandMenuOpen}
                          commandMenuOpen={commandMenuOpen}
                          loadModelData={handleOracleAction}
                          isChatActive={
                            activeCommand === 'chat' || activeCommand === 'deep research'
                          }
                          chatStatus={chatStatus}
                          messages={messages.map(
                            (msg: AISdkMessage): LocalMessage => ({
                              id: msg.id,
                              role: msg.role === 'data' ? 'assistant' : msg.role,
                              content: msg.content,
                              parts: (msg as any).parts,
                            })
                          )}
                          setActiveCommand={setActiveCommand}
                        />
                      </Suspense>

                      {/* Status Display */}
                      <div className='mt-2 space-y-2'>
                        {/* Active Command Display */}
                        {activeCommand && (
                          <motion.div
                            {...ANIMATION_CONFIG.feedback.success}
                            className='flex items-center gap-2 text-sm text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800'>
                            <Brain className='w-4 h-4' />
                            <span>Active command: {activeCommand}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={removeActiveCommand}
                              className='ml-auto h-6 w-6 p-0 hover:bg-red-500/20 focus-visible:ring-2 focus-visible:ring-red-500'
                              aria-label='Remove active command'>
                              <X className='w-3 h-3' />
                            </Button>
                          </motion.div>
                        )}

                        {/* Selected Model Display */}
                        {selectedModel && (
                          <motion.div
                            {...ANIMATION_CONFIG.feedback.success}
                            className='flex items-center gap-2 text-sm text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800'>
                            <div className='w-4 h-4 flex items-center justify-center'>
                              {
                                modelSearchActions.find((action) => action.type === selectedModel)
                                  ?.icon
                              }
                            </div>
                            <span>
                              Selected model:{' '}
                              {
                                modelSearchActions.find((action) => action.type === selectedModel)
                                  ?.name
                              }
                            </span>
                            {deepResearchEnabled && (
                              <motion.span
                                className='text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full'
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                transition={{type: 'spring', stiffness: 300, damping: 20}}>
                                Deep Research
                              </motion.span>
                            )}

                            {/* Background Tasks Badge */}
                            <SessionProgressBadge
                              tasks={sessionState.backgroundTasks}
                              className='ml-2'
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Error Display */}
                      {error && (
                        <motion.div
                          {...ANIMATION_CONFIG.feedback.error}
                          className='mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2'>
                          <AlertCircle className='w-4 h-4 flex-shrink-0' />
                          <span>
                            Error: {error.message || 'An error occurred with the AI assistant'}
                          </span>
                        </motion.div>
                      )}

                      {/* Session Progress Indicator */}
                      {sessionState.backgroundTasks.length > 0 && (
                        <div className='mt-3'>
                          <SessionProgressIndicator
                            tasks={sessionState.backgroundTasks}
                            onTaskRemove={removeBackgroundTask}
                            className='bg-black/30 border-white/20'
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </ScrollArea>
            {/* Footer with close button */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{...ANIMATION_CONFIG.spring, delay: 0.3}}
              className='flex justify-center items-center py-4'>
              <Button
                onClick={toggleLaunchpad}
                variant='ghost'
                size='icon'
                className={cn(
                  'bg-gray-200 dark:bg-gray-700',
                  'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  DESIGN_TOKENS.colors.primary,
                  DESIGN_TOKENS.animation.default,
                  'hover:bg-gray-300 dark:hover:bg-gray-600',
                  'active:scale-95 hover:scale-105',
                  'touch-target'
                )}
                aria-label='Close LaunchPad'>
                <X className='h-6 w-6' />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
