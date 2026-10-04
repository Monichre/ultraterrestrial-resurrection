"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

export function Visualization() {
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

    // Brain geometry
    const brainGeometry = new THREE.SphereGeometry(2, 32, 32)
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
    scene.add(brain)

    // Neural network effect
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 1000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      sizes[i] = Math.random() * 0.1
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: new THREE.TextureLoader().load("/glow.png") },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vPosition = position;
          vec3 pos = position;
          pos.x += sin(time + position.z) * 0.1;
          pos.y += cos(time + position.x) * 0.1;
          pos.z += sin(time + position.y) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vPosition;
        
        void main() {
          vec4 color = vec4(0.5, 0.8, 1.0, 1.0);
          color.a = texture2D(pointTexture, gl_PointCoord).a;
          gl_FragColor = color;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Post processing - SIMPLIFIED to fix the error
    const renderScene = new RenderPass(scene, camera)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      1.5,
      0.4,
      0.85,
    )

    // Create composer with the renderer
    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    // Remove BokehPass as it's likely causing the issue

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)

      time += 0.005
      brain.rotation.y += 0.001
      particles.rotation.y += 0.0005

      brainMaterial.uniforms.time.value = time
      particlesMaterial.uniforms.time.value = time

      // Render the scene
      composer.render()
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      composer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      scene.remove(brain)
      scene.remove(particles)
      brainGeometry.dispose()
      brainMaterial.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
      composer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />
}

