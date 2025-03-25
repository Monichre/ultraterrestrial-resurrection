'use client'

import { useGeolocation } from '@uidotdev/usehooks'
import { createContext } from 'react'
// @ts-ignore
export const LocationContext = createContext()
const { Provider } = LocationContext

interface LocationProviderProps {
  children: any
}

export const LocationProvider: React.FC<LocationProviderProps> = ( {
  children,
} ) => {
  const location = useGeolocation()
  console.log( 'location: ', location )

  if ( location.loading ) {
    return <p>loading... (you may need to enable permissions)</p>
  }

  if ( location.error ) {
    return <p>Enable permissions to access your location data</p>
  }

  return <Provider value={{ location }}>{children}</Provider>
}
