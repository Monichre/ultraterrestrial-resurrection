'use client'

import {useEffect} from 'react'

/**
 * Tailwind-compatible PulsatingCircles component.
 * - All container and static styles are replaced with Tailwind classes.
 * - Dynamic dot styles are set via style attribute for position, size, animation delay, and opacity.
 * - The pulse animation is defined via a custom Tailwind-compatible keyframes class (see docs below).
 *   You must add the keyframes and animation to your Tailwind config for full compatibility.
 */
export default function PulsatingCircles() {
  useEffect(() => {
    setupPulsatingCircles()
  }, [])

  function setupPulsatingCircles() {
    const container = document.getElementById('anim1')
    if (!container) return

    container.innerHTML = ''

    // Create center dot
    const center = document.createElement('div')
    center.className = 'absolute rounded-full bg-white animate-pulse-fade'
    center.style.width = center.style.height = '8px'
    center.style.left = 'calc(50% - 4px)'
    center.style.top = 'calc(50% - 4px)'
    container.appendChild(center)

    // Create concentric circles of dots
    for (let r = 0; r < 4; r++) {
      const radius = 15 + r * 15
      const count = 6 + r * 3

      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div')
        dot.className = 'absolute rounded-full bg-white animate-pulse-fade'

        const angle = (i / count) * 2 * Math.PI
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const size = 3 + r * 0.3
        dot.style.width = dot.style.height = `${size}px`
        dot.style.left = `calc(50% + ${x}px - ${size / 2}px)`
        dot.style.top = `calc(50% + ${y}px - ${size / 2}px)`

        // Add staggered animation delay based on ring and position
        dot.style.animationDelay = `${r * 0.2 + i * 0.1}s`

        // Decrease opacity for outer rings
        dot.style.background = `rgba(255, 255, 255, ${(90 - r * 10) / 100})`

        container.appendChild(dot)
      }
    }
  }

  return (
    <div
      className='
        absolute top-[100px] left-[100px] w-[100px] h-[100px]
        bg-black/50 p-2 flex flex-col items-center overflow-visible
        transition-colors duration-300 border border-transparent
        hover:border-white/30
      '>
      <div
        className='
          mb-2 text-[12px] tracking-[0.5px] uppercase text-center
        '>
        Ultraterrestrial
      </div>
      <div
        id='anim1'
        className='
          relative w-[180px] h-[180px] flex justify-center items-center
        '
      />
    </div>
  )
}

/**
 * --- Tailwind Custom Animation Required ---
 *
 * Add the following to your tailwind.config.js:
 *
 * theme: {
 *   extend: {
 *     keyframes: {
 *       'pulse-fade': {
 *         '0%':   { opacity: '0', transform: 'scale(0.2)' },
 *         '40%':  { opacity: '1', transform: 'scale(1)' },
 *         '60%':  { opacity: '1', transform: 'scale(1)' },
 *         '100%': { opacity: '0', transform: 'scale(0.2)' },
 *       },
 *     },
 *     animation: {
 *       'pulse-fade': 'pulse-fade 3s infinite ease-in-out',
 *     },
 *   },
 * }
 *
 * This enables the `animate-pulse-fade` class used above.
 */
