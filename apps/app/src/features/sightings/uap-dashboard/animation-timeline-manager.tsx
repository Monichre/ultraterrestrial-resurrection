'use client'

import React, {useEffect, useRef, useCallback} from 'react'
import {motion} from 'framer-motion'
import type {TimeRangeState} from './enhanced-time-selector'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'

interface AnimationTimelineManagerProps {
  timeRange: TimeRangeState
  sightingsData: ValidatedUAPSighting[]
  eventsData: any[]
  onTimeSliceChange: (currentDate: Date, visibleData: {
    sightings: ValidatedUAPSighting[]
    events: any[]
  }) => void
  onAnimationProgress: (progress: number) => void
}

export function AnimationTimelineManager({
  timeRange,
  sightingsData,
  eventsData,
  onTimeSliceChange,
  onAnimationProgress,
}: AnimationTimelineManagerProps) {
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const currentProgressRef = useRef<number>(0)

  // Calculate total animation duration in milliseconds
  const totalDurationMs = useCallback(() => {
    const totalYears = timeRange.endDate.getFullYear() - timeRange.startDate.getFullYear()
    const baseTimePerYear = 2000 // 2 seconds per year at 1x speed
    return (totalYears * baseTimePerYear) / timeRange.animationSpeed
  }, [timeRange])

  // Get data for specific time slice
  const getDataForTimeSlice = useCallback(
    (currentDate: Date, windowDays: number = 365) => {
      const windowStart = new Date(currentDate.getTime() - (windowDays / 2) * 24 * 60 * 60 * 1000)
      const windowEnd = new Date(currentDate.getTime() + (windowDays / 2) * 24 * 60 * 60 * 1000)

      const sightings = sightingsData.filter((sighting) => {
        const sightingDate = new Date(sighting.timestamp)
        return sightingDate >= windowStart && sightingDate <= windowEnd
      })

      const events = eventsData.filter((event) => {
        const eventDate = new Date(event.date || event.timestamp)
        return eventDate >= windowStart && eventDate <= windowEnd
      })

      return {sightings, events}
    },
    [sightingsData, eventsData]
  )

  // Animation step function
  const animationStep = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / totalDurationMs(), 1)
      currentProgressRef.current = progress

      // Calculate current date based on progress
      const totalTimeSpan = timeRange.endDate.getTime() - timeRange.startDate.getTime()
      const currentTimestamp = timeRange.startDate.getTime() + (progress * totalTimeSpan)
      const currentDate = new Date(currentTimestamp)

      // Get visible data for current time slice
      const visibleData = getDataForTimeSlice(currentDate)

      // Update callbacks
      onAnimationProgress(progress)
      onTimeSliceChange(currentDate, visibleData)

      // Continue animation if not finished and still animating
      if (progress < 1 && timeRange.isAnimating) {
        animationRef.current = requestAnimationFrame(animationStep)
      } else if (progress >= 1) {
        // Animation completed
        onAnimationProgress(1)
        // Optionally reset or stop
      }
    },
    [timeRange, totalDurationMs, getDataForTimeSlice, onAnimationProgress, onTimeSliceChange]
  )

  // Start/stop animation based on timeRange.isAnimating
  useEffect(() => {
    if (timeRange.isAnimating) {
      startTimeRef.current = undefined
      animationRef.current = requestAnimationFrame(animationStep)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [timeRange.isAnimating, animationStep])

  // Reset animation when speed changes
  useEffect(() => {
    if (timeRange.isAnimating) {
      startTimeRef.current = undefined
    }
  }, [timeRange.animationSpeed])

  // This component doesn't render anything visible
  return null
}

// Hook for using animation timeline in components
export function useAnimationTimeline(
  timeRange: TimeRangeState,
  sightingsData: ValidatedUAPSighting[],
  eventsData: any[]
) {
  const [currentAnimationDate, setCurrentAnimationDate] = React.useState<Date>(timeRange.startDate)
  const [animationProgress, setAnimationProgress] = React.useState(0)
  const [visibleData, setVisibleData] = React.useState<{
    sightings: ValidatedUAPSighting[]
    events: any[]
  }>({sightings: sightingsData, events: eventsData})

  const handleTimeSliceChange = useCallback(
    (currentDate: Date, data: {sightings: ValidatedUAPSighting[]; events: any[]}) => {
      setCurrentAnimationDate(currentDate)
      setVisibleData(data)
    },
    []
  )

  const handleAnimationProgress = useCallback((progress: number) => {
    setAnimationProgress(progress)
  }, [])

  return {
    currentAnimationDate,
    animationProgress,
    visibleData,
    handleTimeSliceChange,
    handleAnimationProgress,
    AnimationTimelineManager: React.useCallback(
      () => (
        <AnimationTimelineManager
          timeRange={timeRange}
          sightingsData={sightingsData}
          eventsData={eventsData}
          onTimeSliceChange={handleTimeSliceChange}
          onAnimationProgress={handleAnimationProgress}
        />
      ),
      [timeRange, sightingsData, eventsData, handleTimeSliceChange, handleAnimationProgress]
    ),
  }
}