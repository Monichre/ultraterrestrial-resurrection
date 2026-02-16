'use client'

import React, {useState} from 'react'
import {EnhancedTimeSelector, type TimeRangeState} from './enhanced-time-selector'

// Simple demo component to test enhanced time selector functionality
export function EnhancedTimeSelectorDemo() {
  const [timeRange, setTimeRange] = useState<TimeRangeState>({
    startDate: new Date(2020, 0, 1),
    endDate: new Date(),
    selectedYear: new Date().getFullYear(),
    isAnimating: false,
    animationSpeed: 1.0,
  })

  const sampleSightings = [
    {timestamp: new Date('2020-01-15')},
    {timestamp: new Date('2021-03-10')},
    {timestamp: new Date('2022-06-25')},
    {timestamp: new Date('2023-09-12')},
    {timestamp: new Date('2024-01-08')},
  ]

  const handleRangeChange = (newRange: TimeRangeState) => {
    setTimeRange(newRange)
    console.log('Time range changed:', newRange)
  }

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    console.log('Date range changed:', startDate, 'to', endDate)
  }

  return (
    <div className='min-h-screen bg-black p-8'>
      <h1 className='text-white text-2xl font-monument-mono mb-8'>
        Enhanced Time Selector Demo
      </h1>
      
      <div className='max-w-2xl mx-auto'>
        <EnhancedTimeSelector
          timeRange={timeRange}
          onChange={handleRangeChange}
          onDateRangeChange={handleDateRangeChange}
          sightingsData={sampleSightings}
          showAnimation={true}
          className='w-full'
        />
        
        <div className='mt-8 p-4 border border-white/20 rounded'>
          <h2 className='text-white text-lg font-monument-mono mb-4'>Current State</h2>
          <pre className='text-green-400 text-sm font-mono'>
            {JSON.stringify(timeRange, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}