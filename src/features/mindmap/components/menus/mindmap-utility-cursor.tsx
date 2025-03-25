'use client'
import React, { useEffect, useState, useRef } from 'react'
import {
  motion,
  SpringOptions,
  useMotionValue,
  useSpring,
  AnimatePresence,
  Transition,
  Variant,
} from 'framer-motion'
import { cn } from '@/utils'

import { PlusIcon } from 'lucide-react'
type CursorProps = {
  children: React.ReactNode
  className?: string
  springConfig?: SpringOptions
  attachToParent?: boolean
  transition?: Transition
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
  onPositionChange?: ( x: number, y: number ) => void
}

function CoreCursor( {
  children,
  className,
  springConfig,
  attachToParent,
  variants,
  transition,
  onPositionChange,
}: CursorProps ) {
  const cursorX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  )
  const cursorY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  )
  const cursorRef = useRef<HTMLDivElement>( null )
  const [isVisible, setIsVisible] = useState( !attachToParent )

  useEffect( () => {

    const updatePosition = ( e: MouseEvent ) => {
      cursorX.set( e.clientX )
      cursorY.set( e.clientY )
      onPositionChange?.( e.clientX, e.clientY )
    }

    document.addEventListener( 'mousemove', updatePosition )

    return () => {
      document.removeEventListener( 'mousemove', updatePosition )
    }
  }, [cursorX, cursorY, onPositionChange] )

  const cursorXSpring = useSpring( cursorX, springConfig || { duration: 0 } )
  const cursorYSpring = useSpring( cursorY, springConfig || { duration: 0 } )

  useEffect( () => {
    const handleVisibilityChange = ( visible: boolean ) => {
      setIsVisible( visible )
    }

    if ( attachToParent && cursorRef.current ) {
      const parent = cursorRef.current.parentElement
      if ( parent ) {
        parent.addEventListener( 'mouseenter', () => {
          parent.style.cursor = 'none'
          handleVisibilityChange( true )
        } )
        parent.addEventListener( 'mouseleave', () => {
          parent.style.cursor = 'auto'
          handleVisibilityChange( false )
        } )
      }
    }

    return () => {
      if ( attachToParent && cursorRef.current ) {
        const parent = cursorRef.current.parentElement
        if ( parent ) {
          parent.removeEventListener( 'mouseenter', () => {
            parent.style.cursor = 'none'
            handleVisibilityChange( true )
          } )
          parent.removeEventListener( 'mouseleave', () => {
            parent.style.cursor = 'auto'
            handleVisibilityChange( false )
          } )
        }
      }
    }
  }, [attachToParent] )

  return (
    <motion.div
      ref={cursorRef}
      className={cn( 'pointer-events-none fixed left-0 top-0 z-50', className )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={variants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function MindMapUtilityCursor( {
  targetElement,
  additionalTargets,
}: any ) {
  const [isHovering, setIsHovering] = useState( false )
  const targetRef: any = useRef<HTMLDivElement>( null )
  const refs = [targetRef, ...additionalTargets].map( useRef )
  const [menuOpen, setMenuOpen] = useState( false )



  const handlePositionChange = ( x: number, y: number ) => {
    if ( targetRef.current ) {
      const rect = targetRef.current.getBoundingClientRect()
      const isInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      setIsHovering( isInside )
    }
  }

  useEffect( () => {
    if ( targetElement ) {
      targetRef.current = targetElement
    } else {
      const graph = document.querySelector( '.react-flow__nodes' )
      targetRef.current = graph
    }
  }, [targetElement] )

  useEffect( () => {
    if ( targetRef.current ) {
      targetRef.current.addEventListener( 'click', () => {
        setMenuOpen( true )
      } )

    }
  }, [targetElement] )


  return (
    <div className='flex h-[400px] w-full items-center justify-center'>
      <CoreCursor
        attachToParent
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: 'easeInOut',
          duration: 0.15,
        }}
        onPositionChange={handlePositionChange}
      >
        <motion.div
          animate={{
            width: isHovering ? 80 : 16,
            height: isHovering ? 32 : 16,
          }}
          className='flex items-center justify-center rounded-[24px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40'
        >
          <AnimatePresence>
            {isHovering ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className='inline-flex w-full items-center justify-center'
              >
                <div className='inline-flex items-center text-sm text-white dark:text-black'>
                  More <PlusIcon className='ml-1 h-4 w-4' />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </CoreCursor>
    </div>
  )
}
