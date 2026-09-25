'use client'

import {Html, Instance, Instances} from '@react-three/drei'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import * as THREE from 'three'

export interface RotatingGlobeCity {
  lat: number
  lng: number
  city: string
  sublabel?: string
  dots?: number
}

export interface RotatingGlobeProps {
  cities?: RotatingGlobeCity[]
  idleRotation?: number
  initialRotation?: number
  height?: number | string
  backgroundColor?: string
  clickSound?: boolean
}

export const ROTATING_GLOBE_DEFAULT_CITIES: RotatingGlobeCity[] = [
  {
    lat: 24,
    lng: -130,
    city: 'San Francisco',
    sublabel: 'est. 2025',
    dots: 11,
  },
  {lat: 36, lng: -40, city: 'NYC', sublabel: 'est. 2024', dots: 91},
  {lat: 8, lng: -25, city: 'Buenos Aires', sublabel: 'est. 2025', dots: 8},
  {lat: 40, lng: 50, city: 'London', sublabel: 'est. 2025', dots: 14},
]

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = ((lng + 180) * Math.PI) / 180
  const theta = Math.min(((90 - lat) * Math.PI) / 180, Math.PI / 2)
  const x = -radius * Math.sin(theta) * Math.cos(phi)
  const y = radius * Math.cos(theta)
  const z = radius * Math.sin(theta) * Math.sin(phi)
  return new THREE.Vector3(x, y, z)
}

function hash01(s: string): number {
  let t = 0
  for (let i = 0; i < s.length; i++) t = Math.imul(31, t) + s.charCodeAt(i)
  const r = 10000 * Math.sin(t)
  return r - Math.floor(r)
}

function computeScatterRadius(dots: number, maxDots: number): number {
  if (maxDots === 0) return 2
  return 2 + 6 * Math.sqrt(dots / maxDots)
}

function cityKey(city: RotatingGlobeCity): string {
  return `${city.city}-${city.lat}-${city.lng}`
}

const ATMOSPHERE_VERTEX = `
  varying float vIntensity;
  uniform vec3 lightPosition;
  uniform float coefficient;
  uniform float power;

  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 camToVertexDir = normalize(-viewPosition.xyz);
    vec4 viewLightPos = viewMatrix * vec4(lightPosition, 1.0);
    vec3 lightDir = normalize(viewLightPos.xyz - viewPosition.xyz);

    float lightDot = dot(lightDir, vNormal);
    float lightIntensity = 0.7 + 0.3 * clamp(lightDot + 0.5, 0.0, 1.0);

    float fresnel = coefficient - dot(vNormal, camToVertexDir);
    vIntensity = pow(max(fresnel, 0.0), power) * lightIntensity;

    gl_Position = projectionMatrix * viewPosition;
  }
`

const ATMOSPHERE_FRAGMENT = `
  varying float vIntensity;
  uniform vec3 glowColor;

  void main() {
    vec3 color = glowColor * vIntensity;
    gl_FragColor = vec4(color, vIntensity);
  }
`

function createAtmosphereGlowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: ATMOSPHERE_VERTEX,
    fragmentShader: ATMOSPHERE_FRAGMENT,
    uniforms: {
      glowColor: {value: new THREE.Color('#FFFFFF')},
      lightPosition: {value: new THREE.Vector3(0, 15, 10)},
      coefficient: {value: 0.5},
      power: {value: 4.5},
    },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  })
}

function OuterGlow() {
  const material = useMemo(() => createAtmosphereGlowMaterial(), [])
  return (
    <mesh material={material}>
      <sphereGeometry args={[2.08, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
  )
}

function BaseSphere() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color='#0D0D0D' metalness={0.1} roughness={0.7} />
    </mesh>
  )
}

