'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {vertexShader} from './shaders/vertexShader'
import {fragmentShader} from './shaders/fragmentShader'

interface ParticleSystemProps {
  width?: number
  height?: number
  particleCount?: number
}

export const ParticleSystem = ({
  width = 800,
  height = 600,
  particleCount = 5000,
}: ParticleSystemProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Positions (random within a sphere)
      const radius = 3 * Math.pow(Math.random(), 1 / 3)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) // x
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) // y
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) // z

      // Sizes (random)
      particleSizes[i] = Math.random() * 0.5 + 0.5

      // Colors (based on position)
      particleColors[i * 3] = 0.5 + particlePositions[i * 3] / 6 // r
      particleColors[i * 3 + 1] = 0.5 + particlePositions[i * 3 + 1] / 6 // g
      particleColors[i * 3 + 2] = 0.5 + particlePositions[i * 3 + 2] / 6 // b
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(particleSizes, 1))
    particlesGeometry.setAttribute('aColor', new THREE.BufferAttribute(particleColors, 3))

    // Create material with custom shaders
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Create points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update uniforms
      particlesMaterial.uniforms.uTime.value = elapsedTime

      // Rotate particles gently
      particles.rotation.y = elapsedTime * 0.05
      particles.rotation.x = elapsedTime * 0.03

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
      particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener('resize', handleResize)

      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [width, height, particleCount])

  return <div ref={containerRef} style={{width: '100%', height: '100%'}} />
}

export default ParticleSystem
