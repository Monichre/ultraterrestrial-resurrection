'use client'
import * as THREE from 'three'

import {
  forwardRef,
  Suspense,
  useEffect,
  useRef,
  useState,
  type JSXElementConstructor,
  type PromiseLikeOfReactNode,
  type ReactElement,
  type ReactNode,
} from 'react'

import {
  Text,
  Html,
  Plane,
  ScrollControls,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useScroll,
  Scroll,
  useTexture,
  Image,
  MeshPortalMaterial,
  CameraControls,
  TransformControls,
} from '@react-three/drei'

import {
  useEventsStore,
  useTimelineConfig,
} from '../../../hooks/useTimelineConfig'
import { MultiStepLoader } from '@/components/multistep-loader'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { palette } from '@/utils/constants/colors'
import { geometry } from 'maath'
extend( geometry )

gsap.registerPlugin( useGSAP )

interface IntroSectionProps { }

const IntroSection: React.FC<IntroSectionProps> = () => {
  const texture = useTexture( '/astro-3.png' )
  return (
    <mesh position={[0, 0, 0]} scale={[800, 800, 1]}>
      <meshStandardMaterial map={texture} />
      <meshBasicMaterial attach='material' color={palette.gray} transparent />
      <Text
        font={'/fonts/ailerons.woff2'}
        fontSize={640}
        position={[0, 0, -500]}
        lineHeight={0}
        depthOffset={2}
        /* @ts-ignore */
        glyphGeometryDetail={15}
      >
        2024
      </Text>
      <Text
        font={'/fonts/FiraCode-VariableFont_wght.ttf'}
        position={[0, 200, 0]}
        fontSize={60}
        anchorX='center'
        anchorY='middle'
      >
        Events in the UFO Chronology
      </Text>

      {/* <meshBasicMaterial attach='material' color={palette.gray} transparent /> */}

      {/* <Plane args={[1, 1]} position={[0, 0, -250]}>
          <meshStandardMaterial attach='material' transparent />
        </Plane> */}
    </mesh>
  )
}

const LoadingSequence = ( { handleClick }: any ) => {
  const loadingStates = [
    { text: 'Verifying Majestic Level Security Clearance' },
    { text: 'Fetching Data' },
    { text: 'Loading Data' },
    { text: 'Making Shit Look Good' },
  ]
  return (
    <Html>
      <MultiStepLoader onClick={handleClick} loadingStates={loadingStates} />
    </Html>
  )
}

interface SceneProps {
  children: any
}

const Scene = ( { events, experts, years }: any ) => {
  const { camera, scene }: any = useThree()
  console.log( 'camera: ', camera )
  console.log( 'scene: ', scene )
  const timelineRef = useRef( new THREE.Group() )

  // const scroll = useScroll()

  const timelineConfig: any = useTimelineConfig( { events, personnel: experts } )
  console.log( 'timelineConfig: ', timelineConfig )
  const [activeYear, setActiveYear] = useState( 2024 )
  const [beginJourney, setBeginJourney] = useState( false )
  const [remainingYears, setRemainingYears] = useState(
    years.slice( years.indexOf( activeYear ), years.length - 1 )
  )
  console.log( 'remainingYears: ', remainingYears )

  useFrame( ( state, delta ) => {
    console.log( 'timelineRef: ', timelineRef )
    // timelineRef.current.position.y = THREE.MathUtils.damp(timelineRef.current.position.y, viewport.height * scroll.current, 4, delta)
  } )

  // const store = useEventsStore({ ...timelineConfig, activeYear: 2024 })
  // console.log('store: ', store)

  // useGSAP(() => {
  //   // Refs allow you to access DOM nodes

  //   if (beginJourney) {
  //     // then we can animate them like so...
  //     gsap.to(camera.position, {
  //       duration: 2,
  //       y: 0,
  //       ease: 'expo.inOut',
  //     })
  //   }
  // }, [camera, beginJourney])

  // useGSAP(() => {
  //   // Refs allow you to access DOM nodes
  //   const yearConfig = timelineConfig[activeYear]
  //   console.log('yearConfig: ', yearConfig)

  //   // @ts-ignore
  //   gsap.to([scene, background, scene.fog], {
  //     duration: 1,
  //     color: yearConfig?.background,
  //     ease: 'Power4.easeOut',
  //   })
  //   // @ts-ignore
  //   // gsap.to([scene,background, scene.fog], {
  //   //   duration: 1,
  //   //   color: yearConfig?.background,
  //   //   ease: 'Power4.easeOut'
  //   // })
  // }, [activeYear, timelineConfig, scene])

  // useFrame(() => {
  //   // const { scrollPos, scrolling, allowScrolling } = timelineData.c

  //   if (scroll) {
  //     console.log('scroll: ', scroll)
  //     // if (scrollPos <= 0) timelineData.c.scrollPos = 0
  //     // if (scrollPos >= -timelineData.stopScrollPos)
  //     //   timelineData.c.scrollPos = -timelineData.stopScrollPos

  //     // let delta = (scrollPos - timelineRef.current.position.z) / 12
  //     // timelineRef.current.position.z += delta

  //     // if (!timelineData.c.isMobile && Math.abs(delta) < 8) handleVideos()
  //     // if (!timelineData.easterEggEnabled) changeColours()

  //     // timelineData.c.scrolling = Math.abs(delta) > 0.1
  //   }
  // })

  // const changeColours = (override = false) => {
  //   const lastRemainingYear = remainingYears[remainingYears.length - 1];
  //   let newActiveMonth = lastRemainingMonth || "intro";

  //   if (override || newActiveMonth !== activeMonth) {
  //     if (override) {
  //       newActiveMonth = override;
  //     }
  //     setActiveMonth(newActiveMonth);

  //     const monthData = timelineData.months[newActiveMonth];
  //     gsap.to([scene.fog.color, scene.background], {
  //       duration: 1,
  //       r: monthData.bgColor.r,
  //       g: monthData.bgColor.g,
  //       b: monthData.bgColor.b,
  //       ease: "power4.out",
  //     });

  //     gsap.to(timelineData.textMat.color, {
  //       duration: 1,
  //       r: monthData.textColor.r,
  //       g: monthData.textColor.g,
  //       b: monthData.textColor.b,
  //       ease: "power4.out",
  //     });
  //   }
  // };
  // 1100
  return (
    <group ref={timelineRef}>
      {/* <LoadingSequence /> */}

      {years.map(
        (
          year:
            | string
            | number
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | PromiseLikeOfReactNode
            | null
            | undefined,
          index: string | number | bigint | undefined
        ) => (
          <group key={index}>
            <Text
              color='black'
              fontSize={0.25}
              letterSpacing={-0.025}
              anchorY='top'
              anchorX='left'
              lineHeight={0.8}
              position={[-0.375, 0.715, 0.01]}
            >
              {year}
            </Text>

            <mesh name={'year'}>
              <planeGeometry args={[200, 400, 0.1]} />
              <MeshPortalMaterial>
                <Image url='/astro-3.png' />
              </MeshPortalMaterial>
            </mesh>

            <mesh name={index} position={[0, 0, -0.001]}>
              {/* @ts-ignore */}
              <planeGeometry args={[200 + 0.05, 400 + 0.05, 0.12]} />
              <meshBasicMaterial color='black' />
            </mesh>
          </group>
        )
      )}
    </group>
  )
}

