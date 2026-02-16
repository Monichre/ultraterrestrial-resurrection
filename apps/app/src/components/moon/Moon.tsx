'use client'

import {PerspectiveCamera, useGLTF} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {Bloom, EffectComposer, TiltShift2} from '@react-three/postprocessing'
import {Suspense, useRef, useMemo} from 'react'
import * as THREE from 'three'

useGLTF.preload('/assets/moon/moon.glb')

const shaderMaterial = {
  vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
  fragmentShader: `
		uniform float t;
		uniform vec2 r;
		varying vec2 vUv;
		
		mat3 rotate3D(float angle, vec3 axis) {
			vec3 a = normalize(axis);
			float s = sin(angle);
			float c = cos(angle);
			float oc = 1.0 - c;
			return mat3(
				oc * a.x * a.x + c,        oc * a.x * a.y - a.z * s,  oc * a.z * a.x + a.y * s,
				oc * a.x * a.y + a.z * s,  oc * a.y * a.y + c,        oc * a.y * a.z - a.x * s,
				oc * a.z * a.x - a.y * s,  oc * a.y * a.z + a.x * s,  oc * a.z * a.z + c
			);
		}
		
		void main() {
			vec2 FC = vUv * r;
			float o = 0.0;
			float i = 0.0;
			float d = 0.0;
			float s = 0.0;
			float l = 0.0;
			float b = 0.0;
			
			for(int iter = 0; iter < 100; iter++) {
				vec3 p = (FC.rgb * 2.0 - vec3(r.x, r.y, r.y)) / r.y * d * 0.5;
				p.z += 2.0;
				p *= rotate3D(t * 0.3, vec3(FC.x, 0.0, FC.y));
				s = length(p) - 1.0;
				
				for(b = 1.0, l = 1.0; l < 60.0; l *= 1.4) {
					b += s += cos(length(cos(p * l + l)) * l * 0.2) / l * 0.05;
				}
				
				o += (b * b / exp(s * 200.0) + (tanh(p.x / 0.2) + 1.0) / dot(p, p)) / 300.0;
				d += s * 0.4;
				i += 1.0;
			}
			
			vec3 color = vec3(o);
			gl_FragColor = vec4(color, 1.0);
		}
	`,
}

export const MoonScene = () => {
  const {nodes, materials}: any = useGLTF('/assets/moon/moon.glb')

  const meshRef = useRef<THREE.Mesh>(null)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      t: {value: 0},
      r: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    }),
    []
  )

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta / 10
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.t.value = state.clock.elapsedTime
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={nodes['Sphere001_Material_#39_0'].geometry} scale={0.04}>
        <shaderMaterial
          ref={shaderRef}
          attach='material'
          args={[
            {
              uniforms,
              vertexShader: shaderMaterial.vertexShader,
              fragmentShader: shaderMaterial.fragmentShader,
            },
          ]}
        />
      </mesh>
      <group>
        <spotLight position={[10, 0, -10]} intensity={1.75} angle={0.15} penumbra={1} />
      </group>
    </group>
  )
}

// Start of Selection
export const Moon = () => {
  return (
    <div
      className='h-[60vh] w-[60vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      id='moon-canvas'>
      <Canvas gl={{antialias: false}}>
        {/* <color attach='background' args={['#101015']} /> */}
        <PerspectiveCamera makeDefault position={[0, -0.5, 5]} fov={50} />
        <ambientLight intensity={0.01} />
        <directionalLight intensity={5} position={[1, 5, -2]} />
        <Suspense fallback={null}>
          <MoonScene />
        </Suspense>
        <EffectComposer enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.5} />
          <TiltShift2 blur={0.35} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
