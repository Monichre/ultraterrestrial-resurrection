'use client'

import {useEffect, useState, useRef, useCallback} from 'react'
import './cursor.css'

export const CustomCursor = () => {
  const [position, setPosition] = useState({x: 0, y: 0})
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const cursorRippleRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // msMaxTouchPoints is a legacy IE property
        ('msMaxTouchPoints' in navigator
          ? (navigator as unknown as {msMaxTouchPoints: number}).msMaxTouchPoints > 0
          : false)

      setIsMobile(isTouchDevice)

      // Don't show custom cursor on mobile
      if (!isTouchDevice) {
        document.body.classList.add('cursor-active')
      }
    }

    checkIfMobile()

    return () => {
      document.body.classList.remove('cursor-active')
    }
  }, [])

  // Don't run cursor logic on mobile
  if (isMobile) {
    return null
  }

  // Handle mouse move
  const onMouseMove = useCallback((e: MouseEvent) => {
    setPosition({x: e.clientX, y: e.clientY})
    setIsVisible(true)
  }, [])

  // Handle mouse down
  const onMouseDown = useCallback(() => {
    setIsClicking(true)

    // Create ripple effect
    if (cursorRippleRef.current) {
      cursorRippleRef.current.style.left = `${position.x}px`
      cursorRippleRef.current.style.top = `${position.y}px`
      cursorRippleRef.current.classList.remove('ripple-anim')
      // Trigger reflow to restart animation
      void cursorRippleRef.current.offsetWidth
      cursorRippleRef.current.classList.add('ripple-anim')
    }
  }, [position])

  // Handle mouse up
  const onMouseUp = useCallback(() => {
    setIsClicking(false)
  }, [])

  // Handle mouse entering interactive elements
  const onMouseEnterInteractive = useCallback(() => {
    setIsHovering(true)
  }, [])

  // Handle mouse leaving interactive elements
  const onMouseLeaveInteractive = useCallback(() => {
    setIsHovering(false)
  }, [])

  // Handle mouse leaving window
  const onMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  // Handle mouse entering window
  const onMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  // Setup event listeners for mouse movement and button interactions
  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [onMouseEnter, onMouseLeave, onMouseUp, onMouseMove, onMouseDown])

  // Setup interactive elements listeners using MutationObserver to handle elements added later
  useEffect(() => {
    // Function to add event listeners to interactive elements
    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input[type="button"], input[type="submit"], input[type="reset"], [data-cursor="interactive"]'
      )

      for (const element of interactiveElements) {
        element.addEventListener('mouseenter', onMouseEnterInteractive)
        element.addEventListener('mouseleave', onMouseLeaveInteractive)
      }
    }

    // Initial setup
    addInteractiveListeners()

    // Create mutation observer to watch for new elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          addInteractiveListeners()
        }
      }
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Cleanup
    return () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input[type="button"], input[type="submit"], input[type="reset"], [data-cursor="interactive"]'
      )

      for (const element of interactiveElements) {
        element.removeEventListener('mouseenter', onMouseEnterInteractive)
        element.removeEventListener('mouseleave', onMouseLeaveInteractive)
      }

      observer.disconnect()
    }
  }, [onMouseEnterInteractive, onMouseLeaveInteractive])

  // Update cursor position and state with transform
  useEffect(() => {
    if (cursorDotRef.current && cursorRingRef.current) {
      if (!isVisible) {
        cursorDotRef.current.style.opacity = '0'
        cursorRingRef.current.style.opacity = '0'
      } else {
        cursorDotRef.current.style.opacity = '1'
        cursorRingRef.current.style.opacity = '1'

        // Apply transforms with a slight delay for trailing effect
        cursorDotRef.current.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`

        // Delay the ring slightly for a nice trailing effect
        setTimeout(() => {
          if (cursorRingRef.current) {
            cursorRingRef.current.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
          }
        }, 50)
      }
    }
  }, [position, isVisible])

  return (
    <div className='cursor-container'>
      <div
        ref={cursorDotRef}
        className={`cursor-dot ${isHovering ? 'cursor-hover' : ''} ${isClicking ? 'cursor-click' : ''}`}
      />
      <div
        ref={cursorRingRef}
        className={`cursor-ring ${isHovering ? 'cursor-hover' : ''} ${isClicking ? 'cursor-click' : ''}`}
      />
      <div ref={cursorRippleRef} className='cursor-ripple' />
    </div>
  )
}

export default CustomCursor
