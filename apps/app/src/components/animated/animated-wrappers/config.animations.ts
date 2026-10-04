export const slideInLeft = {
  initial: {
    x: '-100vw',
  },
  whileInView: {
    x: 0,
  },
}

export const slideInRight = {
  initial: {
    x: '100vw',
  },
  whileInView: {
    x: 0,
  },
}

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  whileInView: {
    opacity: 1,
  },
}

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: '100px',
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
}



export type MotionAnimatedDivProps = {
  delay?: number
  duration?: number
  initial: Record<InitialAnimationKeys, any>
  whileInView: Record<WhileInViewAnimationKeys, any>
  animate?: Record<WhileInViewAnimationKeys, any>
  sibling: Record<string, any>
  exit: boolean
}

export type InitialAnimationKeys = keyof (typeof slideInLeft)['initial'] &
  keyof (typeof fadeInUp)['initial']
export type WhileInViewAnimationKeys =
  keyof (typeof slideInLeft)['whileInView'] &
    keyof (typeof fadeInUp)['whileInView']

export const animationConfig: any = {
  'slide-fade-in-up': {
    ...fadeInUp,
  },
  'slide-fade-in-split-h': {
    initial: {
      ...slideInLeft.initial,
      ...fadeIn.initial,
    },
    whileInView: {
      ...slideInLeft.whileInView,
      ...fadeIn.whileInView,
    },
    sibling: {
      initial: {
        ...slideInRight.initial,
        ...fadeIn.initial,
      },
      whileInView: {
        ...slideInRight.whileInView,
        ...fadeIn.whileInView,
      },
    },
  },
  'split-h': {
    ...slideInLeft,
    sibling: slideInRight,
  },
  'slide-in-left': {
    ...slideInLeft,
    sibling: slideInRight,
  },
  'slide-in-right': {
    ...slideInRight,
    sibling: slideInLeft,
  },
  'fade-in-up': fadeInUp,
  'fade-in': fadeIn,
}

