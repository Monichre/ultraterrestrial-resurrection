'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

export const useSimpleAnimation = () => {
  useEffect(() => {
    // Simple fade-in animation that should definitely work
    const tl = gsap.timeline()
    
    // Hide everything first
    gsap.set("body > div", { opacity: 0 })
    
    // Fade in main container
    tl.to("body > div", {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    })
    
    // Fade in earth and moon
    .fromTo("#earth-canvas, #moon-canvas", {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 2,
      stagger: 0.3,
      ease: "power2.out"
    })
    
    // Fade in title
    .fromTo(".astronaut", {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    })
    
  }, [])
}
