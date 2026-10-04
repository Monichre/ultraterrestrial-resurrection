"use client"

import { useState, useCallback, type FormEvent, type ReactNode } from "react"
import type { ChangeEvent } from "react"
import { FileText, ImageIcon, CodeXml } from "lucide-react"

import MessageInput from "./MessageInput"
import EnhancedAnimatedChat from "./EnhancedAnimatedChat"
import { useTyper, CardStack, PinnedCard, ANIMATION_CONFIG } from "./typer"
import type { AgentToolEvent } from '@/features/mindmap/hooks/use-mindmap-agent'

interface ResearchCanvasConsoleProps {
  onSubmit: (value: string) => void
  agentStatus?: 'idle' | 'streaming' | 'complete' | 'error'
  agentAnalysis?: string
  agentToolEvents?: AgentToolEvent[]
  /** 'launchpad' shows the topic CardStack (empty-canvas affordance);
   *  'compact' is input-only for a populated canvas where the stack is clutter */
  variant?: 'launchpad' | 'compact'
}

interface EnhancedMessage {
  id: string
  icon: ReactNode
  title: string
  description: string
}

const ENHANCED_MESSAGES: EnhancedMessage[] = [
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

export default function ResearchCanvasConsole({
  onSubmit,
  agentStatus,
  agentAnalysis,
  agentToolEvents,
  variant = 'launchpad',
}: ResearchCanvasConsoleProps) {
  const [input, setInput] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    setHasSubmitted(true)
    onSubmit(trimmedInput)
    setInput('')
  }, [input, onSubmit])

  const handleFollowUp = useCallback(async (message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return
    onSubmit(trimmedMessage)
  }, [onSubmit])

  const {
    active,
    isHovering,
    setIsHovering,
    showEnhancedChat,
    pinnedCard,
    animationState,
    pinnedItem,
    handleCardClick,
    handleUnpin,
    handleMessageClick,
    handleInputChangeWrapper,
  } = useTyper({ input, handleInputChange, onSubmit: handleSubmit })

  const handleUnpinAndReset = useCallback(() => {
    handleUnpin()
    setHasSubmitted(false)
  }, [handleUnpin])

  // Show EnhancedAnimatedChat when: card was clicked (showEnhancedChat from hook)
  // OR user submitted via keyboard (hasSubmitted)
  const showChat = showEnhancedChat || hasSubmitted

  const isLaunchpad = variant === 'launchpad'

  return (
    <div className='w-full max-w-4xl text-white'>
      <div
        className={`relative flex w-full flex-col items-center justify-end ${
          isLaunchpad ? 'min-h-[400px] pb-10' : 'min-h-0'
        }`}
      >
        {isLaunchpad && (
          <>
            <PinnedCard
              pinnedCard={pinnedCard}
              pinnedItem={pinnedItem}
              onUnpin={handleUnpinAndReset}
            />

            <CardStack
              active={active}
              showEnhancedChat={showChat}
              pinnedCard={pinnedCard}
              animationState={animationState}
              isHovering={isHovering}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              onCardClick={handleCardClick}
            />
          </>
        )}

        <div className="relative z-10 flex w-full justify-center">
          {showChat ? (
            <EnhancedAnimatedChat
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              messages={ENHANCED_MESSAGES}
              onMessageClick={handleMessageClick}
              placeholder="Ask about UFO phenomena..."
              animationConfig={ANIMATION_CONFIG}
              agentStatus={agentStatus}
              agentAnalysis={agentAnalysis}
              agentToolEvents={agentToolEvents}
              onFollowUp={handleFollowUp}
            />
          ) : (
            <MessageInput
              value={input}
              onChange={(value) => handleInputChangeWrapper(value)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
