import * as THREE from 'three/webgpu'
import * as TSL from 'three/tsl'
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import {Text} from '@react-three/drei'
import {PerspectiveCamera} from 'three/webgpu'
import {OrbitControls, TransformControls} from 'three-stdlib'

extend({THREE, OrbitControls, TransformControls})

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

// Custom Noise shader pass
const NoiseEffect = () => {
  const noiseShader = {
    uniforms: {
      tDiffuse: {value: null},
      amount: {value: 0.05},
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;
      float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float noise = rand(gl_FragCoord.xy) * amount;
        gl_FragColor = vec4(color.rgb + noise, color.a);
      }
    `,
  }

  return <shaderMaterial args={[noiseShader]} attach='material' />
}

// Custom ScanLine shader pass
export const ScanLineEffect = () => {
  const scanLineShader = {
    uniforms: {
      tDiffuse: {value: null},
      time: {value: 0.0},
      lineHeight: {value: 4.0},
      lineSpacing: {value: 2.0},
      opacity: {value: 0.1},
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float lineHeight;
      uniform float lineSpacing;
      uniform float opacity;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float scanline = step(lineSpacing, mod(gl_FragCoord.y, lineHeight)) * opacity;
        color.rgb += scanline;
        gl_FragColor = color;
      }
    `,
  }

  return <shaderMaterial args={[scanLineShader]} attach='material' />
}

// Particles component
export const Particles = () => {
  const particlesCount = 50000
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = Math.random() * 500 - 250
    positions[i * 3 + 1] = Math.random() * 500 - 250
    positions[i * 3 + 2] = Math.random() * 2000 - 1000
  }

  const particlesRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.0008
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={positions}
          count={particlesCount}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={0xffffff} transparent blending={THREE.AdditiveBlending} />
    </points>
  )
}

export const PathJourney = ({
  years,
  scroll,
}: {
  years: number[]
  scroll: React.MutableRefObject<number>
}) => {
  // Define path points
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 100),
    new THREE.Vector3(20, 0, 200),
    new THREE.Vector3(30, -10, 300),
    new THREE.Vector3(0, 0, 400),
    new THREE.Vector3(5, 5, 500),
    new THREE.Vector3(-5, 5, 600),
    new THREE.Vector3(5, -5, 700),
  ]

  const path = new THREE.CatmullRomCurve3(points)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const {camera} = useThree()

  // Text along the path
  const textLabels = ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5']
  const yearLabels = years || Array.from({length: 25}, (_, i) => 2024 - i)

  useFrame(() => {
    if (cameraRef.current && scroll.current !== undefined) {
      const newPath = path.getPointAt(scroll.current)
      camera.position.set(newPath.x, newPath.y, newPath.z)
      const lookAtPoint = path.getPointAt((scroll.current + 0.01) % 1)
      camera.lookAt(lookAtPoint)
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 0]} fov={75} />
      <ambientLight intensity={0.4} />
      <pointLight position={[50, 50, 50]} intensity={1} />

      {/* Tube along path */}
      <mesh>
        <tubeGeometry args={[path, 200, 10, 20, false]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffffff}
          roughness={0.5}
          metalness={0.1}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Text sections */}
      {textLabels.map((text, i) => {
        const position = path.getPointAt(i * 0.25)
        const lookAtPos = path.getPointAt((i * 0.25 + 0.01) % 1)
        const direction = new THREE.Vector3().subVectors(lookAtPos, position).normalize()

        return (
          <group key={`section-${text}`} position={[position.x, position.y, position.z]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color='white'
              anchorX='center'
              anchorY='middle'
              lookAt={direction}>
              {text}
            </Text>
          </group>
        )
      })}

      {/* Year markers */}
      {yearLabels.map((year, i) => {
        const step = 1 / yearLabels.length
        const position = path.getPointAt(i * step)

        return (
          <group key={`year-${year}`} position={[position.x - 4, position.y, position.z]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.2}
              color='white'
              anchorX='center'
              anchorY='middle'>
              {year.toString()}
            </Text>
          </group>
        )
      })}

      <Particles />
    </>
  )
}
