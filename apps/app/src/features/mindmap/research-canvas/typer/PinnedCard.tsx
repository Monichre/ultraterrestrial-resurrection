"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface PinnedCardProps {
  pinnedCard: number | null
  pinnedItem: { icon: LucideIcon; name: string } | null
  onUnpin: () => void
}

export function PinnedCard({ pinnedCard, pinnedItem, onUnpin }: PinnedCardProps) {
  return (
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
            style={{ width: 180, height: 56 }}
          >
            <div className="flex items-center gap-3 px-4">
              <motion.div layoutId={`typer-icon-${pinnedCard}`} className="size-fit">
                <pinnedItem.icon className="size-4 text-neutral-300" />
              </motion.div>
              <span className="text-sm font-medium text-white">{pinnedItem.name}</span>
            </div>

            <button
              onClick={onUnpin}
              className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-600 transition-colors"
            >
              <X size={12} className="text-neutral-400" strokeWidth={2} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
