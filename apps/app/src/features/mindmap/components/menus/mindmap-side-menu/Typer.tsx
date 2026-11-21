'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {Camera, CodeXml, FileText, ImageIcon} from 'lucide-react'
import {useEffect, useRef, useState, type FormEvent} from 'react'
import type {ChangeEvent} from 'react'
import AnimatedChat, {type MessageItem} from './AnimatedChat'
import {Cross2Icon} from '@radix-ui/react-icons'

const ITEMS = [
  {id: 1, icon: FileText, name: 'Guided Tour', command: 'Start a guided tour of'},
  {id: 2, icon: ImageIcon, name: 'Deep Research', command: 'Begin deep research on'},
  {id: 3, icon: CodeXml, name: 'Explore', command: 'Explore the network for'},
]

const cardVariants = {
  initial: (index: number) => ({
    y: index * 15,
    scale: 1 - (2 - index) * 0.05,
    x: 0,
    rotate: 0,
    zIndex: index,
  }),
  hover: (index: number) => ({
    x: index === 0 ? -200 : index === 1 ? 200 : 0,
    y: -10,
    rotate: index === 0 ? -5 : index === 1 ? 5 : 0,
    scale: 1.05,
    zIndex: 3,
  }),
  active: (index: number) => ({
    x: index === 0 ? 100 : index === 1 ? -100 : 0,
    y: index === 2 ? 0 : -40,
    rotate: index === 0 ? 10 : index === 1 ? -10 : 0,
    scale: 0.85,
    zIndex: index,
  }),
  pinned: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.8,
    zIndex: 10,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
}

interface TyperProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: {
      options?: {
        body: Record<string, any>
      }
    }
  ) => void
}

export default function Typer({input, handleInputChange, handleSubmit}: TyperProps) {
  const [active, setActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showAnimatedChat, setShowAnimatedChat] = useState(false)
  const [pinnedCard, setPinnedCard] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setActive(input.length > 0)
    if (input.length > 0) {
      setShowAnimatedChat(true)
    }
  }, [input])

  const animationState = active ? 'active' : isHovering ? 'hover' : 'initial'

  const handleCardClick = (command: string, index: number) => {
    setPinnedCard(index)

    // Delay the input change to allow animation to complete
    setTimeout(() => {
      const syntheticEvent = {
        target: {value: command},
      } as ChangeEvent<HTMLInputElement>
      handleInputChange(syntheticEvent)
      setShowAnimatedChat(true)
    }, 600)
  }

  const handleUnpin = () => {
    setPinnedCard(null)
    setShowAnimatedChat(false)
    setActive(false)
    const syntheticEvent = {
      target: {value: ''},
    } as ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const customMessages: MessageItem[] = [
    {
      id: 'weather',
      icon: <FileText className='size-5' />,
      title: 'Check Weather',
      description: 'Get current weather information for any location',
    },
    {
      id: 'products',
      icon: <ImageIcon className='size-5' />,
      title: 'Browse Products',
      description: 'Explore our catalog of available products',
    },
    {
      id: 'support',
      icon: <Camera className='size-5' />,
      title: 'Get Support',
      description: 'Connect with our team for assistance',
    },
  ]

  const handleMessageClick = (message: MessageItem) => {
    const syntheticEvent = {
      target: {value: `Tell me about ${message.title.toLowerCase()}`},
    } as ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const pinnedItem = pinnedCard !== null ? ITEMS[pinnedCard] : null

  return (
    <div className='size-full w-full flex flex-col justify-end items-center pb-10 relative'>
      {/* Pinned Card */}
      <AnimatePresence>
        {pinnedCard !== null && pinnedItem && (
          <motion.div
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -50}}
            transition={{duration: 0.4, ease: [0.4, 0, 0.2, 1]}}
            className='fixed top-6 left-1/2 transform -translate-x-1/2 z-50'>
            <motion.div
              layoutId={`typer-item-${pinnedCard}`}
              className='overflow-clip rounded-2xl flex items-center justify-center group cursor-pointer border border-gray-200 border-neutral-700 bg-neutral-900/90 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.05)] relative dark:border-gray-800'
              style={{
                width: 200,
                height: 60,
              }}>
              <div className='flex items-center gap-3 px-4'>
                <motion.div layoutId={`typer-icon-${pinnedCard}`} className='size-fit'>
                  <pinnedItem.icon className='size-5 text-neutral-300' />
                </motion.div>
                <span className='text-sm font-medium text-white'>{pinnedItem.name}</span>
              </div>

              <button
                onClick={handleUnpin}
                className='absolute -top-2 -right-2 w-6 h-6 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center border border-gray-200 border-neutral-600 transition-colors dark:border-gray-800'>
                <Cross2Icon size={12} className='text-neutral-400' strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {!active && !showAnimatedChat && pinnedCard === null ? (
          <motion.div
            key='cards'
            initial={{opacity: 1}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}>
            <motion.div
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className='relative flex items-center justify-center h-[320px] w-[600px]'>
              {ITEMS.map((item, index) => {
                const isSelected = pinnedCard === index
                const shouldHide = pinnedCard !== null && pinnedCard !== index

                return (
                  <motion.div
                    layoutId={isSelected ? undefined : `typer-item-${index}`}
                    key={item.id}
                    variants={cardVariants}
                    custom={index}
                    animate={shouldHide ? 'hidden' : isSelected ? 'pinned' : animationState}
                    transition={{duration: 0.4, ease: [0.4, 0, 0.2, 1]}}
                    className='absolute overflow-clip rounded-3xl flex items-center justify-center group cursor-pointer border border-gray-200 border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)] dark:border-gray-800'
                    style={{
                      width: 280,
                      height: 180,
                    }}
                    onClick={() => handleCardClick(item.command, index)}>
                    <div className='size-full flex-col flex items-center justify-center gap-4 p-6'>
                      <motion.div
                        layoutId={isSelected ? undefined : `typer-icon-${index}`}
                        className='size-fit'>
                        <item.icon className='size-9 text-neutral-400 group-hover:text-neutral-200 transition-colors duration-300' />
                      </motion.div>
                      <div className='text-center'>
                        <h3 className='text-lg font-medium text-white group-hover:text-neutral-100 transition-colors duration-300 mb-2'>
                          {item.name}
                        </h3>
                        <p className='text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300'>
                          {item.name === 'Guided Tour' &&
                            'Follow curated pathways through UFO history'}
                          {item.name === 'Deep Research' &&
                            'Dive deep into specific cases and connections'}
                          {item.name === 'Explore' && 'Navigate the network graph freely'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Always show the animated chat as the main input */}
      <div className='w-full flex justify-center'>
        <AnimatedChat
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          messages={customMessages}
          onMessageClick={(message) => {
            handleMessageClick(message)
            setShowAnimatedChat(true)
          }}
          placeholder='Ask anything...'
          animationConfig={{
            initialDelay: 500,
            stateDelays: [300, 1000, 800, 1000],
            typeSpeed: 40,
            initialWidth: 370,
            expandedWidth: 560,
          }}
        />
      </div>
    </div>
  )
}
