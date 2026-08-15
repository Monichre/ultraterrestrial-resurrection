import { motion } from 'framer-motion'
import Image from 'next/image'

import type { DraggableTimelineItem } from './types'

export interface SectionProps {
  item: DraggableTimelineItem
  index: number
}

export function Section({ item, index }: SectionProps) {
  return (
    <section
      id={`section_${item.id}`}
      className="flex min-h-screen items-center justify-center"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="section-heading font-syncopate mb-8 text-4xl md:text-6xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="block text-gray-500">{item.year}</span>
          <span className="block">{item.title}</span>
        </motion.h2>

        <motion.div
          className="section-image max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src={item.image}
            alt={item.title}
            width={1200}
            height={800}
            sizes="(min-width: 768px) 672px, calc(100vw - 2rem)"
            className="h-auto w-full rounded-lg shadow-2xl"
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  )
}
