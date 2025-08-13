'use client'

import {useState, useCallback, useRef, useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {
  Search,
  MessageSquare,
  Brain,
  Map,
  Sparkles,
  Grid,
  ChevronRight,
  Command,
  X,
} from 'lucide-react'
import {cn} from '@/utils'
import {useAssistant, type Message as AISdkMessage} from '@ai-sdk/react'
import {v4 as uuidv4} from 'uuid'
import {ENTITY_TYPES} from '../mindmap-bottom-menu/entity-types'
import {COMMANDS} from '../mindmap-bottom-menu/oracle-command-menu/commands'

// Types
interface CanvasMenuProps {
  position?: {x: number; y: number}
  isOpen?: boolean
  onClose?: () => void
  onAction?: (action: MenuAction) => void
  className?: string
}

export interface MenuAction {
  type: 'search' | 'chat' | 'add-entity' | 'tour' | 'command' | 'model-select'
  data: any
}

interface Command {
  id: string
  name: string
  icon: JSX.Element
  description?: string
  category: string
  action?: () => void
}

interface GroupCommands {
  [category: string]: Command[]
}

// Keyboard Key Component
const KeyboardKey = ({
  children,
  className,
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'small' | 'large'
}) => {
  const sizeClasses = {
    default: 'h-11 w-11 text-[10px]',
    small: 'h-8 w-8 text-[8px]',
    large: 'h-14 w-14 text-[12px]',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center flex-col rounded-[5px] text-white/75 gap-0.5 leading-4 p-1 px-2 relative',
        sizeClasses[size],
        className
      )}
      style={{
        background: 'rgba(255,255,255,.01)',
        boxShadow: '0 0 0 1px #414143',
      }}>
      <div className='relative z-10'>{children}</div>
      <div
        className='absolute inset-0 rounded-[inherit] pointer-events-none'
        style={{
          border: '1px solid rgba(255,255,255,.05)',
        }}
      />
      <div
        className='absolute inset-0 rounded-[inherit] pointer-events-none'
        style={{
          background: 'linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.08) 100%)',
        }}
      />
    </div>
  )
}

