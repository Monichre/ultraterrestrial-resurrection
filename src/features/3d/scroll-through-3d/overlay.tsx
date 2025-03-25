'use client'

import * as THREE from 'three'
import GlobeConnections from '@/features/3d/globe-connections/GlobeConnectionsExample'
import { useTexture, View } from '@react-three/drei'
import React, {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import Image from 'next/image'
import { NEONS } from '@/utils/constants/colors'
import { Card3D } from '@/features/3d/3d-card/3d-card'
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
const dayjs = require( 'dayjs' )
const utc = require( 'dayjs/plugin/utc' )
dayjs.extend( utc )

interface OverlayEventImageProps {
  photo: any
}

const OverlayEventImage: React.FC<OverlayEventImageProps> = ( {
  photo,
}: any ) => {
  const texture: any = useTexture( photo?.signed )

  return <meshStandardMaterial {...texture} />
}

//  ;<View key={photo?.id}>
//    <OverlayEventImage photo={photo} />
//  </View>

const OverlaySection = ( { event, position, updateTimeFrame }: any ) => {
  const [ref, entry]: any = useIntersectionObserver( {
    threshold: 0,
    root: document.querySelector( '.scroll' ),
    rootMargin: '0px',
  } )

  const elementRef: any = useRef()
  // const ref = useRef(null)
  const isInView = useInView( elementRef )
  console.log( 'isInView: ', isInView )
  const { scrollYProgress } = useScroll( {
    target: elementRef,
    offset: ['end end', 'start start'],
  } )
  console.log( 'scrollYProgress: ', scrollYProgress )

  console.log( 'isInView: ', isInView )
  useEffect( () => {
    if ( entry?.isIntersecting ) {
      //
      updateTimeFrame( position )
    }
  }, [entry, position, updateTimeFrame] )

  return (
    <div style={{ height: '200vh', position: 'relative' }} ref={ref}>
      <div className='dot'>
        <h1>
          {event.name}{' '}
          <span className=''>{dayjs( event.date ).format( 'DDDD/MMMM/YYYY' )}</span>
        </h1>
        {/* <p className='text-white'>{currentEvent.description}</p> */}
      </div>
      <div ref={elementRef}>
        {/* <Card3D
          title={event.name}
          content={event?.description}
          image={event?.photos[0]}
        /> */}
        {/* {event?.photos && event.photos.length
          ? event.photos.map((photo: any) => (
              <Image
                key={photo?.signedUrl}
                src={photo?.signedUrl}
                alt='event photo'
                height={400}
                width={600}
              />
            ))
          : null} */}
      </div>
    </div>
  )
}

export type OverlayProps = {
  currentEvents: any
  activeYear: string
  children?: any
  moveToPreviousYear: any
  moveToNextYear: any
  scroll: any
  eventsByYear: any
  updateActiveYear: any
}
export const Overlay = forwardRef(
  (
    {
      scroll,
      activeYear,
      currentEvents,
      updateActiveYear,
      eventsByYear,
      moveToNextYear,
      moveToPreviousYear,
      ...props
    }: OverlayProps,
    ref: any
  ) => {
    console.log( 'activeYear: ', activeYear )
    const [events, setEvents] = useState( currentEvents )
    const scrollDirection = useRef( 'down' )

    console.log( 'currentEvents: ', currentEvents )

    const handleScroll = ( e: any ) => {
      let lastScrollTop = scroll.current

      scroll.current =
        e.target.scrollTop / ( e.target.scrollHeight - window.innerHeight )

      if ( scroll.current > lastScrollTop ) {
        scrollDirection.current = 'down'
      } else {
        scrollDirection.current = 'up'
      }
    }

    const updateTimeFrame = ( position: any ) => {
      console.log( 'position: ', position )

      // updateActiveYear
      if (
        ( position === 'first' ||
          ( position === 'last' && currentEvents.length === 1 ) ) &&
        scrollDirection.current === 'up'
      ) {
        moveToPreviousYear()
      }
      if ( position === 'last' && scrollDirection.current === 'down' ) {
        moveToNextYear()
      }
    }

    // useEffect(() => {
    //   console.log('currentEvents: ', currentEvents)
    //   // setEvents((events: any) => [...new Set([...events, ...currentEvents])])
    //   if (events?.length) {
    //     const updated: any = [...events, ...currentEvents]

    //     setEvents(
    //       updated.filter(
    //         (item: any) => updated.indexOf(item) === updated.lastIndexOf(item)
    //       )
    //     )
    //   }
    // }, [currentEvents, events])

    // const { scrollYProgress } = useScroll({
    //   target: ref,
    //   offset: ['start start', 'end start'],
    // })
    // console.log('scrollYProgress: ', scrollYProgress)

    // const y = useMotionValue(scroll.current)

    // const [svgHeight, setSvgHeight] = useState(0)

    // useEffect(() => {
    //   if (ref.current) {
    //     setSvgHeight(ref.current.offsetHeight)
    //   }
    // }, [ref])

    // const y1 = useSpring(
    //   useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    //   {
    //     stiffness: 500,
    //     damping: 90,
    //   }
    // )
    // const y2 = useSpring(
    //   useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    //   {
    //     stiffness: 500,
    //     damping: 90,
    //   }
    // )

    return (
      <div ref={ref} className='scroll' onScroll={handleScroll}>
        <Suspense fallback={null}>
          {events.map( ( currentEvent: any, index: number ) => {
            return (
              <OverlaySection
                position={
                  index === currentEvents.length - 1
                    ? 'last'
                    : index === 0
                      ? 'first'
                      : null
                }
                key={currentEvent?.id}
                updateTimeFrame={updateTimeFrame}
                event={currentEvent}
              />
            )
          } )}

          <h1 className='caption'>
            {/* ref={caption} */}
            {activeYear}
          </h1>
          <div id='globe-connections'>
            {/* <GlobeConnections width={1000} height={1000} /> */}
          </div>
        </Suspense>
      </div>
    )
  }
)

Overlay.displayName = 'Overlay'
