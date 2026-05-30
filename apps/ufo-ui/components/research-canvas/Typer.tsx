"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Radiation, MapPin, Rocket, Landmark, X, FileText, ImageIcon, CodeXml } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import type { ChangeEvent } from "react"
import { DotPattern } from "@/components/ui/dot-pattern"
import MessageInput from "./MessageInput"
import AnimatedChatWithSuggestions from "./AnimatedChatWithSuggestions"

const ITEMS = [
  { id: 1, icon: Radiation, name: "UFO & Nukes", command: "Start guided tour: UFO & Nuclear Connection", description: "Military encounters near nuclear sites" },
  { id: 2, icon: MapPin, name: "Roswell", command: "Start guided tour: Roswell - Where It All Began", description: "The 1947 incident that started it all" },
  { id: 3, icon: Rocket, name: "Mars Origins", command: "Start guided tour: Mars Origins Theory", description: "Extraterrestrial life hypothesis" },
  { id: 4, icon: Landmark, name: "Ancient Archaeology", command: "Start guided tour: Ancient Archaeology", description: "Evidence from ancient civilizations" },
]

const cardVariants = {
  initial: (index: number) => ({
    y: index * 8,
    scale: 1 - (3 - index) * 0.03,
    x: 0,
    rotate: 0,
    zIndex: index,
  }),
  hover: (index: number) => ({
    x: index === 0 ? -200 : index === 1 ? -70 : index === 2 ? 70 : 200,
    y: -12,
    rotate: index === 0 ? -6 : index === 1 ? -2 : index === 2 ? 2 : 6,
    scale: 1.05,
    zIndex: 4,
  }),
  active: (index: number) => ({
    x: index === 0 ? 120 : index === 1 ? 40 : index === 2 ? -40 : -120,
    y: index === 3 ? 0 : -20,
    rotate: index === 0 ? 6 : index === 1 ? 2 : index === 2 ? -2 : -6,
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
    },
  ) => void
}

export default function Typer({ input, handleInputChange, handleSubmit }: TyperProps) {
  const [active, setActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showEnhancedChat, setShowEnhancedChat] = useState(false)
  const [pinnedCard, setPinnedCard] = useState<number | null>(null)
  const [chatState, setChatState] = useState(0)

  useEffect(() => {
    setActive(input.length > 0)
    if (input.length > 0) {
      setShowEnhancedChat(true)
    }
  }, [input])

  const animationState = active ? "active" : isHovering ? "hover" : "initial"

  const handleCardClick = (command: string, index: number) => {
    setPinnedCard(index)

    setTimeout(() => {
      const syntheticEvent = {
        target: { value: command },
      } as ChangeEvent<HTMLInputElement>
      handleInputChange(syntheticEvent)
      setShowEnhancedChat(true)
      setChatState(0)
    }, 600)
  }

  const handleUnpin = () => {
    setPinnedCard(null)
    setShowEnhancedChat(false)
    setActive(false)
    const syntheticEvent = {
      target: { value: "" },
    } as ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const enhancedMessages: any[] = [
    {
      id: "guided-tour",
      icon: <FileText className="size-5" />,
      title: "Guided Tour",
      description: "Follow curated pathways through UFO history and key events",
    },
    {
      id: "deep-research",
      icon: <ImageIcon className="size-5" />,
      title: "Deep Research",
      description: "Dive deep into specific cases, witness accounts, and documentation",
    },
    {
      id: "explore-network",
      icon: <CodeXml className="size-5" />,
      title: "Explore Network",
      description: "Navigate the interconnected web of UFO phenomena and research",
    },
  ]

  const handleMessageClick = (message: any) => {
    const syntheticEvent = {
      target: { value: `Tell me about ${message.title.toLowerCase()}` },
    } as ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const pinnedItem = pinnedCard !== null ? ITEMS[pinnedCard] : null

  return (
    <div className="size-full w-full flex flex-col justify-end items-center pb-10 relative">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="fixed inset-0 text-neutral-600/30 z-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />

      {/* Pinned Card */}
      <AnimatePresence>
        {pinnedCard !== null && pinnedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-0"
          >
            <motion.div
              layoutId={`typer-item-${pinnedCard}`}
              className="overflow-clip rounded-2xl flex items-center justify-center group cursor-pointer border border-neutral-700 bg-neutral-900/90 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.05)] relative"
              style={{
                width: 180,
                height: 56,
              }}
            >
              <div className="flex items-center gap-3 px-4">
                <motion.div layoutId={`typer-icon-${pinnedCard}`} className="size-fit">
                  <pinnedItem.icon className="size-4 text-neutral-300" />
                </motion.div>
                <span className="text-sm font-medium text-white">{pinnedItem.name}</span>
              </div>

              <button
                onClick={handleUnpin}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-600 transition-colors"
              >
                <X size={12} className="text-neutral-400" strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!active && !showEnhancedChat && pinnedCard === null ? (
          <motion.div key="cards" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <motion.div
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="relative flex items-center justify-center h-[220px] w-[600px] -translate-y-16"
            >
              {ITEMS.map((item, index) => {
                const isSelected = pinnedCard === index
                const shouldHide = pinnedCard !== null && pinnedCard !== index

                return (
                  <motion.div
                    layoutId={isSelected ? undefined : `typer-item-${index}`}
                    key={item.id}
                    variants={cardVariants}
                    custom={index}
                    animate={shouldHide ? "hidden" : isSelected ? "pinned" : animationState}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute overflow-clip rounded-2xl flex items-center justify-center group cursor-pointer border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                    style={{
                      width: 200,
                      height: 120,
                    }}
                    onClick={() => handleCardClick(item.command, index)}
                  >
                    <div className="size-full flex-col flex items-center justify-center gap-3 p-4">
                      <motion.div layoutId={isSelected ? undefined : `typer-icon-${index}`} className="size-fit">
                        <item.icon className="size-6 text-neutral-400 group-hover:text-neutral-200 transition-colors duration-300" />
                      </motion.div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-white group-hover:text-neutral-100 transition-colors duration-300 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 leading-snug">
                          {item.description}
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

      {/* Enhanced Animated Chat */}
      <div className="w-full flex justify-center relative z-10">
        {showEnhancedChat && input.length > 0 ? (
          <AnimatedChatWithSuggestions
            name="Ultraterrestrial Research"
            description="Explore the vast network of UFO phenomena, witness testimonies, and documented cases across history. Navigate through interconnected research pathways to uncover patterns and insights."
            messages={enhancedMessages}
            animationConfig={{
              initialDelay: 100,
              stateDelays: [500, 1500, 1000, 1500],
              typeSpeed: 60,
              initialWidth: 600,
              expandedWidth: 600,
            }}
            initialState={chatState}
            onStateChange={(state) => setChatState(state)}
            onMessageClick={handleMessageClick}
            placeholder={input}
            searchPlaceholder="Ask about UFO phenomena..."
          />
        ) : (
          <MessageInput
            value={input}
            onChange={(value) => {
              const syntheticEvent = {
                target: { value },
              } as ChangeEvent<HTMLInputElement>
              handleInputChange(syntheticEvent)
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
