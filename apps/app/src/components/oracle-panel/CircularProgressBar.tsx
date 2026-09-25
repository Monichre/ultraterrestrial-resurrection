'use client'

import {cn} from '@/utils/cn'

export interface CircularProgressBarProps {
  max?: number
  min?: number
  value?: number
  className?: string
}

export function CircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  className,
}: CircularProgressBarProps) {
  const circumference = 2 * Math.PI * 45
  const unit = circumference / 100
  const percent = ((value - min) / (max - min)) * 100

  return (
    <svg
      className={cn('size-10', className)}
      viewBox='0 0 100 100'
      style={{
        fill: 'none',
        strokeDashoffset: 0,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        transform: 'translateZ(0)',
      }}
      aria-hidden>
      <circle
        cx='50'
        cy='50'
        r='40'
        className='stroke-neutral-500/20'
        strokeWidth={8}
        style={{
          strokeDasharray: `${(90 - percent) * unit}px ${circumference}px`,
          transform: `rotate(${270 - 5 * 3.6}deg) scaleY(-1)`,
          transition: 'all 1s ease 0s',
          transformOrigin: '50px 50px',
        }}
      />
      <circle
        cx='50'
        cy='50'
        r='40'
        className='stroke-neutral-700'
        strokeWidth={8}
        style={{
          strokeDasharray: `${percent * unit}px ${circumference}px`,
          transition: '1s ease 0s',
          transitionProperty: 'stroke-dasharray, transform',
          transform: 'rotate(-90deg)',
          transformOrigin: '50px 50px',
        }}
      />
    </svg>
  )
}

CircularProgressBar.displayName = 'CircularProgressBar'
