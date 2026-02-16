"use client"

import { useState, useCallback, type FormEvent, type ReactNode } from "react"
import type { ChangeEvent } from "react"
import { FileText, ImageIcon, CodeXml } from "lucide-react"

import MessageInput from "./MessageInput"
import EnhancedAnimatedChat from "./EnhancedAnimatedChat"
import { useTyper, CardStack, PinnedCard, ANIMATION_CONFIG } from "./typer"
import { useMindMapAgent } from '@/features/mindmap/hooks/use-mindmap-agent'

interface ResearchCanvasConsoleProps {
  onSubmit: (value: string) => void
}

interface EnhancedMessage {
  id: string
  icon: ReactNode
  title: string
  description: string
}

export default function ResearchCanvasConsole({ onSubmit }: ResearchCanvasConsoleProps) {
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | null>(null)

  const { status: agentStatus, analysis, toolEvents, runAgentQuery } = useMindMapAgent()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    onSubmit(trimmedInput)
    try {
      await runAgentQuery({ message: trimmedInput, threadId })
    } catch (err) {
      console.error('Agent query failed:', err)
    }
    setInput('')
  }, [input, onSubmit, runAgentQuery, threadId])

  const handleFollowUp = useCallback(async (message: string) => {
    try {
      await runAgentQuery({ message, threadId })
    } catch (err) {
      console.error('Follow-up query failed:', err)
    }
  }, [runAgentQuery, threadId])

  const {
    active,
    isHovering,
    setIsHovering,
    showEnhancedChat,
    pinnedCard,
    chatState,
    setChatState,
    animationState,
    pinnedItem,
    handleCardClick,
    handleUnpin,
    handleMessageClick,
    handleInputChangeWrapper,
  } = useTyper({ input, handleInputChange })

  const enhancedMessages: EnhancedMessage[] = [
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

  return (
    <div className='text-white flex flex-col justify-end items-center gap-6 min-h-[400px] h-screen'>
      <div className='w-full max-w-4xl'>
    <div className="size-full w-full flex flex-col justify-end items-center pb-10 relative">

      <PinnedCard
        pinnedCard={pinnedCard}
        pinnedItem={pinnedItem}
        onUnpin={handleUnpin}
      />

      <CardStack
        active={active}
        showEnhancedChat={showEnhancedChat}
        pinnedCard={pinnedCard}
        animationState={animationState}
        isHovering={isHovering}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onCardClick={handleCardClick}
      />

      <div className="w-full flex justify-center relative z-10">
        {showEnhancedChat && input.length > 0 ? (
          <EnhancedAnimatedChat
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            messages={enhancedMessages}
            onMessageClick={handleMessageClick}
            placeholder="Ask about UFO phenomena..."
            animationConfig={ANIMATION_CONFIG}
            agentStatus={agentStatus}
            agentAnalysis={analysis}
            agentToolEvents={toolEvents}
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
    </div>
  )
}
