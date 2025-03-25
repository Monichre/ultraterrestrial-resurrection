import { motion } from 'framer-motion'


interface SectionProps {
  item: any
  index: number
}

export function Section( { item, index }: SectionProps ) {
  return (
    <section
      id={`section_${item.id}`}
      className="min-h-screen flex items-center justify-center"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="section-heading text-4xl md:text-6xl font-syncopate mb-8"
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
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
