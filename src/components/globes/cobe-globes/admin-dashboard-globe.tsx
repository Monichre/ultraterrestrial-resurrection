'use client'
import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

export type GlobeLocation = {
  location: [number, number]
  size: number
}

export function AdminDashboardGlobe({
  markers = [
    { location: [37.78, -122.412], size: 0.01 },
    { location: [52.52, 13.405], size: 0.01 },
    { location: [35.676, 139.65], size: 0.01 },
    { location: [-34.6, -58.38], size: 0.01 },
  ],
}: {
  markers: GlobeLocation[]
}) {
  const canvasRef: any = useRef()
  console.log('markers: ', markers)
  const locationToAngles = (lat, long) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ]
  }
  const focusRef = useRef([0, 0])

  useEffect(() => {
    let width = 0
    let currentPhi = 0
    let currentTheta = 0
    let phi = 0
    const doublePi = Math.PI * 2

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      scale: 0.75,
      mapSamples: 1600,
      opacity: 0.9,

      mapBaseBrightness: 0,
      mapBrightness: 6,
      baseColor: [60, 60, 60],
      markerColor: [0, 252, 233],
      // glowColor: [0, 0, 0],
      glowColor: [0, 0, 0],

      // offset: [0, width * 2 * 0.4 * 0.6],
      markers: markers,
      onRender: (state) => {
        state.phi = phi
        phi += 0.005
        state.width = 1000
        state.height = 1000
        state.phi = currentPhi
        state.theta = currentTheta
        const [focusPhi, focusTheta] = focusRef.current
        const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
        const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.08
        } else {
          currentPhi -= distNegative * 0.08
        }
        currentTheta = currentTheta * 0.92 + focusTheta * 0.08
        state.width = width * 2
        state.height = width * 2
      },
    })

    return () => {}
  }, [canvasRef, markers])

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        aspectRatio: 1,
        margin: 'auto',
        position: 'relative',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 1,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }}
      />
      {/* <div
        className='flex flex-col md:flex-row justify-center items-center control-buttons'
        style={{ gap: '.5rem' }}
      >
        Rotate to:
        <button
          onClick={() => {
            focusRef.current = locationToAngles(37.78, -122.412)
          }}
        >
          📍 San Francisco{' '}
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(52.52, 13.405)
          }}
        >
          📍 Berlin{' '}
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(35.676, 139.65)
          }}
        >
          📍 Tokyo{' '}
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(-34.6, -58.38)
          }}
        >
          📍 Buenos Aires{' '}
        </button>
      </div> */}
    </div>
  )
}
