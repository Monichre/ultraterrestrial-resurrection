import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import type { DraggableTimelineItem } from './types'

export interface DraggableTimelineProps {
  items: DraggableTimelineItem[]
}

export function DraggableTimeline({ items }: DraggableTimelineProps) {
  const trackRef = useRef<HTMLDivElement>( null )
  const { scrollYProgress } = useScroll()

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-black/50 backdrop-blur-sm">
      <motion.div
        ref={trackRef}
        className="nav-track relative h-20 cursor-grab active:cursor-grabbing"
        style={{ x }}
      >
        <ul className="flex h-full items-center gap-12 px-6">
          {items.map((event) => (
            <li key={event.id}>
              <a
                href={`#section_${event.id}`}
                className="nav-link font-syncopate text-sm text-white transition-colors hover:text-gray-300"
              >
                <span>{event.year}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  )
}