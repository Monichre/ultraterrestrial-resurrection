'use client'

import {useEffect, useRef} from 'react'

interface GeometricBackgroundProps {
  scrollProgress: number
}

interface CircleTransition {
  initial: {cx: number; cy: number; r: number}
  final: {cx: number; cy: number; r: number}
  outlineElement?: SVGCircleElement
  filledElement?: SVGCircleElement
}

export function GeometricBackground({scrollProgress}: GeometricBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const circleTransitionsRef = useRef<CircleTransition[]>([])
  const gridLinesRef = useRef<SVGLineElement[]>([])
  const glowCircleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    svg.innerHTML = '' // Clear existing content

    // Create grid lines
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    gridGroup.setAttribute('id', 'grid-lines')
    svg.appendChild(gridGroup)

    const gridSpacing = 48
    gridLinesRef.current = []

    // Vertical lines
    for (let i = 0; i <= 40; i++) {
      const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      vLine.setAttribute('class', 'grid-line')
      vLine.setAttribute('x1', String(i * gridSpacing))
      vLine.setAttribute('y1', '0')
      vLine.setAttribute('x2', String(i * gridSpacing))
      vLine.setAttribute('y2', '1080')
      vLine.setAttribute('stroke', 'rgba(255,255,255,0.1)')
      vLine.setAttribute('stroke-width', '0.5')
      gridGroup.appendChild(vLine)
      gridLinesRef.current.push(vLine)
    }

    // Horizontal lines
    for (let i = 0; i <= 22; i++) {
      const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      hLine.setAttribute('class', 'grid-line')
      hLine.setAttribute('x1', '0')
      hLine.setAttribute('y1', String(i * gridSpacing))
      hLine.setAttribute('x2', '1920')
      hLine.setAttribute('y2', String(i * gridSpacing))
      hLine.setAttribute('stroke', 'rgba(255,255,255,0.1)')
      hLine.setAttribute('stroke-width', '0.5')
      gridGroup.appendChild(hLine)
      gridLinesRef.current.push(hLine)
    }

    // Create circle groups
    const circlesOutlineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    circlesOutlineGroup.setAttribute('id', 'circles-outline')
    svg.appendChild(circlesOutlineGroup)

    const circlesFilledGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    circlesFilledGroup.setAttribute('id', 'circles-filled')
    svg.appendChild(circlesFilledGroup)

    // Define circle transitions
    const d = 80
    const centerX = 960
    const centerY = 540

    circleTransitionsRef.current = [
      {
        initial: {cx: centerX - 3 * d, cy: centerY, r: d * 0.8},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX + 3 * d, cy: centerY, r: d * 0.8},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX, cy: centerY - 3 * d, r: d * 0.8},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX, cy: centerY + 3 * d, r: d * 0.8},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX - 2 * d, cy: centerY - 2 * d, r: d * 0.6},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX + 2 * d, cy: centerY - 2 * d, r: d * 0.6},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX - 2 * d, cy: centerY + 2 * d, r: d * 0.6},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX + 2 * d, cy: centerY + 2 * d, r: d * 0.6},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX - 4 * d, cy: centerY, r: d * 0.4},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX + 4 * d, cy: centerY, r: d * 0.4},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX, cy: centerY - 4 * d, r: d * 0.4},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX, cy: centerY + 4 * d, r: d * 0.4},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
      {
        initial: {cx: centerX, cy: centerY, r: d * 0.3},
        final: {cx: centerX, cy: centerY, r: 4 * d},
      },
    ]

    // Create circles
    circleTransitionsRef.current.forEach((transition, index) => {
      // Outline circle
      const circleOutline = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circleOutline.setAttribute('class', 'circle-outline')
      circleOutline.setAttribute('cx', String(transition.initial.cx))
      circleOutline.setAttribute('cy', String(transition.initial.cy))
      circleOutline.setAttribute('r', String(transition.initial.r))
      circleOutline.setAttribute('fill', 'none')
      circleOutline.setAttribute('stroke', 'rgba(255,255,255,0.3)')
      circleOutline.setAttribute('stroke-width', '1')
      circlesOutlineGroup.appendChild(circleOutline)
      transition.outlineElement = circleOutline

      // Filled circle
      const circleFilled = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circleFilled.setAttribute('class', 'circle-filled')
      circleFilled.setAttribute('cx', String(transition.initial.cx))
      circleFilled.setAttribute('cy', String(transition.initial.cy))
      circleFilled.setAttribute('r', String(transition.initial.r))
      circleFilled.setAttribute('fill', 'rgba(255,255,255,0.02)')
      circleFilled.setAttribute('stroke', 'none')
      circlesFilledGroup.appendChild(circleFilled)
      transition.filledElement = circleFilled
    })
  }, [])

  useEffect(() => {
    // Update animations based on scroll progress
    const updateAnimations = () => {
      // Update grid opacity
      const gridOpacity = Math.max(0, 0.3 * (1 - scrollProgress * 1.5))
      gridLinesRef.current.forEach((line) => {
        line.setAttribute('stroke-opacity', String(gridOpacity))
      })

      // Update circles
      circleTransitionsRef.current.forEach((transition, index) => {
        const currentCx =
          transition.initial.cx + (transition.final.cx - transition.initial.cx) * scrollProgress
        const currentCy =
          transition.initial.cy + (transition.final.cy - transition.initial.cy) * scrollProgress
        const currentR =
          transition.initial.r + (transition.final.r - transition.initial.r) * scrollProgress
        const rotation = scrollProgress * 360 * (index % 2 === 0 ? 1 : -1)
        const opacity = Math.max(0.1, 1 - scrollProgress * 0.7)

        if (transition.outlineElement) {
          transition.outlineElement.setAttribute('cx', String(currentCx))
          transition.outlineElement.setAttribute('cy', String(currentCy))
          transition.outlineElement.setAttribute('r', String(currentR))
          transition.outlineElement.setAttribute(
            'transform',
            `rotate(${rotation} ${currentCx} ${currentCy})`
          )
          transition.outlineElement.setAttribute('stroke-opacity', String(opacity))
        }

        if (transition.filledElement) {
          transition.filledElement.setAttribute('cx', String(currentCx))
          transition.filledElement.setAttribute('cy', String(currentCy))
          transition.filledElement.setAttribute('r', String(currentR))
          transition.filledElement.setAttribute(
            'transform',
            `rotate(${rotation} ${currentCx} ${currentCy})`
          )
          transition.filledElement.setAttribute('fill-opacity', String(opacity * 0.05))
        }
      })

      // Update glow circle
      if (glowCircleRef.current) {
        const scale = 1 + scrollProgress * 1.8
        const shadowSize = scrollProgress * 150
        const shadowSpread = scrollProgress * 35
        const shadowOpacity = scrollProgress

        glowCircleRef.current.style.transform = `scale(${scale})`
        glowCircleRef.current.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(255, 255, 0, ${shadowOpacity})`
      }
    }

    updateAnimations()
  }, [scrollProgress])

  return (
    <>
      {/* SVG Geometric Background */}
      <svg
        ref={svgRef}
        className='fixed inset-0 w-full h-full pointer-events-none z-0'
        viewBox='0 0 1920 1080'
        preserveAspectRatio='xMidYMid slice'
      />

      {/* Central Glow Circle */}
      <div
        ref={glowCircleRef}
        className='fixed top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 pointer-events-none z-5'
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,0,0.6) 30%, rgba(255,255,0,0.2) 70%, transparent 100%)',
        }}
      />
    </>
  )
}
