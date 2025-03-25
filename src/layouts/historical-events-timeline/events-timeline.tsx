import { format } from 'date-fns'
import { Divz } from "divz"
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import './events-timeline.css'

import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'

import { Float } from '@/components/animated/float'
import { EventCaseFileContainer } from '@/layouts/historical-events-timeline/event-case-file/EventCaseFileContainer'
import { ICON_BLUE } from '@/utils'
import type * as React from "react"
import ReactPlayer from 'react-player'
gsap.registerPlugin( useGSAP, ScrollTrigger, ScrollSmoother )

interface CrosshairConfig {
  topLeft?: boolean
  topRight?: boolean
  bottomLeft?: boolean
  bottomRight?: boolean
}

interface YearLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  crosshairs?: CrosshairConfig
  gridLines?: boolean
  columns?: 8 | 12 | 16
  lineVariant?: "all" | "vertical" | "horizontal" | "center" | "none"
}

function CrosshairIcon( { className, stroke = ICON_BLUE }: { className?: string, stroke?: string } ) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        zIndex: 40
      }}
    >
      <path
        d="M8 1V15M1 8H15"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function YearLayout( {
  children,
  crosshairs,
  gridLines = true,

  className,
  ...props
}: YearLayoutProps ) {
  return (
    <motion.div
      className={className}
      {...props}
    >

      {/* Crosshairs */}
      {
        crosshairs?.topLeft && (
          <CrosshairIcon className="w-3 h-[1px] absolute -left-2 -top-2 z-40" />
        )
      }
      {
        crosshairs?.topRight && (
          <CrosshairIcon className="w-3 h-[1px] absolute -right-2 -top-2 z-40" />
        )
      }
      {
        crosshairs?.bottomLeft && (
          <CrosshairIcon className="w-3 h-[1px] absolute -bottom-2 -left-2 z-40" />
        )
      }
      {
        crosshairs?.bottomRight && (
          <CrosshairIcon className="w-3 h-[1px] absolute -bottom-2 -right-2 z-40" />
        )
      }

      <div className="relative z-40">{children}</div>
    </motion.div >
  )
}


export const TimelineYearEvents = ( {
  event,
  updateActiveLocation
} ) => {

  const { name, date, location, latitude, longitude, photos } = event

  console.log( "🚀 ~ file: SpatialTimelineV2.tsx:27 ~ photos:", photos )




  const handleUpdatingLocation = useCallback( () => {
    if ( event.latitude && event.longitude ) {
      const loc = [event.latitude, event.longitude]

      console.log( "🚀 ~ handleUpdatingLocation ~ loc:", loc )

      updateActiveLocation( loc )
    }
  }, [event, updateActiveLocation] )


  return (
    <div
      className="w-90vw h-full px-2"

    >
      <motion.div
        className="z-40 text-center items-start align-start flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
        onClick={handleUpdatingLocation}
      >

        <h3 className="text-white font-monumentMono text-left relative text-lg">
          {event.name}
        </h3>


        <p className="tracking-widest relative font-neueHaas text-sm text-left my-1"
          style={{ color: '#78efff' }}
        >
          {format( event.date, 'M.d.yyyy' )}

        </p>
        <p className="tracking-widest relative font-neueHaas text-sm text-gray text-left"
        >

          {event.location}
        </p>

        {/* <div className="flex items-center mt-8 gap-6">
          <span className="text-white tracking-wider">
            {event.location}
          </span> */}
        {/* {event?.latitude && event?.longitude && (
            <TimelineToolTip
              event={event}
              onHover={updateActiveLocation}
              coordinates={[event.latitude, event.longitude]}
            />
          )} */}
        {/* </div> */}
      </motion.div>
      <div className="flex justify-evenly items-center gap-2 mt-4">

        {photos.map( ( photo, index ) => {

          console.log( "🚀 ~ {photos.map ~ photo:", photo )
          const image = photo?.mediaType?.includes( 'image' )

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
            >
              <Float>
                <div className="h-48 w-48 relative overflow-hidden hover:scale-105 duration-200 cursor-pointer transition-transform">
                  {!image ? (
                    <ReactPlayer
                      url={photo.url}
                      width="100%"
                      height="100%"
                      playing
                      loop
                      muted
                      playsinline
                      className="absolute top-0 left-0"
                    />
                  ) : (
                    <Image
                      src={photo.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </Float>
            </motion.div>
          )
        } )}
      </div>




    </div>



  )
}

export function EventsTimeline( {
  years,
  eventsByYear,
  updateActiveLocation,
  updateCurrentYearIndex,
  updateCurrentYear,
  currentYear: activeYear
} ) {

  console.log( "🚀 ~ years:", years )


  console.log( "🚀 ~ eventsByYear:", eventsByYear )

  const containerRef = useRef( null )
  const yearRefs = useRef( {} )



  const [activeIndex, setActiveIndex] = useState( 0 )

  console.log( "🚀 ~ file: SpatialTimelineV2.tsx:114 ~ activeIndex:", activeIndex )

  const [currentYear, setCurrentYear] = useState( activeYear )

  console.log( "🚀 ~ file: SpatialTimelineV2.tsx:118 ~ currentYear:", currentYear )


  const updateActiveIndex = ( i: number ) => {

    console.log( "🚀 ~ file: SpatialTimelineV2.tsx:123 ~ updateActiveIndex ~ i:", i )
    // updateCurrentYearIndex( i )
    setActiveIndex( i )

    // setCurrentYear( years[i] )
  }

  useEffect( () => {
    const event = eventsByYear[years[activeIndex]][0]
    const coordinates = [event.latitude, event.longitude]
    updateCurrentYearIndex( activeIndex )
    updateCurrentYear( years[activeIndex] )
    updateActiveLocation( coordinates )

  }, [activeIndex] )
  return (

    <div id="smooth-wrapper">
      <div
        id="smooth-content"
        ref={containerRef}
        className="relative"
        style={{
          // overflow: 'visible',
          height: '100vh',
        }}
      >

        <Divz
          // isExpanded={true}
          // showPlayButton={false}
          // fullScreen={true}
          isExpanded={false}
          isSnapEnabled={true}
          isScrollPageEnabled={false}
          showNavButtons={false}
          onIndexChange={updateActiveIndex}
        >
          {
            years.map( ( year, index ) => (
              <motion.div
                key={year}
                className={`year year-${year} !h-[75%] `}


              // style={{
              //   display: 'flex',
              //   flexDirection: 'column',
              //   justifyContent: 'center',
              //   alignItems: 'flex-end',
              //   placeItems: 'flex-end',
              //   width: '80vw !important'
              // }}
              // ref={el => yearRefs.current[year] = el}

              >
                <EventCaseFileContainer>



                  <div className={`year-inner`}>

                    {
                      eventsByYear[year].map( ( event ) => (
                        <motion.div
                          key={`${year}-${event.id}`}
                          id={`${year}-${event.id}`}
                          animate={{ opacity: 1, y: 0 }}
                          className="event-item transition-transform duration-300 hover:scale-105 backdrop-blur-md bg-black/20 border border-white/10 p-2 my-2"
                        >
                          {/* <TimelineToolTip
                      event={event}
                      onHover={updateActiveLocation}
                      coordinates={[event.latitude, event.longitude]}
                      /> */}
                          <TimelineYearEvents updateActiveLocation={updateActiveLocation} event={event} />
                        </motion.div>
                      ) )
                    }
                  </div>
                </EventCaseFileContainer>
              </motion.div>
            ) )
          }

        </Divz>

      </div>
    </div >

  )
}
