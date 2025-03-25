'use client'

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, View } from '@react-three/drei'

import { Overlay } from './overlay'
import { Model } from './model'
import './scroll-through-3d.css'

export interface ThreeDScrollThroughProps {
  events: any
  years: string[]
  keyFigures: any
}

export const ScrollThrough3D: React.FC<ThreeDScrollThroughProps> = ({
  events,
  years,
  keyFigures,
}: ThreeDScrollThroughProps) => {
  const sourceRef: any = useRef()
  const overlay: any = useRef()
  const scroll: any = useRef(0)

  const lastYearIndex = years.length - 1
  // const [yearIndex, setYearIndex]: any = useState(0)
  // const [activeYear, setActiveYear]: any = useState(years[yearIndex])
  // const [currentEvents, setCurrentEvents] = useState(events[activeYear])
  const [yearIndex, setYearIndex] = useState(3)
  const activeYear = years[yearIndex]
  const currentEvents = events[activeYear]

  const moveToNextYear = useCallback(() => {
    setYearIndex((prevIndex) => (prevIndex + 1) % years.length)
  }, [years.length])

  const moveToPreviousYear = useCallback(() => {
    setYearIndex((prevIndex) => (prevIndex - 1 + years.length) % years.length)
  }, [years.length])

  const updateActiveYear = (year: any) => {
    const index = years.indexOf(year)
    console.log('index: ', index)
    setYearIndex(index)
  }
  // const moveToNextYear = useCallback(() => {
  //   if (yearIndex + 1 > lastYearIndex) {
  //     setYearIndex(0)
  //     setActiveYear(years[0])
  //   } else {
  //     const nextYear = yearIndex + 1
  //     setYearIndex(nextYear)
  //     setActiveYear(years[nextYear])
  //     setCurrentEvents(events[years[nextYear]])
  //   }
  // }, [events, lastYearIndex, yearIndex, years])

  // const moveToPreviousYear = useCallback(() => {
  //   if (yearIndex - 1 < 0) {
  //     setYearIndex(lastYearIndex)
  //     setActiveYear(years[lastYearIndex])
  //   } else {
  //     const previousYear = yearIndex - 1
  //     setYearIndex(previousYear)
  //     setActiveYear(years[previousYear])
  //     setCurrentEvents(events[years[previousYear]])
  //   }
  // }, [events, lastYearIndex, yearIndex, years])

  // useEffect(() => {
  //   setActiveYear(years[yearIndex])
  // }, [yearIndex, years])

  // useEffect(() => {
  //   if (activeYear && events[activeYear]) {
  //     setCurrentEvents(events[activeYear])
  //   }
  // }, [activeYear, events])

  return (
    <div id='threeD-scroll-through' className='h-[100vh]' ref={sourceRef}>
      <Canvas shadows eventSource={sourceRef.current} eventPrefix='client'>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model scroll={scroll} />

          <Environment preset='city' />
        </Suspense>
      </Canvas>

      <Overlay
        ref={overlay}
        updateActiveYear={updateActiveYear}
        scroll={scroll}
        activeYear={activeYear}
        currentEvents={currentEvents}
        eventsByYear={events}
        moveToNextYear={moveToNextYear}
        moveToPreviousYear={moveToPreviousYear}
      />
    </div>
  )
}
