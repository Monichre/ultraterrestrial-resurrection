'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {vertexShader} from './shaders/vertexShader'
import {fragmentShader} from './shaders/fragmentShader'

interface WaveEffectProps {
  width?: number
  height?: number
}

export const WaveEffect = ({width = 800, height = 600}: WaveEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 1.5

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create geometry
    const geometry = new THREE.PlaneGeometry(2, 2, 128, 128)

    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uColorA: {value: new THREE.Color('#4f4cb0')},
        uColorB: {value: new THREE.Color('#00ffff')},
      },
    })

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update uniforms
      material.uniforms.uTime.value = elapsedTime

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
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener('resize', handleResize)

      geometry.dispose()
      material.dispose()
    }
  }, [width, height])

  return <div ref={containerRef} style={{width: '100%', height: '100%'}} />
}

export default WaveEffect
