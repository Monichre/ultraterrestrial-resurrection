'use client'

import type React from 'react'
import {useState, useEffect, useRef} from 'react'
import {animate, AnimatePresence, motion, useMotionValue, useTransform} from 'framer-motion'
import {toast} from 'sonner'
import {Send, Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface AIChatProps {
  name?: string
  description?: string
}

export default function AnimatedChat(props: AIChatProps) {
  const {
    name = 'Prometheus',
    description = 'Prometheus is an advanced AI research assistant specializing in UAP/UFO phenomena analysis. I help researchers and analysts understand complex patterns, connections, and insights within the UAP research domain.',
  } = props

  const [state, setState] = useState(0)
  const [showFullChat, setShowFullChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const initialWidth = 370
  const animateWidth = 560

  const items = [
    {
      icon: <BookIcon />,
      title: 'Analyze Sighting',
      description: 'Analyze a UAP sighting report and extract key details.',
    },
    {
      icon: <DocumentIcon />,
      title: 'Connect the Dots',
      description: 'Find connections between UAP events and patterns.',
    },
    {
      icon: <ChatIcon />,
      title: 'Research Topic',
      description: 'Deep research on a UAP/UFO topic with citations.',
    },
  ]

  useEffect(() => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const runSequence = async () => {
      await wait(3000)
      setState(1)

      await wait(650)
      setState(2)

      await wait(2000)
      setState(3)

      await wait(1500)
      setState(4)

      await wait(2000)
      setState(5)
    }

    runSequence()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)
    setShowFullChat(true)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedText = ''

      while (true) {
        const {done, value} = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                accumulatedText += parsed.text
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? {...msg, content: accumulatedText} : msg
                  )
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      setError(error.message)
      toast.error('Failed to get response: ' + error.message)
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  if (showFullChat) {
    return (
      <div className='flex h-screen w-full items-center justify-center p-4'>
        <div className='flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#1A1B1C] bg-gradient-to-b from-[#090A0B] to-[#0E0E10] shadow-2xl'>
          {/* Header */}
          <div className='flex items-center gap-3 border-b border-[#1A1B1C] bg-[#0A0A0B] p-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-800'>
              <span className='text-lg font-bold text-white'>P</span>
            </div>
            <div>
              <h1 className='text-lg font-semibold text-white'>Prometheus</h1>
              <p className='text-xs text-gray-400'>Steward of Mankind</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className='flex-1 space-y-4 overflow-y-auto p-6'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#1A1B1C] text-gray-300'
                  }`}>
                  <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='max-w-[80%] rounded-lg bg-[#1A1B1C] px-4 py-2 text-gray-300'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 animate-pulse rounded-full bg-violet-500' />
                    <div
                      className='h-2 w-2 animate-pulse rounded-full bg-violet-500'
                      style={{animationDelay: '0.2s'}}
                    />
                    <div
                      className='h-2 w-2 animate-pulse rounded-full bg-violet-500'
                      style={{animationDelay: '0.4s'}}
                    />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className='flex justify-center'>
                <div className='max-w-[80%] rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-red-400'>
                  <div className='mb-1 text-sm font-medium'>Error</div>
                  <div className='text-sm'>{error}</div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className='border-t border-[#1A1B1C] bg-[#0A0A0B] p-4'>
            <div className='flex items-center gap-2'>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask about UAPs/UFOs...'
                className='flex-1 rounded-lg border border-[#1A1B1C] bg-[#0E0E10] px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:border-violet-500 focus:outline-none resize-none min-h-[40px] max-h-[200px]'
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50'>
                {isLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <Send className='h-5 w-5' />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto flex h-[380px] w-[600px] items-center justify-center text-[14px] text-[#c2e6eb8f]'>
      <motion.div
        initial={{width: initialWidth}}
        animate={{width: state === 0 ? initialWidth : animateWidth}}
        transition={{
          type: 'spring',
          bounce: 0.3,
          ease: 'linear',
        }}
        className='relative'>
        <motion.div
          initial={{y: 12, opacity: 0}}
          animate={{opacity: state === 0 ? 0 : 1, y: state === 0 ? 12 : 0}}
          transition={{duration: 0.3, ease: 'easeOut', delay: 0.1}}
          className='absolute -top-3 left-4 right-4 h-3 rounded-t-[10px] backdrop-blur-[4px]'
          style={{
            background:
              'linear-gradient(180deg,rgba(240,254,255,.06) 0%,rgba(240,254,255,0) 100%),rgba(194,230,235,.02)',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTop: '1px solid #c2e6eb14',
            borderBottom: 'none',
          }}
        />
        <motion.div
          initial={{y: -12, opacity: 0}}
          animate={{opacity: state === 0 ? 0 : 1, y: state === 0 ? -12 : 0}}
          transition={{duration: 0.3, ease: 'easeOut', delay: 0.1}}
          className='absolute -bottom-3 left-4 right-4 h-3 rounded-b-[10px] backdrop-blur-[4px]'
          style={{
            background:
              'linear-gradient(180deg,rgba(240,254,255,0) 0%,rgba(240,254,255,.06) 100%),rgba(194,230,235,.02)',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderBottom: '1px solid #c2e6eb14',
            borderTop: 'none',
          }}
        />
        <div
          className='relative overflow-hidden rounded-[10px]'
          style={{
            boxShadow:
              '0 0 24px #b9e7ec14 inset,0 -4px 12px #b9e7ec0f inset,0 1px 1px #b9e7ec1f inset',
            background: '#c2e6eb0a',
            backdropFilter: 'blur(2px)',
          }}>
          <form onSubmit={handleSubmit}>
            <div className='relative flex items-center gap-2 p-3'>
              {state > 2 && (
                <div className='pointer-events-none absolute inset-0 rounded-[inherit] border-b border-[#c2e6eb12]' />
              )}
              <div className='flex text-[#c2e6eb8f]'>
                <SearchIcon />
              </div>
              <input
                type='text'
                value={state <= 1 ? '' : input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={state <= 1 ? 'Ask about anything...' : ''}
                className={`flex-1 bg-transparent text-[14px] font-light leading-5 outline-none ${
                  state <= 1 ? 'text-[#c2e6eb59]' : 'text-[#c2e6ebd4]'
                }`}
              />
              <motion.div
                initial={{opacity: 1}}
                animate={{
                  opacity: state === 0 ? 1 : 0,
                }}
                transition={{duration: 0.3, ease: 'easeOut'}}
                className='rounded-[6px] bg-[#c2e6eb0a] px-[6px] text-[13px] text-[#c2e6eb59]'>
                ⌘ K
              </motion.div>
            </div>
          </form>
          <motion.div
            layout
            initial={{height: 0}}
            animate={{height: state > 2 ? 208 : 0}}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            className='overflow-hidden'>
            <AnimatePresence mode='popLayout'>
              {state < 5 ? (
                <motion.div
                  key='container1'
                  initial={{
                    opacity: 1,
                  }}
                  exit={{
                    x: -180,
                    opacity: 0,
                    transition: {
                      duration: 0.35,
                      ease: 'easeInOut',
                    },
                  }}>
                  <AnimatePresence>
                    {state > 2 && (
                      <div className='relative p-2'>
                        {state >= 4 && (
                          <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{
                              delay: 0.8,
                              duration: 0.25,
                              ease: 'ease',
                            }}
                            className='absolute inset-2 h-9 rounded-[6px] bg-[#c2e6eb0a]'
                          />
                        )}
                        {[{icon: <StarsIcon />, title: '', description: ''}, ...items].map(
                          (item, i) => (
                            <motion.div
                              key={i}
                              layout
                              initial={{y: 40, opacity: 0, filter: 'blur(3px)'}}
                              animate={{y: 0, opacity: 1, filter: 'blur(0px)'}}
                              transition={{
                                duration: 0.4,
                                delay: 0.2 + i * 0.15,
                                ease: 'easeInOut',
                              }}
                              className='flex items-center gap-3 px-3 py-2'>
                              <div className='flex text-[#c2e6eb]'>{item.icon}</div>
                              {i === 0 ? (
                                <div className='flex gap-1'>
                                  <div className='font-medium text-[#c2e6ebd4]'>Ask {name}:</div>
                                  <div>What is {name}?</div>
                                </div>
                              ) : (
                                <div className='flex flex-col'>
                                  <div className='text-[14px]'>{item.title}</div>
                                  <div
                                    className='overflow-x-hidden text-ellipsis whitespace-nowrap text-[12px]'
                                    style={{
                                      width: 260,
                                    }}>
                                    {item.description}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key='container2'
                  initial={{
                    x: 180,
                    opacity: 0,
                  }}
                  animate={{x: 0, opacity: 1}}
                  transition={{
                    duration: 0.35,
                    ease: 'easeInOut',
                  }}
                  className='flex h-full flex-col p-[14px_18px_18px_18px]'>
                  <div className='flex flex-1 items-start gap-4 text-[13px] text-[#c2e6ebd4]'>
                    <span className='h-4 w-4 flex-shrink-0 text-[#c2e6eb]'>
                      <StarsIcon />
                    </span>
                    <div>
                      <Typewriter speed={10} text={description} />
                    </div>
                  </div>
                  <div
                    className='relative flex h-9 items-center rounded-[6px] bg-[#c2e6eb0a] px-3'
                    style={{
                      boxShadow: '0 0 24px #cad7f914 inset,0 1px 1px #c9d7f91f inset',
                    }}>
                    <div className='flex-1 text-[13px] text-[#c2e6eb59]'>Write something...</div>
                    <PaperplaneIcon />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {state === 4 && (
          <motion.div
            initial={{top: 110, right: 140}}
            animate={{top: 75, right: 220}}
            transition={{duration: 1, ease: 'easeIn', delay: 0.1}}
            className='absolute z-40'
            style={{top: 110, right: 30}}>
            <ArrowCursorIcon />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

function Typewriter(props: TypewriterProps) {
  const {text, speed = 30, delay = 0, onComplete} = props
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayedText: any = useTransform(rounded, (latest) => text.slice(0, latest))

  useEffect(() => {
    const controls = animate(count, text.length, {
      delay: delay / 1000,
      duration: (speed * text.length) / 1000,
      ease: 'easeInOut',
      onComplete: () => {
        onComplete?.()
      },
    })

    return controls.stop
  }, [text, speed, delay, count, onComplete])

  return <motion.span>{displayedText}</motion.span>
}

const SearchIcon = () => (
  <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M16.875 16.875L13.4388 13.4388M13.4388 13.4388C14.5321 12.3454 15.2083 10.835 15.2083 9.16667C15.2083 5.82995 12.5034 3.125 9.16667 3.125C5.82995 3.125 3.125 5.82995 3.125 9.16667C3.125 12.5034 5.82995 15.2083 9.16667 15.2083C10.835 15.2083 12.3454 14.5321 13.4388 13.4388Z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
    />
  </svg>
)

const StarsIcon = () => (
  <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M10.8332 6.33325C11.0173 6.33325 11.1665 6.48249 11.1665 6.66658C11.1665 8.65177 11.6043 10.0045 12.4664 10.8666C13.3286 11.7288 14.6813 12.1666 16.6665 12.1666C16.8506 12.1666 16.9998 12.3158 16.9998 12.4999C16.9998 12.684 16.8506 12.8333 16.6665 12.8333C14.6813 12.8333 13.3286 13.2711 12.4664 14.1332C11.6043 14.9953 11.1665 16.3481 11.1665 18.3333C11.1665 18.5173 11.0173 18.6666 10.8332 18.6666C10.6491 18.6666 10.4998 18.5173 10.4998 18.3333C10.4998 16.3481 10.062 14.9953 9.1999 14.1332C8.33778 13.2711 6.98502 12.8333 4.99984 12.8333C4.81574 12.8333 4.6665 12.684 4.6665 12.4999C4.6665 12.3158 4.81574 12.1666 4.99984 12.1666C6.98502 12.1666 8.33778 11.7288 9.1999 10.8666C10.062 10.0045 10.4998 8.65177 10.4998 6.66658C10.4998 6.48249 10.6491 6.33325 10.8332 6.33325ZM4.04314 6.54322C4.31245 6.2739 4.48888 5.91801 4.58317 5.47388C4.67746 5.91801 4.85389 6.2739 5.1232 6.54322C5.39252 6.81253 5.74841 6.98896 6.19255 7.08325C5.74841 7.17754 5.39252 7.35397 5.1232 7.62328C4.85389 7.8926 4.67746 8.24849 4.58317 8.69263C4.48888 8.24849 4.31245 7.8926 4.04314 7.62328C3.77382 7.35397 3.41793 7.17754 2.97379 7.08325C3.41793 6.98896 3.77382 6.81253 4.04314 6.54322ZM8.40946 2.57621C8.57008 2.41559 8.68165 2.21065 8.74984 1.96161C8.81802 2.21065 8.9296 2.41559 9.09022 2.5762C9.25083 2.73682 9.45578 2.8484 9.70481 2.91658C9.45578 2.98477 9.25083 3.09635 9.09022 3.25696C8.9296 3.41758 8.81802 3.62252 8.74984 3.87156C8.68165 3.62252 8.57008 3.41758 8.40946 3.25697C8.24884 3.09635 8.0439 2.98477 7.79486 2.91659C8.0439 2.8484 8.24884 2.73682 8.40946 2.57621Z'
      fill='currentColor'
      stroke='currentColor'
    />
  </svg>
)

const BookIcon = () => (
  <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M10 6.45825C10 5.07754 11.1193 3.95825 12.5 3.95825H17.7084C18.1686 3.95825 18.5417 4.33135 18.5417 4.79159V15.2083C18.5417 15.6685 18.1686 16.0416 17.7084 16.0416H12.7309C12.1639 16.0416 11.6081 16.1784 11.1257 16.4765C10.6434 16.7746 10.2536 17.2011 10 17.7083M10 6.45825C10 5.07754 8.88075 3.95825 7.50004 3.95825H2.29171C1.83147 3.95825 1.45837 4.33135 1.45837 4.79159V15.2083C1.45837 15.6685 1.83147 16.0416 2.29171 16.0416H7.26921C7.83622 16.0416 8.39203 16.1784 8.87435 16.4765C9.35668 16.7746 9.74647 17.2011 10 17.7083M10 6.45825V17.7083'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
    />
  </svg>
)

const DocumentIcon = () => (
  <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M11.1133 2.7799L11.6436 2.24957L11.6436 2.24957L11.1133 2.7799ZM15.5537 7.22026L16.084 6.68993L15.5537 7.22026ZM7.29183 10.2917C6.87762 10.2917 6.54183 10.6275 6.54183 11.0417C6.54183 11.456 6.87762 11.7917 7.29183 11.7917V10.2917ZM10.2085 11.7917C10.6227 11.7917 10.9585 11.456 10.9585 11.0417C10.9585 10.6275 10.6227 10.2917 10.2085 10.2917V11.7917ZM7.29183 13.6251C6.87762 13.6251 6.54183 13.9609 6.54183 14.3751C6.54183 14.7893 6.87762 15.1251 7.29183 15.1251V13.6251ZM12.7085 15.1251C13.1227 15.1251 13.4585 14.7893 13.4585 14.3751C13.4585 13.9609 13.1227 13.6251 12.7085 13.6251V15.1251ZM5.62516 3.04175H9.93481V1.54175H5.62516V3.04175ZM15.2918 8.39877V16.0417H16.7918V8.39877H15.2918ZM10.583 3.31023L15.0233 7.75059L16.084 6.68993L11.6436 2.24957L10.583 3.31023ZM4.7085 16.0417V3.95841H3.2085V16.0417H4.7085ZM14.3752 16.9584H5.62516V18.4584H14.3752V16.9584ZM3.2085 16.0417C3.2085 17.3764 4.29047 18.4584 5.62516 18.4584V16.9584C5.1189 16.9584 4.7085 16.548 4.7085 16.0417H3.2085ZM16.7918 8.39877C16.7918 7.75783 16.5372 7.14314 16.084 6.68993L15.0233 7.75059C15.1953 7.9225 15.2918 8.15566 15.2918 8.39877H16.7918ZM9.93481 3.04175C10.1779 3.04175 10.4111 3.13833 10.583 3.31023L11.6436 2.24957C11.1904 1.79636 10.5757 1.54175 9.93481 1.54175V3.04175ZM15.2918 16.0417C15.2918 16.548 14.8814 16.9584 14.3752 16.9584V18.4584C15.7099 18.4584 16.7918 17.3764 16.7918 16.0417H15.2918ZM5.62516 1.54175C4.29047 1.54175 3.2085 2.62373 3.2085 3.95841H4.7085C4.7085 3.45215 5.1189 3.04175 5.62516 3.04175V1.54175ZM9.87516 2.70841V6.04175H11.3752V2.70841H9.87516ZM12.2918 8.45842H15.6252V6.95842H12.2918V8.45842ZM9.87516 6.04175C9.87516 7.37644 10.9571 8.45842 12.2918 8.45842V6.95842C11.7856 6.95842 11.3752 6.54801 11.3752 6.04175H9.87516ZM7.29183 11.7917H10.2085V10.2917H7.29183V11.7917ZM7.29183 15.1251H12.7085V13.6251H7.29183V15.1251Z'
      fill='currentColor'
    />
  </svg>
)

const ChatIcon = () => (
  <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M14.375 11.875H16.0435C16.9639 11.875 17.7101 11.1288 17.7101 10.2083V4.79167C17.7101 3.87119 16.9639 3.125 16.0435 3.125H7.50179C6.58132 3.125 5.83512 3.87119 5.83512 4.79167V6.45833M12.7101 6.45833H3.96012C3.03965 6.45833 2.29346 7.20453 2.29346 8.125V13.5417C2.29346 14.4621 3.03965 15.2083 3.96012 15.2083H5.00179V17.2917L8.75179 15.2083H12.7101C13.6306 15.2083 14.3768 14.4621 14.3768 13.5417V8.125C14.3768 7.20453 13.6306 6.45833 12.7101 6.45833Z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
    />
  </svg>
)

const PaperplaneIcon = () => (
  <svg fill='none' height='16' viewBox='0 0 16 16' width='16' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M4.00023 8.00006H6.16689M4.00023 8.00006L2.25471 2.7635C2.1608 2.48177 2.45439 2.22714 2.72001 2.35995L13.4039 7.70192C13.6496 7.82476 13.6496 8.17536 13.4039 8.2982L2.72001 13.6402C2.45439 13.773 2.1608 13.5183 2.25471 13.2366L4.00023 8.00006Z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'></path>
  </svg>
)

const ArrowCursorIcon = () => (
  <svg height='20' viewBox='0 0 30 38' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z'
      fill='#002918'
      stroke='#20dfd6'
      strokeLinejoin='round'
      strokeWidth='1.5'
    />
  </svg>
)
