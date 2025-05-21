'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface GridAnimationProps {
  className?: string
}

const GridAnimation: React.FC<GridAnimationProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const items = container.querySelectorAll('.grid-item')
    
    // Reset any existing animations
    gsap.set(items, { scale: 0, opacity: 0 })
    
    // Create the animation
    gsap.to(items, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: {
        amount: 1.5,
        grid: "auto",
        from: "center"
      }
    })

    // Optional cleanup
    return () => {
      gsap.killTweensOf(items)
    }
  }, [])

  // Generate grid items
  const gridItems = Array.from({ length: 100 }, (_, i) => (
    <div
      key={i}
      className="grid-item w-full h-full bg-purple-600 rounded-lg transform-gpu"
    />
  ))

  return (
    <div className={cn("min-h-screen bg-gray-900 flex items-center justify-center p-8", className)}>
      <div
        ref={containerRef}
        className="grid grid-cols-10 gap-2 w-full max-w-4xl aspect-square"
      >
        {gridItems}
      </div>
    </div>
  )
}

export default GridAnimation