function Box( { text, color, ...props }: any ) {
  const [hovered, set] = useState( false )
  return (
    <mesh
      {...props}
      onPointerOver={( e ) => set( true )}
      onPointerOut={( e ) => set( false )}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
      <Html position={[0, 0, 1]} className='label' center>
        {text}
      </Html>
    </mesh>
  )
}
function Boxes() {
  const viewport = useThree( ( state ) => state.viewport )
  return (
    <>
      <Box text={<span>This is HTML</span>} color='aquamarine' />
      <Box
        text={<h1>H1 caption</h1>}
        color='lightblue'
        position={[0, -viewport.height, 0]}
      />
    </>
  )
}
function ScrollContainer( { scroll, children }: any ) {
  const { viewport } = useThree()
  const group: any = useRef()
  useFrame( ( state, delta ) => {
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      viewport.height * scroll.current,
      4,
      delta
    )
  } )
  return (
    <group position={[0, 0, 0]} ref={group}>
      {children}
    </group>
  )
}

// const Timeline: React.FC<any> = ({ events, experts }: any) => {
//   const years = Object.keys(events)
//   const scroll = useRef(0)

//   return (
//     <div
//       className='h-[100vh] overflow-scroll'
//       style={{ height: '100vh', width: '100vw' }}
//     >
//       <Canvas
//         camera={{ position: [0, 0, 800], fov: 82 }}
//         // eventSource={document.getElementById('root')}
//         eventPrefix='client'
//       >
//         <color attach='background' args={['#f0f0f0']} />
//         <fog attach='fog' args={['#f0f0f0', 0, 15]} />
//         <PerspectiveCamera makeDefault position={[0, 2000, 800]} />
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 10, 10]} />
//         <ScrollControls damping={0.2} maxSpeed={0.5} pages={years.length}>
//           <Scene events={events} experts={experts} years={years} />
//           <ScrollContainer scroll={scroll}>
//             <Boxes />
//           </ScrollContainer>
//         </ScrollControls>

//         <Environment preset='city' background blur={1} />
//         <OrbitControls />
//       </Canvas>
//     </div>
//   )
// }
const zPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 )
const yPlane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 1 )

function Controls() {
  // Get notified on changes to state
  // const snap = useSnapshot(state)
  const scene = useThree( ( state ) => state.scene )
  return (
    <>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {/* {snap.current && <TransformControls object={scene.getObjectByName(snap.current)} mode={modes[snap.mode]} />} */}
      {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.75}
      />
    </>
  )
}

const Timeline: React.FC<any> = ( { events, experts }: any ) => {
  const years = Object.keys( events )
  const scroll = useRef( 0 )

  return (
    <div
      className='h-[100vh] overflow-scroll'
      style={{ height: '100vh', width: '100vw' }}
    >
      <Canvas camera={{ position: [0, -10, 80], fov: 50 }} dpr={[1, 2]}>
        <color attach='background' args={['#f0f0f0']} />
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <hemisphereLight
          color='#ffffff'
          groundColor='#b9b9b9'
          position={[-7, 25, 13]}
          intensity={0.85}
        />
        <Suspense fallback={null}>
          {/* <fog attach='fog' args={['#f0f0f3', 0, 15]} /> */}
          <IntroSection />
          <Scene events={events} experts={experts} years={years} />
          {/* <ScrollControls damping={0.2} maxSpeed={0.5} pages={years.length}> */}
          {/* <ScrollContainer scroll={scroll}>
          <Scene events={events} experts={experts} years={years} />
          <Boxes />
        </ScrollContainer> */}
          {/* </ScrollControls> */}
        </Suspense>

        <Controls />
        {/* <Environment preset='night' background blur={1} /> */}
      </Canvas>
    </div>
  )
}
export { Timeline, IntroSection }
