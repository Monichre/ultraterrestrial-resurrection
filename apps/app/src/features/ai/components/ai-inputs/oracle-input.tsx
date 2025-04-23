import {AddIcon, OracleIcon, SlashIcon} from '@/components/icons'
import {MarkdownContent} from '@/components/ui/chat/markdown-content'
import {cn} from '@/utils/cn'
import {ICON_GREEN} from '@/utils/constants'
import {Brain} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {SendIcon} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'
import {Button} from '@/components/ui/button'

export interface OracleCommandType {
  value: string
  label: string
  description?: string
  category?: string
  isComingSoon?: boolean
}

interface OracleInputProps {
  containerRef?: React.RefObject<HTMLDivElement>
  activeCommand: string | null
  inputValue: string
  setInputValue: (value: string | React.ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  setCommandMenuOpen: (isOpen: boolean) => void
  inputRef?: React.RefObject<HTMLInputElement>
  activeModel?: string | null
  loadModelData: () => void
  isChatActive?: boolean
  chatStatus?: 'idle' | 'loading' | 'generating' | 'error' | 'in_progress' | 'awaiting_message'
  isLoading?: boolean
  messages?: Array<{id: string; role: string; content: string}>
  commandMenuOpen?: boolean
  setActiveCommand: (command: string | null) => void
  oracleCommandList?: OracleCommandType[]
}

export function ToggleButton({
  icon,
  label,
  onClick,
  useMemory,
}: {
  icon?: React.ReactNode
  label?: string
  onClick: () => void
  useMemory: boolean
}) {
  return (
    <button type='button' onClick={onClick}>
      <div className='flex items-center text-sm cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 hover:ring-indigo-500/50 hover:text-[#00d5ff] group/tab mb-1 relative flex w-fit items-center gap-3 rounded-xl  px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 bg-neutral-800 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90'>
        <Brain
          stroke={ICON_GREEN}
          className={cn(
            'w-4 h-4',
            useMemory ? 'text-[#00d5ff]' : 'text-black/40 dark:text-white/40'
          )}
        />

        <div
          className={cn(
            'relative inline-flex h-4 w-8 items-center rounded-full transition-colors',
            useMemory ? 'bg-[#00d5ff]' : 'bg-black/20 dark:bg-white/20'
          )}>
          <div
            className={cn(
              'absolute h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm',
              useMemory ? 'translate-x-4' : 'translate-x-1'
            )}
          />
        </div>
      </div>
    </button>
  )
}

export default function OracleInput({
  activeModel,
  activeCommand,
  inputValue,
  setInputValue,
  handleKeyDown,
  setCommandMenuOpen,
  commandMenuOpen = false,
  loadModelData,
  isChatActive,
  chatStatus,
  isLoading,
  messages,
  inputRef: externalInputRef,
  setActiveCommand,
  oracleCommandList,
}: OracleInputProps) {
  console.log('🚀 ~ isChatActive:', isChatActive)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
  const [value, setValue] = useState(inputValue || '')

  // Update local value when inputValue prop changes
  useEffect(() => {
    setValue(inputValue || '')
  }, [inputValue])

  // Simplified input handling - just toggle command menu visibility
  const handleInputFocus = () => {
    if (value.startsWith('/')) {
      setCommandMenuOpen(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    console.log('🚀 ~ handleChange ~ newValue:', newValue)

    setValue(newValue)
    // Pass the event to maintain compatibility with parent component
    setInputValue(e)
  }

  // Handle the '/' key specially
  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setActiveCommand(null)
      setValue('')
      return
    }

    if (e.key === '/') {
      if (value === '') {
        e.preventDefault()
        setCommandMenuOpen(true)
      }
    }

    // Handle Enter key for form submission in chat mode
    if (e.key === 'Enter' && !e.shiftKey && isChatActive && value.trim() !== '') {
      e.preventDefault()
      // Dispatch a submit event on the parent form
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitEvent = new Event('submit', {cancelable: true, bubbles: true})
        form.dispatchEvent(submitEvent)
      }
      return
    }

    // Pass to parent handler for other cases
    handleKeyDown(e)
  }

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (messagesContainerRef.current && messages && messages.length > 0) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Get the appropriate button aria-label
  const getButtonAriaLabel = () => {
    if (activeCommand === 'chat' || activeCommand === 'deepresearch') {
      return 'Send message'
    }
    if (activeCommand === 'search') {
      return 'Search database'
    }
    if (activeModel) {
      return `Add ${activeModel} to mindmap`
    }
    return 'Oracle options'
  }

  // Determine if button should be disabled
  const isButtonDisabled =
    isChatActive && (chatStatus === 'generating' || chatStatus === 'in_progress')

  return (
    <>
      <div className='relative flex flex-col w-full'>
        {/* Chat Messages */}
        {isChatActive && messages && messages.length > 0 && (
          <div
            ref={messagesContainerRef}
            className='max-h-[300px] overflow-y-auto mb-4 space-y-3 px-3'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-2.5',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-indigo-900/20 text-indigo-500'
                      : 'bg-emerald-500/20 text-emerald-500'
                  )}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>

                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-indigo-500/20 text-indigo-100'
                      : 'bg-neutral-800 text-neutral-100'
                  )}>
                  {message.role === 'user' ? (
                    <>{message.content}</>
                  ) : (
                    <MarkdownContent
                      id={message.id}
                      content={message.content}
                      className='max-w-full'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='relative flex items-center flex-wrap gap-2 px-3 h-auto min-h-[48px] z-50'>
          {/* Input Container */}
          <div
            className='rounded-xl border border-transparent flex gap-2 items-center relative w-full p-2 px-2.5 duration-200 border border-white/30 border-neutral-700/30 text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90'
            style={{
              borderRadius: 25,
              padding: '12px 16px',
            }}>
            {/* Input Section */}
            <div className='flex items-center gap-1 justify-start w-full'>
              <div className='w-6 h-6 rounded-full flex items-center justify-center'>
                {value?.startsWith('/') && <SlashIcon className='h-6 w-6' fill={ICON_GREEN} />}
              </div>

              <input
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                // disabled={isButtonDisabled}
                placeholder={
                  isChatActive
                    ? chatStatus === 'in_progress' || chatStatus === 'generating'
                      ? 'AI is thinking...'
                      : 'Chat with AI...'
                    : activeCommand === 'scrape'
                      ? 'Enter a URL to scrape (https://...)...'
                      : activeCommand
                        ? 'Type your message...'
                        : 'Type / for commands...'
                }
                className={cn(
                  'bg-transparent text-zinc-200 text-sm focus:outline-none flex-1',
                  isButtonDisabled && 'opacity-60 cursor-not-allowed'
                )}
              />

              <button
                type='submit'
                disabled={isButtonDisabled}
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center ml-auto',
                  isButtonDisabled && 'opacity-60 cursor-not-allowed'
                )}
                aria-label={getButtonAriaLabel()}>
                {activeModel ? (
                  <AddIcon className='h-6 w-6' fill={ICON_GREEN} />
                ) : (
                  <OracleIcon
                    className={cn(
                      'h-6 w-6',
                      isButtonDisabled &&
                        'animate-spin transition duration-700 animation-duration-3s'
                    )}
                    fill={ICON_GREEN}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
