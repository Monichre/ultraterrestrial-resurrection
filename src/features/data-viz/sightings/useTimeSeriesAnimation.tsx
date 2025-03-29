'use client'
import {useCallback, useRef, useState} from 'react'

export const useTimeSeriesAnimation = (years: number[], speed = 1000) => {
  const initialYear = years?.length ? years[0] : 1940
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(0)
  // State for timeline control
  const [timeRange, setTimeRange] = useState<[number, number]>([
    new Date(initialYear, 0, 1).getTime(),
    new Date().getTime(),
  ])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  const startAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    // Your animation logic here using requestAnimationFrame or setTimeout
  }, [isAnimating])

  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
  }, [])

  // Update time window logic here

  return {year, month, isAnimating, startAnimation, stopAnimation, timeRange, setTimeRange}
}
