import { ICON_BLUE } from '@/utils/constants/colors'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import R3fGlobe from 'r3f-globe'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
const OPACITY = 0.4
const SPEED = 2000

export const SciFiGlobe = ( { markers = [], activeLocation = null, arcsData = [] } ) => {
  const globeEl = useRef()
  const [arcsArray, setArcsArray] = useState( [{
    startLat: markers[0]?.location[0],
    startLng: markers[0]?.location[1],
    endLat: null,
    endLng: null
  }] )

  // Update arcs when activeLocation changes
  useEffect( () => {
    if ( !activeLocation ) return

    setArcsArray( prev => {
      const lastArc = prev[prev.length - 1]

      // If last arc has no end point, add it
      if ( lastArc.endLat === null ) {
        return prev.map( ( arc, i ) => {
          if ( i === prev.length - 1 ) {
            return {
              ...arc,
              endLat: activeLocation[0],
              endLng: activeLocation[1]
            }
          }
          return arc
        } )
      }

      // Otherwise add new arc starting from active location
      return [...prev, {
        startLat: activeLocation[0],
        startLng: activeLocation[1],
        endLat: null,
        endLng: null
      }]
    } )
  }, [activeLocation] )

  const arcs = useMemo( () => {
    return arcsArray.filter( arc => arc.endLat !== null )
  }, [arcsArray] )


  const pointsData = useMemo( () =>
    markers.map( marker => ( {
      lat: marker.location[0],
      lng: marker.location[1],
      size: marker.size,
      color: ICON_BLUE
    } ) )
    , [markers] )



  // Set auto-rotation once the globe is mounted.
  useEffect( () => {
    if ( globeEl.current ) {
      const controls = globeEl.current.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = -0.6

    }
  }, [] )

  // Update point of view when activeLocation changes
  useEffect( () => {
    if ( !activeLocation ) return
    if ( !globeEl.current ) return
    const [lat, lng] = activeLocation as [number, number]
    const cartesian = globeEl.current.getCoords( lat, lng )

    console.log( "🚀 ~ useEffect ~ cartesian:", cartesian )

    const coords = globeEl.current.toGeoCoords( cartesian )

    console.log( "🚀 ~ useEffect ~ coords:", coords )

    globeEl.current.rotation.x += coords.lat
    globeEl.current.rotation.y += coords.lng

  }, [activeLocation, globeEl] )
  // useFrame( ( state, delta ) => {
  //   if ( !activeLocation ) {
  //     const [lat, lng] = activeLocation as [number, number]
  //     const cartesian = globeEl.current.getCoords( lat, lng )

  //     console.log( "🚀 ~ useEffect ~ cartesian:", cartesian )

  //     const coords = globeEl.current.toGeoCoords( cartesian )
  //     globeEl.current.rotation.x += coords.lat
  //     globeEl.current.rotation.y += coords.lng
  //   }

  // } )
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas camera={useMemo( () => ( { fov: 50, position: [0, 0, 350] } ), [] )} style={{ height: '80%', width: '50%', position: 'relative', left: '10%', top: '10%' }}>
        <OrbitControls minDistance={101} maxDistance={1e4} dampingFactor={0.1} zoomSpeed={0.3} rotateSpeed={0.3} />
        {/* <color attach="background" args={[0, 0, 0]} /> */}
        <ambientLight color={0xcccccc} intensity={Math.PI} />
        <directionalLight intensity={0.6 * Math.PI} />
        <R3fGlobe
          ref={globeEl}
          animateIn={true}

          globeImageUrl="/8k_earth_nightmap.jpeg"
          // arcLabel="label"
          // backgroundColor="none"
          showAtmosphere={false}
          arcColor={( d ) =>
            [
              `rgba(16, 0, 73, ${OPACITY / 3})`,
              `rgba(144, 238, 255, ${OPACITY / 1.5})`,
              `rgba(255, 255, 255, ${OPACITY / 1.1})`
            ].reverse()
          }
          arcDashLength={0.3}
          arcDashGap={0.003}
          arcDashAnimateTime={30000}
          arcsTransitionDuration={SPEED}
          pointAltitude={.05}
          pointRadius={0.1}
          pointsMerge={true}
          pointsData={pointsData}
          arcsData={arcs}
        // o={activeLocation ? [activeLocation[0], activeLocation[1], 0] : [0, 0, 0]}

        />
      </Canvas>
    </Suspense>

  )
}