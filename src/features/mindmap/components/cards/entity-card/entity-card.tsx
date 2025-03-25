import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import '@/components/ui/card/cards.css'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { forwardRef, useCallback, useEffect, useState } from 'react'

import { ConnectionList } from '@/features/mindmap/components/connection-list'
import { useEntity } from '@/hooks'
import { truncate } from '@/utils/functions'
import type { ImageProps } from '@/utils/image.utils'
import { format } from 'date-fns'
import 'react-magic-motion/card.css'

const dayjs = require( 'dayjs' )
const utc = require( 'dayjs/plugin/utc' )
dayjs.extend( utc )

export interface MindMapEntityCardProps {
  id: string
  data: {
    date: any
    description: string
    latitude: number
    location: string
    longitude: number
    photos: ImageProps[]
    name: string
    color: string
    type: string
    label: string
    fill: string
  }
}

export const openSpring = { type: 'spring', stiffness: 200, damping: 30 }
export const closeSpring = { type: 'spring', stiffness: 300, damping: 35 }
export const AnimatedCardWithRef = forwardRef( ( props: any, ref: any ) => (
  <Card ref={ref} {...props} />
) )
export const AnimatedCard = motion( AnimatedCardWithRef )
AnimatedCard.displayName = 'AnimatedCard'

export const AnimatedCardContentWithRef = forwardRef( ( props, ref: any ) => (
  <CardContent ref={ref} {...props} />
) )
AnimatedCardContentWithRef.displayName = 'AnimatedCardContentWithRef'
export const AnimatedCardContent = motion( AnimatedCardContentWithRef )

export const AnimatedImageRef = forwardRef( ( props: any, ref: any ) => (
  <Image ref={ref} {...props} />
) )
AnimatedImageRef.displayName = 'AnimatedImageRef'
export const AnimatedImageContent = motion( AnimatedImageRef )

