'use client'

import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {motion, AnimatePresence, useAnimation} from 'framer-motion'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {Slider} from '@/components/ui/slider'
import {Badge} from '@/components/ui/badge'
import {cn} from '@/utils'
import {format, subDays, subYears, startOfYear, endOfYear} from 'date-fns'
import type {DateRange} from 'react-day-picker'

// Icons
import {
  CalendarIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'

export interface TimeRangeState {
  startDate: Date
  endDate: Date
  selectedYear?: number
  isAnimating: boolean
  animationSpeed: number
}

interface EnhancedTimeSelectorProps {
  timeRange: TimeRangeState
  onChange: (range: TimeRangeState) => void
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  className?: string
  sightingsData?: Array<{timestamp: Date}>
  showAnimation?: boolean
}

export function EnhancedTimeSelector({
  timeRange,
  onChange,
  onDateRangeChange,
  className = '',
  sightingsData = [],
  showAnimation = true,
}: EnhancedTimeSelectorProps) {
  // Constants
  const MIN_YEAR = 1940
  const MAX_YEAR = new Date().getFullYear()
  const currentDate = new Date()

  // Local state
  const [selectedMode, setSelectedMode] = useState<
    'range' | 'year' | 'decade' | 'animation'
  >('range')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: timeRange.startDate,
    to: timeRange.endDate,
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  // Animation controls
  const pulseControls = useAnimation()
  const progressControls = useAnimation()

  // Initialize animations
  useEffect(() => {
    pulseControls.start({
      opacity: [0.4, 1, 0.4],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    })
  }, [pulseControls])

  // Data density analysis
  const dataDensity = useMemo(() => {
    if (!sightingsData.length) return []

    const yearCounts: Record<number, number> = {}
    sightingsData.forEach((sighting) => {
      const year = sighting.timestamp.getFullYear()
      yearCounts[year] = (yearCounts[year] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(yearCounts))
    return Object.entries(yearCounts).map(([year, count]) => ({
      year: parseInt(year),
      count,
      density: maxCount > 0 ? count / maxCount : 0,
    }))
  }, [sightingsData])

  // Quick preset options
  const presets = [
    {
      label: 'Last 30 Days',
      value: 'last_30_days',
      getRange: () => ({
        from: subDays(currentDate, 30),
        to: currentDate,
      }),
    },
    {
      label: 'Last Year',
      value: 'last_year',
      getRange: () => ({
        from: subYears(currentDate, 1),
        to: currentDate,
      }),
    },
    {
      label: 'Last 5 Years',
      value: 'last_5_years',
      getRange: () => ({
        from: subYears(currentDate, 5),
        to: currentDate,
      }),
    },
    {
      label: 'All Time',
      value: 'all_time',
      getRange: () => ({
        from: new Date(MIN_YEAR, 0, 1),
        to: currentDate,
      }),
    },
  ]

  // Decade options
  const decades = useMemo(() => {
    const result = []
    for (let year = MIN_YEAR; year <= MAX_YEAR; year += 10) {
      const endYear = Math.min(year + 9, MAX_YEAR)
      result.push({
        label: `${year}s`,
        value: `${year}_decade`,
        startYear: year,
        endYear,
        getRange: () => ({
          from: new Date(year, 0, 1),
          to: new Date(endYear, 11, 31),
        }),
      })
    }
    return result.reverse()
  }, [MIN_YEAR, MAX_YEAR])

  // Handle date range selection
  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from || !range?.to) return

      setDateRange(range)
      const newTimeRange: TimeRangeState = {
        ...timeRange,
        startDate: range.from,
        endDate: range.to,
      }
      onChange(newTimeRange)
      onDateRangeChange?.(range.from, range.to)
      setIsCalendarOpen(false)
    },
    [timeRange, onChange, onDateRangeChange]
  )

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (preset: (typeof presets)[0]) => {
      const range = preset.getRange()
      handleDateRangeSelect(range)
    },
    [handleDateRangeSelect]
  )

  // Handle decade selection
  const handleDecadeSelect = useCallback(
    (decade: (typeof decades)[0]) => {
      const range = decade.getRange()
      handleDateRangeSelect(range)
    },
    [handleDateRangeSelect]
  )

  // Animation controls
  const handlePlay = useCallback(() => {
    if (timeRange.isAnimating) {
      onChange({...timeRange, isAnimating: false})
    } else {
      onChange({...timeRange, isAnimating: true})
      // Start animation from beginning of timeframe
      setAnimationProgress(0)
    }
  }, [timeRange, onChange])

  const handleStop = useCallback(() => {
    onChange({...timeRange, isAnimating: false})
    setAnimationProgress(0)
  }, [timeRange, onChange])

  const handleSpeedChange = useCallback(
    (speed: number[]) => {
      onChange({...timeRange, animationSpeed: speed[0]})
    },
    [timeRange, onChange]
  )

  // Parent owns timeRange via onChange/onDateRangeChange; avoid local state mutation here

  // Timeline scrubber component
  const TimelineScrubber = () => {
    const totalYears = MAX_YEAR - MIN_YEAR
    const startPercent =
      ((timeRange.startDate.getFullYear() - MIN_YEAR) / totalYears) * 100
    const endPercent =
      ((timeRange.endDate.getFullYear() - MIN_YEAR) / totalYears) * 100

    return (
      <div className='relative h-12 bg-black/20 border border-white/10 rounded'>
        {/* Data density visualization */}
        <div className='absolute inset-0 flex items-end'>
          {dataDensity.map((data) => (
            <div
              key={data.year}
              className='bg-cyan-500/30 transition-all duration-300'
              style={{
                width: `${100 / totalYears}%`,
                height: `${data.density * 80}%`,
                left: `${((data.year - MIN_YEAR) / totalYears) * 100}%`,
              }}
              title={`${data.year}: ${data.count} sightings`}
            />
          ))}
        </div>

        {/* Selected range indicator */}
        <div
          className='absolute top-0 h-full bg-white/20 border border-cyan-500/50'
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />

        {/* Significant event markers */}
        {[1947, 1952, 1969, 1997, 2004, 2017].map((year) => (
          <div
            key={year}
            className='absolute top-0 h-full w-0.5 bg-yellow-500/60'
            style={{
              left: `${((year - MIN_YEAR) / totalYears) * 100}%`,
            }}
            title={`Significant event: ${year}`}
          />
        ))}

        {/* Timeline labels */}
        <div className='absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-white/40 font-monument-mono'>
          <span>{MIN_YEAR}</span>
          <span>{Math.floor((MIN_YEAR + MAX_YEAR) / 2)}</span>
          <span>{MAX_YEAR}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative space-y-4 p-4 bg-black border border-white/20 backdrop-blur-sm overflow-hidden',
        className
      )}>
      {/* Header with mode selector */}
      <div className='flex items-center justify-between border-b border-white/10 pb-2'>
        <div className='flex items-center gap-2'>
          <motion.div
            animate={pulseControls}
            className='h-2 w-2 rounded-full bg-cyan-500'
          />
          <span className='font-monument-mono text-sm text-white/80 uppercase'>
            Temporal Control
          </span>
        </div>
        <div className='flex gap-1'>
          {[
            {key: 'range', label: 'Range', icon: CalendarIcon},
            {key: 'decade', label: 'Decade', icon: ChevronLeftIcon},
            {key: 'animation', label: 'Animate', icon: PlayIcon},
          ].map(({key, label, icon: Icon}) => (
            <Button
              key={key}
              variant='ghost'
              size='sm'
              className={cn(
                'h-6 px-2 text-xs font-monument-mono',
                selectedMode === key
                  ? 'bg-white/10 text-cyan-400'
                  : 'text-white/60 hover:text-white'
              )}
              onClick={() => setSelectedMode(key as any)}>
              <Icon className='w-3 h-3 mr-1' />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {/* Date Range Mode */}
        {selectedMode === 'range' && (
          <motion.div
            key='range'
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className='space-y-4'>
            {/* Current selection display */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-white/60 font-monument-mono'>Selected Range:</span>
              <Badge variant='outline' className='bg-black border-white/30 text-cyan-400'>
                {format(timeRange.startDate, 'MMM dd, yyyy')} -{' '}
                {format(timeRange.endDate, 'MMM dd, yyyy')}
              </Badge>
            </div>

            {/* Quick presets */}
            <div className='grid grid-cols-2 gap-2'>
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant='outline'
                  size='sm'
                  className='h-8 bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs'
                  onClick={() => handlePresetSelect(preset)}>
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Custom date picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full justify-start bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  Custom Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 bg-black border-white/20'
                align='start'>
                <Calendar
                  mode='range'
                  defaultMonth={timeRange.startDate}
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                  className='bg-black text-white'
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        )}

        {/* Decade Mode */}
        {selectedMode === 'decade' && (
          <motion.div
            key='decade'
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className='space-y-4'>
            <div className='grid grid-cols-3 gap-2 max-h-48 overflow-y-auto'>
              {decades.map((decade) => (
                <Button
                  key={decade.value}
                  variant='outline'
                  size='sm'
                  className='h-8 bg-black border-white/30 text-white hover:bg-white/10 font-monument-mono text-xs'
                  onClick={() => handleDecadeSelect(decade)}>
                  {decade.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Animation Mode */}
        {selectedMode === 'animation' && showAnimation && (
          <motion.div
            key='animation'
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className='space-y-4'>
            {/* Animation controls */}
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='h-8 bg-black border-white/30 text-white hover:bg-white/10'
                onClick={handlePlay}>
                {timeRange.isAnimating ? (
                  <PauseIcon className='w-4 h-4' />
                ) : (
                  <PlayIcon className='w-4 h-4' />
                )}
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='h-8 bg-black border-white/30 text-white hover:bg-white/10'
                onClick={handleStop}>
                <StopIcon className='w-4 h-4' />
              </Button>
              <div className='flex-1 px-2'>
                <div className='text-xs text-white/60 font-monument-mono mb-1'>
                  Speed: {timeRange.animationSpeed}x
                </div>
                <Slider
                  value={[timeRange.animationSpeed]}
                  onValueChange={handleSpeedChange}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className='w-full'
                />
              </div>
            </div>

            {/* Animation progress */}
            <div className='space-y-1'>
              <div className='flex justify-between text-xs text-white/60 font-monument-mono'>
                <span>Progress</span>
                <span>{Math.round(animationProgress * 100)}%</span>
              </div>
              <div className='h-1 bg-white/10 rounded overflow-hidden'>
                <motion.div
                  className='h-full bg-cyan-500'
                  style={{width: `${animationProgress * 100}%`}}
                  transition={{duration: 0.3}}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline scrubber - always visible */}
      <div className='space-y-2'>
        <div className='text-xs text-white/60 font-monument-mono'>
          Timeline Visualization
        </div>
        <TimelineScrubber />
      </div>

      {/* Data stats */}
      <div className='flex justify-between text-xs text-white/40 font-monument-mono pt-2 border-t border-white/10'>
        <span>
          {sightingsData.length} sightings in{' '}
          {timeRange.endDate.getFullYear() - timeRange.startDate.getFullYear() + 1} years
        </span>
        <span>
          Density: {dataDensity.length > 0 ? Math.round(dataDensity.reduce((sum, d) => sum + d.count, 0) / dataDensity.length) : 0} avg/year
        </span>
      </div>

      {/* Tech-style decorative elements */}
      <div className='absolute top-0 right-0 h-px w-8 bg-cyan-500/40' />
      <div className='absolute top-0 right-0 h-4 w-px bg-cyan-500/40' />
      <div className='absolute bottom-0 left-0 h-px w-8 bg-cyan-500/40' />
      <div className='absolute bottom-0 left-0 h-4 w-px bg-cyan-500/40' />

      {/* Grid pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.02] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  )
}
