'use client'

// import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
// import {
//   Text,
//   Html,
//   Plane,
//   Sphere,
//   Box,
//   shaderMaterial,
// } from '@react-three/drei'
// import * as THREE from 'three'
// import { gsap } from 'gsap'
// import greenscreen from '../shaders/greenscreen.frag'
// import vert from '../shaders/default.vert'

// // Define custom Shader Material
// const GreenScreenMaterial = shaderMaterial(
//   {
//     fogColor: new THREE.Color(0x000000),
//     fogNear: 0,
//     fogFar: 0,
//     texture: null,
//   },
//   vert,
//   greenscreen
// )

// const Section = ({ timeline, section }) => {
//   switch (section) {
//     case 'intro':
//       return <IntroSection timeline={timeline} />
//     case 'end':
//       return <EndSection timeline={timeline} />
//     case 'contact':
//       return <ContactSection timeline={timeline} />
//     default:
//       return <DefaultSection timeline={timeline} section={section} />
//   }
// }

// const IntroSection = ({ timeline }) => {
//   const { assets, textMat, textOutlineMat } = timeline

//   const texture = useLoader(THREE.TextureLoader, 'images/highlights.png')
//   const introTexture = useLoader(THREE.TextureLoader, 'intro/ok.png')

//   return (
//     <group>
//       <Text
//         font={assets.fonts['SuisseIntl-Bold']}
//         size={60}
//         material={textMat}
//         center
//         position={[0, 0, 0]}
//       >
//         YEAR IN REVIEW
//       </Text>
//       <Text
//         font={assets.fonts['Schnyder_Edit Outline']}
//         size={640}
//         material={textOutlineMat}
//         center
//         position={[0, 0, -500]}
//       >
//         2018
//       </Text>
//       <Plane scale={[800, 800, 1]} position={[0, 0, -250]}>
//         <meshBasicMaterial map={introTexture} transparent />
//       </Plane>
//       <Badge texture={texture} timeline={timeline} />
//     </group>
//   )
// }

// const Badge = ({ texture, timeline }) => {
//   const { assets, textMat, c } = timeline

//   return (
//     <group position={[0, 0, 50]}>
//       <Plane scale={[200, 200, 1]}>
//         <meshBasicMaterial map={texture} transparent />
//       </Plane>
//       <Text
//         font={assets.fonts['Schnyder L']}
//         size={26}
//         material={textMat}
//         center
//       >
//         2018-19
//       </Text>
//     </group>
//   )
// }

// const DefaultSection = ({ timeline, section }) => {
//   const { assets, textMat } = timeline
//   const textGeom = new THREE.TextGeometry(timeline.months[section].name, {
//     font: assets.fonts['Schnyder L'],
//     size: 200,
//     height: 0,
//     curveSegments: 10,
//   }).center()
//   const monthName = new THREE.Mesh(textGeom, textMat)
//   monthName.position.set(timeline.months[section].offset || 0, 0, 0)
//   return <primitive object={monthName} />
// }

// const EndSection = ({ timeline }) => {
//   const { assets, textMat, textOutlineMat, scene } = timeline
//   const videoTexture = useLoader(THREE.VideoTextureLoader, 'end/wave.mp4')
//   const material = new GreenScreenMaterial({
//     fogColor: scene.fog.color,
//     fogNear: scene.fog.near,
//     fogFar: scene.fog.far,
//     texture: videoTexture,
//   })

//   return (
//     <group>
//       <Text
//         font={assets.fonts['SuisseIntl-Bold']}
//         size={60}
//         material={textMat}
//         center
//       >
//         SEE YOU NEXT YEAR
//       </Text>
//       <Text
//         font={assets.fonts['Schnyder_Edit Outline']}
//         size={580}
//         material={textOutlineMat}
//         center
//         position={[0, 0, -300]}
//       >
//         END
//       </Text>
//       <Plane scale={[700, 700, 1]} position={[0, 0, -200]}>
//         <primitive object={material} attach='material' />
//       </Plane>
//       <WhooshButton timeline={timeline} />
//     </group>
//   )
// }

// const WhooshButton = ({ timeline }) => {
//   const whooshTexture = useLoader(THREE.TextureLoader, 'images/whoooosh.png')
//   const arrowTexture = useLoader(THREE.TextureLoader, 'images/arrowdown.png')
//   arrowTexture.anisotropy = useThree().gl.capabilities.getMaxAnisotropy()

//   return (
//     <group position={[0, -450, 50]}>
//       <Plane scale={[200, 200, 1]}>
//         <meshBasicMaterial map={whooshTexture} transparent depthWrite={false} />
//       </Plane>
//       <Plane scale={[90, 90, 1]} position={[0, 0, 20]}>
//         <meshBasicMaterial
//           map={arrowTexture}
//           transparent
//           side={THREE.DoubleSide}
//           depthWrite={false}
//         />
//       </Plane>
//     </group>
//   )
// }

