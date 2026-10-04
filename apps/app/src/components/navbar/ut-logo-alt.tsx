'use client'

import React, { useState, useEffect, useCallback } from 'react'

const START_GRADIENT_POSITION = -130
const END_GRADIENT_POSITION = 210
const MAX_GRADIENT_Y = 216 - 80
const GRADIENT_MOVE_INTERVAL = 10
const GLOWING_LINE_HEIGHT = 81
const GLOW_COLOR = '#009688'

type SVGLineGlowAnimateProps = {
  movementDelay?: number
  id: number
  additionalHeight?: number
  initialGradientY?: number
}

type GradientPosition = {
  y1: number
  y2: number
}

const SVGLineGlowAnimate: React.FC<SVGLineGlowAnimateProps> = ({
  id,
  movementDelay = 0,
  additionalHeight = 0,
  initialGradientY = 0,
}) => {
  const svgHeight = 228 + additionalHeight
  const [gradientPosition, setGradientPosition] = useState<GradientPosition>({
    y1: START_GRADIENT_POSITION,
    y2: END_GRADIENT_POSITION,
  })
  const [opacity, setOpacity] = useState(0)

  const moveGradient = useCallback(() => {
    setGradientPosition((prev) => {
      const newY1 = prev.y1 + 1
      const newY2 = prev.y2 + 1

      const distanceTravelled = newY1 - START_GRADIENT_POSITION
      let newOpacity = 0

      const totalDistance = svgHeight - GLOWING_LINE_HEIGHT
      const halfDistance = totalDistance / 2

      if (distanceTravelled <= halfDistance) {
        newOpacity = distanceTravelled / halfDistance
      } else {
        newOpacity = 1 - (distanceTravelled - halfDistance) / halfDistance
      }

      setOpacity(newOpacity)

      if (newY1 > MAX_GRADIENT_Y - GLOWING_LINE_HEIGHT) {
        return {
          y1: START_GRADIENT_POSITION,
          y2: END_GRADIENT_POSITION,
        }
      }
      return {
        y1: newY1,
        y2: newY2,
      }
    })
  }, [svgHeight])

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(moveGradient, GRADIENT_MOVE_INTERVAL)
      return () => clearInterval(interval)
    }, movementDelay)

    return () => {
      clearTimeout(startTimeout)
      setOpacity(0)
    }
  }, [moveGradient, movementDelay])

  return (
    <svg
      width='12'
      height={svgHeight}
      viewBox={`0 0 12 ${svgHeight}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path id={`main-line-${id}`} d={`M6 ${svgHeight} L6 0`}></path>

      <use
        href={`#main-line-${id}`}
        opacity={opacity}
        stroke={`url(#gradient-glow-${id})`}
        strokeWidth='6'
        style={{
          filter: `blur(2px) drop-shadow(0px 0px 2px ${GLOW_COLOR})`,
          transition: `opacity 300ms linear`,
        }}
      />

      <use
        href={`#main-line-${id}`}
        stroke={`url(#gradient-solid-${id})`}
        strokeWidth='2'
      />

      <defs>
        <linearGradient
          id={`gradient-glow-${id}`}
          x1='6'
          y1={gradientPosition.y1}
          x2='6'
          y2={gradientPosition.y2}
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.38' stopColor={GLOW_COLOR} stopOpacity='0'></stop>
          <stop offset='0.5' stopColor={GLOW_COLOR} stopOpacity='0.8'></stop>
          <stop offset='0.62' stopColor={GLOW_COLOR} stopOpacity='0'></stop>
        </linearGradient>

        <linearGradient
          id={`gradient-solid-${id}`}
          x1='6'
          y1={initialGradientY}
          x2='6'
          y2={svgHeight}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={GLOW_COLOR} stopOpacity='0'></stop>
          <stop offset='0.5' stopColor={GLOW_COLOR}></stop>
          <stop offset='1' stopColor={GLOW_COLOR} stopOpacity='0'></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const UltraLogoAlt = () => {
  return (
    <div className='flex' style={{ transform: 'scale(0.5)' }}>
      <SVGLineGlowAnimate movementDelay={0} id={1} initialGradientY={20} />
      <SVGLineGlowAnimate movementDelay={3000} id={2} additionalHeight={20} />
      <SVGLineGlowAnimate movementDelay={6000} id={3} initialGradientY={20} />
    </div>
  )
}
