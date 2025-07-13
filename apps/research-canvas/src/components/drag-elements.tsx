'use client'

import React, {useEffect, useRef, useState} from 'react'
import {motion} from 'framer-motion'

type DragElementsProps = {
  children: React.ReactNode
  dragElastic?:
    | number
    | {top?: number; left?: number; right?: number; bottom?: number}
    | boolean
  dragConstraints?:
    | {top?: number; left?: number; right?: number; bottom?: number}
    | React.RefObject<Element>
  dragMomentum?: boolean
  dragTransition?: any
  dragPropagation?: boolean
  selectedOnTop?: boolean
  className?: string
}

const DragElements: React.FC<DragElementsProps> = ({
  children,
  dragElastic = 0.5,
  dragConstraints,
  dragMomentum = true,
  dragTransition = {bounceStiffness: 200, bounceDamping: 300},
  dragPropagation = true,
  selectedOnTop = true,
  className,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [zIndices, setZIndices] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [initialPositions, setInitialPositions] = useState<
    {x: number; y: number}[]
  >([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setZIndices(
      Array.from({length: React.Children.count(children)}, (_, i) => i)
    )
    setIsMounted(true)
  }, [children])

  // Calculate initial positions for children after component mounts
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const positions = Array.from(
        {length: React.Children.count(children)},
        (_, index) => {
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2
          const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3
          const angle = (index / React.Children.count(children)) * Math.PI * 2

          return {
            x: centerX + Math.cos(angle) * radius - 150, // Adjust for card width
            y: centerY + Math.sin(angle) * radius - 120, // Adjust for card height
          }
        }
      )
      setInitialPositions(positions)
    }
  }, [isMounted, children])

  const bringToFront = (index: number) => {
    if (selectedOnTop) {
      setZIndices((prevIndices) => {
        const newIndices = [...prevIndices]
        const currentIndex = newIndices.indexOf(index)
        newIndices.splice(currentIndex, 1)
        newIndices.push(index)
        return newIndices
      })
    }
  }

  // Don't render until we have initial positions
  if (!isMounted || initialPositions.length === 0) {
    return (
      <div
        ref={constraintsRef}
        className={`relative w-full h-full ${className}`}
      />
    )
  }

  return (
    <div ref={constraintsRef} className={`relative w-full h-full ${className}`}>
      {/* The constraintsRef div is transparent by default and doesn't add any visual elements like lines */}
      {/* Any visible grid lines or patterns are coming from parent components */}
      {React.Children.map(children, (child, index) => {
        const position = initialPositions[index] || {x: 0, y: 0}

        return (
          <motion.div
            key={index}
            drag
            dragElastic={dragElastic}
            dragConstraints={dragConstraints || constraintsRef}
            dragMomentum={dragMomentum}
            dragTransition={dragTransition}
            dragPropagation={dragPropagation}
            initial={{x: position.x, y: position.y}}
            style={{
              zIndex: zIndices.indexOf(index),
              cursor: isDragging ? 'grabbing' : 'grab',
              position: 'absolute',
            }}
            onDragStart={() => {
              bringToFront(index)
              setIsDragging(true)
            }}
            onDragEnd={() => setIsDragging(false)}
            whileDrag={{cursor: 'grabbing'}}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}

export default DragElements
