'use client'
import * as React from 'react'

import { BlurFade } from '@/components/animated/blur-fade/BlurFade'

import { cn } from '@/utils'
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type Variants,
} from 'framer-motion'

type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide'

type TextEffectProps = {
  children: string
  per?: 'word' | 'char' | 'line'
  as?: keyof React.JSX.IntrinsicElements
  variants?: {
    container?: Variants
    item?: Variants
  }
  className?: string
  preset?: PresetType
  delay?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  segmentWrapperClassName?: string
}

const defaultStaggerTimes: Record<'char' | 'word' | 'line', number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
}

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
}

const AnimationComponent: React.FC<{
  segment: string
  variants: Variants
  per: 'line' | 'word' | 'char'
  segmentWrapperClassName?: string
}> = React.memo( ( { segment, variants, per, segmentWrapperClassName } ) => {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className='block'>
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden='true'
        variants={variants}
        className='inline-block whitespace-pre'
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className='inline-block whitespace-pre'>
        {segment.split( '' ).map( ( char, charIndex ) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden='true'
            variants={variants}
            className='inline-block whitespace-pre'
          >
            {char}
          </motion.span>
        ) )}
      </motion.span>
    )

  if ( !segmentWrapperClassName ) {
    return content
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block'

  return (
    <span className={cn( defaultWrapperClassName, segmentWrapperClassName )}>
      {content}
    </span>
  )
} )

AnimationComponent.displayName = 'AnimationComponent'

function TextEffect( {
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps ) {
  let segments: string[]

  if ( per === 'line' ) {
    segments = children.split( '\n' )
  } else if ( per === 'word' ) {
    segments = children.split( /(\s+)/ )
  } else {
    segments = children.split( '' )
  }

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants }
  const containerVariants = variants?.container || selectedVariants.container
  const itemVariants = variants?.item || selectedVariants.item
  const ariaLabel = per === 'line' ? undefined : children

  const stagger = defaultStaggerTimes[per]

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...( containerVariants.visible as TargetAndTransition )?.transition,
        staggerChildren:
          ( containerVariants.visible as TargetAndTransition )?.transition
            ?.staggerChildren || stagger,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  }

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='exit'
          aria-label={ariaLabel}
          variants={delayedContainerVariants}
          className={cn( 'whitespace-pre-wrap', className )}
          onAnimationComplete={onAnimationComplete}
        >
          {segments.map( ( segment, index ) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ) )}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}

export const LovecraftQuote = () => {
  return (
    <div className='text-white tracking-wide mx-auto p-8 text-center w-[800px] lovecraft-block'>
      <TextEffect
        per='char'
        preset='fade'
        as='h2'
        className='font-bebasNeuePro text-white text-center text-xl relative site-tagline mb-8 '
      >
        Tracking the State of Disclosure
      </TextEffect>

      <TextEffect
        per='word'
        preset='fade'
        delay={0.25}
        className='font-source mb-8 text-md'
      >
        The most merciful thing in the world, I think, is the inability of the
        human mind to correlate all its contents. We live on a placid island of
        ignorance in the midst of black seas of infinity, and it was not meant
        that we should voyage far. The sciences, each straining in its own
        direction, have hitherto harmed us little; but some day the piecing
        together of dissociated knowledge will open up such terrifying vistas of
        reality, and of our frightful position therein, that we shall either go
        mad from the revelation or flee from the deadly light into the peace and
        safety of a new dark age.
      </TextEffect>

      <TextEffect
        per='char'
        delay={4}
        as='h3'
        className='font-bebasNeuePro text-white text-center text-xl relative site-tagline'
        preset='blur'
      >
        H.P. Lovecraft
      </TextEffect>
    </div>
  )
}