function InnerMask() {
  return (
    <mesh>
      <sphereGeometry args={[1.98, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color='#0D0D0D' side={THREE.FrontSide} />
    </mesh>
  )
}

function InnerFresnelGlow() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: {value: new THREE.Color('#FFFFFF')},
          intensity: {value: 0.3},
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying float vFresnel;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-mvPosition.xyz);
            float NdotV = dot(vNormal, vViewDir);
            vFresnel = pow(1.0 - max(0.0, NdotV), 2.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float intensity;
          varying float vFresnel;
          void main() {
            float glow = vFresnel * intensity;
            gl_FragColor = vec4(glowColor, glow);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
      }),
    []
  )

  return (
    <mesh material={material}>
      <sphereGeometry args={[2.004, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
  )
}

function SurfaceDotGrid() {
  const dots = useMemo(() => {
    const out: {position: THREE.Vector3; rotation: THREE.Euler}[] = []
    const up = new THREE.Vector3(0, 0, 1)
    const q = new THREE.Quaternion()
    for (let i = 0; i <= 20; i++) {
      const theta = (i / 20) * (Math.PI / 2)
      if (i === 0) continue
      for (let j = 0; j < 64; j++) {
        const phi = (j / 64) * Math.PI * 2
        const x = 2.002 * Math.sin(theta) * Math.cos(phi)
        const y = 2.002 * Math.cos(theta)
        const z = 2.002 * Math.sin(theta) * Math.sin(phi)
        const pos = new THREE.Vector3(x, y, z)
        const normal = pos.clone().normalize()
        q.setFromUnitVectors(up, normal)
        const rot = new THREE.Euler().setFromQuaternion(q)
        out.push({position: pos, rotation: rot})
      }
    }
    return out
  }, [])

  return (
    <Instances limit={dots.length}>
      <circleGeometry args={[0.005, 16]} />
      <meshStandardMaterial
        color='#3D3D3D'
        metalness={0.1}
        roughness={0.6}
        side={THREE.DoubleSide}
      />
      {dots.map((d, i) => (
        <Instance key={i} position={d.position} rotation={d.rotation} />
      ))}
    </Instances>
  )
}

function EquatorRays() {
  const geometry = useMemo(() => {
    const positions: number[] = []
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2
      positions.push(
        2 * Math.cos(a),
        0,
        2 * Math.sin(a),
        2.6 * Math.cos(a),
        0,
        2.6 * Math.sin(a)
      )
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color='#ffffff' opacity={0.2} transparent />
    </lineSegments>
  )
}

function SouthPoleRod() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, -0.825, 0, 0, -1.225, 0], 3)
    )
    return g
  }, [])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color='#ffffff' opacity={1} transparent />
    </lineSegments>
  )
}

