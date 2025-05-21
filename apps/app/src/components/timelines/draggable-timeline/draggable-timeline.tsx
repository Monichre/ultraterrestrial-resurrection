import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'


interface TimelineProps {
  items: any[]
}

export function DraggableTimeline( { items }: TimelineProps ) {
  const trackRef = useRef<HTMLDivElement>( null )
  const { scrollYProgress } = useScroll()

const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <nav className="fixed top-0 left-0 w-full z-50      
 bg-black/50 backdrop-blur-sm">
      <motion.div
        ref={trackRef}
        className="nav-track relative h-20 cursor-grab  
 active:cursor-grabbing"
        style={{ x }}
      >
        <ul className="flex gap-12 px-6 h-full          
 items-center">
          {items.map( ( event ) => (
            <li key={event.id}>
              <a
                href={`#section_${event.id}`}
                className="nav-link text-white          
 font-syncopate text-sm hover:text-gray-300              
 transition-colors"
              >
                <span>{event.year}</span>
              </a>
            </li>
          ) )}
        </ul>
      </motion.div>
    </nav>
  )
}                             