'use client'

import type React from 'react'
import {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import {useAutoResizeTextarea} from '../../../hooks/useAutoResizeTextArea'
import {Separator} from '@/components/ui/separator'
import {toast} from 'sonner'
import {
  Database,
  ExternalLink,
  ImageIcon,
  Figma,
  MonitorIcon,
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
  FileText,
  FileImage,
  File,
  ExpandIcon as ArrowsExpand,
  ListChecks,
  Tag,
  ChevronRight,
  Network,
  Lightbulb,
  Zap,
  X,
} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/lib/utils'
import {Textarea} from '../../../components/ui/textarea'
import {extractTextFromFile} from '@/services/ai/prometheus/lib/prometheus-file-handler'
import ErrorBoundary from '../../../components/error-boundary'

import {handleFileAction} from '@/services/ai/prometheus/lib/prometheus-file-handler'
import {DocumentActions} from './lib/prometheus-document-actions'

interface CommandSuggestion {
  icon: React.ReactNode
  label: string
  description: string
  prefix: string
}

interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  progress: number
  status: 'uploading' | 'success' | 'error'
  file: File
}

interface ProcessingState {
  type: 'summary' | 'topics' | 'sentiment' | null
  isProcessing: boolean
  result: string | string[] | Record<string, unknown> | null
}

