
// import { AdminDashboardGlobe } from '@/components/ui/globe'

import { AdminDashboardGlobe } from '@/components/globes/cobe-globes/admin-dashboard-globe'
import { useMindMap } from '@/contexts'
import { useEffect, useState } from 'react'

// const ActiveNodeUI = (node) => {
//   return (

//   )
// }

export interface LocationVisualizationProps { }

export const LocationVisualization: React.FC<LocationVisualizationProps> = (
  props: LocationVisualizationProps
) => {
  const {
    showLocationVisualization,
    locationsToVisualize,
    // toggleLocationVisualization,
    // activeNode,
  } = useMindMap()
  // bg-[#0a0a0a]

  const [markers, setMarkers] = useState( [] )

  useEffect( () => {
    console.log( 'locationsToVisualize: ', locationsToVisualize )
    if ( locationsToVisualize.length ) {
      const newMarkers = locationsToVisualize.map( ( { data }: any ) => {
        return {
          location: [data.latitude, data.longitude],
          size: 0.025,
        }
      } )
      setMarkers( newMarkers )
    }
  }, [locationsToVisualize] )

  if ( showLocationVisualization ) {
    // bg-gradient-to-b from-transparent via-[#0a0a0a] to-black
    return (
      <div className='absolute top-0 right-0 w-[32vw] min-h-[600px] z-30 p-4'>
        {/* <Button
          variant='ghost'
          onClick={toggleLocationVisualization}
          className='absolute top-[10px] right-[10px]'
        >
          <XIcon className='w-5 h-5' />
        </Button> */}
        <AdminDashboardGlobe markers={markers} />

        <div className='w-full flex-col align-middle justify-center items-center content-center'>
          {/* <AdminDashboardGlobe markers={markers} /> */}
          {/* <div className='px4 w-full '>
            <div className='text-neutral-500  text-xs uppercase'>
              <span className='text-lime-300'>99</span> dapps
            </div>
          </div> */}
        </div>
      </div>
    )
  } else {
    return null
  }
}

// <SlideFadeIn direction='down' full>
// </SlideFadeIn>