export const MindMapEntityCard: React.FC<MindMapEntityCardProps> = ( {
  data,
  id,
  ...rest
} ) => {
  const {
    handleHoverLeave,
    entity,
    showMenu,
    setShowMMenu,
    bookmarked,
    setBookmarked,
    relatedDataPoints,
    saveNote,
    updateNote,
    userNote,
    connectionListConnections: connections,
    handleHoverEnter,
    findConnections,
  } = useEntity( { card: { ...data, id } } )
  const {
    type,
    color,
    photos,
    name,
    date: unformattedDate,
    role,
    description,
    location,
    latitude,
    longitude,
  } = entity
  const [image] = photos

  const date = format( unformattedDate, 'MMM dd, yyyy' )

  const [expand, setExpand] = useState( false )
  const toggle = useCallback( () => {
    // findConnections(node)
    setExpand( !expand )
  }, [expand] )

  const animation = {
    hide: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }
  const animatedClass = expand ? 'h-[900x] w-[1000px]' : 'h-[282px] w-[312px]'
  const duration = 100

  const [animatedTitle, setAnimatedTitle] = useState<string>( '' )
  const [animatedDate, setAnimatedDate] = useState<string>( '' )
  const [titleFinished, setTitleFinished] = useState( false )
  const [t, setT] = useState<number>( 0 )
  const [i, setI] = useState<number>( 0 )

  useEffect( () => {
    const typingEffect = setInterval( () => {
      if ( t < name.length ) {
        setAnimatedTitle( name.substring( 0, t + 1 ) )
        setT( t + 1 )
      } else {
        clearInterval( typingEffect )

        setTitleFinished( true )
      }
    }, 100 )

    return () => {
      clearInterval( typingEffect )
    }
  }, [name, t] )

  useEffect( () => {
    const typingEffectTwo = setInterval( () => {
      if ( titleFinished ) {
        if ( i < date.length ) {
          setAnimatedDate( date.substring( 0, i + 1 ) )
          setI( i + 1 )
        } else {
          clearInterval( typingEffectTwo )
        }
      }
    }, 100 )

    return () => {
      clearInterval( typingEffectTwo )
    }
  }, [date, date.length, i, name, t, titleFinished] )

  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue( 0 ) // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring( useTransform( x, [-50, 50], [-45, 45] ), springConfig )
  // translate the tooltip
  const translateX = useSpring( useTransform( x, [-75, 75], [0, 0] ), springConfig )

  // const cardRef = useRef()
  // onMouseMove={handleMouseMove}
  // onMouseEnter={handleMouseEnter}
  // onMouseLeave={handleMouseLeave}

  const variants = {
    open: {
      opacity: 1,
      height: '100%',
      top: 0,
      left: 0,
      position: 'relative',
      zIndex: 5,
    },
    closed: { opacity: 0, height: 0 },
    transition: {
      ...openSpring,
      duration: 0.5,
      delayChildren: 0.5,
      staggerChildren: 0.25,
    },
  }

  const variants2: any = {
    open: {
      opacity: 1,
      height: '100%',
      top: 0,
      left: 0,
      position: 'relative',
      zIndex: 5,
    },
    closed: { height: 0, opacity: 0, y: 100 },
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 100,
      duration: 0.5,
    },
  }
  const variantsImage: any = {
    open: {
      opacity: 1,
      height: '100%',
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 0,
    },
    closed: { height: 0, opacity: 0, y: 100 },
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 100,
      duration: 0.5,
    },
  }
  const variants3 = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 100 },
    transition: {
      ease: 'ease-in-out',
      delay: 0.5,
      duration: 0.25,
    },
  }
  const truncateText = ( text: string, maxLength: number ): string => {
    if ( text.length <= maxLength ) {
      return text
    }
    return text.substring( 0, maxLength ) + '...'
  }

  const transition = {
    type: 'spring',
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
  }

  return (
    <AnimatedCard
      variants={{
        open: { height: '900px', width: '1200px', transform: 'scale(1.5)' },
        closed: { height: '282px', width: '312px', transform: 'scale(1)' },
      }}
      animate={expand ? 'open' : 'closed'}
      style={{ transition: 'all 0.5s ease-in-out' }}
      className={`entity-card shadow relative ${animatedClass} rounded-lg border border-white/60 dark:border-border/30 rounded-[calc(var(--radius))] bg-dot-white/[0.2] overflow-scroll`}
    >
      {expand && (
        <AnimatePresence>
          <>
            <AnimatedImageContent
              key={`${id}-image`}
              // initial={{ opacity: 0, height: 0, width: 0, y: -40 }}
              // animate={expand ? { opacity: 1, height: 300, width: 300, y: 0 }: { opacity: 0, height: 0, width: 0, y: -40 }}

              variants={variantsImage}
              initial={false}
              animate={expand ? 'open' : 'closed'}
              alt='Product image'
              className='absolute top-0 left-0 z-[0] h-auto w-full bg-black/50 z-[0] max-h-[400px]'
              height={200}
              src={image?.url}
              width={200}
            />
            <div
              className='absolute top-0 left-0 h-full w-full z-[2] max-h-[400px]'
              style={{
                background:
                  'linear-gradient(rgba(0, 0, 0, .9), rgba(0, 0, 0,.75), rgba(0, 0, 0, 0.25))',
              }}
            />
          </>
        </AnimatePresence>
      )}
      {/* <div
        className='border border-white/20 rounded-[calc(var(--radius)-2px)] relative '
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      > */}

      {/* <AnimatePresence>
          {showMenu && (
            <motion.div
              key='utility-menu'
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={transition}
              className='absolute top-[-50px] z-[-2] w-full h-auto flex align-center items-center justify-center bg-none'
            >
              <EntityCardUtilityMenu node={node} onSave={() => {}} />
            </motion.div>
          )}
        </AnimatePresence> */}

      <CardHeader
        className={`flex ${expand ? 'flex-col align-start justify-start items-start' : ''} h-[282px] w-[312px] relative z-10 after:content-['*'] after:absolute after:width-[80%] after:left-[10%] after:bottom-0 after:height-[2px] after:bg-white `}
        onClick={toggle}
      // animate={{ top: 0, scale: 1, y: 0 }}
      >
        {expand ? null : (
          <>
            <AnimatedImageContent
              animate={{ opacity: 2, height: 282, width: 312, y: 0 }}
              // animate={expand ? { opacity: 1, height: 300, width: 300, y: 0 }: { opacity: 0, height: 0, width: 0, y: -40 }}

              alt={name}
              className='rounded-md object-cover absolute top-0 left-0 z-[1] mr-0'
              height={282}
              src={image?.url}
              width={312}
            />
            <div
              className='absolute top-0 left-0 h-[282px] w-[312px] z-[2] mt-0 m-0'
              style={{
                background: 'rgba(0, 0, 0, .8)',
                // background:
                // 'linear-gradient(rgba(0, 0, 0, .9), rgba(0, 0, 0,.75), rgba(0, 0, 0, 0.25))',
              }}
            />
          </>
        )}
        <div className='relative z-10'>
          <h2 className='text-white uppercase font-bebasNeuePro text-2xl tracking-wider'>
            {animatedTitle}
          </h2>

          <p
            className={`w-fit ${expand ? '' : ''} date text-1xl text-[#78efff] uppercase font-bebasNeuePro tracking-wider`}
          >
            [{date}]
          </p>
        </div>
        {expand && (
          <>
            <div className={`w-fit ${expand ? '' : 'ml-4'} `}>
              <span className='text-1xl text-[#78efff] uppercase font-source text-white tracking-wider'>
                {location}
              </span>
            </div>
            <div className={`w-fit ${expand ? '' : 'ml-4'} `}>
              <span className='text-1xl text-[#78efff] uppercase font-source text-white tracking-wider'>
                [{latitude}, {longitude}]
              </span>
            </div>
          </>
        )}
      </CardHeader>

      {expand && (
        <motion.p
          className='relative z-10 text-xl font-source text-white text-left p-2 px-4'
          key={`${id}-additional-info`}
          initial='closed'
          variants={variants3}
          animate={expand ? 'open' : 'closed'}
        >
          {truncate( description, 500 )}
        </motion.p>
      )}

      {/* {expand && (
        <motion.div
          variants={variants2}
          key={`${id}-image-container`}
          initial={'closed'}
          animate={expand ? 'open' : 'closed'}
          className='p-2 w-full relative z-10 h-auto flex flex-col justify-center'
        >
      
          <motion.p
            className='relative z-10 text-xl font-source text-white text-left'
            key={`${id}-additional-info`}
            initial='closed'
            variants={variants3}
            animate={expand ? 'open' : 'closed'}
          >
            {expand ? description : truncate(description, 300)}
          </motion.p>

          
        </motion.div>
      )} */}
      {connections && (
        <ConnectionList originalNode={entity} connections={connections} />
      )}
      {/* {expand && (
        <CardFooter className='absolute top-[10px] right-[10px] z-10 flex flex-row justify-center'>
          <div className='rounded-full border-slate-500'>
            <EntityCardUtilityMenu
              bookmarked={bookmarked}
              searchRelatedDataPoints={searchRelatedDataPoints}
              handleSave={handleSave}
            />
          </div>
        </CardFooter>
      )} */}
    </AnimatedCard>
  )
}

// #TODO: Add this card expansion animation:
/* 
https://www.react-magic-motion.com/applications/expandable-card
*/
