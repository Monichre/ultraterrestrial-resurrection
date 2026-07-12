"use client"
import { useState, useEffect, type ReactNode, type FormEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, Sparkles, Search, FileText, ImageIcon, Camera } from "lucide-react"

export interface MessageItem {
  id: string
  icon: ReactNode
  title: string
  description: string
}

export interface AnimationConfig {
  initialDelay?: number
  stateDelays?: number[]
  typeSpeed?: number
  initialWidth?: number
  expandedWidth?: number
}

export interface AnimatedChatWithSuggestionsProps {
  name?: string
  description?: string
  messages?: MessageItem[]
  onMessageClick?: (message: MessageItem) => void
  placeholder?: string
  searchPlaceholder?: string
  animationConfig?: AnimationConfig
  className?: string
  initialState?: number
  onStateChange?: (state: number) => void
}

const defaultMessages: MessageItem[] = [
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
    icon: <Camera className="size-5" />,
    title: "Explore Network",
    description: "Navigate the interconnected web of UFO phenomena and research",
  },
]

export default function AnimatedChatWithSuggestions({
  name = "Research Assistant",
  description = "Explore the vast network of UFO phenomena, witness testimonies, and documented cases.",
  messages = defaultMessages,
  onMessageClick,
  placeholder = "Deep Research",
  searchPlaceholder = "Ask about UFO phenomena...",
  animationConfig = {},
  className = "",
  initialState = 0,
  onStateChange,
}: AnimatedChatWithSuggestionsProps) {
  const {
    initialDelay = 500,
    stateDelays = [300, 1000, 800, 1000],
    typeSpeed = 40,
    initialWidth = 370,
    expandedWidth = 560,
  } = animationConfig

  const [animationState, setAnimationState] = useState<"initial" | "typing" | "expanded" | "complete">("initial")
  const [displayText, setDisplayText] = useState("")
  const [showMessages, setShowMessages] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    if (initialState > 0) {
      // Skip to expanded state if initialState is set
      setAnimationState("expanded")
      setDisplayText(placeholder)
      setShowMessages(true)
      return
    }

    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, initialDelay))
      setAnimationState("typing")

      await new Promise((resolve) => setTimeout(resolve, stateDelays[0]))

      // Type out the placeholder text
      const text = placeholder
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, typeSpeed))
      }

      await new Promise((resolve) => setTimeout(resolve, stateDelays[1]))
      setAnimationState("expanded")
      onStateChange?.(1)

      await new Promise((resolve) => setTimeout(resolve, stateDelays[2]))
      setShowMessages(true)
      onStateChange?.(2)

      await new Promise((resolve) => setTimeout(resolve, stateDelays[3]))
      setAnimationState("complete")
      onStateChange?.(3)
    }

    sequence()
  }, [])

  const getWidth = () => {
    switch (animationState) {
      case "initial":
        return initialWidth
      case "typing":
        return initialWidth
      case "expanded":
      case "complete":
        return expandedWidth
      default:
        return initialWidth
    }
  }

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      console.log("Search submitted:", searchInput)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.div
        animate={{ width: getWidth() }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        {/* Top gradient bar */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ opacity: animationState === "initial" ? 0 : 1, y: animationState === "initial" ? 12 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="absolute left-4 right-4 -top-3 h-3 rounded-t-2xl backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%), rgba(255,255,255,0.02)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* Bottom gradient bar */}
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ opacity: animationState === "initial" ? 0 : 1, y: animationState === "initial" ? -12 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="absolute left-4 right-4 -bottom-3 h-3 rounded-b-2xl backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 100%), rgba(255,255,255,0.02)",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* Main container */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow:
              "0 0 24px rgba(255,255,255,0.08) inset, 0 -4px 12px rgba(255,255,255,0.04) inset, 0 1px 1px rgba(255,255,255,0.12) inset",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Search bar with typewriter effect */}
          <div className="relative flex items-center gap-3 p-4">
            {animationState !== "typing" && animationState !== "initial" && (
              <div className="absolute inset-0 border-b border-white/10 pointer-events-none rounded-[inherit]" />
            )}
            <div className="flex text-neutral-400">
              <Sparkles className="size-5" />
            </div>
            <div className="flex-1 text-sm leading-5 font-medium text-white">
              {animationState === "typing" && (
                <>
                  <span>{displayText}</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    className="ml-0.5 text-white"
                  >
                    |
                  </motion.span>
                </>
              )}
              {animationState !== "typing" && animationState !== "initial" && <span>{placeholder}</span>}
              {animationState === "initial" && <span className="text-neutral-500">Loading...</span>}
            </div>
          </div>

          {/* Animated content area */}
          <motion.div
            layout
            initial={{ height: 0 }}
            animate={{ height: showMessages ? 320 : 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <AnimatePresence>
              {showMessages && (
                <div className="p-4 relative">
                  {/* Header */}
                  <motion.div
                    layout
                    initial={{ y: 40, opacity: 0, filter: "blur(3px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1,
                      ease: "easeInOut",
                    }}
                    className="mb-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
                  </motion.div>

                  {/* Message suggestions */}
                  {messages.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ y: 40, opacity: 0, filter: "blur(3px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + i * 0.1,
                        ease: "easeInOut",
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => onMessageClick?.(item)}
                    >
                      <div className="flex text-neutral-300">{item.icon}</div>
                      <div className="flex flex-col flex-1">
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        <div className="text-xs text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap max-w-[400px]">
                          {item.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Search input */}
                  <motion.form
                    initial={{ y: 40, opacity: 0, filter: "blur(3px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5,
                      ease: "easeInOut",
                    }}
                    onSubmit={handleSearchSubmit}
                    className="mt-4 bg-white/5 h-10 rounded-lg flex items-center relative px-3 border border-white/10"
                    style={{
                      boxShadow: "0 0 24px rgba(255,255,255,0.05) inset, 0 1px 1px rgba(255,255,255,0.12) inset",
                    }}
                  >
                    <Search className="size-4 text-neutral-500 mr-2" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-transparent border-none cursor-pointer text-neutral-400 hover:text-white transition-colors"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                  </motion.form>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
