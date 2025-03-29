'use client'

import { GraphPaperBackground } from '@/components/backgrounds'
import type { EventsRecord } from '@/db/xata'
import { EventsTimeline } from '@/layouts/historical-events-timeline/events-timeline'
import { TimelineSidebar } from '@/layouts/historical-events-timeline/timeline-sidebar-ui'
import { WorldMap } from '@/layouts/historical-events-timeline/world-map'
import { extractCoordinatesFromEvents, extractUniqueYearsFromEvents } from '@/utils'
import type { JSONData } from '@xata.io/client'
import { useMemo, useRef, useState } from 'react'
import './events-timeline.css'
import './timeline.css'
import { SciFiGlobe } from './sci-fi-globe'
import { EventsGlobe } from './events-globe'
import { ThreeJSGlobe } from '@/components/globes/threejs-globe'

export const HistoricalEventsTimeline = ({ events }: { events: JSONData<EventsRecord>[] }) => {
  const years: any = extractUniqueYearsFromEvents(events)
  const locations = extractCoordinatesFromEvents(events, false)
  
  const [activeLocation, setActiveLocation] = useState(null)
  const [viewMode, setViewMode] = useState<'worldmap' | 'globe' | 'sci-fi'>('globe')
  
  const updateActiveLocation = (location: any) => {
    if (location?.length) {
      const [lat, lon] = location
      setActiveLocation(location)
    }
  }

  const eventsByYear = useMemo(() => {
    const result: any = {}
    for (const year of years) {
      // @ts-ignore
      result[year] = events.filter((event) => event.date.includes(year))
    }
    return result
  }, [events, years])

  const [currentYearIndex, setCurrentYearIndex] = useState<number>(0)
  const [currentYear, setCurrentYear] = useState<number>(years[currentYearIndex])
  
  const updateCurrentYearIndex = (index: number) => {
    setCurrentYearIndex(index)
  }
  
  const updateCurrentYear = (year: number) => {
    setCurrentYear(year)
  }
  
  const earthRef = useRef(null)

  // Create arcs data for the ThreeJS globe
  const createArcsData = () => {
    if (!locations || locations.length < 2) return []
    
    const arcsData = []
    // Loop through locations and create connections between them
    for (let i = 0; i < locations.length - 1; i++) {
      const startLoc = locations[i].location
      const endLoc = locations[i + 1].location
      
      if (startLoc && endLoc) {
        arcsData.push({
          order: i,
          startLat: startLoc[0],
          startLng: startLoc[1],
          endLat: endLoc[0], 
          endLng: endLoc[1],
          arcAlt: Math.random() * 0.5 + 0.1, // Random arc height
          color: i % 2 === 0 ? '#7de2f6' : '#0a84ff'
        })
      }
    }
    
    return arcsData
  }
  
  const arcsData = useMemo(() => createArcsData(), [locations])

  return (
    <>
      <div className='fixed top-0 left-0 right-0 bottom-0 bg-black h-full w-full z-0'>
        <GraphPaperBackground />
        <div className='absolute top-0 left-0 z-10 h-[100vh] w-[100vw]'>
          {/* Toggle between different visualization modes */}
          {viewMode === 'worldmap' && (
            <WorldMap
              markers={locations}
              activeLocation={activeLocation}
            />
          )}
          
          {viewMode === 'globe' && (
            <EventsGlobe
              markers={locations}
              activeLocation={activeLocation}
            />
          )}
          
          {viewMode === 'sci-fi' && (
            <SciFiGlobe
              markers={locations}
              activeLocation={activeLocation}
              arcsData={arcsData}
            />
          )}
        </div>
      </div>

      <div className='fixed top-0 left-0 w-screen h-screen z-30'>
        {/* Mode selector buttons */}
        <div className='absolute top-4 right-4 flex gap-2 z-50'>
          <button 
            onClick={() => setViewMode('worldmap')}
            className={`px-3 py-1 font-monumentMono rounded ${viewMode === 'worldmap' ? 'bg-cyan-500 text-black' : 'bg-black bg-opacity-70 text-white'}`}
          >
            2D Map
          </button>
          <button 
            onClick={() => setViewMode('globe')}
            className={`px-3 py-1 font-monumentMono rounded ${viewMode === 'globe' ? 'bg-cyan-500 text-black' : 'bg-black bg-opacity-70 text-white'}`}
          >
            Globe
          </button>
          <button 
            onClick={() => setViewMode('sci-fi')}
            className={`px-3 py-1 font-monumentMono rounded ${viewMode === 'sci-fi' ? 'bg-cyan-500 text-black' : 'bg-black bg-opacity-70 text-white'}`}
          >
            Sci-Fi View
          </button>
        </div>
        
        <div className='absolute top-0 left-0 w-[80px] h-screen flex justify-center z-40'>
          <div className='h-full w-auto flex flex-col justify-center align-center items-center content-center'>
            <TimelineSidebar years={years} currentYearIndex={currentYearIndex} currentYear={currentYear} />
          </div>
        </div>
        
        <div className='absolute top-0 left-0 w-screen h-screen overflow-scroll spatial-timeline z-30'>
          <EventsTimeline
            updateCurrentYearIndex={updateCurrentYearIndex}
            updateCurrentYear={updateCurrentYear}
            currentYear={currentYear}
            eventsByYear={eventsByYear}
            years={years}
            updateActiveLocation={updateActiveLocation}
          />
        </div>
      </div>
    </>
  )
}