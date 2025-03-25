'use client'

import React, { forwardRef, useEffect, useState } from 'react'

interface RevealFxProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  speed?: 'slow' | 'medium' | 'fast'
  delay?: number
  translateY?: number | any
  trigger?: boolean
  style?: React.CSSProperties
  className?: string
}

const maskImageStyle = {
  maskImage: 'linear-gradient(to right, black 0%, black 25%, transparent 50%)',
  maskSize: '300% 100%',
}

const RevealFx = forwardRef<HTMLSpanElement, RevealFxProps>(
  (
    {
      children,
      speed = 'medium',
      delay = 0,
      translateY,
      trigger,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsRevealed(true)
      }, delay * 1000)

      return () => clearTimeout(timer)
    }, [delay])

    useEffect(() => {
      if (trigger !== undefined) {
        setIsRevealed(trigger)
      }
    }, [trigger])

    const getSpeedDuration = () => {
      switch (speed) {
        case 'fast':
          return '1.5s'
        case 'medium':
          return '2s'
        case 'slow':
          return '3s'
        default:
          return '2s'
      }
    }

    const getTranslateYValue = () => {
      if (typeof translateY === 'number') {
        return `${translateY}rem`
      } else if (typeof translateY === 'string') {
        return `var(--static-space-${translateY})`
      }
      return undefined
    }
    const translateValue = getTranslateYValue()

    const combinedClassName = [
      'inline-block relative transition-all ease-in-out',
      isRevealed
        ? 'mask-position-[0_0] filter-blur-0'
        : 'mask-position-[100%_0] filter-blur-[0.5rem]',
      className || '',
    ].join(' ')

    const revealStyle: React.CSSProperties = {
      transitionDuration: getSpeedDuration(),
      transform: isRevealed ? 'translateY(0)' : `translateY(${translateValue})`,
      ...style,
    }

    return (
      <span
        ref={ref}
        aria-hidden='true'
        style={revealStyle}
        className={combinedClassName}
        {...rest}
      >
        {children}
      </span>
    )
  }
)

RevealFx.displayName = 'RevealFx'
export { RevealFx }
