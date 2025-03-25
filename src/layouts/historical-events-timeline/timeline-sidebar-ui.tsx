'use client'
import { TextScramble } from '@/components/animated/text-effect/text-scramble/text-scramble'
import { animate, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const TimelineSidebar = React.memo( ( { years, currentYearIndex: yearIndex = 0 }: any ) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>( yearIndex )
  const [selected, setSelected] = useState<number | null>( null )
  // const [currentYearIndex, setCurrentYearIndex] = useState<number>( yearIndex )
  const handleMouseEnter = useCallback( ( index: number ) => {

    console.log( "🚀 ~ file: TimlineSidebarUI.tsx:15 ~ handleMouseEnter ~ index:", index )

    setHoveredIndex( index )
  }, [] )

  const handleMouseLeave = useCallback( () => {
    setHoveredIndex( null )
  }, [] )

  const calculateScale = useCallback(
    ( index: number ) => {
      if ( hoveredIndex === null ) return 0.4
      const distance = Math.abs( index - hoveredIndex )
      return Math.max( 1 - distance * 0.2, 0.4 )
    },
    [hoveredIndex]
  )

  const scaleVariants = useMemo(
    () => ( {
      initial: { scale: 0.4 },
      animate: ( i: number ) => ( {
        scale: calculateScale( i ),
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      } ),
    } ),
    [calculateScale]
  )

  const textVariants = {
    initial: { opacity: 0, filter: `blur(4px)`, scale: 0.4 },
    animate: {
      opacity: 1,
      filter: `blur(0px)`,
      scale: 1,
      transition: { duration: 0.15, delay: 0.1 },
    },
  }






  const containerRef: any = useRef<HTMLDivElement>( null )
  const refs: any = years.map( useRef )

  console.log( "🚀 ~ file: TimlineSidebarUI.tsx:58 ~ refs:", refs )

  const originalNodeRef: any = useRef<HTMLDivElement>( null )
  const currentYearIndexRef: any = useRef<HTMLDivElement>( 0 )

  useEffect( () => {
    console.log( "🚀 ~ file: TimlineSidebarUI.tsx:66 ~ useEffect ~ currentYearIndexRef:", currentYearIndexRef )
    currentYearIndexRef.current = yearIndex
    setHoveredIndex( yearIndex )

  }, [yearIndex] )


  useEffect( () => {


    if ( !containerRef.current || !originalNodeRef.current || !refs[currentYearIndexRef.current]?.current ) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const fromRect = originalNodeRef.current.getBoundingClientRect()
    const toRect = refs[currentYearIndexRef.current].current.getBoundingClientRect()

    const createLine = () => {
      const line: any = document.querySelector( '.timeline-bg-2' )



      return line

    }
    const updatePath = () => {


      createLine()
      const fromX = fromRect.left - containerRect.left + fromRect.width / 2
      const fromY = fromRect.top - containerRect.top + fromRect.height / 2
      const toX = toRect.left - containerRect.left + toRect.width / 2
      const toY = toRect.top - containerRect.top + toRect.height / 2
      console.log( "🚀 ~ file: TimlineSidebarUI.tsx:134 ~ updatePath ~ toY:", toY )

      const d = `M ${fromX} ${fromY} L ${toX} ${toY}`
      // path.setAttribute( 'd', d )
      animate( '.timeline-bg-2-path', { d }, {
        duration: 0.8,
        ease: "easeInOut",
      } )
      // timelineBg?.setAttribute( 'd', d )
      // animate( '.timeline-bg', { height: `${toY}px` }, { duration: 0.5 } )
    }

    updatePath()
    window.addEventListener( 'resize', updatePath )

    return () => {
      window.removeEventListener( 'resize', updatePath )
      // if ( containerRef.current && line.parentNode === containerRef.current ) {
      //   containerRef.current.removeChild( line )
      // }
    }
  }, [currentYearIndexRef.current] )




  return (
    <div className='flex flex-col justify-center timeline-sidebar relative' ref={containerRef}>
      <div ref={originalNodeRef} />

      {/* <div className='timeline-bg' /> */}
      <svg className='timeline-bg-2 absolute top-0 left-0 w-full h-full pointer-events-none z-0' >
        <path
          className='timeline-bg-2-path'
          stroke='#27F1FF'
          strokeWidth='1'
          fill='none'
          strokeDasharray={1}
          d='M38.2614 2.87812C38.2614 5.66265 39.0461 13.204 39.1617 13.204C39.2773 13.204 40.062 5.66265 40.062 2.87812C40.062 0.0935796 39.2773 0 39.1617 0C39.0461 0 38.2614 0.0935796 38.2614 2.87812ZM41.1214 32.209C41.1214 25.5547 39.4174 13.204 39.1663 13.204C38.9152 13.204 37.2112 25.5547 37.2112 32.209C37.2112 32.3206 37.2116 32.4304 37.2126 32.5384C36.9314 32.2339 36.6229 31.9129 36.2846 31.5746C31.5902 26.8802 21.675 19.3693 21.4979 19.5464C21.3207 19.7236 28.8317 29.6388 33.526 34.3331C34.3902 35.1973 35.1414 35.867 35.793 36.3834C34.8764 36.247 33.7053 36.1608 32.209 36.1608C25.5547 36.1608 13.204 37.8648 13.204 38.1159C13.204 38.3671 25.5547 40.0711 32.209 40.0711C33.1217 40.0711 33.9135 40.039 34.6002 39.983C34.2632 40.291 33.9055 40.633 33.526 41.0124C28.8317 45.7068 21.3207 55.622 21.4979 55.7991C21.675 55.9763 31.5902 48.4654 36.2846 43.771C36.6539 43.4016 36.9878 43.0529 37.2893 42.7238C37.2395 43.381 37.2112 44.1317 37.2112 44.9893C37.2112 51.6435 38.9152 63.9942 39.1663 63.9942C39.4174 63.9942 41.1214 51.6435 41.1214 44.9893C41.1214 44.1239 41.0926 43.3673 41.0419 42.7058C41.3477 43.0402 41.687 43.3949 42.063 43.771C46.7574 48.4654 56.6726 55.9763 56.8497 55.7991C57.0269 55.622 49.5159 45.7068 44.8216 41.0124C44.4422 40.6331 44.0846 40.2912 43.7477 39.9833C44.4071 40.0337 45.1613 40.0624 46.0237 40.0624C52.6625 40.0624 64.9846 38.3624 64.9846 38.1118C64.9846 37.8613 52.6625 36.1612 46.0237 36.1612C44.6009 36.1612 43.4729 36.2393 42.5785 36.3645C43.2246 35.8506 43.9679 35.1868 44.8216 34.3331C49.5159 29.6388 57.0269 19.7236 56.8497 19.5464C56.6726 19.3693 46.7574 26.8802 42.063 31.5746C41.7186 31.919 41.4051 32.2455 41.1198 32.5548C41.1209 32.4415 41.1214 32.3262 41.1214 32.209ZM38.2614 74.3201C38.2614 71.5356 39.0461 63.9943 39.1617 63.9943C39.2773 63.9943 40.062 71.5356 40.062 74.3201C40.062 77.1046 39.2773 77.1982 39.1617 77.1982C39.0461 77.1982 38.2614 77.1046 38.2614 74.3201ZM13.204 38.1205C13.204 38.2361 5.66265 39.0208 2.87812 39.0208C0.0935796 39.0208 0 38.2361 0 38.1205C0 38.0049 0.0935796 37.2202 2.87812 37.2202C5.66265 37.2202 13.204 38.0049 13.204 38.1205ZM75.2867 39.0142C72.5086 39.0142 64.9848 38.2313 64.9848 38.116C64.9848 38.0006 72.5086 37.2178 75.2867 37.2178C78.0648 37.2178 78.1582 38.0006 78.1582 38.116C78.1582 38.2313 78.0648 39.0142 75.2867 39.0142ZM56.8467 55.8034C56.7652 55.885 61.5318 61.7587 63.4962 63.7231C65.4606 65.6875 66.0802 65.2 66.1617 65.1184C66.2433 65.0369 66.7308 64.4173 64.7664 62.4529C62.802 60.4885 56.9283 55.7219 56.8467 55.8034ZM14.8514 63.7231C16.8158 61.7587 21.5825 55.885 21.5009 55.8034C21.4193 55.7219 15.5456 60.4885 13.5812 62.4529C11.6168 64.4173 12.1043 65.0369 12.1859 65.1184C12.2674 65.2 12.887 65.6875 14.8514 63.7231ZM21.5009 19.5421C21.5825 19.4606 16.8158 13.5868 14.8514 11.6224C12.887 9.65802 12.2674 10.1455 12.1859 10.2271C12.1043 10.3087 11.6168 10.9283 13.5812 12.8927C15.5456 14.8571 21.4193 19.6237 21.5009 19.5421ZM63.4962 11.6224C61.5318 13.5868 56.7652 19.4606 56.8467 19.5421C56.9283 19.6237 62.802 14.8571 64.7664 12.8927C66.7308 10.9283 66.2433 10.3087 66.1617 10.2271C66.0802 10.1455 65.4606 9.65802 63.4962 11.6224Z'
        />

      </svg>



      {/* <AnimatePresence>
        {currentYearIndexRef.current ? <AnimatedBeam

          pathWidth={1}
          pathOpacity={.8}
          containerRef={containerRef}
          fromRef={originalNodeRef}
          toRef={refs[currentYearIndexRef.current]}
          duration={1}
          className='transition-all duration-1000 ease-in-out'
        /> : null}
      </AnimatePresence> */}
      {years.map( ( year, i ) => {

        const isSelected = selected === i || yearIndex === i

        console.log( "🚀 ~ file: TimlineSidebarUI.tsx:108 ~ {years.map ~ isSelected:", isSelected )

        return (
          <button
            ref={refs[i]}
            key={`${year}-${i}`}
            className='relative inline-flex items-end justify-center py-1 z-40'
            onMouseEnter={() => handleMouseEnter( i )}
            onMouseLeave={handleMouseLeave}
            onClick={() => setSelected( i )}
            onTouchStart={() => handleMouseEnter( i )}
            onTouchEnd={handleMouseLeave}
          >
            <motion.div
              className={`h-[2px] w-10 rounded-[4px] `}
              custom={i}
              variants={scaleVariants}
              initial='initial'
              animate={'animate'}
              style={{ backgroundColor: isSelected ? '#27F1FF' : 'white' }}
            />
            {hoveredIndex === i ? (
              <motion.span
                className={`absolute -top-0.5 left-12 text-[11px] `}
                variants={textVariants}
                initial='initial'
                animate='animate'
                style={{ color: isSelected ? '#27F1FF' : 'white' }}
              // animate={yearIndex === i ? 'animate' : 'initial'}
              >


                <TextScramble as='span' >
                  {year}
                </TextScramble>

              </motion.span>
            ) : null}
          </button>
        )
      } )}




    </div>
  )
} )