// Command Item Component
const CommandItem = ({
  command,
  isActive,
  onClick,
  searchQuery,
}: {
  command: Command
  isActive: boolean
  onClick: () => void
  searchQuery: string
}) => {
  const highlightMatch = (text: string) => {
    if (!searchQuery) return text
    const regex = new RegExp(`(${searchQuery})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className='text-cyan-400'>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        height: isActive ? 36 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.6, 0.6, 0, 1],
      }}
      className={cn(
        'px-3 flex items-center gap-3 text-white/75 text-xs rounded-lg cursor-pointer',
        'hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors',
        !isActive && 'pointer-events-none overflow-hidden'
      )}
      onClick={onClick}>
      <div className='w-4 h-4 flex items-center justify-center text-white/50'>{command.icon}</div>
      <div className='flex-1'>{highlightMatch(command.name)}</div>
      {command.description && (
        <div className='text-[10px] text-white/30'>{command.description}</div>
      )}
    </motion.div>
  )
}

// Main Canvas Menu Component
export function CanvasMenu({
  position = {x: window.innerWidth / 2, y: window.innerHeight / 2},
  isOpen: controlledOpen,
  onClose,
  onAction,
  className,
}: CanvasMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  // Session ID for AI interactions
  const sessionId = useRef<string>(
    typeof window !== 'undefined' ? localStorage.getItem('sessionId') || uuidv4() : uuidv4()
  )

  // AI Assistant integration
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

  // Build command groups
  const commandGroups: GroupCommands = {
    'AI Actions': [
      {
        id: 'chat',
        name: 'Chat with AI',
        icon: <MessageSquare className='w-3.5 h-3.5' />,
        description: 'Ask questions',
        category: 'AI Actions',
        action: () => {
          setActiveCommand('chat')
          onAction?.({type: 'chat', data: {command: 'chat'}})
        },
      },
      {
        id: 'deep-research',
        name: 'Deep Research',
        icon: <Brain className='w-3.5 h-3.5' />,
        description: 'Advanced analysis',
        category: 'AI Actions',
        action: () => {
          setActiveCommand('deep-research')
          onAction?.({type: 'command', data: {command: 'deep-research'}})
        },
      },
      {
        id: 'search',
        name: 'Search Database',
        icon: <Search className='w-3.5 h-3.5' />,
        description: 'Find records',
        category: 'AI Actions',
        action: () => {
          setActiveCommand('search')
          onAction?.({type: 'search', data: {command: 'search'}})
        },
      },
    ],
    Entities: ENTITY_TYPES.map((entity) => ({
      id: `add-${entity.type}`,
      name: `Add ${entity.displayName}`,
      icon: entity.icon(),
      description: entity.description,
      category: 'Entities',
      action: () => {
        onAction?.({type: 'add-entity', data: {entityType: entity.type}})
      },
    })),
    Navigation: [
      {
        id: 'guided-tour',
        name: 'Start Guided Tour',
        icon: <Map className='w-3.5 h-3.5' />,
        description: 'Interactive walkthrough',
        category: 'Navigation',
        action: () => {
          onAction?.({type: 'tour', data: {mode: 'guided'}})
        },
      },
      {
        id: 'free-explore',
        name: 'Free Exploration',
        icon: <Sparkles className='w-3.5 h-3.5' />,
        description: 'Explore freely',
        category: 'Navigation',
        action: () => {
          onAction?.({type: 'tour', data: {mode: 'free'}})
        },
      },
    ],
    View: [
      {
        id: 'grid-view',
        name: 'Grid Layout',
        icon: <Grid className='w-3.5 h-3.5' />,
        description: 'Organize nodes',
        category: 'View',
        action: () => {
          onAction?.({type: 'command', data: {command: 'grid-layout'}})
        },
      },
    ],
  }

  // Filter commands based on search
  const getFilteredCommands = useCallback(() => {
    if (!searchQuery) return commandGroups

    const filtered: GroupCommands = {}
    Object.entries(commandGroups).forEach(([category, commands]) => {
      const matchingCommands = commands.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingCommands.length > 0) {
        filtered[category] = matchingCommands
      }
    })
    return filtered
  }, [searchQuery])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setInternalOpen((prev) => !prev)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleClose = () => {
    setInternalOpen(false)
    onClose?.()
    setSearchQuery('')
    setActiveCommand(null)
  }

  const handleCommandSelect = (command: Command) => {
    command.action?.()
    if (!command.id.includes('chat') && !command.id.includes('search')) {
      handleClose()
    }
  }

  const filteredCommands = getFilteredCommands()

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full',
          'bg-black/80 backdrop-blur-xl border border-white/10',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-transform',
          'shadow-2xl z-50',
          className
        )}
        onClick={() => setInternalOpen(!internalOpen)}
        whileHover={{rotate: 15}}
        whileTap={{scale: 0.9}}>
        <Command className='w-6 h-6 text-white/75' />
      </motion.button>

      {/* Main Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]'
              onClick={handleClose}
            />

            {/* Menu Container */}
            <motion.div
              ref={menuRef}
              initial={{opacity: 0, scale: 0.95, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 20}}
              transition={{type: 'spring', stiffness: 300, damping: 30}}
              className='fixed z-[101]'
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
              }}>
              <div className='relative'>
                {/* Floating Keyboard Keys */}
                <motion.div
                  initial={{opacity: 0, rotate: -45, scale: 0}}
                  animate={{opacity: 1, rotate: -45, scale: 1}}
                  transition={{delay: 0.1}}
                  className='absolute -top-[25px] left-[10px]'>
                  <KeyboardKey size='large'>
                    <div className='text-lg'>⌘</div>
                    <div className='text-[8px]'>command</div>
                  </KeyboardKey>
                </motion.div>

                <motion.div
                  initial={{opacity: 0, rotate: 15, scale: 0}}
                  animate={{opacity: 1, rotate: 15, scale: 1}}
                  transition={{delay: 0.15}}
                  className='absolute -top-[30px] z-[2] right-[30px]'>
                  <KeyboardKey size='small'>K</KeyboardKey>
                </motion.div>

                {/* Main Menu Panel */}
                <div
                  className='w-[520px] h-[400px] p-2 border border-white/10 rounded-xl relative backdrop-blur-2xl flex flex-col bg-black/80'
                  style={{
                    boxShadow:
                      '0 -28px 84px -24px rgba(255,255,255, 0.1) inset, 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}>
                  {/* Header with Active Command */}
                  <div className='p-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      {activeCommand ? (
                        <div className='rounded-md bg-cyan-500/20 text-cyan-400 px-2 py-1 font-normal text-xs inline-flex items-center gap-1'>
                          <MessageSquare className='w-3 h-3' />
                          {activeCommand}
                        </div>
                      ) : (
                        <div className='rounded-md bg-white/[0.08] text-white/55 px-2 py-1 font-normal text-xs inline-block'>
                          Actions
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleClose}
                      className='w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors'>
                      <X className='w-3.5 h-3.5 text-white/50' />
                    </button>
                  </div>

                  {/* Search Input */}
                  <input
                    ref={inputRef}
                    type='text'
                    placeholder={
                      activeCommand === 'chat' ? 'Ask anything...' : 'Type a command or search...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && activeCommand === 'chat') {
                        // Handle chat submission
                        if (searchQuery.trim()) {
                          append({role: 'user', content: searchQuery})
                          setSearchQuery('')
                        }
                      }
                    }}
                    className='p-3 py-3 bg-transparent font-inherit border-0 w-full text-white/85 border-b border-white/[0.08] placeholder:text-white/30 focus:outline-none'
                  />

                  {/* Commands List or Chat Interface */}
                  <div className='pt-2 flex flex-col flex-1 overflow-y-auto'>
                    {activeCommand === 'chat' ? (
                      // Chat Interface
                      <div className='flex flex-col gap-2 p-2'>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              'p-2 rounded-lg text-xs',
                              message.role === 'user'
                                ? 'bg-cyan-500/10 text-cyan-400 ml-8'
                                : 'bg-white/5 text-white/70 mr-8'
                            )}>
                            {message.content}
                          </div>
                        ))}
                        {chatStatus === 'in_progress' && (
                          <div className='flex items-center gap-2 text-white/40 text-xs'>
                            <div className='w-2 h-2 bg-cyan-500 rounded-full animate-pulse' />
                            AI is thinking...
                          </div>
                        )}
                      </div>
                    ) : (
                      // Commands List
                      Object.entries(filteredCommands).map(([category, categoryCommands]) => (
                        <div key={category}>
                          <motion.div
                            initial={false}
                            animate={{
                              height: searchQuery ? 0 : 30,
                              opacity: searchQuery ? 0 : 1,
                            }}
                            transition={{duration: 0.35, ease: [0.6, 0.6, 0, 1]}}
                            className='px-2 flex items-center text-white/40 text-xs overflow-hidden'>
                            {category}
                          </motion.div>
                          {categoryCommands.map((command) => (
                            <CommandItem
                              key={command.id}
                              command={command}
                              isActive={
                                searchQuery
                                  ? command.name.toLowerCase().includes(searchQuery.toLowerCase())
                                  : true
                              }
                              onClick={() => handleCommandSelect(command)}
                              searchQuery={searchQuery}
                            />
                          ))}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Status Bar */}
                  <div className='border-t border-white/[0.08] p-2 flex items-center justify-between'>
                    <div className='flex items-center gap-4 text-[10px] text-white/30'>
                      <div className='flex items-center gap-1'>
                        <KeyboardKey size='small'>↑↓</KeyboardKey>
                        <span>Navigate</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <KeyboardKey size='small'>↵</KeyboardKey>
                        <span>Select</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <KeyboardKey size='small'>esc</KeyboardKey>
                        <span>Close</span>
                      </div>
                    </div>
                    {chatStatus === 'in_progress' && (
                      <div className='text-[10px] text-cyan-400'>Processing...</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
