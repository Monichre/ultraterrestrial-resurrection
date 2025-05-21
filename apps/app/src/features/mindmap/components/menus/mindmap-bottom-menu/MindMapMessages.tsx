import {useRef, useCallback} from 'react'
import {cn} from '@/utils'
import {MarkdownContent} from '@/components/ui/chat/markdown-content'
import {BookmarkIcon} from 'lucide-react'
import {useToast} from '@/components/ui/use-toast'
import type {Message as AISdkMessage} from '@ai-sdk/react'

export type MessagePart = {
  type: 'text' | 'source' | 'reasoning' | 'tool-invocation' | 'file'
  text?: string
  source?: {
    url: string
    title?: string
  }
  reasoning?: string
  toolInvocation?: {
    toolName: string
    [key: string]: unknown
  }
  mimeType?: string
  data?: string
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  parts?: MessagePart[]
}

// Adapter function to convert AI SDK messages to our format
export function convertAiSdkMessage(message: AISdkMessage): Message {
  return {
    id: message.id,
    role:
      message.role === 'user' || message.role === 'assistant'
        ? message.role
        : message.role === 'system'
          ? 'assistant'
          : 'user',
    content: message.content,
    // Additional part conversion could be added here if needed
    parts: Array.isArray(message.parts) ? (message.parts as MessagePart[]) : undefined,
  }
}

type MindMapMessagesProps = {
  messages: Message[] | AISdkMessage[]
  onSaveAsNote?: (message: Message) => void
}

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

export const MindMapMessages = ({messages, onSaveAsNote}: MindMapMessagesProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const {toast} = useToast()

  // Convert AI SDK messages to our format if needed
  const normalizedMessages = messages.map((msg) =>
    'role' in msg && typeof msg.role === 'string' && (msg.role === 'data' || msg.role === 'system')
      ? convertAiSdkMessage(msg as AISdkMessage)
      : (msg as Message)
  )

  const handleSaveAsNote = useCallback(
    (message: Message) => {
      if (onSaveAsNote) {
        onSaveAsNote(message)
        toast({
          title: 'Saved to Session Notes',
          description: 'Message has been saved to your session notes',
        })
      } else {
        // Fallback if no handler is provided
        const noteData = {
          id: `note-${Date.now()}`,
          title: `AI Response ${new Date().toLocaleTimeString()}`,
          content: message.content,
          tags: ['ai-response', 'mind-map'],
          timestamp: new Date().toISOString(),
        }

        // Store in localStorage for now as a fallback
        const existingNotes = JSON.parse(localStorage.getItem('session-notes') || '[]')
        localStorage.setItem('session-notes', JSON.stringify([noteData, ...existingNotes]))

        toast({
          title: 'Saved to Local Storage',
          description: 'No handler provided. Message saved to local storage as fallback.',
        })
      }
    },
    [onSaveAsNote, toast]
  )

  return (
    <div ref={messagesContainerRef} className='max-h-[300px] overflow-y-auto mb-4 space-y-3 px-3'>
      {normalizedMessages.map((message) => (
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
              'px-4 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed relative group',
              message.role === 'user'
                ? 'bg-indigo-500/20 text-indigo-100'
                : 'bg-neutral-800 text-neutral-100'
            )}>
            {message.role === 'assistant' && (
              <button
                type='button'
                onClick={() => handleSaveAsNote(message)}
                className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-700 rounded-full'
                title='Save as note'>
                <BookmarkIcon size={14} className='text-emerald-300' />
              </button>
            )}

            {message.role === 'user' ? (
              <>{message.content}</>
            ) : message.parts && message.parts.length > 0 ? (
              <div className='message-parts space-y-2'>
                {message.parts.map((part, index) => renderMessagePart(part, index, message.id))}
              </div>
            ) : (
              <MarkdownContent id={message.id} content={message.content} className='max-w-full' />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
