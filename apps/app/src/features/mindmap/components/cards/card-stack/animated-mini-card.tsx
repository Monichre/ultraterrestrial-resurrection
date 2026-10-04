import { motion } from 'framer-motion'

export const MINI_CARD_DEFAULT_HEIGHT = 220
export const AnimatedMiniCard = ({ stacked, children, i, rotateZ }: any) => {
  return (
    <motion.div
      className='absolute px-4 w-full flex justify-center'
      key={i}
      animate={stacked ? 'open' : 'closed'}
      style={{
        // transformOrigin: 'top center',
        transformOrigin: '90% 90%',
      }}
      variants={{
        open: {
          y: i * (MINI_CARD_DEFAULT_HEIGHT + 20),
          // z: 0,
          x: 0,
          rotateZ: 0,
          // // add movement
          top: `16%`,

          // scale: 1 - i * SCALE_FACTOR, // decrease scale for cards that are behind
          z: 0,
        },
        closed: {
          y: i + 20,
          x: i + 2,
          z: i + 1,
          top: `25%`,
          rotateZ,
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}
