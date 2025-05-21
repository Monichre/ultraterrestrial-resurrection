'use client'

import {useState, useEffect} from 'react'
import {Slider} from '@/components/ui/slider'
import {Button} from '@/components/ui/button'
import {motion, useAnimation} from 'framer-motion'
import type {TimeRange} from '@/hooks/use-sightings-data'

interface TimeRangeSelectorProps {
  timeRange: TimeRange
  onChange: (range: TimeRange) => void
  className?: string
}

export function TimeRangeSelector({timeRange, onChange, className = ''}: TimeRangeSelectorProps) {
  // Minimum and maximum years for the range
  const MIN_YEAR = 1940
  const MAX_YEAR = new Date().getFullYear()

  // Local state to track slider values before committing
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    timeRange.startYear,
    timeRange.endYear,
  ])

  const pulseControls = useAnimation()
  const lineControls = useAnimation()

  // Update local state when props change
  useEffect(() => {
    setSliderValues([timeRange.startYear, timeRange.endYear])
  }, [timeRange])

  // Setup animations
  useEffect(() => {
    pulseControls.start({
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      },
    })

    lineControls.start({
      scaleX: [0, 1, 0],
      opacity: [0.1, 0.5, 0.1],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    })
  }, [pulseControls, lineControls])

  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    setSliderValues([values[0], values[1]])
  }

  // Apply the changes
  const applyChanges = () => {
    onChange({
      startYear: sliderValues[0],
      endYear: sliderValues[1],
    })
  }

  // Preset buttons for common time ranges
  const presets = [
    {label: '5Y', range: {startYear: MAX_YEAR - 5, endYear: MAX_YEAR}},
    {label: '10Y', range: {startYear: MAX_YEAR - 10, endYear: MAX_YEAR}},
    {label: '20Y', range: {startYear: MAX_YEAR - 20, endYear: MAX_YEAR}},
    {label: 'ALL', range: {startYear: MIN_YEAR, endYear: MAX_YEAR}},
  ]

  return (
    <div
      className={`relative overflow-hidden border border-white/20 bg-black/90 backdrop-blur-sm ${className}`}>
      <div className='relative space-y-3 p-3'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-white/10 pb-1'>
          <div className='flex items-center gap-2'>
            <motion.div animate={pulseControls} className='h-1.5 w-1.5 rounded-full bg-cyan-500' />
            <span className='font-monument-mono text-xs text-white/80'>TEMPORAL FILTER</span>
          </div>
          <span className='text-white/40 font-monument-mono text-xs'>
            {sliderValues[0]} - {sliderValues[1]}
          </span>
        </div>

        {/* Slider with tech styling */}
        <div className='relative py-6 px-2'>
          {/* Decorative line under slider */}
          <motion.div
            animate={lineControls}
            className='absolute left-0 right-0 h-px bg-white/20 top-[28px]'
            style={{transformOrigin: 'left'}}
          />

          <Slider
            defaultValue={[sliderValues[0], sliderValues[1]]}
            value={[sliderValues[0], sliderValues[1]]}
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            onValueChange={handleSliderChange}
            onValueCommit={applyChanges}
            className='w-full z-10'
          />

          {/* Year markers */}
          <div className='flex justify-between mt-1 text-[10px] text-white/40 font-monument-mono'>
            <span>{MIN_YEAR}</span>
            <span>{Math.floor((MIN_YEAR + MAX_YEAR) / 2)}</span>
            <span>{MAX_YEAR}</span>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className='h-2 w-full bg-white/5 relative my-1'>
          {/* Current selection indicator */}
          <div
            className='absolute h-full bg-cyan-500/30'
            style={{
              left: `${((sliderValues[0] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
              width: `${((sliderValues[1] - sliderValues[0]) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
            }}
          />

          {/* Decorative markers - significant events */}
          {[1947, 1952, 1969, 1997, 2004, 2017].map((year) => (
            <div
              key={year}
              className='absolute h-full w-px bg-white/40'
              style={{
                left: `${((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
              }}
              title={`Significant event: ${year}`}
            />
          ))}
        </div>

        {/* Preset buttons in sci-fi style */}
        <div className='grid grid-cols-4 gap-2'>
          {presets.map((preset, index) => (
            <Button
              key={index}
              variant='outline'
              size='sm'
              className='h-7 bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs'
              onClick={() => {
                setSliderValues([preset.range.startYear, preset.range.endYear])
                onChange(preset.range)
              }}>
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tech-style decorative elements */}
      <div className='absolute top-0 right-0 h-px w-12 bg-cyan-500/40' />
      <div className='absolute top-0 right-0 h-6 w-px bg-cyan-500/40' />
      <div className='absolute bottom-0 left-0 h-px w-12 bg-cyan-500/40' />
      <div className='absolute bottom-0 left-0 h-6 w-px bg-cyan-500/40' />

      {/* Grid pattern background */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '16px',
        }}
      />
    </div>
  )
}
