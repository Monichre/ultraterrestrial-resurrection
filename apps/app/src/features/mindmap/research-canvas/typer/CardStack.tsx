"use client"

import { AnimatePresence, motion } from "framer-motion"
import { TYPER_ITEMS, CARD_VARIANTS } from "./constants"

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
    <AnimatePresence mode="wait">
      {shouldShow ? (
        <motion.div
          key="cards"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="relative flex items-center justify-center h-[220px] w-[600px] -translate-y-16"
          >
            {TYPER_ITEMS.map((item, index) => {
              const isSelected = pinnedCard === index
              const shouldHide = pinnedCard !== null && pinnedCard !== index

              return (
                <motion.div
                  layoutId={isSelected ? undefined : `typer-item-${index}`}
                  key={item.id}
                  variants={CARD_VARIANTS}
                  custom={index}
                  animate={shouldHide ? "hidden" : isSelected ? "pinned" : animationState}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute overflow-clip rounded-2xl flex items-center justify-center group cursor-pointer border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                  style={{ width: 200, height: 120 }}
                  onClick={() => onCardClick(item.command, index)}
                >
                  <div className="size-full flex-col flex items-center justify-center gap-3 p-4">
                    <motion.div
                      layoutId={isSelected ? undefined : `typer-icon-${index}`}
                      className="size-fit"
                    >
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
  )
}
