'use client'
// import { SpatialTimeline } from '@/layouts/timeline/SpatialTimeline' port { TimelineSidebar } from '@/layouts/historical-events-timeline/
import { GraphPaperBackground } from '@/components/backgrounds'
import type { EventsRecord } from '@/db/xata'
import { EventsTimeline } from '@/layouts/historical-events-timeline/events-timeline'
import { TimelineSidebar } from '@/layouts/historical-events-timeline/timeline-sidebar-ui'
import { WorldMap } from '@/layouts/historical-events-timeline/world-map'
import {
  extractCoordinatesFromEvents,
  extractUniqueYearsFromEvents
} from '@/utils'
import type { JSONData } from '@xata.io/client'
import { useMemo, useRef, useState } from 'react'
import './events-timeline.css'
import './timeline.css'

export const HistoricalEventsTimeline = ( { events }: { events: JSONData<EventsRecord>[] } ) => {
  const years: any = extractUniqueYearsFromEvents( events )

  console.log( "🚀 ~ file: historical-events-timeline.tsx:23 ~ HistoricalEventsTimeline ~ years:", years )

  const locations = extractCoordinatesFromEvents( events, false )

  console.log( "🚀 ~ file: historical-events-timeline.tsx:27 ~ HistoricalEventsTimeline ~ locations:", locations )

  const [activeLocation, setActiveLocation] = useState( null )

  console.log( "🚀 ~ file: historical-events-timeline.tsx:31 ~ HistoricalEventsTimeline ~ activeLocation:", activeLocation )


  const updateActiveLocation = ( location: any ) => {

    console.log( "🚀 ~ updateActiveLocation ~ location:", location )




    // const temp = locationToAngles(lat, lon)
    // console.log('temp: ', temp)
    if ( location?.length ) {
      const [lat, lon] = location

      console.log( "🚀 ~ updateActiveLocation ~ lon:", lon )


      console.log( "🚀 ~ updateActiveLocation ~ lat:", lat )
      setActiveLocation( location )
    }
  }



  const eventsByYear = useMemo( () => {
    const result: any = {}
    for ( let year of years ) {
      // @ts-ignore
      result[year] = events.filter( ( event ) => event.date.includes( year ) )
    }
    return result
  }, [events, years] )
  console.log( "🚀 ~ file: historical-events-timeline.tsx:44 ~ eventsByYear ~ eventsByYear:", eventsByYear )

  // const { scrollYProgress } = useScroll()
  // console.log( 'scrollYProgress: ', scrollYProgress )

  const [currentYearIndex, setCurrentYearIndex] = useState<number>( 0 )
  const [currentYear, setCurrentYear] = useState<number>( years[currentYearIndex] )
  const updateCurrentYearIndex = ( index: number ) => {
    setCurrentYearIndex( index )
  }
  const updateCurrentYear = ( year: number ) => {
    setCurrentYear( year )
  }
  const earthRef = useRef( null )










  return (
    <>
      <div className='fixed top-0 left-0 right-0 bottom-0 bg-black h-full w-full z-0'>
        {/* <ShootingStars /> */}
        {/* <StarsBackground /> */}
        <GraphPaperBackground />
        <div className='absolute top-0 left-0 z-10 h-[100vh] w-[100vw]'>
          {/* <Earth activeLocation={activeLocation} /> */}
          {/* <AdminDashboardGlobe markers={locations} /> */}
          {/* <Globe locations={locations} activeLocation={activeLocation} /> */}
          {/* <CodePenGlobe
            markers={locations}
            activeLocation={activeLocation}
          /> */}
          {/* <EventsGlobe
            markers={locations}
            activeLocation={activeLocation}
          /> */}
          {/* <div className='w-full h-[100vh] flex flex-col justify-center items-center'>
           
          </div> */}
          <WorldMap
            markers={locations}
            activeLocation={activeLocation}
          />

          {/* 
          <SciFiGlobe
            markers={locations}
            activeLocation={activeLocation}
            arcsData={locations}
          /> */}

          {/* markers={locations} activeLocation={activeLocation}  */}
          {/* <EarthAtNight /> */}
          {/* <CodePenEarthAlt locations={locations} /> */}
          {/* <CodePenEarth locations={locations} /> */}
        </div>
      </div>

      {/* w-screen  */}
      <div className='fixed top-0 left-0 w-screen h-screen z-30'>
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
          {/* <ZScrollTimeline
          eventsByYear={eventsByYear}
          years={years}
          updateActiveLocation={updateActiveLocation}
        /> */}
        </div>
      </div>
    </>
  )
}
// fixed top-0 left-[80px] h-full w-[calc(100% - 80px)] z-40
