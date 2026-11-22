import { useEffect, useState, useCallback, useRef } from "react"
import type { ChangeEvent } from "react"
import { TYPER_ITEMS } from "./constants"

interface UseTyperProps {
  input: string
  handleInputChange: ( e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => void
  onSubmit?: ( message: string ) => void
}

export function useTyper( { input, handleInputChange, onSubmit }: UseTyperProps ) {
  const [active, setActive] = useState( false )
  const [isHovering, setIsHovering] = useState( false )
  const [showEnhancedChat, setShowEnhancedChat] = useState( false )
  const [pinnedCard, setPinnedCard] = useState<number | null>( null )
  const [chatState, setChatState] = useState( 0 )
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>( null )

  const clearPinTimer = useCallback( () => {
    if ( pinTimer.current !== null ) {
      clearTimeout( pinTimer.current )
      pinTimer.current = null
    }
  }, [] )

  useEffect( () => clearPinTimer, [clearPinTimer] )

  useEffect( () => {
    setActive( input.length > 0 )
    // showEnhancedChat is only set by card click or explicit submit — not on keystroke
  }, [input] )

  const animationState = active ? "active" : isHovering ? "hover" : "initial"

  const createSyntheticEvent = useCallback( ( value: string ) => {
    return { target: { value } } as ChangeEvent<HTMLInputElement>
  }, [] )

  const handleCardClick = useCallback(
    ( command: string, index: number ) => {
      const item = TYPER_ITEMS[index]
      if ( item && 'href' in item && item.href ) {
        window.location.assign( item.href )
        return
      }

      setPinnedCard( index )
      // Instant composer echo: the command is visible while the pin beat
      // plays, so the 600ms gap is never silent (v0 dogfood defect).
      handleInputChange( createSyntheticEvent( command ) )

      clearPinTimer()
      pinTimer.current = setTimeout( () => {
        pinTimer.current = null
        setShowEnhancedChat( true )
        setChatState( 0 )
      }, 600 )
    },
    [handleInputChange, createSyntheticEvent, clearPinTimer]
  )

  const handleUnpin = useCallback( () => {
    clearPinTimer()
    setPinnedCard( null )
    setShowEnhancedChat( false )
    setActive( false )
    handleInputChange( createSyntheticEvent( "" ) )
  }, [handleInputChange, createSyntheticEvent, clearPinTimer] )

  const handleMessageClick = useCallback(
    ( message: { title: string; submitText?: string } ) => {
      const text = message.submitText ?? `Tell me about ${message.title.toLowerCase()}`
      handleInputChange( createSyntheticEvent( text ) )
      if ( onSubmit ) {
        onSubmit( text )
      }
    },
    [handleInputChange, createSyntheticEvent, onSubmit]
  )

  const handleInputChangeWrapper = useCallback(
    ( value: string ) => {
      handleInputChange( createSyntheticEvent( value ) )
    },
    [handleInputChange, createSyntheticEvent]
  )

  const pinnedItem = pinnedCard !== null ? TYPER_ITEMS[pinnedCard] : null

  return {
    active,
    isHovering,
    setIsHovering,
    showEnhancedChat,
    setShowEnhancedChat,
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
