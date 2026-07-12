"use client"
import { useState, useEffect, type ReactNode, type FormEvent, type ChangeEvent } from "react"
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowUp, Sparkles, FileText, ImageIcon, Camera } from "lucide-react"

// Message item interface
export interface MessageItem {
  id: string
  icon: ReactNode
  title: string
  description: string
}

// Animation configuration interface
export interface AnimationConfig {
  initialDelay?: number
  stateDelays?: number[]
  typeSpeed?: number
  initialWidth?: number
  expandedWidth?: number
}

// Enhanced Chat component props interface
export interface EnhancedAnimatedChatProps {
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
  messages: MessageItem[]
  onMessageClick: (message: MessageItem) => void
  placeholder?: string
  animationConfig?: AnimationConfig
  className?: string
  width?: number
  height?: number
}

const EnhancedAnimatedChat = (props: EnhancedAnimatedChatProps) => {
  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    onMessageClick,
    placeholder = "Ask anything...",
    animationConfig = {},
    className = "",
    width = 560,
    height = 380,
  } = props

  // Destructure animation config with defaults
  const {
    initialDelay = 500,
    stateDelays = [300, 1000, 800, 1000],
    typeSpeed = 40,
    initialWidth = 370,
    expandedWidth = 560,
  } = animationConfig

  // State for animation sequence
  const [animationState, setAnimationState] = useState<"initial" | "typing" | "expanded" | "complete">("initial")
  const [displayText, setDisplayText] = useState("")
  const [showMessages, setShowMessages] = useState(false)
  const [submittedQuery, setSubmittedQuery] = useState("")

  // Enhanced form submission with animation sequence
  const enhancedHandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setSubmittedQuery(input)

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    // Start animation sequence
    setAnimationState("typing")

    await wait(stateDelays[0])

    // Type out the submitted query
    const text = input
    for (let i = 0; i <= text.length; i++) {
      setDisplayText(text.slice(0, i))
      await new Promise((resolve) => setTimeout(resolve, typeSpeed))
    }

    await wait(stateDelays[1])
    setAnimationState("expanded")

    await wait(stateDelays[2])
    setShowMessages(true)

    await wait(stateDelays[3])
    setAnimationState("complete")

    // Call the original submit handler
    handleSubmit(e)
  }

  useEffect(() => {
    if (animationState === "initial" && input.length === 0) {
      // Reset animation when input is cleared
      setSubmittedQuery("")
      setDisplayText("")
      setShowMessages(false)
    }
  }, [input, animationState])

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

  // Default messages for UFO research context
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

  const displayMessages = messages.length > 0 ? messages : defaultMessages

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.div
        animate={{ width: getWidth() }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        {/* Top gradient bar - appears when expanded */}
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
            borderBottom: "none",
          }}
        />

        {/* Bottom gradient bar - appears when expanded */}
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
            borderTop: "none",
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
          <AnimatePresence mode="wait">
            {animationState === "initial" ? (
              // Initial form state
              <motion.div key="initial-form" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <form onSubmit={enhancedHandleSubmit} className="relative">
                  <motion.div
                    className="relative flex items-center bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                    animate={{
                      height: 48,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="absolute left-4 flex items-center">
                      <Sparkles className="size-4 text-neutral-400" />
                    </div>

                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="w-full h-full pl-12 pr-12 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm"
                    />

                    <motion.button
                      type="submit"
                      className="absolute right-3 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!input.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowUp className="size-4" />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            ) : (
              // Expanded animated state
              <motion.div
                key="expanded-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search bar with typewriter effect */}
                <div className="relative flex items-center gap-3 p-4">
                  {animationState !== "typing" && (
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
                    {animationState !== "typing" && <span>{submittedQuery}</span>}
                  </div>
                </div>

                {/* Animated content area */}
                <motion.div
                  layout
                  initial={{ height: 0 }}
                  animate={{ height: animationState !== "typing" ? 280 : 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                >
                  <AnimatePresence mode="popLayout">
                    {animationState !== "complete" ? (
                      <motion.div
                        key="suggestions"
                        initial={{ opacity: 1 }}
                        exit={{
                          x: -180,
                          opacity: 0,
                          transition: { duration: 0.35, ease: "easeInOut" },
                        }}
                      >
                        <AnimatePresence>
                          {showMessages && (
                            <div className="p-3 relative">
                              {/* Header */}
                              <motion.div
                                layout
                                initial={{ y: 40, opacity: 0, filter: "blur(3px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.2,
                                  ease: "easeInOut",
                                }}
                                className="flex items-center gap-3 px-3 py-2 mb-2"
                              >
                                <div className="flex text-blue-400">
                                  <Sparkles className="size-5" />
                                </div>
                                <div className="flex gap-2 text-white">
                                  <div className="font-medium">Exploring:</div>
                                  <div>{submittedQuery}</div>
                                </div>
                              </motion.div>

                              {/* Message suggestions */}
                              {displayMessages.map((item, i) => (
                                <motion.div
                                  key={item.id}
                                  layout
                                  initial={{ y: 40, opacity: 0, filter: "blur(3px)" }}
                                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                  transition={{
                                    duration: 0.4,
                                    delay: 0.4 + i * 0.15,
                                    ease: "easeInOut",
                                  }}
                                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                  onClick={() => onMessageClick(item)}
                                >
                                  <div className="flex text-neutral-300">{item.icon}</div>
                                  <div className="flex flex-col flex-1">
                                    <div className="text-sm font-medium text-white">{item.title}</div>
                                    <div className="text-xs text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]">
                                      {item.description}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      // Final state with AI response
                      <motion.div
                        key="ai-response"
                        initial={{ x: 180, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="p-4 h-full flex flex-col gap-4"
                      >
                        <div className="flex flex-1 items-start gap-4 text-neutral-300 text-sm">
                          <span className="flex-shrink-0 text-blue-400">
                            <Sparkles className="size-5" />
                          </span>
                          <div>
                            <TypewriterResponse
                              speed={10}
                              text="Based on your query about UFO phenomena, I can help you explore the vast network of connections, witness testimonies, and documented cases. Would you like to dive deeper into specific aspects or follow a guided exploration pathway?"
                            />
                          </div>
                        </div>

                        {/* Follow-up input */}
                        <form
                          className="bg-white/5 h-10 rounded-lg flex items-center relative px-3 border border-white/10"
                          style={{
                            boxShadow: "0 0 24px rgba(255,255,255,0.05) inset, 0 1px 1px rgba(255,255,255,0.12) inset",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Follow up question..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500"
                          />
                          <button
                            type="submit"
                            className="flex items-center justify-center bg-transparent border-none cursor-pointer text-neutral-400 hover:text-white transition-colors"
                          >
                            <ArrowUp className="size-4" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Arrow cursor animation */}
        {animationState === "expanded" && showMessages && (
          <motion.div
            initial={{ top: 120, right: 40, opacity: 0 }}
            animate={{ top: 100, right: 80, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            className="absolute z-40 pointer-events-none"
          >
            <ArrowCursorIcon />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Typewriter component for AI responses
export interface TypewriterResponseProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

const TypewriterResponse = (props: TypewriterResponseProps) => {
  const { text, speed = 30, delay = 0, onComplete } = props
  const [done, setDone] = useState(false)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayedText = useTransform(rounded, (latest) => text.slice(0, latest))

  useEffect(() => {
    const controls = animate(count, text.length, {
      delay: delay / 1000,
      duration: (speed * text.length) / 1000,
      ease: "easeInOut",
      onComplete: () => {
        setDone(true)
        onComplete?.()
      },
    })

    return controls.stop
  }, [text, speed, delay, count, onComplete])

  return <motion.span>{displayedText}</motion.span>
}

// Arrow cursor icon
const ArrowCursorIcon = () => (
  <svg height="20" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z"
      fill="#1a1a1a"
      stroke="#60a5fa"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
)

export default EnhancedAnimatedChat
