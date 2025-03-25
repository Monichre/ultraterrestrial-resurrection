'use client'

import { AnimatedImageContent } from '@/features/mindmap/components/cards/entity-card/entity-card'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

export const EntityCardTooltip = ( { showTooltip, image }: any ) => {
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue( 0 ) // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring( useTransform( x, [-50, 50], [-45, 45] ), springConfig )
  // translate the tooltip
  const translateX = useSpring( useTransform( x, [-75, 75], [0, 0] ), springConfig )

  return (
    <AnimatePresence mode='popLayout'>
      {showTooltip && image && (
        <motion.div
          key='tooltip'
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: -40,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 10,
            },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          style={{
            translateX: translateX,
            rotate: rotate,
            whiteSpace: 'nowrap',
          }}
          className='absolute -top-16 -left-0 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2'
        >
          <div className='absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px ' />
          <div className='absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px ' />
          {image && (
            <AnimatedImageContent
              alt='Product image'
              className='aspect-square w-100 h-100 rounded-md object-cover m-auto'
              height='100'
              src={image?.url}
              width='100'
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
