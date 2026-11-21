'use client'

import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import * as THREE from 'three'

export type OrbProps = {
  color?: string
  size?: number
  className?: string
}

function useClockUniform() {
  const timeRef = useRef<number>(0)
  const uniforms = useMemo(
    () => ({
      u_time: {value: 0},
    }),
    []
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    uniforms.u_time.value = timeRef.current as number
  })

  return uniforms as {u_time: {value: number}}
}

function CommonCanvas({children}: {children: React.ReactNode}) {
  return (
    <Canvas camera={{position: [0, 0, 3.5], fov: 45}}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 6, 8]} intensity={1.2} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      {children}
    </Canvas>
  )
}

// 1) EnergyPulseOrb — glossy core + rim-fresnel + breathing pulse
export function EnergyPulseOrb({color = '#65A9FF', size = 1.1, className = ''}: OrbProps) {
  const uniforms = useClockUniform()
  const material = useMemo(() => {
    const vertex = `
varying vec3 vNormal;
varying vec3 vWorldPos;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}`

    const fragment = `
uniform float u_time;
uniform vec3 u_color;
varying vec3 vNormal;
varying vec3 vWorldPos;

float fresnel(vec3 normal, vec3 viewDir){
  return pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
}

void main(){
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float rim = fresnel(normalize(vNormal), viewDir);
  float pulse = 0.55 + 0.45 * sin(u_time * 2.2);
  vec3 base = u_color * (0.25 + 0.35 * pulse);
  vec3 glow = u_color * (1.2 * rim);
  vec3 color = base + glow;
  gl_FragColor = vec4(color, 0.95);
}`

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        u_time: uniforms.u_time,
        u_color: {value: new THREE.Color(color)},
      },
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return mat
  }, [uniforms.u_time, color])

  return (
    <div className={`relative w-full h-full min-h-[220px] ${className}`}>
      <CommonCanvas>
        <mesh>
          <sphereGeometry args={[size, 96, 96]} />
          <primitive object={material} attach='material' />
        </mesh>
      </CommonCanvas>
    </div>
  )
}

// 2) LatticeOrb — animated longitude/latitude grid with subtle emissive
export function LatticeOrb({color = '#1B55B6', size = 1.1, className = ''}: OrbProps) {
  const uniforms = useClockUniform()
  const material = useMemo(() => {
    const vertex = `
varying vec3 vPos;
varying vec2 vUv;
void main(){
  vPos = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

    const fragment = `
uniform float u_time;
uniform vec3 u_color;
varying vec2 vUv;

float line(float v, float width){
  float a = smoothstep(0.5 - width, 0.5, abs(fract(v) - 0.5));
  return 1.0 - a;
}

void main(){
  float lat = vUv.y * 20.0 + u_time * 0.3; // latitude rings
  float lon = vUv.x * 20.0 - u_time * 0.25; // longitude rings
  float grid = max(line(lat, 0.06), line(lon, 0.06));
  vec3 base = u_color * 0.15;
  vec3 lines = u_color * (0.9 * grid);
  vec3 color = base + lines;
  gl_FragColor = vec4(color, 0.95);
}`

    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {u_time: uniforms.u_time, u_color: {value: new THREE.Color(color)}},
      depthWrite: false,
    })
  }, [uniforms.u_time, color])

  return (
    <div className={`relative w-full h-full min-h-[220px] ${className}`}>
      <CommonCanvas>
        <mesh>
          <sphereGeometry args={[size, 96, 96]} />
          <primitive object={material} attach='material' />
        </mesh>
      </CommonCanvas>
    </div>
  )
}

// 3) AuroraOrb — flowing color bands simulating aurora using trigonometric distortions
export function AuroraOrb({color = '#FF3D6E', size = 1.1, className = ''}: OrbProps) {
  const uniforms = useClockUniform()
  const material = useMemo(() => {
    const vertex = `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position,1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}`

    const fragment = `
uniform float u_time;
uniform vec3 u_color;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main(){
  // Compute spherical coordinates from position
  float r = length(vWorldPos);
  float theta = atan(vWorldPos.y, vWorldPos.x);
  float phi = acos(vWorldPos.z / r);

  float wave = sin(phi * 6.0 + u_time * 1.4) * 0.5 + 0.5;
  float wave2 = sin(theta * 4.0 - u_time * 1.1) * 0.5 + 0.5;
  float band = smoothstep(0.35, 0.65, (wave * 0.6 + wave2 * 0.4));

  vec3 aurora = mix(vec3(0.05,0.12,0.2), u_color, band);
  float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(cameraPosition - vWorldPos)), 0.0), 3.0);
  vec3 color = aurora + u_color * rim * 0.9;
  gl_FragColor = vec4(color, 0.9);
}`

    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {u_time: uniforms.u_time, u_color: {value: new THREE.Color(color)}},
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [uniforms.u_time, color])

  return (
    <div className={`relative w-full h-full min-h-[220px] ${className}`}>
      <CommonCanvas>
        <mesh>
          <sphereGeometry args={[size, 96, 96]} />
          <primitive object={material} attach='material' />
        </mesh>
      </CommonCanvas>
    </div>
  )
}

export function OrbsShowcase() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-6 bg-black/60 rounded-xl'>
      <div className='h-[320px]'>
        <EnergyPulseOrb />
      </div>
      <div className='h-[320px]'>
        <LatticeOrb />
      </div>
      <div className='h-[320px]'>
        <AuroraOrb />
      </div>
    </div>
  )
}
