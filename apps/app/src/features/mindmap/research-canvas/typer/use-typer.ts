import { useEffect, useState, useCallback } from "react"
import type { ChangeEvent } from "react"
import { TYPER_ITEMS } from "./constants"

interface UseTyperProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
}

export function useTyper({ input, handleInputChange }: UseTyperProps) {
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

  const createSyntheticEvent = useCallback((value: string) => {
    return { target: { value } } as ChangeEvent<HTMLInputElement>
  }, [])

  const handleCardClick = useCallback(
    (command: string, index: number) => {
      setPinnedCard(index)

      setTimeout(() => {
        handleInputChange(createSyntheticEvent(command))
        setShowEnhancedChat(true)
        setChatState(0)
      }, 600)
    },
    [handleInputChange, createSyntheticEvent]
  )

  const handleUnpin = useCallback(() => {
    setPinnedCard(null)
    setShowEnhancedChat(false)
    setActive(false)
    handleInputChange(createSyntheticEvent(""))
  }, [handleInputChange, createSyntheticEvent])

  const handleMessageClick = useCallback(
    (message: { title: string }) => {
      handleInputChange(createSyntheticEvent(`Tell me about ${message.title.toLowerCase()}`))
    },
    [handleInputChange, createSyntheticEvent]
  )

  const handleInputChangeWrapper = useCallback(
    (value: string) => {
      handleInputChange(createSyntheticEvent(value))
    },
    [handleInputChange, createSyntheticEvent]
  )

  const pinnedItem = pinnedCard !== null ? TYPER_ITEMS[pinnedCard] : null

  return {
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
  }
}

export type UseTyperReturn = ReturnType<typeof useTyper>