// Export the Agent component as a named export
export function Prometheus() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1)
  const [recentCommand, setRecentCommand] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
  const [inputFocused, setInputFocused] = useState(false)
  const commandPaletteRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null)
  const [showDocumentMenu, setShowDocumentMenu] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    type: null,
    isProcessing: false,
    result: null,
  })

  // Add a state to track PDF.js availability
  const [isPdfJsAvailable, setIsPdfJsAvailable] = useState(false)

  const {textareaRef, adjustHeight} = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })

  const commandSuggestions: CommandSuggestion[] = useMemo(() => [
    {
      icon: <ImageIcon className='w-4 h-4' />,
      label: 'Analyze Sighting',
      description: 'Use OpenAI Assistant to analyze UAP sighting reports',
      prefix: '/analyze',
    },
    {
      icon: <Database className='w-4 h-4' />,
      label: 'Search Knowledge',
      description: 'Search OpenAI vector store for UAP information',
      prefix: '/search',
    },
    {
      icon: <Network className='w-4 h-4' />,
      label: 'Search External',
      description: 'Search trusted external UFO/UAP websites with Exa AI',
      prefix: '/external',
    },
    {
      icon: <Lightbulb className='w-4 h-4' />,
      label: 'Deep Research',
      description: 'Conduct comprehensive research using Exa AI Research Pro',
      prefix: '/research',
    },
    {
      icon: <MonitorIcon className='w-4 h-4' />,
      label: 'Research Topic',
      description: 'Deep research using OpenAI Assistant capabilities',
      prefix: '/topic',
    },
    {
      icon: <Sparkles className='w-4 h-4' />,
      label: 'Connect Dots',
      description: 'Find connections using assistant knowledge base',
      prefix: '/connect',
    },
  ], [])

  useEffect(() => {
    if (input.startsWith('/') && !input.includes(' ')) {
      setShowCommandPalette(true)

      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(input)
      )

      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex)
      } else {
        setActiveSuggestion(-1)
      }
    } else {
      setShowCommandPalette(false)
    }
  }, [input])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY})
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const commandButton = document.querySelector('[data-command-button]')

      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1))
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion]
          setInput(selectedCommand.prefix + ' ')
          setShowCommandPalette(false)

          setRecentCommand(selectedCommand.label)
          setTimeout(() => setRecentCommand(null), 3500)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowCommandPalette(false)
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      toast.warning('Please enter a question or request', {
        closeButton: true,
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setResponse('')

    try {
      // Prepare file attachments content if any
      const attachmentContents = []
      for (const attachment of attachments) {
        if (attachment.status === 'success') {
          try {
            const text = await extractTextFromFile(attachment.file)
            attachmentContents.push({
              fileName: attachment.name,
              fileType: attachment.type,
              content: text,
            })
          } catch (error) {
            console.error(`Failed to extract text from ${attachment.name}:`, error)
            // Continue with other attachments even if one fails
          }
        }
      }

      // Prepare the user message with attachments
      const userPrompt = `${input}
${attachmentContents.length > 0 ? '\nAttached Documents:' : ''}
${attachmentContents
  .map(
    (att, index) =>
      `Document ${index + 1}: ${att.fileName} (${att.fileType})
Content: ${att.content.substring(0, 1000)}${att.content.length > 1000 ? '...' : ''}
`
  )
  .join('\n')}`

      // Call the new hybrid API route
      const response = await fetch('/api/prometheus/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{role: 'user', content: userPrompt}],
        }),
      })

      console.log('🚀 ~ handleSubmit ~ response:', response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()

      console.log('🚀 ~ handleSubmit ~ reader:', reader)

      if (!reader) {
        throw new Error('No response body reader available')
      }

      const decoder = new TextDecoder()
      let fullResponse = ''

      try {
        while (true) {
          const {done, value} = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, {stream: true})
          // Parse streaming chunks (typically newline-delimited JSON)
          const lines = chunk.split('\n').filter((line) => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullResponse += parsed.content
                  setResponse(fullResponse)
                }
              } catch (e) {
                // Skip unparseable chunks
                console.debug('Skipped chunk:', data)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Show success toast with file count if attachments were used
      if (attachmentContents.length > 0) {
        toast.success(
          `Processed query with ${attachmentContents.length} document${
            attachmentContents.length > 1 ? 's' : ''
          } using Langbase knowledge`,
          {
            duration: 3000,
          }
        )
      }
    } catch (error: unknown) {
      console.error('Error processing request:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request'
      toast.error(errorMessage, {
        closeButton: true,
        duration: 10000,
      })
    } finally {
      setIsLoading(false)
      setInput('')
      adjustHeight(true)

      // Note: We intentionally don't clear attachments here
      // so they remain available for further questions
    }
  }

  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const allowedTypes = [
      'text/plain', // .txt
      'text/markdown', // .md
      'application/pdf', // .pdf
      'image/jpeg', // .jpg, .jpeg
      'image/png', // .png
      'image/gif', // .gif
      'image/webp', // .webp
      'image/svg+xml', // .svg
      'text/html', // .html
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ]

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
        toast.error(`File type not supported: ${file.type}`, {
          description: 'Please upload .txt, .md, .pdf, .html, .doc, .docx, or image files only.',
          duration: 5000,
        })
        return
      }

      // PDF files are handled with pdf-lib
      if (file.type === 'application/pdf') {
        toast.info('PDF processing', {
          description: 'PDF metadata will be extracted for analysis.',
          duration: 3000,
        })
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      // Add file to attachments with initial progress
      setAttachments((prev) => [
        ...prev,
        {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          progress: 0,
          status: 'uploading',
          file,
        },
      ])

      // Simulate file upload with progress
      simulateFileUpload(fileId, file)
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateFileUpload = async (fileId: string, file: File) => {
    // Set initial status
    setAttachments((prev) => prev.map((att) => (att.id === fileId ? {...att, progress: 10} : att)))

    try {
      // Simulate realistic progress to improve user experience
      let progress = 10
      const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5

        if (progress >= 90) {
          clearInterval(progressInterval)
          progress = 90
        }

        setAttachments((prev) => prev.map((att) => (att.id === fileId ? {...att, progress} : att)))
      }, 300)

      // Process file immediately instead of simulating upload
      // Extract text from file to verify it can be processed
      await extractTextFromFile(file)

      // Clear interval if still running
      clearInterval(progressInterval)

      // Update progress to 100% and keep status as success
      setAttachments((prev) =>
        prev.map((att) => (att.id === fileId ? {...att, progress: 100, status: 'success'} : att))
      )

      toast.success(`File ready: ${file.name}`, {
        duration: 3000,
      })
    } catch (error: unknown) {
      console.error(`Error processing file ${file.name}:`, error)

      // Update status to error but keep the file visible
      setAttachments((prev) =>
        prev.map((att) => (att.id === fileId ? {...att, status: 'error'} : att))
      )

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to process file: ${errorMessage}`, {
        duration: 5000,
      })
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className='w-3 h-3' />
    } else if (fileType === 'application/pdf') {
      return <FileText className='w-3 h-3' />
    } else if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return <FileText className='w-3 h-3' />
    } else {
      return <File className='w-3 h-3' />
    }
  }

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index]
    setInput(selectedCommand.prefix + ' ')
    setShowCommandPalette(false)

    setRecentCommand(selectedCommand.label)
    setTimeout(() => setRecentCommand(null), 2000)
  }

  const handleFileSelect = (file: FileAttachment) => {
    if (file.status === 'success') {
      // Handle PDF files consistently
      if (file.type === 'application/pdf') {
        toast.info('PDF document selected', {
          description: 'Choose an action to process this document.',
          duration: 2000,
        })
      }

      setSelectedFile(file)
      setShowDocumentMenu(true)
    }
  }

  const closeDocumentMenu = () => {
    setShowDocumentMenu(false)
    setSelectedFile(null)
  }

  const closeProcessingResult = () => {
    setProcessingState({
      type: null,
      isProcessing: false,
      result: null,
    })
  }

  const handleDocumentAction = async (action: string) => {
    if (!selectedFile) return

    // Close the document menu
    closeDocumentMenu()

    try {
      // Use the new file handler from prometheus-file-handler.ts
      await handleFileAction(action, selectedFile, isPdfJsAvailable, (newState) => {
        setProcessingState(newState)
      })
    } catch (error: unknown) {
      console.error(`Error processing document action ${action}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to ${action.toLowerCase()}: ${errorMessage}`, {
        duration: 5000,
      })

      // Reset processing state
      setProcessingState({
        type: null,
        isProcessing: false,
        result: null,
      })
    }
  }

  // PDF.js warning has been removed
  const renderPdfJsWarning = () => {
    return null
  }

  return (
    <ErrorBoundary>
      <div className='w-full mx-auto relative z-10'>
        <motion.div
          layout
          className='relative z-10 space-y-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, ease: 'easeOut'}}>
          <div className='text-center space-y-3'>
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.5}}
              className='inline-block'>
              <h1 className='text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1'>
                Prometheus
                <br />
                <span className='text-sm font-light pt-4'>Steward of Mankind</span>
              </h1>

              <motion.div
                className='h-px bg-gradient-to-r from-transparent via-white/20 to-transparent'
                initial={{width: 0, opacity: 0}}
                animate={{width: '100%', opacity: 1}}
                transition={{delay: 0.5, duration: 0.8}}
              />
            </motion.div>
          </div>

          {/* Display PDF.js warning if needed */}
          {renderPdfJsWarning()}

          <motion.div
            className='relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl z-50'
            layout
            initial={{scale: 0.98}}
            animate={{scale: 1}}
            transition={{delay: 0.1, staggerChildren: 0.1}}>
            <div className='p-4 relative'>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  adjustHeight()
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder='Ask about UAPs/UFOs or request to ingest specific URLs...'
                className={cn(
                  'w-full px-4 py-3',
                  'resize-none',
                  'bg-transparent',
                  'border-none',
                  'text-white/90 text-sm',
                  'focus:outline-none',
                  'placeholder:text-white/20',
                  'min-h-[60px]'
                )}
                style={{
                  overflow: 'hidden',
                }}
              />
            </div>
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  className='absolute left-4 right-4 top-full mt-2 backdrop-blur-xl bg-black/90 rounded-lg shadow-lg border border-white/10 overflow-hidden z-40'
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.97,
                    transformOrigin: 'top center',
                  }}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  exit={{opacity: 0, y: -10, scale: 0.97}}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                  style={{
                    boxShadow:
                      '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  }}>
                  <div className='py-1 bg-black/95'>
                    {commandSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.prefix}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer',
                          activeSuggestion === index
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5'
                        )}
                        onClick={() => selectCommandSuggestion(index)}
                        initial={{opacity: 0, y: -5}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                          delay: index * 0.03,
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}>
                        <div className='w-5 h-5 flex items-center justify-center text-white/60'>
                          {suggestion.icon}
                        </div>
                        <div className='font-medium'>{suggestion.label}</div>
                        <div className='text-white/40 text-xs ml-1'>{suggestion.prefix}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  className='px-4 pb-3 flex gap-2 flex-wrap'
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: 'auto'}}
                  exit={{opacity: 0, height: 0}}>
                  {attachments.map((attachment) => (
                    <motion.div
                      key={attachment.id}
                      className={cn(
                        'flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg relative',
                        attachment.status === 'uploading' ? 'bg-white/[0.01]' : 'bg-white/[0.03]',
                        attachment.status === 'error' ? 'border border-red-500/20' : '',
                        attachment.status === 'success'
                          ? 'cursor-pointer hover:bg-white/[0.05] border border-white/10'
                          : ''
                      )}
                      initial={{opacity: 0, scale: 0.9, y: 10}}
                      animate={{opacity: 1, scale: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.9, y: 10}}
                      onClick={() =>
                        attachment.status === 'success' && handleFileSelect(attachment)
                      }
                      whileHover={attachment.status === 'success' ? {scale: 1.03} : {}}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}>
                      <span className='flex items-center gap-1.5 text-white/70'>
                        {getFileIcon(attachment.type)}
                        {attachment.name}

                        {attachment.status === 'uploading' && (
                          <span className='text-xs text-white/40 ml-1'>
                            {Math.round(attachment.progress)}%
                          </span>
                        )}

                        {attachment.status === 'success' && (
                          <span className='text-xs text-green-400/70 ml-1'>Ready</span>
                        )}

                        {attachment.status === 'error' && (
                          <span className='text-xs text-red-400/70 ml-1'>Error</span>
                        )}
                      </span>

                      {/* Progress bar for uploading files */}
                      {attachment.status === 'uploading' && (
                        <div className='h-0.5 w-full absolute bottom-0 left-0 bg-white/10 overflow-hidden rounded-b-lg'>
                          <motion.div
                            className='h-full bg-white/30'
                            initial={{width: 0}}
                            animate={{width: `${attachment.progress}%`}}
                            transition={{ease: 'easeOut'}}
                          />
                        </div>
                      )}

                      {/* Success indicator */}
                      {attachment.status === 'success' && (
                        <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/20' />
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAttachment(attachment.id)
                        }}
                        className='text-white/40 hover:text-white transition-colors'>
                        <XIcon className='w-3 h-3' />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className='p-4 border-t border-white/[0.05] flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='.txt,.md,.pdf,.html,.doc,.docx,image/*'
                  multiple
                  className='hidden'
                />
                <motion.button
                  type='button'
                  onClick={handleAttachFile}
                  whileTap={{scale: 0.94}}
                  className='p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group'>
                  <Paperclip className='w-4 h-4' />
                  <motion.span
                    className='absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    layoutId='button-highlight'
                  />
                </motion.button>
                <motion.button
                  type='button'
                  data-command-button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCommandPalette((prev) => !prev)
                  }}
                  whileTap={{scale: 0.94}}
                  className={cn(
                    'p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group',
                    showCommandPalette && 'bg-white/10 text-white/90'
                  )}>
                  <Command className='w-4 h-4' />
                  <motion.span
                    className='absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    layoutId='button-highlight'
                  />
                </motion.button>
                <motion.button
                  type='button'
                  onClick={() => setShowResources(!showResources)}
                  whileTap={{scale: 0.94}}
                  className={cn(
                    'p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group',
                    showResources && 'bg-white/10 text-white/90'
                  )}>
                  <Database className='w-4 h-4' />
                  <motion.span
                    className='absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    layoutId='button-highlight'
                  />
                </motion.button>
              </div>

              <motion.button
                type='button'
                onClick={handleSubmit}
                whileHover={{scale: 1.01}}
                whileTap={{scale: 0.98}}
                disabled={isLoading || !input.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  'flex items-center gap-2',
                  input.trim()
                    ? 'bg-white text-[#0A0A0B] shadow-lg shadow-white/10'
                    : 'bg-white/[0.05] text-white/40'
                )}>
                {isLoading ? (
                  <LoaderIcon className='w-4 h-4 animate-[spin_2s_linear_infinite]' />
                ) : (
                  <SendIcon className='w-4 h-4' />
                )}
                <span>Send</span>
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showResources && (
              <motion.div
                layout
                initial={{opacity: 0, y: -20, scale: 0.98}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -20, scale: 0.98}}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: 0.1,
                }}
                className='backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl p-6 absolute top-full mt-2 left-0 w-full z-40'
                style={{
                  transformOrigin: 'top center',
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}>
                <h2 className='text-xl font-semibold mb-2 flex items-center gap-2 text-white/90'>
                  <Database className='h-5 w-5' />
                  Knowledge Base Resources
                </h2>
                <p className='text-white/60 mb-4 text-sm'>
                  Prometheus uses OpenAI Assistant API with specialized UAP vector store:
                </p>
                <div className='max-h-[200px] overflow-y-auto pr-2'>
                  <div className='space-y-3'>
                    <motion.div
                      className='flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]'
                      initial={{opacity: 0, y: 5}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.1}}>
                      <div className='w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                        <Database className='h-4 w-4 text-green-400' />
                      </div>
                      <div>
                        <div className='text-white/90 font-medium text-sm'>OpenAI Assistant</div>
                        <div className='text-white/60 text-xs'>Party Martian Assistant (asst_sdNxYC9p05iGpeKXtL496cyh)</div>
                      </div>
                    </motion.div>
                    <motion.div
                      className='flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]'
                      initial={{opacity: 0, y: 5}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.2}}>
                      <div className='w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center'>
                        <Sparkles className='h-4 w-4 text-blue-400' />
                      </div>
                      <div>
                        <div className='text-white/90 font-medium text-sm'>Vector Store</div>
                        <div className='text-white/60 text-xs'>UFO Data Store (vs_meWOEnUiUxtQWf0W6NBsNpCG)</div>
                      </div>
                    </motion.div>
                    <motion.div
                      className='flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]'
                      initial={{opacity: 0, y: 5}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.3}}>
                      <div className='w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center'>
                        <FileText className='h-4 w-4 text-purple-400' />
                      </div>
                      <div>
                        <div className='text-white/90 font-medium text-sm'>Knowledge Base</div>
                        <div className='text-white/60 text-xs'>90+ UAP/UFO research sources with vector search</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {response && (
              <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 10}}
                className='backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-center'>
                    <span className='text-xs font-medium text-white/90 mb-0.5'>zap</span>
                  </div>
                  <h2 className='text-xl font-semibold text-white/90'>Response</h2>
                </div>
                <Separator className='mb-4 bg-white/10' />
                <div className='text-white/80 whitespace-pre-line text-sm leading-relaxed'>
                  {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className='fixed bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-4 py-2 shadow-lg border border-white/[0.05]'
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 20}}>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-center'>
                  <span className='text-xs font-medium text-white/90 mb-0.5'>zap</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-white/70'>
                  <span>Thinking</span>
                  <TypingDots />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {inputFocused && (
          <motion.div
            className='fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]'
            animate={{
              x: mousePosition.x - 400,
              y: mousePosition.y - 400,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 150,
              mass: 0.5,
            }}
          />
        )}

        {/* Document Options Menu */}
        <AnimatePresence>
          {showDocumentMenu && selectedFile && (
            <motion.div
              initial={{opacity: 0, y: 10, scale: 0.95}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 10, scale: 0.95}}
              transition={{type: 'spring', stiffness: 300, damping: 30}}
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
              onClick={closeDocumentMenu}>
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className='w-80 backdrop-blur-2xl bg-black/90 rounded-xl border border-white/[0.05] shadow-2xl overflow-hidden'
                initial={{y: 20}}
                animate={{y: 0}}
                transition={{type: 'spring', stiffness: 400, damping: 30}}>
                <div className='flex items-center justify-between p-4 border-b border-white/[0.05]'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-center'>
                      <span className='text-xs font-medium text-white/90 mb-0.5'>P</span>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-white/90'>PROMETHEUS</h3>
                      <p className='text-xs text-white/50'>Document Options</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDocumentMenu}
                    className='text-white/40 hover:text-white/90 transition-colors'>
                    <X className='w-4 h-4' />
                  </button>
                </div>

                <div className='p-2'>
                  <div className='px-2 py-3 border-b border-white/[0.05]'>
                    <div className='flex items-center gap-2'>
                      {getFileIcon(selectedFile.type)}
                      <span className='text-sm text-white/90 font-medium'>{selectedFile.name}</span>
                    </div>
                    <div className='text-xs text-white/50 mt-1'>
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1]}
                    </div>
                  </div>

                  <DocumentActions selectedFile={selectedFile} onAction={handleDocumentAction} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Processing Results */}
        <AnimatePresence>
          {processingState.isProcessing && selectedFile && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
              <DocumentProcessing
                fileName={selectedFile.name}
                action={
                  processingState.type === 'summary'
                    ? 'Summarizing document...'
                    : 'Extracting topics...'
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

function TypingDots() {
  return (
    <div className='flex items-center ml-1'>
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className='w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5'
          initial={{opacity: 0.3}}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: dot * 0.15,
            ease: 'easeInOut',
          }}
          style={{
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
    </div>
  )
}

// Simple DocumentProcessing component
function DocumentProcessing({ fileName, action }: { fileName: string; action: string }) {
  return (
    <div className='w-80 backdrop-blur-2xl bg-black/90 rounded-xl border border-white/[0.05] shadow-2xl p-6'>
      <div className='text-center space-y-4'>
        <div className='w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto'>
          <LoaderIcon className='w-6 h-6 animate-spin text-white/70' />
        </div>
        <div>
          <h3 className='text-lg font-medium text-white/90 mb-1'>Processing Document</h3>
          <p className='text-sm text-white/60'>{fileName}</p>
          <p className='text-xs text-white/40 mt-2'>{action}</p>
        </div>
      </div>
    </div>
  )
}

// Also export as default for compatibility
export default Prometheus