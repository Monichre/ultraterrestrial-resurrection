"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowUp, Sparkles } from "lucide-react"
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react"

export interface MessageItem {
  id: string
  icon: React.ReactNode
  title: string
  description: string
}

interface AnimatedChatProps {
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
  animationConfig?: {
    initialDelay: number
    stateDelays: number[]
    typeSpeed: number
    initialWidth: number
    expandedWidth: number
  }
}

const defaultAnimationConfig = {
  initialDelay: 500,
  stateDelays: [300, 1000, 800, 1000],
  typeSpeed: 40,
  initialWidth: 370,
  expandedWidth: 560,
}

export default function AnimatedChat({
  input,
  handleInputChange,
  handleSubmit,
  messages,
  onMessageClick,
  placeholder = "Ask anything...",
  animationConfig = defaultAnimationConfig,
}: AnimatedChatProps) {
  const [animationState, setAnimationState] = useState<"initial" | "typing" | "expanded" | "complete">("initial")
  const [displayText, setDisplayText] = useState("")
  const [showMessages, setShowMessages] = useState(false)

  const config = { ...defaultAnimationConfig, ...animationConfig }

  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, config.initialDelay))
      setAnimationState("typing")

      await new Promise((resolve) => setTimeout(resolve, config.stateDelays[0]))

      // Type out the placeholder text
      const text = placeholder
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, config.typeSpeed))
      }

      await new Promise((resolve) => setTimeout(resolve, config.stateDelays[1]))
      setAnimationState("expanded")

      await new Promise((resolve) => setTimeout(resolve, config.stateDelays[2]))
      setShowMessages(true)

      await new Promise((resolve) => setTimeout(resolve, config.stateDelays[3]))
      setAnimationState("complete")
    }

    sequence()
  }, [placeholder]) // Removed config from dependencies

  const getWidth = () => {
    switch (animationState) {
      case "initial":
        return config.initialWidth
      case "typing":
        return config.initialWidth
      case "expanded":
      case "complete":
        return config.expandedWidth
      default:
        return config.initialWidth
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ width: getWidth() }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <motion.div
            className="relative flex items-center bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
            animate={{
              height: animationState === "complete" ? 56 : 48,
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute left-4 flex items-center">
              <Sparkles className="size-4 text-neutral-400" />
            </div>

            <input
              value={input}
              onChange={handleInputChange}
              placeholder={animationState === "complete" ? placeholder : ""}
              className="w-full h-full pl-12 pr-12 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm"
              disabled={animationState !== "complete"}
            />

            {animationState === "typing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-12 text-sm text-neutral-500 pointer-events-none"
              >
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="ml-0.5"
                >
                  |
                </motion.span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="absolute right-3 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || animationState !== "complete"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="size-4" />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
