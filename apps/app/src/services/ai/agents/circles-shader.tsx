"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function AnimatedMaterial() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float len = length(p);
      float angle = atan(p.y, p.x);
      
      float circle1 = smoothstep(0.3, 0.25, abs(len - 0.5 - sin(time * 0.5) * 0.2));
      float circle2 = smoothstep(0.3, 0.25, abs(len - 0.7 - cos(time * 0.3) * 0.2));
      float circle3 = smoothstep(0.3, 0.25, abs(len - 0.9 - sin(time * 0.7) * 0.2));
      
      vec3 color1 = vec3(0.5, 0.2, 0.8) * circle1;
      vec3 color2 = vec3(0.2, 0.5, 0.9) * circle2;
      vec3 color3 = vec3(0.8, 0.3, 0.5) * circle3;
      
      vec3 finalColor = color1 + color2 + color3;
      
      gl_FragColor = vec4(finalColor * 0.3, 1.0);
    }
  `

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        time: { value: 0 },
      }}
      transparent={true}
    />
  )
}

function Scene() {
  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <AnimatedMaterial />
    </mesh>
  )
}

export default function CirclesShader() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
