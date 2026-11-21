'use client'

import type React from 'react'
import {useEffect, useState, forwardRef, useCallback} from 'react'
import styles from './GlitchFx.module.css'

import classNames from 'classnames'

interface GlitchFxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: 'slow' | 'medium' | 'fast'
  interval?: number
  trigger?: 'instant' | 'hover' | 'custom'
  continuous?: boolean
}

const GlitchFx = forwardRef<HTMLDivElement, GlitchFxProps>(
  (
    {children, speed = 'medium', interval = 2500, trigger = 'instant', continuous = true, ...rest},
    ref
  ) => {
    const [isGlitching, setIsGlitching] = useState(continuous || trigger === 'instant')

    useEffect(() => {
      if (continuous || trigger === 'instant') {
        setIsGlitching(true)
      }
    }, [continuous, trigger])

    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        setIsGlitching(true)
      }
    }

    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        setIsGlitching(false)
      }
    }

    const triggerGlitch = useCallback(() => {
      if (trigger === 'custom') {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 500)
      }
    }, [trigger])

    useEffect(() => {
      if (trigger === 'custom') {
        const glitchInterval = setInterval(triggerGlitch, interval)
        return () => clearInterval(glitchInterval)
      }
    }, [trigger, interval, triggerGlitch])

    const speedClass = styles[speed]

    return (
      <div
        ref={ref}
        className={classNames(
          'relative z-0 inline-block',
          speedClass,
          isGlitching && styles.active
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}>
        <div className='inline-block w-full z-10'>{children}</div>

        <div
          className={classNames(
            'absolute top-0 left-0 w-full h-full z-0 opacity-50',
            styles.glitchLayer,
            styles.blueShift
          )}>
          {children}
        </div>

        <div
          className={classNames(
            'absolute top-0 left-0 w-full h-full z-0 opacity-50',
            styles.glitchLayer,
            styles.redShift
          )}>
          {children}
        </div>
      </div>
    )
  }
)

GlitchFx.displayName = 'GlitchFx'
export {GlitchFx}
