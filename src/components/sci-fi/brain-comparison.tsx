"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

export function BrainComparison() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create multiple brain instances
    const createBrain = (position: THREE.Vector3, scale = 1) => {
      const brainGeometry = new THREE.SphereGeometry(1, 32, 32)
      const brainMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0x88ccff) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          float noise(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
          }
          
          void main() {
            float n = noise(vPosition + time);
            float intensity = smoothstep(0.4, 0.6, n);
            
            vec3 glow = color * intensity;
            float alpha = intensity * 0.8;
            
            gl_FragColor = vec4(glow, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

      const brain = new THREE.Mesh(brainGeometry, brainMaterial)
      brain.position.copy(position)
      brain.scale.setScalar(scale)
      scene.add(brain)
      return { mesh: brain, material: brainMaterial }
    }

    // Create two brains
    const brain1 = createBrain(new THREE.Vector3(-1.5, 0, 0), 0.8)
    const brain2 = createBrain(new THREE.Vector3(1.5, 0, 0), 0.8)

    // Post processing
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    composer.addPass(bloomPass)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)

      time += 0.005
      brain1.mesh.rotation.y += 0.001
      brain2.mesh.rotation.y -= 0.001

      brain1.material.uniforms.time.value = time
      brain2.material.uniforms.time.value = time + 1

      composer.render()
    }
    animate()

    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement)
      scene.remove(brain1.mesh)
      scene.remove(brain2.mesh)
      brain1.mesh.geometry.dispose()
      brain1.material.dispose()
      brain2.mesh.geometry.dispose()
      brain2.material.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />
}

