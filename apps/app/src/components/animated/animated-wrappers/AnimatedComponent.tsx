import React, { useRef } from 'react'

import { configureAnimationSequence } from './functions.animations'
import { AnimatePresence, motion } from 'framer-motion'

export const AnimatedComponent = ({ animation, children }: any) => {
  const animateInnerBlocks = animation?.animateInnerBlocks || false
  const ref = useRef(null)

  const {
    initial,
    whileInView,
    duration = 1,
    delay = 0,
  }: any = configureAnimationSequence(animation)

  return (
    <AnimatePresence
    // initialState={configureAnimationSequence(animation)}
    >
      {!animation || animateInnerBlocks ? (
        <>{children}</>
      ) : (
        <motion.div
          transition={{
            duration: duration,
            amount: 'some',
            repeatType: 'reverse',
            ease: 'easeIn',
            delay,
          }}
          initial={initial}
          whileInView={whileInView}
          ref={ref}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
