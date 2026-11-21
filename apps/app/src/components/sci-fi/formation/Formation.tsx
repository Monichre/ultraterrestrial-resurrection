'use client'

/**
 * Formation — React Three Fiber clone of the generative flow-field
 * experience at https://formation.phobon.io (original © phbn).
 *
 * Peer deps: three, @react-three/fiber, @react-three/drei
 */
import * as THREE from 'three'
import {useMemo, useRef, useState, Suspense, type CSSProperties} from 'react'
import {Canvas, createPortal, extend, useFrame, useThree} from '@react-three/fiber'
import {OrthographicCamera, useFBO, shaderMaterial} from '@react-three/drei'
import {SURFACES, type SurfaceConfig, type SurfaceId} from './surfaces'

const FormationPointsMaterial = shaderMaterial(
  {u_time: 0, u_size: 0, u_resolution: [0, 0]},
  /* glsl */ `
    uniform float u_size;
    uniform vec2 u_resolution;

    varying float v_opacity;
    varying vec3 v_color;

    attribute float scale;
    attribute float opacity;
    attribute vec3 color;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;

      gl_PointSize = u_size * scale;
      gl_PointSize *= (1.0 / - modelPosition.z);

      v_opacity = opacity;
      v_color = color;
    }`,
  /* glsl */ `
    varying float v_opacity;
    varying vec3 v_color;

    void main() {
      gl_FragColor = vec4(v_color, v_opacity);
    }`
)
extend({FormationPointsMaterial})

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1]
}

function FlowField({config}: {config: SurfaceConfig}) {
  const {
    rows,
    columns,
    particleCount,
    pointSize,
    palette,
    randomize,
    maxFlowFieldIterations,
    maxColorIterations,
    generateFlowField,
  } = config

  const {width, height} = useThree((s) => s.viewport)
  const gl = useThree((s) => s.gl)
  const pointsRef = useRef<THREE.Points>(null!)

  const [field] = useState(() => new Float32Array(rows * columns))
  const [colorIndex, setColorIndex] = useState(0)
  const rgb = useMemo(() => hexToRgb(palette[colorIndex]), [palette, colorIndex])

  const flowIter = useRef(0)
  const colorIter = useRef(0)
  const step = useRef(new THREE.Vector2())

  const [positions, colors, scales, opacities, speeds] = useMemo(() => {
    const pos = new Float32Array(3 * particleCount)
    const col = new Float32Array(3 * particleCount)
    const scl = new Float32Array(particleCount)
    const opa = new Float32Array(particleCount)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      const p = 3 * i
      pos[p] = Math.random() * width
      pos[p + 1] = Math.random() * height
      pos[p + 2] = 0
      col[p] = rgb[0]
      col[p + 1] = rgb[1]
      col[p + 2] = rgb[2]
      scl[i] = Math.random() * 9 + 1
      opa[i] = Math.random() * 0.225 + 0.075
      spd[i] = Math.random() * 10 + 1
    }
    return [pos, col, scl, opa, spd]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, width, height])

  const flow = useMemo(
    () => generateFlowField(field, rows, columns),
    [field, rows, columns, generateFlowField]
  )

  const cellW = width / columns
  const cellH = height / rows

  useFrame(({clock}) => {
    const points = pointsRef.current
    if (!points) return
    const mat = points.material as THREE.ShaderMaterial
    mat.uniforms.u_time.value = clock.elapsedTime

    if (flowIter.current > maxFlowFieldIterations) {
      if (randomize) generateFlowField(field, rows, columns, true)
      flowIter.current = 0
    }
    if (colorIter.current > maxColorIterations) {
      setColorIndex((i) => (i + 1) % palette.length)
      const c = points.geometry.attributes.color.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const p = 3 * i
        c[p] = rgb[0]
        c[p + 1] = rgb[1]
        c[p + 2] = rgb[2]
      }
      points.geometry.attributes.color.needsUpdate = true
      colorIter.current = 0
    }

    const pos = points.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      const p = 3 * i
      const speed = speeds[i]
      const gx = Math.floor(pos[p] / cellW)
      const gy = Math.floor(pos[p + 1] / cellH)
      const angle = flow[gy * columns + gx] || 0
      step.current.set(Math.cos(angle) * speed, Math.sin(angle) * speed)
      pos[p] += step.current.x
      pos[p + 1] += step.current.y
      if (pos[p] > width || pos[p + 1] > height) {
        pos[p] = Math.random() * width
        pos[p + 1] = Math.random() * height
      }
    }
    points.geometry.attributes.position.needsUpdate = true
    flowIter.current += 1
    colorIter.current += 1
  })

  return (
    <group position={[-width / 2, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach='attributes-color'
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach='attributes-scale'
            count={particleCount}
            array={scales}
            itemSize={1}
          />
          <bufferAttribute
            attach='attributes-opacity'
            count={particleCount}
            array={opacities}
            itemSize={1}
          />
        </bufferGeometry>
        {/* @ts-expect-error drei shaderMaterial custom element */}
        <formationPointsMaterial
          key={FormationPointsMaterial.key}
          depthWrite={false}
          transparent
          uniforms-u_resolution-value={[width, height]}
          uniforms-u_size-value={pointSize * gl.getPixelRatio()}
        />
      </points>
    </group>
  )
}

function FlowFieldSurface({config}: {config: SurfaceConfig}) {
  const {width, height} = useThree((s) => s.viewport)
  const [scene] = useState(() => new THREE.Scene())
  const fbo = useFBO()
  const cameraRef = useRef<THREE.OrthographicCamera>(null!)
  const planeRef = useRef<THREE.Mesh>(null!)

  useFrame(({gl}) => {
    if (!cameraRef.current) return
    gl.setRenderTarget(fbo)
    gl.autoClear = false
    gl.render(scene, cameraRef.current)
    gl.setRenderTarget(null)
  })

  return (
    <>
      {createPortal(
        <>
          <OrthographicCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
          <Suspense fallback={null}>
            <FlowField config={config} />
          </Suspense>
        </>,
        scene
      )}
      <mesh scale={[width, height, 1]} ref={planeRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={fbo.texture} transparent />
      </mesh>
    </>
  )
}

export interface FormationProps {
  surface?: SurfaceId
  className?: string
  style?: CSSProperties
  background?: string
}

export function Formation({surface = 'cellular', className, style, background}: FormationProps) {
  const config = SURFACES[surface] ?? SURFACES.cellular
  const bg = background ?? config.background
  return (
    <div className={className} style={{width: '100%', height: '100%', background: bg, ...style}}>
      <Canvas
        gl={{antialias: true, preserveDrawingBuffer: true}}
        dpr={[1, 2]}
        camera={{position: [0, 0, 5]}}
        key={surface}>
        <color attach='background' args={[bg]} />
        <FlowFieldSurface config={config} />
      </Canvas>
    </div>
  )
}

export default Formation
export {SURFACES}
export type {SurfaceId}
