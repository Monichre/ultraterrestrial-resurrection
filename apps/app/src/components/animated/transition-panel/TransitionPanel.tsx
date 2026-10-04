'use client'

import {
  AnimatePresence,
  Transition,
  Variant,
  motion,
  MotionProps,
} from 'framer-motion'
import { cn } from '@/utils'

export const PanelMenuItem = ( {
  title,
  onClick,
  active,
  index,
}: {
  title: string
  onClick: ( index: number ) => void
  active: boolean
  index: number
} ) => {
  const handleClick = () => {
    onClick( index )
  }
  return (
    <button
      onClick={handleClick}
      className={`rounded-md px-3 py-1 text-sm font-medium ${active
          ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
        }`}
    >
      {title}
    </button>
  )
}

export const PanelMenu = ( {
  items,
  activeIndex,
  onClick,
}: {
  items: any[]

  onClick: ( index: number ) => void
  activeIndex: number
} ) => {
  return (
    <div className='mb-4 flex space-x-2'>
      {items.map( ( item, index ) => (
        <PanelMenuItem
          key={index}
          index={index}
          title={item.title}
          onClick={onClick}
          active={activeIndex === index}
        />
      ) )}
    </div>
  )
}

export const TransitionPanelCard = ( { item }: any ) => {
  return (
    <div className='py-2'>
      <h3 className='mb-2 font-medium text-zinc-800 dark:text-zinc-100'>
        {item.subtitle}
      </h3>
      <p className='text-zinc-600 dark:text-zinc-400'>{item.content}</p>
    </div>
  )
}

type TransitionPanelProps = {
  children: React.ReactNode[]
  className?: string
  transition?: Transition
  activeIndex: number
  variants?: { enter: Variant; center: Variant; exit: Variant }
} & MotionProps

export function TransitionPanel( {
  children,
  className,
  transition,
  variants,
  activeIndex,
  ...motionProps
}: TransitionPanelProps ) {
  return (
    <div className={cn( 'relative', className )}>
      <AnimatePresence
        initial={false}
        mode='popLayout'
        custom={motionProps.custom}
      >
        <motion.div
          key={activeIndex}
          variants={variants}
          transition={transition}
          initial='enter'
          animate='center'
          exit='exit'
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
