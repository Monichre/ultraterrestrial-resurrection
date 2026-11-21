'use client'

import { useState } from 'react'
import EarthGlobe from 'react-globe.gl'
// import geojson from '@/src/data/events.geojson'

export type ReactGlobePointSchema = {}
export interface GlobeProps {
  locations: any[]
  activeLocation: any
}

const images = {
  earthSky: '/8k_earth_nightmap.jpeg',
  nightSky: '/8k_stars_milky_way.jpeg',
}

export const CobeGlobe: React.FC<GlobeProps> = ( {
  locations,
  activeLocation,
}: GlobeProps ) => {
  console.log( 'locations: ', locations )
  // const pink = '#E393E6'
  // const lightBlue = '#6EE3E6'
  // const green = #79ffe1
  const [points, setPoints] = useState<any[]>( locations )

  // useEffect(() => {
  //   fetch(`/${type}.geojson`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const { features } = data

  //       const formatted = features.map((d: any) => {
  //         const { geometry, properties } = d
  //         return {
  //           name: properties.name,
  //           lat: geometry.coordinates[1],
  //           lng: geometry.coordinates[0],
  //           color: green,
  //           size: 0.002,
  //         }
  //       })
  //       setPoints(formatted)
  //     })
  // }, [])

  return (
    <EarthGlobe
      animateIn
      pointsData={locations}
      globeImageUrl={images.earthSky}
      pointLat={( d: any ) => d.lat}
      pointLng={( d: any ) => d.lng}
      backgroundImageUrl={images.nightSky}
      // labelsData={locations}
      pointAltitude={0.3}
      pointResolution={20}
      pointRadius={( d: any ) => d.size}
      pointColor={( d: any ) => d.color}
    // labelText={(d: any) => d.name}
    />
  )
}
