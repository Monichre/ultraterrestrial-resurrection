'use client'

import { useState, useEffect, useRef } from 'react'

export function useVisibility(isScrolling: unknown) {
  const [status, setStatus]: any = useState(null) // 'isEntering' or 'isLeaving'
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatus('entering')
        } else {
          setStatus('leaving')
        }
      },
      {
        threshold: 0.9, // Trigger when 90% of the element is out of the viewport
      }
    )

    const currentElement = elementRef.current

    if (currentElement && isScrolling) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [isScrolling])

  return [status, elementRef]
}
