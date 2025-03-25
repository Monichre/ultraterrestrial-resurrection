'use client'
import { locationToAngles } from '@/utils'
import { AdaptiveDpr, OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import createGlobe from 'cobe'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function EventsGlobe( { markers, activeLocation }: any ) {
  const canvasRef: any = useRef()

  const [activeMarker, setActiveMarker] = useState( null )

  const focusRef: any = useRef( [0, 0] )

  useEffect( () => {
    const baseColor: any = [0, 0.3569, 0.4196]
    const markerColor: any = [1, 0, 0.7098]
    const glowColor: any = [0.0118, 0.0824, 0.1373]

    let width = 0
    let currentPhi = 0
    let currentTheta = 0
    const doublePi = Math.PI * 2
    const globe = createGlobe( canvasRef.current, {
      width: 1000,
      height: 1000,
      devicePixelRatio: 1,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 0,
      mapSamples: 6300,
      mapBrightness: 5.7,
      baseColor,
      mapBaseBrightness: 0,
      markerColor,
      glowColor,
      opacity: 0.27,
      scale: 0.75,
      markers,
      onRender: ( state ) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.

        state.phi = currentPhi
        state.theta = currentTheta
        const [focusPhi, focusTheta] = focusRef.current
        const distPositive = ( focusPhi - currentPhi + doublePi ) % doublePi
        const distNegative = ( currentPhi - focusPhi + doublePi ) % doublePi
        // Control the speed
        if ( distPositive < distNegative ) {
          currentPhi += distPositive * 0.08
        } else {
          currentPhi -= distNegative * 0.08
        }
        currentTheta = currentTheta * 0.92 + focusTheta * 0.08
        state.width = width * 2
        state.height = width * 2
      },
    } )

    return () => {
      globe.destroy()
    }
  }, [] )

  useEffect( () => {
    if ( activeLocation ) {
      console.log( 'activeLocation: ', activeLocation )
      const [lat, lon] = activeLocation
      focusRef.current = locationToAngles( lat, lon )
    }
  }, [activeLocation] )

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        maxWidth: '1000px',
        margin: '-200px auto auto',
        aspectRatio: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',

          contain: 'layout paint size',
        }}
      />
    </div>
  )
}


const EarthShaderMaterial: any = shaderMaterial(
  // Uniforms
  { texture: new THREE.Texture() },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.05 );
      vNormal = normalize( normalMatrix * normal );
      vUv = uv;
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D texture;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vec3 diffuse = texture2D( texture, vUv ).xyz;
      float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );
      vec3 atmosphere = vec3( 0, 1.0, 1.0 ) * pow( intensity, 3.0 );
      gl_FragColor = vec4( diffuse + atmosphere, 0.3 );
    }
  `
)

extend( { EarthShaderMaterial } )

// Custom hook for handling globe rotation and zoom
function useGlobeControls( initialDistance = 1000 ) {
  const [distance, setDistance] = useState( initialDistance )
  const [rotation, setRotation] = useState( { x: Math.PI * 3 / 2, y: Math.PI / 6.0 } )

  const zoom = ( delta ) => {
    const newDistance = Math.max( 350, Math.min( 1100, distance - delta ) )
    setDistance( newDistance )
  }

  return { distance, rotation, zoom, setRotation }
}

// Earth sphere with atmosphere
function Earth() {
  const meshRef = useRef()
  const earthTexture = useTexture( 'https://cdn.rawgit.com/dataarts/webgl-globe/2d24ba30/globe/world.jpg' )
  useFrame( () => {
    if ( meshRef.current ) {
      meshRef.current.rotation.y += 0.005
    }
  } )

  const material = new EarthShaderMaterial( {
    texture: earthTexture,
  } )

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef} rotation-y={Math.PI} material={material}>
        <sphereGeometry args={[200, 40, 30]} />
        {/* <earthShaderMaterial key={EarthShaderMaterial.key} attach='material' /> */}
      </mesh>

      {/* Atmosphere layer */}
      {/* <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[200, 40, 30]} />
        <shaderMaterial
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent={true}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 12.0);
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity;
            }
          `}
        />
      </mesh> */}
    </group>
  )
}

// Data points visualization
function DataPoints( { markers }: any ) {
  const points = useRef()

  const getColor = ( value ) => {
    const color = new THREE.Color()
    color.setHSL( 0.441 + ( value / 2 ), 0.60, 0.75 )
    return color
  }

  useEffect( () => {
    if ( !markers || !points.current ) return

    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []

    markers.forEach( ( { location, size }: any ) => {
      const [lat, lng] = location
      const phi = ( 90 - lat ) * Math.PI / 180
      const theta = ( 180 - lng ) * Math.PI / 180
      const color = getColor( size )

      const x = 200 * Math.sin( phi ) * Math.cos( theta )
      const y = 200 * Math.cos( phi )
      const z = 200 * Math.sin( phi ) * Math.sin( theta )

      positions.push( x, y, z )
      colors.push( color.r, color.g, color.b )
    } )

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )

    points.current.geometry = geometry
  }, [markers] )

  return (
    <points ref={points}>
      <bufferGeometry />
      <pointsMaterial
        size={4}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        transparent={true}
      />
    </points>
  )
}

// Main Globe component
export function CodePenGlobe( { width = '100%', height = '100vh', markers }: any ) {
  const [globeData, setGlobeData] = useState( null )
  const controls = useGlobeControls()

  // Load earth texture
  // const earthTexture = useTexture( 'https://cdn.rawgit.com/dataarts/webgl-globe/2d24ba30/globe/world.jpg' )

  useEffect( () => {
    if ( markers ) {
      setGlobeData( markers )
    }
  }, [markers] )

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, controls.distance],
          fov: 30,
          near: 1,
          far: 10000
        }}
        style={{ width, height }}
      >
        <AdaptiveDpr pixelated />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={350}
          maxDistance={1100}
          rotateSpeed={0.5}
          zoomSpeed={1}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Earth />
        {globeData && <DataPoints data={globeData} />}
      </Canvas>
    </div>
  )
}

// Types for TypeScript support
interface GlobeProps {
  width?: string | number
  height?: string | number
  data?: [number, number, number][] // [latitude, longitude, magnitude][]
}