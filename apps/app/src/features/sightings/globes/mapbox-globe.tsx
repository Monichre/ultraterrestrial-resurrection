'use client'

import 'mapbox-gl/dist/mapbox-gl.css'

import React, { useState } from 'react'
import ReactMapboxGl from 'react-mapbox-gl'

const MapGL: any = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '',
})

// TilesetId: ellisliam.bmjwaijh
export const MapboxGlobe: React.FC<any> = ({ sightings }) => {
  const center = [-125.148032, 19.613688] as unknown as [number, number]
  const feedCenter = [-122.612285, 37.815224] as unknown as [number, number]

  const [activeMarker, setActiveMarker] = useState<any | null>(null)
  const updateActiveMarker = (data: React.SetStateAction<any | null>) => {
    setActiveMarker(data)
  }
  const closeActiveMarker = () => setActiveMarker(null)
  const pitch: any = [0]
  const zoom: any = [2.48]
  const [state, setState] = useState({
    zoom,
    center,
    pitch,
  })

  // const onStyleLoad = useCallback(async () => {
  //   const flyTo: any = {
  //     center: [-122.737, 37.696],
  //     zoom: [10.85],
  //     pitch: [3],
  //   }

  // }, [toggleInfoGraphics])

  return (
    <MapGL
      movingMethod='flyTo'
      pitch={state?.pitch}
      zoom={state?.zoom}
      center={state?.center}
      style={`mapbox://styles/ellisliam/cld51oavf001e01o2eko08rd9`}
      containerStyle={{ height: '100vh', width: '100vw' }}
      renderChildrenInPortal
    >
      {/* {activeMarker && (
          <ActiveMarker marker={activeMarker} close={closeActiveMarker} />
        )} */}

      {/* {listingsData.length
          ? listingsData?.map((marker: any) => {
              return (
                <Marker
                  key={marker?.id}
                  coordinates={[marker?.longitude, marker?.latitude]}
                  onClick={() => updateActiveMarker(marker)}
                >
                  <MapPin color='#79ffe1' size={25} />
                </Marker>
              )
            })
          : null} */}
    </MapGL>
  )
}

// Spinning Mapbox GL Globe: https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/
