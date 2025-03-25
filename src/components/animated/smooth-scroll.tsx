'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export const useSmoothScroll = ({ children }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0)

    const lenis = new Lenis()

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return children
}
