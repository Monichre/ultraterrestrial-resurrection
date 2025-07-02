// Test file to verify GSAP is working
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

export function TestGSAP() {
  useEffect(() => {
    console.log('GSAP Version:', gsap.version)
    
    // Simple test animation
    const testDiv = document.createElement('div')
    testDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      background: red;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(testDiv)
    
    gsap.to(testDiv, {
      rotation: 360,
      scale: 2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
    
    return () => testDiv.remove()
  }, [])
  
  return null
}
