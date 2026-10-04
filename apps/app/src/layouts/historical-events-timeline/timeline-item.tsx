'use client'

import { TimelineToolTip } from '@/layouts/historical-events-timeline/timeline-tooltip'
import { format } from 'date-fns'
import { useRef } from 'react'

export const TimelineItem: React.FC<any> = ( {
  events,
  year,
  currentYear,
  mitigateCurrentYearValue,
  style,
  scrolling,
  updateActiveLocation,
} ) => {
  // const [status, elementRef] = useVisibility(scrolling)

  // useEffect(() => {
  //   if (status === 'leaving') {
  //     mitigateCurrentYearValue(year)
  //   }
  // }, [status, mitigateCurrentYearValue, year])
  // before:content-[""] before:absolute before:left-0 before:top-[-16px] before:w-[40px] before:h-[2px] before:bg-[#79FFE1]
  const itemRef = useRef<HTMLDivElement>( null )

  // Handle hover effects and animations for each timeline item
  // useGSAP( () => {
  //   if ( !itemRef.current ) return

  //   gsap.to( itemRef.current, {
  //     scrollTrigger: {
  //       trigger: itemRef.current,
  //       start: 'top center',
  //       end: 'bottom center',
  //       toggleActions: 'play reverse play reverse',
  //       onEnter: () => {
  //         gsap.to( itemRef.current, {
  //           opacity: 1,
  //           duration: 0.5,
  //           ease: 'power2.out'
  //         } )
  //       },
  //       onLeave: () => {
  //         gsap.to( itemRef.current, {
  //           opacity: 0.3,
  //           duration: 0.5,
  //           ease: 'power2.in'
  //         } )
  //       }
  //     }
  //   } )
  // }, [] )

  // grid-item 
  // timeline-item
  return (
    <div
      ref={itemRef}
      className="grid-item-inner"
      style={style}
    >
      {events.map( ( event ) => (
        <div
          className="timeline-item relative p-6 backdrop-blur-sm bg-black/20 rounded-lg 
                     transition-transform duration-300 hover:scale-105"
          key={`${year}-${event.id}`}
        >
          <h2 className="text-white font-bebasNeuePro text-[48px] mb-8 capitalize relative w-fit 
                        leading-[54px] after:content-[''] after:absolute after:left-0 after:bottom-[-16px] 
                        after:w-[40px] after:h-[2px] after:bg-[#79FFE1]">
            {event.name}
          </h2>

          <p className="tracking-wider text-xl relative text-[#79FFE1]"
            style={{ width: 'fit-content' }}>
            {format( event.date, 'MMM dd, yyyy' )}
          </p>

          <div className="flex items-center mt-8 gap-6">
            <p className="text-white font-source tracking-wider text-xl">
              {event.location}
            </p>
            {event?.latitude && event?.longitude && (
              <TimelineToolTip
                event={event}
                onHover={updateActiveLocation}
                coordinates={[event.latitude, event.longitude]}
              />
            )}
          </div>
        </div>
      ) )}
    </div>
  )

  // return (
  //   //
  //   <div
  //     className={`grid-item ${year}`}
  //     style={style}
  //   // ref={elementRef}
  //   >
  //     {events.map( ( event ) => (
  //       <div
  //         className={`timeline-item ${year} relative`}
  //         key={`${year}-${event.id}`}
  //       >
  //         <h2
  //           className='text-white font-bebasNeuePro text-[48px] mb-2 capitalize relative w-fit mb-8'
  //           style={{ textWrap: 'pretty', lineHeight: '54px' }}
  //         >
  //           {event.name}
  //         </h2>

  //         <p
  //           className={`tracking-wider text-xl relative after:content-[""] after:absolute after:left-0 after:bottom-[-16px] after:w-[40px] after:h-[2px] after:bg-[#79FFE1] `}
  //           style={{
  //             color: DOMAIN_MODEL_COLORS.events,
  //             width: 'fit-content',
  //           }}
  //         >
  //           {format( event.date, 'MMM dd, yyyy' )},
  //         </p>

  //         <div className='flex items-center align-middle mt-8'>
  //           <p className='text-white font-source tracking-wider text-xl mr-6'>
  //             {event.location}
  //           </p>
  //           {event?.latitude && event?.longitude && (
  //             <TimelineToolTip
  //               event={event}
  //               onHover={updateActiveLocation}
  //               coordinates={[event.latitude, event.longitude]}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     ) )}
  //   </div>
  // )
}
