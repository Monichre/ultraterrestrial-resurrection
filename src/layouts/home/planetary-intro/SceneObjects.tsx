"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { forwardRef, memo, useMemo, useRef } from "react"
import * as THREE from "three"
import { TextureLoader } from "three/src/loaders/TextureLoader"

// ---------------------------------------------------------------------------
// Atmosphere fresnel shader — additive rim glow that fakes scattering
// ---------------------------------------------------------------------------
const ATMO_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const ATMO_FRAGMENT = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fres = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fres = pow(fres, 2.4);
    float pulse = 0.85 + 0.15 * sin(uTime * 0.6);
    vec3 col = uColor * fres * pulse * uIntensity;
    gl_FragColor = vec4(col, fres * uIntensity);
  }
`

export type PlanetHandle = {
  group: THREE.Group
  mesh: THREE.Mesh
  atmoUniforms: {
    uIntensity: { value: number }
    uTime: { value: number }
    uColor: { value: THREE.Color }
  }
}

type PlanetProps = {
  spinSpeed?: number
}

export const Planet = memo(
  forwardRef<PlanetHandle, PlanetProps>(({ spinSpeed = 0.04 }, ref) => {
    const groupRef = useRef<THREE.Group>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)

    const [color, normal, aoMap] = useLoader(TextureLoader, [
      "/assets/earth2/color.jpg",
      "/assets/earth2/normal.png",
      "/assets/earth2/occlusion.jpg",
    ]) as THREE.Texture[]

    // sRGB so the diffuse reads correctly
    color.colorSpace = THREE.SRGBColorSpace

    const atmoUniforms = useMemo(
      () => ({
        uIntensity: { value: 0 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#5fb8ff") },
      }),
      []
    )

    // Expose imperative handle for the GSAP timeline
    if (typeof ref === "function") {
      // noop — we set via effect below in parent if needed
    }

    useFrame((_, delta) => {
      if (meshRef.current) meshRef.current.rotation.y += delta * spinSpeed
      atmoUniforms.uTime.value += delta
    })

    // Wire the imperative handle once meshes mount
    const setHandle = (g: THREE.Group | null) => {
      groupRef.current = g!
      if (!ref || !g || !meshRef.current) return
      const handle: PlanetHandle = {
        group: g,
        mesh: meshRef.current,
        atmoUniforms,
      }
      if (typeof ref === "function") ref(handle)
      else (ref as React.MutableRefObject<PlanetHandle | null>).current = handle
    }

    return (
      <group ref={setHandle} scale={0.001}>
        {/* Earth body */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial
            map={color}
            normalMap={normal}
            aoMap={aoMap}
            roughness={0.92}
            metalness={0.05}
          />
        </mesh>

        {/* Atmosphere shell */}
        <mesh scale={1.06}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            vertexShader={ATMO_VERTEX}
            fragmentShader={ATMO_FRAGMENT}
            uniforms={atmoUniforms}
          />
        </mesh>

        {/* Outer haze */}
        <mesh scale={1.18}>
          <sphereGeometry args={[1, 48, 48]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            vertexShader={ATMO_VERTEX}
            fragmentShader={ATMO_FRAGMENT}
            uniforms={atmoUniforms}
          />
        </mesh>
      </group>
    )
  })
)
Planet.displayName = "Planet"

// ---------------------------------------------------------------------------
// MoonOrbit — GLB moon on a pivot group; the pivot is what we animate
// ---------------------------------------------------------------------------
useGLTF.preload("/assets/moon/moon.glb")

export type MoonHandle = {
  pivot: THREE.Group
  material: THREE.MeshStandardMaterial
}

export const MoonOrbit = memo(
  forwardRef<MoonHandle, {}>((_, ref) => {
    const pivotRef = useRef<THREE.Group>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)
    const matRef = useRef<THREE.MeshStandardMaterial>(null!)

    const { nodes }: any = useGLTF("/assets/moon/moon.glb")
    const geometry: THREE.BufferGeometry =
      nodes["Sphere001_Material_#39_0"].geometry

    useFrame((_, delta) => {
      if (meshRef.current) meshRef.current.rotation.y += delta * 0.05
    })

    const setHandle = (g: THREE.Group | null) => {
      pivotRef.current = g!
      if (!ref || !g || !matRef.current) return
      const handle: MoonHandle = { pivot: g, material: matRef.current }
      if (typeof ref === "function") ref(handle)
      else (ref as React.MutableRefObject<MoonHandle | null>).current = handle
    }

    return (
      <group ref={setHandle}>
        {/* Offset along x = orbital radius */}
        <mesh ref={meshRef} geometry={geometry} position={[3.6, 0.4, -0.6]} scale={0.012}>
          <meshStandardMaterial
            ref={matRef}
            color="#cfcfd2"
            roughness={1}
            metalness={0}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    )
  })
)
MoonOrbit.displayName = "MoonOrbit"

// ---------------------------------------------------------------------------
// StarField — additive points, slight twinkle via size attenuation
// ---------------------------------------------------------------------------
export const StarField = memo(({ count = 4000 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null!)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere shell
      const r = 40 + Math.random() * 60
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = Math.random() * 1.2 + 0.2
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    return g
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.005
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
})
StarField.displayName = "StarField"