function CityLabel({
  city,
  sublabel,
  lat,
  lng,
}: {
  city: string
  sublabel?: string
  lat: number
  lng: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [visible, setVisible] = useState(true)
  const {camera, size} = useThree()

  const height = size.width < 640 ? 60 : size.width < 1024 ? 100 : 140
  const anchor = useMemo(() => latLngToVec3(lat, lng, 2), [lat, lng])
  const normal = useMemo(() => anchor.clone().normalize(), [anchor])
  const labelPos = useMemo(
    () => anchor.clone().add(normal.clone().multiplyScalar(0.02)),
    [anchor, normal]
  )

  useFrame(() => {
    if (!groupRef.current) return
    const worldPos = new THREE.Vector3()
    groupRef.current.localToWorld(worldPos.copy(anchor))
    const surfaceDir = worldPos.clone().normalize()
    const camDir = camera.position.clone().normalize()
    setVisible(surfaceDir.dot(camDir) > 0.05)
  })

  return (
    <group ref={groupRef}>
      <Html
        center={false}
        position={labelPos.toArray()}
        style={{
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
        }}
        zIndexRange={[0, 0]}
      >
        <div
          style={{
            position: 'relative',
            height: `${height}px`,
            transform: 'translateY(-100%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1px',
              height: '100%',
              backgroundColor: '#555555',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: '14px',
                color: 'white',
                lineHeight: 1.2,
              }}
            >
              {city}
            </span>
            {sublabel && (
              <span
                style={{fontSize: '12px', color: '#8a8a8c', lineHeight: 1.2}}
              >
                {sublabel}
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}

function CityLabels({cities}: {cities: RotatingGlobeCity[]}) {
  return (
    <group>
      {cities.map((c) => (
        <CityLabel
          key={cityKey(c)}
          city={c.city}
          sublabel={c.sublabel}
          lat={c.lat}
          lng={c.lng}
        />
      ))}
    </group>
  )
}

function Dot({position}: {position: THREE.Vector3}) {
  return (
    <mesh position={position} renderOrder={10}>
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshBasicMaterial color='#ffffff' depthTest opacity={0.95} transparent />
    </mesh>
  )
}

function CityDots({cities}: {cities: RotatingGlobeCity[]}) {
  const positions = useMemo(() => {
    const maxDots = Math.max(0, ...cities.map((c) => c.dots ?? 0))
    const out: {key: string; position: THREE.Vector3}[] = []
    for (const c of cities) {
      const count = c.dots ?? 0
      if (count <= 0) continue
      const scatter = computeScatterRadius(count, maxDots)
      for (let i = 0; i < count; i++) {
        const seedBase = `${c.city}-${i}`
        const angleSeed = hash01(`${seedBase}-angle`)
        const distSeed = hash01(`${seedBase}-dist`)
        const jitterSeed = hash01(`${seedBase}-jitter`)
        const angle = angleSeed * Math.PI * 2
        const offset =
          (0.7 * Math.sqrt(distSeed) + 0.3 * distSeed) *
          scatter *
          (0.3 + 0.7 * jitterSeed)
        const lat = c.lat + Math.cos(angle) * offset
        const lng = c.lng + Math.sin(angle) * offset
        const base = latLngToVec3(lat, lng, 2)
        const pos = base.clone()
        pos.add(base.clone().normalize().multiplyScalar(0.015))
        out.push({key: `${c.city}-${i}`, position: pos})
      }
    }
    return out
  }, [cities])

  return (
    <group>
      {positions.map((p) => (
        <Dot key={p.key} position={p.position} />
      ))}
    </group>
  )
}

const TICK_RESOLUTION = (2 * Math.PI) / 120
const TICK_MIN_INTERVAL = 0.05

let cachedTickBuffer: AudioBuffer | null = null

function getTickBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedTickBuffer && cachedTickBuffer.sampleRate === ctx.sampleRate) {
    return cachedTickBuffer
  }
  const sampleRate = ctx.sampleRate
  const length = Math.ceil(0.005 * sampleRate)
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = 2 * Math.random() - 1
  cachedTickBuffer = buffer
  return buffer
}

function playTick(ctx: AudioContext) {
  const t = ctx.currentTime
  const source = ctx.createBufferSource()
  source.buffer = getTickBuffer(ctx)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.06, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.005)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start(t)
  source.stop(t + 0.005)
}

function GlobeGroup({
  cities,
  enableRotation,
  isDragging,
  idleRotation,
  rotationRef,
  velocityRef,
  audioContextRef,
  lastClickIndexRef,
  lastClickTimeRef,
}: {
  cities: RotatingGlobeCity[]
  enableRotation: boolean
  isDragging: boolean
  idleRotation: number
  rotationRef: MutableRefObject<number>
  velocityRef: MutableRefObject<number>
  audioContextRef: MutableRefObject<AudioContext | null>
  lastClickIndexRef: MutableRefObject<number>
  lastClickTimeRef: MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const target = !isDragging && enableRotation ? idleRotation : 0
    const accel = (target - velocityRef.current) * 1 * delta
    velocityRef.current += accel
    if (!isDragging && Math.abs(velocityRef.current) > Math.abs(target)) {
      velocityRef.current *= 0.95 ** (60 * delta)
    }
    rotationRef.current += velocityRef.current * delta
    groupRef.current.rotation.y = rotationRef.current

    const ctx = audioContextRef.current
    const movingMeaningfully = Math.abs(velocityRef.current - target) > 1e-4
    if (ctx && (isDragging || movingMeaningfully)) {
      const index = Math.floor(rotationRef.current / TICK_RESOLUTION)
      const now = ctx.currentTime
      if (
        index !== lastClickIndexRef.current &&
        now - lastClickTimeRef.current >= TICK_MIN_INTERVAL
      ) {
        playTick(ctx)
        lastClickIndexRef.current = index
        lastClickTimeRef.current = now
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group>
        <OuterGlow />
        <BaseSphere />
        <EquatorRays />
        <InnerMask />
        <InnerFresnelGlow />
        <SurfaceDotGrid />
        <SouthPoleRod />
      </group>
      <CityDots cities={cities} />
      <CityLabels cities={cities} />
    </group>
  )
}

function pointerSensitivity(pointerType: string, surfaceWidth: number): number {
  if (pointerType === 'touch') return 2 / Math.max(surfaceWidth, 1)
  return 0.001
}

export function RotatingGlobe({
  cities = ROTATING_GLOBE_DEFAULT_CITIES,
  idleRotation = 0.06,
  initialRotation = 4,
  height = '100%',
  backgroundColor = '#0D0D0D',
  clickSound = false,
}: RotatingGlobeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const rotationRef = useRef(initialRotation)
  const velocityRef = useRef(idleRotation)
  const draggingRef = useRef(false)
  const activePointerRef = useRef<number | null>(null)
  const pointerTypeRef = useRef<string>('mouse')
  const surfaceWidthRef = useRef(1)
  const lastClientXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastClickIndexRef = useRef(0)
  const lastClickTimeRef = useRef(0)

  useEffect(() => {
    return () => {
      audioContextRef.current?.close()
      audioContextRef.current = null
    }
  }, [])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (activePointerRef.current !== null) return
      if (e.pointerType === 'touch' && !e.isPrimary) return
      draggingRef.current = true
      activePointerRef.current = e.pointerId
      pointerTypeRef.current = e.pointerType
      surfaceWidthRef.current = e.currentTarget.getBoundingClientRect().width
      setIsDragging(true)
      lastClientXRef.current = e.clientX
      lastTimeRef.current = performance.now()
      if (clickSound && !audioContextRef.current) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as {webkitAudioContext: typeof AudioContext})
            .webkitAudioContext
        if (Ctor) audioContextRef.current = new Ctor()
      }
      if (audioContextRef.current) {
        lastClickIndexRef.current = Math.floor(
          rotationRef.current / TICK_RESOLUTION
        )
      }
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    },
    [clickSound]
  )

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    if (activePointerRef.current !== e.pointerId) return
    const now = performance.now()
    const dt = (now - lastTimeRef.current) / 1000
    const dx = e.clientX - lastClientXRef.current
    lastClientXRef.current = e.clientX
    lastTimeRef.current = now

    const rotDelta =
      dx * pointerSensitivity(pointerTypeRef.current, surfaceWidthRef.current)
    rotationRef.current += rotDelta
    if (dt > 0) {
      const v = rotDelta / dt
      velocityRef.current = Number.isFinite(v)
        ? Math.max(-4.5, Math.min(4.5, v))
        : 0
    }
  }, [])

  const onPointerEnd = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== e.pointerId) return
    draggingRef.current = false
    activePointerRef.current = null
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  return (
    <div
      className={`w-full [touch-action:pan-y_pinch-zoom] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{height, background: backgroundColor}}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <Canvas
        camera={{fov: 32, position: [0, 1.5, 8], near: 0.1, far: 100}}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({gl, camera}) => {
          gl.setClearColor(backgroundColor)
          camera.lookAt(0, 0.75, 0)
        }}
        performance={{min: 0.5}}
        style={{width: '100%', height: '100%'}}
      >
        <Suspense fallback={null}>
          <directionalLight
            color='#FFFFFF'
            intensity={0.5}
            position={[0, 15, 10]}
          />
          <directionalLight
            color='#FFFFFF'
            intensity={0.2}
            position={[0, 5, 15]}
          />
          <GlobeGroup
            cities={cities}
            enableRotation
            isDragging={isDragging}
            idleRotation={idleRotation}
            rotationRef={rotationRef}
            velocityRef={velocityRef}
            audioContextRef={audioContextRef}
            lastClickIndexRef={lastClickIndexRef}
            lastClickTimeRef={lastClickTimeRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
