import {AddIcon, OracleIcon, SlashIcon} from '@/components/icons'
import {MarkdownContent} from '@/components/ui/chat/markdown-content'
import {cn} from '@/utils/cn'
import {ICON_GREEN} from '@/utils/constants'
import {Brain} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {SendIcon} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'
import {Button} from '@/components/ui/button'
import {MindMapMessages} from '@/features/mindmap/components/menus/mindmap-bottom-menu/MindMapMessages'

export interface OracleCommandType {
  value: string
  label: string
  description?: string
  category?: string
  isComingSoon?: boolean
}

type MessagePartType = 'text' | 'reasoning' | 'source' | 'tool-invocation' | 'file'

interface MessagePart {
  type: MessagePartType
  text?: string
  reasoning?: string
  source?: {url: string; title?: string}
  toolInvocation?: {toolName: string; [key: string]: unknown}
  mimeType?: string
  data?: string
  [key: string]: unknown
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  parts?: MessagePart[]
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
  messages?: Message[]
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

  // Function to render message parts based on their type
  const renderMessagePart = (part: MessagePart, index: number, messageId: string) => {
    switch (part.type) {
      case 'text':
        return <p key={`${messageId}-part-${index}`}>{part.text}</p>

      case 'source':
        return (
          <div
            key={`${messageId}-part-${index}`}
            className='source-part mt-2 p-2 border border-neutral-700 rounded-md bg-neutral-900'>
            <p className='text-xs text-neutral-400'>Source:</p>
            <a
              href={part.source?.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-cyan-400 underline text-sm'>
              {part.source?.title || part.source?.url}
            </a>
          </div>
        )

      case 'reasoning':
        return (
          <div
            key={`${messageId}-part-${index}`}
            className='reasoning-part my-2 p-2 bg-neutral-800/50 rounded-md border-l-2 border-amber-500'>
            <p className='text-xs text-amber-500 mb-1'>Reasoning:</p>
            <MarkdownContent
              id={`${messageId}-reasoning-${index}`}
              content={part.reasoning || ''}
              className='text-amber-100 text-xs italic'
            />
          </div>
        )

      case 'tool-invocation':
        return (
          <div
            key={`${messageId}-part-${index}`}
            className='tool-part my-2 p-2 bg-indigo-900/30 rounded-md border border-indigo-700/50'>
            <p className='text-xs text-indigo-400 mb-1'>Tool: {part.toolInvocation?.toolName}</p>
            <pre className='text-xs overflow-x-auto bg-black/30 p-2 rounded'>
              {JSON.stringify(part.toolInvocation, null, 2)}
            </pre>
          </div>
        )

      case 'file':
        if (part.mimeType?.startsWith('image/')) {
          return (
            <div key={`${messageId}-part-${index}`} className='file-part my-2'>
              <p className='text-xs text-neutral-400 mb-1'>Image:</p>
              <img
                src={`data:${part.mimeType};base64,${part.data}`}
                alt='Attached file'
                className='max-w-full rounded-md border border-neutral-700'
              />
            </div>
          )
        }

        return (
          <div
            key={`${messageId}-part-${index}`}
            className='file-part my-2 p-2 bg-neutral-800 rounded-md'>
            <p className='text-xs text-neutral-400'>File attachment (MIME type: {part.mimeType})</p>
          </div>
        )

      default:
        return null
    }
  }

  // Function to normalize message parts type
  const normalizeMessageParts = (message: Message): Message => {
    if (!message.parts) return message

    return {
      ...message,
      parts: message.parts.map((part) => {
        // Ensure part.type is one of the valid MessagePartType values
        let normalizedType: MessagePartType = 'text'

        if (
          part.type === 'text' ||
          part.type === 'reasoning' ||
          part.type === 'source' ||
          part.type === 'tool-invocation' ||
          part.type === 'file'
        ) {
          normalizedType = part.type
        } else if (part.toolInvocation) {
          normalizedType = 'tool-invocation'
        } else if (part.source) {
          normalizedType = 'source'
        } else if (part.reasoning) {
          normalizedType = 'reasoning'
        } else if (part.mimeType) {
          normalizedType = 'file'
        }

        return {
          ...part,
          type: normalizedType,
        }
      }),
    }
  }

  return (
    <>
      <div className='relative flex flex-col w-full'>
        {/* Chat Messages */}
        {isChatActive && messages && messages.length > 0 && (
          <MindMapMessages
            messages={messages.map((msg) => {
              const normalizedRole =
                msg.role === 'user' || msg.role === 'assistant'
                  ? msg.role
                  : msg.role === 'system'
                    ? 'assistant'
                    : 'user'

              return normalizeMessageParts({
                ...msg,
                role: normalizedRole,
              })
            })}
          />
        )}

        <div className='relative flex items-center flex-wrap gap-2  h-auto min-h-[48px] z-50'>
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
                // disabled={isButtonDisabled}
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
