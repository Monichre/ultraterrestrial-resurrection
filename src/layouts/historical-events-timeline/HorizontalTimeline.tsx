'use client'
import {TextScramble} from '@/components/animated/text-effect/text-scramble/text-scramble'
import {animate, motion} from 'framer-motion'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

export const TimelineHorizontal = React.memo(({years, currentYearIndex: yearIndex = 0}: any) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(yearIndex)
  const [selected, setSelected] = useState<number | null>(null)

  const handleMouseEnter = useCallback((index: number) => {
    console.log('🚀 ~ file: TimelineHorizontal.tsx:15 ~ handleMouseEnter ~ index:', index)
    setHoveredIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  const calculateScale = useCallback(
    (index: number) => {
      if (hoveredIndex === null) return 0.4
      const distance = Math.abs(index - hoveredIndex)
      return Math.max(1 - distance * 0.2, 0.4)
    },
    [hoveredIndex]
  )

  const scaleVariants = useMemo(
    () => ({
      initial: {scale: 0.4},
      animate: (i: number) => ({
        scale: calculateScale(i),
        transition: {type: 'spring', stiffness: 300, damping: 20},
      }),
    }),
    [calculateScale]
  )

  const textVariants = {
    initial: {opacity: 0, filter: `blur(4px)`, scale: 0.4},
    animate: {
      opacity: 1,
      filter: `blur(0px)`,
      scale: 1,
      transition: {duration: 0.15, delay: 0.1},
    },
  }

  const containerRef: any = useRef<HTMLDivElement>(null)
  const refs: any = years.map(() => useRef())
  const originalNodeRef: any = useRef<HTMLDivElement>(null)
  const currentYearIndexRef: any = useRef<number>(0)

  useEffect(() => {
    console.log(
      '🚀 ~ file: TimelineHorizontal.tsx:66 ~ useEffect ~ currentYearIndexRef:',
      currentYearIndexRef
    )
    currentYearIndexRef.current = yearIndex
    setHoveredIndex(yearIndex)
  }, [yearIndex])

  useEffect(() => {
    if (
      !containerRef.current ||
      !originalNodeRef.current ||
      !refs[currentYearIndexRef.current]?.current
    )
      return

    const containerRect = containerRef.current.getBoundingClientRect()
    const fromRect = originalNodeRef.current.getBoundingClientRect()
    const toRect = refs[currentYearIndexRef.current].current.getBoundingClientRect()

    const createLine = () => {
      const line: any = document.querySelector('.timeline-bg-2')
      return line
    }

    const updatePath = () => {
      createLine()
      const fromX = fromRect.left - containerRect.left + fromRect.width / 2
      const fromY = fromRect.top - containerRect.top + fromRect.height / 2
      const toX = toRect.left - containerRect.left + toRect.width / 2
      const toY = toRect.top - containerRect.top + toRect.height / 2

      console.log('🚀 ~ file: TimelineHorizontal.tsx:91 ~ updatePath ~ toX:', toX)

      const d = `M ${fromX} ${fromY} L ${toX} ${toY}`

      animate(
        '.timeline-bg-2-path',
        {d},
        {
          duration: 0.8,
          ease: 'easeInOut',
        }
      )
    }

    updatePath()
    window.addEventListener('resize', updatePath)

    return () => {
      window.removeEventListener('resize', updatePath)
    }
  }, [currentYearIndexRef.current])

  return (
    <div
      className='flex flex-row items-center justify-center timeline-horizontal relative w-full h-24'
      ref={containerRef}>
      <div ref={originalNodeRef} className='absolute left-0 top-1/2 w-2 h-2 opacity-0' />

      <svg className='timeline-bg-2 absolute top-0 left-0 w-full h-full pointer-events-none z-0'>
        <path
          className='timeline-bg-2-path'
          stroke='#27F1FF'
          strokeWidth='1'
          fill='none'
          strokeDasharray={1}
          d='M0 0 L 0 0' // Initial path that will be updated by the effect
        />
      </svg>

      <div className='flex flex-row items-center justify-between w-full px-8 z-40'>
        {years.map((year, i) => {
          const isSelected = selected === i || yearIndex === i

          return (
            <button
              ref={refs[i]}
              key={`${year}-${i}`}
              className='relative inline-flex flex-col items-center justify-center z-40'
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setSelected(i)}
              onTouchStart={() => handleMouseEnter(i)}
              onTouchEnd={handleMouseLeave}>
              <motion.div
                className={`w-10 h-[2px] rounded-[4px]`}
                custom={i}
                variants={scaleVariants}
                initial='initial'
                animate={'animate'}
                style={{backgroundColor: isSelected ? '#27F1FF' : 'white'}}
              />
              {hoveredIndex === i ? (
                <motion.span
                  className={`absolute top-6 text-[11px]`}
                  variants={textVariants}
                  initial='initial'
                  animate='animate'
                  style={{color: isSelected ? '#27F1FF' : 'white'}}>
                  <TextScramble as='span'>{year}</TextScramble>
                </motion.span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
})
