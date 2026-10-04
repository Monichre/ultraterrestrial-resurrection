'use client'

import React, {
  memo,
  useEffect,
  useRef,
  forwardRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react'

import { AnimatedBeam } from '@/components/animated/animated-beam'

// import gsap from 'gsap'
// import { useGSAP } from '@gsap/react'

import { Waypoints } from 'lucide-react'

import {
  AnimatePresence,
  motion,
  stagger,
  useAnimate,
  useInView,
  usePresence,
} from 'framer-motion'
import { cn } from '@/utils/cn'
import { BlurFade } from '@/components/animated/blur-fade/BlurFade'
import { DotPattern } from '@/components/backgrounds/dot-pattern'
import { formatModelWithImage } from '@/utils/image.utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { AnyComponent } from 'styled-components/dist/types'
import { CardHeader, CardContent, Card } from '@/components/ui/card'
import { truncate } from '@/utils/functions'
// gsap.registerPlugin(splitText)
// export interface MindmapSidebarProps {
//   children?: any
// }

export const ModelAvatar = ( { model, className }: any ) => {
  const modelWithImage: any = formatModelWithImage( model )

  const splitName = ( name: string ): string => {
    const [firstName, lastName] = name.split( ' ' )
    const initials =
      firstName && lastName
        ? `${firstName.charAt( 0 )}${lastName.charAt( 0 )}`
        : `${firstName.charAt( 0 )}`
    return initials
  }
  const text = modelWithImage?.name || modelWithImage?.title

  const initials = text && ( text !== ' ' || text !== '' ) ? splitName( text ) : 'X'

  return (
    <Avatar className={cn( 'w-8 h-8 border-[1px] border-white/50', className )}>
      <AvatarImage
        className='object-cover w-full h-full rounded-full'
        src={modelWithImage.photo.url}
        alt={modelWithImage?.name || modelWithImage?.title}
      />
      <AvatarFallback className='text-[8px]'>{initials}</AvatarFallback>
    </Avatar>
  )
}

export const ConnectionCard = ( { connection }: any ) => {
  // const model: any = formatModelWithImage(connection)

  return (
    <Card
      className={`entity-card bg-black shadow relative rounded-lg border border-white/60 dark:border-border/60 rounded-[calc(var(--radius))] bg-dot-white/[0.2] p-1 z-50 !w-min`}
    >
      <CardHeader className='flex flex-row items-center align-center justify-start p-1'>
        <ModelAvatar model={connection} />

        <h3 className='!mt-0 ml-[12px] text-white tracking-wide font-light text-sm'>
          {connection?.name || connection?.title}
        </h3>
      </CardHeader>
    </Card>
  )
}

const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string
    children?: React.ReactNode
    delay: any
    inView: boolean
    variant?: any
  }
>( ( { className, children, delay, inView, variant }: any, ref: any ) => {
  const inViewResult = useInView( ref )
  const isInView = !inView || inViewResult
  const duration = 0.4
  const defaultVariants = {
    hidden: { y: 10, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: `blur(0px)` },
  }
  const combinedVariants = variant || defaultVariants
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        // exit='hidden'
        variants={combinedVariants}
        transition={{
          delay: 0.5 + delay,
          duration,
          ease: 'easeIn',
        }}
        className={cn( className )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} )

Circle.displayName = 'Circle'

export function ConnectionBeams( {
  className,
  originalNode,
  connections,
}: {
  className?: string
  originalNode: any
  connections: any[]
} ) {
  const containerRef = useRef<HTMLDivElement>( null )

  const originalNodeRef = useRef<HTMLDivElement>( null )
  const refs: any = connections.map( useRef )

  return (
    <div
      className={cn(
        'relative flex flex-col min-h-[600px] h-full w-full items-center justify-center mt-2',
        className
      )}
      ref={containerRef}
    >
      <div className='flex flex-col size-full h-full min-h-[600px] items-stretch justify-between gap-10'>
        <Circle
          ref={originalNodeRef}
          delay={0}
          inView
          className='relative z-50 w-min mx-auto'
        >
          <ConnectionCard connection={originalNode.data} />
        </Circle>

        <div className='flex flex-row justify-evenly gap-y-4 self-end place-self-end justify-self-end'>
          {refs.map(
            ( ref: React.Ref<HTMLDivElement> | undefined, index: number ) => (
              <Circle
                key={index}
                ref={ref}
                delay={index * 0.15}
                inView
                className='relative z-50'
              >
                {/* <ConnectionCard connection={connections[index]} /> */}
                {/* <ModelAvatar model={connections[index]} /> */}
                <ConnectionCard connection={connections[index]} />
              </Circle>
            )
          )}
        </div>
      </div>

      {refs.map( ( ref: React.RefObject<HTMLElement>, index: number ) => (
        <AnimatedBeam
          key={index}
          delay={index * 0.25}
          containerRef={containerRef}
          fromRef={originalNodeRef}
          toRef={ref}
          duration={3}
        />
      ) )}
    </div>
  )
}

export interface ConnectionListProps {
  connections: any
  originalNode: {
    data: AnyComponent
  }
}

export const ConnectionList: React.FC<ConnectionListProps> = ( {
  connections,
  originalNode,
}: any ) => {
  return (
    <ConnectionBeams originalNode={originalNode} connections={connections} />
  )
}