// const ContactSection = ({ timeline }) => {
//   const { assets, textMat, contactTextMat, linkUnderlineMat } = timeline
//   return (
//     <group position={[0, 2000 / timeline.scene.scale.y, 0]} visible={false}>
//       <Text
//         font={assets.fonts['SuisseIntl-Bold']}
//         size={10}
//         material={textMat}
//         center
//         position={[0, 60, 0]}
//       >
//         SAY HELLO
//       </Text>
//       <Text
//         font={assets.fonts['Schnyder L']}
//         size={30}
//         material={contactTextMat}
//         center
//       >
//         Let’s make 2019 just as memorable with more amazing talent and exciting
//         new projects.
//       </Text>
//       <Text
//         font={assets.fonts['Schnyder L']}
//         size={30}
//         material={contactTextMat}
//         center
//         position={[0, -45, 0]}
//       >
//         amazing talent and exciting new projects.
//       </Text>
//       <Text
//         font={assets.fonts['Schnyder L']}
//         size={36}
//         material={textMat}
//         center
//         position={[0, -140, 0]}
//       >
//         hello@craftedbygc.com
//       </Text>
//       <Plane position={[0, -172, 0]}>
//         <meshBasicMaterial attach='material' alphaTest={0} visible={false} />
//         <Html>
//           <div
//             style={{
//               width: '490px',
//               height: '60px',
//               cursor: 'pointer',
//               transform: 'translate(-50%, -50%)',
//             }}
//             onClick={() =>
//               window.open('mailto:hello@craftedbygc.com', '_blank')
//             }
//           />
//         </Html>
//       </Plane>
//     </group>
//   )
// }

// export default Section

// Section.tsx
// Section.tsx

import { useMemo, useRef } from 'react'
import {
  Group,
  Mesh,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  MeshBasicMaterial,
} from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Item } from './item'
import { months } from './config/months'

interface SectionProps {
  month: string
  items: string[]
  data: any
  assets: any
  position?: [number, number, number]
}

export const Section = ({
  month,
  items,
  data,
  assets,
  position,
}: SectionProps) => {
  console.log('items: ', items)
  const ref = useRef<Group>(null)
  console.log('assets: ', assets)
  const textMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: months[month].textColor,
        transparent: true,
      }),
    [month]
  )
  const outlineMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: months[month].outlineTextColor || months[month].textColor,
        transparent: true,
      }),
    [month]
  )

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={ref} position={position}>
      <Text
        position={[0, 200, 0]}
        fontSize={200}
        material={textMaterial}
        anchorX='center'
        anchorY='middle'
      >
        {months[month].name || ''}
      </Text>
      <mesh
        position={[0, 0, -500]}
        scale={[800, 800, 1]}
        material={outlineMaterial}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          attach='material'
          // map={assets.textures[month]['ok.png']}
          transparent
        />
      </mesh>
      {items.map((filename, idx) => (
        <Item
          key={filename}
          timeline={null}
          texture={assets.textures[month][filename]}
          data={data[filename]}
          month={month}
          itemIndex={idx}
          itemIndexTotal={items.length}
        />
      ))}
    </group>
  )
}
// interface SectionProps {
//   month: string
//   items: string[]
//   data: any
//   assets: any
//   position?: [number, number, number]
// }

// export const Section = ({
//   month,
//   items,
//   data,
//   assets,
//   position,
// }: SectionProps) => {
//   console.log('items: ', items)
//   const ref: any = useRef(null)
//   console.log('assets: ', assets)

//   const outlineMaterial = useMemo(
//     () =>
//       new MeshBasicMaterial({
//         color: months[month].outlineTextColor || months[month].textColor,
//         transparent: true,
//       }),
//     [month]
//   )

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.rotation.y += 0.01
//     }
//   })
//   const texture: any = useTexture(assets.textures[month])
//   console.log('texture: ', texture)
//   return (
//     <group ref={ref} position={position}>
//       <Text
//         position={[0, 200, 0]}
//         fontSize={200}
//         anchorX='center'
//         anchorY='middle'
//       >
//         {month || 'test'}
//       </Text>
//       <mesh
//         position={[0, 0, -500]}
//         scale={[800, 800, 1]}
//         material={outlineMaterial}
//       >
//         {/* <planeGeometry args={[1, 1]} />
//         <meshBasicMaterial
//           attach='material'
//           // map={assets.textures[month]['ok.png']}
//           transparent
//         />
//              */}

//         <Plane args={[1, 1]} position={[0, 0, -250]}>
//           <meshBasicMaterial attach='material' map={texture} transparent />
//         </Plane>
//       </mesh>
//       {items && items?.length
//         ? items.map((filename, idx) => (
//             <Item
//               key={filename}
//               timeline={null}
//               texture={assets.textures[month][filename]}
//               data={data[filename]}
//               month={month}
//               itemIndex={idx}
//               itemIndexTotal={items.length}
//             />
//           ))
//         : null}
//     </group>
//   )
// }
