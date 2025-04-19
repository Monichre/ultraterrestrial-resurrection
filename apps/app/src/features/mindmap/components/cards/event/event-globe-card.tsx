'use client'

import type { GlobeLocation } from '@/components/globes'
import { STOCK_PHOTOS, wait } from '@/utils'
import createGlobe from 'cobe'
import { format } from 'date-fns'
import { useEffect, useRef } from 'react'
import './event-globe-card.css'
interface GlobeProps {
  dark?: boolean
  baseColor?: string
  glowColor?: string
  markerColor?: string
  opacity?: number
  brightness?: number
  offsetX?: number
  offsetY?: number
  scale?: number
  markers?: GlobeLocation[]
}

export function Globe( {
  dark = true,

  opacity = 1,
  brightness = 1,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  markers = []
}: GlobeProps ) {
  const canvasRef: any = useRef<HTMLCanvasElement>( null )
  const focusRef = useRef( [0, 0] )
  const locationToAngles = ( lat, long ) => {
    return [Math.PI - ( ( long * Math.PI ) / 180 - Math.PI / 2 ), ( lat * Math.PI ) / 180]
  }
  const baseColor: any = [0, 0.3569, 0.4196]
  const markerColor: any = [1, 0, 0.7098]
  const glowColor: any = [0.0118, 0.0824, 0.1373]
  useEffect( () => {
    const phi = 0

    const globe = createGlobe( canvasRef.current, {
      devicePixelRatio: 1.5,
      phi: 0,
      // theta: 0,
      dark: 1,

      mapSamples: 6300,
      mapBrightness: 8,
      baseColor,

      markerColor,
      glowColor,
      opacity: 0.5,
      scale: 0.9,
      markers,
      // devicePixelRatio: 2,
      // phi: 0,
      theta: 0.3,
      // dark: 1,

      diffuse: 1,
      // markers,
      // mapSamples: 16000,
      width: 600,
      height: 600,
      // mapBrightness: .9,
      // scale: 1,
      offset: [0, 400],
      // baseColor: [1, 1, 1],
      // markerColor: [251 / 255, 100 / 255, 21 / 255],
      // glowColor: [1, 1, 1],
      onRender: ( state ) => {
        // state.phi = phi
        // phi += 0.005
      }
    } )

    return () => {
      globe.destroy()
    }
  }, [dark, baseColor, glowColor, markerColor, opacity, brightness, scale] )

  useEffect( () => {
    wait( 5000 )
    focusRef.current = locationToAngles( markers[0].location[0], markers[0].location[1] )
  }, [markers] )

  return (
    <div className="h-full w-full relative">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          // transform: `translate(${offsetX}px, ${offsetY}px)`
        }}
      />
    </div>
  )
}

export const EventGlobeCard = ( { card }: any ) => {

  console.log( "🚀 ~ file: event-globe-card.tsx:82 ~ EventGlobeCard ~ data:", card )

  const { latitude, longitude, date, name, description, location, photos } = card
  const stock = {
    url: STOCK_PHOTOS.saucer,
    src: STOCK_PHOTOS.saucer,
  }
  const bgPhoto = photos?.length && photos[0]?.mediaType?.startsWith( 'image/' ) ? photos[0] : stock
  const markers: any = [
    {
      location: [latitude, longitude],
      size: 0.05
    }
  ]

  console.log( "🚀 ~ file: event-globe-card.tsx:90 ~ EventGlobeCard ~ markers:", markers )

  const formattedDate = date ? format( date, 'MM/d/yyyy' ) : null
  return (
    <div className="p-1 event-globe-card">

      <h3 className="font-monumentMono text-lg text-white mb-4 tracking-wider">{name}</h3>
      <p className="location font-monument mb-2">
        {location}
        <br />
        {latitude}° {longitude}°
      </p>
      <p> </p>
      <p className="date font-monument font-[#27F1FF]">
        {formattedDate}
      </p>

    </div>
  )
}
