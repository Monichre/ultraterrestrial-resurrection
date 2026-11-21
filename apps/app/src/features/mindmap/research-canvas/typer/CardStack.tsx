'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {TYPER_ITEMS, CARD_VARIANTS} from './constants'

interface CardStackProps {
  active: boolean
  showEnhancedChat: boolean
  pinnedCard: number | null
  animationState: string
  isHovering: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onCardClick: (command: string, index: number) => void
}

export function CardStack({
  active,
  showEnhancedChat,
  pinnedCard,
  animationState,
  onHoverStart,
  onHoverEnd,
  onCardClick,
}: CardStackProps) {
  const shouldShow = !active && !showEnhancedChat && pinnedCard === null

  return (
    <AnimatePresence mode='wait'>
      {shouldShow ? (
        <motion.div
          key='cards'
          initial={{opacity: 1}}
          exit={{opacity: 0, y: -20}}
          transition={{duration: 0.3}}>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
